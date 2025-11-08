# 📊 MT5 Strategy Analyzer

Analizador avanzado de estrategias de trading para MetaTrader 5 con IA, análisis técnico automático y traducción de estrategias entre frameworks.

## ✨ Características Principales

- 🤖 **Análisis con IA**: Evaluación inteligente de estrategias usando OpenAI GPT-4
- 📈 **17 Indicadores Técnicos**: RSI, MACD, Bollinger Bands, ATR, Stochastic, y más
- 🔄 **Auto-Traducción**: Convierte estrategias entre Pine Script, MQL5 y Python
- 📊 **Backtesting**: Prueba estrategias con datos históricos reales de MT5
- 📉 **Análisis de Riesgo**: Cálculo automático de drawdown, Sharpe ratio, win rate
- 🎯 **Detección de Patrones**: Identifica patrones de velas japonesas automáticamente
- 🌐 **Interfaz Moderna**: Dashboard interactivo con Next.js 14 y Tailwind CSS
- 🔒 **Seguro**: Sin credenciales hardcodeadas, todo vía variables de entorno

## 🏗️ Arquitectura

```
mt5-strategy-analyzer/
├── backend/              # FastAPI + Python
│   ├── api.py           # REST API con 17 endpoints
│   ├── strategy_auto_translator.py  # Traducción de estrategias
│   ├── openai_analyzer.py          # Integración OpenAI
│   ├── requirements.txt             # Dependencias Python
│   ├── .env.example                 # Template de configuración
│   └── check_config.py              # Verificador de configuración
│
├── frontend/            # Next.js 14 + React 18
│   ├── src/app/        # App Router
│   ├── src/components/ # Componentes React
│   ├── package.json    # Dependencias Node.js
│   └── .env.example    # Template frontend
│
└── start.ps1           # Script de inicio automatizado
```

## 🚀 Instalación Rápida

### Prerrequisitos

