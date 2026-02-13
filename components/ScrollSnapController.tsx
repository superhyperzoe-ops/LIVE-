'use client'

import { useEffect, useRef } from 'react'

/**
 * ScrollSnapController component
 * 
 * Provides smooth, reliable section-to-section navigation on scroll gestures.
 * - Accumulates wheel delta for trackpad-friendly behavior
 * - Uses custom smoothScrollTo with requestAnimationFrame for consistent animation
 * - Prevents animation overlap and jank
 * - Respects data-no-snap zones (gallery, forms, etc.)
 */

// Configuration constants - Tune these for feel:
const WHEEL_THRESHOLD = 20 // Require a small, intentional scroll
const SCROLL_DURATION = 800 // Slower for smoother, less abrupt snap
const NAVBAR_HEIGHT = 66 // Navbar height in pixels for offset calculation
const MIN_DELTA = 4 // Ignore tiny jitters

export default function ScrollSnapController() {
  const sectionsRef = useRef<HTMLElement[]>([])
  
  // Animation state
  const animationFrameRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)
  const animationStartTimeRef = useRef<number | null>(null)
  const animationStartYRef = useRef<number | null>(null)
  const animationTargetYRef = useRef<number | null>(null)
  
  // Wheel accumulation state
  const deltaAccumulatorRef = useRef(0)
  const lastDirectionRef = useRef<'up' | 'down' | null>(null)
  const wheelLockRef = useRef(false)
  const wheelLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // A) Gather sections robustly
    const collectSections = (): HTMLElement[] => {
      const sections = document.querySelectorAll<HTMLElement>('section[id]')
      return Array.from(sections)
        .filter((section) => section.id !== 'footer-section')
        .map((section) => ({
          element: section,
          offsetTop: section.offsetTop,
        }))
        .sort((a, b) => a.offsetTop - b.offsetTop)
        .map((item) => item.element)
    }

    // Update sections list
    const updateSections = () => {
      sectionsRef.current = collectSections()
    }

    // B) Compute active index robustly
    const getCurrentSectionIndex = (): number => {
      const sections = sectionsRef.current
      if (sections.length === 0) return -1

      const scrollY = window.scrollY
      const innerHeight = window.innerHeight
      const referenceY = scrollY + innerHeight * 0.3

      // Find the last section where offsetTop <= referenceY
      let activeIndex = -1
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= referenceY) {
          activeIndex = i
        } else {
          break
        }
      }

      // If no section found, default to first
      if (activeIndex === -1) {
        activeIndex = 0
      }

      return activeIndex
    }

    // Get target section for navigation
    const getTargetSection = (direction: 'up' | 'down'): HTMLElement | null => {
      const sections = sectionsRef.current
      if (sections.length === 0) return null

      const currentIndex = getCurrentSectionIndex()

      if (direction === 'down') {
        // Next section
        const nextIndex = currentIndex + 1
        return nextIndex < sections.length ? sections[nextIndex] : null
      } else {
        // Previous section
        const prevIndex = currentIndex - 1
        return prevIndex >= 0 ? sections[prevIndex] : null
      }
    }

    // Check if event target is inside a no-snap container
    const isInsideNoSnap = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false

      // Check if target or any parent has data-no-snap attribute
      let element: Element | null = target
      while (element) {
        if (element.hasAttribute('data-no-snap')) {
          return true
        }
        element = element.parentElement
      }

      // Check if target is inside a form, input, textarea, or scrollable container
      element = target instanceof Element ? target : null
      if (!element) return false

      const isFormElement = element.closest('form, input, textarea, select, [contenteditable="true"]')
      if (isFormElement) return true

      // Check if target is inside a scrollable container (not the window)
      const scrollableContainer = element.closest('[style*="overflow"], [class*="overflow"]')
      if (scrollableContainer && scrollableContainer !== document.documentElement && scrollableContainer !== document.body) {
        const style = window.getComputedStyle(scrollableContainer)
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return true
        }
      }

      return false
    }

    // Cancel any ongoing animation
    const cancelAnimation = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      isAnimatingRef.current = false
      animationStartTimeRef.current = null
      animationStartYRef.current = null
      animationTargetYRef.current = null
    }

    // Easing function: easeInOutCubic
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    // Smooth scroll to target position with cancellation support
    const smoothScrollTo = (targetY: number, duration: number, onComplete?: () => void) => {
      // Cancel any existing animation
      cancelAnimation()

      const startY = window.scrollY
      const distance = targetY - startY
      const startTime = performance.now()

      // If distance is very small, skip animation
      if (Math.abs(distance) < 1) {
        window.scrollTo(0, targetY)
        isAnimatingRef.current = false
        return
      }

      // Temporarily disable CSS snap and smooth behavior to avoid jitter
      const root = document.documentElement
      const previousSnapType = root.style.scrollSnapType
      const previousScrollBehavior = root.style.scrollBehavior
      root.style.scrollSnapType = 'none'
      root.style.scrollBehavior = 'auto'

      // Store animation state
      isAnimatingRef.current = true
      animationStartTimeRef.current = startTime
      animationStartYRef.current = startY
      animationTargetYRef.current = targetY

      const animate = (currentTime: number) => {
        // Check if animation was cancelled
        if (!isAnimatingRef.current || animationStartTimeRef.current === null) {
          return
        }

        const elapsed = currentTime - animationStartTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeInOutCubic(progress)
        const currentY = animationStartYRef.current! + distance * eased

        window.scrollTo(0, currentY)

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          // Ensure we end exactly at target
          window.scrollTo(0, targetY)
          // Restore CSS snap after animation completes
          root.style.scrollSnapType = previousSnapType || ''
          root.style.scrollBehavior = previousScrollBehavior || ''
          // Animation complete
          isAnimatingRef.current = false
          animationStartTimeRef.current = null
          animationStartYRef.current = null
          animationTargetYRef.current = null
          animationFrameRef.current = null
          onComplete?.()
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Navigate to section
    const navigateToSection = (section: HTMLElement) => {
      const targetY = section.offsetTop - NAVBAR_HEIGHT
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        // Instant jump for reduced motion
        cancelAnimation()
        window.scrollTo(0, targetY)
        isAnimatingRef.current = false
      } else {
        // Smooth scroll with constant duration
        smoothScrollTo(targetY, SCROLL_DURATION)
      }
    }

    // C) Wheel handling: jump to next/prev section on first scroll intent
    const handleWheel = (e: WheelEvent) => {
      // Ignore horizontal scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

      // Ignore if Ctrl/Meta is held (zoom gesture)
      if (e.ctrlKey || e.metaKey) return

      // D) Lock/cooldown: if animating or locked, ignore wheel events
      if (isAnimatingRef.current) {
        return
      }
      if (wheelLockRef.current) {
        e.preventDefault()
        return
      }

      // Ignore tiny scroll movements
      if (Math.abs(e.deltaY) < MIN_DELTA) return

      // Determine direction
      const direction: 'up' | 'down' = e.deltaY > 0 ? 'down' : 'up'

      // If inside no-snap, allow vertical navigation from gallery cards
      if (isInsideNoSnap(e.target)) {
        const targetEl = e.target instanceof Element ? e.target : null
        const isInGallery = !!targetEl?.closest('#gallery')
        const isInNoSnap = !!targetEl?.closest('[data-no-snap]')

        if (isInGallery && isInNoSnap) {
          // Allow vertical snap even when pointer is on cards
        } else {
          return
        }
      }

      const targetSection = getTargetSection(direction)
      if (!targetSection) {
        deltaAccumulatorRef.current = 0
        return
      }

      // Prevent native scroll to avoid initial jitter
      e.preventDefault()
      e.stopPropagation()

      // Accumulate minimal delta to avoid accidental tiny jitters
      deltaAccumulatorRef.current += Math.abs(e.deltaY)
      if (deltaAccumulatorRef.current < WHEEL_THRESHOLD) return

      const currentIndex = getCurrentSectionIndex()
      const targetIndex = sectionsRef.current.indexOf(targetSection)
      if (targetIndex === currentIndex) {
        deltaAccumulatorRef.current = 0
        return
      }

      // Jump directly to the next section
      cancelAnimation()

      const targetY = targetSection.offsetTop - NAVBAR_HEIGHT
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        window.scrollTo(0, targetY)
        isAnimatingRef.current = false
      } else {
        smoothScrollTo(targetY, SCROLL_DURATION)
      }

      // Lock wheel until the snap completes to avoid skipping multiple sections
      wheelLockRef.current = true
      if (wheelLockTimeoutRef.current) {
        clearTimeout(wheelLockTimeoutRef.current)
      }
      wheelLockTimeoutRef.current = setTimeout(() => {
        wheelLockRef.current = false
      }, SCROLL_DURATION + 250)

      deltaAccumulatorRef.current = 0
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside form or input
      if (isInsideNoSnap(e.target)) return

      // Ignore if animating
      if (isAnimatingRef.current) return

      let targetSection: HTMLElement | null = null

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        targetSection = getTargetSection('down')
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        targetSection = getTargetSection('up')
      } else if (e.key === 'Home') {
        e.preventDefault()
        const sections = sectionsRef.current
        if (sections.length > 0) {
          targetSection = sections[0]
        }
      } else if (e.key === 'End') {
        e.preventDefault()
        const sections = sectionsRef.current
        if (sections.length > 0) {
          targetSection = sections[sections.length - 1]
        }
      }

      if (targetSection) {
        cancelAnimation()
        navigateToSection(targetSection)
      }
    }

    // Initialize sections
    updateSections()

    // Update sections on resize and load
    const handleResize = () => {
      updateSections()
    }

    const handleLoad = () => {
      updateSections()
    }

    // E) Add event listeners with proper options
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    window.addEventListener('load', handleLoad)

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', handleLoad)
      
      // Cancel any ongoing animation
      cancelAnimation()
      if (wheelLockTimeoutRef.current) {
        clearTimeout(wheelLockTimeoutRef.current)
        wheelLockTimeoutRef.current = null
      }
    }
  }, [])

  return null
}
