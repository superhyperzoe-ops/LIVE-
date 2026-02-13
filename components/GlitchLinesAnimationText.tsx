'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface GlitchLinesAnimationTextProps {
  className?: string
}

/**
 * Animation de lignes blanches verticales en zigzag (version Text to Video)
 * - Trois lignes côte à côte
 * - Coudes avec mouvements désynchronisés pour un effet 3D
 * - Effet glitch coloré
 * - Effet infini - les lignes ne disparaissent jamais
 */
export default function GlitchLinesAnimationText({ className = '' }: GlitchLinesAnimationTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration
    const RIGHT_MARGIN_PX = 37.8 // 1cm en pixels (à 96 DPI)
    const LINE_THICKNESS = 3 // Épaisseur de la ligne
    const LINE_GAP = 8 // Écart horizontal entre les lignes
    const MAX_KINKS_ON_SCREEN = 7 // Maximum 7 cassures sur l'écran
    const KINK_COUNT = 1 // Nombre de coudes/angles par segment (angles simples)
    const KINK_AMPLITUDE_BASE = 8 // Amplitude de base du zigzag (simple)
    const KINK_AMPLITUDE_VARIATION = 4 // Variation d'amplitude pour l'irrégularité
    const KINK_SPEED = 0.008 // Vitesse de déplacement des angles
    const VERTICAL_JITTER_SPEED = 0.004 // Vitesse de variation verticale des coudes
    const GLITCH_INTENSITY = 0.2 // Intensité du glitch

    // Hauteur de segment pour avoir max 7 cassures visibles
    const LINE_SEGMENT_HEIGHT = typeof window !== 'undefined'
      ? Math.max(window.innerHeight / (MAX_KINKS_ON_SCREEN / (KINK_COUNT + 1)), 200)
      : 200
    void LINE_SEGMENT_HEIGHT

    let time = 0
    const startTime = Date.now()

    const drawZigzagLine = (
      ctx: CanvasRenderingContext2D,
      points: { x: number; y: number }[],
      currentTime: number,
      lineAlpha: number,
      thicknessMultiplier: number,
      glitchWindow: number
    ) => {
      const glitchDuration = 300
      const whiteDuration = 500
      const cycleDuration = glitchDuration + whiteDuration

      const timeInMs = currentTime * 1000
      const cycleTime = timeInMs % cycleDuration

      let glitchOffsetX = 0
      let glitchIntensity = 0

      if (cycleTime < glitchDuration) {
        const glitchProgress = cycleTime / glitchDuration
        const fastWave = Math.sin(glitchProgress * Math.PI * 20)
        const mediumWave = Math.sin(glitchProgress * Math.PI * 8)
        const slowWave = Math.sin(glitchProgress * Math.PI * 2)

        glitchOffsetX = (fastWave * 1.5) + (mediumWave * 1) + (slowWave * 0.5)
        glitchIntensity = 0.7 + (Math.abs(fastWave) * 0.2)
        glitchIntensity += Math.abs(mediumWave) * 0.1
      }
      glitchIntensity *= glitchWindow

      // Mesurer l'intensité moyenne des coudes pour accentuer la profondeur
      let kinkSum = 0
      let kinkCount = 0
      for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const next = points[i + 1]
        const v1x = prev.x - curr.x
        const v1y = prev.y - curr.y
        const v2x = next.x - curr.x
        const v2y = next.y - curr.y
        const v1Len = Math.hypot(v1x, v1y) || 1
        const v2Len = Math.hypot(v2x, v2y) || 1
        const dot = (v1x * v2x + v1y * v2y) / (v1Len * v2Len)
        const clamped = Math.max(-1, Math.min(1, dot))
        const angle = Math.acos(clamped)
        const kinkIntensity = Math.min(1, Math.abs(Math.PI - angle) / Math.PI)
        kinkSum += kinkIntensity
        kinkCount += 1
      }
      const kinkFactor = kinkCount ? kinkSum / kinkCount : 0

      // Effet de profondeur: la ligne "avance" puis "recule"
      const baseDepthWave = 0.82 + (Math.sin(currentTime * 1.6) * 0.18)
      const depthWave = baseDepthWave * (1 + (kinkFactor * 0.6))
      const lineThickness = LINE_THICKNESS * thicknessMultiplier * (1 + (depthWave - 0.82) * 2.2)

      if (glitchIntensity > 0) {
        ctx.save()
        ctx.strokeStyle = `rgba(255, 0, 128, ${glitchIntensity * lineAlpha * depthWave})`
        ctx.lineWidth = lineThickness
        ctx.globalAlpha = glitchIntensity * lineAlpha * depthWave
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.beginPath()
        ctx.moveTo(points[0].x - glitchOffsetX, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x - glitchOffsetX, points[i].y)
        }
        ctx.stroke()
        ctx.restore()
      }

      if (glitchIntensity > 0) {
        ctx.save()
        ctx.strokeStyle = `rgba(0, 255, 255, ${glitchIntensity * lineAlpha * depthWave})`
        ctx.lineWidth = lineThickness
        ctx.globalAlpha = glitchIntensity * lineAlpha * depthWave
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.beginPath()
        ctx.moveTo(points[0].x + glitchOffsetX, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x + glitchOffsetX, points[i].y)
        }
        ctx.stroke()
        ctx.restore()
      }

      ctx.save()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = lineThickness
      ctx.globalAlpha = 0.95 * lineAlpha * depthWave
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.stroke()
      ctx.restore()

      // Pas de points/cercles sur les coudes
    }

    const animate = () => {
      if (!canvas || !ctx) return

      const width = canvas.offsetWidth || 140
      const height = canvas.offsetHeight || window.innerHeight

      if (width === 0 || height === 0 || canvas.width === 0 || canvas.height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const sectionEl = canvas.closest('section')
      let glitchWindow = 0
      if (sectionEl) {
        const rect = sectionEl.getBoundingClientRect()
        const viewportH = window.innerHeight || 1
        const target = viewportH * 0.5
        const falloff = viewportH * 0.35
        const distance = Math.abs(rect.bottom - target)
        glitchWindow = Math.max(0, 1 - (distance / falloff))
      }

      const maxAmplitude = KINK_AMPLITUDE_BASE + KINK_AMPLITUDE_VARIATION
      const baseXRight = width - RIGHT_MARGIN_PX - (maxAmplitude / 2)
      const baseXMiddle = Math.max(maxAmplitude / 2, baseXRight - LINE_GAP - (LINE_THICKNESS * 2))
      const baseXLeft = Math.max(maxAmplitude / 2, baseXMiddle - LINE_GAP - (LINE_THICKNESS * 2))

      const dynamicSegmentHeight = Math.max(height / (MAX_KINKS_ON_SCREEN / (KINK_COUNT + 1)), 200)
      const segmentsToDraw = Math.ceil(height / dynamicSegmentHeight) + 2

      const lineConfigs = [
        { baseX: baseXRight, phaseOffset: 0, directionBias: 1, alpha: 1, thickness: 1 },
        { baseX: baseXMiddle, phaseOffset: 0, directionBias: 1, alpha: 1, thickness: 1 },
        { baseX: baseXLeft, phaseOffset: 0, directionBias: 1, alpha: 1, thickness: 1 },
      ]

      const previousEndPoints: Array<{ x: number; y: number } | null> = lineConfigs.map(() => null)

      for (let segment = -1; segment < segmentsToDraw; segment++) {
        const segmentStartY = segment * dynamicSegmentHeight
        const segmentHeight = dynamicSegmentHeight / (KINK_COUNT + 1)

        for (let lineIndex = 0; lineIndex < lineConfigs.length; lineIndex++) {
          const line = lineConfigs[lineIndex]
          const points: { x: number; y: number }[] = []

          let startY: number
          let startX: number

          if (previousEndPoints[lineIndex]) {
            startX = previousEndPoints[lineIndex]!.x
            startY = previousEndPoints[lineIndex]!.y
          } else {
            startY = segmentStartY
            startX = line.baseX
          }

          points.push({ x: startX, y: startY })
          let lastY = startY

          for (let i = 0; i <= KINK_COUNT; i++) {
            const yVariationBase = Math.sin((segment * 0.7) + (i * 0.3)) * (segmentHeight * 0.12)
            const yVariationTime = Math.sin((time * VERTICAL_JITTER_SPEED) + (segment * 0.5) + (i * 0.6) + line.phaseOffset) * (segmentHeight * 0.14)
            const yVariation = yVariationBase + yVariationTime
            const proposedY = startY + (i + 1) * segmentHeight + yVariation
            const minStep = segmentHeight * 0.35
            const y = Math.max(proposedY, lastY + minStep)

            const phase = (time * KINK_SPEED) + (i * 0.8) + (segment * 0.4) + line.phaseOffset
            const amplitudeVariation = Math.sin((segment * 0.5) + (i * 0.7) + (time * 0.001) + line.phaseOffset) * KINK_AMPLITUDE_VARIATION
            const chaosPhase = (time * 0.006) + (segment * 0.37) + (i * 0.91) + line.phaseOffset
            const chaosWave = Math.sin(chaosPhase * 1.7) + Math.sin(chaosPhase * 3.3) * 0.6
            const spike = Math.max(0, Math.sin(chaosPhase * 0.9)) ** 3
            const obtuseBoost = 1 + (spike * 1.8) + (Math.abs(chaosWave) * 0.6)
            const currentAmplitude = (KINK_AMPLITUDE_BASE + amplitudeVariation) * obtuseBoost

            const offsetX = Math.sin(phase) * currentAmplitude

            const baseDirection = i % 2 === 0 ? 1 : -1
            const directionVariation = Math.cos((segment * 0.4) + (i * 0.6) + (time * 0.001) + line.phaseOffset) * 0.5
            const directionChaos = Math.sin(chaosPhase * 2.1) * 0.35
            const direction = (baseDirection + directionVariation + directionChaos) * line.directionBias

            const x = line.baseX + (offsetX * direction)
            points.push({ x, y })
            lastY = y
          }

          const totalSegmentHeight = (KINK_COUNT + 1) * segmentHeight
          const endYVariationBase = Math.sin((segment * 0.7) + ((KINK_COUNT + 1) * 0.3)) * (segmentHeight * 0.12)
          const endYVariationTime = Math.sin((time * VERTICAL_JITTER_SPEED) + (segment * 0.5) + ((KINK_COUNT + 1) * 0.6) + line.phaseOffset) * (segmentHeight * 0.14)
          const endYVariation = endYVariationBase + endYVariationTime
          const proposedEndY = startY + totalSegmentHeight + endYVariation
          const endY = Math.max(proposedEndY, lastY + (segmentHeight * 0.35))

          const endPhase = (time * KINK_SPEED) + (KINK_COUNT * 0.8) + (segment * 0.4) + line.phaseOffset
          const endAmplitudeVariation = Math.sin((segment * 0.5) + ((KINK_COUNT + 1) * 0.7) + (time * 0.001) + line.phaseOffset) * KINK_AMPLITUDE_VARIATION
          const endAmplitude = KINK_AMPLITUDE_BASE + endAmplitudeVariation
          const endDirection = (KINK_COUNT % 2 === 0 ? 1 : -1)
            + Math.cos((segment * 0.4) + ((KINK_COUNT + 1) * 0.6) + (time * 0.0005) + line.phaseOffset) * 0.3
          const endPoint = { 
            x: line.baseX + Math.sin(endPhase) * endAmplitude * endDirection, 
            y: endY 
          }
          points.push(endPoint)

          if (endY > -50 && startY < height + 50) {
            const currentTimeInSeconds = (Date.now() - startTime) / 1000
            drawZigzagLine(ctx, points, currentTimeInSeconds, line.alpha, line.thickness, glitchWindow)
          }

          previousEndPoints[lineIndex] = endPoint
        }
      }

      time += 1
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const resizeCanvas = () => {
      if (!canvas) return
      const container = canvas.parentElement
      if (!container) return

      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      const width = Math.max(rect.width, 140)
      const height = Math.max(rect.height, window.innerHeight, 800)

      canvas.width = width * dpr
      canvas.height = height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    resizeCanvas()
    const initTimeout = setTimeout(() => {
      resizeCanvas()
    }, 100)

    window.addEventListener('resize', resizeCanvas)

    const startTimeout = setTimeout(() => {
      animate()
    }, 150)

    return () => {
      clearTimeout(initTimeout)
      clearTimeout(startTimeout)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return null
  }

  return (
    <div 
      className={`absolute right-0 top-0 bottom-0 pointer-events-none ${className}`} 
      style={{ 
        width: '140px', 
        height: '200svh',
        minHeight: '200svh',
        zIndex: 5,
        position: 'absolute'
      }}
    >
      <canvas
        ref={canvasRef}
        width={140}
        height={800}
        className="w-full h-full block"
        style={{ 
          display: 'block', 
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}
