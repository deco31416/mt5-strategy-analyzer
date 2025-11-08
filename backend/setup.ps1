# MT5 Strategy Analyzer - Backend Setup Script (Windows)
# Autor: Deco31416

Write-Host "🚀 MT5 Strategy Analyzer - Backend Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Python
Write-Host "📦 Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Python no está instalado. Por favor instala Python 3.8 o superior." -ForegroundColor Red
    Write-Host "   Descarga desde: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Crear entorno virtual
Write-Host "🔧 Creando entorno virtual..." -ForegroundColor Yellow
if (-Not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "✅ Entorno virtual creado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Entorno virtual ya existe" -ForegroundColor Yellow
}
Write-Host ""

# Activar entorno virtual
Write-Host "🔌 Activando entorno virtual..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
Write-Host "✅ Entorno virtual activado" -ForegroundColor Green
Write-Host ""

# Actualizar pip
Write-Host "⬆️  Actualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
Write-Host ""

# Instalar dependencias
Write-Host "📥 Instalando dependencias..." -ForegroundColor Yellow
pip install -r requirements.txt
Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

# Configurar archivo .env
Write-Host "⚙️  Configurando variables de entorno..." -ForegroundColor Yellow
if (-Not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado desde .env.example" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales:" -ForegroundColor Red
    Write-Host "   - MT5_LOGIN: Tu número de cuenta MT5" -ForegroundColor Yellow
    Write-Host "   - MT5_PASSWORD: Tu contraseña MT5" -ForegroundColor Yellow
    Write-Host "   - MT5_SERVER: Nombre del servidor de tu broker" -ForegroundColor Yellow
    Write-Host "   - OPENAI_API_KEY: Tu API key de OpenAI (opcional)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Edita con: notepad .env" -ForegroundColor Cyan
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}
Write-Host ""

# Verificar MT5
Write-Host "🔍 Verificando MetaTrader 5..." -ForegroundColor Yellow
if (Test-Path "C:\Program Files\MetaTrader 5\terminal64.exe") {
    Write-Host "✅ MetaTrader 5 encontrado en la ubicación estándar" -ForegroundColor Green
} else {
    Write-Host "⚠️  MetaTrader 5 no encontrado en la ubicación estándar" -ForegroundColor Yellow
    Write-Host "   Asegúrate de tener MT5 instalado: https://www.metatrader5.com/" -ForegroundColor Yellow
}
Write-Host ""

# Crear directorios necesarios
Write-Host "📁 Creando directorios..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "exports" | Out-Null
New-Item -ItemType Directory -Force -Path "backups" | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
Write-Host "✅ Directorios creados" -ForegroundColor Green
Write-Host ""

# Verificar instalación
Write-Host "✅ Setup completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Edita el archivo .env con tus credenciales:" -ForegroundColor White
Write-Host "      notepad .env" -ForegroundColor Yellow
Write-Host ""
Write-Host "   2. Asegúrate de que MetaTrader 5 esté abierto y conectado" -ForegroundColor White
Write-Host ""
Write-Host "   3. Inicia el servidor:" -ForegroundColor White
Write-Host "      uvicorn api:app --reload --host 0.0.0.0 --port 8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "   4. Accede a la documentación API:" -ForegroundColor White
Write-Host "      http://localhost:8080/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 ¡Listo para usar!" -ForegroundColor Green

# Preguntar si desea abrir el editor
Write-Host ""
$openEditor = Read-Host "¿Deseas editar el archivo .env ahora? (s/n)"
if ($openEditor -eq "s" -or $openEditor -eq "S") {
    notepad .env
}
