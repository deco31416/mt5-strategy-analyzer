# 📡 API ENDPOINTS - GUÍA COMPLETA

## 🎯 RESUMEN RÁPIDO

| Endpoint | Método | Descripción | Uso Principal |
|----------|--------|-------------|---------------|
| `/analyze` | GET | Análisis básico de posiciones abiertas | UI básica, compatibilidad |
| `/analyze/full` | GET | ⭐ Análisis completo + IA + historial | **Usar este en frontend** |
| `/analyze/historical` | GET | Solo métricas históricas | Gráficos de historial |
| `/analyze/sessions` | GET | Performance por sesión | Optimizar horarios |
| `/analyze/schedule` | GET | Performance por hora/día | Heatmap de horarios |
| `/analyze/risk` | GET | Gestión de riesgo | Dashboard de riesgo |
| `/analyze/symbols` | GET | Performance por símbolo | Comparar pares |
| `/strategy/template` | GET | Obtener código de estrategia | Generar código |
| `/strategy/export` | GET | Exportar código .mq5 | Descargar archivo |
| `/strategy/optimize` | POST | ⭐ Optimizar con IA | Mejorar estrategia |
| `/strategy/optimize-enhanced` | POST | Optimizar con validación | Versión segura |
| `/history` | GET | Historial de análisis | Panel de historial |
| `/history/strategy/{name}` | GET | Evolución de estrategia | Tracking temporal |
| `/alerts` | GET | Alertas del sistema | Notificaciones |
| `/statistics` | GET | Estadísticas generales | Dashboard principal |
| `/symbol/{symbol}` | GET | Performance de un símbolo | Análisis individual |
| `/backup` | POST | Backup de base de datos | Mantenimiento |

---

## 📊 ENDPOINTS DE ANÁLISIS

### 1️⃣ `GET /analyze` - Análisis Básico

**¿Qué hace?**
Analiza únicamente las posiciones ABIERTAS en MT5.

**¿Cuándo usar?**
- Compatibilidad con versión anterior
- UI simple que solo necesita posiciones actuales
- Cuando NO necesitas historial completo

**Request:**
```bash
GET http://localhost:8080/analyze
```

**Response:**
```json
{
  "summary": {
    "strategy": "Grid/Scalping",
    "total_trades": 5,
    "net_profit": 125.50,
    "win_rate": 60.0,
    "profit_factor": 1.5,
    "account_balance": 10000.00
  },
  "trades": [
    {
      "ticket": 12345,
      "symbol": "EURUSD",
      "type": "BUY",
      "volume": 0.01,
      "profit": 25.50
    }
  ]
}
```

**Limitaciones:**
- ❌ Solo posiciones abiertas (no historial)
- ❌ Nombre genérico de estrategia
- ❌ Sin análisis temporal
- ❌ Sin análisis de riesgo

---

### 2️⃣ `GET /analyze/full` - ⭐ Análisis Completo (RECOMENDADO)

**¿Qué hace?**
Análisis COMPLETO con:
- ✅ Posiciones abiertas
- ✅ Historial completo de MT5 (últimos 90 días)
- ✅ Análisis con IA de OpenAI
- ✅ Performance por sesiones
- ✅ Performance por horarios
- ✅ Gestión de riesgo
- ✅ Análisis por símbolos

**¿Cuándo usar?**
- **SIEMPRE** que quieras el análisis más completo
- Dashboard principal
- Cuando necesitas insights detallados
- Para mostrar reporte completo al usuario

**Request:**
```bash
GET http://localhost:8080/analyze/full
```

