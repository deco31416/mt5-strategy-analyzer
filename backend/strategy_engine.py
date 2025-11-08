import MetaTrader5 as mt5
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict
from strategy_templates import generate_code_and_explanation
from database import db
from openai_analyzer import ai_analyzer

def analyze_trades():
    # Asumir que MT5 ya está inicializado y corriendo
    if not mt5.initialize():
        return {"error": "MT5 no está inicializado. Asegúrate de que MT5 esté abierto y conectado."}

    positions = mt5.positions_get()
    if not positions:
        mt5.shutdown()
        return {"summary": {"strategy": "Sin operaciones", "strategy_description": "No hay posiciones abiertas", "timeframe": "N/A", "indicators": [], "explanation": "Sin operaciones activas en la cuenta"}, "trades": []}

    df = pd.DataFrame([p._asdict() for p in positions])
    df["type"] = df["type"].map({0: "BUY", 1: "SELL"})
    df["time"] = pd.to_datetime(df["time"], unit="s")

    # ====== NUEVO: Análisis histórico completo ======
    historical_metrics = analyze_historical_data()
    session_analysis = analyze_trading_sessions(historical_metrics.get("deals_df"))
    schedule_analysis = analyze_trading_schedule(historical_metrics.get("deals_df"))
    risk_analysis = analyze_risk_management(historical_metrics.get("deals_df"))
    symbol_analysis = analyze_symbols_performance(historical_metrics.get("deals_df"))
    
    # Métricas avanzadas
    advanced_metrics = calculate_advanced_metrics(df)
    strategy = detect_strategy(df)
    
    # Información de cuenta
    account_info = mt5.account_info()
    
    stats = {
        "total_trades": len(df),
        "net_profit": float(df["profit"].sum()),
        "avg_profit": float(df["profit"].mean()),
        "win_rate": advanced_metrics["win_rate"],
        "profit_factor": advanced_metrics["profit_factor"],
        "max_drawdown": advanced_metrics["max_drawdown"],
        "sharpe_ratio": advanced_metrics["sharpe_ratio"],
        "strategy": strategy["name"],
        "strategy_description": strategy["description"],
        "timeframe": strategy["timeframe"],
        "indicators": strategy["indicators"],
        "explanation": strategy["explanation"],
        "account_balance": float(account_info.balance) if account_info else 0.0,
        "account_equity": float(account_info.equity) if account_info else 0.0,
        "last_update": datetime.utcnow().isoformat(),
        
        # Nuevos datos históricos (con defaults seguros)
        "historical_total_trades": int(historical_metrics.get("total_trades", 0)),
        "historical_win_rate": float(historical_metrics.get("win_rate", 0.0)),
        "historical_profit": float(historical_metrics.get("total_profit", 0.0)),
        "best_trade": float(historical_metrics.get("best_trade", 0.0)),
        "worst_trade": float(historical_metrics.get("worst_trade", 0.0)),
        "longest_win_streak": int(historical_metrics.get("longest_win_streak", 0)),
        "longest_loss_streak": int(historical_metrics.get("longest_loss_streak", 0)),
        "avg_trade_duration": float(historical_metrics.get("avg_duration_minutes", 0.0)),
        
        # Análisis por sesiones
        "best_session": session_analysis.get("best_session", "N/A"),
        "worst_session": session_analysis.get("worst_session", "N/A"),
        
        # Análisis de horario
        "best_hour": schedule_analysis.get("best_hour", "N/A"),
        "best_day": schedule_analysis.get("best_day", "N/A"),
        
        # Gestión de riesgo
        "avg_risk_reward": float(risk_analysis.get("avg_rr", 0.0)),
        "risk_per_trade": float(risk_analysis.get("avg_risk_percent", 0.0)),
        
        # Por símbolos
        "best_symbol": symbol_analysis.get("best_symbol", "N/A"),
        "worst_symbol": symbol_analysis.get("worst_symbol", "N/A"),
    }

    trades = df[["ticket", "symbol", "type", "volume", "price_open", "profit", "time"]].to_dict(orient="records")
    result = {
        "summary": stats, 
        "trades": trades,
        "historical_metrics": historical_metrics,
        "session_analysis": session_analysis,
        "schedule_analysis": schedule_analysis,
        "risk_analysis": risk_analysis,
        "symbol_analysis": symbol_analysis
    }
    
    # ====== NUEVO: Análisis con IA ======
    ai_analysis = ai_analyzer.analyze_strategy_with_ai(result)
    
    # Sobrescribir nombre y descripción con análisis IA
    if ai_analysis.get("ai_powered"):
        stats["strategy"] = ai_analysis["strategy_name"]
        stats["strategy_description"] = ai_analysis["strategy_description"]
        stats["indicators"] = ai_analysis["indicators_detected"]
        stats["trading_style"] = ai_analysis.get("trading_style", "")
        stats["risk_profile"] = ai_analysis.get("risk_profile", "")
        
        result["ai_analysis"] = ai_analysis
    
    # Guardar en base de datos
    try:
        analysis_id = db.save_analysis(result)
        print(f"✅ Análisis guardado en DB con ID: {analysis_id}")
        
        # Detectar alertas
        detect_alerts(stats, df)
    except Exception as e:
        print(f"⚠️ Error guardando en DB: {e}")
    
    mt5.shutdown()
    return result

