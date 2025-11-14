'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfitEvolutionChart from '@/components/charts/ProfitEvolutionChart'
import StrategyExplainer from '@/components/StrategyExplainer'
import StrategyDetectionPanel from '@/components/StrategyDetectionPanel'
import HyperliquidReplicator from '@/components/HyperliquidReplicator'
import HistoryPanel from '@/components/HistoryPanel'
import AlertsPanel from '@/components/AlertsPanel'
import StatisticsPanel from '@/components/StatisticsPanel'
import ConnectionError from '@/components/ConnectionError'
import NavigationMenu from '@/components/NavigationMenu'
import LegalFooter from '@/components/LegalFooter'
import SubFooter from '@/components/SubFooter'
import { AIAnalysisCard } from '@/components/AIAnalysisCard'
import { AdvancedMetricsCards } from '@/components/AdvancedMetricsCards'
import { StrategyOptimizationModal } from '@/components/StrategyOptimizationModal'
import { StrategyEvolutionChart } from '@/components/StrategyEvolutionChart'
import { SymbolDetailModal } from '@/components/SymbolDetailModal'
import { SessionAnalysisCard } from '@/components/SessionAnalysisCard'
import { ScheduleAnalysisCard } from '@/components/ScheduleAnalysisCard'
import { RiskAnalysisCard } from '@/components/RiskAnalysisCard'
import { SymbolPerformanceCard } from '@/components/SymbolPerformanceCard'
import { TradesHistoryPanel } from '@/components/TradesHistoryPanel'

interface ApiTrade {
  ticket: number
  symbol: string
  type: string
  volume: number
  price_open: number
  profit: number
  time: string
}

interface AnalysisResult {
  summary: {
    total_trades: number
    net_profit: number
    avg_profit: number
    strategy: string
    strategy_description: string
    timeframe: string
    indicators: string[]
    explanation: string
    win_rate?: number
    profit_factor?: number
    max_drawdown?: number
    sharpe_ratio?: number
    account_balance?: number
    account_equity?: number
    last_update?: string
    // Campos históricos en summary (referencia rápida)
    historical_total_trades?: number
    historical_win_rate?: number
    historical_profit?: number
    best_trade?: number
    worst_trade?: number
    longest_win_streak?: number
    longest_loss_streak?: number
    avg_trade_duration?: number
    best_session?: string
    worst_session?: string
    best_hour?: number
    best_day?: string
    avg_risk_reward?: number
    risk_per_trade?: number
    best_symbol?: string
    worst_symbol?: string
    trading_style?: string
    risk_profile?: string
  }
  trades: ApiTrade[]
  // Objetos completos de análisis (nivel superior)
  historical_metrics?: {
    total_trades: number
    win_rate: number
    total_profit: number
    best_trade: number
    worst_trade: number
    longest_win_streak: number
    longest_loss_streak: number
    avg_duration_minutes: number
    deals_df?: any
  }
  session_analysis?: ({
    [key: string]: {
      total_profit: number
      trade_count: number
      avg_profit: number
      win_rate: number
    }
  } & {
    best_session?: string
    worst_session?: string
  })
  schedule_analysis?: {
    by_hour?: { [key: string]: any }
    by_day?: { [key: string]: any }
    best_hour?: number
    best_day?: string
  }
  risk_analysis?: {
    avg_win: number
    avg_loss: number
    risk_reward_ratio: number
    risk_per_trade_pct: number
    avg_rr?: number
    avg_risk_percent?: number
  }
  symbol_analysis?: ({
    [key: string]: {
      total_profit: number
      trade_count: number
      win_rate: number
    }
  } & {
    best_symbol?: string
    worst_symbol?: string
  })
  ai_analysis?: {
    ai_powered: boolean
    strategy_name: string
    strategy_description: string
    confidence_score: number
    detailed_analysis: string
    strengths: string[]
    weaknesses: string[]
    market_conditions: string
    indicators_detected: string[]
    trading_style: string
    risk_profile: string
  }
}

