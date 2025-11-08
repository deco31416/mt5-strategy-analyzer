import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OptimizationResult {
  strategy_name: string
  original_parameters: { [key: string]: any }
  optimized_parameters: { [key: string]: any }
  reasoning: string
  expected_improvements: string[]
  warnings: string[]
  confidence_score: number
  ai_powered: boolean
}

interface StrategyOptimizationModalProps {
  isOpen: boolean
  onClose: () => void
  strategyData: any
  onOptimize: (result: OptimizationResult) => void
}

export function StrategyOptimizationModal({ 
  isOpen, 
  onClose, 
  strategyData,
  onOptimize 
}: StrategyOptimizationModalProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOptimize = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/strategy/optimize-enhanced`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            strategy_name: strategyData.summary.strategy,
            current_metrics: {
              win_rate: strategyData.summary.win_rate || 0,
              profit_factor: strategyData.summary.profit_factor || 0,
              total_trades: strategyData.summary.total_trades || 0,
              avg_profit: strategyData.summary.avg_profit || 0
            },
            risk_metrics: strategyData.risk_analysis || {},
            session_data: strategyData.session_analysis || {},
            symbol_data: strategyData.symbol_analysis || {}
          })
        }
      )

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
        onOptimize(data)
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.')
      console.error('Error optimizing strategy:', err)
    }
    
    setLoading(false)
  }

  if (!isOpen) return null

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🤖</span> Optimización con IA
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Usa OpenAI para analizar y optimizar tu estrategia
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
          {!result && !error && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Optimizar Estrategia: {strategyData.summary.strategy}
              </h3>
              <p className="text-zinc-400 mb-6">
                La IA analizará tus métricas actuales y sugerirá optimizaciones personalizadas
              </p>
              <Button
                onClick={handleOptimize}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
              >
                {loading ? '🔄 Analizando con IA...' : '🚀 Optimizar con IA'}
              </Button>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                <span>⚠️</span> Error
              </h4>
              <p className="text-zinc-300">{error}</p>
              <Button
                onClick={handleOptimize}
                className="mt-4 bg-orange-600 hover:bg-orange-700"
              >
                🔄 Reintentar
              </Button>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Header con confianza */}
              <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {result.strategy_name}
                    </h3>
                    <p className="text-zinc-400 text-sm">Análisis completado por IA</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400 mb-1">Confianza</div>
                    <div className={`text-3xl font-bold ${getConfidenceColor(result.confidence_score)}`}>
                      {result.confidence_score}%
                    </div>
                  </div>
                </div>
                
                {!result.ai_powered && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-sm text-yellow-300">
                    ⚠️ OpenAI no configurado. Mostrando análisis básico.
                  </div>
                )}
              </div>

              {/* Razonamiento */}
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span>💡</span> Razonamiento del Análisis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {result.reasoning}
                  </p>
                </CardContent>
              </Card>

              {/* Parámetros: Original vs Optimizado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      📊 Parámetros Actuales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(result.original_parameters).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center bg-zinc-900/50 p-3 rounded">
                        <span className="text-zinc-400 text-sm">{key}</span>
                        <span className="text-white font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Optimizado */}
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                      <span>✨</span> Parámetros Optimizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(result.optimized_parameters).map(([key, value]) => {
                      const changed = result.original_parameters[key] !== value
                      return (
                        <div 
                          key={key} 
                          className={`flex justify-between items-center p-3 rounded ${
                            changed ? 'bg-green-500/20 border border-green-500/30' : 'bg-zinc-900/50'
                          }`}
                        >
                          <span className="text-zinc-300 text-sm">
                            {key} {changed && <span className="text-green-400 text-xs ml-2">→ Cambió</span>}
                          </span>
                          <span className={`font-medium ${changed ? 'text-green-400' : 'text-white'}`}>
                            {String(value)}
                          </span>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Mejoras Esperadas */}
              {result.expected_improvements && result.expected_improvements.length > 0 && (
                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center gap-2">
                      <span>📈</span> Mejoras Esperadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.expected_improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-zinc-300">
                          <span className="text-blue-400 mt-1">✓</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <Card className="bg-yellow-500/10 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-yellow-400 flex items-center gap-2">
                      <span>⚠️</span> Advertencias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-zinc-300">
                          <span className="text-yellow-400 mt-1">!</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Acciones */}
              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
                <Button
                  onClick={handleOptimize}
                  variant="outline"
                  className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                  🔄 Optimizar de nuevo
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✓ Aplicar cambios
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
