'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Trade {
  symbol: string
  type: string
  volume: number
  price_open: number
  profit: number
  time: string
}

interface StrategyChartProps {
  data: Trade[]
}

export default function StrategyChart({ data }: StrategyChartProps) {
  // Process data for chart
  const chartData = data.map((trade, index) => ({
    trade: index + 1,
    profit: trade.profit,
    cumulative: data.slice(0, index + 1).reduce((sum, t) => sum + t.profit, 0),
    time: new Date(trade.time).toLocaleTimeString()
  }))

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Profit Evolution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="trade"
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            labelStyle={{ color: '#F9FAFB' }}
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#ff6c02"
            strokeWidth={2}
            dot={{ fill: '#ff6c02', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}