**Response:**
```json
{
  "summary": {
    // CON IA (si está configurado OpenAI)
    "strategy": "Grid Scalping Adaptativo con RSI",  // ← Nombre IA
    "strategy_description": "Sistema de grid que ajusta distancia según volatilidad...",
    "indicators": ["RSI", "ATR", "Bollinger Bands"],  // ← Detectados por IA
    "trading_style": "scalping",
    "risk_profile": "moderate",
    
    // MÉTRICAS BÁSICAS
    "total_trades": 50,
    "net_profit": 1250.50,
    "win_rate": 65.5,
    "profit_factor": 1.8,
    
    // MÉTRICAS HISTÓRICAS (últimos 90 días)
    "historical_total_trades": 500,
    "historical_win_rate": 67.2,
    "historical_profit": 5000.00,
    "best_trade": 250.00,
    "worst_trade": -150.00,
    "longest_win_streak": 8,
    "longest_loss_streak": 4,
    "avg_trade_duration": 45.5,  // minutos
    
    // SESIONES
    "best_session": "London",
    "worst_session": "Asian",
    
    // HORARIOS
    "best_hour": 14,  // 14:00 GMT
    "best_day": "Tuesday",
    
    // RIESGO
    "avg_risk_reward": 1.85,
    "risk_per_trade": 2.5,
    
    // SÍMBOLOS
    "best_symbol": "EURUSD",
    "worst_symbol": "GBPJPY"
  },
  
  "trades": [...],
  
  "historical_metrics": {
    "total_trades": 500,
    "wins": 336,
    "losses": 164,
    "win_rate": 67.2,
    "best_trade": 250.00,
    "worst_trade": -150.00
  },
  
  "session_analysis": {
    "best_session": "London",
    "worst_session": "Asian",
    "sessions": {
      "Asian": {
        "total_profit": 250.00,
        "avg_profit": 5.50,
        "trade_count": 45
      },
      "London": {
        "total_profit": 3500.00,
        "avg_profit": 15.20,
        "trade_count": 230
      },
      "New York": {
        "total_profit": 1250.00,
        "avg_profit": 10.00,
        "trade_count": 125
      }
    }
  },
  
  "schedule_analysis": {
    "best_hour": 14,
    "best_day": "Tuesday",
    "by_hour": {
      "0": {"total_profit": 50.00, "trade_count": 10},
      "14": {"total_profit": 850.00, "trade_count": 45}
    },
    "by_day": {
      "Monday": {"total_profit": 500.00, "trade_count": 85},
      "Tuesday": {"total_profit": 1200.00, "trade_count": 120}
    }
  },
  
  "risk_analysis": {
    "avg_rr": 1.85,
    "avg_win": 45.50,
    "avg_loss": -24.50,
    "avg_risk_percent": 2.5,
    "max_exposure": 0.15
  },
  
  "symbol_analysis": {
    "best_symbol": "EURUSD",
    "worst_symbol": "GBPJPY",
    "symbols": {
      "EURUSD": {
        "total_profit": 2500.00,
        "avg_profit": 12.50,
        "trade_count": 200,
        "best_trade": 150.00,
        "worst_trade": -50.00
      },
      "GBPJPY": {
        "total_profit": -250.00,
        "avg_profit": -5.00,
        "trade_count": 50
      }
    }
  },
  
  "ai_analysis": {  // Solo si OpenAI está configurado
    "strategy_name": "Grid Scalping Adaptativo con RSI",
    "confidence_score": 92,
    "detailed_analysis": "Esta estrategia combina un sistema de grid...",
    "strengths": [
      "Alta tasa de éxito en mercados laterales",
      "Gestión de riesgo consistente",
      "Buena adaptabilidad a volatilidad"
    ],
    "weaknesses": [
      "Vulnerable a gaps de mercado",
      "Requiere alta liquidez",
      "Drawdown puede ser significativo en tendencias"
    ],
    "market_conditions": "Optimal en mercados con baja volatilidad y movimientos laterales",
    "ai_powered": true
  }
}
```

**Uso en Frontend:**
```typescript
// En tu componente de React/Next.js
const fetchFullAnalysis = async () => {
  const response = await fetch('http://localhost:8080/analyze/full');
  const data = await response.json();
  
  // Mostrar nombre IA
  setStrategyName(data.summary.strategy);
  
  // Mostrar métricas históricas
  setBestTrade(data.summary.best_trade);
  setLongestWinStreak(data.summary.longest_win_streak);
  
  // Mostrar mejores horarios
  setBestSession(data.summary.best_session);
  setBestHour(data.summary.best_hour);
  
  // etc...
}
```

---

### 3️⃣ `GET /analyze/historical?days_back=90` - Métricas Históricas

