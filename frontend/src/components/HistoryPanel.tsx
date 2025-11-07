"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface HistoryItem {
  id: number
  timestamp: string
  strategy_name: string
  total_trades: number
  net_profit: number
  win_rate: number
  profit_factor: number
}

export default function HistoryPanel() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/history?limit=20')
      const data = await response.json()
      setHistory(data.history || [])
    } catch (error) {
      console.error('Error loading history:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <Card className="bg-zinc-900 border-zinc-800 card-hover">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-orange-500">📜</span>
          Historial de Análisis
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Últimos 20 análisis guardados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-zinc-500">Cargando...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            No hay historial disponible. Ejecuta un análisis para comenzar.
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-semibold">{item.strategy_name}</h4>
                    <p className="text-xs text-zinc-400">
                      {new Date(item.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div className={`text-sm font-bold ${item.net_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${item.net_profit?.toFixed(2) || '0.00'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center bg-zinc-900/50 rounded p-2">
                    <div className="text-xs text-zinc-400">Trades</div>
                    <div className="text-sm font-semibold text-orange-500">{item.total_trades || 0}</div>
                  </div>
                  <div className="text-center bg-zinc-900/50 rounded p-2">
                    <div className="text-xs text-zinc-400">Win Rate</div>
                    <div className="text-sm font-semibold text-green-500">{item.win_rate?.toFixed(1) || 0}%</div>
                  </div>
                  <div className="text-center bg-zinc-900/50 rounded p-2">
                    <div className="text-xs text-zinc-400">PF</div>
                    <div className={`text-sm font-semibold ${(item.profit_factor || 0) >= 1 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.profit_factor?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={loadHistory}
          className="mt-4 w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition-colors"
        >
          🔄 Actualizar
        </button>
      </CardContent>
    </Card>
  )
}
