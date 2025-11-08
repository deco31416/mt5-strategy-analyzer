# 🚀 Guía Rápida: Detecta Tu Estrategia en 3 Pasos

## ❓ "No sé qué estrategia estoy usando"

**¡No hay problema!** El sistema la detecta por ti.

---

## 📋 Solo 3 Pasos

### **PASO 1: Abre MT5**
```
✅ Abre MetaTrader 5
✅ Inicia sesión en tu cuenta
✅ Deja que tus trades estén activos
```

### **PASO 2: Inicia el Backend**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn api:app --reload --host 0.0.0.0 --port 8080
```

### **PASO 3: Llama al Endpoint**
```bash
# Desde tu navegador o Postman:
GET http://localhost:8080/analyze/full
```

---

## 🎯 ¿Qué Obtienes?

### **Respuesta Automática Completa:**

```json
{
  "summary": {
    // ========================================
    // DETECCIÓN AUTOMÁTICA DE ESTRATEGIA
    // ========================================
    "strategy": "Grid Scalping con Martingala Suave",
    "strategy_description": "Estrategia que coloca órdenes en grid cada 5 pips y aumenta posiciones en pérdidas",
    "timeframe": "M1-M5",
    "trading_style": "scalping",
    "risk_profile": "aggressive",
    
    // ========================================
    // INDICADORES DETECTADOS
    // ========================================
    "indicators": [
      "Support/Resistance Levels",
      "Bollinger Bands (20, 2)",
      "RSI (14)",
      "Moving Averages (EMA 20, 50)"
    ],
    
    // ========================================
    // EXPLICACIÓN DE CÓMO FUNCIONA
    // ========================================
    "explanation": "Detectado 15 posiciones duplicadas en EURUSD con trades cada 2.5 minutos. Esta estrategia coloca múltiples órdenes en niveles de soporte/resistencia para capturar movimientos pequeños del precio. Aumenta el tamaño de posición cuando el mercado va en contra para recuperar pérdidas.",
    
    // ========================================
    // MÉTRICAS ACTUALES (Posiciones Abiertas)
    // ========================================
    "total_trades": 18,
    "net_profit": 125.50,
    "avg_profit": 6.97,
    "win_rate": 61.11,
    "profit_factor": 1.75,
    "max_drawdown": -89.30,
    "sharpe_ratio": 1.42,
    
    // ========================================
    // HISTORIAL COMPLETO (Últimos 90 días)
    // ========================================
    "historical_total_trades": 1523,
    "historical_win_rate": 65.8,
    "historical_profit": 5842.30,
    "best_trade": 285.50,
    "worst_trade": -150.20,
    "longest_win_streak": 12,
    "longest_loss_streak": 7,
    "avg_trade_duration": 34.5,
    
    // ========================================
    // ANÁLISIS POR SESIONES
    // ========================================
    "best_session": "London (08:00-16:00 GMT)",
    "worst_session": "Asian (00:00-08:00 GMT)",
    
    // ========================================
    // ANÁLISIS POR HORARIO
    // ========================================
    "best_hour": "14:00 (overlap London-NY)",
    "best_day": "Tuesday",
    
    // ========================================
    // GESTIÓN DE RIESGO
    // ========================================
    "avg_risk_reward": 1.8,
    "risk_per_trade": 1.2,
    
    // ========================================
    // ANÁLISIS POR SÍMBOLOS
    // ========================================
    "best_symbol": "EURUSD (win rate 72%)",
    "worst_symbol": "GBPJPY (win rate 45%)",
    
    // ========================================
    // ANÁLISIS CON IA (Si tienes OpenAI)
    // ========================================
    "ai_powered": true,
    "confidence_score": 88,
    
    "strengths": [
      "Alta frecuencia de trades = más oportunidades",
      "Buen win rate en mercados laterales",
      "Recuperación efectiva con martingala controlada"
    ],
    
    "weaknesses": [
      "Alto riesgo en tendencias fuertes",
      "Requiere mucho capital disponible",
      "Vulnerable a gaps y noticias"
    ],
    
    "market_conditions": "Funciona mejor en mercados ranging (laterales) con volatilidad baja a media",
    
    // ========================================
    // SUGERENCIAS DE MEJORA
    // ========================================
    "optimization_suggestions": [
      "Reducir grid_step de 50 a 35 pips para más frecuencia",
      "Aumentar take_profit de 30 a 35 para mejor R:R",
      "Evitar trading durante sesión asiática (win rate bajo)",
      "Concentrar operaciones en EURUSD (mejor performance)"
    ]
  }
}
```

---

## 🤔 Preguntas Frecuentes

### **P: ¿Necesito saber el nombre de mi estrategia?**
**R:** ❌ NO. El sistema la detecta automáticamente analizando tus trades.

### **P: ¿Necesito configurar parámetros?**
**R:** ❌ NO. El sistema los detecta del historial de trades.

### **P: ¿Necesito saber qué indicadores uso?**
**R:** ❌ NO. El sistema los infiere basándose en patrones.

### **P: ¿Funciona sin OpenAI?**
**R:** ✅ SÍ. La detección básica funciona sin OpenAI. Con OpenAI obtienes análisis más profundo.

### **P: ¿Qué pasa si uso múltiples estrategias?**
**R:** El sistema detecta la estrategia dominante o identifica que es "Mixed/Adaptive".

---

## 🎯 Casos de Uso

### **Caso 1: Tengo un EA pero no sé cómo funciona**

```
Tu situación:
- Tienes un EA corriendo en MT5
- No tienes el código fuente
- No sabes qué estrategia usa

