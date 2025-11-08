import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RiskAnalysisProps {
  riskAnalysis?: {
    avg_win: number
    avg_loss: number
    risk_reward_ratio: number
    risk_per_trade_pct: number
    avg_rr?: number
    avg_risk_percent?: number
  }
}

export function RiskAnalysisCard({ riskAnalysis }: RiskAnalysisProps) {
  if (!riskAnalysis) {
    return null
  }

  const {
    avg_win,
    avg_loss,
    risk_reward_ratio,
    risk_per_trade_pct,
    avg_rr,
    avg_risk_percent
  } = riskAnalysis

  const rrRatio = avg_rr || risk_reward_ratio
  const riskPct = avg_risk_percent || risk_per_trade_pct

  // Evaluación de riesgo
  const getRiskLevel = (riskPct: number) => {
    if (riskPct <= 1) return { level: 'Conservador', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' }
    if (riskPct <= 2) return { level: 'Moderado', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' }
    if (riskPct <= 3) return { level: 'Agresivo', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' }
    return { level: 'Muy Agresivo', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' }
  }

  const getRRQuality = (rr: number) => {
    if (rr >= 3) return { quality: 'Excelente', color: 'text-green-400', emoji: '🏆' }
    if (rr >= 2) return { quality: 'Bueno', color: 'text-green-400', emoji: '✅' }
    if (rr >= 1.5) return { quality: 'Aceptable', color: 'text-yellow-400', emoji: '⚠️' }
    if (rr >= 1) return { quality: 'Bajo', color: 'text-orange-400', emoji: '⚠️' }
    return { quality: 'Negativo', color: 'text-red-400', emoji: '❌' }
  }

  const riskEval = getRiskLevel(riskPct)
  const rrQuality = getRRQuality(rrRatio)

  // Calcular el tamaño visual de las barras
  const totalWinLoss = Math.abs(avg_win) + Math.abs(avg_loss)
  const winWidth = totalWinLoss > 0 ? (Math.abs(avg_win) / totalWinLoss) * 100 : 50
  const lossWidth = totalWinLoss > 0 ? (Math.abs(avg_loss) / totalWinLoss) * 100 : 50

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          ⚠️ Análisis de Riesgo
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Evaluación de gestión de riesgo y relación riesgo/recompensa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Nivel de Riesgo Principal */}
          <div className={`p-4 rounded-lg border ${riskEval.bg} ${riskEval.border}`}>
            <div className="text-center">
              <div className="text-sm text-zinc-400 mb-1">Nivel de Riesgo por Trade</div>
              <div className={`text-3xl font-bold ${riskEval.color}`}>
                {riskPct.toFixed(2)}%
              </div>
              <div className={`text-lg font-semibold ${riskEval.color} mt-1`}>
                {riskEval.level}
              </div>
            </div>
          </div>

          {/* Risk/Reward Ratio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${rrRatio >= 2 ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-800/50 border-zinc-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">R:R Ratio</span>
                <span className="text-xl">{rrQuality.emoji}</span>
              </div>
              <div className={`text-2xl font-bold ${rrQuality.color}`}>
                {rrRatio.toFixed(2)}:1
              </div>
              <div className={`text-xs ${rrQuality.color} mt-1`}>
                {rrQuality.quality}
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-zinc-800/50 border-zinc-700">
              <div className="text-zinc-400 text-sm mb-2">Riesgo Promedio</div>
              <div className={`text-2xl font-bold ${riskEval.color}`}>
                {riskPct.toFixed(2)}%
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Por operación
              </div>
            </div>
          </div>

          {/* Ganancia Promedio vs Pérdida Promedia */}
          <div>
            <div className="text-white font-semibold mb-3 flex items-center gap-2">
              📊 Promedio de Ganancia vs Pérdida
            </div>

            <div className="space-y-4">
              {/* Barra de Ganancia */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-green-400 font-medium">💰 Ganancia Promedio</span>
                  <span className="text-sm text-green-400 font-bold">${Math.abs(avg_win).toFixed(2)}</span>
                </div>
                <div className="bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-500"
                    style={{ width: `${winWidth}%` }}
                  />
                </div>
              </div>

              {/* Barra de Pérdida */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-red-400 font-medium">📉 Pérdida Promedio</span>
                  <span className="text-sm text-red-400 font-bold">-${Math.abs(avg_loss).toFixed(2)}</span>
                </div>
                <div className="bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-500"
                    style={{ width: `${lossWidth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Ratio visual */}
            <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg text-center">
              <div className="text-xs text-zinc-400 mb-1">Por cada $1 arriesgado, ganas:</div>
              <div className="text-xl font-bold text-white">
                ${rrRatio.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Métricas de Riesgo Adicionales */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 text-center">
              <div className="text-zinc-400 text-xs mb-1">Avg Win</div>
              <div className="text-green-400 font-bold">
                ${Math.abs(avg_win).toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 text-center">
              <div className="text-zinc-400 text-xs mb-1">Avg Loss</div>
              <div className="text-red-400 font-bold">
                -${Math.abs(avg_loss).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="space-y-2">
            {riskPct > 3 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-red-400">⚠️</span>
                  <div className="text-sm text-red-300">
                    <strong>Alerta:</strong> Tu riesgo por operación ({riskPct.toFixed(2)}%) es muy alto. 
                    Se recomienda reducirlo a menos del 2% para proteger tu capital.
                  </div>
                </div>
              </div>
            )}

            {rrRatio < 1.5 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-orange-400">⚠️</span>
                  <div className="text-sm text-orange-300">
                    <strong>Mejora tu R:R:</strong> Tu ratio riesgo/recompensa ({rrRatio.toFixed(2)}) es bajo. 
                    Busca operaciones con mínimo 2:1 para mejorar rentabilidad.
                  </div>
                </div>
              </div>
            )}

            {rrRatio >= 2 && riskPct <= 2 && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✅</span>
                  <div className="text-sm text-green-300">
                    <strong>Excelente gestión:</strong> Tu R:R ratio ({rrRatio.toFixed(2)}) y nivel de riesgo ({riskPct.toFixed(2)}%) 
                    están bien equilibrados. ¡Mantén esta disciplina!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
