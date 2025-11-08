"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Trade {
  ticket: number
  symbol: string
  type: string
  volume: number
  price: number
  profit: number
  time: string
  commission: number
  swap: number
}

interface TradesHistoryProps {
  data: Trade[]
  loading: boolean
  onRefresh: () => void
  total: number
}

export function TradesHistoryPanel({ data, loading, onRefresh, total }: TradesHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'profit' | 'loss'>('all')

  const filteredData = data.filter(trade => {
    if (filter === 'profit') return trade.profit > 0
    if (filter === 'loss') return trade.profit < 0
    return true
  })

  const totalProfit = data.reduce((sum, trade) => sum + trade.profit, 0)
  const winRate = data.length > 0 ? (data.filter(t => t.profit > 0).length / data.length * 100) : 0

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-orange-500/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-orange-500">📊</span>
          Historial de Operaciones MT5
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Historial completo de trades cerrados en tu cuenta MT5
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
            <div className="text-xs text-zinc-400 mb-1">Total Trades</div>
            <div className="text-xl font-bold text-orange-500">{total}</div>
          </div>
          <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
            <div className="text-xs text-zinc-400 mb-1">Win Rate</div>
            <div className="text-xl font-bold text-green-500">{winRate.toFixed(1)}%</div>
          </div>
          <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
            <div className="text-xs text-zinc-400 mb-1">P/L Total</div>
            <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${totalProfit.toFixed(2)}
            </div>
          </div>
          <div className="text-center bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
            <div className="text-xs text-zinc-400 mb-1">Trades Mostrados</div>
            <div className="text-xl font-bold text-blue-500">{filteredData.length}</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => setFilter('all')}
            className={`${filter === 'all' ? 'bg-orange-600' : 'bg-zinc-800 border border-zinc-700'} hover:bg-orange-700`}
          >
            Todos ({data.length})
          </Button>
          <Button
            onClick={() => setFilter('profit')}
            className={`${filter === 'profit' ? 'bg-green-600' : 'bg-zinc-800 border border-zinc-700'} hover:bg-green-700`}
          >
            Ganadores ({data.filter(t => t.profit > 0).length})
          </Button>
          <Button
            onClick={() => setFilter('loss')}
            className={`${filter === 'loss' ? 'bg-red-600' : 'bg-zinc-800 border border-zinc-700'} hover:bg-red-700`}
          >
            Perdedores ({data.filter(t => t.profit < 0).length})
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-zinc-500">Cargando historial de operaciones...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            {filter === 'all' ? 'No hay operaciones en el historial' : `No hay operaciones ${filter === 'profit' ? 'ganadoras' : 'perdedoras'}`}
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-900">
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-zinc-400 py-2">#</th>
                  <th className="text-left text-zinc-400 py-2">Ticket</th>
                  <th className="text-left text-zinc-400 py-2">Símbolo</th>
                  <th className="text-left text-zinc-400 py-2">Tipo</th>
                  <th className="text-left text-zinc-400 py-2">Volumen</th>
                  <th className="text-left text-zinc-400 py-2">Precio</th>
                  <th className="text-left text-zinc-400 py-2">P/L</th>
                  <th className="text-left text-zinc-400 py-2">Comisión</th>
                  <th className="text-left text-zinc-400 py-2">Swap</th>
                  <th className="text-left text-zinc-400 py-2">Fecha/Hora</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((trade, index) => (
                  <tr key={trade.ticket} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <td className="text-zinc-300 py-2">{index + 1}</td>
                    <td className="text-zinc-300 py-2 font-mono">{trade.ticket}</td>
                    <td className="text-zinc-300 py-2 font-semibold">{trade.symbol}</td>
                    <td className={`py-2 font-semibold ${trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.type}
                    </td>
                    <td className="text-zinc-300 py-2">{trade.volume}</td>
                    <td className="text-zinc-300 py-2 font-mono">{trade.price.toFixed(5)}</td>
                    <td className={`py-2 font-semibold ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${trade.profit.toFixed(2)}
                    </td>
                    <td className="text-zinc-400 py-2">${trade.commission.toFixed(2)}</td>
                    <td className="text-zinc-400 py-2">${trade.swap.toFixed(2)}</td>
                    <td className="text-zinc-400 py-2 text-xs">
                      {new Date(trade.time).toLocaleString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-zinc-500">
            Mostrando {filteredData.length} de {total} operaciones
          </div>
          <Button
            onClick={onRefresh}
            disabled={loading}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
          >
            🔄 Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}