- **Python 3.8+** ([Descargar](https://www.python.org/downloads/))
- **Node.js 18+** ([Descargar](https://nodejs.org/))
- **pnpm** (instalar: `npm install -g pnpm`)
- **MetaTrader 5** ([Descargar](https://www.metatrader5.com/))

### Opción 1: Script Automatizado (Recomendado)

```powershell
# Ejecutar desde la raíz del proyecto
.\start.ps1
```

Este script:
- ✅ Verifica todas las dependencias
- ✅ Crea entornos virtuales
- ✅ Instala paquetes automáticamente
- ✅ Configura archivos .env
- ✅ Inicia backend y frontend
- ✅ Abre los navegadores automáticamente

### Opción 2: Instalación Manual

#### Backend

```powershell
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
.\venv\Scripts\Activate.ps1
# O en Linux/Mac: source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
notepad .env  # Editar con tus credenciales MT5

# Verificar configuración
python check_config.py

# Iniciar servidor
uvicorn api:app --reload --host 0.0.0.0 --port 8080
```

#### Frontend

```powershell
cd frontend

# Instalar dependencias
pnpm install

# Configurar variables de entorno (si no existe)
cp .env.example .env.local

# Iniciar aplicación
pnpm dev
```

## ⚙️ Configuración

### Backend (.env)

```env
# Base de datos (opcional)
MONGO_URI=mongodb://localhost:27017/mt5db

# Credenciales MT5 (REQUERIDO)
MT5_LOGIN=tu_numero_de_cuenta
MT5_PASSWORD=tu_contraseña
MT5_SERVER=nombre_del_servidor

# OpenAI (opcional - para análisis IA)
OPENAI_API_KEY=sk-tu-clave-api
OPENAI_MODEL=gpt-4-turbo
OPENAI_MAX_TOKENS=2000

# Servidor API
API_HOST=0.0.0.0
API_PORT=8080
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

## 📋 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/prices` | Obtener precios históricos |
| POST | `/api/strategy/analyze` | Analizar estrategia con IA |
| POST | `/api/strategy/translate` | Traducir estrategia entre lenguajes |
| POST | `/api/strategy/backtest` | Ejecutar backtest |
| POST | `/api/strategy/optimize` | Optimizar parámetros |
| GET | `/api/indicators/rsi` | Calcular RSI |
| GET | `/api/indicators/macd` | Calcular MACD |
| GET | `/api/indicators/bollinger` | Calcular Bollinger Bands |
| GET | `/api/indicators/atr` | Calcular ATR |
| GET | `/api/patterns/detect` | Detectar patrones de velas |
| GET | `/api/risk/calculate` | Calcular métricas de riesgo |
| POST | `/api/orders/place` | Colocar orden en MT5 |
| GET | `/api/orders/active` | Ver órdenes activas |
| GET | `/api/positions` | Ver posiciones abiertas |
| GET | `/api/account` | Información de cuenta |
| GET | `/docs` | Documentación interactiva (Swagger) |

## 🔧 Uso

### 1. Iniciar Aplicación

```powershell
# Desde la raíz del proyecto
.\start.ps1
```

### 2. Abrir Interfaz Web

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8080/docs

### 3. Asegurar MT5 Activo

⚠️ **IMPORTANTE**: MetaTrader 5 debe estar abierto y con sesión iniciada para que funcione la conexión.

### 4. Analizar Estrategia

```python
# Ejemplo: Análisis vía API
import requests

strategy = """
if RSI < 30:
    buy()
if RSI > 70:
    sell()
"""

response = requests.post(
    "http://localhost:8080/api/strategy/analyze",
    json={"strategy_code": strategy}
)

print(response.json())
```

### 5. Traducir Estrategia

```python
# Pine Script → MQL5
pine_code = """
//@version=5
indicator("RSI Strategy")
rsi = ta.rsi(close, 14)
"""

response = requests.post(
    "http://localhost:8080/api/strategy/translate",
    json={
        "code": pine_code,
        "source_language": "pine_script",
        "target_language": "mql5"
    }
)

print(response.json()["translated_code"])
```

## 🧪 Testing

### Verificar Configuración

```powershell
cd backend
python check_config.py
```

### Probar Conexión MT5

```python
import MetaTrader5 as mt5

if not mt5.initialize():
    print("Error: MT5 no conectado")
else:
    print(f"Conectado: {mt5.account_info()}")
    mt5.shutdown()
```

### Ejecutar Tests

```powershell
# Backend
cd backend
pytest

# Frontend
cd frontend
pnpm test
```

## 📊 Stack Tecnológico

### Backend
- **Framework**: FastAPI 0.104+
- **Trading**: MetaTrader5 5.0+
- **Data**: pandas 2.0+, numpy
- **ML**: scikit-learn 1.3+
- **IA**: OpenAI GPT-4 API
- **Visualización**: matplotlib, plotly

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Components**: Radix UI
- **Charts**: Recharts
- **Language**: TypeScript 5

## 🔒 Seguridad

### ✅ Implementado

- ✅ Sin credenciales hardcodeadas
- ✅ Variables de entorno con `.env`
- ✅ `.gitignore` protege archivos sensibles
- ✅ CORS configurado por ambiente
- ✅ Tokens enmascarados en logs
- ✅ Documentación de seguridad (SECURITY.md)

### ⚠️ Recomendaciones

1. **Nunca** commitear archivos `.env` con credenciales reales
2. Usar `.env.example` como template
3. Rotar claves API regularmente
4. Habilitar 2FA en cuentas de trading
5. Usar cuentas demo para desarrollo

### 🔍 Verificar Seguridad

```powershell
# Buscar credenciales expuestas
git grep -i "password\|api_key\|secret"

# Verificar .gitignore
git status | grep .env  # Solo debe mostrar .env.example
```

## 📚 Documentación Adicional

- [Backend README](backend/README.md) - Guía completa del backend
- [Frontend README](frontend/README.md) - Guía completa del frontend
- [SECURITY.md](backend/SECURITY.md) - Guía de seguridad
- [API Docs](http://localhost:8080/docs) - Documentación interactiva Swagger

## 🐛 Troubleshooting

### Error: "MT5 not initialized"
```
Solución:
1. Asegurar MetaTrader 5 está abierto
2. Verificar credenciales en .env
3. Comprobar que el servidor MT5 es correcto
4. Reiniciar MT5 y volver a intentar
```

### Error: "Module not found"
```
Solución:
1. Activar entorno virtual: .\venv\Scripts\Activate.ps1
2. Reinstalar dependencias: pip install -r requirements.txt
3. Verificar versión de Python: python --version (debe ser 3.8+)
```

### Error: "Port already in use"
```
Solución:
1. Cerrar otros procesos en puerto 8080:
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F

2. O cambiar puerto en .env:
   API_PORT=8081
```

### Error: "CORS policy blocked"
```
Solución:
1. Verificar CORS_ORIGINS en backend/.env
2. Debe incluir: http://localhost:3000
3. Reiniciar backend después de cambiar
```

## 🤝 Contribuir

```bash
# Fork el repositorio
git clone https://github.com/tu-usuario/mt5-strategy-analyzer
cd mt5-strategy-analyzer

# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commit
git add .
git commit -m "feat: descripción del cambio"

# Push y crear PR
git push origin feature/nueva-funcionalidad
```

## 📝 Convenciones de Código

- **Backend**: PEP 8 (Python)
- **Frontend**: ESLint + Prettier
- **Commits**: Conventional Commits
- **Branches**: `feature/`, `fix/`, `docs/`

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

## 👥 Autores

Desarrollado con ❤️ para traders algorítmicos.

## 🙏 Agradecimientos

- MetaQuotes por MetaTrader 5 API
- OpenAI por GPT-4 API
- Comunidad de trading algorítmico

---

**⚡ Quick Start**: `.\start.ps1` → http://localhost:3000

**📖 Docs**: http://localhost:8080/docs

**⚠️ Importante**: Asegurar MetaTrader 5 esté abierto antes de usar la aplicación.
