'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { getVideoUrl } from '@/lib/videos'
import GlitchLinesAnimation from './GlitchLinesAnimation'

export default function SystemDetails() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoContainerRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

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
            ease: [0.25, 0.46, 0.45, 0.94] as const, // easeOutQuad
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

  // Variants for bullets
  const bulletContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const bulletItemVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: -8 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.08,
      },
    },
  }

  const bulletPartVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0, x: -4 },
    show: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  return (
    <section 
      ref={sectionRef}
      id="speech-detail" 
      className="h-[100svh] flex flex-col justify-center items-center py-10 lg:py-12 snap-start snap-always scroll-mt-[66px] relative overflow-hidden"
    >
      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={5} />
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 lg:gap-8">
          {/* Two-column layout with premium scroll reveal animations */}
          <div className="grid gap-10 md:gap-14 lg:gap-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
            {/* Left: Video with breathing frame and hover interactions */}
            <motion.div
              ref={videoContainerRef}
              className="speech-image-wrapper relative overflow-hidden border border-white/10 bg-white/[0.02] [clip-path:polygon(0 0,100% 0,100% 100%,0 100%)] group"
              variants={videoVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              style={{ y: prefersReducedMotion ? 0 : videoParallax }}
              whileHover={prefersReducedMotion ? {} : {
                scale: 1.035,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94] as const,
                },
              }}
            >
              {/* Breathing frame animation - intensified on hover */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 0 0 rgba(255, 255, 255, 0)',
                  }}
                  animate={{
                    opacity: [0.15, 0.35, 0.15],
                    boxShadow: [
                      '0 0 0 rgba(255, 255, 255, 0)',
                      '0 0 8px rgba(255, 255, 255, 0.08)',
                      '0 0 0 rgba(255, 255, 255, 0)',
                    ],
                  }}
                  whileHover={{
                    opacity: [0.25, 0.45, 0.25],
                    boxShadow: [
                      '0 0 0 rgba(255, 255, 255, 0)',
                      '0 0 12px rgba(255, 255, 255, 0.12)',
                      '0 0 0 rgba(255, 255, 255, 0)',
                    ],
                  }}
                  transition={{
                    duration: 5,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                />
              )}

              {/* Depth shadow on hover */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-5"
                  style={{
                    boxShadow: 'inset 0 0 0 rgba(0, 0, 0, 0)',
                  }}
                  whileHover={{
                    boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.15)',
                    transition: {
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    },
                  }}
                />
              )}

              {/* Stronger diagonal light reflection on hover */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-20 opacity-0"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)',
                    transform: 'translateX(-100%) translateY(-100%)',
                  }}
                  whileHover={{
                    opacity: [0, 0.5, 0],
                    x: ['-100%', '200%'],
                    y: ['-100%', '200%'],
                    transition: {
                      duration: 0.7,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    },
                  }}
                />
              )}

              <video
                src={getVideoUrl('speech')}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover relative z-0"
              />

              {/* Hover label "Explore" */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute bottom-4 left-4 z-30 pointer-events-none"
                  initial={{ opacity: 0, y: 8 }}
                  whileHover={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    },
                  }}
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-white/90 font-medium">
                    Explore
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Right: Title + Description + Bullet Points with progressive reveal */}
            <motion.div
              className="speech-text-wrapper flex flex-col gap-5 max-w-xl"
              variants={textContainerVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              {/* Small label */}
              <motion.p
                className="speech-label text-[11px] uppercase tracking-[0.2em] text-white/50"
                variants={textItemVariants}
              >
                {t('system.mode01')} • {t('speech.title')}
              </motion.p>

              {/* Main title */}
              <motion.h2
                className="speech-title text-[32px] md:text-[40px] font-semibold tracking-tight text-white"
                variants={textItemVariants}
              >
                {t('speech.title')}
              </motion.h2>

              {/* Main description with line-by-line reveal */}
              <motion.div
                className="speech-paragraphs flex flex-col gap-3"
                variants={paragraphsVariants}
              >
                <motion.p
                  className="text-sm md:text-base text-white/80 leading-relaxed"
                  variants={textItemVariants}
                >
                  {t('speech.para1')}
                </motion.p>
                <motion.p
                  className="text-sm md:text-base text-white/70 leading-relaxed"
                  variants={textItemVariants}
                >
                  {t('speech.para2')}
                </motion.p>
              </motion.div>

              {/* Bullet list with staggered reveal */}
              <motion.ul
                className="mt-2 space-y-2 text-sm md:text-base text-white/70 leading-relaxed"
                variants={bulletContainerVariants}
              >
                <motion.li
                  className="speech-bullet flex gap-2"
                  variants={bulletItemVariants}
                >
                  <motion.span
                    className="mt-[7px] h-[3px] w-3 bg-white/60 flex-shrink-0"
                    variants={bulletPartVariants}
                  />
                  <motion.span
                    variants={bulletPartVariants}
                  >
                    {t('speech.bullet1')}
                  </motion.span>
                </motion.li>
                <motion.li
                  className="speech-bullet flex gap-2"
                  variants={bulletItemVariants}
                >
                  <motion.span
                    className="mt-[7px] h-[3px] w-3 bg-white/60 flex-shrink-0"
                    variants={bulletPartVariants}
                  />
                  <motion.span
                    variants={bulletPartVariants}
                  >
                    {t('speech.bullet2')}
                  </motion.span>
                </motion.li>
                <motion.li
                  className="speech-bullet flex gap-2"
                  variants={bulletItemVariants}
                >
                  <motion.span
                    className="mt-[7px] h-[3px] w-3 bg-white/60 flex-shrink-0"
                    variants={bulletPartVariants}
                  />
                  <motion.span
                    variants={bulletPartVariants}
                  >
                    {t('speech.bullet3')}
                  </motion.span>
                </motion.li>
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
