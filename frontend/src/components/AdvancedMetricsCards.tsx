import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AdvancedMetricsProps {
  data: {
    summary?: {
      historical_total_trades?: number
      historical_win_rate?: number
      historical_profit?: number
      best_trade?: number
      worst_trade?: number
      longest_win_streak?: number
      longest_loss_streak?: number
      best_session?: string
      worst_session?: string
      best_symbol?: string
      worst_symbol?: string
    }
    // Métricas históricas (objeto completo)
    historical_metrics?: {
      total_trades: number
      win_rate: number
      total_profit: number
      best_trade: number
      worst_trade: number
      longest_win_streak: number
      longest_loss_streak: number
    }
    // Análisis de sesiones
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
    // Análisis de horario
    schedule_analysis?: {
      by_hour?: { [key: string]: any }
      by_day?: { [key: string]: any }
    }
    // Análisis de riesgo
    risk_analysis?: {
      avg_win: number
      avg_loss: number
      risk_reward_ratio: number
      risk_per_trade_pct: number
    }
    // Análisis de símbolos
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
  }
  onSymbolClick?: (symbol: string) => void
}

export function AdvancedMetricsCards({ data, onSymbolClick }: AdvancedMetricsProps) {
  // Si no hay datos históricos, no mostrar nada
  // Los datos pueden venir en data.summary (campos individuales) o data.historical_metrics (objeto completo)
  const hasHistoricalData = data.summary?.historical_total_trades || data.historical_metrics?.total_trades
  
  if (!hasHistoricalData) {
    return null
  }

  // Obtener valores desde summary (backend los pone ahí)
  const historicalTrades = data.summary?.historical_total_trades || data.historical_metrics?.total_trades || 0
  const historicalWinRate = data.summary?.historical_win_rate || data.historical_metrics?.win_rate || 0
  const historicalProfit = data.summary?.historical_profit || data.historical_metrics?.total_profit || 0
  const bestTrade = data.summary?.best_trade || data.historical_metrics?.best_trade || 0
  const worstTrade = data.summary?.worst_trade || data.historical_metrics?.worst_trade || 0
  const longestWinStreak = data.summary?.longest_win_streak || data.historical_metrics?.longest_win_streak || 0
  const longestLossStreak = data.summary?.longest_loss_streak || data.historical_metrics?.longest_loss_streak || 0
  const bestSession = data.summary?.best_session || data.session_analysis?.best_session
  const worstSession = data.summary?.worst_session || data.session_analysis?.worst_session
  const bestSymbol = data.summary?.best_symbol || data.symbol_analysis?.best_symbol
  const worstSymbol = data.summary?.worst_symbol || data.symbol_analysis?.worst_symbol

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Métricas Históricas */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>📈</span> Análisis Histórico (90 días)
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Análisis completo de tu historial de trading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Total Operaciones</div>
              <div className="text-lg font-bold text-white">{historicalTrades}</div>
            </div>
            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Win Rate</div>
              <div className={`text-lg font-bold ${historicalWinRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                {historicalWinRate.toFixed(1)}%
              </div>
            </div>
            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Mejor Trade</div>
              <div className="text-lg font-bold text-green-400">${bestTrade.toFixed(2)}</div>
            </div>
            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Peor Trade</div>
              <div className="text-lg font-bold text-red-400">${worstTrade.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-700">
            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
              <div className="text-xs text-green-400 mb-1">Racha Ganadora</div>
              <div className="text-xl font-bold text-green-300">{longestWinStreak} trades</div>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
              <div className="text-xs text-red-400 mb-1">Racha Perdedora</div>
              <div className="text-xl font-bold text-red-300">{longestLossStreak} trades</div>
            </div>
          </div>

          <div className="bg-zinc-800/50 p-3 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Ganancia Histórica Total</div>
            <div className={`text-2xl font-bold ${historicalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${historicalProfit.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Sesiones */}
      {data.session_analysis && (
        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span>🌍</span> Análisis por Sesión
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Rendimiento en diferentes sesiones de trading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {Object.entries(data.session_analysis).map(([session, stats]) => {
                // Filtrar best_session y worst_session que son strings, no objetos de stats
                if (session === 'best_session' || session === 'worst_session' || typeof stats !== 'object' || !stats.total_profit) {
                  return null
                }
                return (
                <div 
                  key={session}
                  className={`p-3 rounded-lg border ${
                    session === bestSession 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : session === worstSession
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-zinc-800/50 border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {session === 'Asian' && '🌏'} 
                        {session === 'London' && '🌍'} 
                        {session === 'NY' && '🌎'} 
                        {session}
                      </span>
                      {session === bestSession && (
                        <span className="text-xs text-green-400">⭐ Mejor</span>
                      )}
                      {session === worstSession && (
                        <span className="text-xs text-red-400">⚠️ Peor</span>
                      )}
                    </div>
                    <div className={`text-sm font-bold ${stats.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${stats.total_profit.toFixed(2)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-500">Trades: </span>
                      <span className="text-white font-medium">{stats.trade_count}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Avg: </span>
                      <span className="text-white font-medium">${stats.avg_profit.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Win%: </span>
                      <span className="text-white font-medium">{stats.win_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis de Riesgo */}
      {data.risk_analysis && (
        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span>⚖️</span> Gestión de Riesgo
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Métricas de riesgo y recompensa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Risk:Reward Ratio</div>
              <div className={`text-3xl font-bold ${data.risk_analysis.risk_reward_ratio >= 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                1:{data.risk_analysis.risk_reward_ratio.toFixed(2)}
              </div>
              <div className="text-xs text-zinc-400 mt-1">
                {data.risk_analysis.risk_reward_ratio >= 2 
                  ? '✅ Excelente ratio de riesgo/recompensa' 
                  : data.risk_analysis.risk_reward_ratio >= 1
                  ? '⚠️ Ratio aceptable, puede mejorar'
                  : '❌ Ratio desfavorable, revisar gestión de riesgo'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                <div className="text-xs text-green-400 mb-1">Ganancia Promedio</div>
                <div className="text-lg font-bold text-green-300">${data.risk_analysis.avg_win.toFixed(2)}</div>
              </div>
              <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                <div className="text-xs text-red-400 mb-1">Pérdida Promedio</div>
                <div className="text-lg font-bold text-red-300">${Math.abs(data.risk_analysis.avg_loss).toFixed(2)}</div>
              </div>
            </div>

            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Riesgo por Trade</div>
              <div className="text-lg font-bold text-orange-400">
                {data.risk_analysis.risk_per_trade_pct.toFixed(2)}% del balance
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis de Símbolos */}
      {data.symbol_analysis && Object.keys(data.symbol_analysis).length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span>💱</span> Rendimiento por Símbolo
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Mejor y peor desempeño por par de divisas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(data.symbol_analysis)
              .filter(([symbol, stats]) => typeof stats === 'object' && stats !== null && 'total_profit' in stats)
              .sort((a, b) => (b[1] as any).total_profit - (a[1] as any).total_profit)
              .slice(0, 5)
              .map(([symbol, stats]) => {
                const symbolStats = stats as { total_profit: number; trade_count: number; win_rate: number }
                return (
                <div 
                  key={symbol}
                  onClick={() => onSymbolClick?.(symbol)}
                  className={`p-3 rounded-lg border cursor-pointer hover:border-orange-500/50 transition-all duration-200 ${
                    symbol === bestSymbol 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : symbol === worstSymbol
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-zinc-800/50 border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white hover:text-orange-400 transition-colors">{symbol}</span>
                      {symbol === bestSymbol && (
                        <span className="text-xs text-green-400">🏆 Mejor</span>
                      )}
                      {symbol === worstSymbol && (
                        <span className="text-xs text-red-400">⚠️ Peor</span>
                      )}
                    </div>
                    <div className={`text-sm font-bold ${symbolStats.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${symbolStats.total_profit.toFixed(2)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-500">Trades: </span>
                      <span className="text-white font-medium">{symbolStats.trade_count}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Win Rate: </span>
                      <span className="text-white font-medium">{symbolStats.win_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                )
              })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
