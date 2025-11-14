![deco31416](https://github.com/deco31416/deco31416/blob/main/public/31416-white.svg)

# 🚀 MT5 Strategy Analyzer - Backend

Backend API para análisis automático de estrategias de trading en MetaTrader 5 con integración de IA.

## 📋 Características

- ✅ Análisis automático de operaciones MT5
- ✅ Detección inteligente de estrategias
- ✅ Análisis con OpenAI (opcional)
- ✅ Métricas avanzadas de trading
- ✅ Análisis por sesiones (Asia, Londres, NY)
- ✅ Análisis de riesgo y R:R ratio
- ✅ Rendimiento por símbolos
- ✅ Generación de código (MQL4/MQL5/Python/TypeScript)
- ✅ Base de datos con historial
- ✅ API REST completa con FastAPI

## 🛠️ Tecnologías

- **Python 3.8+**
- **FastAPI** - Framework web moderno
- **MetaTrader5** - Integración con MT5
- **OpenAI API** - Análisis con IA
- **Pandas** - Procesamiento de datos
- **SQLite** - Base de datos local
- **Uvicorn** - Servidor ASGI

## 📦 Instalación

### Opción 1: Script Automático (Windows)

```powershell
# Ejecuta el script de setup
.\setup.ps1
```

### Opción 2: Script Automático (Linux/Mac)

```bash
# Dale permisos de ejecución
chmod +x setup.sh

# Ejecuta el script
./setup.sh
```

### Opción 3: Instalación Manual

1. **Crear entorno virtual:**

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. **Instalar dependencias:**

```bash
pip install -r requirements.txt
```

3. **Configurar variables de entorno:**

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus credenciales
nano .env  # o notepad .env en Windows
```

## ⚙️ Configuración

### Archivo `.env`

Edita el archivo `.env` con tus credenciales reales:

```env
# MetaTrader 5 Configuration
MT5_LOGIN=tu_numero_de_cuenta
MT5_PASSWORD=tu_contraseña
MT5_SERVER=nombre_servidor_broker

# OpenAI Configuration (OPCIONAL)
OPENAI_API_KEY=sk-tu-clave-aqui
OPENAI_MODEL=gpt-4-turbo
OPENAI_MAX_TOKENS=2000
```

### Obtener Credenciales

#### MT5 Login y Server:
1. Abre MetaTrader 5
2. Ve a `Tools` → `Options` → `Server`
3. Anota el número de cuenta y nombre del servidor

#### OpenAI API Key (Opcional):
1. Ve a: https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Cópiala en `OPENAI_API_KEY`

> **Nota:** El sistema funciona sin OpenAI (análisis básico). Con OpenAI obtienes análisis más detallado y recomendaciones inteligentes.

## 🚀 Uso

### Iniciar el servidor:

```bash
# Activar entorno virtual primero
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Iniciar servidor
uvicorn api:app --reload --host 0.0.0.0 --port 8080
```

El servidor estará disponible en:
- API: http://localhost:8080
- Documentación: http://localhost:8080/docs
- ReDoc: http://localhost:8080/redoc

### Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/analyze` | GET | Análisis básico (sin IA) |
| `/analyze/full` | GET | Análisis completo con IA |
| `/analyze/sessions` | GET | Análisis por sesiones |
| `/analyze/schedule` | GET | Análisis por horarios |
| `/analyze/risk` | GET | Análisis de riesgo |
| `/analyze/symbols` | GET | Rendimiento por símbolos |
| `/strategy/template` | GET | Generar código de estrategia |
| `/strategy/export` | GET | Exportar archivo de estrategia |
| `/strategy/optimize-enhanced` | POST | Optimización con IA |
| `/history` | GET | Historial de análisis |
| `/history/strategy/{name}` | GET | Evolución de estrategia |
| `/symbol/{symbol}` | GET | Detalle de símbolo |
| `/alerts` | GET | Alertas del sistema |
| `/statistics` | GET | Estadísticas generales |
| `/backup` | POST | Crear backup de DB |

## 📊 Estructura del Proyecto

```
backend/
├── api.py                          # Endpoints de la API
├── strategy_engine.py              # Motor de análisis
├── openai_analyzer.py              # Integración OpenAI
├── strategy_templates.py           # Generador de código
├── database.py                     # Gestión de base de datos
├── strategy_auto_translator.py     # Traductor de estrategias
├── copy_engine.py                  # Motor de copy trading
├── requirements.txt                # Dependencias Python
├── .env.example                    # Ejemplo de configuración
├── .env                           # Tu configuración (NO SUBIR A GIT)
├── .gitignore                     # Archivos ignorados por git
├── setup.ps1                      # Script setup Windows
├── setup.sh                       # Script setup Linux/Mac
├── SECURITY.md                    # Guía de seguridad
└── strategy_data.db               # Base de datos SQLite
```

## 🔒 Seguridad

### ⚠️ IMPORTANTE

**NUNCA subas a Git:**
- Archivo `.env` (ya está en `.gitignore`)
- Credenciales de MT5
- API Keys de OpenAI
- Base de datos con información sensible

### Verificar antes de commit:

```bash
# Verificar que .env esté ignorado
git check-ignore .env

# Verificar archivos a subir
git status

# Buscar credenciales accidentales
grep -r "MT5_PASSWORD\|sk-" --include="*.py" .
```

### Cambiar credenciales si fueron expuestas:

1. **Cambiar contraseña de MT5** en tu broker
2. **Revocar API key de OpenAI** y crear nueva
3. **Limpiar historial de git** si es necesario

Más detalles en: [SECURITY.md](./SECURITY.md)

## 🐛 Troubleshooting

### Error: "MT5 no está inicializado"
- Asegúrate de que MetaTrader 5 esté abierto
- Verifica que estés conectado a tu broker
- Revisa credenciales en `.env`

### Error: "OPENAI_API_KEY no encontrada"
- Es solo un warning, el sistema funciona sin IA
- Si quieres IA, agrega tu API key en `.env`

### Error: "ModuleNotFoundError"
- Activa el entorno virtual: `source venv/bin/activate`
- Reinstala dependencias: `pip install -r requirements.txt`

### Error: "Port 8080 already in use"
- Cambia el puerto: `uvicorn api:app --port 8081`
- O mata el proceso: `lsof -ti:8080 | xargs kill` (Linux/Mac)

## 📚 Documentación

- [API Endpoints](./API_ENDPOINTS.md) - Lista completa de endpoints
- [Security Guide](./SECURITY.md) - Guía de seguridad
- [Backend Upgrades](./BACKEND_UPGRADES.md) - Historial de mejoras

## 🧪 Testing

```bash
# Ejecutar tests
pytest

# Con cobertura
pytest --cov=.
```

## 📈 Roadmap

- [ ] Tests unitarios completos
- [ ] Docker deployment
- [ ] WebSocket para actualizaciones en tiempo real
- [ ] Soporte para más brokers
- [ ] Dashboard de administración
- [ ] Sistema de notificaciones

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

## 👨‍💻 Autor

**Deco31416** 🚀

- GitHub: [@deco31416](https://github.com/deco31416)
- Proyecto: [mt5-strategy-analyzer](https://github.com/deco31416/mt5-strategy-analyzer)

---

**Última actualización:** 7 de noviembre de 2025

¿Preguntas? Abre un [issue](https://github.com/deco31416/mt5-strategy-analyzer/issues) 📝
