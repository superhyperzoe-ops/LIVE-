'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useActiveNavSection } from '@/hooks/useActiveNavSection'

export function GlobalGlitchOverlay() {
  // 1) Tous les hooks en haut, sans condition
  const activeSection = useActiveNavSection()
  const [lastSection, setLastSection] = useState<string | null>(null)
  const [isGlitching, setIsGlitching] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Logique pour déclencher le "burst glitch" quand la section change
    if (!activeSection) return

    // Détecter les changements de section (ignorer les transitions vers "live")
    if (lastSection !== null && lastSection !== activeSection && activeSection !== 'live' && lastSection !== 'live') {
      // Changement détecté, déclencher le glitch
      setIsGlitching(true)

      // Nettoyer le timeout précédent si il existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Réinitialiser après ~500ms
      timeoutRef.current = setTimeout(() => {
        setIsGlitching(false)
      }, 500)
    }

    // Mettre à jour lastSection
    setLastSection(activeSection)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [activeSection, lastSection])

  // 2) Les early-return APRÈS les hooks
  // On ne rend rien sur le bloc LIVE pour éviter le glitch sur le Hero
  if (activeSection === 'live') {
    return null
  }

  // 3) Générer 1-2 bandes fines pour le burst (après les hooks et early-return)
  const glitchBands = [
    { id: 1, x: '30%' },
    { id: 2, x: '70%' },
  ]

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
    >
      {/* Couche permanente - Scanlines subtiles */}
      <div
        className="absolute -inset-y-16 inset-x-0 global-glitch-scanlines opacity-20 mix-blend-screen"
        style={{
          animation: 'globalScanlinesMove 20s linear infinite, globalScanlinesJitter 2.5s ease-in-out infinite',
        }}
      />

      {/* Couche glitch burst au changement de section */}
      <AnimatePresence>
        {isGlitching && (
          <>
            {glitchBands.map((band) => (
              <motion.div
                key={band.id}
                className="absolute w-5 md:w-10 mix-blend-screen"
                style={{
                  left: band.x,
                  height: '120vh',
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1), transparent)',
                }}
                initial={{
                  opacity: 0,
                  y: '-110%',
                }}
                animate={{
                  opacity: [0, 0.6, 0.3, 0],
                  y: ['-110%', '0%', '110%'],
                }}
                exit={{
                  opacity: 0,
                  y: '110%',
                }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