def calculate_advanced_metrics(df: pd.DataFrame) -> dict:
    """Calcula métricas avanzadas de trading"""
    if df.empty:
        return {
            "win_rate": 0,
            "profit_factor": 0,
            "max_drawdown": 0,
            "sharpe_ratio": 0
        }
    
    # Win Rate
    wins = (df["profit"] > 0).sum()
    win_rate = (wins / len(df)) * 100 if len(df) > 0 else 0
    
    # Profit Factor
    total_wins = df[df["profit"] > 0]["profit"].sum()
    total_losses = abs(df[df["profit"] < 0]["profit"].sum())
    profit_factor = total_wins / total_losses if total_losses > 0 else 0
    
    # Max Drawdown (aproximado basado en profits acumulados)
    cumulative = df["profit"].cumsum()
    running_max = cumulative.cummax()
    drawdown = running_max - cumulative
    max_drawdown = drawdown.max() if not drawdown.empty else 0
    
    # Sharpe Ratio (aproximado)
    returns = df["profit"]
    sharpe_ratio = (returns.mean() / returns.std()) if returns.std() > 0 else 0
    
    return {
        "win_rate": float(win_rate),
        "profit_factor": float(profit_factor),
        "max_drawdown": float(max_drawdown),
        "sharpe_ratio": float(sharpe_ratio)
    }

def detect_alerts(stats: dict, df: pd.DataFrame):
    """Detecta condiciones importantes y crea alertas"""
    
    # Alerta de pérdidas consecutivas
    consecutive_losses = 0
    max_consecutive_losses = 0
    for profit in df["profit"]:
        if profit < 0:
            consecutive_losses += 1
            max_consecutive_losses = max(max_consecutive_losses, consecutive_losses)
        else:
            consecutive_losses = 0
    
    if max_consecutive_losses >= 3:
        db.create_alert(
            "consecutive_losses",
            "warning",
            f"Detectadas {max_consecutive_losses} pérdidas consecutivas",
            {"count": max_consecutive_losses}
        )
    
    # Alerta de drawdown alto
    if stats["max_drawdown"] > 1000:
        db.create_alert(
            "high_drawdown",
            "critical",
            f"Drawdown alto detectado: ${stats['max_drawdown']:.2f}",
            {"drawdown": stats["max_drawdown"]}
        )
    
    # Alerta de profit factor bajo
    if stats["profit_factor"] < 1:
        db.create_alert(
            "low_profit_factor",
            "warning",
            f"Profit Factor bajo: {stats['profit_factor']:.2f}",
            {"profit_factor": stats["profit_factor"]}
        )

