'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function SubFooter() {
  return (
    <footer className="relative w-full bg-[#000000] border-t border-white/10 py-4 mt-0">
      <div className="w-full bg-[#000000]">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 md:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Developed by + Logo */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span className="text-white/50 text-xs">Developed by</span>
            <div className="flex items-center gap-2">
              <Image 
                src="/logo-deco-favicon.png" 
                alt="Deco31416" 
                width={20} 
                height={20}
                className="object-contain"
              />
              <span className="text-white font-medium text-xs">Deco31416</span>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link 
              href="/legal" 
              className="text-white/60 hover:text-white/90 transition-colors text-xs font-medium"
            >
              Legal
            </Link>
            
            <Link 
              href="/documentation" 
              className="text-white/60 hover:text-white/90 transition-colors text-xs font-medium"
            >
              Documentación
            </Link>
            
            <Link 
              href="/roadmap" 
              className="text-white/60 hover:text-white/90 transition-colors text-xs font-medium"
            >
              Roadmap
            </Link>
            
            <Link 
              href="/pricing" 
              className="text-white/60 hover:text-white/90 transition-colors text-xs font-medium"
            >
              Precio
            </Link>
            
            <Link 
              href="/donate" 
              className="text-white/60 hover:text-white/90 transition-colors text-xs font-medium"
            >
              Dona
            </Link>
            
            <Link 
              href="/pitch-deck" 
              className="text-white/60 hover:text-white/90 transition-colors text-xs font-medium"
            >
              Pitch Deck
            </Link>
            
            <Link 
              href="/customize" 
              className="text-white/60 hover:text-white/90 transition-colors text-xs font-medium"
            >
              Hazlo tuyo
            </Link>
          </div>

        </div>
      </div>
      </div>
    </footer>
  )
}
