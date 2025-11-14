'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'

const menuItems = [
  {
    title: 'Features',
    items: [
      { name: 'Voice AI', href: '/voice-ai', description: 'Natural language trading' },
      { name: 'Auto Trading', href: '/auto-trading', description: 'Automated execution' },
      { name: 'Risk Management', href: '/risk', description: 'Advanced controls' },
      { name: 'Backtesting', href: '/backtest', description: 'Strategy validation' },
    ]
  },
  {
    title: 'Company',
    items: [
      { name: 'About', href: '/about', description: 'Our mission' },
      { name: 'Blog', href: '/blog', description: 'Latest updates' },
      { name: 'Careers', href: '/careers', description: 'Join our team' },
      { name: 'Contact', href: '/contact', description: 'Get in touch' },
    ]
  },
  {
    title: 'Resources',
    items: [
      { name: 'Documentation', href: '/documentation', description: 'Complete guides' },
      { name: 'API Reference', href: '/api', description: 'Developer docs' },
      { name: 'Tutorials', href: '/tutorials', description: 'Learn step by step' },
      { name: 'Community', href: '/community', description: 'Join discussions' },
    ]
  },
  {
    title: 'Help',
    items: [
      { name: 'Support', href: '/support', description: '24/7 assistance' },
      { name: 'FAQ', href: '/faq', description: 'Common questions' },
      { name: 'Status', href: '/status', description: 'System health' },
    ]
  },
]

export default function NavigationMenu() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 md:px-16">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo-HedgeBridge.png" 
              alt="HedgeBridge" 
              width={32} 
              height={32}
              className="object-contain"
            />
            <span 
              className="text-white font-semibold text-lg group-hover:text-accent transition-colors" 
              style={{fontFamily: "'Orbitron', sans-serif"}}
            >
              MT5 Analysis
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((menu) => (
              <div
                key={menu.title}
                className="relative"
                onMouseEnter={() => setActiveDropdown(menu.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm font-medium">
                  {menu.title}
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === menu.title ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === menu.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-xl overflow-hidden"
                    >
                      {menu.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-3 hover:bg-white/5 transition-colors group"
                        >
                          <div className="text-white font-medium text-sm group-hover:text-accent transition-colors">
                            {item.name}
                          </div>
                          <div className="text-white/50 text-xs mt-0.5">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link 
              href="/pricing" 
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
          </div>

          {/* CTA Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Log In
            </Link>
            <Link 
              href="/get-started" 
              className="bg-accent hover:bg-accent/90 text-black px-4 py-2 rounded-sm text-sm font-semibold transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 py-4"
            >
              {menuItems.map((menu) => (
                <div key={menu.title} className="mb-4">
                  <div className="text-white/50 text-xs uppercase tracking-wider px-4 mb-2">
                    {menu.title}
                  </div>
                  {menu.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-white hover:bg-white/5 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-white/50">{item.description}</div>
                    </Link>
                  ))}
                </div>
              ))}
              
              <div className="border-t border-white/10 pt-4 px-4 space-y-2">
                <Link 
                  href="/pricing" 
                  className="block text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/login" 
                  className="block text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/get-started" 
                  className="block bg-accent text-black text-center px-4 py-2 rounded-lg font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
