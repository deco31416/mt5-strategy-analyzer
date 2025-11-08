#!/bin/bash

# MT5 Strategy Analyzer - Backend Setup Script
# Autor: Deco31416

echo "🚀 MT5 Strategy Analyzer - Backend Setup"
echo "=========================================="
echo ""

# Verificar Python
echo "📦 Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado. Por favor instala Python 3.8 o superior."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✅ Python $PYTHON_VERSION encontrado"
echo ""

# Crear entorno virtual
echo "🔧 Creando entorno virtual..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Entorno virtual creado"
else
    echo "⚠️  Entorno virtual ya existe"
fi
echo ""

# Activar entorno virtual
echo "🔌 Activando entorno virtual..."
source venv/bin/activate
echo "✅ Entorno virtual activado"
echo ""

# Actualizar pip
echo "⬆️  Actualizando pip..."
pip install --upgrade pip
echo ""

# Instalar dependencias
echo "📥 Instalando dependencias..."
pip install -r requirements.txt
echo "✅ Dependencias instaladas"
echo ""

# Configurar archivo .env
echo "⚙️  Configurando variables de entorno..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Archivo .env creado desde .env.example"
    echo ""
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales:"
    echo "   - MT5_LOGIN: Tu número de cuenta MT5"
    echo "   - MT5_PASSWORD: Tu contraseña MT5"
    echo "   - MT5_SERVER: Nombre del servidor de tu broker"
    echo "   - OPENAI_API_KEY: Tu API key de OpenAI (opcional)"
    echo ""
    echo "📝 Edita con: nano .env  o  vim .env"
else
    echo "✅ Archivo .env ya existe"
fi
echo ""

# Verificar MT5
echo "🔍 Verificando MetaTrader 5..."
if command -v wine &> /dev/null; then
    echo "✅ Wine encontrado (para ejecutar MT5 en Linux)"
else
    echo "⚠️  Wine no encontrado. Si estás en Linux, instala Wine para ejecutar MT5"
fi
echo ""

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p exports
mkdir -p backups
mkdir -p logs
echo "✅ Directorios creados"
echo ""

# Verificar instalación
echo "✅ Setup completado!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Edita el archivo .env con tus credenciales:"
echo "      nano .env"
echo ""
echo "   2. Asegúrate de que MetaTrader 5 esté abierto y conectado"
echo ""
echo "   3. Inicia el servidor:"
echo "      uvicorn api:app --reload --host 0.0.0.0 --port 8080"
echo ""
echo "   4. Accede a la documentación API:"
echo "      http://localhost:8080/docs"
echo ""
echo "🎉 ¡Listo para usar!"
