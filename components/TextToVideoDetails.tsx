'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'

// Pixel Stream Column Component
function PixelStreamColumn() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Generate blocks with randomized properties
  const blocks = Array.from({ length: 12 }, (_, i) => {
    const size = 40 + Math.random() * 80 // 40-120px
    const speed = 8 + Math.random() * 6 // 8-14s duration (slower = faster visual speed)
    const initialDelay = Math.random() * 10 // 0-10s initial delay
    const horizontalPosition = Math.random() * 15 - 7.5 // -7.5% to +7.5% offset within column
    
    // Trail height multiplier - SHORT memory: 1x to 1.5x square height
    // Trail extends UPWARD from the square (square is at bottom)
    const trailMultiplier = 1.0 + (14 - speed) * 0.05 // 1.0x to 1.3x based on speed
    const trailHeight = size * trailMultiplier
    
    // Number of trail segments (fewer segments for more stepped look)
    const segmentCount = 5 + Math.floor((14 - speed) * 0.3) // 5-7 segments
    
    return {
      id: i,
      size,
      duration: speed,
      delay: initialDelay,
      xOffset: horizontalPosition,
      opacity: 0.75 + Math.random() * 0.15, // 0.75-0.90 opacity (reduced intensity)
      trailHeight,
      segmentCount,
    }
  })

  if (prefersReducedMotion) {
    // Show static blocks when reduced motion is preferred
    return (
      <div className="pixel-stream-column pointer-events-none" aria-hidden="true">
        <div className="pixel-stream-inner">
          {blocks.slice(0, 6).map((block, i) => (
            <div
              key={block.id}
              className="pixel-block-static"
              style={{
                width: `${block.size}px`,
                height: `${block.size}px`,
                opacity: block.opacity * 0.3,
                left: `${50 + block.xOffset}%`,
                top: `${15 + i * 15}%`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pixel-stream-column pointer-events-none" aria-hidden="true">
      <div className="pixel-stream-inner">
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            className="pixel-block-wrapper"
            style={{
              width: `${block.size}px`,
              left: `${50 + block.xOffset}%`,
            }}
            initial={{ y: -block.size - 50 }}
            animate={{ y: 'calc(100vh + 100px)' }}
            transition={{
              duration: block.duration,
              delay: block.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Digital raster trail - stacked rectangular segments extending upward */}
            <div 
              className="pixel-raster-trail"
              style={{
                height: `${block.trailHeight}px`,
              }}
            >
              {/* Generate trail segments - positioned ABOVE the square, opacity decreases upward */}
              {Array.from({ length: block.segmentCount }, (_, i) => {
                const segmentIndex = i
                const segmentHeight = block.trailHeight / block.segmentCount
                // Position segments ABOVE the square (negative top values)
                // Bottom segment is just above square, top segment is furthest up
                const segmentTop = -block.trailHeight + (segmentIndex * segmentHeight)
                
                // Opacity decreases from bottom (near square) to top (fade out)
                // Reduced intensity: start lower, fade more
                const segmentOpacity = 0.35 - (segmentIndex / block.segmentCount) * 0.30
                
                // Color progression: soft cyan → soft magenta → soft violet (no bright white)
                const colorProgress = segmentIndex / block.segmentCount
                
                let segmentColor: string
                if (colorProgress < 0.4) {
                  // Soft cyan at bottom, transitioning to magenta
                  const t = colorProgress / 0.4
                  const r = 100 + Math.floor(t * 100) // 100 → 200
                  const g = 200 + Math.floor(t * 30)  // 200 → 230
                  const b = 220 + Math.floor(t * 20)  // 220 → 240
                  segmentColor = `rgba(${r}, ${g}, ${b}, ${segmentOpacity})`
                } else if (colorProgress < 0.75) {
                  // Soft magenta, transitioning to violet
                  const t = (colorProgress - 0.4) / 0.35
                  const r = 200 + Math.floor(t * 40)  // 200 → 240
                  const g = 150 + Math.floor(t * 30)  // 150 → 180
                  const b = 240 - Math.floor(t * 20)  // 240 → 220
                  segmentColor = `rgba(${r}, ${g}, ${b}, ${segmentOpacity})`
                } else {
                  // Soft violet at top
                  const t = (colorProgress - 0.75) / 0.25
                  const r = 240 - Math.floor(t * 20)  // 240 → 220
                  const g = 180 - Math.floor(t * 40)  // 180 → 140
                  const b = 220 - Math.floor(t * 30)  // 220 → 190
                  segmentColor = `rgba(${r}, ${g}, ${b}, ${segmentOpacity})`
                }
                
                return (
                  <div
                    key={segmentIndex}
                    className="pixel-trail-segment"
                    style={{
                      height: `${segmentHeight}px`,
                      top: `${segmentTop}px`,
                      backgroundColor: segmentColor,
                    }}
                  />
                )
              })}
            </div>
            
            {/* Core white pixel block - positioned at bottom of trail */}
            <div 
              className="pixel-block-core"
              style={{ 
                opacity: block.opacity,
                width: `${block.size}px`,
                height: `${block.size}px`,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function TextToVideoDetails() {
  const { t } = useLanguage()
  
  return (
    <section id="text-detail" className="min-h-screen flex flex-col justify-center items-center py-16 snap-start snap-always scroll-mt-[66px] relative overflow-hidden">
      {/* Pixel Stream Column - Right Side */}
      <PixelStreamColumn />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 lg:gap-8">
          {/* Two-column layout */}
          <motion.div 
            className="grid gap-10 md:gap-14 lg:gap-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center"
            initial={{ opacity: 0, y: 40, x: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Left: Video */}
            <motion.div 
              className="relative overflow-hidden border border-white/10 bg-white/[0.02] [clip-path:polygon(0 0,100% 0,100% 100%,0 100%)]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            >
              <video
                src="/text.MOV"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </motion.div>

            {/* Right: Title + Description */}
            <motion.div 
              className="flex flex-col gap-5 max-w-xl relative"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              {/* Text content */}
              <div className="relative z-10">
                {/* Small label */}
                <motion.p 
                  className="text-[11px] uppercase tracking-[0.2em] text-white/50"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
                >
                  {t('system.mode02')} • {t('text.title')}
                </motion.p>

                {/* Main title */}
                <motion.h2 
                  className="text-[32px] md:text-[40px] font-semibold tracking-tight text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.43 }}
                >
                  {t('text.title')}
                </motion.h2>

                {/* Main description */}
                <motion.p 
                  className="text-sm md:text-base text-white/80 leading-relaxed"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.51 }}
                >
                  {t('text.para1')}
                </motion.p>

                <motion.p 
                  className="text-sm md:text-base text-white/70 leading-relaxed"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.59 }}
                >
                  {t('text.para2')}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