**¿Qué hace?**
Obtiene SOLO las métricas históricas de los últimos X días.

**¿Cuándo usar?**
- Cuando solo necesitas datos históricos
- Para gráficos de equity curve
- Para mostrar evolución temporal
- Cuando `/analyze/full` es demasiado pesado

**Request:**
```bash
GET http://localhost:8080/analyze/historical?days_back=30
```

**Response:**
```json
{
  "total_trades": 250,
  "wins": 165,
  "losses": 85,
  "win_rate": 66.0,
  "total_profit": 2500.00,
  "best_trade": 150.00,
  "worst_trade": -75.00,
  "longest_win_streak": 6,
  "longest_loss_streak": 3,
  "avg_duration_minutes": 42.5
}
```

---

### 4️⃣ `GET /analyze/sessions` - Performance por Sesión

**¿Qué hace?**
Analiza en qué sesión de trading operas mejor.

**¿Cuándo usar?**
- Para optimizar horarios de trading
- Dashboard de "cuándo operar"
- Recomendaciones de horarios

**Request:**
```bash
GET http://localhost:8080/analyze/sessions
```

**Response:**
```json
{
  "best_session": "London",
  "worst_session": "Asian",
  "sessions": {
    "Asian": {
      "total_profit": 250.00,
      "avg_profit": 5.50,
      "trade_count": 45
    },
    "London": {
      "total_profit": 3500.00,
      "avg_profit": 15.20,
      "trade_count": 230
    },
    "New York": {
      "total_profit": 1250.00,
      "avg_profit": 10.00,
      "trade_count": 125
    }
  }
}
```

**Uso en Frontend:**
```tsx
// Mostrar recomendación
{data.best_session === "London" && (
  <Alert>
    💡 Operas mejor durante la sesión de Londres (08:00-16:00 GMT)
  </Alert>
)}
```

---

### 5️⃣ `GET /analyze/schedule` - Performance por Hora/Día

**¿Qué hace?**
Muestra en qué hora del día y qué día de la semana operas mejor.

**¿Cuándo usar?**
- Crear heatmap de horarios
- Optimizar calendario de trading
- Identificar patrones temporales

**Request:**
```bash
GET http://localhost:8080/analyze/schedule
```

**Response:**
```json
{
  "best_hour": 14,
  "best_day": "Tuesday",
  "by_hour": {
    "0": {"total_profit": 50.00, "trade_count": 10},
    "14": {"total_profit": 850.00, "trade_count": 45},
    "23": {"total_profit": 100.00, "trade_count": 15}
  },
  "by_day": {
    "Monday": {"total_profit": 500.00, "trade_count": 85},
    "Tuesday": {"total_profit": 1200.00, "trade_count": 120},
    "Wednesday": {"total_profit": 800.00, "trade_count": 95}
  }
}
```

**Uso en Frontend:**
```tsx
// Crear heatmap con los datos
<HourlyHeatmap data={scheduleAnalysis.by_hour} />
<WeeklyBarChart data={scheduleAnalysis.by_day} />
```

---

### 6️⃣ `GET /analyze/risk` - Gestión de Riesgo

**¿Qué hace?**
Analiza cómo gestionas el riesgo: R:R ratio, exposición, etc.

**¿Cuándo usar?**
- Dashboard de métricas de riesgo
- Alertas de riesgo alto
- Evaluación de gestión de capital

**Request:**
```bash
GET http://localhost:8080/analyze/risk
```

**Response:**
```json
{
  "avg_rr": 1.85,
  "avg_win": 45.50,
  "avg_loss": -24.50,
  "avg_risk_percent": 2.5,
  "max_exposure": 0.15
}
```

---

### 7️⃣ `GET /analyze/symbols` - Performance por Símbolo

**¿Qué hace?**
Muestra qué pares de divisas te dan más/menos ganancia.

**¿Cuándo usar?**
- Comparar performance entre pares
- Identificar mejores símbolos
- Filtrar pares no rentables

**Request:**
```bash
GET http://localhost:8080/analyze/symbols
```

