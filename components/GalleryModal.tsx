'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type GalleryItem } from '@/data/gallery'

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  item: GalleryItem | null
}

export default function GalleryModal({ isOpen, onClose, item }: GalleryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current active element
      previousActiveElementRef.current = document.activeElement as HTMLElement
      
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      
      // Focus on modal
      if (modalRef.current) {
        modalRef.current.focus()
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset'
      
      // Return focus to previous element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!item) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            className="relative max-w-[1200px] w-full mx-auto bg-black border border-white/10 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-black/50 border border-white/20 text-white hover:bg-black/70 hover:border-white/30 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-12 p-8 lg:p-12">
              {/* Left column: Text content */}
              <div className="flex flex-col space-y-6">
                {/* Overline */}
                <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-medium">
                  LIVE EVENT • {item.year}
                </div>

                {/* Title */}
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {item.title}
                </h2>

                {/* Tagline */}
                <p className="text-lg text-white/80 font-medium">
                  {item.tagline}
                </p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  {/* Client */}
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-white/50 mb-1">
                      CLIENT
                    </div>
                    <div className="text-sm text-white/90">
                      {item.client}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-white/50 mb-1">
                      LOCATION
                    </div>
                    <div className="text-sm text-white/90">
                      {item.location}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-white/50 mb-1">
                      DATE
                    </div>
                    <div className="text-sm text-white/90">
                      {item.year}
                    </div>
                  </div>

                  {/* Lora */}
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-white/50 mb-1">
                      LORA
                    </div>
                    <div className="text-sm text-white/90">
                      {item.lora}
                    </div>
                  </div>

                  {/* Role - Full width */}
                  <div className="col-span-2">
                    <div className="text-xs uppercase tracking-[0.15em] text-white/50 mb-1">
                      ROLE
                    </div>
                    <div className="text-sm text-white/90">
                      {item.role}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-base text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right column: Media */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[320px] aspect-[9/16] overflow-hidden border border-white/10">
                  {item.mediaType === 'video' || item.mediaSrc.endsWith('.mp4') || item.mediaSrc.endsWith('.mov') || item.mediaSrc.endsWith('.MOV') ? (
                    <video
                      src={item.mediaSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="w-full h-full object-cover gallery-video"
                    />
                  ) : (
                    <img
                      src={item.mediaSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

