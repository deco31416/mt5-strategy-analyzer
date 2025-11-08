# =====================================================
# MT5 Strategy Analyzer - Complete Startup Script
# =====================================================
# This script checks configuration and starts both backend and frontend

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  MT5 Strategy Analyzer - Startup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

# =====================================================
# 1. PRE-FLIGHT CHECKS
# =====================================================

Write-Host "[1/6] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ERROR: Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/6] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    $pnpmVersion = pnpm --version 2>&1
    Write-Host "  ✓ Found Node: $nodeVersion" -ForegroundColor Green
    Write-Host "  ✓ Found pnpm: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ERROR: Node.js or pnpm not found" -ForegroundColor Red
    Write-Host "  Install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "  Install pnpm: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n[3/6] Checking MetaTrader 5..." -ForegroundColor Yellow
$mt5Paths = @(
    "$env:ProgramFiles\MetaTrader 5\terminal64.exe",
    "$env:ProgramFiles (x86)\MetaTrader 5\terminal64.exe",
    "$env:LOCALAPPDATA\Programs\MetaTrader 5\terminal64.exe"
)

$mt5Found = $false
foreach ($path in $mt5Paths) {
    if (Test-Path $path) {
        Write-Host "  ✓ Found MT5 at: $path" -ForegroundColor Green
        $mt5Found = $true
        break
    }
}

if (-not $mt5Found) {
    Write-Host "  ⚠ WARNING: MT5 not found in common locations" -ForegroundColor Yellow
    Write-Host "  Make sure MetaTrader 5 is installed and running" -ForegroundColor Yellow
}

# =====================================================
# 2. BACKEND SETUP
# =====================================================

Write-Host "`n[4/6] Setting up backend..." -ForegroundColor Yellow
Set-Location "$projectRoot\backend"

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "  Creating Python virtual environment..." -ForegroundColor Cyan
    python -m venv venv
    Write-Host "  ✓ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "  Activating virtual environment..." -ForegroundColor Cyan
& "$projectRoot\backend\venv\Scripts\Activate.ps1"

# Check if dependencies are installed
if (-not (Test-Path "venv\Lib\site-packages\fastapi")) {
    Write-Host "  Installing Python dependencies..." -ForegroundColor Cyan
    pip install --upgrade pip
    pip install -r requirements.txt
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✓ Dependencies already installed" -ForegroundColor Green
}

# Check .env configuration
if (-not (Test-Path ".env")) {
    Write-Host "`n  ⚠ WARNING: .env file not found!" -ForegroundColor Red
    Write-Host "  Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "`n  ========================================" -ForegroundColor Red
    Write-Host "  IMPORTANT: You MUST edit .env file now!" -ForegroundColor Red
    Write-Host "  ========================================" -ForegroundColor Red
    Write-Host "  Add your MT5 credentials:" -ForegroundColor Yellow
    Write-Host "    - MT5_LOGIN=your_account_number" -ForegroundColor Yellow
    Write-Host "    - MT5_PASSWORD=your_password" -ForegroundColor Yellow
    Write-Host "    - MT5_SERVER=your_server_name" -ForegroundColor Yellow
    Write-Host "`n  Optional: Add OpenAI key for AI analysis" -ForegroundColor Cyan
    Write-Host "    - OPENAI_API_KEY=sk-your-key" -ForegroundColor Cyan
    
    $response = Read-Host "`n  Edit .env now? (Y/n)"
    if ($response -ne 'n') {
        notepad ".env"
        Write-Host "`n  Press Enter after saving .env..." -NoNewline
        Read-Host
    } else {
        Write-Host "`n  ✗ Cannot start without proper .env configuration" -ForegroundColor Red
        exit 1
    }
}

# Verify configuration
Write-Host "`n  Verifying configuration..." -ForegroundColor Cyan
python check_config.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n  ✗ Configuration incomplete. Please edit .env" -ForegroundColor Red
    $response = Read-Host "  Edit .env now? (Y/n)"
    if ($response -ne 'n') {
        notepad ".env"
        Write-Host "`n  Press Enter after saving..." -NoNewline
        Read-Host
        python check_config.py
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ✗ Still incomplete. Exiting..." -ForegroundColor Red
            exit 1
        }
    } else {
        exit 1
    }
}

# =====================================================
# 3. FRONTEND SETUP
# =====================================================

Write-Host "`n[5/6] Setting up frontend..." -ForegroundColor Yellow
Set-Location "$projectRoot\frontend"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing Node.js dependencies..." -ForegroundColor Cyan
    pnpm install
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✓ Dependencies already installed" -ForegroundColor Green
}

# Check .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "  Creating .env.local..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env.local"
    Write-Host "  ✓ .env.local created" -ForegroundColor Green
} else {
    Write-Host "  ✓ .env.local exists" -ForegroundColor Green
}

# =====================================================
# 4. START SERVICES
# =====================================================

Write-Host "`n[6/6] Starting services..." -ForegroundColor Yellow
Set-Location $projectRoot

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Ready to start!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Starting Backend (port 8080)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:projectRoot\backend
    & "$using:projectRoot\backend\venv\Scripts\Activate.ps1"
    uvicorn api:app --reload --host 0.0.0.0 --port 8080
}

Start-Sleep -Seconds 3

Write-Host "Starting Frontend (port 3000)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:projectRoot\frontend
    pnpm dev
}

Start-Sleep -Seconds 5

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  🚀 Services Started!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green
Write-Host "Backend API:  http://localhost:8080/docs" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`n⚠  Make sure MetaTrader 5 is running!" -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C to stop both services`n" -ForegroundColor Yellow

# Monitor jobs
try {
    while ($true) {
        # Check if jobs are still running
        if ($backendJob.State -ne "Running") {
            Write-Host "`n✗ Backend stopped unexpectedly" -ForegroundColor Red
            Receive-Job $backendJob
            break
        }
        if ($frontendJob.State -ne "Running") {
            Write-Host "`n✗ Frontend stopped unexpectedly" -ForegroundColor Red
            Receive-Job $frontendJob
            break
        }
        
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host "`nStopping services..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Services stopped`n" -ForegroundColor Green
}
