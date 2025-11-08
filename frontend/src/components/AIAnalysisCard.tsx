import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AIAnalysisData {
  ai_powered: boolean
  strategy_name: string
  confidence_score: number
  detailed_analysis: string
  strengths: string[]
  weaknesses: string[]
  market_conditions: string
  trading_style: string
  risk_profile: string
}

interface AIAnalysisCardProps {
  analysis: AIAnalysisData
}

export function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20'
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-orange-400 bg-orange-500/20'
  }

  const getRiskColor = (profile: string) => {
    if (profile.toLowerCase().includes('conservador')) return 'bg-blue-500/20 text-blue-300'
    if (profile.toLowerCase().includes('moderado')) return 'bg-yellow-500/20 text-yellow-300'
    return 'bg-red-500/20 text-red-300'
  }

  if (!analysis.ai_powered) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>🤖</span> Análisis AI
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Configurar OpenAI API para habilitar análisis inteligente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-sm text-zinc-400">
            <p>⚠️ Análisis básico activo. Para obtener:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nombres de estrategia inteligentes</li>
              <li>Análisis detallado con IA</li>
              <li>Recomendaciones personalizadas</li>
              <li>Optimización de parámetros</li>
            </ul>
            <p className="mt-3 text-orange-400">
              Agrega tu OPENAI_API_KEY en el archivo .env del backend
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <span>🤖</span> Análisis con IA
          </CardTitle>
          <Badge className={getConfidenceColor(analysis.confidence_score)}>
            {analysis.confidence_score}% confianza
          </Badge>
        </div>
        <CardDescription className="text-zinc-400">
          {analysis.strategy_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Análisis Detallado */}
        <div className="bg-zinc-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-orange-400 mb-2">📊 Análisis Detallado</h4>
          <p className="text-sm text-zinc-300 leading-relaxed">{analysis.detailed_analysis}</p>
        </div>

        {/* Fortalezas */}
        {analysis.strengths && analysis.strengths.length > 0 && (
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
            <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Fortalezas</h4>
            <ul className="space-y-1">
              {analysis.strengths.map((strength, idx) => (
                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Debilidades */}
        {analysis.weaknesses && analysis.weaknesses.length > 0 && (
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Debilidades</h4>
            <ul className="space-y-1">
              {analysis.weaknesses.map((weakness, idx) => (
                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Información Adicional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-zinc-800/50 p-3 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Estilo de Trading</div>
            <div className="text-sm text-white font-medium">{analysis.trading_style}</div>
          </div>
          <div className="bg-zinc-800/50 p-3 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Perfil de Riesgo</div>
            <Badge className={getRiskColor(analysis.risk_profile)}>
              {analysis.risk_profile}
            </Badge>
          </div>
        </div>

        <div className="bg-zinc-800/50 p-3 rounded-lg">
          <div className="text-xs text-zinc-500 mb-1">Condiciones de Mercado Óptimas</div>
          <div className="text-sm text-white">{analysis.market_conditions}</div>
        </div>
      </CardContent>
    </Card>
  )
}
