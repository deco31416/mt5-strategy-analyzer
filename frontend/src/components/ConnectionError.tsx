"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Terminal, Wifi, WifiOff } from "lucide-react"

interface ConnectionErrorProps {
  error?: string
  onRetry?: () => void
  onGenerateDemo?: () => void
}

export default function ConnectionError({ error, onRetry, onGenerateDemo }: ConnectionErrorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="bg-zinc-900 border-red-500/50 max-w-2xl w-full card-hover">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <WifiOff className="w-20 h-20 text-red-500 animate-pulse" />
              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <CardTitle className="text-2xl text-white">
            ⚠️ MT5 No Conectado
          </CardTitle>
          <CardDescription className="text-zinc-400 text-base mt-2">
            {error || "No se puede conectar a MetaTrader 5. Asegúrate de que MT5 esté abierto y funcionando."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Instrucciones */}
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-orange-500" />
              Pasos para conectar MT5:
            </h3>
            <ol className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">1.</span>
                <span>Abre <strong className="text-white">MetaTrader 5</strong> en tu computadora</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">2.</span>
                <span>Asegúrate de estar <strong className="text-white">conectado a tu broker</strong> (icono verde en esquina inferior derecha)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">3.</span>
                <span>Verifica que tengas <strong className="text-white">posiciones abiertas</strong> o historial de trades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">4.</span>
                <span>Haz clic en <strong className="text-white">"Reintentar Conexión"</strong> abajo</span>
              </li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
            <h3 className="text-yellow-500 font-semibold mb-2 flex items-center gap-2">
              💡 Problemas comunes:
            </h3>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>• MT5 cerrado o no iniciado</li>
              <li>• Desconectado del servidor del broker</li>
              <li>• Cuenta demo/real sin posiciones abiertas</li>
              <li>• Firewall bloqueando la conexión local</li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={onRetry}
              className="w-full bg-orange-600 hover:bg-orange-700 glow-orange font-semibold flex items-center justify-center gap-2"
            >
              <Wifi className="w-4 h-4" />
              Reintentar Conexión
            </Button>

            <Button
              onClick={onGenerateDemo}
              variant="outline"
              className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              Ver Estrategia Demo
            </Button>
          </div>

          {/* Info adicional */}
          <div className="text-center text-xs text-zinc-500 pt-4 border-t border-zinc-800">
            <p>¿Primera vez usando MT5? Descarga desde <a href="https://www.metatrader5.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">metatrader5.com</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
