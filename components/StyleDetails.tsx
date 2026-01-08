'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const VIDEO_SOURCES = ['/video1zoe.mov', '/video2zoe.mov', '/video3zoe.mov']

export default function StyleDetails() {
  const { t } = useLanguage()

  // Variants for text container with progressive fade
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  // Variants for text items (fade in) - slower and smoother
  const textItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // easeOutQuad - smoother
      },
    },
  }

  // Variants for videos (slide up from bottom) - slower and smoother
  const videoVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // easeOutQuad - smoother
      },
    },
  }

  // Container variant for videos with stagger - slower stagger
  const videosContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.6, // Start after text animation with more delay
      },
    },
  }

  return (
    <section
      id="style"
      className="min-h-screen flex flex-col justify-center items-center py-10 lg:py-14 snap-start snap-always scroll-mt-[66px]"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          className="w-full max-w-6xl mx-auto flex flex-col gap-8 lg:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {/* Header with progressive fade - Left aligned, tight spacing */}
          <motion.div
            className="flex flex-col gap-3 max-w-xl"
            variants={textContainerVariants}
          >
            <motion.p
              className="text-[11px] uppercase tracking-[0.2em] text-white/50"
              variants={textItemVariants}
            >
              {t('style.aesthetics')}
            </motion.p>
            <motion.h2
              className="text-[40px] md:text-[56px] font-semibold tracking-tight text-white"
              variants={textItemVariants}
            >
              {t('style.title')}
            </motion.h2>
            <motion.p
              className="text-sm md:text-base text-white/80 leading-relaxed"
              variants={textItemVariants}
            >
              {t('style.description')}
            </motion.p>
          </motion.div>

          {/* Three equal 16:9 videos, side by side, with staggered slide-up animation */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4"
            variants={videosContainerVariants}
          >
            {VIDEO_SOURCES.map((src, index) => (
              <motion.div
                key={src}
                className="w-full bg-black overflow-hidden"
                variants={videoVariants}
                whileHover={{
                  scale: 1.05,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
              >
                <div className="w-full aspect-video">
                  <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

