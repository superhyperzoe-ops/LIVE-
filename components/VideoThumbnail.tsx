'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoThumbnailProps {
  videoSrc: string
  alt: string
  className?: string
}

/**
 * Composant pour capturer et afficher une frame d'une vidéo
 * Utilisé comme fallback si l'image statique n'existe pas
 */
export default function VideoThumbnail({ videoSrc, alt, className = '' }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const captureFrame = () => {
      try {
        // Aller à 1 seconde dans la vidéo
        video.currentTime = 1
      } catch (err) {
        console.error('Error setting video time:', err)
        setError(true)
      }
    }

    const onLoadedData = () => {
      try {
        if (canvas && video) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0)
            const dataUrl = canvas.toDataURL('image/png')
            setThumbnailUrl(dataUrl)
          }
        }
      } catch (err) {
        console.error('Error capturing frame:', err)
        setError(true)
      }
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('seeked', onLoadedData)

    // Essayer de charger la vidéo
    video.load()
    captureFrame()

    return () => {
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('seeked', onLoadedData)
    }
  }, [videoSrc])

  // Si on a une thumbnail, l'afficher
  if (thumbnailUrl) {
    return <img src={thumbnailUrl} alt={alt} className={className} />
  }

  // Sinon, afficher la vidéo (cachée) et le canvas
  return (
    <>
      <video
        ref={videoRef}
        src={videoSrc}
        className="hidden"
        preload="metadata"
        muted
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" />
      {error ? (
        <div className={`${className} bg-gray-800 flex items-center justify-center text-gray-400`}>
          Image non disponible
        </div>
      ) : (
        <div className={`${className} bg-gray-800 animate-pulse`} />
      )}
    </>
  )
}

