"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Alert {
  id: number
  timestamp: string
  alert_type: string
  severity: string
  message: string
}

interface AlertsPanelProps {
  data: Alert[]
  loading: boolean
  onRefresh: () => void
}

export default function AlertsPanel({ data, loading, onRefresh }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 border-red-500/50'
      case 'warning':
        return 'text-yellow-500 border-yellow-500/50'
      case 'info':
        return 'text-blue-500 border-blue-500/50'
      default:
        return 'text-zinc-500 border-zinc-500/50'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🚨'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 card-hover">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-orange-500">🔔</span>
          Alertas del Sistema
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Notificaciones y advertencias importantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-zinc-500">Cargando alertas...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-green-500">
            ✅ No hay alertas. Todo funciona correctamente.
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {data.map((alert) => (
              <div
                key={alert.id}
                className={`bg-zinc-800/50 rounded-lg p-4 border-l-4 ${getSeverityColor(alert.severity)} transition-all duration-300 hover:bg-zinc-800/70`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-semibold ${getSeverityColor(alert.severity)}`}>
                        {alert.alert_type.replace(/_/g, ' ').toUpperCase()}
                      </h4>
                      <span className="text-xs text-zinc-400">
                        {new Date(alert.timestamp).toLocaleTimeString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={onRefresh}
          className="mt-4 w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition-colors"
        >
          🔄 Actualizar Alertas
        </button>
      </CardContent>
    </Card>
  )
}
