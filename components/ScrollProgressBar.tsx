'use client'

import { useState, useEffect } from 'react'

/**
 * ScrollProgressBar component
 * 
 * Affiche une barre de progression en haut de la page qui reflète
 * l'avancement du scroll vertical global (0% en haut, 100% en bas).
 * Fonctionne indépendamment de la logique de sections.
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop || 0
      const scrollHeight = doc.scrollHeight
      const clientHeight = doc.clientHeight
      const maxScroll = Math.max(1, scrollHeight - clientHeight)
      const ratio = scrollTop / maxScroll
      // Clamp between 0 and 1
      const clamped = Math.min(1, Math.max(0, ratio))
      setProgress(clamped)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateProgress)
      }
    }

    // Initialiser la valeur au montage
    handleScroll()

    // Ajouter les listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    // Nettoyer les listeners au démontage
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className="fixed left-0 top-16 z-[9999] w-full pointer-events-none">
      <div className="h-[2px] w-full bg-transparent">
        <div
          className="h-full bg-white/90 origin-left will-change-transform transition-[transform] duration-150 ease-linear"
          style={{ transform: `scaleX(${Math.max(0.03, progress)})` }}
        />
      </div>
    </div>
  )
}
