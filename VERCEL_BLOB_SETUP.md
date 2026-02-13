# Configuration Vercel Blob

Ce projet utilise Vercel Blob pour héberger les vidéos et éviter la limite de 100MB de Vercel.

## Configuration

### 1. Créer un Blob Store sur Vercel

1. Allez sur https://vercel.com/dashboard/stores
2. Créez un nouveau Blob Store
3. Copiez le token `BLOB_READ_WRITE_TOKEN`

### 2. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```env
# Token d'accès Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_read_write_token_here
```

**Important** : Ne commitez jamais `.env.local` (déjà dans `.gitignore`)

### 3. Upload des vidéos

Placez toutes les vidéos à uploader dans le dossier `videos_to_upload/` :

```
videos_to_upload/
  ├── video-accueil-live.mov
  ├── speech.MOV
  ├── text.MOV
  ├── PSG.mp4
  ├── Yoyo.mp4
  ├── Gastronomy.mp4
  ├── ARTECHOUSE.mp4
  ├── Palais.mp4
  └── immersive-reading.mov
```

Puis exécutez le script d'upload :

```bash
npm run upload-videos
```

Ou directement :

```bash
node scripts/upload-videos-to-blob.mjs
```

Le script va :
- Uploader toutes les vidéos vers Vercel Blob
- Générer un fichier `.env.local` avec les URLs publiques
- Afficher les URLs pour que vous puissiez les ajouter manuellement dans Vercel Dashboard si besoin

### 4. Configuration Vercel Dashboard

Après l'upload, ajoutez les variables d'environnement suivantes dans votre projet Vercel :

- `BLOB_READ_WRITE_TOKEN` (secret)
- `NEXT_PUBLIC_BLOB_HERO_URL`
- `NEXT_PUBLIC_BLOB_SPEECH_URL`
- `NEXT_PUBLIC_BLOB_TEXT_URL`
- `NEXT_PUBLIC_BLOB_PSG_URL`
- `NEXT_PUBLIC_BLOB_YOYO_URL`
- `NEXT_PUBLIC_BLOB_GASTRONOMY_URL`
- `NEXT_PUBLIC_BLOB_ARTECHOUSE_URL`
- `NEXT_PUBLIC_BLOB_PALAIS_URL`
- `NEXT_PUBLIC_BLOB_IMMERSIVE_READING_URL`

### 5. Fallback local

Si les variables d'environnement Blob ne sont pas définies, le système utilise automatiquement les chemins locaux (`/public`) pour le développement local.

## Utilisation dans le code

```typescript
import { getVideoUrl } from '@/lib/videos'

// Dans un composant
<video src={getVideoUrl('hero')} autoPlay muted loop playsInline />
```

## Mapping des vidéos

| Clé | Fichier source | Usage |
|-----|----------------|-------|
| `hero` | `video-accueil-live.mov` | Hero section |
| `speech` | `speech.MOV` | SystemDetails component |
| `text` | `text.MOV` | TextToVideoDetails component |
| `psg` | `PSG.mp4` | Gallery |
| `yoyo` | `Yoyo.mp4` | Gallery |
| `gastronomy` | `Gastronomy.mp4` | Gallery |
| `artechouse` | `ARTECHOUSE.mp4` | Gallery |
| `palais` | `Palais.mp4` | Gallery |
| `immersive-reading` | `immersive-reading.mov` | Gallery |

