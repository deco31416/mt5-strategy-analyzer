import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ScheduleAnalysisProps {
  scheduleAnalysis?: {
    by_hour?: { [hour: string]: any }
    by_day?: { [day: string]: any }
    best_hour?: number
    best_day?: string
  }
}

export function ScheduleAnalysisCard({ scheduleAnalysis }: ScheduleAnalysisProps) {
  if (!scheduleAnalysis || (!scheduleAnalysis.by_hour && !scheduleAnalysis.by_day)) {
    return null
  }

  const { by_hour, by_day, best_hour, best_day } = scheduleAnalysis

  // Procesar datos por hora
  const hourlyData = by_hour
    ? Object.entries(by_hour)
        .map(([hour, data]: [string, any]) => ({
          hour: parseInt(hour),
          profit: data.total_profit || 0,
          trades: data.trade_count || 0,
          winRate: data.win_rate || 0
        }))
        .sort((a, b) => a.hour - b.hour)
    : []

  // Procesar datos por día
  const dailyData = by_day
    ? Object.entries(by_day).map(([day, data]: [string, any]) => ({
        day,
        profit: data.total_profit || 0,
        trades: data.trade_count || 0,
        winRate: data.win_rate || 0
      }))
    : []

  const maxHourProfit = hourlyData.length > 0 ? Math.max(...hourlyData.map(h => Math.abs(h.profit))) : 1
  const maxDayProfit = dailyData.length > 0 ? Math.max(...dailyData.map(d => Math.abs(d.profit))) : 1

  const dayEmojis: { [key: string]: string } = {
    Monday: '📅',
    Tuesday: '📆',
    Wednesday: '📋',
    Thursday: '📊',
    Friday: '💼',
    Saturday: '🏖️',
    Sunday: '☀️'
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          ⏰ Análisis de Horarios
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Rendimiento por hora del día y día de la semana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Análisis por Hora */}
          {hourlyData.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-white font-semibold">📊 Por Hora del Día</h3>
                {best_hour !== undefined && (
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                    Mejor: {best_hour}:00
                  </span>
                )}
              </div>

              {/* Heatmap de horas */}
              <div className="grid grid-cols-12 gap-1 mb-4">
                {hourlyData.map((data) => {
                  const intensity = maxHourProfit > 0 ? Math.abs(data.profit) / maxHourProfit : 0
                  const isProfit = data.profit >= 0
                  const isBestHour = data.hour === best_hour
                  
                  return (
                    <div
                      key={data.hour}
                      className={`aspect-square rounded flex flex-col items-center justify-center text-xs transition-all duration-200 hover:scale-110 cursor-pointer ${
                        isBestHour ? 'ring-2 ring-green-400' : ''
                      }`}
                      style={{
                        backgroundColor: isProfit
                          ? `rgba(34, 197, 94, ${0.2 + intensity * 0.8})`
                          : `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`
                      }}
                      title={`${data.hour}:00 - $${data.profit.toFixed(2)} (${data.trades} trades)`}
                    >
                      <div className="text-white font-bold">{data.hour}</div>
                      {data.trades > 0 && (
                        <div className="text-[8px] text-zinc-300">{data.trades}t</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Top 5 mejores horas */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {hourlyData
                  .sort((a, b) => b.profit - a.profit)
                  .slice(0, 5)
                  .map((data, index) => (
                    <div
                      key={data.hour}
                      className={`p-2 rounded-lg border text-center ${
                        index === 0
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-zinc-800/50 border-zinc-700'
                      }`}
                    >
                      <div className="text-xs text-zinc-400">
                        {index === 0 && '🏆 '}
                        {data.hour}:00
                      </div>
                      <div className={`font-bold text-sm ${data.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${data.profit.toFixed(0)}
                      </div>
                      <div className="text-xs text-zinc-500">{data.trades} trades</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Análisis por Día */}
          {dailyData.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-white font-semibold">📅 Por Día de la Semana</h3>
                {best_day && (
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                    Mejor: {best_day}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {dailyData
                  .sort((a, b) => b.profit - a.profit)
                  .map((data) => {
                    const barWidth = maxDayProfit > 0 ? (Math.abs(data.profit) / maxDayProfit) * 100 : 0
                    const isProfit = data.profit >= 0
                    const isBestDay = data.day === best_day

                    return (
                      <div
                        key={data.day}
                        className={`p-3 rounded-lg border ${
                          isBestDay
                            ? 'bg-green-500/10 border-green-500/50'
                            : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{dayEmojis[data.day] || '📆'}</span>
                            <span className="font-bold text-white">
                              {data.day}
                              {isBestDay && <span className="ml-2 text-xs text-green-400">🏆</span>}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                              ${data.profit.toFixed(2)}
                            </div>
                            <div className="text-xs text-zinc-500">{data.trades} trades</div>
                          </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isProfit ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>

                        <div className="mt-2 text-center">
                          <span className="text-xs text-zinc-400">Win Rate: </span>
                          <span
                            className={`text-xs font-bold ${
                              data.winRate >= 60 ? 'text-green-400' : data.winRate >= 45 ? 'text-yellow-400' : 'text-red-400'
                            }`}
                          >
                            {data.winRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Recomendación */}
          {(best_hour !== undefined || best_day) && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-blue-400">💡</span>
                <div className="text-sm text-blue-300">
                  <strong>Recomendación:</strong> Opera principalmente
                  {best_day && <span> los días <strong>{best_day}</strong></span>}
                  {best_hour !== undefined && best_day && ' y'}
                  {best_hour !== undefined && <span> a las <strong>{best_hour}:00</strong></span>}
                  {' '}para maximizar tus resultados.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
