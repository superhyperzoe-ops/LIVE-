'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

type ZoomTransitionOverlayProps = {
  isVisible: boolean
  imageSrc: string
  alt: string
  targetId: string
  onComplete: () => void
}

export default function ZoomTransitionOverlay({
  isVisible,
  imageSrc,
  alt,
  targetId,
  onComplete,
}: ZoomTransitionOverlayProps) {
  useEffect(() => {
    if (!isVisible) return

    // Start scroll after zoom animation starts (250ms delay for gentle feel)
    const scrollTimeout = setTimeout(() => {
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 250)

    // Start fade-out after zoom completes and scroll is in progress (~650ms)
    // This allows overlap between scroll and fade-out for smoothness
    // The exit animation will take ~550ms, so total overlay lifetime ~1200ms
    const fadeOutTimeout = setTimeout(() => {
      onComplete()
    }, 650)

    return () => {
      clearTimeout(scrollTimeout)
      clearTimeout(fadeOutTimeout)
    }
  }, [isVisible, targetId, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.55, ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number] }
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number],
          }}
        >
          {/* Gentle dark background overlay */}
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            exit={{ 
              backgroundColor: 'rgba(0, 0, 0, 0)',
              transition: { duration: 0.55, ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number] }
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number],
            }}
          />
          
          {/* Subtle vignette effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.2)_100%)]" />

          {/* Zoomed image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.06, opacity: 1 }}
              exit={{ 
                scale: 1.02, 
                opacity: 0,
                transition: { 
                  duration: 0.55, 
                  ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number]
                }
              }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number],
              }}
            >
              <img
                src={imageSrc}
                alt={alt}
                className="w-full h-full object-cover aspect-video"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