**Response:**
```json
{
  "best_symbol": "EURUSD",
  "worst_symbol": "GBPJPY",
  "symbols": {
    "EURUSD": {
      "total_profit": 2500.00,
      "avg_profit": 12.50,
      "trade_count": 200,
      "best_trade": 150.00,
      "worst_trade": -50.00
    },
    "GBPJPY": {
      "total_profit": -250.00,
      "avg_profit": -5.00,
      "trade_count": 50,
      "best_trade": 25.00,
      "worst_trade": -100.00
    }
  }
}
```

---

## 🎯 ENDPOINTS DE ESTRATEGIA

### 8️⃣ `GET /strategy/template?strategy=Grid Scalping`

**¿Qué hace?**
Genera código MQL4/MQL5/Python para la estrategia detectada.

**¿Cuándo usar?**
- Mostrar código generado al usuario
- Exportar estrategia a código
- Implementar estrategia en MT5

**Request:**
```bash
GET http://localhost:8080/strategy/template?strategy=Grid%20Scalping
```

**Response:**
```json
{
  "mql5": "//+------------------------------------------------------------------+\n//| Grid Scalping EA...",
  "mql4": "//+------------------------------------------------------------------+\n//| Grid Scalping EA...",
  "python": "# Grid Scalping Strategy\nimport MetaTrader5...",
  "explanation": "🤖 EXPLICACIÓN DE LA ESTRATEGIA...",
  "parameters": "{\"grid_step\": 50, \"lot_size\": 0.01}"
}
```

---

### 9️⃣ `GET /strategy/export?strategy=Grid Scalping`

**¿Qué hace?**
Exporta el código MQL5 como archivo descargable `.mq5`.

**¿Cuándo usar?**
- Botón "Descargar Estrategia"
- Exportar para usar directamente en MT5

**Request:**
```bash
GET http://localhost:8080/strategy/export?strategy=Grid%20Scalping
```

**Response:**
```
Content-Type: text/plain
Content-Disposition: attachment; filename="Grid_Scalping.mq5"

[Archivo .mq5 descargable]
```

---

### 🔟 `POST /strategy/optimize` - ⭐ Optimizar con IA

**¿Qué hace?**
Usa OpenAI para optimizar los parámetros de tu estrategia.

**¿Cuándo usar?**
- Botón "Optimizar Estrategia" en UI
- Mejorar performance de estrategia
- Obtener recomendaciones inteligentes

**Request:**
```bash
POST http://localhost:8080/strategy/optimize
Content-Type: application/json

{
  "strategy_name": "Grid Scalping",
  "strategy_description": "Grid con 50 puntos de separación",
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
```

**Response:**
```json
{
  "optimized_parameters": {
    "grid_step": {
      "current_value": 50,
      "suggested_value": 35,
      "change_percentage": "-30%"
    },
    "take_profit": {
      "current_value": 30,
      "suggested_value": 40,
      "change_percentage": "+33%"
    },
    "stop_loss": {
      "current_value": 100,
      "suggested_value": 80,
      "change_percentage": "-20%"
    }
  },
  "expected_improvement": "Se espera incremento de 15% en profit factor reduciendo grid_step y ajustando TP/SL ratio a 2:1",
  "reasoning": "Grid step de 50 es muy amplio para la volatilidad actual del mercado. Reducir a 35 permitirá capturar más movimientos sin sobreexponer. Aumentar TP a 40 mejora R:R ratio.",
  "risk_assessment": "Riesgo MODERADO. Mayor frecuencia de trades incrementa costos de spread pero mejora tasa de captura de oportunidades.",
  "implementation_steps": [
    "1. Testear en cuenta demo primero durante 2 semanas",
    "2. Reducir grid_step gradualmente: 50 → 45 → 40 → 35",
    "3. Monitorear drawdown diariamente",
    "4. Si drawdown > 8%, revertir cambios",
    "5. Implementar en cuenta real con 50% del capital inicialmente"
  ],
  "warnings": [
    "No usar durante eventos de alta volatilidad (NFP, decisiones de tasas)",
    "Evitar operar 30 min antes/después de noticias importantes",
    "Grid más pequeño requiere mayor liquidez en cuenta"
  ],
  "ai_powered": true
}
```

