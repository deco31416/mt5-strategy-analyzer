"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Statistics {
  total_analysis: number
  total_trades: number
  total_profit: number
  best_strategy: {
    name: string
    profit: number
  }
}

interface StatisticsPanelProps {
  data: Statistics | null
  loading: boolean
  onRefresh: () => void
}

export default function StatisticsPanel({ data, loading, onRefresh }: StatisticsPanelProps) {
  const [backupLoading, setBackupLoading] = useState(false)

  const createBackup = async () => {
    setBackupLoading(true)
    try {
      const response = await fetch('http://localhost:8080/backup', { method: 'POST' })
      const result = await response.json()
      alert(`✅ ${result.message}\nArchivo: ${result.path}`)
    } catch (error) {
      alert('❌ Error creando backup')
    }
    setBackupLoading(false)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 card-hover">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-orange-500">📊</span>
          Estadísticas Globales
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Resumen general del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-zinc-500">Cargando estadísticas...</div>
        ) : !data ? (
          <div className="text-center py-8 text-zinc-500">
            No hay datos disponibles
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="text-sm text-zinc-400 mb-1">Total Análisis</div>
                <div className="text-3xl font-bold text-orange-500">{data.total_analysis}</div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="text-sm text-zinc-400 mb-1">Total Trades</div>
                <div className="text-3xl font-bold text-orange-500">{data.total_trades}</div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 col-span-2">
                <div className="text-sm text-zinc-400 mb-1">Profit Total Acumulado</div>
                <div className={`text-3xl font-bold ${(data.total_profit || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${(data.total_profit || 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg p-4 border border-orange-500/30 mb-4">
              <div className="text-sm text-zinc-400 mb-1">🏆 Mejor Estrategia</div>
              <div className="text-lg font-bold text-white">{data.best_strategy?.name || 'N/A'}</div>
              <div className="text-sm text-green-500">
                Profit: ${(data.best_strategy?.profit || 0).toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={createBackup}
                disabled={backupLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 glow-orange font-semibold"
              >
                {backupLoading ? 'Creando Backup...' : '💾 Crear Backup de Datos'}
              </Button>
              
              <Button
                onClick={onRefresh}
                variant="outline"
                className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
              >
                🔄 Actualizar Estadísticas
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
