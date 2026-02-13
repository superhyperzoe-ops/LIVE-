'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface VideoFrameCaptureProps {
  videoSrc: string
  alt: string
  className?: string
}

/**
 * Composant pour capturer et afficher une frame d'une vidéo
 */
export default function VideoFrameCapture({ videoSrc, alt, className = '' }: VideoFrameCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const captureFrame = () => {
      try {
        if (canvas && video && video.readyState >= 2) {
          canvas.width = video.videoWidth || 1920
          canvas.height = video.videoHeight || 1080
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0)
            const dataUrl = canvas.toDataURL('image/png')
            setThumbnailUrl(dataUrl)
            setLoading(false)
          }
        }
      } catch (err) {
        console.error('Error capturing frame:', err)
        setLoading(false)
      }
    }

    const onLoadedData = () => {
      // Aller à 1 seconde dans la vidéo
      video.currentTime = 1
    }

    const onSeeked = () => {
      captureFrame()
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('seeked', onSeeked)

    // Charger la vidéo
    video.load()

    return () => {
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('seeked', onSeeked)
    }
  }, [videoSrc])

  if (thumbnailUrl) {
    return (
      <motion.img
        src={thumbnailUrl}
        alt={alt}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )
  }

  return (
    <>
      <video
        ref={videoRef}
        src={videoSrc}
        className="hidden"
        preload="metadata"
        muted
        playsInline
        crossOrigin="anonymous"
      />
      <canvas ref={canvasRef} className="hidden" />
      {loading && (
        <div className={`${className} bg-gray-800 flex items-center justify-center text-gray-400 animate-pulse`}>
          Chargement...
        </div>
      )}
    </>
  )
}