def detect_strategy(df: pd.DataFrame) -> dict:
    if df.empty:
        return {
            "name": "No Trades",
            "description": "No hay posiciones abiertas para analizar",
            "timeframe": "N/A",
            "indicators": [],
            "explanation": "Sin operaciones activas en la cuenta"
        }
    
    symbols = df["symbol"].unique()
    buy_ratio = (df["type"] == "BUY").mean()
    sell_ratio = (df["type"] == "SELL").mean()
    duplicated = df.duplicated(subset=["symbol", "price_open"]).sum()
    avg_volume = df["volume"].mean()
    profit_std = df["profit"].std()
    time_diffs = df["time"].diff().dt.total_seconds().dropna()
    avg_time_between_trades = time_diffs.mean() if not time_diffs.empty else 0
    
    # Infer timeframe based on time between trades (rough estimate)
    if avg_time_between_trades < 300:  # < 5 min
        timeframe = "M1-M5"
    elif avg_time_between_trades < 3600:  # < 1 hour
        timeframe = "M15-H1"
    elif avg_time_between_trades < 86400:  # < 1 day
        timeframe = "H4-D1"
    else:
        timeframe = "D1+"
    
    if duplicated > 1 and len(symbols) == 1:
        return {
            "name": "Grid/Scalping",
            "description": "Estrategia de grid o scalping con múltiples posiciones en el mismo precio",
            "timeframe": timeframe,
            "indicators": ["Support/Resistance levels", "Moving Averages", "Bollinger Bands"],
            "explanation": f"Detectado {duplicated} posiciones duplicadas en {symbols[0]}. Esta estrategia coloca órdenes en niveles de soporte/resistencia para capturar movimientos pequeños del precio."
        }
    elif buy_ratio > 0.9:
        return {
            "name": "Trend Following (Long Bias)",
            "description": "Seguimiento de tendencia alcista",
            "timeframe": timeframe,
            "indicators": ["Moving Averages (50, 200)", "MACD", "ADX"],
            "explanation": f"{(buy_ratio*100):.1f}% de posiciones son BUY. La estrategia sigue tendencias alcistas usando indicadores de momentum."
        }
    elif sell_ratio > 0.9:
        return {
            "name": "Trend Following (Short Bias)",
            "description": "Seguimiento de tendencia bajista",
            "timeframe": timeframe,
            "indicators": ["Moving Averages (50, 200)", "MACD", "ADX"],
            "explanation": f"{(sell_ratio*100):.1f}% de posiciones son SELL. La estrategia sigue tendencias bajistas usando indicadores de momentum."
        }
    elif len(symbols) == 1 and df["type"].nunique() == 2:
        return {
            "name": "Hedge Strategy",
            "description": "Estrategia de cobertura con posiciones opuestas",
            "timeframe": timeframe,
            "indicators": ["Correlation analysis", "Volatility indicators"],
            "explanation": f"Posiciones BUY y SELL en {symbols[0]}. Esta estrategia reduce riesgo mediante cobertura de posiciones opuestas."
        }
    elif profit_std > 5 and avg_volume > 0.2:
        return {
            "name": "Martingale / Averaging",
            "description": "Estrategia de martingala o promediado",
            "timeframe": timeframe,
            "indicators": ["Risk management tools", "Position sizing"],
            "explanation": f"Alta volatilidad en profits (std: {profit_std:.2f}) y volumen promedio {avg_volume:.2f}. Esta estrategia aumenta posiciones en pérdidas para recuperar."
        }
    else:
        return {
            "name": "Mixed / Adaptive",
            "description": "Estrategia mixta o adaptativa",
            "timeframe": timeframe,
            "indicators": ["Multiple indicators", "Market conditions"],
            "explanation": "Patrón no claramente identificado. Puede ser una estrategia adaptativa que combina múltiples enfoques."
        }


# ===============================================================
#  NUEVAS FUNCIONES: Análisis Histórico Completo
# ===============================================================

