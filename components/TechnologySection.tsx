'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Layout from './Layout'
import { staggerContainer, fadeInUp } from '@/lib/animations'

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
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
  },
  {
    title: 'Moderation',
    subtitle: 'Safety',
    sectionId: 'moderation',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    title: 'Style',
    subtitle: 'Aesthetics',
    sectionId: 'style',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop',
  },
]

export default function TechnologySection() {
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
      // Use native scrollIntoView with smooth behavior (works with CSS scroll-snap)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section 
      ref={sectionRef}
      id="technology" 
      className="min-h-screen flex items-center py-24 lg:py-32 snap-start snap-normal scroll-mt-[66px]"
    >
      <Layout>
        <motion.div 
          className="space-y-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            <h2 className="heading-section mb-8 tracking-[0.08em] font-medium">
              Technology
            </h2>
            <p className="body-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Notre plateforme combine intelligence artificielle, traitement du signal
              et design génératif pour créer des expériences visuelles uniques en temps réel.
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
                className="technology-card block w-full text-left bg-bg-card border border-white/15 p-5 lg:p-6 cursor-pointer relative overflow-hidden group"
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
                  className="relative mb-4 overflow-hidden aspect-video technology-card-image-wrapper"
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
                    className="w-full h-full object-cover technology-card-image"
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
                  <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-white/85 mb-1">
                    {card.title}
                  </h3>
                  {/* Subtitle */}
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                    {card.subtitle}
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

