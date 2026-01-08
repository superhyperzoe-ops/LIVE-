'use client'

import { useEffect, useRef } from 'react'

interface SideRibbonWarpProps {
  className?: string
  enabled?: boolean
}

/**
 * SideRibbonWarp - Angular ribbon with parallel stripes
 * Premium tech accent on the right side with irregular movement and section reactions
 */
export default function SideRibbonWarp({ 
  className = '',
  enabled = true,
}: SideRibbonWarpProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timeRef = useRef(0)
  const stateRef = useRef({
    progress: 0,
    activeSection: '',
    eventProgress: 0,
    eventStartTime: 0,
    isEventActive: false,
    targetKinkY: 0,
    targetKinkAngle: 0,
    currentKinkY: 0,
    currentKinkAngle: 0,
    targetRibbonX: 0,
    currentRibbonX: 0,
  })
  const isMountedRef = useRef(false)

  // Configuration parameters
  const CONFIG = {
    // Layout
    bandWidth: 120, // Width of the band (80-160px)
    rightOffset: 24, // Distance from right edge

    // Ribbon structure
    stripeCount: 20, // Number of parallel lines (12-30)
    stripeSpacing: 4, // Spacing between stripes
    stripeWidth: 2.5, // Width of each stripe (thicker)
    segmentCount: 3, // Number of segments in polyline (2-4)
    kinkSharpness: 0.65, // Sharpness of the kink (0-1, higher = sharper)

    // Opacity (more visible)
    baseAlpha: 0.28, // Base opacity (increased for visibility)
    alphaVariation: 0.12, // Opacity variation between stripes
    eventBoost: 0.15, // Alpha boost during section event

    // Movement (irregular but smooth)
    baseSpeed: 0.12, // Base vertical speed (slightly slower)
    irregularSpeedAmount: 0.25, // Amount of speed variation (reduced for smoother)
    noiseScale: 0.0006, // Noise scale for irregular movement (smoother)
    microHoldChance: 0, // Disabled for smoothness
    microBurstChance: 0, // Disabled for smoothness

    // Scroll mapping
    scrollAngleRange: [0.3, 0.7], // Kink angle range (radians)
    scrollPositionRange: [0.0, 0.2], // Horizontal position shift range
    scrollDensityRange: [0.85, 1.15], // Stripe density multiplier

    // Section event
    eventDuration: 1800, // Event duration in ms (1.2-2.0s)
    eventEasing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic

    // Quantization (reduced for smoother movement)
    quantStep: 0.5, // Quantization step for angular snap (smaller = smoother)
  }

  // Smooth interpolation (lerp) - faster for smoother transitions
  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * Math.min(1, factor * 0.12) // Increased from 0.08 to 0.12
  }

  // EaseOutCubic
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3)
  }

  // Deterministic noise function
  const noise = (x: number, t: number): number => {
    const n = Math.sin(x * 12.9898 + t * CONFIG.noiseScale) * 43758.5453
    return (Math.sin(n) + 1) / 2 // Normalize to 0-1
  }

  // Multi-octave noise for irregular movement
  const multiNoise = (t: number): number => {
    const n1 = noise(1, t)
    const n2 = noise(2, t * 0.7) * 0.5
    const n3 = noise(3, t * 0.4) * 0.25
    return (n1 + n2 + n3) / 1.75
  }

  // Quantize angle
  const quantizeAngle = (angle: number): number => {
    return Math.round(angle / CONFIG.quantStep) * CONFIG.quantStep
  }

  // Setup scroll progress tracking
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const onScroll = () => {
      try {
        const main = document.querySelector('main')
        if (!main) return

        const maxScroll = main.scrollHeight - main.clientHeight
        const currentScroll = main.scrollTop
        const progress = maxScroll > 0 ? currentScroll / maxScroll : 0
        stateRef.current.progress = Math.max(0, Math.min(1, progress))
      } catch (error) {
        console.warn('SideRibbonWarp: scroll tracking error', error)
      }
    }

    const main = document.querySelector('main')
    if (main) {
      main.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    }

    return () => {
      if (main) {
        main.removeEventListener('scroll', onScroll as EventListener)
      }
    }
  }, [enabled])

  // Setup IntersectionObserver for section detection
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    const sections = [
      'hero',
      'technology',
      'system',
      'speech-detail',
      'text-detail',
      'moderation',
      'style',
      'gallery',
      'contact',
      'about',
    ]

    const observers: IntersectionObserver[] = []

    sections.forEach((id) => {
      try {
        const element = document.getElementById(id)
        if (element) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                  const newSection = id
                  if (newSection !== stateRef.current.activeSection) {
                    stateRef.current.activeSection = newSection
                    
                    // Trigger reconfiguration event
                    stateRef.current.isEventActive = true
                    stateRef.current.eventProgress = 0
                    stateRef.current.eventStartTime = performance.now()
                    
                    // Set new target configuration
                    const progress = stateRef.current.progress
                    stateRef.current.targetKinkY = 0.3 + Math.random() * 0.4 // 30-70% of canvas height
                    stateRef.current.targetKinkAngle = lerp(
                      CONFIG.scrollAngleRange[0],
                      CONFIG.scrollAngleRange[1],
                      progress + (Math.random() - 0.5) * 0.2
                    )
                    stateRef.current.targetRibbonX = lerp(
                      -CONFIG.scrollPositionRange[1],
                      CONFIG.scrollPositionRange[1],
                      progress
                    ) * CONFIG.bandWidth
                  }
                }
              })
            },
            { threshold: [0, 0.3, 0.5, 0.7, 1] }
          )
          observer.observe(element)
          observers.push(observer)
        }
      } catch (error) {
        console.warn('SideRibbonWarp: IO error', error)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [enabled])

  // Main animation setup
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
      console.warn('SideRibbonWarp: canvas context error', error)
      return
    }

    isMountedRef.current = true

    // Set up canvas for high DPI displays
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
        console.warn('SideRibbonWarp: resize error', error)
      }
    }

    resizeCanvas()

    // Initialize ribbon configuration
    stateRef.current.currentKinkY = canvasHeight * 0.5
    stateRef.current.targetKinkY = canvasHeight * 0.5
    stateRef.current.currentKinkAngle = CONFIG.scrollAngleRange[0]
    stateRef.current.targetKinkAngle = CONFIG.scrollAngleRange[0]
    stateRef.current.currentRibbonX = 0
    stateRef.current.targetRibbonX = 0

    // Animation loop
    const animate = (currentTime: number) => {
      if (!isMountedRef.current || !canvas || !ctx) return

      try {
        timeRef.current = currentTime

        // Update event progress
        if (stateRef.current.isEventActive) {
          const eventElapsed = currentTime - stateRef.current.eventStartTime
          stateRef.current.eventProgress = Math.min(1, eventElapsed / CONFIG.eventDuration)
          
          if (stateRef.current.eventProgress >= 1) {
            stateRef.current.isEventActive = false
            stateRef.current.eventProgress = 0
          }
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        const progress = stateRef.current.progress

        // Calculate scroll-based modifiers
        const densityMultiplier = lerp(
          CONFIG.scrollDensityRange[0],
          CONFIG.scrollDensityRange[1],
          progress
        )
        const targetAngle = lerp(
          CONFIG.scrollAngleRange[0],
          CONFIG.scrollAngleRange[1],
          progress
        )
        const targetX = lerp(
          -CONFIG.scrollPositionRange[1],
          CONFIG.scrollPositionRange[1],
          progress
        ) * CONFIG.bandWidth

        // Update target during event
        if (stateRef.current.isEventActive) {
          const eased = easeOutCubic(stateRef.current.eventProgress)
          stateRef.current.currentKinkY = lerp(
            stateRef.current.currentKinkY,
            stateRef.current.targetKinkY,
            eased * 0.2 // Increased for smoother transition
          )
          stateRef.current.currentKinkAngle = quantizeAngle(
            lerp(
              stateRef.current.currentKinkAngle,
              stateRef.current.targetKinkAngle,
              eased * 0.2 // Increased for smoother transition
            )
          )
          stateRef.current.currentRibbonX = lerp(
            stateRef.current.currentRibbonX,
            stateRef.current.targetRibbonX,
            eased * 0.2 // Increased for smoother transition
          )
        } else {
          // Smooth interpolation to scroll-based targets (faster lerp)
          stateRef.current.currentKinkAngle = quantizeAngle(
            lerp(stateRef.current.currentKinkAngle, targetAngle, 0.05) // Increased from 0.03
          )
          stateRef.current.currentRibbonX = lerp(stateRef.current.currentRibbonX, targetX, 0.05) // Increased from 0.03
        }

        // Irregular vertical movement (noise-based, smooth)
        const noiseValue = multiNoise(currentTime)
        const speedVariation = 1 + (noiseValue - 0.5) * CONFIG.irregularSpeedAmount * 2
        
        // Smooth speed interpolation to avoid jitter
        const effectiveSpeed = CONFIG.baseSpeed * speedVariation
        const kinkYOffset = (currentTime * effectiveSpeed) % (canvasHeight * 1.5) - canvasHeight * 0.25
        const currentKinkY = stateRef.current.currentKinkY + kinkYOffset

        // Ensure kink stays within bounds
        const clampedKinkY = Math.max(canvasHeight * 0.2, Math.min(canvasHeight * 0.8, currentKinkY))

        // Calculate ribbon polyline points
        const ribbonCenterX = CONFIG.bandWidth / 2 + stateRef.current.currentRibbonX
        const kinkAngle = stateRef.current.currentKinkAngle

        // Create polyline with kink (angular ribbon)
        const points: Array<{ x: number; y: number }> = []
        
        // Top point
        const topY = -50 // Start slightly above canvas
        const topX = ribbonCenterX + Math.cos(kinkAngle) * 30 // Slight angle from top
        
        // Kink point (the sharp angle)
        const kinkX = ribbonCenterX + Math.sin(kinkAngle) * (clampedKinkY * CONFIG.kinkSharpness)
        
        // Bottom point
        const bottomY = canvasHeight + 50 // End slightly below canvas
        const bottomX = ribbonCenterX + Math.sin(kinkAngle + Math.PI * 0.3) * ((canvasHeight - clampedKinkY) * CONFIG.kinkSharpness)
        
        points.push({ x: topX, y: topY })
        points.push({ x: kinkX, y: clampedKinkY })
        points.push({ x: bottomX, y: bottomY })

        // Generate parallel stripes by offsetting perpendicular to the polyline
        const stripeCount = Math.floor(CONFIG.stripeCount * densityMultiplier)
        const totalStripeWidth = (stripeCount - 1) * CONFIG.stripeSpacing
        const startOffset = -totalStripeWidth / 2

        // Event alpha boost
        const eventAlphaBoost = stateRef.current.isEventActive
          ? CONFIG.eventBoost * (1 - stateRef.current.eventProgress)
          : 0

        // Calculate perpendicular vectors for each segment
        const perpendiculars: Array<{ x: number; y: number }> = []
        for (let j = 0; j < points.length - 1; j++) {
          const dx = points[j + 1].x - points[j].x
          const dy = points[j + 1].y - points[j].y
          const length = Math.sqrt(dx * dx + dy * dy)
          if (length > 0) {
            // Perpendicular vector (rotate 90 degrees)
            perpendiculars.push({
              x: -dy / length,
              y: dx / length,
            })
          } else {
            perpendiculars.push({ x: 0, y: 1 })
          }
        }

        // Draw stripes
        for (let i = 0; i < stripeCount; i++) {
          const offset = startOffset + i * CONFIG.stripeSpacing
          
          // Calculate stripe alpha with variation
          const alphaVariation = (i % 3) * 0.03 // Subtle variation
          const stripeAlpha = CONFIG.baseAlpha + alphaVariation + eventAlphaBoost

          // Draw polyline for this stripe (offset perpendicular to each segment)
          ctx.beginPath()
          
          for (let j = 0; j < points.length; j++) {
            let offsetX = 0
            let offsetY = 0
            
            if (j === 0) {
              // First point: use first perpendicular
              offsetX = perpendiculars[0].x * offset
              offsetY = perpendiculars[0].y * offset
            } else if (j === points.length - 1) {
              // Last point: use last perpendicular
              offsetX = perpendiculars[perpendiculars.length - 1].x * offset
              offsetY = perpendiculars[perpendiculars.length - 1].y * offset
            } else {
              // Middle points (kink): average of two perpendiculars
              const prevPerp = perpendiculars[j - 1]
              const nextPerp = perpendiculars[j]
              offsetX = ((prevPerp.x + nextPerp.x) / 2) * offset
              offsetY = ((prevPerp.y + nextPerp.y) / 2) * offset
            }

            const x = points[j].x + offsetX
            const y = points[j].y + offsetY

            if (j === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }

          const finalAlpha = Math.max(0.22, Math.min(0.5, stripeAlpha)) // Ensure minimum visibility
          ctx.strokeStyle = `rgba(255, 255, 255, ${finalAlpha})`
          ctx.lineWidth = CONFIG.stripeWidth
          ctx.stroke()
        }

        animationFrameRef.current = requestAnimationFrame(animate)
      } catch (error) {
        console.warn('SideRibbonWarp: animation error', error)
        isMountedRef.current = false
      }
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Handle resize
    const handleResize = () => {
      resizeCanvas()
      // Reset kink Y to center on resize
      if (canvasHeight > 0) {
        stateRef.current.currentKinkY = canvasHeight * 0.5
        stateRef.current.targetKinkY = canvasHeight * 0.5
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      isMountedRef.current = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`side-ribbon-warp-container ${className}`}
      style={{
        position: 'fixed',
        right: `${CONFIG.rightOffset}px`,
        top: 0,
        height: '100vh',
        width: `${CONFIG.bandWidth}px`,
        pointerEvents: 'none',
        zIndex: 0, // Same level as background, behind content
      }}
    >
      <canvas
        ref={canvasRef}
        className="side-ribbon-warp-canvas"
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

