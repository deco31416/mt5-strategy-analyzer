from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
from dotenv import load_dotenv
import os

# Cargar variables de entorno ANTES de cualquier import que las use
load_dotenv()

from strategy_engine import analyze_trades
from strategy_templates import generate_code_and_explanation
from openai_analyzer import ai_analyzer
from database import db
from openai_health_check import validate_openai_or_exit

# ====== VALIDAR OPENAI AL ARRANQUE ======
openai_status = validate_openai_or_exit(allow_continue=True)

app = FastAPI()

# Obtener orígenes CORS desde .env
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")
allowed_origins = [origin.strip() for origin in cors_origins.split(",")]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Desde .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Verifica el estado del sistema incluyendo OpenAI"""
    return {
        "status": "ok",
        "openai_status": openai_status,
        "mt5_required": True,
        "database": "strategy_data.db"
    }

@app.get("/analyze")
def analyze_account():
    result = analyze_trades()
    return result

@app.get("/strategy/template")
def get_template(strategy: str = Query(...)):
    codes = generate_code_and_explanation(strategy)
    # Guardar código en DB
    try:
        db.save_strategy_code(strategy, codes)
    except Exception as e:
        print(f"Error saving strategy code: {e}")
    return codes

@app.get("/strategy/export")
def export_strategy(strategy: str = Query(...)):
    data = generate_code_and_explanation(strategy)
    os.makedirs("exports", exist_ok=True)
    filename = f"exports/{strategy.replace(' ', '_')}.mq5"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(data.get("mql5", "// Sin plantilla"))
    return FileResponse(filename, media_type="text/plain", filename=f"{strategy}.mq5")

@app.get("/history")
def get_history(limit: int = Query(50)):
    """Obtiene el historial de análisis"""
    history = db.get_analysis_history(limit)
    return {"history": history}

@app.get("/history/strategy/{strategy_name:path}")
def get_strategy_history(strategy_name: str):
    """Obtiene la evolución de una estrategia específica"""
    evolution = db.get_strategy_evolution(strategy_name)
    return {"strategy": strategy_name, "evolution": evolution}

@app.get("/alerts")
def get_alerts(limit: int = Query(10)):
    """Obtiene las últimas alertas del sistema"""
    alerts = db.get_latest_alerts(limit)
    return {"alerts": alerts}

@app.get("/statistics")
def get_statistics():
    """Obtiene estadísticas generales del sistema"""
    stats = db.get_statistics_summary()
    return stats

@app.get("/symbol/{symbol}")
def get_symbol_performance(symbol: str):
    """Obtiene el rendimiento de un símbolo específico"""
    performance = db.get_symbol_performance(symbol)
    return performance

@app.post("/backup")
def create_backup():
    """Crea un backup de la base de datos"""
    backup_path = db.backup_database()
    return {"message": "Backup creado exitosamente", "path": backup_path}


# ===============================================================
#  NUEVOS ENDPOINTS: Análisis Potenciado con IA
# ===============================================================

@app.get("/analyze/full")
def analyze_full():
    """
    Análisis completo con todas las métricas históricas y análisis IA
    Este endpoint reemplaza a /analyze cuando se quiere el análisis completo
    """
    result = analyze_trades()
    return result


@app.post("/strategy/optimize")
def optimize_strategy(strategy_data: Dict):
    """
    Optimiza parámetros de la estrategia usando IA de OpenAI
    
    Body example:
    {
        "strategy_name": "Grid Scalping",
        "strategy_description": "...",
        "current_parameters": {
            "grid_step": 50,
            "lot_size": 0.01,
            "take_profit": 30,
            "stop_loss": 100
        },
        "current_performance": {
            "win_rate": 65.5,
            "profit_factor": 1.8,
            "max_drawdown": 500,
            "total_trades": 150
        }
    }
    """
    try:
        current_performance = strategy_data.get("current_performance", {})
        optimization = ai_analyzer.optimize_parameters_with_ai(strategy_data, current_performance)
        
        # Guardar optimización en DB
        try:
            db.save_optimization(strategy_data.get("strategy_name"), optimization)
        except Exception as e:
            print(f"Error guardando optimización: {e}")
        
        return optimization
    except Exception as e:
        return {
            "error": str(e),
            "message": "Error al optimizar estrategia"
        }


class OptimizationRequest(BaseModel):
    strategy_name: str
    strategy_description: Optional[str] = ""
    current_parameters: Optional[Dict] = {}
    current_performance: Optional[Dict] = {}


@app.post("/strategy/optimize-enhanced")
def optimize_strategy_enhanced(request: OptimizationRequest):
    """
    Versión mejorada del endpoint de optimización con validación de datos
    """
    try:
        strategy_data = {
            "strategy_name": request.strategy_name,
            "strategy_description": request.strategy_description,
            "current_parameters": request.current_parameters
        }
        
        optimization = ai_analyzer.optimize_parameters_with_ai(
            strategy_data, 
            request.current_performance
        )
        
        # Guardar optimización en DB
        try:
            db.save_optimization(request.strategy_name, optimization)
        except Exception as e:
            print(f"Error guardando optimización: {e}")
        
        return optimization
    except Exception as e:
        return {
            "error": str(e),
            "message": "Error al optimizar estrategia"
        }


@app.get("/analyze/sessions")
def get_session_analysis():
    """
    Obtiene análisis detallado por sesiones de trading (Asian, London, NY)
    """
    try:
        from strategy_engine import analyze_trading_sessions, analyze_historical_data
        import MetaTrader5 as mt5
        
        if not mt5.initialize():
            return {"error": "MT5 no inicializado"}
        
        historical_data = analyze_historical_data()
        session_analysis = analyze_trading_sessions(historical_data.get("deals_df"))
        
        mt5.shutdown()
        return session_analysis
    except Exception as e:
        return {"error": str(e)}


@app.get("/analyze/schedule")
def get_schedule_analysis():
    """
    Obtiene análisis de performance por hora y día de la semana
    """
    try:
        from strategy_engine import analyze_trading_schedule, analyze_historical_data
        import MetaTrader5 as mt5
        
        if not mt5.initialize():
            return {"error": "MT5 no inicializado"}
        
        historical_data = analyze_historical_data()
        schedule_analysis = analyze_trading_schedule(historical_data.get("deals_df"))
        
        mt5.shutdown()
        return schedule_analysis
    except Exception as e:
        return {"error": str(e)}


@app.get("/analyze/risk")
def get_risk_analysis():
    """
    Obtiene análisis de gestión de riesgo
    """
    try:
        from strategy_engine import analyze_risk_management, analyze_historical_data
        import MetaTrader5 as mt5
        
        if not mt5.initialize():
            return {"error": "MT5 no inicializado"}
        
        historical_data = analyze_historical_data()
        risk_analysis = analyze_risk_management(historical_data.get("deals_df"))
        
        mt5.shutdown()
        return risk_analysis
    except Exception as e:
        return {"error": str(e)}


@app.get("/analyze/symbols")
def get_symbols_analysis():
    """
    Obtiene análisis de performance por símbolo
    """
    try:
        from strategy_engine import analyze_symbols_performance, analyze_historical_data
        import MetaTrader5 as mt5
        
        if not mt5.initialize():
            return {"error": "MT5 no inicializado"}
        
        historical_data = analyze_historical_data()
        symbols_analysis = analyze_symbols_performance(historical_data.get("deals_df"))
        
        mt5.shutdown()
        return symbols_analysis
    except Exception as e:
        return {"error": str(e)}


@app.get("/analyze/historical")
def get_historical_analysis(days_back: int = Query(90)):
    """
    Obtiene métricas históricas completas de los últimos X días
    """
    try:
        from strategy_engine import analyze_historical_data
        import MetaTrader5 as mt5
        
        if not mt5.initialize():
            return {"error": "MT5 no inicializado"}
        
        historical_data = analyze_historical_data(days_back)
        
        # Remover DataFrames del resultado (no JSON serializable)
        result = {k: v for k, v in historical_data.items() 
                 if not k.endswith("_df")}
        
        mt5.shutdown()
        return result
    except Exception as e:
        return {"error": str(e)}


@app.get("/trades/history")
def get_trades_history(limit: int = Query(100), days_back: int = Query(30)):
    """
    Obtiene el historial completo de operaciones cerradas de MT5
    """
    try:
        from strategy_engine import analyze_historical_data
        import MetaTrader5 as mt5
        
        if not mt5.initialize():
            return {"error": "MT5 no inicializado"}
        
        historical_data = analyze_historical_data(days_back)
        deals_df = historical_data.get("deals_df")
        
        if deals_df is None or len(deals_df) == 0:
            mt5.shutdown()
            return {"trades": [], "total": 0}
        
        # Filtrar solo deals de cierre y convertir a formato JSON serializable
        closed_trades = deals_df[deals_df["entry"] == 1].copy()
        closed_trades = closed_trades.sort_values("time", ascending=False)
        closed_trades = closed_trades.head(limit)
        
        # Convertir a lista de diccionarios
        trades = []
        for _, trade in closed_trades.iterrows():
            trades.append({
                "ticket": int(trade["ticket"]),
                "symbol": str(trade["symbol"]),
                "type": "BUY" if trade["type"] == 0 else "SELL",
                "volume": float(trade["volume"]),
                "price": float(trade["price"]),
                "profit": float(trade["profit"]),
                "time": trade["time"].isoformat(),
                "commission": float(trade.get("commission", 0)),
                "swap": float(trade.get("swap", 0))
            })
        
        mt5.shutdown()
        return {
            "trades": trades,
            "total": len(trades),
            "days_back": days_back
        }
    except Exception as e:
        return {"error": str(e), "trades": [], "total": 0}


# ===============================================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8080))
    host = os.getenv("API_HOST", "0.0.0.0")
    print(f"\n🚀 Iniciando servidor en http://{host}:{port}")
    print("="*60)
    uvicorn.run(app, host=host, port=port)