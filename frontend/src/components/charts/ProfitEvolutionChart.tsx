'use client'

import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Trade {
  symbol: string
  type: string
  volume: number
  price_open: number
  profit: number
  time: string
}

interface ChartProps {
  data: Trade[]
}

export default function ProfitEvolutionChart({ data }: ChartProps) {
  const [chartType, setChartType] = useState<'cumulative' | 'individual' | 'hourly' | 'performance'>('cumulative')

  // Cumulative profit data
  const cumulativeData = data.map((trade, index) => ({
    trade: index + 1,
    profit: trade.profit,
    cumulative: data.slice(0, index + 1).reduce((sum, t) => sum + t.profit, 0),
    time: new Date(trade.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    fullTime: new Date(trade.time).toLocaleString('es-ES'),
    symbol: trade.symbol,
    type: trade.type,
    volume: trade.volume
  }))

  // Individual profits data
  const individualData = data.map((trade, index) => ({
    trade: index + 1,
    profit: trade.profit,
    time: new Date(trade.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    type: trade.type,
    color: trade.profit >= 0 ? '#10b981' : '#ef4444'
  }))

  // Hourly performance data
  const hourlyData = (() => {
    const hourlyMap = new Map<string, { profit: number, trades: number }>()
    
    data.forEach(trade => {
      const hour = new Date(trade.time).getHours()
      const hourKey = `${hour.toString().padStart(2, '0')}:00`
      
      if (!hourlyMap.has(hourKey)) {
        hourlyMap.set(hourKey, { profit: 0, trades: 0 })
      }
      
      const hourData = hourlyMap.get(hourKey)!
      hourData.profit += trade.profit
      hourData.trades += 1
    })
    
    return Array.from(hourlyMap.entries())
      .map(([hour, stats]) => ({
        hour,
        profit: stats.profit,
        trades: stats.trades,
        avgProfit: stats.profit / stats.trades
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour))
  })()

  // Win/Loss analysis
  const wins = data.filter(t => t.profit > 0).length
  const losses = data.filter(t => t.profit < 0).length
  const totalProfit = data.reduce((sum, t) => t.profit > 0 ? sum + t.profit : sum, 0)
  const totalLoss = Math.abs(data.reduce((sum, t) => t.profit < 0 ? sum + t.profit : sum, 0))
  const winRate = (wins / data.length) * 100
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit

  const performanceData = [
    { name: 'Ganadas', value: wins, fill: '#10b981' },
    { name: 'Perdidas', value: losses, fill: '#ef4444' }
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">Trade #{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
          {payload[0]?.payload?.fullTime && (
            <p className="text-zinc-400 text-xs mt-1">{payload[0].payload.fullTime}</p>
          )}
        </div>
      )
    }
    return null
  }

  const HourlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{label}</p>
          <p className="text-green-500 text-sm">Profit: ${payload[0].value.toFixed(2)}</p>
          <p className="text-orange-500 text-sm">Trades: {payload[0].payload.trades}</p>
          <p className="text-blue-400 text-sm">Avg: ${payload[0].payload.avgProfit.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 card-hover">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-orange-500">📈</span>
              Análisis de Performance
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Visualización detallada de resultados
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setChartType('cumulative')}
              variant={chartType === 'cumulative' ? 'default' : 'outline'}
              className={chartType === 'cumulative' ? 'bg-orange-600 glow-orange' : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'}
              size="sm"
            >
              Acumulado
            </Button>
            <Button
              onClick={() => setChartType('individual')}
              variant={chartType === 'individual' ? 'default' : 'outline'}
              className={chartType === 'individual' ? 'bg-orange-600 glow-orange' : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'}
              size="sm"
            >
              Individual
            </Button>
            <Button
              onClick={() => setChartType('hourly')}
              variant={chartType === 'hourly' ? 'default' : 'outline'}
              className={chartType === 'hourly' ? 'bg-orange-600 glow-orange' : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'}
              size="sm"
            >
              Por Hora
            </Button>
            <Button
              onClick={() => setChartType('performance')}
              variant={chartType === 'performance' ? 'default' : 'outline'}
              className={chartType === 'performance' ? 'bg-orange-600 glow-orange' : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'}
              size="sm"
            >
              Métricas
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Cumulative Profit Chart */}
        {chartType === 'cumulative' && (
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="trade"
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: 'Número de Trade', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: 'Profit Acumulado (USD)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#colorProfit)"
                  name="Profit Acumulado"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="text-2xl font-bold text-green-500">
                  ${cumulativeData[cumulativeData.length - 1]?.cumulative.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-zinc-400">Profit Total</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="text-2xl font-bold text-orange-500">
                  ${(cumulativeData[cumulativeData.length - 1]?.cumulative / data.length).toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-zinc-400">Profit Promedio</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="text-2xl font-bold text-orange-500">
                  {winRate.toFixed(1)}%
                </div>
                <div className="text-sm text-zinc-400">Win Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Individual Profits Chart */}
        {chartType === 'individual' && (
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={individualData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="trade"
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: 'Trade #', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: 'Profit (USD)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="profit" name="Profit" radius={[4, 4, 0, 0]}>
                  {individualData.map((entry, index) => (
                    <rect key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="text-2xl font-bold text-green-500">
                  ${totalProfit.toFixed(2)}
                </div>
                <div className="text-sm text-zinc-400">Total Ganancias ({wins} trades)</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="text-2xl font-bold text-red-500">
                  ${totalLoss.toFixed(2)}
                </div>
                <div className="text-sm text-zinc-400">Total Pérdidas ({losses} trades)</div>
              </div>
            </div>
          </div>
        )}

        {/* Hourly Performance Chart */}
        {chartType === 'hourly' && (
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="hour"
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: 'Hora del día', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  label={{ value: 'Profit (USD)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<HourlyTooltip />} />
                <Bar dataKey="profit" fill="#f97316" name="Profit por Hora" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <h4 className="text-white font-semibold mb-2">📊 Análisis por Horario</h4>
              <p className="text-zinc-300 text-sm">
                {hourlyData.length > 0 ? (
                  <>
                    Mejor hora: <span className="text-green-500 font-bold">
                      {hourlyData.reduce((prev, curr) => curr.profit > prev.profit ? curr : prev).hour}
                    </span> con ${hourlyData.reduce((prev, curr) => curr.profit > prev.profit ? curr : prev).profit.toFixed(2)}
                    <br />
                    Peor hora: <span className="text-red-400 font-bold">
                      {hourlyData.reduce((prev, curr) => curr.profit < prev.profit ? curr : prev).hour}
                    </span> con ${hourlyData.reduce((prev, curr) => curr.profit < prev.profit ? curr : prev).profit.toFixed(2)}
                  </>
                ) : 'No hay datos suficientes'}
              </p>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {chartType === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {performanceData.map((entry, index) => (
                        <rect key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-orange-400">{profitFactor.toFixed(2)}</div>
                  <div className="text-sm text-gray-400">Profit Factor</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {profitFactor >= 2 ? '✅ Excelente' : profitFactor >= 1.5 ? '✓ Bueno' : profitFactor >= 1 ? '⚠️ Aceptable' : '❌ Pobre'}
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400">{winRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {wins} ganadas / {losses} perdidas
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-400">
                  ${Math.max(...data.map(t => t.profit)).toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">Mayor Ganancia</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-red-400">
                  ${Math.min(...data.map(t => t.profit)).toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">Mayor Pérdida</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-400">
                  {data.reduce((sum, t) => sum + t.volume, 0).toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">Volumen Total</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-yellow-400">
                  {(data.reduce((sum, t) => sum + t.volume, 0) / data.length).toFixed(3)}
                </div>
                <div className="text-xs text-gray-400">Volumen Promedio</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
