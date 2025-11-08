import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SessionStats {
  total_profit: number
  trade_count: number
  avg_profit: number
  win_rate: number
}

interface SessionAnalysisProps {
  sessionAnalysis?: {
    [key: string]: SessionStats
  } & {
    best_session?: string
    worst_session?: string
  }
}

export function SessionAnalysisCard({ sessionAnalysis }: SessionAnalysisProps) {
  if (!sessionAnalysis) {
    return null
  }

  const sessions = Object.entries(sessionAnalysis).filter(
    ([key]) => key !== 'best_session' && key !== 'worst_session'
  ) as [string, SessionStats][]

  if (sessions.length === 0) {
    return null
  }

  const bestSession = sessionAnalysis.best_session
  const worstSession = sessionAnalysis.worst_session

  // Calcular el máximo profit para escalar las barras
  const maxProfit = Math.max(...sessions.map(([_, stats]) => Math.abs(stats.total_profit)))

  // Mapeo de nombres de sesiones a emojis y colores
  const sessionConfig: { [key: string]: { emoji: string; color: string } } = {
    'Asian': { emoji: '🌏', color: 'text-yellow-400' },
    'London': { emoji: '🇬🇧', color: 'text-blue-400' },
    'New York': { emoji: '🗽', color: 'text-purple-400' },
    'Sydney': { emoji: '🦘', color: 'text-green-400' }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🌍 Análisis de Sesiones de Trading
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Rendimiento por sesión de mercado (Asia, Londres, Nueva York)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map(([sessionName, stats]) => {
            const config = sessionConfig[sessionName] || { emoji: '⏰', color: 'text-gray-400' }
            const isBest = sessionName === bestSession
            const isWorst = sessionName === worstSession
            const barWidth = maxProfit > 0 ? (Math.abs(stats.total_profit) / maxProfit) * 100 : 0
            const isProfit = stats.total_profit >= 0

            return (
              <div
                key={sessionName}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isBest
                    ? 'bg-green-500/10 border-green-500/50'
                    : isWorst
                    ? 'bg-red-500/10 border-red-500/50'
                    : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {/* Header de la sesión */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${config.color}`}>{sessionName}</span>
                        {isBest && <span className="text-xs text-green-400">🏆 Mejor</span>}
                        {isWorst && <span className="text-xs text-red-400">⚠️ Peor</span>}
                      </div>
                      <div className="text-xs text-zinc-500">{stats.trade_count} trades</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      ${stats.total_profit.toFixed(2)}
                    </div>
                    <div className="text-xs text-zinc-400">Profit Total</div>
                  </div>
                </div>

                {/* Barra de progreso visual */}
                <div className="mb-3 bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isProfit ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                {/* Métricas detalladas */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center bg-zinc-900/50 p-2 rounded border border-zinc-800">
                    <div className="text-zinc-400 text-xs">Win Rate</div>
                    <div
                      className={`font-bold ${
                        stats.win_rate >= 60 ? 'text-green-400' : stats.win_rate >= 45 ? 'text-yellow-400' : 'text-red-400'
                      }`}
                    >
                      {stats.win_rate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center bg-zinc-900/50 p-2 rounded border border-zinc-800">
                    <div className="text-zinc-400 text-xs">Avg Profit</div>
                    <div className={`font-bold ${stats.avg_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${stats.avg_profit.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center bg-zinc-900/50 p-2 rounded border border-zinc-800">
                    <div className="text-zinc-400 text-xs">Trades</div>
                    <div className="font-bold text-white">{stats.trade_count}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recomendación */}
        {bestSession && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-400">💡</span>
              <div className="text-sm text-blue-300">
                <strong>Recomendación:</strong> La sesión <strong>{bestSession}</strong> muestra el mejor rendimiento.
                Considera concentrar tus operaciones en este horario para maximizar resultados.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