**Uso en Frontend:**
```tsx
<button onClick={async () => {
  const response = await fetch('/strategy/optimize', {
    method: 'POST',
    body: JSON.stringify({
      strategy_name: strategyName,
      current_parameters: parameters,
      current_performance: performance
    })
  });
  const optimization = await response.json();
  
  // Mostrar recomendaciones
  showOptimizationModal(optimization);
}}>
  🤖 Optimizar Estrategia con IA
</button>
```

---

## 📚 ENDPOINTS DE DATOS

### 1️⃣1️⃣ `GET /history?limit=50`

**¿Qué hace?**
Obtiene el historial de análisis guardados en la base de datos.

**Request:**
```bash
GET http://localhost:8080/history?limit=50
```

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "timestamp": "2025-11-07T10:30:00",
      "strategy_name": "Grid Scalping",
      "total_trades": 50,
      "net_profit": 1250.50,
      "win_rate": 65.5
    }
  ]
}
```

---

### 1️⃣2️⃣ `GET /history/strategy/{strategy_name}`

**¿Qué hace?**
Obtiene la evolución temporal de una estrategia específica.

**Request:**
```bash
GET http://localhost:8080/history/strategy/Grid%20Scalping
```

---

### 1️⃣3️⃣ `GET /alerts?limit=20`

**¿Qué hace?**
Obtiene alertas del sistema (pérdidas consecutivas, drawdown alto, etc).

**Request:**
```bash
GET http://localhost:8080/alerts?limit=20
```

**Response:**
```json
{
  "alerts": [
    {
      "id": 1,
      "timestamp": "2025-11-07T10:30:00",
      "alert_type": "high_drawdown",
      "severity": "critical",
      "message": "Drawdown alto detectado: $850.00",
      "data": "{\"drawdown\": 850.0}"
    }
  ]
}
```

---

### 1️⃣4️⃣ `GET /statistics`

**¿Qué hace?**
Estadísticas generales del sistema.

**Request:**
```bash
GET http://localhost:8080/statistics
```

**Response:**
```json
{
  "total_analysis": 150,
  "total_trades": 5000,
  "total_profit": 12500.00,
  "best_strategy": {
    "name": "Grid Scalping Optimizado",
    "profit": 5000.00
  }
}
```

---

### 1️⃣5️⃣ `GET /symbol/{symbol}`

**¿Qué hace?**
Performance histórico de un símbolo específico.

**Request:**
```bash
GET http://localhost:8080/symbol/EURUSD
```

---

### 1️⃣6️⃣ `POST /backup`

**¿Qué hace?**
Crea backup de la base de datos SQLite.

**Request:**
```bash
POST http://localhost:8080/backup
```

**Response:**
```json
{
  "message": "Backup creado exitosamente",
  "path": "backups/strategy_backup_20251107_103000.db"
}
```

---

## 🎯 RECOMENDACIONES DE USO

### Para el Frontend Principal:
1. **Usar `/analyze/full`** en el dashboard principal
2. **Usar `/strategy/optimize`** en botón "Optimizar"
3. **Usar `/analyze/sessions`** para mostrar mejores horarios
4. **Usar `/history`** en panel de historial
5. **Usar `/alerts`** para notificaciones

### Para Gráficos Específicos:
- **Equity Curve:** `/analyze/historical`
- **Heatmap Horarios:** `/analyze/schedule`
- **Comparación Símbolos:** `/analyze/symbols`
- **Métricas de Riesgo:** `/analyze/risk`

### Performance:
- `/analyze/full` es completo pero puede ser lento (5-10 seg)
- Usar endpoints específicos si solo necesitas un tipo de dato
- Cachear resultados en frontend cuando sea posible

---

## ✨ RESUMEN FINAL

**Endpoint principal para frontend:**
```
GET /analyze/full  ← Usar este 90% del tiempo
```

**Para optimización con IA:**
```
POST /strategy/optimize  ← Para mejorar estrategia
```

**Para datos específicos:**
- Sesiones: `/analyze/sessions`
- Horarios: `/analyze/schedule`
- Riesgo: `/analyze/risk`
- Símbolos: `/analyze/symbols`

¡Listo para integrar con el frontend! 🚀
