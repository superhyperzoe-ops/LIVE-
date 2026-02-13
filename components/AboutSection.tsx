'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import AboutLinkButton from './AboutLinkButton'
import GlitchLinesAnimation from './GlitchLinesAnimation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutSection() {
  const { t } = useLanguage()
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <section id="about" className="h-[100svh] flex flex-col justify-center items-center py-10 lg:py-12 scroll-mt-[66px] overflow-hidden">
      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={5} />
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div 
          className="space-y-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Title */}
          <motion.h2 
            className="heading-section text-white text-center"
            variants={fadeInUp}
          >
            {t('about.title')}
          </motion.h2>

          {/* Content: Text left, Image right */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text */}
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
            >
              <motion.p 
                className="text-lg text-white leading-relaxed font-light"
                variants={fadeInUp}
              >
                {t('about.para1')}
              </motion.p>
              <motion.p 
                className="text-lg text-white leading-relaxed font-light"
                variants={fadeInUp}
              >
                {t('about.para2')}
              </motion.p>
              
              {/* Button */}
              <motion.div 
                className="pt-4"
                variants={fadeInUp}
              >
                <AboutLinkButton
                  href="https://www.obvious-art.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  label={t('about.cta')}
                />
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div 
              className="relative w-full flex justify-center lg:justify-end"
              variants={fadeInUp}
            >
              <motion.img
                src="/aboutus.webp"
                alt="Obvious team"
                className="w-full max-w-md rounded-xl object-cover"
                style={{ borderRadius: '12px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={!prefersReducedMotion ? { 
                  y: [0, -6, 0],
                } : {}}
                transition={{
                  opacity: { duration: 0.8, ease: 'easeOut' },
                  scale: { duration: 0.8, ease: 'easeOut' },
                  y: !prefersReducedMotion ? {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                  } : {},
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
