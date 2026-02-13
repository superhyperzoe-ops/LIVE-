/**
 * Utilitaire centralisé pour récupérer les URLs des vidéos depuis Vercel Blob
 * Fallback vers les chemins locaux si BLOB_READ_WRITE_TOKEN n'est pas défini (dev local)
 */

// Mapping des noms logiques vers les noms de fichiers
export type VideoKey =
  | 'hero'
  | 'speech'
  | 'text'
  | 'psg'
  | 'yoyo'
  | 'gastronomy'
  | 'artechouse'
  | 'palais'
  | 'immersive-reading'

// URLs Blob stockées (seront remplies après upload)
// Format: https://[account].public.blob.vercel-storage.com/[path]
const BLOB_URLS: Record<VideoKey, string | null> = {
  hero: process.env.NEXT_PUBLIC_BLOB_HERO_URL || null,
  speech: process.env.NEXT_PUBLIC_BLOB_SPEECH_URL || null,
  text: process.env.NEXT_PUBLIC_BLOB_TEXT_URL || null,
  psg: process.env.NEXT_PUBLIC_BLOB_PSG_URL || null,
  yoyo: process.env.NEXT_PUBLIC_BLOB_YOYO_URL || null,
  gastronomy: process.env.NEXT_PUBLIC_BLOB_GASTRONOMY_URL || null,
  artechouse: process.env.NEXT_PUBLIC_BLOB_ARTECHOUSE_URL || null,
  palais: process.env.NEXT_PUBLIC_BLOB_PALAIS_URL || null,
  'immersive-reading': process.env.NEXT_PUBLIC_BLOB_IMMERSIVE_READING_URL || null,
}

// Mapping vers les chemins locaux (fallback)
const LOCAL_PATHS: Record<VideoKey, string> = {
  hero: '/Videos/accueil_final.mp4',
  speech: '/Videos/speech_final.mp4',
  text: '/Videos/text_final.mp4',
  psg: '/PSG.mp4',
  yoyo: '/Yoyo.mp4',
  gastronomy: '/Gastronomy.mp4',
  artechouse: '/ARTECHOUSE.mp4',
  palais: '/Palais.mp4',
  'immersive-reading': '/immersive-reading.mov',
}

/**
 * Récupère l'URL d'une vidéo depuis Vercel Blob ou fallback local
 * @param key - Clé logique de la vidéo
 * @returns URL de la vidéo (Blob si disponible, sinon local)
 */
export function getVideoUrl(key: VideoKey): string {
  const blobUrl = BLOB_URLS[key]
  
  // Si une URL Blob est définie, l'utiliser
  if (blobUrl) {
    return blobUrl
  }
  
  // Sinon, fallback vers le chemin local
  return LOCAL_PATHS[key]
}

/**
 * Vérifie si une vidéo utilise Vercel Blob
 * @param key - Clé logique de la vidéo
 * @returns true si l'URL Blob est définie
 */
export function isUsingBlob(key: VideoKey): boolean {
  return BLOB_URLS[key] !== null
}

