'use client'

import { useState, useEffect } from 'react'

type NavSectionId = 'live' | 'technology' | 'gallery' | 'contact' | 'about'

type SectionInfo = {
  navId: NavSectionId
  distance: number
}

export function useActiveNavSection(): NavSectionId {
  const [activeId, setActiveId] = useState<NavSectionId>('live')

  useEffect(() => {
    const updateActiveSection = () => {
      const main = document.querySelector('main')
      if (!main) return

      const viewportCenter = window.innerHeight / 2
      let closestSection: SectionInfo | null = null

      // Chercher toutes les sections avec data-nav-section
      const allSections = document.querySelectorAll<HTMLElement>('[data-nav-section]')

      allSections.forEach((element) => {
        const navId = element.dataset.navSection as NavSectionId | undefined
        if (!navId || !['live', 'technology', 'gallery', 'contact', 'about'].includes(navId)) {
          return
        }

        const rect = element.getBoundingClientRect()
        const mainRect = main.getBoundingClientRect()
        
        // Position relative au conteneur main
        const sectionTop = rect.top - mainRect.top + main.scrollTop
        const sectionBottom = rect.bottom - mainRect.top + main.scrollTop
        const viewportCenterAbsolute = main.scrollTop + viewportCenter

        // Vérifier si le centre du viewport est dans cette section
        if (viewportCenterAbsolute >= sectionTop && viewportCenterAbsolute <= sectionBottom) {
          // Le centre est dans cette section, c'est la section active
          closestSection = { navId, distance: 0 }
          return
        }

        // Sinon, calculer la distance au centre
        let distance: number
        if (viewportCenterAbsolute < sectionTop) {
          // Le centre est au-dessus de la section
          distance = sectionTop - viewportCenterAbsolute
        } else {
          // Le centre est en-dessous de la section
          distance = viewportCenterAbsolute - sectionBottom
        }

        // Si c'est la première section ou si elle est plus proche
        if (!closestSection || distance < closestSection.distance) {
          closestSection = { navId, distance }
        }
      })

      if (closestSection) {
        const section = closestSection as SectionInfo
        setActiveId(section.navId)
      }
    }

    // Vérification initiale
    updateActiveSection()

    // Écouter le scroll et le resize
    const main = document.querySelector('main')
    if (main) {
      main.addEventListener('scroll', updateActiveSection, { passive: true })
    }
    window.addEventListener('resize', updateActiveSection, { passive: true })

    return () => {
      if (main) {
        main.removeEventListener('scroll', updateActiveSection)
      }
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  return activeId
}
