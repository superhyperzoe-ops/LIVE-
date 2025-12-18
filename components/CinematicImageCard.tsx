'use client'

import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'

type CinematicImageCardProps = {
  imageSrc: string
  alt: string
  maskDirection?: 'left' | 'right'
  slideDirection?: 'left' | 'right'
  delay?: number
}

export default function CinematicImageCard({
  imageSrc,
  alt,
  maskDirection = 'left',
  slideDirection = 'left',
  delay = 0,
}: CinematicImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Stronger parallax effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-25, 25]
  )

  // Mask reveal animation - more pronounced and synchronized with slide-in
  const maskVariants = {
    hidden: {
      clipPath: maskDirection === 'left' 
        ? 'inset(0 100% 0 0)' 
        : 'inset(0 0% 0 100%)',
    },
    visible: {
      clipPath: 'inset(0 0% 0 0%)',
      transition: {
        duration: 1,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        delay: delay + 0.1, // Slight delay after slide-in starts
      },
    },
  }

  // Softer slide-in animation
  const slideX = slideDirection === 'left' ? -80 : 80

  // Mouse tracking for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)
    
    mouseX.set(x * 8)
    mouseY.set(y * -8)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const rotateX = useSpring(mouseY, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(mouseX, { stiffness: 300, damping: 30 })

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, x: slideX, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <motion.div
        className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-black/50"
        style={{ 
          y: parallaxY,
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale: 1.05,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Image with mask reveal */}
        <motion.div
          className="relative aspect-video overflow-hidden"
          variants={maskVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          
          {/* Animated gradient overlay on hover - tech glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovered ? 0.15 : 0,
              backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
            }}
            transition={{ 
              opacity: { duration: 0.25 },
              backgroundPosition: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
            }}
            style={{
              background: isHovered 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)'
                : 'transparent',
              backgroundSize: '200% 200%',
            }}
          />
        </motion.div>

        {/* Subtle reflection effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-50" />
      </motion.div>
    </motion.div>
  )
}

