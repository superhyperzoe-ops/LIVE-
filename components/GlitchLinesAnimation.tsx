'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface GlitchLinesAnimationProps {
  className?: string
  zIndex?: number
}

/**
 * Animation d'une ligne blanche verticale en zigzag
 * - Ligne qui traverse l'écran verticalement
 * - Cassée par plusieurs angles (coudes)
 * - Les angles se déplacent pour créer un zigzag mouvant
 * - Effet glitch coloré
 * - Effet infini - la ligne ne disparaît jamais
 */
export default function GlitchLinesAnimation({ className = '', zIndex = 5 }: GlitchLinesAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [enabled, setEnabled] = useState(false)
  const isPrimaryRef = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if ((window as any).__glitchLinesMounted) return
    ;(window as any).__glitchLinesMounted = true
    isPrimaryRef.current = true
    setEnabled(true)
    return () => {
      if (isPrimaryRef.current) {
        ;(window as any).__glitchLinesMounted = false
      }
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration
    const RIGHT_MARGIN_CM = 1 // Marge de 1cm depuis le bord droit
    const RIGHT_MARGIN_PX = 37.8 // 1cm en pixels (à 96 DPI)
    const LINE_THICKNESS = 4 // Épaisseur de la ligne
    const LINE_GAP = 22 // Écart horizontal entre les lignes
    const MAX_KINKS_ON_SCREEN = 7 // Maximum 7 cassures sur l'écran
    const KINK_COUNT = 1 // Nombre de coudes/angles par segment (angles simples)
    const KINK_AMPLITUDE_BASE = 8 // Amplitude de base du zigzag (plus simple)
    const KINK_AMPLITUDE_VARIATION = 4 // Variation d'amplitude pour l'irrégularité (réduite)
    const KINK_SPEED = 0.008 // Vitesse de déplacement des angles (augmentée pour mouvement plus visible)
    const IRREGULARITY_OFFSET = 0.8 // Facteur d'irrégularité dans la position des angles
    const GLITCH_INTENSITY = 0.2 // Intensité du glitch
    // Calculer la hauteur de segment pour avoir max 7 cassures sur l'écran
    // Si on a 2 angles par segment, et qu'on veut max 7 cassures, on a besoin de ~3.5 segments sur l'écran
    // Donc chaque segment doit faire environ window.innerHeight / 3.5
    const LINE_SEGMENT_HEIGHT = typeof window !== 'undefined' ? Math.max(window.innerHeight / (MAX_KINKS_ON_SCREEN / (KINK_COUNT + 1)), 200) : 200
    const GLITCH_COLORS = [
      '#00ffff', // Cyan
      '#ff00ff', // Magenta
      '#ffff00', // Yellow
      '#00ff00', // Green
    ]

    const globalStart = (window as any).__glitchLinesStartTime ?? performance.now()
    ;(window as any).__glitchLinesStartTime = globalStart

    // Fonction pour dessiner un segment de ligne en zigzag avec effet glitch (rouge et cyan)
    const drawZigzagLine = (
      ctx: CanvasRenderingContext2D,
      points: { x: number; y: number }[],
      frameTime: number,
      baseX: number,
      currentTime: number
    ) => {
      // Calculer l'offset de glitch basé sur le temps
      // Cycle : 300ms de glitch continu → 500ms blanc → répétition
      const glitchDuration = 300 // Durée du glitch en millisecondes
      const whiteDuration = 500 // Durée sans glitch (ligne blanche) en millisecondes
      const cycleDuration = glitchDuration + whiteDuration // 800ms total
      
      const timeInMs = currentTime * 1000 // Convertir secondes en millisecondes
      const cycleTime = timeInMs % cycleDuration
      
      let glitchOffsetX = 0
      let glitchIntensity = 0

      // Vérifier si on est dans la phase de glitch (0-300ms) ou blanche (300-800ms)
      if (cycleTime < glitchDuration) {
        // Phase de glitch continu et fluide (300ms)
        const glitchProgress = cycleTime / glitchDuration // 0 à 1
        
        // Créer un effet de glitch fluide et continu avec des variations sinusoïdales
        // Utiliser plusieurs fréquences pour un effet plus riche et moins saccadé
        const fastWave = Math.sin(glitchProgress * Math.PI * 20) // Vague rapide
        const mediumWave = Math.sin(glitchProgress * Math.PI * 8) // Vague moyenne
        const slowWave = Math.sin(glitchProgress * Math.PI * 2) // Vague lente
        
        // Combiner les vagues pour un effet fluide et varié
        glitchOffsetX = (fastWave * 1.5) + (mediumWave * 1) + (slowWave * 0.5)
        
        // Intensité fluide qui varie entre 0.7 et 0.9
        glitchIntensity = 0.7 + (Math.abs(fastWave) * 0.2)
        
        // Ajouter des variations d'intensité basées sur les autres vagues
        glitchIntensity += Math.abs(mediumWave) * 0.1
      } else {
        // Phase blanche (500ms) - pas de glitch
        glitchOffsetX = 0
        glitchIntensity = 0
      }

      // Dessiner la trace rouge (décalée vers la gauche)
      if (glitchIntensity > 0) {
        ctx.save()
        ctx.strokeStyle = `rgba(255, 0, 128, ${glitchIntensity})`
        ctx.lineWidth = LINE_THICKNESS
        ctx.globalAlpha = glitchIntensity
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

      // Dessiner la trace cyan (décalée vers la droite)
      if (glitchIntensity > 0) {
        ctx.save()
        ctx.strokeStyle = `rgba(0, 255, 255, ${glitchIntensity})`
        ctx.lineWidth = LINE_THICKNESS
        ctx.globalAlpha = glitchIntensity
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

      // Dessiner la ligne principale blanche
      ctx.save()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = LINE_THICKNESS
      ctx.globalAlpha = 0.95
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      
      ctx.stroke()
      ctx.restore()
    }

    // Fonction d'animation
    const animate = () => {
      if (!canvas || !ctx) return

      // Utiliser les dimensions CSS (avant DPR scale)
      const width = canvas.offsetWidth || 140
      const height = canvas.offsetHeight || window.innerHeight

      // S'assurer que le canvas a des dimensions valides
      if (width === 0 || height === 0 || canvas.width === 0 || canvas.height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // Effacer le canvas
      const viewportH = window.innerHeight || 0
      const heroEl = document.getElementById('hero')
      const footerEl = document.getElementById('footer-section')
      const heroRect = heroEl ? heroEl.getBoundingClientRect() : null
      const footerRect = footerEl ? footerEl.getBoundingClientRect() : null
      const heroThreshold = viewportH * 0.2
      const footerThreshold = viewportH * 0.2
      const heroVisible = !!heroRect && heroRect.bottom > heroThreshold && heroRect.top < (viewportH - heroThreshold)
      const footerVisible = !!footerRect && footerRect.bottom > footerThreshold && footerRect.top < (viewportH - footerThreshold)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (heroVisible || footerVisible) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // Synchroniser la trame avec la position de la section pour un raccord fluide
      const mainEl = document.querySelector('main')
      const scrollTop = mainEl instanceof HTMLElement ? mainEl.scrollTop : window.scrollY

      // Position X de base des lignes - 1cm du bord droit pour la première
      // On soustrait la marge droite et la moitié de l'amplitude max pour que même au maximum du zigzag, la ligne reste à 1cm du bord
      const maxAmplitude = KINK_AMPLITUDE_BASE + KINK_AMPLITUDE_VARIATION
      const baseXRight = width - RIGHT_MARGIN_PX - (maxAmplitude / 2)
      const baseXMiddle = Math.max(maxAmplitude / 2, baseXRight - LINE_GAP - (LINE_THICKNESS * 2))
      const baseXLeft = Math.max(maxAmplitude / 2, baseXMiddle - LINE_GAP - (LINE_THICKNESS * 2))

      // Calculer la hauteur de segment dynamique basée sur la hauteur de l'écran
      // Pour avoir max 7 cassures sur l'écran avec KINK_COUNT angles par segment
      const dynamicSegmentHeight = Math.max(window.innerHeight / (MAX_KINKS_ON_SCREEN / (KINK_COUNT + 1)), 200)
      const scrollFactor = 0.8
      const sectionOffset = (scrollTop * scrollFactor) % dynamicSegmentHeight

      // Créer plusieurs segments de ligne pour un effet infini
      const segmentsToDraw = Math.ceil(height / dynamicSegmentHeight) + 2

      // Dessiner plusieurs segments de ligne qui se suivent de manière continue
      let previousEndPoint: { x: number; y: number } | null = null
      
      const time = (performance.now() - globalStart) / 16.67

      for (let segment = -1; segment < segmentsToDraw; segment++) {
        // Inverser le signe pour que la ligne avance de haut en bas
        const segmentStartY = segment * dynamicSegmentHeight + sectionOffset
        const segmentHeight = dynamicSegmentHeight / (KINK_COUNT + 1)

        // Calculer les points du zigzag pour ce segment
        const points: { x: number; y: number }[] = []

        // Point de départ - utiliser le point de fin du segment précédent pour continuité parfaite
        let startY: number
        let startX: number
        
        if (previousEndPoint) {
          // Connecter exactement au point de fin du segment précédent
          startX = previousEndPoint.x
          startY = previousEndPoint.y
        } else {
          // Premier segment
          startY = segmentStartY
          startX = baseXRight
        }
        
        points.push({ x: startX, y: startY })

        // Créer les coudes/angles qui se déplacent avec irrégularité
        let lastY = startY
        for (let i = 0; i <= KINK_COUNT; i++) {
          // Position Y avec irrégularité
          const yVariationBase = Math.sin((segment * 0.7) + (i * 0.3)) * (segmentHeight * 0.12)
          const yVariationTime = Math.sin((time * 0.004) + (segment * 0.5) + (i * 0.6)) * (segmentHeight * 0.14)
          const yVariation = yVariationBase + yVariationTime
          const proposedY = startY + (i + 1) * segmentHeight + yVariation
          const minStep = segmentHeight * 0.35
          const y = Math.max(proposedY, lastY + minStep)
          
          // Calculer le déplacement horizontal de l'angle (zigzag mouvant)
          // Chaque angle a sa propre phase pour un mouvement indépendant et visible
          const phase = (time * KINK_SPEED) + (i * 0.8) + (segment * 0.4)
          
          // Amplitude variable pour chaque angle (irrégularité) avec variation temporelle
          const amplitudeVariation = Math.sin((segment * 0.5) + (i * 0.7) + (time * 0.001)) * KINK_AMPLITUDE_VARIATION
          const chaosPhase = (time * 0.006) + (segment * 0.37) + (i * 0.91)
          const chaosWave = Math.sin(chaosPhase * 1.7) + Math.sin(chaosPhase * 3.3) * 0.6
          const spike = Math.max(0, Math.sin(chaosPhase * 0.9)) ** 3
          const obtuseBoost = 1 + (spike * 1.8) + (Math.abs(chaosWave) * 0.6)
          const currentAmplitude = (KINK_AMPLITUDE_BASE + amplitudeVariation) * obtuseBoost
          
          // Mouvement horizontal plus dynamique avec oscillation
          const offsetX = Math.sin(phase) * currentAmplitude
          
          // Alterner la direction du zigzag avec irrégularité et mouvement temporel
          const baseDirection = i % 2 === 0 ? 1 : -1
          const directionVariation = Math.cos((segment * 0.4) + (i * 0.6) + (time * 0.001)) * 0.5
          const directionChaos = Math.sin(chaosPhase * 2.1) * 0.35
          const direction = baseDirection + directionVariation + directionChaos
          
          const x = baseXRight + (offsetX * direction)
          
          points.push({ x, y })
          lastY = y
        }

        // Point d'arrivée - sera connecté au segment suivant (avec irrégularité)
        // Calculer la position Y finale en partant de la position Y de départ
        const totalSegmentHeight = (KINK_COUNT + 1) * segmentHeight
        const endYVariationBase = Math.sin((segment * 0.7) + ((KINK_COUNT + 1) * 0.3)) * (segmentHeight * 0.12)
        const endYVariationTime = Math.sin((time * 0.004) + (segment * 0.5) + ((KINK_COUNT + 1) * 0.6)) * (segmentHeight * 0.14)
        const endYVariation = endYVariationBase + endYVariationTime
        const proposedEndY = startY + totalSegmentHeight + endYVariation
        const endY = Math.max(proposedEndY, lastY + (segmentHeight * 0.35))
        const endPhase = (time * KINK_SPEED) + (KINK_COUNT * 0.8) + (segment * 0.4)
        const endAmplitudeVariation = Math.sin((segment * 0.5) + ((KINK_COUNT + 1) * 0.7) + (time * 0.001)) * KINK_AMPLITUDE_VARIATION
        const endAmplitude = KINK_AMPLITUDE_BASE + endAmplitudeVariation
        const endDirection = (KINK_COUNT % 2 === 0 ? 1 : -1) + Math.cos((segment * 0.4) + ((KINK_COUNT + 1) * 0.6) + (time * 0.0005)) * 0.3
        const endPoint = { 
          x: baseXRight + Math.sin(endPhase) * endAmplitude * endDirection, 
          y: endY 
        }
        points.push(endPoint)

        // Dessiner ce segment seulement s'il est visible dans le canvas
        if (endY > -50 && startY < height + 50) {
          const currentTimeInSeconds = (performance.now() - globalStart) / 1000
          // Ligne de droite
          drawZigzagLine(ctx, points, time, baseXRight, currentTimeInSeconds)
          // Ligne du milieu (décalée)
          const middlePoints = points.map((point) => ({
            x: point.x - (baseXRight - baseXMiddle),
            y: point.y,
          }))
          drawZigzagLine(ctx, middlePoints, time, baseXMiddle, currentTimeInSeconds)
          // Ligne de gauche (décalée)
          const leftPoints = points.map((point) => ({
            x: point.x - (baseXRight - baseXLeft),
            y: point.y,
          }))
          drawZigzagLine(ctx, leftPoints, time, baseXLeft, currentTimeInSeconds)
        }

        // Sauvegarder le point de fin pour le segment suivant
        previousEndPoint = endPoint
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Redimensionner le canvas
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

    // Initialiser immédiatement
    resizeCanvas()
    
    // Réinitialiser après un court délai pour s'assurer que le DOM est prêt
    const initTimeout = setTimeout(() => {
      resizeCanvas()
    }, 100)
    
    window.addEventListener('resize', resizeCanvas)
    
    // Démarrer l'animation après un court délai
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
  }, [enabled, prefersReducedMotion])

  if (prefersReducedMotion || !enabled) {
    return null
  }

  return (
    <div 
      className={`fixed right-0 top-0 pointer-events-none ${className}`} 
      style={{ 
        width: '140px', 
        height: '100svh',
        minHeight: '100svh',
        zIndex,
        position: 'fixed'
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
