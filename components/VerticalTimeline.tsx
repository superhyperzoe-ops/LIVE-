'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useSpring, Variants } from 'framer-motion'

interface TimelineItem {
  id: string
  content: React.ReactNode
}

interface VerticalTimelineProps {
  items: TimelineItem[]
  className?: string
}

const bulletVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: 'easeOut' } 
  },
}

export default function VerticalTimeline({ items, className = '' }: VerticalTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [dotPositions, setDotPositions] = useState<number[]>([])

  // Scroll progress for the timeline line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Calculate dot positions and track active item
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const contentColumn = container.querySelector('[data-content-column]') as HTMLElement
      if (!contentColumn) return

      // Check if all refs are ready
      const allRefsReady = itemRefs.current.every((ref, index) => {
        if (index >= items.length) return true
        return ref !== null
      })

      if (!allRefsReady) return

      const contentRect = contentColumn.getBoundingClientRect()
      const contentTop = contentRect.top
      const contentHeight = contentRect.height

      if (contentHeight === 0) return

      const positions: number[] = []
      let newActiveIndex = 0
      let minDistance = Infinity

      itemRefs.current.forEach((ref, index) => {
        if (!ref || index >= items.length) return

        const rect = ref.getBoundingClientRect()
        const itemTop = rect.top
        const itemCenter = rect.top + rect.height / 2
        
        // Calculate position relative to content column
        const relativeTop = itemTop - contentTop
        const percentage = (relativeTop / contentHeight) * 100

        positions.push(Math.max(0, Math.min(100, percentage)))

        // Find the item closest to the center of the viewport
        const viewportCenter = window.innerHeight / 2
        const distance = Math.abs(itemCenter - viewportCenter)

        if (distance < minDistance) {
          minDistance = distance
          newActiveIndex = index
        }
      })

      if (positions.length === items.length) {
        setDotPositions(positions)
        setActiveIndex(newActiveIndex)
      }
    }

    // Initial calculation after a delay to ensure layout is ready
    const timeoutId = setTimeout(updatePositions, 200)
    // Also try after a longer delay in case of slow rendering
    const timeoutId2 = setTimeout(updatePositions, 500)
    
    window.addEventListener('scroll', updatePositions, { passive: true })
    window.addEventListener('resize', updatePositions)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(timeoutId2)
      window.removeEventListener('scroll', updatePositions)
      window.removeEventListener('resize', updatePositions)
    }
  }, [items])

  // Calculate active dot Y position
  const activeDotY = dotPositions[activeIndex] ?? 0

  return (
    <div ref={containerRef} className={`grid grid-cols-[auto,1fr] gap-6 ${className}`}>
      {/* Timeline column (left) */}
      <div className="relative flex justify-center pt-1 pb-1" data-timeline-column>
          {/* Vertical line container */}
        <div className="relative w-px" style={{ minHeight: 'calc(100% - 0.5rem)' }}>
          {/* Base line (gray) */}
          <div className="absolute inset-0 w-px bg-neutral-700" />
          
          {/* Filled portion (white) */}
          <motion.div
            className="absolute left-0 top-0 w-px bg-white origin-top"
            style={{ 
              scaleY: progress,
            }}
          />

          {/* Fixed dots for each item */}
          {items.map((item, index) => {
            const position = dotPositions[index] ?? 0
            return (
              <div
                key={item.id}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: `${position}%` }}
              >
                <div className="h-3 w-3 rounded-full border border-white bg-black" />
              </div>
            )
          })}

          {/* Active dot (luminous) */}
          {dotPositions.length > 0 && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.8)] z-20"
              style={{ 
                top: `${activeDotY}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
              }}
            />
          )}
        </div>
      </div>

      {/* Content column (right) */}
      <div className="space-y-4" data-content-column>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            variants={bulletVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="text-lg leading-relaxed text-gray-300"
          >
            {item.content}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

