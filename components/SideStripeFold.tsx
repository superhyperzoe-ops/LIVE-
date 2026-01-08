'use client'

import { useEffect, useRef } from 'react'

interface SideStripeFoldProps {
  className?: string
  enabled?: boolean
}

/**
 * SideStripeFold - Op-art folded ribbon with thick white bands
 * Scroll-driven movement with spring overshoot and section reactions
 */
export default function SideStripeFold({
  className = '',
  enabled = true,
}: SideStripeFoldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const stateRef = useRef({
    scrollProgress: 0,
    activeSection: '',
    // Spring overshoot state
    springVelocity: 0,
    springTarget: 0,
    springCurrent: 0,
    // Section transition state
    sectionTransitionProgress: 0,
    sectionTransitionStart: 0,
    sectionTargetKinkY: 0,
    sectionTargetAngle: 0,
    sectionTargetX: 0,
    // Current animated values
    currentKinkY: 0,
    currentAngle: 0,
    currentX: 0,
  })
  const isMountedRef = useRef(false)
  const lastScrollTimeRef = useRef(0)

  // Configuration
  const CONFIG = {
    // Layout
    width: 140,
    rightOffset: 24,
    
    // Stripe configuration
    stripeCount: 8, // 6-10 bandes
    stripeThickness: 16, // 10-18px épaisseur (augmenté pour visibilité)
    stripeGap: 10, // 6-12px gap noir (augmenté pour contraste)
    
    // Polyline structure (3 segments: vertical → diagonal → vertical)
    topSegmentLength: 0.3, // 30% de la hauteur
    bottomSegmentLength: 0.7, // 70% de la hauteur
    kinkSharpness: 0.85, // Netteté du coude
    
    // Scroll mapping
    kinkYRange: [0.25, 0.75], // Position Y du coude (0-1 de la hauteur)
    angleRange: [0.4, 0.7], // Angle de la diagonale (radians)
    xShiftRange: [-10, 10], // Shift horizontal (px)
    
    // Spring overshoot
    springStiffness: 0.15,
    springDamping: 0.08,
    overshootAmount: 0.12, // Amplitude de l'overshoot
    
    // Section transition
    sectionTransitionDuration: 900, // 0.6-1.2s
    sectionAngleVariation: 0.15, // Variation d'angle par section
    sectionKinkYVariation: 0.1, // Variation position Y par section
    sectionXVariation: 6, // Variation X par section
  }

  // EaseOutCubic
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3)
  }

  // Linear interpolation
  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor
  }

  // Calculate perpendicular vector for offset
  const getPerpendicular = (dx: number, dy: number, normalize: boolean = true) => {
    const length = Math.sqrt(dx * dx + dy * dy)
    if (length === 0) return { x: 0, y: 1 }
    const scale = normalize ? 1 / length : 1
    return { x: -dy * scale, y: dx * scale }
  }

  // Draw a thick stripe as a polygon (quad) along a polyline
  const drawStripe = (
    ctx: CanvasRenderingContext2D,
    points: Array<{ x: number; y: number }>,
    offset: number, // Perpendicular offset from centerline
    thickness: number
  ) => {
    if (points.length < 2) return

    const halfThickness = thickness / 2
    const topPoints: Array<{ x: number; y: number }> = []
    const bottomPoints: Array<{ x: number; y: number }> = []

    // Calculate offset points for top and bottom edges
    for (let i = 0; i < points.length; i++) {
      let perp: { x: number; y: number }
      
      if (i === 0) {
        // First point: use direction to next point
        const dx = points[1].x - points[0].x
        const dy = points[1].y - points[0].y
        perp = getPerpendicular(dx, dy)
      } else if (i === points.length - 1) {
        // Last point: use direction from previous point
        const dx = points[i].x - points[i - 1].x
        const dy = points[i].y - points[i - 1].y
        perp = getPerpendicular(dx, dy)
      } else {
        // Middle point: average of two directions
        const dx1 = points[i].x - points[i - 1].x
        const dy1 = points[i].y - points[i - 1].y
        const dx2 = points[i + 1].x - points[i].x
        const dy2 = points[i + 1].y - points[i].y
        const perp1 = getPerpendicular(dx1, dy1)
        const perp2 = getPerpendicular(dx2, dy2)
        perp = {
          x: (perp1.x + perp2.x) / 2,
          y: (perp1.y + perp2.y) / 2,
        }
        // Normalize
        const len = Math.sqrt(perp.x * perp.x + perp.y * perp.y)
        if (len > 0) {
          perp.x /= len
          perp.y /= len
        }
      }

      // Offset point: offset is the centerline offset, then add/subtract half thickness
      const centerOffsetX = perp.x * offset
      const centerOffsetY = perp.y * offset
      
      // Top edge (offset + half thickness outward)
      const topOffsetX = perp.x * halfThickness
      const topOffsetY = perp.y * halfThickness
      topPoints.push({
        x: points[i].x + centerOffsetX + topOffsetX,
        y: points[i].y + centerOffsetY + topOffsetY,
      })

      // Bottom edge (offset - half thickness inward)
      const bottomOffsetX = -perp.x * halfThickness
      const bottomOffsetY = -perp.y * halfThickness
      bottomPoints.push({
        x: points[i].x + centerOffsetX + bottomOffsetX,
        y: points[i].y + centerOffsetY + bottomOffsetY,
      })
    }

    // Draw polygon (quad strip)
    ctx.beginPath()
    ctx.moveTo(topPoints[0].x, topPoints[0].y)
    for (let i = 1; i < topPoints.length; i++) {
      ctx.lineTo(topPoints[i].x, topPoints[i].y)
    }
    // Connect to bottom edge (reverse order)
    for (let i = bottomPoints.length - 1; i >= 0; i--) {
      ctx.lineTo(bottomPoints[i].x, bottomPoints[i].y)
    }
    ctx.closePath()
    ctx.fill()
  }

  // Track scroll progress from main element
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    const main = document.querySelector('main')
    if (!main) return

    let frameId: number | null = null

    const updateScrollProgress = () => {
      const max = main.scrollHeight - main.clientHeight
      const progress = max <= 0 ? 0 : main.scrollTop / max
      const clamped = Math.min(1, Math.max(0, progress))
      
      const now = performance.now()
      const timeSinceLastScroll = now - lastScrollTimeRef.current
      
      // Detect scroll activity (within last 100ms)
      if (timeSinceLastScroll < 100) {
        // Trigger spring overshoot
        const delta = clamped - stateRef.current.scrollProgress
        stateRef.current.springVelocity += delta * 0.3
      }
      
      stateRef.current.scrollProgress = clamped
      stateRef.current.springTarget = clamped
      lastScrollTimeRef.current = now
      frameId = null
    }

    const handleScroll = () => {
      if (frameId !== null) return
      frameId = requestAnimationFrame(updateScrollProgress)
    }

    const handleResize = () => {
      updateScrollProgress()
    }

    updateScrollProgress()
    main.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      main.removeEventListener('scroll', handleScroll as EventListener)
      window.removeEventListener('resize', handleResize)
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [enabled])

  // Track active section with IntersectionObserver
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    const sections = document.querySelectorAll('section[id]')
    if (sections.length === 0) return

    const observers: IntersectionObserver[] = []

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.id
          if (sectionId && sectionId !== stateRef.current.activeSection) {
            // New section detected - trigger transition
            stateRef.current.activeSection = sectionId
            
            // Calculate new target pose based on section
            const sectionIndex = Array.from(sections).findIndex(s => s.id === sectionId)
            const sectionSeed = sectionIndex * 0.17 // Unique seed per section
            
            stateRef.current.sectionTargetKinkY = 
              CONFIG.kinkYRange[0] + 
              (CONFIG.kinkYRange[1] - CONFIG.kinkYRange[0]) * 
              (0.5 + Math.sin(sectionSeed * Math.PI * 2) * CONFIG.sectionKinkYVariation)
            
            stateRef.current.sectionTargetAngle = 
              CONFIG.angleRange[0] + 
              (CONFIG.angleRange[1] - CONFIG.angleRange[0]) * 
              (0.5 + Math.cos(sectionSeed * Math.PI * 2) * CONFIG.sectionAngleVariation)
            
            stateRef.current.sectionTargetX = 
              Math.sin(sectionSeed * Math.PI * 3) * CONFIG.sectionXVariation
            
            stateRef.current.sectionTransitionStart = performance.now()
            stateRef.current.sectionTransitionProgress = 0
          }
        }
      }
    }

    sections.forEach((section) => {
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: [0.5],
        rootMargin: '-20% 0px -20% 0px',
      })
      observer.observe(section)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [enabled])

  // Main animation loop
  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    if (typeof window === 'undefined') return

    let ctx: CanvasRenderingContext2D | null = null
    try {
      ctx = canvas.getContext('2d')
      if (!ctx) return
    } catch (error) {
      console.warn('SideStripeFold: canvas context error', error)
      return
    }

    isMountedRef.current = true

    // Set up canvas for high DPI
    const dpr = window.devicePixelRatio || 1
    let canvasWidth = 0
    let canvasHeight = 0

    const resizeCanvas = () => {
      try {
        const container = canvas.parentElement
        if (!container) return

        const rect = container.getBoundingClientRect()
        canvasWidth = rect.width
        canvasHeight = rect.height

        canvas.width = canvasWidth * dpr
        canvas.height = canvasHeight * dpr
        ctx?.scale(dpr, dpr)

        canvas.style.width = `${canvasWidth}px`
        canvas.style.height = `${canvasHeight}px`
      } catch (error) {
        console.warn('SideStripeFold: resize error', error)
      }
    }

    resizeCanvas()

    // Initialize state
    stateRef.current.currentKinkY = canvasHeight * 0.5
    stateRef.current.currentAngle = CONFIG.angleRange[0]
    stateRef.current.currentX = 0
    stateRef.current.springCurrent = 0
    stateRef.current.scrollProgress = 0

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(canvas.parentElement!)

    // Animation loop
    const animate = (currentTime: number) => {
      if (!isMountedRef.current || !canvas || !ctx) return

      try {
        // Update spring overshoot
        const springDelta = stateRef.current.springTarget - stateRef.current.springCurrent
        stateRef.current.springVelocity += springDelta * CONFIG.springStiffness
        stateRef.current.springVelocity *= (1 - CONFIG.springDamping)
        stateRef.current.springCurrent += stateRef.current.springVelocity

        // Apply overshoot
        const overshoot = stateRef.current.springCurrent - stateRef.current.scrollProgress
        const overshootAmount = overshoot * CONFIG.overshootAmount

        // Update section transition
        if (stateRef.current.sectionTransitionStart > 0) {
          const elapsed = currentTime - stateRef.current.sectionTransitionStart
          stateRef.current.sectionTransitionProgress = Math.min(
            1,
            elapsed / CONFIG.sectionTransitionDuration
          )

          if (stateRef.current.sectionTransitionProgress >= 1) {
            stateRef.current.sectionTransitionStart = 0
            stateRef.current.sectionTransitionProgress = 0
          }
        }

        // Calculate target values from scroll progress
        const baseProgress = stateRef.current.scrollProgress + overshootAmount
        
        const targetKinkY = lerp(
          CONFIG.kinkYRange[0],
          CONFIG.kinkYRange[1],
          baseProgress
        ) * canvasHeight

        const targetAngle = lerp(
          CONFIG.angleRange[0],
          CONFIG.angleRange[1],
          baseProgress
        )

        const targetX = lerp(
          CONFIG.xShiftRange[0],
          CONFIG.xShiftRange[1],
          baseProgress
        )

        // Apply section transition if active
        let finalKinkY = targetKinkY
        let finalAngle = targetAngle
        let finalX = targetX

        if (stateRef.current.sectionTransitionProgress > 0) {
          const eased = easeOutCubic(stateRef.current.sectionTransitionProgress)
          finalKinkY = lerp(
            targetKinkY,
            stateRef.current.sectionTargetKinkY * canvasHeight,
            eased * 0.3 // Partial blend
          )
          finalAngle = lerp(
            targetAngle,
            stateRef.current.sectionTargetAngle,
            eased * 0.3
          )
          finalX = lerp(
            targetX,
            stateRef.current.sectionTargetX,
            eased * 0.3
          )
        }

        // Smooth interpolation to targets
        stateRef.current.currentKinkY = lerp(
          stateRef.current.currentKinkY,
          finalKinkY,
          0.08
        )
        stateRef.current.currentAngle = lerp(
          stateRef.current.currentAngle,
          finalAngle,
          0.08
        )
        stateRef.current.currentX = lerp(
          stateRef.current.currentX,
          finalX,
          0.08
        )

        // Ensure valid dimensions
        if (canvasWidth <= 0 || canvasHeight <= 0) {
          canvasWidth = CONFIG.width
          canvasHeight = window.innerHeight || 800
        }

        // Clear canvas with black background
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // Calculate polyline points (3 segments: vertical → diagonal → vertical)
        const ribbonCenterX = canvasWidth / 2 + stateRef.current.currentX
        const kinkY = stateRef.current.currentKinkY
        const angle = stateRef.current.currentAngle

        // Top segment (vertical) - start further above for visibility
        const topY = -100
        const topX = ribbonCenterX

        // Kink point (the fold) - more pronounced angle
        const kinkOffset = Math.sin(angle) * (kinkY * CONFIG.kinkSharpness * 0.8)
        const kinkX = ribbonCenterX + kinkOffset

        // Bottom segment (diagonal then vertical) - end further below
        const bottomY = canvasHeight + 100
        const bottomAngle = angle + Math.PI * 0.25
        const bottomOffset = Math.sin(bottomAngle) * ((canvasHeight - kinkY) * CONFIG.kinkSharpness * 0.8)
        const bottomX = ribbonCenterX + bottomOffset

        const polylinePoints = [
          { x: topX, y: topY },
          { x: kinkX, y: kinkY },
          { x: bottomX, y: bottomY },
        ]

        // Calculate total stripe width
        const totalStripeWidth = 
          CONFIG.stripeCount * CONFIG.stripeThickness + 
          (CONFIG.stripeCount - 1) * CONFIG.stripeGap
        const startOffset = -totalStripeWidth / 2

        // Draw stripes
        ctx.fillStyle = '#ffffff' // Pure white

        for (let i = 0; i < CONFIG.stripeCount; i++) {
          const stripeOffset = 
            startOffset + 
            i * (CONFIG.stripeThickness + CONFIG.stripeGap) + 
            CONFIG.stripeThickness / 2

          drawStripe(
            ctx,
            polylinePoints,
            stripeOffset,
            CONFIG.stripeThickness
          )
        }

        animationFrameRef.current = requestAnimationFrame(animate)
      } catch (error) {
        console.warn('SideStripeFold: animation error', error)
        isMountedRef.current = false
      }
    }

    // Start animation loop
    const startTime = performance.now()
    animate(startTime)

    return () => {
      isMountedRef.current = false
      resizeObserver.disconnect()
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`side-stripe-fold-container ${className}`}
      style={{
        position: 'fixed',
        right: `${CONFIG.rightOffset}px`,
        top: 0,
        height: '100vh',
        width: `${CONFIG.width}px`,
        pointerEvents: 'none',
        zIndex: 2, // Visible but behind content (main is z-5)
      }}
    >
      <canvas
        ref={canvasRef}
        className="side-stripe-fold-canvas"
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  )
}

