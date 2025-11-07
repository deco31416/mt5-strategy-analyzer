'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HyperliquidProps {
  strategy: string
  timeframe: string
  netProfit: number
  avgProfit: number
  totalTrades: number
}

export default function HyperliquidReplicator({ strategy, timeframe, netProfit, avgProfit, totalTrades }: HyperliquidProps) {
  const analyzeViability = () => {
    const isGridScalping = strategy.includes('Grid') || strategy.includes('Scalping')
    const isFastTimeframe = timeframe.includes('M1') || timeframe.includes('M5') || timeframe.includes('M15')
    
    // Hyperliquid tiene latencia ~200-500ms
    const hyperliquidLatency = 300 // ms promedio
    const requiredSpeed = isFastTimeframe ? 100 : 500 // ms
    
    const isViable = !isFastTimeframe || avgProfit > 5 // Si no es ultra-rápido o las ganancias justifican la latencia
    
    return {
      isViable,
      latency: hyperliquidLatency,
      requiredSpeed,
      warnings: isGridScalping && isFastTimeframe ? [
        '⚠️ Alta frecuencia detectada - la latencia puede afectar entradas',
        '⚠️ Considera aumentar GridStep para compensar latencia',
        '⚠️ Gas fees en blockchain pueden reducir profits pequeños'
      ] : [],
      advantages: [
        '✅ No requiere KYC en Hyperliquid',
        '✅ Fully on-chain y descentralizado',
        '✅ Apalancamiento hasta 50x disponible',
        '✅ Gas fees muy bajos (~$0.001 por trade)',
        '✅ Liquidez profunda en pares principales'
      ]
    }
  }

  const viability = analyzeViability()

  return (
    <Card className="bg-gradient-to-br from-blue-900 to-gray-900 border-blue-700">
      <CardHeader>
        <CardTitle className="text-white text-2xl">
          🌐 Replicar estrategia en Hyperliquid
        </CardTitle>
        <CardDescription className="text-blue-200">
          Guía completa para implementar esta estrategia en DEX descentralizado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
            {/* Viability Analysis */}
            <div className={`rounded-lg p-4 border-2 ${viability.isViable ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                {viability.isViable ? '✅ VIABLE' : '⚠️ VIABLE CON MODIFICACIONES'}
                <span className="text-sm font-normal">
                  (Análisis de {totalTrades} trades)
                </span>
              </h3>
              
              <div className="space-y-2 text-sm">
                <p className="text-gray-200">
                  <strong>Latencia Hyperliquid:</strong> ~{viability.latency}ms promedio
                </p>
                <p className="text-gray-200">
                  <strong>Velocidad requerida:</strong> {'<'}{viability.requiredSpeed}ms para {timeframe}
                </p>
                <p className="text-gray-200">
                  <strong>Profit promedio:</strong> ${avgProfit.toFixed(2)} por trade
                </p>
              </div>

              {viability.warnings.length > 0 && (
                <div className="mt-3 space-y-1">
                  {viability.warnings.map((warning, i) => (
                    <p key={i} className="text-orange-300 text-sm">{warning}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Advantages */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-600/30">
              <h3 className="text-xl font-bold text-blue-300 mb-3">
                💎 Ventajas de Hyperliquid
              </h3>
              <div className="space-y-2">
                {viability.advantages.map((adv, i) => (
                  <p key={i} className="text-gray-200 text-sm">{adv}</p>
                ))}
              </div>
            </div>

            {/* Setup Guide */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-600/30">
              <h3 className="text-xl font-bold text-cyan-300 mb-3">
                🔧 Configuración paso a paso
              </h3>
              <div className="space-y-4 text-gray-200">
                <div>
                  <h4 className="font-bold text-white mb-2">1️⃣ Conecta tu Wallet</h4>
                  <p className="text-sm">
                    • Ve a <a href="https://app.hyperliquid.xyz" target="_blank" className="text-cyan-400 underline">app.hyperliquid.xyz</a><br/>
                    • Conecta MetaMask o WalletConnect<br/>
                    • Asegúrate de estar en Arbitrum One network<br/>
                    • Deposita USDC (mínimo $100 recomendado)
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">2️⃣ Instala Hyperliquid Python SDK</h4>
                  <div className="bg-black/50 rounded p-3 mt-2 font-mono text-xs">
                    <code className="text-green-400">
                      pip install hyperliquid-python-sdk eth-account
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">3️⃣ Código de implementación</h4>
                  <div className="bg-black/50 rounded p-3 mt-2 font-mono text-xs overflow-x-auto">
                    <pre className="text-green-400">{`from hyperliquid.info import Info
from hyperliquid.exchange import Exchange
from eth_account import Account
import time

# Tu private key (¡NUNCA la compartas!)
PRIVATE_KEY = "0x..."
account = Account.from_key(PRIVATE_KEY)

# Inicializar
info = Info()
exchange = Exchange(account, info)

# Parámetros (ajusta según tu análisis)
SYMBOL = "BTC"
GRID_STEP = ${timeframe.includes('M1') ? '100' : '50'}
LOT_SIZE = 0.01
MAX_ORDERS = 10
TAKE_PROFIT = ${Math.max(50, avgProfit * 2)}
STOP_LOSS = ${Math.max(100, Math.abs(avgProfit) * 5)}

def get_mid_price(symbol):
    orderbook = info.l2_snapshot(symbol)
    bid = float(orderbook['levels'][0][0]['px'])
    ask = float(orderbook['levels'][1][0]['px'])
    return (bid + ask) / 2

def place_order(symbol, is_buy, size, reduce_only=False):
    try:
        order = {
            "coin": symbol,
            "is_buy": is_buy,
            "sz": size,
            "limit_px": get_mid_price(symbol),
            "order_type": {"limit": {"tif": "Gtc"}},
            "reduce_only": reduce_only
        }
        result = exchange.order(order)
        return result
    except Exception as e:
        print(f"Error: {'{e}'}")
        return None

def grid_strategy():
    last_price = get_mid_price(SYMBOL)
    print(f"Bot iniciado en {'{SYMBOL}'} @ {'{last_price}'}")
    
    while True:
        try:
            current_price = get_mid_price(SYMBOL)
            positions = info.user_state(account.address)
            open_orders = len(positions.get('assetPositions', []))
            
            if open_orders < MAX_ORDERS:
                price_diff = abs(current_price - last_price)
                
                if price_diff >= GRID_STEP:
                    is_buy = current_price > last_price
                    result = place_order(SYMBOL, is_buy, LOT_SIZE)
                    
                    if result and result['status'] == 'ok':
                        action = 'COMPRA' if is_buy else 'VENTA'
                        print(f"Trade: {'{action}'} @ {'{current_price}'}")
                        last_price = current_price
            
            check_positions_and_close(positions)
            time.sleep(1)
            
        except Exception as e:
            print(f"Error: {'{e}'}")
            time.sleep(5)

# Ejecutar bot
if __name__ == "__main__":
    grid_strategy()
`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">4️⃣ Parámetros optimizados para Hyperliquid</h4>
                  <div className="bg-blue-900/30 rounded p-3 space-y-2 text-sm">
                    <p><strong>GridStep:</strong> {timeframe.includes('M1') ? '100-200' : '50-100'} (mayor que MT5 por latencia)</p>
                    <p><strong>TakeProfit:</strong> ${Math.max(50, avgProfit * 2)} (mayor para cubrir fees)</p>
                    <p><strong>StopLoss:</strong> ${Math.max(100, Math.abs(avgProfit) * 5)}</p>
                    <p><strong>MaxOrders:</strong> 5-10 (empezar conservador)</p>
                    <p><strong>Capital mínimo:</strong> $500-1000 USDC</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">5️⃣ Consideraciones importantes</h4>
                  <div className="space-y-2 text-sm">
                    <p>⚡ <strong>Latencia:</strong> ~300ms vs ~50ms en MT5 (6x más lento)</p>
                    <p>💸 <strong>Fees:</strong> Maker: 0.02% | Taker: 0.05% (muy competitivos)</p>
                    <p>🔒 <strong>Seguridad:</strong> Usa wallet dedicada solo para trading</p>
                    <p>📊 <strong>Liquidez:</strong> Mejor en BTC, ETH, ARB (evita pairs exóticos)</p>
                    <p>🌐 <strong>Network:</strong> Asegúrate de tener ETH en Arbitrum para gas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Warning */}
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <h4 className="text-red-300 font-bold mb-2">⚠️ RIESGOS ESPECÍFICOS DEX</h4>
              <div className="text-red-100 text-sm space-y-1">
                <p>• Smart contract risk (aunque Hyperliquid está auditado)</p>
                <p>• Necesitas custodiar tu private key (si la pierdes, pierdes todo)</p>
                <p>• Latencia puede causar slippage en entradas/salidas</p>
                <p>• Impermanent loss no aplica, pero sí hay liquidation risk con apalancamiento</p>
                <p>• SIEMPRE prueba primero en testnet o con cantidades mínimas</p>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-600/30">
              <h3 className="text-xl font-bold text-purple-300 mb-3">
                📚 Recursos útiles
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  📖 <a href="https://hyperliquid.gitbook.io/hyperliquid-docs" target="_blank" className="text-cyan-400 underline">
                    Hyperliquid Documentation
                  </a>
                </p>
                <p>
                  🐍 <a href="https://github.com/hyperliquid-dex/hyperliquid-python-sdk" target="_blank" className="text-cyan-400 underline">
                    Python SDK GitHub
                  </a>
                </p>
                <p>
                  💬 <a href="https://discord.gg/hyperliquid" target="_blank" className="text-cyan-400 underline">
                    Discord Community
                  </a>
                </p>
                <p>
                  📊 <a href="https://app.hyperliquid.xyz/TradingView" target="_blank" className="text-cyan-400 underline">
                    TradingView Charts
                  </a>
                </p>
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={() => {
                const blob = new Blob([document.querySelector('pre')?.textContent || ''], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'hyperliquid_grid_bot.py'
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
            📥 Descargar código Python para Hyperliquid
          </Button>
        </CardContent>
      </Card>
  )
}