"""
OpenAI Integration for MT5 Strategy Analysis
Provides AI-enhanced analysis, strategy naming, and parameter optimization
"""

import os
from openai import OpenAI
from typing import Dict, List, Optional
import json
from datetime import datetime

class OpenAIAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4-turbo")
        self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", "2000"))
        
        if not self.api_key:
            print("⚠️ WARNING: OPENAI_API_KEY no encontrada en .env")
            self.client = None
        else:
            self.client = OpenAI(api_key=self.api_key)
            print("✅ OpenAI client inicializado correctamente")
    
    def analyze_strategy_with_ai(self, trading_data: Dict) -> Dict:
        """
        Analiza datos de trading con IA para identificar:
        - Nombre de la estrategia
        - Descripción detallada
        - Indicadores realmente usados
        - Análisis profundo de patrones
        """
        if not self.client:
            return self._fallback_analysis(trading_data)
        
        try:
            # Preparar datos para el prompt
            summary = trading_data.get("summary", {})
            trades = trading_data.get("trades", [])
            historical_metrics = trading_data.get("historical_metrics", {})
            
            prompt = self._build_strategy_analysis_prompt(summary, trades, historical_metrics)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto analista de trading cuantitativo con más de 15 años de experiencia en Forex, CFDs y análisis de estrategias algorítmicas. Tu tarea es analizar datos de trading y proporcionar insights profesionales y accionables."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=self.max_tokens,
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            ai_analysis = json.loads(response.choices[0].message.content)
            
            return {
                "strategy_name": ai_analysis.get("strategy_name", "Unknown Strategy"),
                "strategy_description": ai_analysis.get("strategy_description", ""),
                "confidence_score": ai_analysis.get("confidence_score", 0),
                "indicators_detected": ai_analysis.get("indicators_detected", []),
                "trading_style": ai_analysis.get("trading_style", ""),
                "risk_profile": ai_analysis.get("risk_profile", ""),
                "detailed_analysis": ai_analysis.get("detailed_analysis", ""),
                "strengths": ai_analysis.get("strengths", []),
                "weaknesses": ai_analysis.get("weaknesses", []),
                "market_conditions": ai_analysis.get("market_conditions", ""),
                "ai_powered": True,
                "analysis_timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"⚠️ Error en análisis con OpenAI: {e}")
            return self._fallback_analysis(trading_data)
    
    def optimize_parameters_with_ai(self, strategy_data: Dict, current_performance: Dict) -> Dict:
        """
        Usa IA para optimizar parámetros de la estrategia
        """
        if not self.client:
            return self._fallback_optimization()
        
        try:
            prompt = self._build_optimization_prompt(strategy_data, current_performance)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto en optimización de estrategias de trading. Tu objetivo es mejorar el rendimiento ajustando parámetros basándote en datos históricos y mejores prácticas de gestión de riesgo."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=self.max_tokens,
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            optimization = json.loads(response.choices[0].message.content)
            
            return {
                "optimized_parameters": optimization.get("optimized_parameters", {}),
                "expected_improvement": optimization.get("expected_improvement", ""),
                "reasoning": optimization.get("reasoning", ""),
                "risk_assessment": optimization.get("risk_assessment", ""),
                "implementation_steps": optimization.get("implementation_steps", []),
                "warnings": optimization.get("warnings", []),
                "ai_powered": True,
                "optimization_timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"⚠️ Error en optimización con OpenAI: {e}")
            return self._fallback_optimization()
    
    def _build_strategy_analysis_prompt(self, summary: Dict, trades: List, historical_metrics: Dict) -> str:
        """Construye el prompt para análisis de estrategia"""
        
        prompt = f"""Analiza esta estrategia de trading basándote en los siguientes datos:

**MÉTRICAS ACTUALES:**
- Total de trades: {summary.get('total_trades', 0)}
- Profit neto: ${summary.get('net_profit', 0):.2f}
- Win Rate: {summary.get('win_rate', 0):.2f}%
- Profit Factor: {summary.get('profit_factor', 0):.2f}
- Max Drawdown: ${summary.get('max_drawdown', 0):.2f}
- Sharpe Ratio: {summary.get('sharpe_ratio', 0):.2f}
- Timeframe detectado: {summary.get('timeframe', 'N/A')}

**MÉTRICAS HISTÓRICAS:**
{json.dumps(historical_metrics, indent=2) if historical_metrics else "No disponibles"}

**PATRONES DE TRADING DETECTADOS:**
- Ratio BUY/SELL: {self._calculate_buy_sell_ratio(trades)}
- Símbolos operados: {self._get_unique_symbols(trades)}
- Distribución de profits: {self._get_profit_distribution(trades)}

**INSTRUCCIONES:**
Proporciona un análisis profesional en formato JSON con esta estructura:
{{
    "strategy_name": "Nombre claro y descriptivo de la estrategia (ej: 'Scalping Grid con Martingala', 'Trend Following Multi-Timeframe')",
    "strategy_description": "Descripción de 2-3 oraciones explicando qué hace la estrategia y cómo funciona",
    "confidence_score": 0-100 (qué tan seguro estás de la identificación),
    "indicators_detected": ["Lista de indicadores técnicos que probablemente usa esta estrategia"],
    "trading_style": "scalping/day trading/swing/position",
    "risk_profile": "conservative/moderate/aggressive",
    "detailed_analysis": "Análisis profundo de 3-4 párrafos sobre la estrategia",
    "strengths": ["Lista de fortalezas de esta estrategia"],
    "weaknesses": ["Lista de debilidades o riesgos"],
    "market_conditions": "En qué condiciones de mercado funciona mejor (trending/ranging/volatile)"
}}

Sé específico, profesional y basado en los datos proporcionados."""

        return prompt
    
    def _build_optimization_prompt(self, strategy_data: Dict, current_performance: Dict) -> str:
        """Construye el prompt para optimización de parámetros"""
        
        prompt = f"""Optimiza los parámetros de esta estrategia de trading:

**ESTRATEGIA ACTUAL:**
Nombre: {strategy_data.get('strategy_name', 'Unknown')}
Descripción: {strategy_data.get('strategy_description', 'N/A')}

**PERFORMANCE ACTUAL:**
- Win Rate: {current_performance.get('win_rate', 0):.2f}%
- Profit Factor: {current_performance.get('profit_factor', 0):.2f}
- Max Drawdown: ${current_performance.get('max_drawdown', 0):.2f}
- Sharpe Ratio: {current_performance.get('sharpe_ratio', 0):.2f}
- Total Trades: {current_performance.get('total_trades', 0)}
- Net Profit: ${current_performance.get('net_profit', 0):.2f}

**PARÁMETROS ACTUALES:**
{json.dumps(strategy_data.get('current_parameters', {}), indent=2)}

**INSTRUCCIONES:**
Sugiere parámetros optimizados en formato JSON:
{{
    "optimized_parameters": {{
        "parameter_name": {{
            "current_value": "valor actual",
            "suggested_value": "valor sugerido",
            "change_percentage": "+X%/-X%"
        }}
    }},
    "expected_improvement": "Descripción de mejora esperada en performance",
    "reasoning": "Explicación detallada de por qué estos cambios mejorarán la estrategia",
    "risk_assessment": "Evaluación de riesgos de los cambios propuestos",
    "implementation_steps": ["Pasos ordenados para implementar los cambios"],
    "warnings": ["Advertencias importantes sobre los cambios propuestos"]
}}

Enfócate en mejoras realistas y seguras, priorizando la gestión de riesgo."""

        return prompt
    
    def _calculate_buy_sell_ratio(self, trades: List) -> str:
        """Calcula ratio de órdenes BUY vs SELL"""
        if not trades:
            return "N/A"
        
        buy_count = sum(1 for t in trades if t.get('type') == 'BUY')
        sell_count = len(trades) - buy_count
        return f"{buy_count} BUY / {sell_count} SELL"
    
    def _get_unique_symbols(self, trades: List) -> List[str]:
        """Obtiene lista de símbolos únicos"""
        if not trades:
            return []
        
        symbols = list(set(t.get('symbol', '') for t in trades))
        return symbols[:5]  # Primeros 5 símbolos
    
    def _get_profit_distribution(self, trades: List) -> str:
        """Calcula distribución de profits"""
        if not trades:
            return "N/A"
        
        profits = [t.get('profit', 0) for t in trades]
        positive = sum(1 for p in profits if p > 0)
        negative = sum(1 for p in profits if p < 0)
        neutral = sum(1 for p in profits if p == 0)
        
        return f"{positive} wins / {negative} losses / {neutral} neutral"
    
    def _fallback_analysis(self, trading_data: Dict) -> Dict:
        """Análisis básico cuando OpenAI no está disponible"""
        summary = trading_data.get("summary", {})
        
        return {
            "strategy_name": summary.get("strategy", "Unknown Strategy"),
            "strategy_description": summary.get("strategy_description", ""),
            "confidence_score": 50,
            "indicators_detected": summary.get("indicators", []),
            "trading_style": "unknown",
            "risk_profile": "moderate",
            "detailed_analysis": summary.get("explanation", ""),
            "strengths": [],
            "weaknesses": [],
            "market_conditions": "unknown",
            "ai_powered": False,
            "analysis_timestamp": datetime.utcnow().isoformat()
        }
    
    def _fallback_optimization(self) -> Dict:
        """Optimización básica cuando OpenAI no está disponible"""
        return {
            "optimized_parameters": {},
            "expected_improvement": "OpenAI no disponible - no se pueden generar optimizaciones",
            "reasoning": "Requiere configuración de OPENAI_API_KEY",
            "risk_assessment": "N/A",
            "implementation_steps": [],
            "warnings": ["OpenAI API no configurada"],
            "ai_powered": False,
            "optimization_timestamp": datetime.utcnow().isoformat()
        }


# Instancia global
ai_analyzer = OpenAIAnalyzer()
