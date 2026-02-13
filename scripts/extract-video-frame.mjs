#!/usr/bin/env node

/**
 * Script pour extraire une frame d'une vidéo
 * Nécessite ffmpeg installé
 * 
 * Usage: node scripts/extract-video-frame.mjs <video-file> <output-image>
* Exemple: node scripts/extract-video-frame.mjs public/videos/core/speech_final.mp4 public/speech-thumbnail.png
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const [videoFile, outputFile] = process.argv.slice(2)

if (!videoFile || !outputFile) {
  console.error('Usage: node scripts/extract-video-frame.mjs <video-file> <output-image>')
console.error('Example: node scripts/extract-video-frame.mjs public/videos/core/speech_final.mp4 public/speech-thumbnail.png')
  process.exit(1)
}

const videoPath = join(projectRoot, videoFile)
const outputPath = join(projectRoot, outputFile)

// Extraire une frame au milieu de la vidéo (50% de la durée)
const command = `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${outputPath}"`

console.log(`Extracting frame from ${videoFile}...`)

execAsync(command)
  .then(() => {
    console.log(`✅ Frame extracted successfully to ${outputFile}`)
  })
  .catch((error) => {
    console.error('❌ Error extracting frame:', error.message)
    console.error('\nMake sure ffmpeg is installed:')
    console.error('  macOS: brew install ffmpeg')
    console.error('  Linux: sudo apt-get install ffmpeg')
    console.error('  Windows: Download from https://ffmpeg.org/download.html')
    process.exit(1)
  })