def analyze_historical_data(days_back: int = 90) -> Dict:
    """
    Analiza el historial completo de trades cerrados en MT5
    """
    try:
        # Obtener deals (ejecuciones) del historial
        from_date = datetime.now() - timedelta(days=days_back)
        to_date = datetime.now()
        
        deals = mt5.history_deals_get(from_date, to_date)
        
        if not deals or len(deals) == 0:
            return {
                "total_trades": 0,
                "win_rate": 0,
                "total_profit": 0,
                "best_trade": 0,
                "worst_trade": 0,
                "longest_win_streak": 0,
                "longest_loss_streak": 0,
                "avg_duration_minutes": 0,
                "deals_df": None
            }
        
        # Convertir a DataFrame
        deals_df = pd.DataFrame([d._asdict() for d in deals])
        deals_df["time"] = pd.to_datetime(deals_df["time"], unit="s")
        
        # Filtrar solo deals de cierre (entry = 1 significa salida/cierre)
        closed_trades = deals_df[deals_df["entry"] == 1].copy()
        
        if len(closed_trades) == 0:
            return {
                "total_trades": 0,
                "win_rate": 0,
                "total_profit": 0,
                "deals_df": deals_df
            }
        
        # Calcular métricas
        total_trades = len(closed_trades)
        wins = (closed_trades["profit"] > 0).sum()
        win_rate = (wins / total_trades * 100) if total_trades > 0 else 0
        total_profit = closed_trades["profit"].sum()
        best_trade = closed_trades["profit"].max()
        worst_trade = closed_trades["profit"].min()
        
        # Calcular rachas
        closed_trades = closed_trades.sort_values("time")
        closed_trades["is_win"] = closed_trades["profit"] > 0
        
        win_streak = 0
        loss_streak = 0
        longest_win_streak = 0
        longest_loss_streak = 0
        
        for is_win in closed_trades["is_win"]:
            if is_win:
                win_streak += 1
                loss_streak = 0
                longest_win_streak = max(longest_win_streak, win_streak)
            else:
                loss_streak += 1
                win_streak = 0
                longest_loss_streak = max(longest_loss_streak, loss_streak)
        
        # Calcular duración promedio (simplificado)
        avg_duration = 0
        if len(deals_df) > 1:
            time_diffs = deals_df["time"].diff().dt.total_seconds().dropna() / 60
            avg_duration = time_diffs.mean() if len(time_diffs) > 0 else 0
        
        return {
            "total_trades": int(total_trades),
            "wins": int(wins),
            "losses": int(total_trades - wins),
            "win_rate": float(win_rate),
            "total_profit": float(total_profit),
            "best_trade": float(best_trade),
            "worst_trade": float(worst_trade),
            "longest_win_streak": int(longest_win_streak),
            "longest_loss_streak": int(longest_loss_streak),
            "avg_duration_minutes": float(avg_duration),
            "deals_df": deals_df,
            "closed_trades_df": closed_trades
        }
        
    except Exception as e:
        print(f"⚠️ Error en análisis histórico: {e}")
        return {
            "total_trades": 0,
            "win_rate": 0,
            "total_profit": 0,
            "deals_df": None,
            "error": str(e)
        }


def analyze_trading_sessions(deals_df) -> Dict:
    """
    Analiza performance por sesión de trading (Asian, London, NY)
    """
    if deals_df is None or len(deals_df) == 0:
        return {
            "best_session": "N/A",
            "worst_session": "N/A",
            "sessions": {}
        }
    
    try:
        df = deals_df.copy()
        df["hour"] = df["time"].dt.hour
        
        # Definir sesiones (hora GMT)
        def get_session(hour):
            if 0 <= hour < 8:
                return "Asian"
            elif 8 <= hour < 16:
                return "London"
            elif 16 <= hour < 24:
                return "New York"
            return "Unknown"
        
        df["session"] = df["hour"].apply(get_session)
        
        # Agrupar por sesión
        session_stats = df.groupby("session")["profit"].agg([
            ("total_profit", "sum"),
            ("avg_profit", "mean"),
            ("trade_count", "count")
        ]).to_dict(orient="index")
        
        # Encontrar mejor y peor sesión
        best_session = max(session_stats.items(), key=lambda x: x[1]["total_profit"])[0]
        worst_session = min(session_stats.items(), key=lambda x: x[1]["total_profit"])[0]
        
        return {
            "best_session": best_session,
            "worst_session": worst_session,
            "sessions": {k: {
                "total_profit": float(v["total_profit"]),
                "avg_profit": float(v["avg_profit"]),
                "trade_count": int(v["trade_count"])
            } for k, v in session_stats.items()}
        }
        
    except Exception as e:
        print(f"⚠️ Error en análisis de sesiones: {e}")
        return {"best_session": "N/A", "worst_session": "N/A", "sessions": {}}


