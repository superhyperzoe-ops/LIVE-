'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const navItems = [
  { labelKey: 'nav.technology', href: '#technology' },
  { labelKey: 'nav.gallery', href: '#gallery' },
  { labelKey: 'nav.contact', href: '#contact' },
  { labelKey: 'nav.about', href: '#about' },
]

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState<string>('hero')
  const { language, setLanguage, t } = useLanguage()

  // Map section IDs to navbar items
  const getNavbarSectionId = (sectionId: string): string => {
    // Technology-related sections should activate "technology" in navbar
    const technologySections = [
      'technology',    // Technology section principale
      'system',        // System summary
      'speech-detail', // Speech to video
      'text-detail',   // Text to video
      'moderation',    // Moderation
      'style'          // Style
    ]
    if (technologySections.includes(sectionId)) {
      return 'technology'
    }
    // Other sections use their own ID
    return sectionId
  }

  // Track active section with IntersectionObserver and scroll
  useEffect(() => {
    if (typeof window === 'undefined') return

    const main = document.querySelector('main')
    if (!main) return

    let sections = document.querySelectorAll('section[id]')
    if (sections.length === 0) {
      // Retry after a delay for dynamically loaded sections
      setTimeout(() => {
        sections = document.querySelectorAll('section[id]')
        if (sections.length === 0) return
      }, 1000)
      return
    }

    const observers: IntersectionObserver[] = []

    type IOEntry = {
      isIntersecting: boolean
      intersectionRatio: number
      target: Element
    }

    // IntersectionObserver handler - must be defined before observeSection
    const handleIntersection = (entries: IOEntry[]) => {
      // Find the most visible section
      let mostVisible: IOEntry | null = null
      let maxRatio = 0

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio
          mostVisible = entry
        }
      })

      // NOTE: garde-fou TS (certains environnements typent mal IntersectionObserverEntry en build)
      const mv = mostVisible as any
      if (mostVisible && mv.intersectionRatio > 0.15) {
        const sectionId = (mv.target as HTMLElement).id
        if (sectionId) {
          const navbarSectionId = getNavbarSectionId(sectionId)
          setActiveSection(navbarSectionId)
          // Debug: log when gallery is detected
          if (sectionId === 'gallery' || navbarSectionId === 'gallery') {
            console.log('[Navbar] Gallery section detected, activeSection set to:', navbarSectionId)
          }
        }
      }
    }
    
    // Function to observe a section
    const observeSection = (section: Element) => {
      const observer = new IntersectionObserver(handleIntersection as any, {
        threshold: [0.1, 0.15, 0.2, 0.3, 0.5, 0.7, 0.9],
        rootMargin: '-5% 0px -5% 0px',
      })
      observer.observe(section)
      observers.push(observer)
    }

    const updateActiveSection = () => {
      // Always query fresh sections to catch dynamically loaded ones
      const allSections = document.querySelectorAll('section[id]')
      if (allSections.length === 0) return
      
      const scrollTop = main.scrollTop
      const viewportHeight = window.innerHeight
      const viewportCenter = scrollTop + viewportHeight / 2

      let activeId: string | null = null
      let minDistance = Infinity

      // Find the section closest to viewport center
      allSections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const sectionTop = scrollTop + rect.top
        const sectionBottom = sectionTop + rect.height
        const sectionCenter = sectionTop + rect.height / 2

        // Check if section is in viewport
        if (sectionTop <= viewportCenter && sectionBottom >= viewportCenter) {
          const distance = Math.abs(sectionCenter - viewportCenter)
          if (distance < minDistance) {
            minDistance = distance
            activeId = section.id
          }
        }
      })

      // If no section found in center, find the closest one
      if (!activeId) {
        allSections.forEach((section) => {
          const rect = section.getBoundingClientRect()
          const sectionTop = scrollTop + rect.top
          const sectionBottom = sectionTop + rect.height
          const sectionCenter = sectionTop + rect.height / 2

          const distance = Math.abs(sectionCenter - viewportCenter)
          if (distance < minDistance) {
            minDistance = distance
            activeId = section.id
          }
        })
      }

      if (activeId) {
        const navbarSectionId = getNavbarSectionId(activeId)
        setActiveSection(navbarSectionId)
        // Debug: log when gallery is detected via scroll
        if (activeId === 'gallery' || navbarSectionId === 'gallery') {
          console.log('[Navbar] Gallery section detected via scroll, activeSection set to:', navbarSectionId)
        }
      }
    }


    // Observe all initial sections
    sections.forEach((section) => {
      observeSection(section)
    })
    
    // Also observe sections that might be loaded dynamically (like Gallery)
    const checkForNewSections = () => {
      const allSections = document.querySelectorAll('section[id]')
      allSections.forEach((section) => {
        // Check if this section is already being observed
        const isObserved = observers.some(obs => {
          // We can't directly check, so we'll observe all and let IntersectionObserver handle duplicates
          return false
        })
        if (!isObserved) {
          observeSection(section)
        }
      })
    }
    
    // Check for new sections periodically
    const sectionCheckInterval = setInterval(checkForNewSections, 1000)

    // Scroll listener as fallback - more frequent updates
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(updateActiveSection, 30) // Faster update
    }

    main.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial check with retry for dynamic content
    const initialCheck = () => {
      updateActiveSection()
      // Retry after a delay to catch dynamically loaded sections like Gallery
      setTimeout(() => {
        const allSections = document.querySelectorAll('section[id]')
        if (allSections.length > sections.length) {
          // New sections detected, re-observe
          allSections.forEach((section) => {
            if (!Array.from(sections).includes(section)) {
              const observer = new IntersectionObserver(handleIntersection, {
                threshold: [0.1, 0.15, 0.2, 0.3, 0.5, 0.7, 0.9],
                rootMargin: '-5% 0px -5% 0px',
              })
              observer.observe(section)
              observers.push(observer)
            }
          })
        }
        updateActiveSection()
      }, 500)
    }
    
    setTimeout(initialCheck, 100)

    return () => {
      observers.forEach((observer) => observer.disconnect())
      main.removeEventListener('scroll', handleScroll as EventListener)
      clearTimeout(scrollTimeout)
      clearInterval(sectionCheckInterval)
    }
  }, [])

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    let frameId: number | null = null

    const updateProgress = () => {
      const max = main.scrollHeight - main.clientHeight
      const p = max <= 0 ? 0 : main.scrollTop / max
      const clamped = Math.min(1, Math.max(0, p))
      setScrollProgress(clamped)
      frameId = null
    }

    const handleScroll = () => {
      if (frameId !== null) return
      frameId = requestAnimationFrame(updateProgress)
    }

    const handleResize = () => {
      updateProgress()
    }

    // Valeur initiale au montage
    updateProgress()

    main.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      main.removeEventListener('scroll', handleScroll as EventListener)
      window.removeEventListener('resize', handleResize)
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-global/80 backdrop-blur-md border-b border-gray-900/50">
      <div className="w-full px-6 sm:px-8 lg:px-12 relative">
        <div className="flex items-center h-16 w-full">
          {/* Portal - Left */}
          <motion.a
            href="#hero"
            onClick={(e) => handleClick(e, '#hero')}
            className={`uppercase tracking-[0.2em] text-white transition-all duration-300 hover:text-white/80 focus:outline-none focus:text-white/80 ${
              activeSection === 'hero'
                ? 'text-base md:text-lg font-bold nav-glitch-active'
                : 'text-sm'
            }`}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            Portal
          </motion.a>

          {/* Navigation items */}
          <div className="flex items-center gap-6 lg:gap-8 ml-auto mr-6">
            {navItems.map((item) => {
              const sectionId = item.href.substring(1) // Remove #
              const isActive = activeSection === sectionId
              
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`uppercase tracking-[0.2em] text-white transition-all duration-300 ${
                    isActive 
                      ? 'text-base md:text-lg font-bold nav-glitch-active' 
                      : 'text-sm'
                  }`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {t(item.labelKey)}
                </motion.a>
              )
            })}
          </div>

          {/* Language toggle - Right */}
          <motion.button
            onClick={toggleLanguage}
            className="uppercase tracking-[0.2em] text-black text-sm transition-all duration-300 bg-white px-3 py-1.5 hover:bg-white/90 focus:outline-none focus:text-black"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            aria-label={`Switch to ${language === 'fr' ? 'English' : 'Français'}`}
          >
            {language === 'fr' ? 'EN' : 'FR'}
          </motion.button>
        </div>

        {/* Barre de progression globale sous la navbar */}
        <div
          className="absolute left-0 bottom-0 h-[2px] bg-white will-change-transform origin-left pointer-events-none z-50"
          style={{
            width: `${Math.max(2, scrollProgress * 100)}%`,
            transition: 'width 80ms linear',
          }}
        />
      </div>
    </nav>
  )
}



