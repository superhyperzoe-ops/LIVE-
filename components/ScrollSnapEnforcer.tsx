'use client'

import { useEffect, useRef } from 'react'

/**
 * ScrollSnapEnforcer component
 * 
 * Soft scroll snap behavior that:
 * 1. Allows natural, continuous scrolling during user interaction
 * 2. Gently recenters on the nearest section after scrolling stops
 * 3. Ensures final position is always exactly on a section start
 * 4. Does not interfere with active scrolling gestures
 * 5. Preserves anchor navigation (scrollIntoView from navbar)
 */
export default function ScrollSnapEnforcer() {
  const isScrollingRef = useRef(false)
  const isUserScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    // Get all snap sections (excluding footer)
    const getAllSections = (): HTMLElement[] => {
      const sections = document.querySelectorAll('section[id]')
      return Array.from(sections).filter(
        (section) => section.id !== 'footer-section'
      ) as HTMLElement[]
    }

    // Find the closest section to the current viewport position
    const getClosestSection = (): HTMLElement | null => {
      const sections = getAllSections()
      if (sections.length === 0) return null

      const scrollY = window.scrollY
      let closestSection: HTMLElement | null = null
      let minDistance = Infinity

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const sectionTop = rect.top + scrollY
        const distance = Math.abs(scrollY - sectionTop)

        if (distance < minDistance) {
          minDistance = distance
          closestSection = section
        }
      })

      return closestSection
    }

    // Gently snap to the closest section
    const snapToClosest = () => {
      // Don't snap if user is actively scrolling or if we're already snapping
      if (isUserScrollingRef.current || isScrollingRef.current) return

      const closestSection = getClosestSection()
      if (!closestSection) return

      const rect = closestSection.getBoundingClientRect()
      const distanceFromTop = Math.abs(rect.top)

      // Only snap if we're not already aligned (tolerance: 10px)
      if (distanceFromTop > 10) {
        isScrollingRef.current = true

        closestSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })

        // Reset flag after smooth scroll animation
        setTimeout(() => {
          isScrollingRef.current = false
        }, 600)
      }
    }

    // Detect if user is actively scrolling
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = Math.abs(currentScrollY - lastScrollYRef.current)
      lastScrollYRef.current = currentScrollY

      // If scroll position changed significantly, user is actively scrolling
      if (scrollDelta > 1) {
        isUserScrollingRef.current = true

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }

    // After scroll stops (debounced 250ms), allow snapping
    scrollTimeoutRef.current = setTimeout(() => {
          isUserScrollingRef.current = false
          // Small delay before snapping to ensure scroll has fully stopped
          setTimeout(() => {
            snapToClosest()
      }, 120)
    }, 250)
      }
    }

    // Detect wheel events to track active scrolling
    const handleWheel = () => {
      isUserScrollingRef.current = true

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

    // After wheel events stop (debounced 260ms for trackpad inertia)
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false
        // Wait a bit more for scroll inertia to settle
        setTimeout(() => {
          snapToClosest()
      }, 140)
    }, 260)
    }

    // Handle keyboard navigation (preserve accessibility)
    const handleKeyDown = (e: KeyboardEvent) => {
      const sections = getAllSections()
      if (sections.length === 0) return

      const sortedSections = sections
        .map((section) => {
          const rect = section.getBoundingClientRect()
          return {
            element: section,
            top: rect.top + window.scrollY,
          }
        })
        .sort((a, b) => a.top - b.top)

      const currentSection = getClosestSection()
      if (!currentSection) return

      const currentIndex = sortedSections.findIndex((s) => s.element === currentSection)

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        const nextSection = sortedSections[currentIndex + 1] || sortedSections[sortedSections.length - 1]
        if (nextSection) {
          isScrollingRef.current = true
          nextSection.element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => { isScrollingRef.current = false }, 600)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        const prevSection = sortedSections[currentIndex - 1] || sortedSections[0]
        if (prevSection) {
          isScrollingRef.current = true
          prevSection.element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => { isScrollingRef.current = false }, 600)
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        isScrollingRef.current = true
        sortedSections[0].element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => { isScrollingRef.current = false }, 600)
      } else if (e.key === 'End') {
        e.preventDefault()
        isScrollingRef.current = true
        sortedSections[sortedSections.length - 1].element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => { isScrollingRef.current = false }, 600)
      }
    }

    // Add event listeners (all passive to not interfere with native scroll)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    // Initial alignment on load (only if needed)
    setTimeout(() => {
      if (!isUserScrollingRef.current) {
        snapToClosest()
      }
    }, 200)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return null
}

