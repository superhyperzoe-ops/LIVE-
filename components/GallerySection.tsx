'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from './Layout'
import GlitchLinesAnimation from './GlitchLinesAnimation'
import GalleryModal from './GalleryModal'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { useLanguage } from '@/contexts/LanguageContext'
import { galleryItems, type GalleryItem } from '@/data/gallery'

/**
 * Auto-scroll timing constraints (seconds)
 * We clamp the duration to keep the demo readable across widths.
 */
const AUTO_SCROLL_MIN_DURATION_SEC = 6
const AUTO_SCROLL_MAX_DURATION_SEC = 10

const GALLERY_LOGOS = [
  '/Logo/AI action summit.png',
  '/Logo/content.png',
  '/Logo/france.png',
  '/Logo/fomo.png',
  '/Logo/informatica.png',
  '/Logo/microsoft.png',
  '/Logo/pcw.png',
  '/Logo/psg.png',
  '/Logo/QSI.png',
  '/Logo/Sorbonne.png',
  '/Logo/waicif.png',
]

/**
 * GallerySection component
 * 
 * Horizontal scrollable gallery with:
 * - Auto-scroll animation on section entry (right -> left)
 * - Clickable cards that open a modal with details
 * - Hover interactions on cards
 * - Manual scrolling support
 */
