'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { useLanguage } from '@/contexts/LanguageContext'
import GlitchLinesAnimation from './GlitchLinesAnimation'

type SystemRowProps = {
  title: string
  label: string
  description: string
  imageSrc: string
  href: string
  direction?: 'left' | 'right'
  delay?: number
}

const SystemRow: React.FC<SystemRowProps> = ({ title, label, description, imageSrc, href, direction, delay = 0 }) => {
  const { t } = useLanguage()
  
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.article
      onClick={handleClick}
      className="group grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-200 px-6 md:px-8 py-6 md:py-7 overflow-hidden cursor-pointer [clip-path:polygon(0 0,100% 0,100% 100%,0 100%)]"
      initial={{
        opacity: 0,
        y: 40,
        x: direction === 'left' ? -120 : direction === 'right' ? 120 : 0,
        rotateX: -6
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        rotateX: 0
      }}
      viewport={{ once: false, amount: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.9,
        ease: 'easeOut',
        delay,
        scale: { duration: 0.15, ease: 'easeOut' }
      }}
    >
      {/* Colonne texte */}
      <div className="flex flex-col justify-center gap-3 md:gap-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
          {label} • {t('system.title')}
        </p>
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl">
          {description}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs lg:text-sm text-white/60">
          <span className="h-px w-10 bg-white/40 group-hover:w-16 transition-all duration-500" />
          <span className="uppercase tracking-[0.2em]">
            {t('system.discover')}
          </span>
        </div>
      </div>

      {/* Colonne image */}
      <div className="relative h-40 md:h-44 lg:h-52 overflow-hidden">
        <motion.div
          className="absolute inset-0 overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </motion.article>
  )
}

export default function SystemSummary() {
  const { t } = useLanguage()
  
  return (
    <section id="system" className="h-[100svh] w-full flex flex-col justify-center items-center py-10 lg:py-12 scroll-mt-[66px] bg-black overflow-hidden">
      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={5} />
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 lg:gap-5">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 max-w-3xl">
              <h3 className="text-[40px] md:text-[48px] font-semibold tracking-tight text-white">
                {t('system.title')}
              </h3>
              <div className="h-px w-16 bg-white/60" />
            </div>
            <div className="space-y-4">
              <SystemRow
                title={t('system.speechToVideo')}
                label={t('system.mode01')}
                description={t('system.speechDescription')}
                imageSrc="/Image_system_tech.png"
                href="#speech-detail"
                direction="left"
                delay={0.1}
              />
              <SystemRow
                title={t('system.textToVideo')}
                label={t('system.mode02')}
                description={t('system.textDescription')}
                imageSrc="/Image_style_tech.png"
                href="#text-detail"
                direction="right"
                delay={0.2}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
