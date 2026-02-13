'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import GlitchLinesAnimation from './GlitchLinesAnimation'

const IMAGE_SOURCES = [
  '/Image_style_tech.png',
  '/Image_system_tech.png',
  '/moderation.jpeg',
  '/aboutus.webp',
  '/Image_style_tech.png',
  '/Image_system_tech.png',
]

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
      className="h-[100svh] flex flex-col justify-center items-center py-8 lg:py-10 scroll-mt-[66px] overflow-hidden"
    >
      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={5} />
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
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

          {/* Three equal 16:9 images, side by side, with staggered slide-up animation */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4"
            variants={videosContainerVariants}
          >
            {IMAGE_SOURCES.map((src, index) => (
              <motion.div
                key={`${src}-${index}`}
                className="w-full overflow-hidden border-0 outline-none"
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
                  <img
                    src={src}
                    alt={t('style.title')}
                    className="block w-full h-full object-cover border-0 outline-none"
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