interface StrategyCode {
  mql4: string
  mql5: string
  python: string
  typescript: string
  explanation: string
}

export default function Home() {
  const [data, setData] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [codeData, setCodeData] = useState<StrategyCode | null>(null)
  const [loadingCode, setLoadingCode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<'mql4' | 'mql5' | 'python' | 'typescript'>('mql5')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'analysis' | 'guide' | 'hyperliquid' | 'control'>('analysis')
  const [historyData, setHistoryData] = useState<any[]>([])
  const [alertsData, setAlertsData] = useState<any[]>([])
  const [statisticsData, setStatisticsData] = useState<any>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingAlerts, setLoadingAlerts] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [tradesHistoryData, setTradesHistoryData] = useState<any[]>([])
  const [loadingTradesHistory, setLoadingTradesHistory] = useState(false)
  
  // Estados para los nuevos modales
  const [showOptimizationModal, setShowOptimizationModal] = useState(false)
  const [showSymbolModal, setShowSymbolModal] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState<string>('')
  const [useBasicAnalysis, setUseBasicAnalysis] = useState(false)
  const [exportingStrategy, setExportingStrategy] = useState(false)

  const analyzeAccount = async () => {
    setLoading(true)
    setConnectionError(null)
    try {
      // Usar análisis básico o completo según toggle
      const endpoint = useBasicAnalysis ? '/analyze' : '/analyze/full'
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${endpoint}`)
      const result = await response.json()
      
      // Verificar si hay error de conexión MT5
      if (result.error) {
        setConnectionError(result.error)
        setData(null)
      } else {
        console.log(`API Response (${useBasicAnalysis ? 'Basic' : 'Full'} Analysis):`, result)
        setData(result)
        
        // Log de datos IA si está disponible
        if (!useBasicAnalysis && result.ai_analysis?.ai_powered) {
          console.log('✅ Análisis con IA activado:', result.ai_analysis.strategy_name)
          console.log('📊 Confianza:', result.ai_analysis.confidence_score + '%')
        } else if (useBasicAnalysis) {
          console.log('⚡ Análisis básico (sin IA, más rápido)')
        } else {
          console.log('⚠️ Análisis básico (OpenAI no configurado)')
        }
      }
    } catch (error) {
      console.error('Error analyzing account:', error)
      setConnectionError('Error de conexión con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:8080')
    }
    setLoading(false)
  }

  const exportStrategy = async () => {
    if (!data?.summary?.strategy) {
      alert('No hay estrategia detectada para exportar')
      return
    }

    setExportingStrategy(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/strategy/export?strategy=${encodeURIComponent(data.summary.strategy)}&language=${selectedLanguage}`
      )
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        // Determinar extensión según lenguaje
        const extensions: { [key: string]: string } = {
          'mql4': '.mq4',
          'mql5': '.mq5',
          'python': '.py',
          'typescript': '.ts'
        }
        const ext = extensions[selectedLanguage] || '.txt'
        a.download = `${data.summary.strategy}${ext}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        console.log('✅ Estrategia exportada:', data.summary.strategy)
      } else {
        console.error('Error exportando estrategia')
        alert('Error al exportar la estrategia')
      }
    } catch (error) {
      console.error('Error exportando estrategia:', error)
      alert('Error al exportar la estrategia')
    }
    setExportingStrategy(false)
  }

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/history?limit=50`)
      const result = await response.json()
      setHistoryData(result.history || [])
    } catch (error) {
      console.error('Error loading history:', error)
      setHistoryData([])
    }
    setLoadingHistory(false)
  }

  const loadAlerts = async () => {
    setLoadingAlerts(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/alerts?limit=20`)
      const result = await response.json()
      setAlertsData(result.alerts || [])
    } catch (error) {
      console.error('Error loading alerts:', error)
      setAlertsData([])
    }
    setLoadingAlerts(false)
  }

  const loadStatistics = async () => {
    setLoadingStats(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/statistics`)
      const result = await response.json()
      setStatisticsData(result)
    } catch (error) {
      console.error('Error loading statistics:', error)
      setStatisticsData(null)
    }
    setLoadingStats(false)
  }

  const loadTradesHistory = async () => {
    setLoadingTradesHistory(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/trades/history?limit=200&days_back=90`)
      const result = await response.json()
      setTradesHistoryData(result.trades || [])
    } catch (error) {
      console.error('Error loading trades history:', error)
      setTradesHistoryData([])
    }
    setLoadingTradesHistory(false)
  }

  const generateDemoData = () => {
    // Generar datos de demostración
    const demoTrades: ApiTrade[] = Array.from({ length: 15 }, (_, i) => ({
      ticket: 1000 + i,
      symbol: 'EURUSD',
      type: i % 3 === 0 ? 'SELL' : 'BUY',
      volume: 0.01 + (Math.random() * 0.09),
      price_open: 1.0950 + (Math.random() * 0.01),
      profit: (Math.random() - 0.4) * 50,
      time: new Date(Date.now() - (i * 3600000)).toISOString()
    }))

    const totalProfit = demoTrades.reduce((sum, t) => sum + t.profit, 0)
    const wins = demoTrades.filter(t => t.profit > 0).length

    setData({
      summary: {
        total_trades: demoTrades.length,
        net_profit: totalProfit,
        avg_profit: totalProfit / demoTrades.length,
        strategy: 'Grid/Scalping (DEMO)',
        strategy_description: 'Estrategia de demostración con múltiples posiciones en niveles de precio',
        timeframe: 'M15-H1',
        indicators: ['Support/Resistance levels', 'Moving Averages', 'Bollinger Bands'],
        explanation: 'Datos de demostración para visualizar las funcionalidades del analizador sin conexión a MT5.'
      },
      trades: demoTrades
    })
    setConnectionError(null)
  }

  const generateCode = async () => {
    if (!data?.summary?.strategy) return
    
    setLoadingCode(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/strategy/template?strategy=${encodeURIComponent(data.summary.strategy)}`)
      const result = await response.json()
      setCodeData(result)
      
      // Force re-render to update report with code explanation
      setData({...data})
    } catch (error) {
      console.error('Error generating code:', error)
    }
    setLoadingCode(false)
  }

  const downloadCode = () => {
    if (!codeData) return
    
    const code = codeData[selectedLanguage]
    const extension = selectedLanguage === 'python' ? 'py' : 
                     selectedLanguage === 'typescript' ? 'ts' : 
                     selectedLanguage === 'mql4' ? 'mq4' : 'mq5'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `strategy.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadReport = () => {
    if (!data) return
    
    const report = generateMarkdownReport(data)
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'strategy_report.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOptimizationResult = (result: any) => {
    console.log('✅ Optimización completada:', result)
    // Aquí podrías actualizar el estado o mostrar una notificación
  }

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol)
    setShowSymbolModal(true)
  }

  const generateMarkdownReport = (data: AnalysisResult): string => {
    const { summary, trades } = data
    
    const winningTrades = trades.filter(t => t.profit > 0).length
    const losingTrades = trades.filter(t => t.profit < 0).length
    const winRate = ((winningTrades / trades.length) * 100).toFixed(1)
    const largestWin = Math.max(...trades.map(t => t.profit)).toFixed(2)
    const largestLoss = Math.min(...trades.map(t => t.profit)).toFixed(2)
    const totalVolume = trades.reduce((sum, t) => sum + t.volume, 0).toFixed(2)
    const avgDuration = calculateAvgDuration(trades)
    const asciiChart = generateASCIIChart(trades)
    
    const indicatorsList = summary.indicators.map(ind => `- ${ind}`).join('\n')
    const tradesTable = trades.map((t, i) => 
      `| ${i + 1} | ${t.symbol} | ${t.type} | ${t.volume} | ${t.price_open} | $${t.profit.toFixed(2)} | ${new Date(t.time).toLocaleString()} |`
    ).join('\n')
    
    const marketVolatility = summary.timeframe === 'M1-M5' ? 'High frequency/scalping' : 
                           summary.timeframe === 'H1-H4' ? 'Medium-term swing' : 
                           'Long-term position trading'
    
    const marketConditions = summary.strategy.includes('Grid') ? 'Ranging/sideways markets' : 
                           summary.strategy.includes('Trend') ? 'Strong trending markets' : 
                           'Adaptive to various conditions'
    
    const implementationGuide = codeData ? codeData.explanation : 
`### Implementation Notes

This strategy was detected based on the trading patterns in your MT5 account.
To implement it:

1. **Analyze the pattern**: ${summary.explanation}
2. **Use the recommended indicators**: ${summary.indicators.join(', ')}
3. **Set appropriate timeframe**: ${summary.timeframe}
4. **Test on demo account first** before going live
5. **Monitor risk management** and adjust lot sizes accordingly

Click "Generar Código" to get the complete implementation in MQL4, MQL5, or Python.`
    
    return `# MT5 Strategy Analysis Report

## 📊 Summary

**Strategy:** ${summary.strategy}
**Description:** ${summary.strategy_description}
**Timeframe:** ${summary.timeframe}
**Total Trades:** ${summary.total_trades}
**Net Profit:** $${summary.net_profit.toFixed(2)}
**Average Profit:** $${summary.avg_profit.toFixed(2)}

## 🎯 Strategy Analysis

${summary.explanation}

## 📈 Recommended Indicators

${indicatorsList}

---

## 💹 Profit Evolution (ASCII Chart)

\`\`\`
${asciiChart}
\`\`\`

---

## 📋 Detailed Trades

| # | Symbol | Type | Volume | Price | Profit | Time |
|---|--------|------|--------|-------|--------|------|
${tradesTable}

---

## 📊 Statistics

- **Winning Trades:** ${winningTrades}
- **Losing Trades:** ${losingTrades}
- **Win Rate:** ${winRate}%
- **Largest Win:** $${largestWin}
- **Largest Loss:** $${largestLoss}
- **Average Trade Duration:** ${avgDuration}
- **Total Volume Traded:** ${totalVolume} lots

---

## 🤖 Strategy Implementation Guide

${implementationGuide}

---

## 🎓 Educational Resources

### Understanding ${summary.strategy}

**Best Practices:**
- Always use proper risk management (1-2% per trade)
- Test strategies on demo accounts extensively
- Monitor market conditions and adjust parameters
- Keep a trading journal to track performance
- Use stop losses to protect capital

**When to Use This Strategy:**
- Market volatility: ${marketVolatility}
- Best market conditions: ${marketConditions}

**Risk Warnings:**
⚠️ Trading involves substantial risk of loss
⚠️ Past performance does not guarantee future results
⚠️ Only trade with capital you can afford to lose
⚠️ Always use proper position sizing and risk management

---

*Generated by MT5 Strategy Analyzer on ${new Date().toLocaleString()}*
*Total Trades Analyzed: ${summary.total_trades} | Net P/L: $${summary.net_profit.toFixed(2)}*
`
  }

  const calculateAvgDuration = (trades: ApiTrade[]): string => {
    if (trades.length < 2) return 'N/A'
    
    const times = trades.map(t => new Date(t.time).getTime())
    const durations = times.slice(1).map((time, i) => time - times[i])
    const avgMs = durations.reduce((sum, d) => sum + d, 0) / durations.length
    
    const hours = Math.floor(avgMs / (1000 * 60 * 60))
    const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  const generateASCIIChart = (trades: ApiTrade[]): string => {
    const height = 10
    const width = Math.min(trades.length, 50)
    
    let cumulative = 0
    const profits = trades.slice(0, width).map(t => {
      cumulative += t.profit
      return cumulative
    })
    
    const max = Math.max(...profits, 0)
    const min = Math.min(...profits, 0)
    const range = max - min || 1
    
    let chart = ''
    for (let row = height; row >= 0; row--) {
      const value = min + (range * row / height)
      let line = value.toFixed(0).padStart(6) + ' |'
      
      for (let col = 0; col < profits.length; col++) {
        const normalized = (profits[col] - min) / range * height
        if (Math.abs(normalized - row) < 0.5) {
          line += '●'
        } else {
          line += ' '
        }
      }
      chart += line + '\n'
    }
    
    chart += '       +' + '-'.repeat(profits.length) + '\n'
    chart += '        ' + '1'.padEnd(profits.length / 2) + profits.length
    
    return chart
  }

  // Cargar datos del backend cuando se cambia a la vista de control
  useEffect(() => {
    if (activeView === 'control') {
      loadHistory()
      loadAlerts()
      loadStatistics()
      loadTradesHistory()
    }
  }, [activeView])

  return (
    <div className="min-h-screen bg-black">
      {/* Header with orange accent */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* <h1 className="text-3xl font-bold font-heading">
              <span className="text-white">MT5</span>
              <span className="text-orange-500"> Strategy Analyzer</span>
              <span className="ml-3 text-orange-500">⚡</span>
            </h1> */}
            <NavigationMenu />  
            <div className="text-xs text-zinc-500">
              Developed by <span className="text-orange-500 font-semibold">Deco31416</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Mostrar error de conexión si existe */}
        {connectionError && !data && (
          <ConnectionError 
            error={connectionError}
            onRetry={analyzeAccount}
            onGenerateDemo={generateDemoData}
          />
        )}

        {/* Contenido principal (solo si no hay error o ya se generaron datos demo) */}
        {(!connectionError || data) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300 card-hover">
            <CardHeader>
              <CardTitle className="text-white font-semibold">MT5 Analysis</CardTitle>
              <CardDescription className="text-zinc-400">
                Analyze your current MT5 account strategy. Make sure MT5 is open and connected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Toggle para análisis básico/completo */}
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-300">
                    {useBasicAnalysis ? '⚡ Análisis Rápido' : 'Análisis con IA'}
                  </span>
                </div>
                <button
                  onClick={() => setUseBasicAnalysis(!useBasicAnalysis)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    useBasicAnalysis ? 'bg-blue-600' : 'bg-orange-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      useBasicAnalysis ? 'left-1' : 'left-7'
                    }`}
                  />
                </button>
              </div>
              
              <Button
                onClick={analyzeAccount}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                {loading ? 'Analyzing...' : useBasicAnalysis ? '⚡ Analizar Rápido' : '🤖 Analizar con IA'}
              </Button>

              {/* Botones de navegación */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-zinc-800">
                <Button
                  onClick={() => setActiveView('analysis')}
                  variant="outline"
                  className={`w-full transition-all duration-300 ${
                    activeView === 'analysis' 
                      ? 'bg-orange-600/40 border-orange-500 text-orange-200' 
                      : 'bg-orange-600/20 border-orange-500/50 hover:bg-orange-600/30 text-orange-300 hover:text-orange-200'
                  }`}
                >
                  Ver Estrategia
                </Button>

                <Button
                  onClick={() => setActiveView('control')}
                  variant="outline"
                  className={`w-full transition-all duration-300 ${
                    activeView === 'control'
                      ? 'bg-green-600/40 border-green-500 text-green-200'
                      : 'bg-green-600/20 border-green-500/50 hover:bg-green-600/30 text-green-300 hover:text-green-200'
                  }`}
                >
                  Estadisticas y Analisis 
                </Button>

                <Button
                  onClick={() => setActiveView('guide')}
                  variant="outline"
                  className={`w-full transition-all duration-300 ${
                    activeView === 'guide'
                      ? 'bg-purple-600/40 border-purple-500 text-purple-200'
                      : 'bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200'
                  }`}
                >
                  Manual de la Estrategia
                </Button>
                
                <Button
                  onClick={() => setActiveView('hyperliquid')}
                  variant="outline"
                  className={`w-full transition-all duration-300 ${
                    activeView === 'hyperliquid'
                      ? 'bg-cyan-600/40 border-cyan-500 text-cyan-200'
                      : 'bg-cyan-600/20 border-cyan-500/50 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200'
                  }`}
                >
                  Estrategia en Hyperliquid
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contenido Principal - Vista dinámica según activeView */}
          <div className="lg:col-span-2">
            {/* Vista: Análisis de Estrategia */}
            {activeView === 'analysis' && data && (
              <>
                {/* Estrategia Detectada */}
                <div id="strategy-detected" className="mb-6">
                  <Card className="bg-zinc-900 border-zinc-800 card-hover">
                    <CardHeader>
                      <CardTitle className="text-white font-semibold flex items-center gap-2">
                        <span className="text-orange-500">🎯</span>
                        Strategy Detected
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        {data.summary?.strategy_description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                        <div className="text-2xl font-bold text-orange-500">
                          {data.summary?.total_trades || 0}
                        </div>
                        <div className="text-sm text-zinc-400">Trades</div>
                      </div>
                      <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                        <div className={`text-2xl font-bold ${data.summary?.net_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${data.summary?.net_profit?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-zinc-400">Net Profit</div>
                      </div>
                      <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                        <div className={`text-2xl font-bold ${data.summary?.avg_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${data.summary?.avg_profit?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-zinc-400">Avg Profit</div>
                      </div>
                      <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                        <div className="text-2xl font-bold text-orange-500">
                          {data.summary?.timeframe || 'N/A'}
                        </div>
                        <div className="text-sm text-zinc-400">Timeframe</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-white font-medium">Indicadores sugeridos:</span>
                        <div className="text-zinc-300 text-sm">
                          {data.summary?.indicators?.join(', ') || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-white font-medium">Análisis:</span>
                        <div className="text-zinc-300 text-sm">
                          {data.summary?.explanation || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-4">
                      <Button
                        onClick={generateCode}
                        disabled={loadingCode}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loadingCode ? 'Generando...' : '💻 Generar Código'}
                      </Button>
                      <Button
                        onClick={downloadReport}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        📥 Descargar Reporte
                      </Button>
                      <Button
                        onClick={() => setShowOptimizationModal(true)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        🤖 Optimizar con IA
                      </Button>
                      <Button
                        onClick={exportStrategy}
                        disabled={exportingStrategy}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {exportingStrategy ? 'Exportando...' : '📦 Exportar Archivo'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </div>

                {/* Strategy Detection Panel - NUEVO: Muestra cómo se determinó la estrategia */}
                <div className="mb-6">
                  <StrategyDetectionPanel summary={data.summary} />
                </div>

                {/* AI Analysis Card - NUEVO */}
                {data.ai_analysis && (
                  <div className="mb-6">
                    <AIAnalysisCard analysis={data.ai_analysis} />
                  </div>
                )}

                {/* Advanced Metrics Cards - NUEVO */}
                {(data.summary?.historical_total_trades || data.historical_metrics) && (
                  <div className="mb-6">
                    <AdvancedMetricsCards data={data} onSymbolClick={handleSymbolClick} />
                  </div>
                )}

                {/* Strategy Evolution Chart - NUEVO */}
                {data.summary?.strategy && (
                  <div className="mb-6">
                    <StrategyEvolutionChart strategyName={data.summary.strategy} />
                  </div>
                )}

                {/* Session Analysis - NUEVO */}
                {data.session_analysis && (
                  <div className="mb-6">
                    <SessionAnalysisCard sessionAnalysis={data.session_analysis} />
                  </div>
                )}

                {/* Schedule Analysis - NUEVO */}
                {data.schedule_analysis && (
                  <div className="mb-6">
                    <ScheduleAnalysisCard scheduleAnalysis={data.schedule_analysis} />
                  </div>
                )}

                {/* Risk Analysis - NUEVO */}
                {data.risk_analysis && (
                  <div className="mb-6">
                    <RiskAnalysisCard riskAnalysis={data.risk_analysis} />
                  </div>
                )}

                {/* Symbol Performance - NUEVO */}
                {data.symbol_analysis && (
                  <div className="mb-6">
                    <SymbolPerformanceCard 
                      symbolAnalysis={data.symbol_analysis} 
                      onSymbolClick={handleSymbolClick}
                    />
                  </div>
                )}

                {/* Code Generator Section */}
                {codeData && (
                  <div className="mb-6">
                  <Card className="bg-zinc-900 border-zinc-800 card-hover">
                    <CardHeader>
                      <CardTitle className="text-white font-semibold flex items-center gap-2">
                        <span className="text-orange-500">💻</span>
                        Strategy Code Generator
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Código generado para replicar esta estrategia
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Language Selector */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedLanguage('mql4')}
                            className={`${selectedLanguage === 'mql4' ? 'bg-orange-600' : 'bg-zinc-800 border border-zinc-700'} hover:bg-orange-700`}
                          >
                            MQL4
                          </Button>
                          <Button
                            onClick={() => setSelectedLanguage('mql5')}
                            className={`${selectedLanguage === 'mql5' ? 'bg-orange-600' : 'bg-zinc-800 border border-zinc-700'} hover:bg-orange-700`}
                          >
                            MQL5
                          </Button>
                          <Button
                            onClick={() => setSelectedLanguage('python')}
                            className={`${selectedLanguage === 'python' ? 'bg-orange-600' : 'bg-zinc-800 border border-zinc-700'} hover:bg-orange-700`}
                          >
                            Python
                          </Button>
                          <Button
                            onClick={() => setSelectedLanguage('typescript')}
                            className={`${selectedLanguage === 'typescript' ? 'bg-orange-600' : 'bg-zinc-800 border border-zinc-700'} hover:bg-orange-700`}
                          >
                            TypeScript/Node
                          </Button>
                        </div>

                        {/* Code Display */}
                        <div className="bg-black/60 rounded-lg p-4 overflow-x-auto border border-zinc-800">
                          <pre className="text-zinc-300 text-sm">
                            <code>{codeData[selectedLanguage]}</code>
                          </pre>
                        </div>

                        {/* Explanation */}
                        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                          <h4 className="text-white font-semibold mb-2">📖 Explicación del código:</h4>
                          <p className="text-zinc-300 text-sm whitespace-pre-wrap">{codeData.explanation}</p>
                        </div>

                        {/* Download Button */}
                        <Button
                          onClick={downloadCode}
                          className="w-full bg-orange-600 hover:bg-orange-700 font-semibold"
                        >
                          Descargar {selectedLanguage.toUpperCase()}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </div>
                )}

                {/* Advanced Charts Section */}
                <div className="mb-6">
                <ProfitEvolutionChart data={data.trades || []} />
                </div>

                {/* Trades Table */}
                <div className="mb-6">
                <Card className="bg-zinc-900 border-zinc-800 card-hover">
                  <CardHeader>
                    <CardTitle className="text-white font-semibold flex items-center gap-2">
                      <span className="text-orange-500">📊</span>
                      Detailed Trades
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Todas las posiciones detectadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="text-left text-zinc-400 py-2">#</th>
                            <th className="text-left text-zinc-400 py-2">Ticket</th>
                            <th className="text-left text-zinc-400 py-2">Symbol</th>
                            <th className="text-left text-zinc-400 py-2">Type</th>
                            <th className="text-left text-zinc-400 py-2">Volume</th>
                            <th className="text-left text-zinc-400 py-2">Price</th>
                            <th className="text-left text-zinc-400 py-2">Profit</th>
                            <th className="text-left text-zinc-400 py-2">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.trades.map((trade, index) => (
                            <tr key={trade.ticket} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                              <td className="text-zinc-300 py-2">{index + 1}</td>
                              <td className="text-zinc-300 py-2">{trade.ticket}</td>
                              <td className="text-zinc-300 py-2">{trade.symbol}</td>
                              <td className={`py-2 font-semibold ${trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                {trade.type}
                              </td>
                              <td className="text-zinc-300 py-2">{trade.volume}</td>
                              <td className="text-zinc-300 py-2">{trade.price_open.toFixed(2)}</td>
                              <td className={`py-2 font-semibold ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${trade.profit.toFixed(2)}
                              </td>
                              <td className="text-zinc-400 py-2 text-xs">
                                {new Date(trade.time).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </>
            )}

            {/* Vista: Guía para Principiantes */}
            {activeView === 'guide' && data && (
              <div id="guide-section">
                <StrategyExplainer
                  strategy={data.summary.strategy}
                  timeframe={data.summary.timeframe}
                  indicators={data.summary.indicators}
                  explanation={data.summary.explanation}
                />
              </div>
            )}

            {/* Vista: Hyperliquid DEX */}
            {activeView === 'hyperliquid' && data && (
              <div id="hyperliquid-section">
                <HyperliquidReplicator
                  strategy={data.summary.strategy}
                  timeframe={data.summary.timeframe}
                  netProfit={data.summary.net_profit}
                  avgProfit={data.summary.avg_profit}
                  totalTrades={data.summary.total_trades}
                />
              </div>
            )}

            {/* Vista: Estadisticas y Analisis */}
            {activeView === 'control' && (
              <div id="control-section">
                <Card className="bg-zinc-900 border-zinc-800 card-hover">
                  <CardHeader>
                    <CardTitle className="text-white font-semibold flex items-center gap-2">
                      <span className="text-green-500">🗄️</span>
                      Estadisticas y Analisis
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Historial, alertas y estadísticas globales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="history" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="history">Historial</TabsTrigger>
                        <TabsTrigger value="trades">Operaciones</TabsTrigger>
                        <TabsTrigger value="alerts">Alertas</TabsTrigger>
                        <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="history">
                        <HistoryPanel 
                          data={historyData} 
                          loading={loadingHistory}
                          onRefresh={loadHistory}
                        />
                      </TabsContent>
                      
                      <TabsContent value="trades">
                        <TradesHistoryPanel 
                          data={tradesHistoryData} 
                          loading={loadingTradesHistory}
                          onRefresh={loadTradesHistory}
                          total={tradesHistoryData.length}
                        />
                      </TabsContent>
                      
                      <TabsContent value="alerts">
                        <AlertsPanel 
                          data={alertsData}
                          loading={loadingAlerts}
                          onRefresh={loadAlerts}
                        />
                      </TabsContent>
                      
                      <TabsContent value="stats">
                        <StatisticsPanel 
                          data={statisticsData}
                          loading={loadingStats}
                          onRefresh={loadStatistics}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <StrategyOptimizationModal 
        isOpen={showOptimizationModal} 
        onClose={() => setShowOptimizationModal(false)} 
        strategyData={data}
        onOptimize={handleOptimizationResult}
      />
      
      <SymbolDetailModal 
        isOpen={showSymbolModal} 
        onClose={() => setShowSymbolModal(false)} 
        symbol={selectedSymbol}
      />

      {/* Footers */}
      <LegalFooter />
      <SubFooter />
    </div>
  )
}