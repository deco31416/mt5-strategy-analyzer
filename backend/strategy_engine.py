import MetaTrader5 as mt5
import pandas as pd
import numpy as np
from datetime import datetime
from strategy_templates import generate_code_and_explanation
from database import db

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
        "account_balance": float(account_info.balance) if account_info else 0,
        "account_equity": float(account_info.equity) if account_info else 0,
        "last_update": datetime.utcnow().isoformat()
    }

    trades = df[["ticket", "symbol", "type", "volume", "price_open", "profit", "time"]].to_dict(orient="records")
    result = {"summary": stats, "trades": trades}
    
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