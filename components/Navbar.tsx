'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'LIVE', href: '#hero' },
  { label: 'TECHNOLOGY', href: '#technology' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'CONTACT', href: '#contact' },
  { label: 'ABOUT US', href: '#about' },
]

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    let frameId: number | null = null

    const updateProgress = () => {
      const max = main.scrollHeight - main.clientHeight
      const p = max <= 0 ? 0 : main.scrollTop / max
      const clamped = Math.min(1, Math.max(0, p))
      setScrollProgress(clamped)
      frameId = null
    }

    const handleScroll = () => {
      if (frameId !== null) return
      frameId = requestAnimationFrame(updateProgress)
    }

    const handleResize = () => {
      updateProgress()
    }

    // Valeur initiale au montage
    updateProgress()

    main.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      main.removeEventListener('scroll', handleScroll as EventListener)
      window.removeEventListener('resize', handleResize)
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-global/80 backdrop-blur-md border-b border-gray-900/50">
      <div className="w-full px-6 sm:px-8 lg:px-12 relative">
        <div className="flex items-center justify-between h-16 w-full">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className="text-sm uppercase tracking-[0.2em] text-white"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        {/* Barre de progression globale sous la navbar */}
        <div
          className="absolute left-0 bottom-0 h-[2px] bg-white will-change-transform origin-left pointer-events-none z-50"
          style={{
            width: `${Math.max(2, scrollProgress * 100)}%`,
            transition: 'width 80ms linear',
          }}
        />
      </div>
    </nav>
  )
}



