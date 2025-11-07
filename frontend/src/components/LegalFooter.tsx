'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function LegalFooter() {
  return (
    <footer className="relative bg-[#0e0e0e] border-t border-white/10">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 md:px-16 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Columna izquierda: logo + badges (1/4) */}
          <div className="lg:w-1/4 flex flex-col items-center lg:items-start gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image 
                src="/logo-alterhedge.png" 
                alt="AlterHedge" 
                width={48} 
                height={48}
                className="object-contain w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="text-white font-semibold text-base sm:text-lg lg:text-xl" style={{fontFamily: "'Orbitron', sans-serif"}}>AlterHedge</span>
            </div>
            
            {/* Badges horizontales */}
            <div className="flex flex-wrap items-center lg:items-start gap-2">
            {/* Legal links as badges */}
            <Link 
              href="terms" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Terminos
            </Link>

            <Link 
              href="/user-policies" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Políticas
            </Link>

            <Link 
              href="/cookies" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Cookies
            </Link>
            
            <Link 
              href="/privacy" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Privacidad
            </Link>
            
            <Link 
              href="/consent" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Consentimiento
            </Link>
            
            <Link 
              href="/kyc" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              KYC
            </Link>

            <Link 
              href="/risk" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Riesgos
            </Link>

            <Link 
              href="/ethics" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Ética
            </Link>

            <Link 
              href="/transparency" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Transparencia
            </Link>

            <Link 
              href="/Sanctions" 
              className="border-2 border-white/20 hover:border-white/40 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all duration-300 text-[10px] sm:text-xs font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Sanciones
            </Link>
            
            </div>
          </div>

          {/* Columna derecha: Disclaimer text corrido (3/4) */}
          <div className="lg:w-3/4 space-y-3">
            <p className="text-white/50 text-[10px] sm:text-xs leading-[1.8] text-justify">
              <span className="font-semibold text-white/70">Disclaimer:</span> La ejecución de operaciones depende de terceros y de la disponibilidad de sus servicios. AlterHedge no garantiza la continuidad, latencia, integridad de datos, precios ni éxito de las órdenes enviadas. Las decisiones del sistema se basan en modelos adaptativos de inteligencia artificial y en fuentes públicas o de terceros, que pueden contener errores, retrasos u omisiones. La IA no tiene personalidad jurídica ni responsabilidad propia. AlterHedge actúa exclusivamente como una herramienta de apoyo operativo (execution-only), conforme a los parámetros definidos por el usuario. No ofrece asesoría financiera, legal ni fiscal. El usuario mantiene control total sobre sus cuentas y fondos. El sistema no realiza custodia, ni cobro directo por rendimientos. El uso de AlterHedge implica la aceptación de los Términos del Servicio y la Política de Uso.
            </p>
            
            <p className="text-white/50 text-[10px] sm:text-xs leading-[1.8] text-justify">
              <span className="font-semibold text-white/70">Riesgo y condiciones:</span> AlterHedge ofrece asistencia operativa y ejecución automatizada (execution-only) conforme a los parámetros definidos por el propio usuario. No provee asesoría financiera, legal ni fiscal, ni realiza recomendaciones de inversión personalizadas. AlterHedge no es broker-dealer, asesor de inversiones, custodio ni intermediario financiero. El sistema actúa como una herramienta de apoyo para los usuarios que deseen optimizar su gestión operativa. Todas las decisiones de inversión son responsabilidad exclusiva del usuario, quien mantiene control total sobre sus cuentas y fondos. El trading de criptoactivos y derivados conlleva un alto nivel de riesgo, incluyendo la posible pérdida total del capital. Los resultados pasados, simulaciones o backtesting no garantizan rendimientos futuros.
            </p>
            
            <p className="text-white/50 text-[10px] sm:text-xs leading-[1.8] text-justify">
              <span className="font-semibold text-white/70">Uso y autorización:</span> El uso de AlterHedge está sujeto a procesos básicos de verificación KYC/AML y screening de sanciones, con el fin de prevenir actividades ilícitas y cumplir estándares internacionales de cumplimiento. Algunas funciones pueden no estar disponibles en determinadas jurisdicciones. Al activar la función Auto-Trade, el usuario autoriza la colocación, modificación y cancelación de órdenes dentro de sus propias cuentas, bajo los parámetros que él mismo configure (tamaño, apalancamiento, stops, kill-switch y demás límites de riesgo). AlterHedge no ejecuta operaciones sin autorización previa ni asume decisiones de inversión en nombre del usuario. El usuario mantiene control total sobre sus fondos y asume plena responsabilidad por el uso de las APIs, así como por los resultados, riesgos y obligaciones legales, incluidas las fiscales, derivados de su operativa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
