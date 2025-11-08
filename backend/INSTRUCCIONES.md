# 🎯 INSTRUCCIONES PARA USAR EL BACKEND MEJORADO

## ✅ TODO LO QUE SE IMPLEMENTÓ

### 🤖 **Análisis con Inteligencia Artificial (OpenAI)**
El sistema ahora usa IA para:
- ✨ **Nombrar tu estrategia automáticamente** (no más "Grid/Scalping" genérico)
- 📝 **Generar descripciones profesionales** de tu estrategia
- 🎯 **Detectar indicadores técnicos reales** que usas
- 🔧 **Optimizar parámetros** de tu estrategia para mejorar resultados
- ⚠️ **Identificar fortalezas y debilidades**

### 📊 **Análisis Histórico Completo**
Ahora analiza TODO tu historial de MT5:
- 📈 Total de trades históricos (no solo abiertos)
- 🏆 Mejor y peor trade de todos los tiempos
- 🔥 Racha ganadora/perdedora más larga
- ⏱️ Duración promedio de tus trades
- 💰 Profit histórico real

### ⏰ **Análisis por Sesiones y Horarios**
Descubre cuándo operas mejor:
- 🌏 **Sesiones**: Asian (00:00-08:00), London (08:00-16:00), NY (16:00-24:00)
- ⏰ **Mejores horas** del día para operar
- 📅 **Mejores días** de la semana

### 💰 **Gestión de Riesgo Mejorada**
- 📊 Ratio Riesgo/Recompensa (R:R)
- 💵 % de riesgo por operación
- 📈 Exposición máxima simultánea
- 🎯 Ganancia/pérdida promedio

### 🌍 **Análisis por Símbolos**
- 🥇 Mejor par de divisas (más rentable)
- 🥉 Peor par de divisas
- 📊 Performance individual por cada símbolo

---

## 🚀 PASO 1: INSTALAR DEPENDENCIAS

Abre PowerShell y ejecuta:

```powershell
cd c:\Users\HP\Desktop\mt5-strategy-analyzer\backend
pip install -r requirements.txt
```

Esto instalará:
- ✅ `openai` - Para análisis con IA
- ✅ `matplotlib` - Para gráficos
- ✅ `plotly` - Para visualizaciones interactivas
- ✅ Todas las dependencias anteriores

---

## 🔑 PASO 2: CONFIGURAR OPENAI (OPCIONAL PERO RECOMENDADO)

### Opción A: Con OpenAI (Recomendado) ✨

1. **Obtener API Key de OpenAI:**
   - Ve a: https://platform.openai.com/api-keys
   - Crea una cuenta si no tienes
   - Genera una API key (empieza con `sk-...`)

2. **Configurar .env:**
   ```powershell
   # Copiar el ejemplo
   copy .env.example .env
   
   # Abrir con notepad
   notepad .env
   ```

3. **Agregar tu API key en el archivo .env:**
   ```bash
   OPENAI_API_KEY=sk-tu-clave-aqui
   OPENAI_MODEL=gpt-4-turbo
   OPENAI_MAX_TOKENS=2000
   ```

4. **Guardar y cerrar**

### Opción B: Sin OpenAI (Funcional pero básico)

Si no quieres usar OpenAI, **el sistema funciona igual** pero:
- ❌ Nombres genéricos de estrategia ("Grid/Scalping")
- ❌ Sin optimización inteligente de parámetros
- ✅ Todos los demás análisis funcionan normal

---

## 🎮 PASO 3: INICIAR EL SERVIDOR

```powershell
cd c:\Users\HP\Desktop\mt5-strategy-analyzer\backend
uvicorn api:app --reload --port 8080
```

Deberías ver:
```
INFO:     Uvicorn running on http://127.0.0.1:8080
INFO:     Application startup complete.
✅ Base de datos inicializada: strategy_data.db
✅ OpenAI client inicializado correctamente  ← Solo si configuraste OpenAI
```

---

## 🧪 PASO 4: PROBAR QUE FUNCIONA

### Opción 1: Con el navegador
Abre: http://localhost:8080/analyze/full

