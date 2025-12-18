'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface FadeTransitionOverlayProps {
  fadeTarget: 'speech' | 'text' | null
  onDone: () => void
}

export default function FadeTransitionOverlay({ fadeTarget, onDone }: FadeTransitionOverlayProps) {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {fadeTarget && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            if (fadeTarget) {
              const targetId = fadeTarget === 'speech' ? 'speech-detail' : 'text-detail'
              const element = document.getElementById(targetId)
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              setTimeout(() => {
                onDone()
              }, 300)
            }
          }}
        />
      )}
    </AnimatePresence>
  )
}