export default function GallerySection() {
  const { t, language } = useLanguage()
  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const stopRef = useRef(false)
  const hasPlayedRef = useRef(false)
  const hasInteractedRef = useRef(false)
  const isPausedRef = useRef(false)
  const lastTimeRef = useRef<number | null>(null)
  const targetScrollRef = useRef(0)
  const speedRef = useRef(0)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const handleTrackWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      return
    }
  }

  // Ensure component is mounted before rendering animations
  useEffect(() => {
    setMounted(true)
  }, [])

  const stopAutoScroll = () => {
    stopRef.current = true
    lastTimeRef.current = null
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const handleUserIntent = () => {
    if (hasInteractedRef.current) return
    hasInteractedRef.current = true
    isPausedRef.current = false
    stopAutoScroll()
  }

  const pauseAutoScroll = () => {
    if (hasInteractedRef.current) return
    if (!rafRef.current) return
    isPausedRef.current = true
    stopAutoScroll()
  }

  const resumeAutoScroll = () => {
    if (hasInteractedRef.current) return
    if (!isPausedRef.current) return
    isPausedRef.current = false
    startAutoScroll()
  }

  const startAutoScroll = () => {
    const track = trackRef.current
    if (!track) return

    const scrollWidth = track.scrollWidth
    const clientWidth = track.clientWidth
    const maxScroll = scrollWidth - clientWidth

    if (maxScroll <= 2) return

    // Ensure we demonstrate right -> left (scrollLeft increases)
    if (track.scrollLeft < 1) {
      track.scrollLeft = 0
    }

    targetScrollRef.current = maxScroll

    const durationSec = Math.min(
      AUTO_SCROLL_MAX_DURATION_SEC,
      Math.max(AUTO_SCROLL_MIN_DURATION_SEC, maxScroll / 140)
    )
    speedRef.current = maxScroll / durationSec

    stopRef.current = false
    lastTimeRef.current = null

    const tick = (now: number) => {
      if (stopRef.current || !track) {
        lastTimeRef.current = null
        return
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = now
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const deltaTimeSeconds = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      const scrollDelta = speedRef.current * deltaTimeSeconds
      const nextScrollLeft = Math.min(targetScrollRef.current, track.scrollLeft + scrollDelta)

      if (nextScrollLeft >= targetScrollRef.current - 1) {
        track.scrollLeft = targetScrollRef.current
        rafRef.current = null
        lastTimeRef.current = null
        return
      }

      track.scrollLeft = nextScrollLeft
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  // Auto-scroll animation: smooth constant speed on section entry
  useEffect(() => {
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) return

    // Stop as soon as user touches / scrolls / clicks
    track.addEventListener('wheel', handleUserIntent, { passive: true })
    track.addEventListener('touchstart', handleUserIntent, { passive: true })
    track.addEventListener('pointerdown', handleUserIntent)
    track.addEventListener('mousedown', handleUserIntent)
    track.addEventListener('scroll', handleUserIntent, { passive: true })
    window.addEventListener('keydown', handleUserIntent)

    // IntersectionObserver to detect when section becomes visible
    let observer: IntersectionObserver | null = null

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry?.isIntersecting) return
          if (hasPlayedRef.current || hasInteractedRef.current) return

          hasPlayedRef.current = true

          // Wait for layout to be stable (double RAF) with a small delay
          setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (section && track && !stopRef.current && !hasInteractedRef.current) {
                  startAutoScroll()
                }
              })
            })
          }, 300)
        },
        { 
          threshold: 0.2,
          rootMargin: '-10% 0px -10% 0px'
        }
      )

      observer.observe(section)
    }

    return () => {
      stopAutoScroll()
      if (observer) {
        observer.disconnect()
      }
      track.removeEventListener('wheel', handleUserIntent)
      track.removeEventListener('touchstart', handleUserIntent)
      track.removeEventListener('pointerdown', handleUserIntent)
      track.removeEventListener('mousedown', handleUserIntent)
      track.removeEventListener('scroll', handleUserIntent)
      window.removeEventListener('keydown', handleUserIntent)
    }
  }, [])

  const handleCardClick = (item: GalleryItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const splitExperienceTitle = (title: string) => {
    const token = title.includes('Expérience') ? 'Expérience' : 'Experience'
    if (!title.includes(token)) {
      return { line1: title, line2: '' }
    }
    const line1 = title.replace(token, '').trim()
    return { line1: line1 || title, line2: token }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  // Render static content until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <section ref={(el) => { sectionRef.current = el }} id="gallery" className="h-[100svh] flex flex-col scroll-mt-[66px] py-4 sm:py-6 lg:py-8 overflow-hidden">
        {/* Animation de lignes avec glitch sur la droite */}
        <GlitchLinesAnimation zIndex={5} />
        <Layout>
          <div className="flex flex-col">
            <div className="relative z-10 pb-4 sm:pb-6 text-center max-w-3xl mx-auto">
              <h2 className="heading-section mb-6 text-white">
                {t('gallery.title')}
              </h2>
              <div className="space-y-4">
                {t('gallery.description').split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Layout>
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-3 sm:py-4">
          <div
            ref={trackRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing relative h-[32vh] sm:h-[40vh] md:h-[42vh]"
            onWheel={handleTrackWheel}
            onMouseEnter={pauseAutoScroll}
            onMouseLeave={resumeAutoScroll}
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorX: 'contain',
              overscrollBehaviorY: 'contain',
              touchAction: 'pan-x',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none z-10" />
            <div className="flex gap-2 pb-4 px-8 h-full items-center w-full justify-between">
            {galleryItems.map((item, index) => {
              const title = language === 'fr' ? item.titleFr : item.title
              const { line1, line2 } = splitExperienceTitle(title)
              return (
                <button
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                className={`flex-shrink-0 text-left cursor-pointer group h-full ${index === galleryItems.length - 1 ? 'relative z-20' : ''}`}
                >
                  <div className="relative overflow-hidden bg-bg-card shadow-lg group-hover:shadow-white/10 transition-all duration-300 h-full flex-1 min-w-[170px] sm:min-w-[210px] md:min-w-[240px] max-w-[280px]">
                    <div className="relative aspect-[9/16] h-full w-full">
                      <img
                        src={item.mediaSrc}
                        alt={title}
                        className="w-full h-full object-cover gallery-video brightness-75 contrast-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-white transition-colors leading-tight">
                          {line1}
                          {line2 ? (
                            <>
                              <br />
                              {line2}
                            </>
                          ) : null}
                        </h3>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
            </div>
          </div>
        </div>
        <div className="w-full py-1 sm:py-2">
          <div className="relative z-20 flex flex-nowrap items-center justify-center gap-3 sm:gap-4 md:gap-6 opacity-80">
            {GALLERY_LOGOS.map((logo, index) => (
              <img
                key={logo}
                src={logo}
                alt={logo.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Logo'}
                className={`h-4 sm:h-5 md:h-6 object-contain ${index === GALLERY_LOGOS.length - 1 ? 'relative z-30' : ''} ${
                  logo.toLowerCase().includes('/psg.')
                    ? '!h-6 sm:!h-7 md:!h-8'
                    : ''
                }`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
        {isModalOpen && (
          <GalleryModal
            isOpen={isModalOpen}
            onClose={closeModal}
            item={selectedItem}
          />
        )}
      </section>
    )
  }

  return (
    <section ref={(el) => { sectionRef.current = el }} id="gallery" className="h-[100svh] flex flex-col scroll-mt-[66px] py-4 sm:py-6 lg:py-8 overflow-hidden">
      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={5} />
      <Layout>
        <div className="flex flex-col">
          {/* Fixed Header layer - Centered container */}
          <motion.div 
            className="relative z-10 pb-4 sm:pb-6 text-center max-w-4xl mx-auto"
            {...(mounted ? {
              variants: staggerContainer,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, amount: 0.3 }
            } : {})}
            style={{ pointerEvents: 'auto' }}
          >
            <motion.h2 
              className="heading-section mb-6 text-white"
              {...(mounted ? {
                variants: fadeInUp,
                initial: { scale: 1.02 },
                animate: { scale: 1 },
                transition: { duration: 0.6, ease: 'easeOut' }
              } : {})}
            >
              {t('gallery.title')}
            </motion.h2>
            <div className="space-y-4">
              {t('gallery.description').split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-lg text-gray-300 leading-relaxed"
                  {...(mounted ? { variants: fadeInUp } : {})}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </Layout>

      {/* Full-bleed Horizontal Carousel - Edge to edge */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-3 sm:py-4">
        <motion.div
          ref={trackRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing relative h-[32vh] sm:h-[40vh] md:h-[42vh]"
          onWheel={handleTrackWheel}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={resumeAutoScroll}
          {...(mounted ? { variants: fadeInUp } : {})}
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
            overscrollBehaviorY: 'contain',
            touchAction: 'pan-x',
          }}
        >
          {/* Left gradient fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-10" />
          {/* Right gradient fade */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none z-10" />
          
          <div 
            className="flex gap-2 pb-4 px-8 h-full items-center w-full justify-between"
          >
          {galleryItems.map((item, index) => {
            const title = language === 'fr' ? item.titleFr : item.title
            const { line1, line2 } = splitExperienceTitle(title)
            return (
              <motion.button
                key={item.id}
                onClick={() => handleCardClick(item)}
                className={`flex-shrink-0 text-left cursor-pointer group h-full ${index === galleryItems.length - 1 ? 'relative z-20' : ''}`}
                {...(mounted ? {
                  whileHover: { scale: 1.06, y: -6, boxShadow: '0 12px 32px rgba(255, 255, 255, 0.12)' },
                  whileTap: { scale: 0.98 },
                  transition: { duration: 0.3 }
                } : {})}
              >
                <div className="relative overflow-hidden bg-bg-card shadow-lg group-hover:shadow-white/10 transition-all duration-300 h-full flex-1 min-w-[170px] sm:min-w-[210px] md:min-w-[240px] max-w-[280px]">
                  {/* Image - Portrait 9:16 */}
                  <div className="relative aspect-[9/16] h-full w-full">
                    <img
                      src={item.mediaSrc}
                      alt={title}
                      className="w-full h-full object-cover gallery-video brightness-75 contrast-90"
                    />
                    {/* Gradient overlay on hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                      {...(mounted ? {
                        initial: { opacity: 0.6 },
                        whileHover: { opacity: 1 },
                        transition: { duration: 0.3 }
                      } : {})}
                    />
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-white transition-colors leading-tight">
                        {line1}
                        {line2 ? (
                          <>
                            <br />
                            {line2}
                          </>
                        ) : null}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
          </div>
        </motion.div>
      </div>
      <div className="w-full py-1 sm:py-2">
        <div className="relative z-20 flex flex-nowrap items-center justify-center gap-3 sm:gap-4 md:gap-6 opacity-80">
          {GALLERY_LOGOS.map((logo, index) => (
            <img
              key={logo}
              src={logo}
              alt={logo.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Logo'}
              className={`h-4 sm:h-5 md:h-6 object-contain ${index === GALLERY_LOGOS.length - 1 ? 'relative z-30' : ''} ${
                logo.toLowerCase().includes('/psg.')
                  ? '!h-6 sm:!h-7 md:!h-8'
                  : ''
              }`}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <GalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
      />
    </section>
  )
}
