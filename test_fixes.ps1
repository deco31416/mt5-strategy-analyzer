# Script de prueba para validar las correcciones

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🧪 PRUEBAS DE VALIDACIÓN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1️⃣ Test: Health Check del Backend" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/health" -Method GET
    Write-Host "✅ Health endpoint responde correctamente" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
    Write-Host "   OpenAI Status: $($health.openai_status.status)" -ForegroundColor Gray
    Write-Host "   OpenAI Message: $($health.openai_status.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error en health check: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Analyze Endpoint
Write-Host "2️⃣ Test: Endpoint /analyze (datos históricos)" -ForegroundColor Yellow
try {
    $analyze = Invoke-RestMethod -Uri "http://localhost:8080/analyze" -Method GET
    Write-Host "✅ Analyze endpoint responde correctamente" -ForegroundColor Green
    
    # Verificar campos críticos
    $summary = $analyze.summary
    
    Write-Host "   📊 Datos recibidos:" -ForegroundColor Gray
    Write-Host "      - Total Trades: $($summary.total_trades)" -ForegroundColor Gray
    Write-Host "      - Historical Total Trades: $($summary.historical_total_trades)" -ForegroundColor Gray
    Write-Host "      - Historical Win Rate: $($summary.historical_win_rate)%" -ForegroundColor Gray
    Write-Host "      - Historical Profit: `$$($summary.historical_profit)" -ForegroundColor Gray
    Write-Host "      - Best Trade: `$$($summary.best_trade)" -ForegroundColor Gray
    Write-Host "      - Worst Trade: `$$($summary.worst_trade)" -ForegroundColor Gray
    Write-Host "      - Strategy: $($summary.strategy)" -ForegroundColor Gray
    
    # Verificar que NO sean undefined/null
    $hasIssues = $false
    
    if ($null -eq $summary.historical_profit) {
        Write-Host "   ❌ historical_profit es NULL" -ForegroundColor Red
        $hasIssues = $true
    }
    
    if ($null -eq $summary.best_trade) {
        Write-Host "   ❌ best_trade es NULL" -ForegroundColor Red
        $hasIssues = $true
    }
    
    if ($null -eq $summary.worst_trade) {
        Write-Host "   ❌ worst_trade es NULL" -ForegroundColor Red
        $hasIssues = $true
    }
    
    if (-not $hasIssues) {
        Write-Host "   ✅ Todos los campos numéricos están presentes" -ForegroundColor Green
    }
    
} catch {
    Write-Host "❌ Error en analyze endpoint: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Verificar que frontend está corriendo
Write-Host "3️⃣ Test: Frontend en localhost:3000" -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -UseBasicParsing
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ Frontend respondiendo correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend no está corriendo o no responde" -ForegroundColor Red
    Write-Host "   Ejecuta: cd frontend; pnpm dev" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📝 RESUMEN DE LAS CORRECCIONES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host @"

✅ 1. Health Check de OpenAI implementado
   - Valida conectividad al arrancar backend
   - Detecta errores específicos (cuota, auth, timeout)
   - Permite continuar sin OpenAI
   - Endpoint: GET /health

✅ 2. Bug de 'undefined' corregido
   - Backend envía valores por defecto (0.0) para números
   - Frontend tiene protección adicional con || 0
   - Ya no hay crashes por .toFixed() en undefined

✅ 3. Validación de tipos mejorada
   - historical_profit: float(x || 0.0)
   - best_trade: float(x || 0.0)
   - worst_trade: float(x || 0.0)
   - Todos los campos numéricos protegidos

📍 SIGUIENTE PASO:
   Abre http://localhost:3000 y verifica que:
   - El panel StrategyDetectionPanel se muestra
   - No hay errores en consola
   - Todos los números se muestran correctamente

"@ -ForegroundColor White

Write-Host "========================================`n" -ForegroundColor Cyan
