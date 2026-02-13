'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import GlitchLinesAnimation from './GlitchLinesAnimation'
import { staggerContainer, fadeInUp, imageZoom } from '@/lib/animations'

export default function ModerationDetails() {
  const { t } = useLanguage()
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeLevel, setActiveLevel] = useState<'natural' | 'automatic' | 'human'>('natural')
  
  // Check if section is in view - reliable trigger (replay on every entry)
  const inView = useInView(sectionRef, {
    amount: 0.35,
    once: false, // Replay animation every time section enters viewport
    margin: '-50px',
  })
  
  // Variants for text container (from left)
  const textContainerVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: -100 },
    show: prefersReducedMotion
      ? {
          opacity: 1,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
            staggerChildren: 0.08,
            delayChildren: 0.2,
          },
        }
      : {
          opacity: 1,
          x: 0,
          transition: {
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.2,
            staggerChildren: 0.1,
            delayChildren: 0.3,
          },
        },
  }

  // Variants for paragraphs
  const paragraphVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  // Variants for paragraphs container
  const paragraphsContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.5,
      },
    },
  }

  // Variants for image container (from right)
  const imageContainerVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: 100 },
    show: prefersReducedMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          x: 0,
          transition: {
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.3,
          },
        },
  }

  // Variants for keyword cards (fade in slowly)
  const keywordContainerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  }

  const keywordItemVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  // Variants for title
  const titleVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }
  
  return (
    <section 
      ref={sectionRef}
      id="moderation" 
      className="relative min-h-[100svh] flex flex-col justify-start items-center scroll-mt-[66px] overflow-hidden"
    >
      {/* Image de fond - couvre toute la section */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        variants={imageContainerVariants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        style={{
          backgroundImage: 'url(/moderation.jpeg)',
          backgroundSize: '85%',
          backgroundPosition: 'right 40%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* Light sweep */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-15"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
            }}
            animate={{
              x: ['-100%', '200%'],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatDelay: 10,
              ease: 'easeInOut',
            }}
          />
        )}
        
        {/* Focus effect */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)',
            }}
            animate={{
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={15} />

      {/* Contenu en overlay */}
      <div className="relative z-30 w-full px-6 sm:px-8 lg:px-12 pt-10 lg:pt-14 pb-12">
        <div className="flex flex-col min-h-[100svh] max-w-6xl mx-auto">
          {/* Title */}
          <motion.h2 
            className="text-5xl lg:text-6xl font-bold text-center text-white"
            variants={titleVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            Moderation
          </motion.h2>
          
          {/* Intro */}
          <motion.p
            className="mt-4 text-base sm:text-lg text-gray-200 leading-relaxed text-center max-w-3xl mx-auto"
            variants={paragraphVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {t('moderation.intro')}
          </motion.p>
          {/* Keyword buttons */}
          <motion.div 
            className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 text-center"
            variants={keywordContainerVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {[
              { key: 'natural', label: t('moderation.keyword1') },
              { key: 'automatic', label: t('moderation.keyword2') },
              { key: 'human', label: t('moderation.keyword3') },
            ].map((keyword) => (
              <motion.button
                key={keyword.key}
                type="button"
                onClick={() => setActiveLevel(keyword.key as 'natural' | 'automatic' | 'human')}
                variants={keywordItemVariants}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 border text-[11px] sm:text-xs uppercase tracking-[0.18em] font-medium transition-colors hover:bg-white/20 hover:text-white ${
                  activeLevel === keyword.key
                    ? 'border-white/40 bg-white/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/80'
                }`}
              >
                {keyword.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Text content */}
          <motion.div 
            className="mt-6 lg:mt-8 w-full max-w-[680px] text-center mx-auto space-y-4 lg:space-y-5"
            variants={textContainerVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
              {/* Active level content */}
              <motion.div 
                className="space-y-3 lg:space-y-4"
                variants={paragraphsContainerVariants}
              >
                <motion.p 
                  className="text-base sm:text-lg text-gray-200 leading-relaxed"
                  variants={paragraphVariants}
                >
                  {activeLevel === 'natural'
                    ? t('moderation.level1')
                    : activeLevel === 'automatic'
                      ? t('moderation.level2')
                      : t('moderation.level3')}
                </motion.p>
              </motion.div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}

