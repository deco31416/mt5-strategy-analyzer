import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SymbolDetailData {
  symbol: string
  total_profit: number
  total_trades: number
  win_rate: number
  avg_profit: number
  best_trade: number
  worst_trade: number
  profit_factor: number
  avg_win: number
  avg_loss: number
  longest_win_streak: number
  longest_loss_streak: number
  trades_by_hour?: { [key: string]: any }
  trades_by_day?: { [key: string]: any }
  recent_trades?: Array<{
    ticket: number
    type: string
    volume: number
    profit: number
    time: string
  }>
}

interface SymbolDetailModalProps {
  isOpen: boolean
  onClose: () => void
  symbol: string
}

export function SymbolDetailModal({ isOpen, onClose, symbol }: SymbolDetailModalProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SymbolDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !symbol) return

    const loadSymbolDetail = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/symbol/${encodeURIComponent(symbol)}`
        )
        const result = await response.json()
        
        if (result.error) {
          setError(result.error)
        } else {
          setData(result)
        }
      } catch (err) {
        setError('Error al cargar detalle del símbolo')
        console.error('Error loading symbol detail:', err)
      }
      
      setLoading(false)
    }

    loadSymbolDetail()
  }, [isOpen, symbol])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>💱</span> {symbol}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Análisis detallado del par de divisas
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
          >
            ✕ Cerrar
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-zinc-400">🔄 Cargando datos del símbolo...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
              <div className="text-red-400 font-semibold mb-2">⚠️ Error</div>
              <p className="text-zinc-300">{error}</p>
            </div>
          )}

          {data && (
            <>
              {/* Métricas Principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                  <div className="text-xs text-zinc-500 mb-1">Ganancia Total</div>
                  <div className={`text-2xl font-bold ${data.total_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${data.total_profit.toFixed(2)}
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                  <div className="text-xs text-zinc-500 mb-1">Total Trades</div>
                  <div className="text-2xl font-bold text-white">
                    {data.total_trades}
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                  <div className="text-xs text-zinc-500 mb-1">Win Rate</div>
                  <div className={`text-2xl font-bold ${data.win_rate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.win_rate.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                  <div className="text-xs text-zinc-500 mb-1">Profit Factor</div>
                  <div className="text-2xl font-bold text-orange-400">
                    {data.profit_factor.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Análisis de Trades */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-zinc-400">Avg Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-xl font-bold ${data.avg_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${data.avg_profit.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-500/10 border-green-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-green-400">Mejor Trade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-400">
                      ${data.best_trade.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-red-500/10 border-red-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-red-400">Peor Trade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-red-400">
                      ${data.worst_trade.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Win/Loss Analysis */}
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span>⚖️</span> Análisis Win/Loss
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-zinc-500 mb-2">Avg Win</div>
                      <div className="text-lg font-bold text-green-400">
                        ${data.avg_win.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-500 mb-2">Avg Loss</div>
                      <div className="text-lg font-bold text-red-400">
                        ${Math.abs(data.avg_loss).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-500 mb-2">Racha Ganadora</div>
                      <div className="text-lg font-bold text-green-400">
                        {data.longest_win_streak}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-500 mb-2">Racha Perdedora</div>
                      <div className="text-lg font-bold text-red-400">
                        {data.longest_loss_streak}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trades Recientes */}
              {data.recent_trades && data.recent_trades.length > 0 && (
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <span>📋</span> Trades Recientes
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Últimas {data.recent_trades.length} operaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-zinc-700">
                            <th className="text-left text-zinc-400 font-medium py-2">Ticket</th>
                            <th className="text-left text-zinc-400 font-medium py-2">Tipo</th>
                            <th className="text-right text-zinc-400 font-medium py-2">Volumen</th>
                            <th className="text-right text-zinc-400 font-medium py-2">Profit</th>
                            <th className="text-right text-zinc-400 font-medium py-2">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recent_trades.map((trade, idx) => (
                            <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800/30">
                              <td className="text-zinc-300 py-2">{trade.ticket}</td>
                              <td className="text-zinc-300">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  trade.type === 'BUY' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {trade.type}
                                </span>
                              </td>
                              <td className="text-right text-white">{trade.volume.toFixed(2)}</td>
                              <td className="text-right">
                                <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                                  ${trade.profit.toFixed(2)}
                                </span>
                              </td>
                              <td className="text-right text-zinc-400">
                                {new Date(trade.time).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recomendaciones */}
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <span>💡</span> Recomendaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {data.win_rate >= 60 && (
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Excelente win rate en {symbol}. Considera aumentar el volumen en este par.</span>
                      </li>
                    )}
                    {data.win_rate < 45 && (
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">⚠</span>
                        <span>Win rate bajo en {symbol}. Revisa tu estrategia para este par.</span>
                      </li>
                    )}
                    {data.profit_factor >= 2 && (
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Profit factor excelente. {symbol} es uno de tus mejores pares.</span>
                      </li>
                    )}
                    {data.avg_win > Math.abs(data.avg_loss) * 2 && (
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Buena relación riesgo/recompensa en {symbol}.</span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
