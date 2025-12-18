export interface GalleryItem {
  id: string
  year: string
  title: string
  tagline: string
  client: string
  location: string
  lora: string
  role: string
  description: string
  mediaSrc: string
  mediaType: 'video' | 'image'
  // Legacy fields for backward compatibility
  imageSrc?: string
  videoSrc?: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'event-1',
    year: '2024',
    title: 'PSG Match Experience',
    tagline: 'Real-time AI visuals for live sports',
    client: 'Paris Saint-Germain',
    location: 'Paris, France',
    lora: 'Sports',
    role: 'AI Visual Generation',
    description:
      'Real-time AI visuals reacting to spoken prompts from the host during a live PSG match experience. The system generated dynamic visual content that responded to the energy and narrative of the match, creating an immersive viewing experience for the audience.',
    mediaSrc: '/PSG.mp4',
    mediaType: 'video',
    imageSrc: '/PSG.mp4',
    videoSrc: '/PSG.mp4',
  },
  {
    id: 'event-2',
    year: '2024',
    title: 'YOYO Club Experience',
    tagline: 'Live AI-generated visuals for nightlife',
    client: 'YOYO Club',
    location: 'Paris, France',
    lora: 'Nightlife',
    role: 'AI Visual Generation',
    description:
      'Live AI-generated visuals illustrating keynotes and audience questions in real time at YOYO Club. The installation transformed spoken words and music into dynamic visual landscapes, enhancing the club atmosphere with responsive, generative art.',
    mediaSrc: '/Yoyo.mp4',
    mediaType: 'video',
    imageSrc: '/Yoyo.mp4',
    videoSrc: '/Yoyo.mp4',
  },
  {
    id: 'event-3',
    year: '2024',
    title: 'ARTECHOUSE',
    tagline: 'Generative installation for art exhibitions',
    client: 'ARTECHOUSE',
    location: 'New York, USA',
    lora: 'Art',
    role: 'AI Visual Generation',
    description:
      'A generative installation creating visuals from audience prompts during an ARTECHOUSE exhibition. Visitors interacted with the system to generate unique visual experiences, blurring the line between spectator and creator in a digital art space.',
    mediaSrc: '/ARTECHOUSE.mp4',
    mediaType: 'video',
    imageSrc: '/ARTECHOUSE.mp4',
    videoSrc: '/ARTECHOUSE.mp4',
  },
  {
    id: 'event-4',
    year: '2024',
    title: 'Gastronomy Experience',
    tagline: 'AI visuals for culinary events',
    client: 'Culinary Events',
    location: 'Paris, France',
    lora: 'Gastronomy',
    role: 'AI Visual Generation',
    description:
      'Visitors speak into a microphone and see their ideas turned into continuous AI video scenes for a gastronomy event. The system translated culinary concepts and descriptions into visual narratives, creating a multisensory dining experience.',
    mediaSrc: '/Gastronomy.mp4',
    mediaType: 'video',
    imageSrc: '/Gastronomy.mp4',
    videoSrc: '/Gastronomy.mp4',
  },
  {
    id: 'event-5',
    year: '2024',
    title: 'Grand Palais',
    tagline: 'Large-scale live AI visuals',
    client: 'Grand Palais',
    location: 'Paris, France',
    lora: 'Cultural',
    role: 'AI Visual Generation',
    description:
      'Événement au Grand Palais avec personnalisation visuelle selon les thèmes et messages clés de la présentation. The installation created large-scale visual experiences that adapted to the content and context of the event, providing a dynamic backdrop for cultural presentations.',
    mediaSrc: '/Palais.mp4',
    mediaType: 'video',
    imageSrc: '/Palais.mp4',
    videoSrc: '/Palais.mp4',
  },
  {
    id: 'event-6',
    year: '2024',
    title: 'Immersive Reading',
    tagline: 'Interactive reading experience',
    client: 'Literary Events',
    location: 'Paris, France',
    lora: 'Literature',
    role: 'AI Visual Generation',
    description:
      'Installation artistique interactive où le public influence les visuels générés par ses interactions vocales lors d\'une expérience de lecture immersive. The system transformed spoken words and literary concepts into evolving visual narratives, creating a unique bridge between text and visual art.',
    mediaSrc: '/Immersive Reading .mov',
    mediaType: 'video',
    imageSrc: '/Immersive Reading .mov',
    videoSrc: '/Immersive Reading .mov',
  },
]

