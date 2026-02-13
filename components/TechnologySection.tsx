'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Layout from './Layout'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import GlitchLinesAnimation from './GlitchLinesAnimation'
import { useLanguage } from '@/contexts/LanguageContext'

interface TechCard {
  title: string
  subtitle: string
  sectionId: string
  imageUrl: string
}

const techCards: TechCard[] = [
  {
    title: 'System',
    subtitle: 'Real-time',
    sectionId: 'system',
    imageUrl: '/Image_system_tech.png',
  },
  {
    title: 'Moderation',
    subtitle: 'Safety',
    sectionId: 'moderation',
    imageUrl: '/moderation.jpeg',
  },
  {
    title: 'Style',
    subtitle: 'Aesthetics',
    sectionId: 'style',
    imageUrl: '/Image_style_tech.png',
  },
]

export default function TechnologySection() {
  const { t, language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  
  // Animation variants for each card direction
  const cardVariants = {
    hidden: (index: number) => {
      // Card 0 (System - gauche): from left
      if (index === 0) {
        return { 
          opacity: 0, 
          x: -100,
          y: 0
        }
      }
      // Card 1 (Moderation - milieu): from bottom
      if (index === 1) {
        return { 
          opacity: 0, 
          x: 0,
          y: 80
        }
      }
      // Card 2 (Style - droite): from right
      if (index === 2) {
        return { 
          opacity: 0, 
          x: 100,
          y: 0
        }
      }
      return { opacity: 0, x: 0, y: 0 }
    },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // easeOutQuad - plus doux
        delay: index * 0.2, // Stagger delay plus long
      },
    }),
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section 
      ref={sectionRef}
      id="technology" 
      className="h-[100svh] flex items-center py-6 sm:py-8 lg:py-12 scroll-mt-[66px] overflow-hidden"
    >
      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={5} />
      <Layout>
        <motion.div 
          className="space-y-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <h2 className="heading-section mb-8">
              {t('tech.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-5xl mx-auto leading-relaxed text-center w-full break-words">
              {(() => {
                const lines = t('tech.description').split('\n')
                return lines.map((line, index) => (
                  <span
                    key={index}
                    className={`block w-full text-center ${language === 'fr' ? 'whitespace-nowrap' : ''}`}
                  >
                    {line}
                  </span>
                ))
              })()}
            </p>
          </motion.div>

          <motion.div 
            ref={cardsContainerRef}
            className="grid md:grid-cols-3 gap-8 lg:gap-10"
          >
            {techCards.map((card, index) => (
              <motion.button
                key={index}
                custom={index}
                onClick={() => scrollToSection(card.sectionId)}
                className="technology-card block w-full text-left bg-bg-card border border-white/15 p-4 sm:p-5 lg:p-6 cursor-pointer relative overflow-hidden group"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{
                  scale: 1.05,
                  y: -6,
                  boxShadow: '0 8px 32px rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  transition: {
                    type: 'spring',
                    stiffness: 220,
                    damping: 22,
                  },
                }}
              >
                {/* Image thumbnail */}
                <motion.div 
                  className="relative mb-3 sm:mb-4 overflow-hidden aspect-video technology-card-image-wrapper"
                  whileHover={{
                    scale: 1.08,
                    y: -8,
                    transition: {
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    },
                  }}
                >
                  <motion.img
                    src={card.imageUrl}
                    alt={card.title}
                    className={`w-full h-full object-cover technology-card-image ${
                      card.sectionId === 'moderation'
                        ? 'object-right object-bottom scale-150 origin-bottom-right'
                        : ''
                    }`}
                    whileHover={{
                      filter: 'saturate(1.06) contrast(1.08)',
                      transition: {
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                      },
                    }}
                  />
                </motion.div>
                {/* Title and Subtitle container */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0.7 }}
                  whileHover={{
                    y: -10,
                    opacity: 1,
                    transition: {
                      duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                    },
                  }}
                >
                  {/* Title */}
                  <h3 className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/85 mb-1">
                    {language === 'fr' && card.title === 'System'
                      ? 'Système'
                      : language === 'fr' && card.title === 'Moderation'
                        ? 'Modération'
                        : card.title}
                  </h3>
                  {/* Subtitle */}
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/40">
                    {card.title === 'System'
                      ? (language === 'fr' ? 'Modalités' : 'Modalities')
                      : card.title === 'Moderation'
                        ? (language === 'fr' ? 'Contrôle' : 'Control')
                        : card.title === 'Style'
                          ? (language === 'fr' ? 'Esthétique' : 'Aesthetics')
                          : card.subtitle}
                  </p>
                </motion.div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </Layout>
    </section>
  )
}
