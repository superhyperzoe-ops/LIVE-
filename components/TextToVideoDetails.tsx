'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import GlitchLinesAnimation from './GlitchLinesAnimation'

export default function TextToVideoDetails() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // State to track scroll progress for animation
  // Subtle vertical parallax for video container (2-6px max)
  const videoParallax = useTransform(scrollYProgress, [0, 1], [0, 4])

  // Check if section is in view - reliable trigger (replay on every entry)
  const inView = useInView(sectionRef, {
    amount: 0.35,
    once: false, // Replay animation every time section enters viewport
    margin: '-50px',
  })

  // Variants for video container reveal
  const videoVariants = {
    hidden: prefersReducedMotion 
      ? { opacity: 0 }
      : { opacity: 0, x: -80, scale: 0.98 },
    show: prefersReducedMotion
      ? { opacity: 1 }
      : { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          transition: {
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
  }

  // Variants for text container reveal
  const textContainerVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: 60 },
    show: prefersReducedMotion
      ? {
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as const,
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        }
      : {
          opacity: 1,
          x: 0,
          transition: {
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.3,
            staggerChildren: 0.15,
            delayChildren: 0.2,
          },
        },
  }

  // Variants for text items (label, title, paragraphs)
  const textItemVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: prefersReducedMotion ? 0 : 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  // Variants for paragraphs container
  const paragraphsVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  }
  
  return (
    <section 
      ref={sectionRef}
      id="text-detail" 
      className="h-[100svh] flex flex-col justify-center items-center py-10 lg:py-12 scroll-mt-[66px] relative overflow-hidden"
    >
      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={5} />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 lg:gap-8">
          {/* Two-column layout with premium scroll reveal animations */}
          <div className="grid gap-10 md:gap-14 lg:gap-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
            {/* Left: Image with breathing frame and hover interactions */}
            <motion.div
              ref={videoContainerRef}
              className="relative overflow-hidden border border-white/10 bg-white/[0.02] [clip-path:polygon(0 0,100% 0,100% 100%,0 100%)] group"
              variants={videoVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              style={{
                y: prefersReducedMotion ? 0 : videoParallax,
                minHeight: '400px',
                height: '100%',
                width: '100%',
              }}
            >
              <img
                src="/Image_style_tech.png"
                alt={t('text.title')}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                style={{ 
                  minHeight: '400px',
                  width: '100%',
                  height: '100%',
                }}
              />
            </motion.div>

            {/* Right: Title + Description */}
            <motion.div 
              ref={textContainerRef}
              className="flex flex-col gap-5 max-w-2xl relative"
              variants={textContainerVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              {/* Text content */}
              <div className="relative z-10">
                {/* Small label */}
                <motion.p 
                  className="text-[11px] uppercase tracking-[0.2em] text-white/50"
                  variants={textItemVariants}
                >
                  {t('system.mode02')} • {t('text.title')}
                </motion.p>

                {/* Main title */}
                <motion.h2 
                  className="text-[32px] md:text-[40px] font-semibold tracking-tight text-white"
                  variants={textItemVariants}
                >
                  {t('text.title')}
                </motion.h2>

                {/* Main description */}
                <motion.div
                  variants={paragraphsVariants}
                >
                  <motion.p 
                    className="text-sm md:text-base text-white/80 leading-relaxed"
                    variants={textItemVariants}
                  >
                    {t('text.para1')}
                  </motion.p>

                  <motion.p 
                    className="text-sm md:text-base text-white/70 leading-relaxed"
                    variants={textItemVariants}
                  >
                    {t('text.para2')}
                  </motion.p>
                </motion.div>

                {/* Bullet list */}
                <motion.ul
                  className="mt-3 space-y-2 text-sm md:text-base text-white/70 leading-relaxed max-w-3xl"
                  variants={paragraphsVariants}
                >
                  <motion.li className="flex gap-2" variants={textItemVariants}>
                    <span className="mt-[7px] h-[3px] w-3 bg-white/60 flex-shrink-0" />
                    <span>{t('text.bullet1')}</span>
                  </motion.li>
                <motion.li className="flex gap-2" variants={textItemVariants}>
                    <span className="mt-[7px] h-[3px] w-3 bg-white/60 flex-shrink-0" />
                  <span className="whitespace-nowrap">{t('text.bullet2')}</span>
                  </motion.li>
                  <motion.li className="flex gap-2" variants={textItemVariants}>
                    <span className="mt-[7px] h-[3px] w-3 bg-white/60 flex-shrink-0" />
                    <span>{t('text.bullet3')}</span>
                  </motion.li>
                </motion.ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
