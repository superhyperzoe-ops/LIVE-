'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from './Layout'
import GalleryModal from './GalleryModal'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { galleryItems, type GalleryItem } from '@/data/gallery'

/**
 * Auto-scroll speed in pixels per second
 * Adjust this value to control the scrolling speed
 * Lower value = slower scroll (more time to see each card)
 */
const AUTO_SCROLL_SPEED_PX_PER_SEC = 200 // Slower, more fluid movement

/**
 * GallerySection component
 * 
 * Horizontal scrollable gallery with:
 * - Auto-scroll animation from end to start when section enters viewport
 * - Clickable cards that open a modal with details
 * - Hover interactions on cards
 * - Manual scrolling support
 */
export default function GallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const stopRef = useRef(false)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering animations
  useEffect(() => {
    setMounted(true)
  }, [])

  // Stop animation on hover
  useEffect(() => {
    if (isHovered) {
      stopRef.current = true
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      console.log('[Gallery] Auto-scroll STOP (hover)') // TODO remove logs
    }
  }, [isHovered])

  // Auto-scroll animation: ultra smooth constant speed from end to start
  useEffect(() => {
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track) {
      console.warn('[Gallery] Missing refs:', { section: !!section, track: !!track }) // TODO remove logs
      return
    }

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced) {
      console.log('[Gallery] Auto-scroll disabled (prefers-reduced-motion)') // TODO remove logs
      return
    }

    let lastTime: number | null = null

    const stop = () => {
      stopRef.current = true
      lastTime = null
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      console.log('[Gallery] Auto-scroll STOP') // TODO remove logs
    }

    const onUserIntent = () => {
      console.log('[Gallery] User interaction detected, stopping auto-scroll') // TODO remove logs
      stop()
    }

    // Stop as soon as user touches / scrolls / clicks
    track.addEventListener('wheel', onUserIntent, { passive: true })
    track.addEventListener('touchstart', onUserIntent, { passive: true })
    track.addEventListener('pointerdown', onUserIntent)
    track.addEventListener('mousedown', onUserIntent)
    track.addEventListener('scroll', onUserIntent, { passive: true })
    window.addEventListener('keydown', onUserIntent)

    const startAutoScroll = () => {
      // Cancel any existing animation to avoid duplicates
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      if (!track) {
        console.warn('[Gallery] Track ref is null, cannot start auto-scroll') // TODO remove logs
        return
      }

      // Calculate max scroll
      const scrollWidth = track.scrollWidth
      const clientWidth = track.clientWidth
      const maxScroll = scrollWidth - clientWidth

      console.log('[Gallery] Scroll dimensions:', { scrollWidth, clientWidth, maxScroll }) // TODO remove logs

      // Only animate if there's scrollable content
      if (maxScroll <= 2) {
        console.warn('[Gallery] No scrollable content (maxScroll <= 2), skipping auto-scroll') // TODO remove logs
        return
      }

      // Force start position at the end
      track.scrollLeft = maxScroll
      stopRef.current = false
      lastTime = null

      console.log('[Gallery] Auto-scroll START (from', maxScroll, 'to 0)') // TODO remove logs

      // Ultra smooth constant speed animation to the beginning
      const tick = (now: number) => {
        if (stopRef.current || !track) {
          lastTime = null
          return
        }

        if (lastTime === null) {
          lastTime = now
          rafRef.current = requestAnimationFrame(tick)
          return
        }

        // Calculate deltaTime in seconds
        const deltaTimeSeconds = (now - lastTime) / 1000
        lastTime = now

        // Calculate scroll distance based on constant speed
        const scrollDelta = AUTO_SCROLL_SPEED_PX_PER_SEC * deltaTimeSeconds

        // Update scroll position (scroll left = move right, so we subtract)
        const newScrollLeft = Math.max(0, track.scrollLeft - scrollDelta)

        // Stop net when we reach the beginning (clamp to 0)
        if (newScrollLeft <= 0) {
          track.scrollLeft = 0
          rafRef.current = null
          lastTime = null
          console.log('[Gallery] Auto-scroll COMPLETE (reached start)') // TODO remove logs
          return
        }

        // Update scroll position
        track.scrollLeft = newScrollLeft

        // Continue animation
        rafRef.current = requestAnimationFrame(tick)
      }

      // Start animation
      lastTime = performance.now()
      rafRef.current = requestAnimationFrame(tick)
    }

    // IntersectionObserver to detect when section becomes visible
    let observer: IntersectionObserver | null = null

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          console.log('[Gallery] IntersectionObserver trigger:', { isIntersecting: entry?.isIntersecting, intersectionRatio: entry?.intersectionRatio }) // TODO remove logs

          if (!entry?.isIntersecting) {
            // Reset when section leaves viewport
            stop()
            return
          }

          // Relaunch auto-scroll on every entry (not just first time)
          // Cancel any existing animation first to avoid duplicates
          stop()

          // Wait for layout to be stable (double RAF) with a small delay
          setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (section && track && !stopRef.current) {
                  console.log('[Gallery] Starting auto-scroll on section entry') // TODO remove logs
                  startAutoScroll()
                }
              })
            })
          }, 300) // Small delay to ensure section is fully visible
        },
        { 
          threshold: 0.2, // Lower threshold for earlier trigger
          rootMargin: '-10% 0px -10% 0px' // Trigger when section is more visible
        }
      )

      observer.observe(section)
    } else {
      console.warn('[Gallery] IntersectionObserver not supported') // TODO remove logs
    }

    // Fallback: if IntersectionObserver doesn't trigger or section is already visible
    const fallbackCheck = () => {
      if (section && track) {
        const rect = section.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2

        if (isVisible) {
          console.log('[Gallery] Fallback: Section visible, starting auto-scroll') // TODO remove logs
          stop()
          setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (section && track && !stopRef.current) {
                  startAutoScroll()
                }
              })
            })
          }, 300)
        }
      }
    }

    // Try fallback after a short delay
    const fallbackTimeout = setTimeout(fallbackCheck, 500)

    return () => {
      stop()
      if (observer) {
        observer.disconnect()
      }
      clearTimeout(fallbackTimeout)
      track.removeEventListener('wheel', onUserIntent)
      track.removeEventListener('touchstart', onUserIntent)
      track.removeEventListener('pointerdown', onUserIntent)
      track.removeEventListener('mousedown', onUserIntent)
      track.removeEventListener('scroll', onUserIntent)
      window.removeEventListener('keydown', onUserIntent)
    }
  }, [])

  const handleCardClick = (item: GalleryItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  // Render static content until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <section ref={(el) => { sectionRef.current = el }} id="gallery" className="min-h-screen flex flex-col snap-start snap-always scroll-mt-[66px] py-24 lg:py-32">
        <Layout>
          <div className="flex flex-col">
            <div className="relative z-10 pb-12 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Gallery
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-300 leading-relaxed">
                  Discover a selection of events that have used our Live technology in unique and creative&nbsp;ways.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Each installation showcases a different approach to real-time AI video generation, offering inspiration for how you can integrate this experience into your own projects.
                </p>
              </div>
            </div>
          </div>
        </Layout>
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-8">
          <div
            ref={trackRef}
            data-no-snap="true"
            className="overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing snap-x snap-mandatory relative h-[55vh] sm:h-[60vh]"
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
            <div className="flex gap-6 pb-4 px-4 h-full items-center">
              {galleryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="flex-shrink-0 snap-start text-left cursor-pointer group h-full"
                >
                  <div className="relative overflow-hidden bg-bg-card shadow-lg group-hover:shadow-white/10 transition-all duration-300 h-full w-[240px] sm:w-[280px] md:w-[320px]">
                    <div className="relative aspect-[9/16] h-full w-full">
                      {item.videoSrc ? (
                        <video
                          src={item.videoSrc}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover gallery-video"
                        />
                      ) : (
                        <img
                          src={item.imageSrc}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-white transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
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
    <section ref={(el) => { sectionRef.current = el }} id="gallery" className="min-h-screen flex flex-col snap-start snap-always scroll-mt-[66px] py-24 lg:py-32">
      <Layout>
        <div className="flex flex-col">
          {/* Fixed Header layer - Centered container */}
          <motion.div 
            className="relative z-10 pb-12 text-center max-w-3xl mx-auto"
            {...(mounted ? {
              variants: staggerContainer,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, amount: 0.3 }
            } : {})}
            style={{ pointerEvents: 'auto' }}
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold mb-6 text-white"
              {...(mounted ? {
                variants: fadeInUp,
                initial: { scale: 1.02 },
                animate: { scale: 1 },
                transition: { duration: 0.6, ease: 'easeOut' }
              } : {})}
            >
              Gallery
            </motion.h2>
            <div className="space-y-4">
              <motion.p 
                className="text-lg text-gray-300 leading-relaxed"
                {...(mounted ? { variants: fadeInUp } : {})}
              >
                Discover a selection of events that have used our Live technology in unique and creative&nbsp;ways.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-300 leading-relaxed"
                {...(mounted ? { variants: fadeInUp } : {})}
              >
                Each installation showcases a different approach to real-time AI video generation, offering inspiration for how you can integrate this experience into your own projects.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </Layout>

      {/* Full-bleed Horizontal Carousel - Edge to edge */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-8">
        <motion.div
          ref={trackRef}
          data-no-snap="true"
          className="overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing snap-x snap-mandatory relative h-[55vh] sm:h-[60vh]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
            className="flex gap-6 pb-4 px-4 h-full items-center"
            {...(mounted ? { style: { width: 'max-content' } } : {})}
          >
            {galleryItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="flex-shrink-0 snap-start text-left cursor-pointer group h-full"
                {...(mounted ? {
                  whileHover: { scale: 1.03 },
                  whileTap: { scale: 0.98 },
                  transition: { duration: 0.3 }
                } : {})}
              >
                <div className="relative overflow-hidden bg-bg-card shadow-lg group-hover:shadow-white/10 transition-all duration-300 h-full w-[240px] sm:w-[280px] md:w-[320px]">
                  {/* Video or Image - Portrait 9:16 */}
                  <div className="relative aspect-[9/16] h-full w-full">
                    {item.videoSrc ? (
                      <video
                        src={item.videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover gallery-video"
                      />
                    ) : (
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
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
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
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
