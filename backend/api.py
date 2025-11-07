from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from strategy_engine import analyze_trades
from strategy_templates import generate_code_and_explanation
from database import db
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Allow requests from the frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/history/strategy/{strategy_name}")
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