Solución:
GET /analyze/full

Resultado:
"Tu EA usa Grid Scalping con entradas cada 5 pips,
take profit de 30 pips, y martingala x1.5 después 
de 3 pérdidas consecutivas"
```

### **Caso 2: Trading manual sin sistema claro**

```
Tu situación:
- Operas manualmente
- No tienes estrategia definida
- Quieres saber qué patrón sigues

Solución:
GET /analyze/full

Resultado:
"Detectado que sigues tendencias alcistas (90% BUY)
usando timeframe H1. Tus entradas parecen basarse
en cruce de medias móviles y RSI sobreventa"
```

### **Caso 3: Quiero mejorar pero no sé cómo**

```
Tu situación:
- No estás satisfecho con resultados
- No sabes qué cambiar
- No sabes cómo optimizar

Solución:
POST /strategy/optimize
(déjalo vacío, se detecta automáticamente)

Resultado:
"Sugerencias basadas en tu estrategia Grid Scalping:
1. Reducir grid step: 50 → 35 pips
2. Aumentar TP: 30 → 35 pips
3. Evitar sesión asiática
4. Filtrar con ATR > 20 antes de abrir"
```

---

## 📊 Ejemplo Visual del Flujo

```
┌─────────────────────────┐
│   Tú abres MT5         │
│   (con trades activos)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Llamas /analyze/full  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  Sistema lee automáticamente:           │
│  ✓ Posiciones abiertas                  │
│  ✓ Historial de 90 días                │
│  ✓ Patrones de entrada/salida          │
│  ✓ Volúmenes y precios                 │
│  ✓ Tiempos entre trades                │
└───────────┬─────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  Sistema analiza y detecta:             │
│  ✓ Tipo de estrategia                   │
│  ✓ Timeframe usado                      │
│  ✓ Indicadores probables                │
│  ✓ Patrones de gestión de riesgo       │
└───────────┬─────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  (Opcional) OpenAI refina:              │
│  ✓ Confirma/corrige detección           │
│  ✓ Análisis profundo                    │
│  ✓ Sugerencias personalizadas           │
└───────────┬─────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  Recibes respuesta completa:            │
│  ✓ Nombre de tu estrategia              │
│  ✓ Explicación de cómo funciona         │
│  ✓ Métricas históricas                  │
│  ✓ Fortalezas y debilidades             │
│  ✓ Sugerencias de mejora                │
└─────────────────────────────────────────┘
```

---

## 🚀 Comandos Rápidos

```bash
# Ver qué estrategia usas
curl http://localhost:8080/analyze/full

# Ver solo historial
curl http://localhost:8080/analyze/historical?days_back=90

# Ver análisis por sesiones
curl http://localhost:8080/analyze/sessions

# Ver análisis por símbolos
curl http://localhost:8080/analyze/symbols

# Optimizar automáticamente
curl -X POST http://localhost:8080/strategy/optimize \
  -H "Content-Type: application/json" \
  -d '{"current_performance": {"win_rate": 65.5}}'
```

---

## ✅ Conclusión

### **NO NECESITAS:**
❌ Saber el nombre de tu estrategia  
❌ Conocer los indicadores que usas  
❌ Entender cómo funciona  
❌ Proporcionar parámetros  

### **SOLO NECESITAS:**
✅ Tener MT5 abierto con trades  
✅ Llamar a `/analyze/full`  
✅ Leer los resultados  

### **EL SISTEMA TE DICE:**
📊 Qué estrategia usas  
📈 Cómo funciona  
🎯 Qué indicadores tiene  
💡 Cómo mejorarla  
⚠️ Sus riesgos  
✨ Sus fortalezas  

---

**🎉 ¡Es así de simple! El análisis es 100% automático.**
