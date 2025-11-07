'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ExplainerProps {
  strategy: string
  timeframe: string
  indicators: string[]
  explanation: string
}

export default function StrategyExplainer({ strategy, timeframe, indicators, explanation }: ExplainerProps) {

  const getSimpleExplanation = () => {
    if (strategy.includes('Grid') || strategy.includes('Scalping')) {
      return {
        title: '🤖 ¿Cómo funciona Grid/Scalping? (Explicación para principiantes)',
        sections: [
          {
            emoji: '🎯',
            title: '¿Qué es esta estrategia?',
            content: `Imagina que tienes una red de pesca 🎣 en el océano. En lugar de esperar a UN pez grande, colocas muchas redes pequeñas en diferentes profundidades. Cada vez que un pez pequeño entra, lo atrapas y ganas un poquito. ¡Eso es Grid/Scalping!

En trading:
• En lugar de hacer 1 operación grande, haces MUCHAS operaciones pequeñas
• Cada operación busca ganar poco dinero (como $5-$20)
• Las operaciones se abren automáticamente cuando el precio se mueve
• Es como ser un comerciante que vende muchos productos baratos en vez de uno caro`
          },
          {
            emoji: '📊',
            title: '¿Qué velas/gráficos usar?',
            content: `🕐 Timeframe recomendado: ${timeframe}

¿Qué significa esto?
• M1 = Cada vela = 1 minuto (muy rápido, muchas operaciones)
• M5 = Cada vela = 5 minutos (rápido)
• M15 = Cada vela = 15 minutos (medio)
• H1 = Cada vela = 1 hora (lento)

Para Grid/Scalping, usa velas de 1-15 minutos porque:
✓ El precio se mueve rápido = más oportunidades
✓ Ganancias pequeñas pero frecuentes
✓ Perfecto para mercados que van de lado (no suben ni bajan mucho)`
          },
          {
            emoji: '🎮',
            title: '¿Cómo entra la estrategia?',
            content: `Paso a paso (como funciona el robot):

1️⃣ **Inicio**: Se abre la PRIMERA operación al precio actual
   Ejemplo: Bitcoin está en $50,000 → Abre 1 compra

2️⃣ **Espera movimiento**: El robot espera que el precio se mueva ${indicators.includes('50 puntos') ? '50' : '30-100'} puntos
   Ejemplo: Precio sube a $50,050 o baja a $49,950

3️⃣ **Nueva entrada**: ¡Automáticamente abre OTRA operación!
   • Si subió → Abre otra COMPRA
   • Si bajó → Abre VENTA
   
4️⃣ **Se repite**: Cada vez que el precio se mueve, abre nueva operación
   (Hasta un máximo de 10-20 operaciones abiertas)

5️⃣ **Cierre**: Cada operación se cierra cuando gana $10-30
   ¡Gana poco pero MUCHAS veces! 💰`
          },
          {
            emoji: '🔧',
            title: 'Indicadores técnicos necesarios',
            content: `Los "ayudantes" que usa la estrategia:

📍 **Niveles de Soporte/Resistencia**
   → Son como "pisos" y "techos" invisibles del precio
   → El precio rebota en estos niveles
   → El robot coloca operaciones cerca de estos niveles

📈 **Promedios Móviles (Moving Averages)**
   → Líneas que muestran el precio promedio
   → Si el precio está arriba = tendencia alcista
   → Si está abajo = tendencia bajista

🎈 **Bandas de Bollinger**
   → Como un "túnel" por donde se mueve el precio
   → Cuando el precio toca los bordes, el robot entra
   → Ayuda a saber si el precio está muy alto o bajo

No te preocupes, ¡el código ya tiene todo esto incluido! 🎉`
          },
          {
            emoji: '💡',
            title: '¿Cómo se integra en MT5?',
            content: `Pasos súper simples:

1️⃣ **Descarga el código** (botón "Descargar MQL5" arriba)
   → Se descarga un archivo .mq5

2️⃣ **Abre MT5** en tu computadora
   → Ve a: Archivo → Abrir carpeta de datos

3️⃣ **Coloca el archivo**
   → Busca la carpeta: MQL5 → Experts
   → Copia el archivo .mq5 ahí

4️⃣ **Compila** (traduce el código para MT5)
   → Abre MetaEditor (F4 en MT5)
   → Haz clic en "Compilar"
   → Si sale "0 errors" = ¡Éxito! ✅

5️⃣ **Activa el robot**
   → En MT5, arrastra el Expert Advisor al gráfico
   → Activa "Auto trading" (botón verde arriba)
   → ¡Ya está trabajando solo! 🤖`
          },
          {
            emoji: '🎓',
            title: '¿Cómo practicar sin riesgo?',
            content: `¡IMPORTANTE! Nunca uses dinero real al principio:

✅ **1. Cuenta DEMO** (gratis, dinero falso)
   • Abre una cuenta demo en tu broker
   • Tienes $10,000 - $100,000 virtuales
   • Practica por 1-2 meses mínimo
   • ¡No puedes perder dinero real!

✅ **2. Strategy Tester** (simulador de MT5)
   • En MT5: Ver → Strategy Tester
   • Selecciona tu robot
   • Elige fecha pasada (ejemplo: últimos 3 meses)
   • Dale "Start" → ¡Ve cómo hubiera funcionado!

✅ **3. Micro lotes** (cuando vayas a real)
   • Empieza con 0.01 lotes = $0.10 por pip
   • Si ganas $5, solo arriesgaste centavos
   • Aumenta LENTAMENTE si funciona

⚠️ Regla de oro: Si pierdes más de 2 trades seguidos, DETÉN el robot y revisa qué pasó`
          },
          {
            emoji: '⚡',
            title: 'Configuración recomendada para empezar',
            content: `Parámetros seguros para principiantes:

🔹 **GridStep** = 50 puntos
   (Distancia entre operaciones)
   → Muy pequeño = muchas operaciones = más riesgo
   → Muy grande = pocas operaciones = menos ganancia
   → 50 es equilibrado ⚖️

🔹 **LotSize** = 0.01 lotes
   (Tamaño de cada operación)
   → 0.01 = mínimo, súper seguro
   → NO uses más de 0.05 al inicio

🔹 **MaxOrders** = 10
   (Máximo de operaciones simultáneas)
   → Menos = más seguro
   → Más = puede ganar más pero RIESGO

🔹 **TakeProfit** = 30 puntos ($3-$10 por trade)
   → Ganancia objetivo de cada operación

🔹 **StopLoss** = 100 puntos
   → Pérdida máxima permitida por operación

💰 Capital mínimo recomendado: $500-$1000 (o demo)`
          }
        ]
      }
    }

    // Default explanation for other strategies
    return {
      title: `🎓 ¿Cómo funciona ${strategy}? (Guía simple)`,
      sections: [
        {
          emoji: '🎯',
          title: 'Concepto básico',
          content: explanation
        },
        {
          emoji: '📊',
          title: 'Timeframe recomendado',
          content: `Esta estrategia funciona mejor en velas de: ${timeframe}`
        },
        {
          emoji: '🔧',
          title: 'Indicadores necesarios',
          content: indicators.join('\n• ')
        }
      ]
    }
  }

  const simpleExplanation = getSimpleExplanation()

  return (
    <Card className="bg-gradient-to-br from-purple-900 to-gray-900 border-purple-700">
      <CardHeader>
        <CardTitle className="text-white text-2xl font-heading">{simpleExplanation.title}</CardTitle>
        <CardDescription className="text-purple-200">
          Explicación paso a paso para que entiendas TODO sobre esta estrategia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {simpleExplanation.sections.map((section, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-purple-600/30">
            <h3 className="text-xl font-bold font-heading text-purple-300 mb-3">
              {section.emoji} {section.title}
            </h3>
            <div className="text-gray-200 whitespace-pre-line leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}

        <div className="bg-orange-900/30 border border-orange-500 rounded-lg p-4 mt-6">
          <h4 className="text-orange-300 font-bold mb-2">⚠️ ADVERTENCIA IMPORTANTE</h4>
          <p className="text-orange-100 text-sm">
            • El trading tiene RIESGO de pérdida de capital<br/>
            • NUNCA inviertas dinero que no puedas perder<br/>
            • Practica MÍNIMO 2 meses en demo antes de usar dinero real<br/>
            • Los resultados pasados NO garantizan resultados futuros<br/>
            • Esta estrategia puede NO funcionar en mercados con tendencia fuerte
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
