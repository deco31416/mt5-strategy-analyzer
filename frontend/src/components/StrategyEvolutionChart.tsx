import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EvolutionData {
  timestamp: string
  win_rate: number
  profit_factor: number
  total_trades: number
  net_profit: number
  avg_profit: number
}

interface StrategyEvolutionChartProps {
  strategyName: string
}

export function StrategyEvolutionChart({ strategyName }: StrategyEvolutionChartProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<EvolutionData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!strategyName) return

    const loadEvolution = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/history/strategy/${encodeURIComponent(strategyName)}`
        )
        const result = await response.json()
        
        if (result.error) {
          setError(result.error)
        } else {
          setData(result.evolution || [])
        }
      } catch (err) {
        setError('Error al cargar evolución de estrategia')
        console.error('Error loading strategy evolution:', err)
      }
      
      setLoading(false)
    }

    loadEvolution()
  }, [strategyName])

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>📈</span> Evolución Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-zinc-400">🔄 Cargando evolución...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>📈</span> Evolución Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-300">
            ⚠️ {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>📈</span> Evolución Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-zinc-400">
            📊 No hay suficiente historial para mostrar evolución temporal
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calcular estadísticas
  const firstData = data[0]
  const lastData = data[data.length - 1]
  const winRateChange = lastData.win_rate - firstData.win_rate
  const profitChange = lastData.net_profit - firstData.net_profit

  // Crear visualización ASCII simple
  const maxProfit = Math.max(...data.map(d => d.net_profit))
  const minProfit = Math.min(...data.map(d => d.net_profit))
  const range = maxProfit - minProfit

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span>📈</span> Evolución Temporal
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Cómo ha evolucionado {strategyName} en el tiempo ({data.length} registros)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen de cambios */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Win Rate</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">
                {lastData.win_rate.toFixed(1)}%
              </span>
              <span className={`text-sm ${winRateChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {winRateChange >= 0 ? '↗' : '↘'} {Math.abs(winRateChange).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Ganancia Total</div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${lastData.net_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${lastData.net_profit.toFixed(0)}
              </span>
              <span className={`text-sm ${profitChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profitChange >= 0 ? '↗' : '↘'} ${Math.abs(profitChange).toFixed(0)}
              </span>
            </div>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Total Trades</div>
            <div className="text-xl font-bold text-white">
              {lastData.total_trades}
            </div>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Profit Factor</div>
            <div className="text-xl font-bold text-orange-400">
              {lastData.profit_factor.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Gráfico ASCII de evolución de ganancia */}
        <div className="bg-zinc-800/30 p-4 rounded-lg">
          <div className="text-sm font-semibold text-zinc-400 mb-3">
            Evolución de Ganancia
          </div>
          <div className="font-mono text-xs space-y-1 overflow-x-auto">
            {data.map((point, idx) => {
              const barLength = range > 0 
                ? Math.round(((point.net_profit - minProfit) / range) * 40) 
                : 20
              const isPositive = point.net_profit >= 0
              
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-zinc-500 w-32 text-right">
                    {new Date(point.timestamp).toLocaleDateString()}
                  </span>
                  <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                    {'█'.repeat(Math.max(1, barLength))}
                  </span>
                  <span className={`ml-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    ${point.net_profit.toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tabla de datos históricos */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left text-zinc-400 font-medium py-2">Fecha</th>
                <th className="text-right text-zinc-400 font-medium py-2">Trades</th>
                <th className="text-right text-zinc-400 font-medium py-2">Win%</th>
                <th className="text-right text-zinc-400 font-medium py-2">PF</th>
                <th className="text-right text-zinc-400 font-medium py-2">Ganancia</th>
                <th className="text-right text-zinc-400 font-medium py-2">Avg</th>
              </tr>
            </thead>
            <tbody>
              {data.slice().reverse().slice(0, 10).map((point, idx) => (
                <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800/30">
                  <td className="text-zinc-300 py-2">
                    {new Date(point.timestamp).toLocaleString()}
                  </td>
                  <td className="text-right text-white">{point.total_trades}</td>
                  <td className="text-right">
                    <span className={point.win_rate >= 50 ? 'text-green-400' : 'text-red-400'}>
                      {point.win_rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right text-orange-400">
                    {point.profit_factor.toFixed(2)}
                  </td>
                  <td className="text-right">
                    <span className={point.net_profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${point.net_profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={point.avg_profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${point.avg_profit.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 10 && (
            <div className="text-center text-xs text-zinc-500 mt-3">
              Mostrando últimos 10 de {data.length} registros
            </div>
          )}
        </div>

        {/* Análisis de tendencia */}
        <div className="bg-zinc-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">📊 Análisis de Tendencia</h4>
          <div className="space-y-2 text-sm text-zinc-300">
            {winRateChange > 5 && (
              <p>✅ Win rate ha mejorado significativamente (+{winRateChange.toFixed(1)}%)</p>
            )}
            {winRateChange < -5 && (
              <p>⚠️ Win rate ha disminuido ({winRateChange.toFixed(1)}%)</p>
            )}
            {profitChange > 100 && (
              <p>✅ Ganancia total en crecimiento (+${profitChange.toFixed(0)})</p>
            )}
            {profitChange < -100 && (
              <p>⚠️ Ganancia total en descenso (${profitChange.toFixed(0)})</p>
            )}
            {Math.abs(winRateChange) < 5 && Math.abs(profitChange) < 100 && (
              <p>➡️ Estrategia estable, sin cambios significativos</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