### Opción 2: Con PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/analyze/full" -Method GET
```

### Opción 3: Con curl (si lo tienes)
```bash
curl http://localhost:8080/analyze/full
```

---

## 📡 ENDPOINTS DISPONIBLES

### **Análisis Principal:**
```
GET  /analyze/full          # Análisis completo con IA + historial
GET  /analyze               # Análisis básico (anterior)
```

### **Análisis Detallado:**
```
GET  /analyze/historical    # Métricas históricas (últimos 90 días)
GET  /analyze/sessions      # Performance por sesión (Asian/London/NY)
GET  /analyze/schedule      # Performance por hora y día
GET  /analyze/risk          # Gestión de riesgo
GET  /analyze/symbols       # Performance por símbolo
```

### **Optimización con IA:**
```
POST /strategy/optimize     # Optimiza parámetros de estrategia
```

### **Otros:**
```
GET  /history               # Historial de análisis
GET  /alerts                # Alertas del sistema
GET  /statistics            # Estadísticas generales
POST /backup                # Backup de base de datos
```

---

## 📊 EJEMPLO DE RESPUESTA `/analyze/full`

```json
{
  "summary": {
    // CON IA:
    "strategy": "Grid Scalping Adaptativo con RSI",
    "strategy_description": "Sistema de grid que ajusta distancia según volatilidad...",
    "indicators": ["RSI", "ATR", "Bollinger Bands"],
    "trading_style": "scalping",
    "risk_profile": "moderate",
    
    // SIN IA:
    "strategy": "Grid/Scalping",
    "strategy_description": "Estrategia de grid genérica",
    "indicators": ["Support/Resistance", "Moving Averages"],
    
    // MÉTRICAS NORMALES:
    "total_trades": 50,
    "net_profit": 1250.50,
    "win_rate": 65.5,
    "profit_factor": 1.8,
    
    // NUEVAS MÉTRICAS HISTÓRICAS:
    "historical_total_trades": 500,
    "historical_win_rate": 67.2,
    "best_trade": 250.00,
    "worst_trade": -150.00,
    "longest_win_streak": 8,
    "longest_loss_streak": 4,
    
    // SESIONES:
    "best_session": "London",
    "worst_session": "Asian",
    
    // HORARIOS:
    "best_hour": 14,
    "best_day": "Tuesday",
    
    // RIESGO:
    "avg_risk_reward": 1.85,
    
    // SÍMBOLOS:
    "best_symbol": "EURUSD",
    "worst_symbol": "GBPJPY"
  },
  
  "trades": [...],
  "historical_metrics": {...},
  "session_analysis": {...},
  "schedule_analysis": {...},
  "risk_analysis": {...},
  "symbol_analysis": {...},
  "ai_analysis": {...}  // Solo si OpenAI está configurado
}
```

---

## 🔧 EJEMPLO: OPTIMIZAR ESTRATEGIA

```powershell
# Con PowerShell
$body = @{
    strategy_name = "Grid Scalping"
    strategy_description = "Grid strategy con 50 puntos"
    current_parameters = @{
        grid_step = 50
        lot_size = 0.01
        take_profit = 30
        stop_loss = 100
    }
    current_performance = @{
        win_rate = 65.5
        profit_factor = 1.8
        max_drawdown = 500
        total_trades = 150
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/strategy/optimize" -Method POST -Body $body -ContentType "application/json"
```

**Respuesta (con OpenAI):**
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
    }
  },
  "expected_improvement": "Incremento estimado de 15% en profit factor...",
  "reasoning": "Reducir grid_step permite capturar más oportunidades...",
  "risk_assessment": "Riesgo moderado. Mayor número de trades...",
  "implementation_steps": [
    "1. Testear en demo primero",
    "2. Ajustar grid_step gradualmente",
    "3. Monitorear por 1 semana"
  ],
  "warnings": ["No usar en alta volatilidad"]
}
```

---

## ❓ SOLUCIÓN DE PROBLEMAS

### Error: "MT5 no está inicializado"
- ✅ Abre MetaTrader 5
- ✅ Inicia sesión con tu cuenta
- ✅ Verifica que esté conectado (luz verde en esquina)

### Error: "OPENAI_API_KEY no encontrada"
- ⚠️ Esto es solo una advertencia
- ✅ El sistema funciona sin OpenAI (análisis básico)
- 💡 Para usar IA: configura `.env` con tu API key

### Error: "No module named 'openai'"
```powershell
pip install openai
```

### El servidor no inicia
```powershell
# Verificar puerto 8080 está libre
netstat -ano | findstr :8080

# Si está ocupado, usar otro puerto
uvicorn api:app --reload --port 8081
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ **Backend está completo y funcionando**
2. 🔜 **Conectar con Frontend:**
   - Actualizar `page.tsx` para usar `/analyze/full`
   - Mostrar nombre generado por IA
   - Crear visualizaciones de sesiones
   - Agregar botón "Optimizar Estrategia"
   - Mostrar análisis por horarios
   - Gráficos de equity curve

---

## 💡 TIPS

### Mejor práctica:
1. Siempre usar `/analyze/full` en vez de `/analyze` (más datos)
2. Configurar OpenAI para mejores insights
3. Revisar `/analyze/sessions` para saber cuándo operar
4. Usar `/strategy/optimize` regularmente para mejorar parámetros

### OpenAI Gratis:
- Nuevas cuentas tienen $5 de crédito gratis
- Cada análisis cuesta ~$0.01-0.02
- 500 análisis = ~$5-10/mes

---

## 📚 DOCUMENTACIÓN

- **BACKEND_UPGRADES.md** - Documentación técnica completa
- **RESUMEN_IMPLEMENTACION.md** - Resumen ejecutivo
- **Este archivo** - Guía de uso

---

## ✨ ¡DISFRUTA TU SISTEMA MEJORADO!

Ahora tienes un **sistema de análisis profesional con IA** que:
- 🤖 Nombra tus estrategias inteligentemente
- 📊 Analiza TODO tu historial
- ⏰ Te dice cuándo operar mejor
- 💰 Evalúa tu gestión de riesgo
- 🔧 Optimiza tus parámetros
- 🌍 Identifica tus mejores pares

**¡Todo listo para conectar con el frontend!** 🚀