def analyze_trading_schedule(deals_df) -> Dict:
    """
    Analiza performance por día de la semana y hora del día
    """
    if deals_df is None or len(deals_df) == 0:
        return {
            "best_hour": "N/A",
            "best_day": "N/A",
            "by_hour": {},
            "by_day": {}
        }
    
    try:
        df = deals_df.copy()
        df["hour"] = df["time"].dt.hour
        df["day_of_week"] = df["time"].dt.day_name()
        
        # Por hora
        hour_stats = df.groupby("hour")["profit"].agg([
            ("total_profit", "sum"),
            ("trade_count", "count")
        ]).to_dict(orient="index")
        
        best_hour = max(hour_stats.items(), key=lambda x: x[1]["total_profit"])[0]
        
        # Por día de la semana
        day_stats = df.groupby("day_of_week")["profit"].agg([
            ("total_profit", "sum"),
            ("trade_count", "count")
        ]).to_dict(orient="index")
        
        best_day = max(day_stats.items(), key=lambda x: x[1]["total_profit"])[0]
        
        return {
            "best_hour": int(best_hour),
            "best_day": best_day,
            "by_hour": {int(k): {
                "total_profit": float(v["total_profit"]),
                "trade_count": int(v["trade_count"])
            } for k, v in hour_stats.items()},
            "by_day": {k: {
                "total_profit": float(v["total_profit"]),
                "trade_count": int(v["trade_count"])
            } for k, v in day_stats.items()}
        }
        
    except Exception as e:
        print(f"⚠️ Error en análisis de horario: {e}")
        return {"best_hour": "N/A", "best_day": "N/A", "by_hour": {}, "by_day": {}}


def analyze_risk_management(deals_df) -> Dict:
    """
    Analiza gestión de riesgo y R:R ratio
    """
    if deals_df is None or len(deals_df) == 0:
        return {
            "avg_rr": 0,
            "avg_risk_percent": 0,
            "max_exposure": 0
        }
    
    try:
        df = deals_df.copy()
        
        # Calcular R:R aproximado (wins vs losses promedio)
        wins_df = df[df["profit"] > 0]
        losses_df = df[df["profit"] < 0]
        
        avg_win = wins_df["profit"].mean() if len(wins_df) > 0 else 0
        avg_loss = abs(losses_df["profit"].mean()) if len(losses_df) > 0 else 1
        
        avg_rr = avg_win / avg_loss if avg_loss > 0 else 0
        
        # Estimación de riesgo por trade (muy aproximado)
        avg_risk_percent = (abs(df["profit"].std()) / 10000) * 100  # Aproximación
        
        # Exposición máxima (suma de volúmenes en un momento dado)
        max_exposure = df["volume"].sum()
        
        return {
            "avg_rr": float(avg_rr),
            "avg_win": float(avg_win),
            "avg_loss": float(avg_loss),
            "avg_risk_percent": float(avg_risk_percent),
            "max_exposure": float(max_exposure)
        }
        
    except Exception as e:
        print(f"⚠️ Error en análisis de riesgo: {e}")
        return {"avg_rr": 0, "avg_risk_percent": 0, "max_exposure": 0}


def analyze_symbols_performance(deals_df) -> Dict:
    """
    Analiza performance por símbolo
    """
    if deals_df is None or len(deals_df) == 0:
        return {
            "best_symbol": "N/A",
            "worst_symbol": "N/A",
            "symbols": {}
        }
    
    try:
        df = deals_df.copy()
        
        # Agrupar por símbolo
        symbol_stats = df.groupby("symbol")["profit"].agg([
            ("total_profit", "sum"),
            ("avg_profit", "mean"),
            ("trade_count", "count"),
            ("best_trade", "max"),
            ("worst_trade", "min")
        ]).to_dict(orient="index")
        
        if len(symbol_stats) == 0:
            return {"best_symbol": "N/A", "worst_symbol": "N/A", "symbols": {}}
        
        # Encontrar mejor y peor símbolo
        best_symbol = max(symbol_stats.items(), key=lambda x: x[1]["total_profit"])[0]
        worst_symbol = min(symbol_stats.items(), key=lambda x: x[1]["total_profit"])[0]
        
        return {
            "best_symbol": best_symbol,
            "worst_symbol": worst_symbol,
            "symbols": {k: {
                "total_profit": float(v["total_profit"]),
                "avg_profit": float(v["avg_profit"]),
                "trade_count": int(v["trade_count"]),
                "best_trade": float(v["best_trade"]),
                "worst_trade": float(v["worst_trade"])
            } for k, v in symbol_stats.items()}
        }
        
    except Exception as e:
        print(f"⚠️ Error en análisis por símbolos: {e}")
        return {"best_symbol": "N/A", "worst_symbol": "N/A", "symbols": {}}