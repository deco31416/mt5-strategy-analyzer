'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Target, 
  Clock, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign
} from 'lucide-react'

interface StrategyDetectionPanelProps {
  summary: {
    strategy: string
    strategy_description: string
    explanation: string
    timeframe: string
    indicators: string[]
    trading_style?: string
    risk_profile?: string
    confidence_score?: number
    
    // Datos históricos que determinan la estrategia
    historical_total_trades?: number
    historical_win_rate?: number
    historical_profit?: number
    best_trade?: number
    worst_trade?: number
    longest_win_streak?: number
    longest_loss_streak?: number
    
    // Análisis actual
    total_trades: number
    win_rate?: number
    net_profit: number
    
    // Análisis por sesiones y símbolos
    best_session?: string
    best_symbol?: string
  }
}

export default function StrategyDetectionPanel({ summary }: StrategyDetectionPanelProps) {
  const getConfidenceColor = (score?: number) => {
    if (!score) return 'bg-gray-500'
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getRiskProfileColor = (profile?: string) => {
    switch (profile?.toLowerCase()) {
      case 'conservative': return 'text-green-600 bg-green-50'
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'aggressive': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header: Estrategia Detectada */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Estrategia Detectada Automáticamente</CardTitle>
              </div>
              <CardDescription>
                Basado en análisis de {summary.historical_total_trades || summary.total_trades} trades históricos
              </CardDescription>
            </div>
            {summary.confidence_score && (
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground mb-1">Confianza</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getConfidenceColor(summary.confidence_score)}`}
                      style={{ width: `${summary.confidence_score}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{summary.confidence_score}%</span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nombre de la Estrategia */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-primary mb-2">{summary.strategy}</h3>
            <p className="text-muted-foreground">{summary.strategy_description}</p>
          </div>

          {/* Tags de clasificación */}
          <div className="flex flex-wrap gap-2">
            {summary.timeframe && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Timeframe: {summary.timeframe}
              </Badge>
            )}
            {summary.trading_style && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Estilo: {summary.trading_style}
              </Badge>
            )}
            {summary.risk_profile && (
              <Badge className={getRiskProfileColor(summary.risk_profile)}>
                Riesgo: {summary.risk_profile}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cómo se Determinó la Estrategia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            ¿Cómo se Determinó Esta Estrategia?
          </CardTitle>
          <CardDescription>
            Análisis basado en patrones de trading históricos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>🔍 Explicación:</strong> {summary.explanation}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Datos Históricos Analizados */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Datos Históricos Analizados
              </h4>
              <div className="space-y-2 text-sm">
                {summary.historical_total_trades && (
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-muted-foreground">Total Trades:</span>
                    <span className="font-bold">{summary.historical_total_trades}</span>
                  </div>
                )}
                {summary.historical_win_rate !== undefined && (
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-muted-foreground">Win Rate Histórico:</span>
                    <span className="font-bold text-green-600">{(summary.historical_win_rate || 0).toFixed(2)}%</span>
                  </div>
                )}
                {summary.longest_win_streak && (
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-muted-foreground">Racha Ganadora:</span>
                    <span className="font-bold">{summary.longest_win_streak} trades</span>
                  </div>
                )}
                {summary.longest_loss_streak && (
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-muted-foreground">Racha Perdedora:</span>
                    <span className="font-bold">{summary.longest_loss_streak} trades</span>
                  </div>
                )}
                {summary.best_trade !== undefined && (
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span className="text-muted-foreground">Mejor Trade:</span>
                    <span className="font-bold text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      ${(summary.best_trade || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {summary.worst_trade !== undefined && (
                  <div className="flex justify-between p-2 bg-red-50 rounded">
                    <span className="text-muted-foreground">Peor Trade:</span>
                    <span className="font-bold text-red-600 flex items-center gap-1">
                      <ArrowDownRight className="h-3 w-3" />
                      ${(summary.worst_trade || 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Patrones Detectados */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Patrones Detectados
              </h4>
              <div className="space-y-2 text-sm">
                {summary.best_session && (
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-muted-foreground">Mejor Sesión:</span>
                    <p className="font-bold">{summary.best_session}</p>
                  </div>
                )}
                {summary.best_symbol && (
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-muted-foreground">Mejor Símbolo:</span>
                    <p className="font-bold">{summary.best_symbol}</p>
                  </div>
                )}
                {summary.timeframe && (
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-muted-foreground">Timeframe:</span>
                    <p className="font-bold">{summary.timeframe}</p>
                  </div>
                )}
                {summary.historical_profit !== undefined && (
                  <div className={`p-2 rounded ${(summary.historical_profit || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <span className="text-muted-foreground">Profit Total Histórico:</span>
                    <p className={`font-bold flex items-center gap-1 ${(summary.historical_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <DollarSign className="h-3 w-3" />
                      ${(summary.historical_profit || 0).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores Detectados */}
      {summary.indicators && summary.indicators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Indicadores Técnicos Detectados
            </CardTitle>
            <CardDescription>
              Basado en patrones de entrada y salida observados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {summary.indicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{indicator}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  <strong>Nota:</strong> Los indicadores son inferidos basándose en patrones de trading. 
                  Para confirmación exacta, verifica la configuración de tu EA o estrategia.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen Visual */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">
                {summary.historical_total_trades || summary.total_trades}
              </div>
              <div className="text-sm text-muted-foreground">Trades Analizados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {(summary.historical_win_rate || summary.win_rate || 0).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div>
              <div className={`text-3xl font-bold ${(summary.historical_profit || summary.net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(summary.historical_profit || summary.net_profit || 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Profit Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
