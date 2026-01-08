'use client'

import { useEffect, useRef } from 'react'

interface TensionRibbonProps {
  className?: string
}

/**
 * Hypnotic Scanline Field Animation
 * Premium tech background with quantized noise-driven segmented lines
 */
export default function TensionRibbon({ className = '' }: TensionRibbonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timeRef = useRef(0)
  const scrollProgressRef = useRef(0)

  // Configuration parameters
  const CONFIG = {
    // Zone dimensions and breathing
    zoneWidthBase: 280, // Base width of active zone
    zoneWidthBreath: 0.15, // Breathing amplitude (±15%)
    zoneXOffset: 40, // Distance from right edge (20-60px)
    activeHeightBase: 0.85, // Base height as fraction of canvas (85%)
    activeHeightBreath: 0.12, // Breathing amplitude (±12%)
    breathPeriod: 8000, // Breathing period in ms (6-12s)

    // Line configuration
    lineCount: 35, // Number of vertical lines
    gap: 4, // Gap between lines in pixels
    segmentMin: 4, // Minimum segment length
    segmentMax: 24, // Maximum segment length
    lengthSteps: [4, 8, 12, 16, 24], // Quantized length steps

    // Movement and speed
    baseSpeed: 0.3, // Base vertical scan speed
    breathSpeedAmount: 0.25, // Speed variation from breathing
    scanSpeed: 0.4, // Scan pulse speed
    scanWidth: 80, // Scan pulse width in pixels
    scanBoost: 0.15, // Opacity boost from scan pulse

    // Noise and quantization
    quantStep: 3, // Y position quantization step (2-3px)
    noiseScale: 0.02, // Spatial noise scale
    noiseTimeScale: 0.0003, // Temporal noise scale

    // Opacity levels (quantized)
    opacityLevels: [0.15, 0.25, 0.35, 0.45], // 3-4 opacity levels

    // Scroll effects
    scrollDensityMultiplier: 1.3, // Density increase with scroll
    scrollPulseMultiplier: 1.4, // Pulse intensity increase with scroll
    scrollBreathMultiplier: 1.2, // Breathing amplitude increase with scroll
  }

  // Simple 2D noise function (Perlin-like)
  const noise = (x: number, y: number, t: number): number => {
    const n = Math.sin(x * CONFIG.noiseScale + t) * 43758.5453
    const m = Math.sin(y * CONFIG.noiseScale * 0.7 + t * 1.3) * 23421.631
    return (Math.sin(n + m) + 1) / 2 // Normalize to 0-1
  }

  // Quantize value to steps
  const quantize = (value: number, steps: number[]): number => {
    let closest = steps[0]
    let minDiff = Math.abs(value - steps[0])
    for (const step of steps) {
      const diff = Math.abs(value - step)
      if (diff < minDiff) {
        minDiff = diff
        closest = step
      }
    }
    return closest
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set up canvas for high DPI displays
    const dpr = window.devicePixelRatio || 1
    let canvasWidth = 0
    let canvasHeight = 0

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvasWidth = rect.width
      canvasHeight = rect.height
      
      canvas.width = canvasWidth * dpr
      canvas.height = canvasHeight * dpr
      ctx.scale(dpr, dpr)
      
      canvas.style.width = `${canvasWidth}px`
      canvas.style.height = `${canvasHeight}px`
    }

    resizeCanvas()

    // Calculate scroll progress for this section
    const updateScrollProgress = () => {
      const section = canvas.closest('section')
      if (!section) {
        scrollProgressRef.current = 0
        return
      }

      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const sectionTop = rect.top
      const sectionHeight = rect.height
      
      if (sectionTop > viewportHeight) {
        scrollProgressRef.current = 0
      } else if (sectionTop + sectionHeight < 0) {
        scrollProgressRef.current = 1
      } else {
        scrollProgressRef.current = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / (viewportHeight + sectionHeight)))
      }
    }

    // Pre-calculate line X positions (relative to zone)
    const linePositions: number[] = []
    const totalGapWidth = (CONFIG.lineCount - 1) * CONFIG.gap
    
    for (let i = 0; i < CONFIG.lineCount; i++) {
      const x = i * CONFIG.gap
      linePositions.push(x)
    }

    // Animation loop
    const animate = (currentTime: number) => {
      if (!canvas || !ctx) return

      timeRef.current = currentTime
      updateScrollProgress()

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Calculate breathing (zone dimensions)
      const breathPhase = (currentTime / CONFIG.breathPeriod) * Math.PI * 2
      const breathAmount = Math.sin(breathPhase)
      const scrollBreathMultiplier = 1 + scrollProgressRef.current * (CONFIG.scrollBreathMultiplier - 1)
      
      const activeWidth = CONFIG.zoneWidthBase * (1 + breathAmount * CONFIG.zoneWidthBreath * scrollBreathMultiplier)
      const activeHeight = canvasHeight * CONFIG.activeHeightBase * (1 + breathAmount * CONFIG.activeHeightBreath * scrollBreathMultiplier)
      
      // Zone center position
      const zoneCenterX = canvasWidth - CONFIG.zoneXOffset - activeWidth / 2
      const zoneCenterY = canvasHeight / 2
      const zoneLeft = canvasWidth - CONFIG.zoneXOffset - activeWidth
      const zoneRight = canvasWidth - CONFIG.zoneXOffset

      // Calculate scan speed with breathing
      const speedBreath = 1 + Math.sin(breathPhase * 0.7) * CONFIG.breathSpeedAmount
      const effectiveSpeed = CONFIG.baseSpeed * speedBreath
      const scanOffset = (currentTime * effectiveSpeed) % (CONFIG.quantStep * 10)

      // Scan pulse position
      const scanPulseY = (currentTime * CONFIG.scanSpeed) % (canvasHeight + CONFIG.scanWidth)

      // Scroll modifiers
      const densityModifier = 1 + scrollProgressRef.current * (CONFIG.scrollDensityMultiplier - 1)
      const pulseModifier = 1 + scrollProgressRef.current * (CONFIG.scrollPulseMultiplier - 1)

      // Draw segments for each line
      for (let lineIdx = 0; lineIdx < CONFIG.lineCount; lineIdx++) {
        const lineX = zoneLeft + linePositions[lineIdx]
        
        // Skip if line is outside zone
        if (lineX < 0 || lineX > canvasWidth) continue

        // Generate segments using noise
        const maxSegments = Math.floor(activeHeight / CONFIG.quantStep) * densityModifier
        
        for (let segIdx = 0; segIdx < maxSegments; segIdx++) {
          const noiseY = segIdx * CONFIG.quantStep
          const noiseX = lineX
          const noiseT = currentTime * CONFIG.noiseTimeScale
          
          // Sample noise for density, length, and offset
          const densityNoise = noise(noiseX, noiseY, noiseT)
          const lengthNoise = noise(noiseX * 1.3, noiseY * 0.8, noiseT * 0.9)
          const offsetNoise = noise(noiseX * 0.7, noiseY * 1.2, noiseT * 1.1)
          const opacityNoise = noise(noiseX * 0.5, noiseY * 1.5, noiseT * 0.7)

          // Skip segment based on density (probability)
          if (densityNoise < 0.4) continue

          // Quantize Y position
          const baseY = zoneCenterY - activeHeight / 2 + noiseY + scanOffset
          const quantizedY = Math.floor(baseY / CONFIG.quantStep) * CONFIG.quantStep
          
          // Add quantized vertical offset
          const offsetAmount = (offsetNoise - 0.5) * CONFIG.quantStep * 2
          const quantizedOffset = Math.round(offsetAmount / CONFIG.quantStep) * CONFIG.quantStep
          const segmentY = quantizedY + quantizedOffset

          // Quantize segment length
          const rawLength = CONFIG.segmentMin + (CONFIG.segmentMax - CONFIG.segmentMin) * lengthNoise
          const quantizedLength = quantize(rawLength, CONFIG.lengthSteps)

          // Calculate mask alpha (fade based on distance from zone center)
          const distFromCenterX = Math.abs(lineX - zoneCenterX) / (activeWidth / 2)
          const distFromCenterY = Math.abs(segmentY - zoneCenterY) / (activeHeight / 2)
          const fadeX = Math.max(0, 1 - distFromCenterX)
          const fadeY = Math.max(0, 1 - distFromCenterY)
          const baseMaskAlpha = fadeX * fadeY

          // Quantize opacity
          const rawOpacity = opacityNoise
          const opacityStep = Math.floor(rawOpacity * CONFIG.opacityLevels.length)
          const quantizedOpacity = CONFIG.opacityLevels[Math.min(opacityStep, CONFIG.opacityLevels.length - 1)]

          // Scan pulse effect
          const distFromPulse = Math.abs(segmentY - scanPulseY)
          const pulseEffect = distFromPulse < CONFIG.scanWidth 
            ? (1 - distFromPulse / CONFIG.scanWidth) * CONFIG.scanBoost * pulseModifier
            : 0

          // Final opacity with mask and pulse
          const finalOpacity = quantizedOpacity * baseMaskAlpha + pulseEffect

          // Draw segment if visible and within bounds
          if (finalOpacity > 0.01 && segmentY >= 0 && segmentY < canvasHeight) {
            const segmentStartY = segmentY
            const segmentEndY = Math.min(segmentY + quantizedLength, canvasHeight)
            
            if (segmentEndY > segmentStartY) {
              ctx.beginPath()
              ctx.moveTo(lineX, segmentStartY)
              ctx.lineTo(lineX, segmentEndY)
              ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, finalOpacity)})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Event listeners
    const handleScroll = () => {
      updateScrollProgress()
    }

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`tension-ribbon ${className}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

