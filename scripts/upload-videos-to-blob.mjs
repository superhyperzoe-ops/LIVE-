#!/usr/bin/env node

/**
 * Script pour uploader les vidéos vers Vercel Blob
 * 
 * Usage:
 *   1. Placez toutes les vidéos dans le dossier videos_to_upload/
 *   2. Définissez BLOB_READ_WRITE_TOKEN dans .env.local
 *   3. Exécutez: node scripts/upload-videos-to-blob.mjs
 */

import { put } from '@vercel/blob'
import { readdir, readFile, writeFile } from 'fs/promises'
import { join, basename, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Mapping des noms de fichiers vers les clés de variables d'environnement
const FILE_TO_ENV_KEY = {
  'accueil_final.mp4': 'NEXT_PUBLIC_BLOB_HERO_URL',
  'speech_final.mp4': 'NEXT_PUBLIC_BLOB_SPEECH_URL',
  'text_final.mp4': 'NEXT_PUBLIC_BLOB_TEXT_URL',
  'PSG.mp4': 'NEXT_PUBLIC_BLOB_PSG_URL',
  'Yoyo.mp4': 'NEXT_PUBLIC_BLOB_YOYO_URL',
  'Gastronomy.mp4': 'NEXT_PUBLIC_BLOB_GASTRONOMY_URL',
  'ARTECHOUSE.mp4': 'NEXT_PUBLIC_BLOB_ARTECHOUSE_URL',
  'Palais.mp4': 'NEXT_PUBLIC_BLOB_PALAIS_URL',
  'immersive-reading.mov': 'NEXT_PUBLIC_BLOB_IMMERSIVE_READING_URL',
}

// Charger les variables d'environnement depuis .env.local
async function loadEnv() {
  try {
    const envPath = join(projectRoot, '.env.local')
    const envContent = await readFile(envPath, 'utf-8')
    const env = {}
    
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        }
      }
    }
    
    return env
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Fichier .env.local introuvable!')
      console.error('   Créez .env.local avec BLOB_READ_WRITE_TOKEN')
      process.exit(1)
    }
    throw error
  }
}

async function main() {
  console.log('🚀 Démarrage de l\'upload vers Vercel Blob...\n')

  // Charger les variables d'environnement
  const env = await loadEnv()
  const token = env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    console.error('❌ BLOB_READ_WRITE_TOKEN non trouvé dans .env.local!')
    console.error('   Ajoutez: BLOB_READ_WRITE_TOKEN=your_token_here')
    process.exit(1)
  }

  // Lire les fichiers dans videos_to_upload/
  const videosDir = join(projectRoot, 'videos_to_upload')
  let files
  try {
    files = await readdir(videosDir)
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Dossier ${videosDir} introuvable!`)
      console.error('   Créez le dossier et placez-y vos vidéos')
      process.exit(1)
    }
    throw error
  }

  // Filtrer les fichiers vidéo
  const videoFiles = files.filter(file => {
    const ext = extname(file).toLowerCase()
    return ['.mp4', '.mov', '.MOV', '.MP4'].includes(ext)
  })

  if (videoFiles.length === 0) {
    console.error('❌ Aucune vidéo trouvée dans videos_to_upload/')
    process.exit(1)
  }

  console.log(`📁 ${videoFiles.length} vidéo(s) trouvée(s)\n`)

  const uploadedUrls = {}
  const errors = []

  // Uploader chaque vidéo
  for (const filename of videoFiles) {
    const filePath = join(videosDir, filename)
    const envKey = FILE_TO_ENV_KEY[filename]

    if (!envKey) {
      console.warn(`⚠️  Fichier ignoré (non mappé): ${filename}`)
      continue
    }

    try {
      console.log(`📤 Upload de ${filename}...`)
      
      const fileBuffer = await readFile(filePath)
      
      const blob = await put(filename, fileBuffer, {
        access: 'public',
        token,
        contentType: filename.endsWith('.mp4') || filename.endsWith('.MP4') 
          ? 'video/mp4' 
          : 'video/quicktime',
      })

      uploadedUrls[envKey] = blob.url
      console.log(`✅ ${filename} → ${blob.url}\n`)
    } catch (error) {
      console.error(`❌ Erreur lors de l'upload de ${filename}:`, error.message)
      errors.push({ filename, error: error.message })
    }
  }

  // Afficher le résumé
  console.log('\n' + '='.repeat(60))
  console.log('📊 RÉSUMÉ')
  console.log('='.repeat(60))
  console.log(`✅ ${Object.keys(uploadedUrls).length} vidéo(s) uploadée(s)`)
  if (errors.length > 0) {
    console.log(`❌ ${errors.length} erreur(s)`)
  }

  // Générer le fichier .env.local avec les URLs
  if (Object.keys(uploadedUrls).length > 0) {
    const envPath = join(projectRoot, '.env.local')
    let envContent = await readFile(envPath, 'utf-8').catch(() => '')
    
    // Ajouter ou mettre à jour les URLs
    for (const [key, url] of Object.entries(uploadedUrls)) {
      const regex = new RegExp(`^${key}=.*$`, 'm')
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${url}`)
      } else {
        envContent += `\n${key}=${url}`
      }
    }

    await writeFile(envPath, envContent, 'utf-8')
    console.log(`\n💾 URLs sauvegardées dans .env.local`)
  }

  // Afficher les URLs pour copier-coller dans Vercel Dashboard
  console.log('\n' + '='.repeat(60))
  console.log('📋 VARIABLES D\'ENVIRONNEMENT POUR VERCEL DASHBOARD')
  console.log('='.repeat(60))
  console.log('\nCopiez-collez ces variables dans votre projet Vercel:\n')
  
  for (const [key, url] of Object.entries(uploadedUrls)) {
    console.log(`${key}=${url}`)
  }

  if (errors.length > 0) {
    console.log('\n' + '='.repeat(60))
    console.log('❌ ERREURS')
    console.log('='.repeat(60))
    for (const { filename, error } of errors) {
      console.log(`\n${filename}: ${error}`)
    }
  }

  console.log('\n✨ Terminé!\n')
}

main().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})

