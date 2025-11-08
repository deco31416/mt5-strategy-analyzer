import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SymbolStats {
  total_profit: number
  trade_count: number
  win_rate: number
}

interface SymbolPerformanceProps {
  symbolAnalysis?: ({
    [key: string]: SymbolStats
  } & {
    best_symbol?: string
    worst_symbol?: string
  })
  onSymbolClick?: (symbol: string) => void
}

export function SymbolPerformanceCard({ symbolAnalysis, onSymbolClick }: SymbolPerformanceProps) {
  if (!symbolAnalysis) {
    return null
  }

  const symbols = Object.entries(symbolAnalysis).filter(
    ([key]) => key !== 'best_symbol' && key !== 'worst_symbol'
  ) as [string, SymbolStats][]

  if (symbols.length === 0) {
    return null
  }

  const bestSymbol = symbolAnalysis.best_symbol
  const worstSymbol = symbolAnalysis.worst_symbol

  // Ordenar por profit descendente
  const sortedSymbols = [...symbols].sort((a, b) => b[1].total_profit - a[1].total_profit)
  
  const maxProfit = Math.max(...symbols.map(([_, stats]) => Math.abs(stats.total_profit)))
  const totalTrades = symbols.reduce((sum, [_, stats]) => sum + stats.trade_count, 0)
  const totalProfit = symbols.reduce((sum, [_, stats]) => sum + stats.total_profit, 0)

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          💹 Rendimiento por Símbolo
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Análisis detallado de cada par de divisas operado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Resumen General */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="text-xs text-zinc-400 mb-1">Total Símbolos</div>
              <div className="text-xl font-bold text-white">{symbols.length}</div>
            </div>
            <div className="text-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="text-xs text-zinc-400 mb-1">Total Trades</div>
              <div className="text-xl font-bold text-white">{totalTrades}</div>
            </div>
            <div className="text-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="text-xs text-zinc-400 mb-1">Profit Total</div>
              <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${totalProfit.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Top 3 Mejores Símbolos */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              🏆 Top Performers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sortedSymbols.slice(0, 3).map(([symbol, stats], index) => (
                <div
                  key={symbol}
                  onClick={() => onSymbolClick?.(symbol)}
                  className={`p-4 rounded-lg border cursor-pointer hover:scale-105 transition-all duration-200 ${
                    index === 0
                      ? 'bg-yellow-500/10 border-yellow-500/50'
                      : index === 1
                      ? 'bg-gray-400/10 border-gray-400/50'
                      : 'bg-orange-600/10 border-orange-600/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="font-bold text-white text-lg mb-1">{symbol}</div>
                    <div className={`text-2xl font-bold ${stats.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${stats.total_profit.toFixed(2)}
                    </div>
                    <div className="text-xs text-zinc-400 mt-2">
                      {stats.trade_count} trades • Win Rate: {stats.win_rate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista Completa de Símbolos con Barras */}
          <div>
            <h3 className="text-white font-semibold mb-3">📊 Todos los Símbolos</h3>
            <div className="space-y-2">
              {sortedSymbols.map(([symbol, stats]) => {
                const isBest = symbol === bestSymbol
                const isWorst = symbol === worstSymbol
                const barWidth = maxProfit > 0 ? (Math.abs(stats.total_profit) / maxProfit) * 100 : 0
                const isProfit = stats.total_profit >= 0

                return (
                  <div
                    key={symbol}
                    onClick={() => onSymbolClick?.(symbol)}
                    className={`p-3 rounded-lg border cursor-pointer hover:border-orange-500/50 transition-all duration-200 ${
                      isBest
                        ? 'bg-green-500/10 border-green-500/30'
                        : isWorst
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-zinc-800/50 border-zinc-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white hover:text-orange-400 transition-colors">
                          {symbol}
                        </span>
                        {isBest && <span className="text-xs text-green-400">🏆 Mejor</span>}
                        {isWorst && <span className="text-xs text-red-400">⚠️ Peor</span>}
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                          ${stats.total_profit.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="mb-2 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isProfit ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    {/* Métricas */}
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex gap-4">
                        <span className="text-zinc-400">
                          Trades: <span className="text-white font-medium">{stats.trade_count}</span>
                        </span>
                        <span className="text-zinc-400">
                          Win Rate:{' '}
                          <span
                            className={`font-medium ${
                              stats.win_rate >= 60
                                ? 'text-green-400'
                                : stats.win_rate >= 45
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            {stats.win_rate.toFixed(1)}%
                          </span>
                        </span>
                      </div>
                      <div className="text-zinc-500">
                        {((stats.total_profit / totalProfit) * 100).toFixed(1)}% del total
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recomendación */}
          {bestSymbol && worstSymbol && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-blue-400">💡</span>
                <div className="text-sm text-blue-300">
                  <strong>Recomendación:</strong> Concentra tus operaciones en <strong>{bestSymbol}</strong> 
                  (mejor rendimiento) y considera reducir o eliminar <strong>{worstSymbol}</strong> de tu portafolio.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
