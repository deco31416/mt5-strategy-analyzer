import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional
import os

class StrategyDatabase:
    def __init__(self, db_path: str = "strategy_data.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Inicializa las tablas de la base de datos"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Tabla de análisis de estrategias
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS strategy_analysis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                strategy_name TEXT NOT NULL,
                strategy_description TEXT,
                timeframe TEXT,
                indicators TEXT,
                total_trades INTEGER,
                net_profit REAL,
                avg_profit REAL,
                win_rate REAL,
                profit_factor REAL,
                max_drawdown REAL,
                sharpe_ratio REAL,
                account_balance REAL,
                account_equity REAL,
                explanation TEXT,
                raw_data TEXT
            )
        ''')
        
        # Tabla de trades individuales
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trades_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                analysis_id INTEGER,
                ticket INTEGER,
                symbol TEXT,
                trade_type TEXT,
                volume REAL,
                price_open REAL,
                price_close REAL,
                profit REAL,
                commission REAL,
                swap REAL,
                open_time DATETIME,
                close_time DATETIME,
                duration_minutes INTEGER,
                FOREIGN KEY (analysis_id) REFERENCES strategy_analysis (id)
            )
        ''')
        
        # Tabla de métricas por símbolo
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS symbol_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                analysis_id INTEGER,
                symbol TEXT,
                total_trades INTEGER,
                win_rate REAL,
                total_profit REAL,
                avg_profit REAL,
                best_trade REAL,
                worst_trade REAL,
                FOREIGN KEY (analysis_id) REFERENCES strategy_analysis (id)
            )
        ''')
        
        # Tabla de configuraciones de estrategia (para backup)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS strategy_configs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                strategy_name TEXT UNIQUE,
                mql4_code TEXT,
                mql5_code TEXT,
                python_code TEXT,
                parameters TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de alertas y eventos importantes
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                alert_type TEXT,
                severity TEXT,
                message TEXT,
                data TEXT
            )
        ''')
        
        # Tabla de optimizaciones generadas por IA
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_optimizations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                strategy_name TEXT,
                optimized_parameters TEXT,
                expected_improvement TEXT,
                reasoning TEXT,
                risk_assessment TEXT,
                implementation_steps TEXT,
                warnings TEXT,
                ai_powered BOOLEAN DEFAULT 1
            )
        ''')
        
        # Tabla de análisis de sesiones
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS session_analysis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                analysis_id INTEGER,
                session_name TEXT,
                total_profit REAL,
                avg_profit REAL,
                trade_count INTEGER,
                FOREIGN KEY (analysis_id) REFERENCES strategy_analysis (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print(f"✅ Base de datos inicializada: {self.db_path}")
    
    def save_analysis(self, analysis_data: Dict) -> int:
        """Guarda un análisis completo de estrategia"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        summary = analysis_data.get("summary", {})
        
        cursor.execute('''
            INSERT INTO strategy_analysis (
                strategy_name, strategy_description, timeframe, indicators,
                total_trades, net_profit, avg_profit, win_rate,
                profit_factor, max_drawdown, sharpe_ratio,
                explanation, raw_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            summary.get("strategy"),
            summary.get("strategy_description"),
            summary.get("timeframe"),
            json.dumps(summary.get("indicators", [])),
            summary.get("total_trades", 0),
            summary.get("net_profit", 0.0),
            summary.get("avg_profit", 0.0),
            summary.get("win_rate", 0.0),
            summary.get("profit_factor", 0.0),
            summary.get("max_drawdown", 0.0),
            summary.get("sharpe_ratio", 0.0),
            summary.get("explanation"),
            json.dumps(analysis_data)
        ))
        
        analysis_id = cursor.lastrowid
        
        # Guardar trades individuales
        trades = analysis_data.get("trades", [])
        for trade in trades:
            cursor.execute('''
                INSERT INTO trades_history (
                    analysis_id, ticket, symbol, trade_type, volume,
                    price_open, profit, open_time
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                analysis_id,
                trade.get("ticket"),
                trade.get("symbol"),
                trade.get("type"),
                trade.get("volume"),
                trade.get("price_open"),
                trade.get("profit"),
                trade.get("time")
            ))
        
        conn.commit()
        conn.close()
        return analysis_id
    
    def save_strategy_code(self, strategy_name: str, codes: Dict):
        """Guarda el código generado de una estrategia"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO strategy_configs (
                strategy_name, mql4_code, mql5_code, python_code, parameters, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            strategy_name,
            codes.get("mql4", ""),
            codes.get("mql5", ""),
            codes.get("python", ""),
            codes.get("parameters", "{}"),
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
    
    def get_analysis_history(self, limit: int = 50) -> List[Dict]:
        """Obtiene el historial de análisis"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM strategy_analysis 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_strategy_evolution(self, strategy_name: str) -> List[Dict]:
        """Obtiene la evolución de una estrategia específica"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM strategy_analysis 
            WHERE strategy_name = ?
            ORDER BY timestamp ASC
        ''', (strategy_name,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_symbol_performance(self, symbol: str) -> Dict:
        """Obtiene el rendimiento histórico de un símbolo"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                COUNT(*) as total_trades,
                SUM(profit) as total_profit,
                AVG(profit) as avg_profit,
                MAX(profit) as best_trade,
                MIN(profit) as worst_trade
            FROM trades_history
            WHERE symbol = ?
        ''', (symbol,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return {
                "symbol": symbol,
                "total_trades": result[0],
                "total_profit": result[1] or 0,
                "avg_profit": result[2] or 0,
                "best_trade": result[3] or 0,
                "worst_trade": result[4] or 0
            }
        return {}
    
    def create_alert(self, alert_type: str, severity: str, message: str, data: Dict = None):
        """Crea una alerta en el sistema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO alerts (alert_type, severity, message, data)
            VALUES (?, ?, ?, ?)
        ''', (alert_type, severity, message, json.dumps(data) if data else None))
        
        conn.commit()
        conn.close()
    
    def get_latest_alerts(self, limit: int = 10) -> List[Dict]:
        """Obtiene las últimas alertas"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM alerts 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def backup_database(self, backup_path: str = None):
        """Crea un backup de la base de datos"""
        if backup_path is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = f"backups/strategy_backup_{timestamp}.db"
        
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)
        
        # Copiar base de datos
        import shutil
        shutil.copy2(self.db_path, backup_path)
        
        print(f"✅ Backup creado: {backup_path}")
        return backup_path
    
    def get_statistics_summary(self) -> Dict:
        """Obtiene estadísticas generales del sistema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Total de análisis
        cursor.execute("SELECT COUNT(*) FROM strategy_analysis")
        total_analysis = cursor.fetchone()[0]
        
        # Total de trades
        cursor.execute("SELECT COUNT(*) FROM trades_history")
        total_trades = cursor.fetchone()[0]
        
        # Profit total
        cursor.execute("SELECT SUM(net_profit) FROM strategy_analysis")
        total_profit = cursor.fetchone()[0] or 0
        
        # Mejor estrategia
        cursor.execute('''
            SELECT strategy_name, net_profit 
            FROM strategy_analysis 
            ORDER BY net_profit DESC 
            LIMIT 1
        ''')
        best_strategy = cursor.fetchone()
        
        conn.close()
        
        return {
            "total_analysis": total_analysis,
            "total_trades": total_trades,
            "total_profit": total_profit,
            "best_strategy": {
                "name": best_strategy[0] if best_strategy else "N/A",
                "profit": best_strategy[1] if best_strategy else 0
            }
        }
    
    def save_optimization(self, strategy_name: str, optimization: Dict):
        """Guarda una optimización generada por IA"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO ai_optimizations (
                strategy_name, optimized_parameters, expected_improvement,
                reasoning, risk_assessment, implementation_steps, warnings, ai_powered
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            strategy_name,
            json.dumps(optimization.get("optimized_parameters", {})),
            optimization.get("expected_improvement", ""),
            optimization.get("reasoning", ""),
            optimization.get("risk_assessment", ""),
            json.dumps(optimization.get("implementation_steps", [])),
            json.dumps(optimization.get("warnings", [])),
            optimization.get("ai_powered", False)
        ))
        
        conn.commit()
        conn.close()
    
    def get_optimizations_history(self, strategy_name: str = None, limit: int = 10) -> List[Dict]:
        """Obtiene historial de optimizaciones"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        if strategy_name:
            cursor.execute('''
                SELECT * FROM ai_optimizations 
                WHERE strategy_name = ?
                ORDER BY timestamp DESC 
                LIMIT ?
            ''', (strategy_name, limit))
        else:
            cursor.execute('''
                SELECT * FROM ai_optimizations 
                ORDER BY timestamp DESC 
                LIMIT ?
            ''', (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]

# Instancia global
db = StrategyDatabase()
