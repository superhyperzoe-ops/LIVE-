'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface AboutButtonProps {
  href?: string
  onClick?: () => void
  label?: string
  className?: string
}

export default function AboutButton({ 
  href, 
  onClick, 
  label = 'ABOUT US',
  className = '' 
}: AboutButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  const buttonClasses = `group relative inline-flex flex-col items-center gap-2 py-3 px-6 text-white uppercase tracking-[0.14em] text-xs font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-white/50 focus-visible:outline-offset-4 cursor-pointer ${className}`

  const buttonContent = (
    <>
      {/* Top horizontal line */}
      <motion.div
        className="h-px bg-white/60 origin-center about-button-line"
        initial={{ width: '32px' }}
        whileHover={!prefersReducedMotion ? { width: '72px', opacity: 0.9 } : { opacity: 0.9 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      
      {/* Text and arrow */}
      <div className="flex items-center gap-3">
        <span className="relative z-10">{label}</span>
        <motion.span
          className="text-lg"
          initial={{ x: 0 }}
          whileHover={!prefersReducedMotion ? { x: 7 } : {}}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          →
        </motion.span>
      </div>
      
      {/* Bottom horizontal line */}
      <motion.div
        className="h-px bg-white/60 origin-center about-button-line"
        initial={{ width: '32px' }}
        whileHover={!prefersReducedMotion ? { width: '72px', opacity: 0.9 } : { opacity: 0.9 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={buttonClasses}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {buttonContent}
      </motion.a>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={buttonClasses}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {buttonContent}
    </motion.button>
  )
}

