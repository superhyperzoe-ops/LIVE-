'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeInUp, imageZoom } from '@/lib/animations'

export default function ModerationDetails() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  
  // Check if section is in view - reliable trigger (replay on every entry)
  const inView = useInView(sectionRef, {
    amount: 0.35,
    once: false, // Replay animation every time section enters viewport
    margin: '-50px',
  })
  
  // Split text into words for word-by-word reveal
  const text = "When images are generated from text, the Live comes with a built-in moderation system to ensure control is maintained."
  const words = text.split(' ')

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
      className="min-h-screen flex flex-col justify-center items-center py-16 snap-start snap-always scroll-mt-[66px]"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="space-y-12 flex flex-col">
          {/* Title */}
          <motion.h2 
            className="text-5xl lg:text-6xl font-bold text-center text-white"
            variants={titleVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            Moderation
          </motion.h2>

          {/* Keyword cards */}
          <motion.ul 
            className="flex flex-wrap justify-center gap-3 mb-8"
            variants={keywordContainerVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {['Duration Control', 'Automatic moderation', 'Operator controls'].map((keyword, index) => (
              <motion.li
                key={keyword}
                variants={keywordItemVariants}
                className="px-4 py-2 rounded-md border border-white/10 bg-white/5 text-xs uppercase tracking-[0.15em] text-white/80 font-medium"
              >
                {keyword}
              </motion.li>
            ))}
          </motion.ul>

          {/* Grid: Text left, Image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <motion.div 
              className="space-y-6"
              variants={textContainerVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              {/* Text with word-by-word reveal */}
              <motion.p 
                className="text-lg text-gray-300 leading-relaxed"
              >
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5 + index * 0.05,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                    className="inline-block mr-1.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>

              {/* Text content without bullet points */}
              <motion.div 
                className="space-y-4"
                variants={paragraphsContainerVariants}
              >
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  variants={paragraphVariants}
                >
                  Natural AI Training moderation
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  variants={paragraphVariants}
                >
                  Automatic moderation with ban list
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  variants={paragraphVariants}
                >
                  Human moderation thought an interface
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  variants={paragraphVariants}
                >
                  The human operator can also inject specific prompts, change the duration of prompt display and prioritize some prompts
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div 
              className="w-full flex justify-center lg:justify-end relative"
              variants={imageContainerVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              <motion.img
                src="/Modération.png"
                alt="Moderation dashboard"
                className="max-w-full max-h-[500px] w-auto h-auto object-contain rounded-xl relative z-10"
                whileHover={!prefersReducedMotion ? {
                  scale: 1.08,
                  rotate: 2,
                  transition: {
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  },
                } : {}}
                animate={!prefersReducedMotion ? {
                  x: [0, -8, 0],
                } : {}}
                transition={!prefersReducedMotion ? {
                  duration: 14,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                } : { duration: 0.3 }}
              />
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
              <motion.div
                className="absolute inset-0 pointer-events-none z-25"
                style={{
                  background: 'radial-gradient(circle, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none z-20"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
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
          </div>
        </div>
      </div>
    </section>
  )
}

