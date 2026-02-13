'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { staggerContainer, fadeInUp, scaleIn, clipReveal } from '@/lib/animations'
const HERO_VIDEO_SRC = '/videos/core/accueil_final.mp4'

export default function Hero() {
  const { t } = useLanguage()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const prefersReducedMotion = useReducedMotion()

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Combine scroll and mouse transforms
  const backgroundXTransform = springX
  const backgroundYTransform = springY

  const scrollToTechnology = () => {
    const element = document.getElementById('technology')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section 
      id="hero" 
      className="relative h-[100svh] w-full max-w-full flex items-center pt-16 snap-start snap-always scroll-mt-0 overflow-hidden"
    >
      {/* Background video */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden"
        style={{
          x: backgroundXTransform,
          y: backgroundYTransform,
          scale: 1.1,
        }}
      >
        <video
          src={HERO_VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Hero video error:', e)
            console.error('Video src:', HERO_VIDEO_SRC)
          }}
          onLoadedData={() => {
            console.log('Hero video loaded:', HERO_VIDEO_SRC)
          }}
        />
      </motion.div>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      
      {/* Subtle light flashes overlay */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-[10] w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <motion.div 
          className="grid lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-4rem)]"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Text content - left side, ~40-45% width on desktop */}
          <motion.div 
            className="lg:col-span-5 space-y-8 text-center lg:text-left"
            variants={staggerContainer}
          >
            {/* LIVE title with kinetic reveal */}
            <div className="overflow-hidden">
              <motion.h1 
                className="text-7xl lg:text-8xl font-bold text-white leading-none relative z-[11] font-label text-left max-w-[28rem]"
                variants={clipReveal}
                initial="hidden"
                animate="visible"
              >
                PORTAL
              </motion.h1>
            </div>
            
            {/* Subtitle */}
            <div className="relative z-[11]">
              <motion.p 
                className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-[28rem]"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                {t('hero.descriptionLine1a')} {t('hero.descriptionLine1b')} {t('hero.descriptionLine2')}
              </motion.p>
            </div>
            <motion.div 
              className="pt-4 relative z-[11]"
              variants={scaleIn}
            >
              <motion.button
                onClick={scrollToTechnology}
                className="group relative inline-flex flex-col items-center gap-2 py-3 px-6 text-white uppercase tracking-[0.2em] text-sm font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-white/50 focus-visible:outline-offset-4"
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                initial="rest"
                whileHover={!prefersReducedMotion ? "hover" : "rest"}
                whileFocus={!prefersReducedMotion ? "hover" : "rest"}
              >
                {/* Upper line */}
                <motion.div
                  className="h-px bg-white/60 origin-center"
                  variants={{
                    rest: { width: 32 },
                    hover: { width: 72 },
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
                
                {/* Text and arrow */}
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="relative z-10"
                    variants={{
                      rest: { opacity: 1 },
                      hover: { opacity: 1 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    DISCOVER
                  </motion.span>
                  <motion.span
                    className="text-lg"
                    variants={{
                      rest: { x: 0 },
                      hover: { x: 8 },
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    →
                  </motion.span>
                </div>
                
                {/* Lower line */}
                <motion.div
                  className="h-px bg-white/60 origin-center"
                  variants={{
                    rest: { width: 32 },
                    hover: { width: 72 },
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
                
                {/* Subtle brightness overlay on hover */}
                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-0 bg-white/5 rounded-sm pointer-events-none"
                    variants={{
                      rest: { opacity: 0 },
                      hover: { opacity: 1 },
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[10]"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
        >
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-white/60 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: 'mirror',
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.div>
      )}
    </section>
  )
}

