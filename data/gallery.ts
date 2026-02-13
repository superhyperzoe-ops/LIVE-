export interface GalleryItem {
  id: string
  year: string
  title: string
  titleFr: string
  tagline: string
  taglineFr: string
  client: string
  location: string
  lora: string
  role: string
  description: string
  descriptionFr: string
  mediaSrc: string
  mediaType: 'video' | 'image'
  // Legacy fields for backward compatibility
  imageSrc?: string
  videoSrc?: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'gallery-1',
    year: 'June 2025',
    title: 'Booth Experience',
    titleFr: 'Expérience Booth',
    tagline: 'Interactive Real-time AI visuals for tech booth',
    taglineFr: 'Visuels IA interactifs en temps réel pour un stand tech',
    client: 'Microsoft',
    location: 'Vivatech, Paris, France',
    lora: 'Microsoft Artistic Direction',
    role: 'Text to video',
    description:
      'During Viva Technology, the experience was deployed on the Microsoft booth over five consecutive days. QR codes placed next to the screen allowed visitors to submit text-to-image prompts in real time. A dedicated visual style was designed to match the booth’s artistic direction, enabling continuous live generation adapted to the event context and audience flow.',
    descriptionFr:
      'Lors de Viva Technology, l’expérience a été déployée sur le stand Microsoft pendant cinq jours consécutifs. Des QR codes placés à côté de l’écran permettaient aux visiteurs de soumettre des prompts texte‑image en temps réel. Un style visuel dédié a été conçu pour s’aligner sur la direction artistique du stand, permettant une génération live continue adaptée au contexte de l’événement et au flux du public.',
    mediaSrc: '/Gallery/Booth Experience.webm',
    mediaType: 'video',
    imageSrc: '/Gallery/Booth Experience.webm',
    videoSrc: '/Gallery/Booth Experience.webm',
  },
  {
    id: 'gallery-2',
    year: 'February 2024',
    title: 'Club Experience',
    titleFr: 'Expérience Club',
    tagline: 'Live AI-generated visuals for nightlife',
    taglineFr: 'Visuels IA générés en direct pour la nuit',
    client: 'Paris Creator Week',
    location: 'Yoyo Club, Paris, France',
    lora: 'Cyberpunk',
    role: 'Text to Video',
    description:
      'Live AI-generated visuals illustrated audience-written prompts submitted through a dedicated web application, accessible via QR codes placed throughout YOYO Club. Four distinct visual styles were created, one for each DJ set, shaping the visual identity of the night. The visuals responded in real time to the crowd facing the DJs, while a live control room handled moderation and curation, transforming collective inputs into dynamic, generative visual landscapes that amplified the club atmosphere.',
    descriptionFr:
      'Des visuels IA générés en direct illustraient des prompts rédigés par le public via une web app dédiée, accessible par QR codes disséminés dans le YOYO Club. Quatre styles visuels distincts ont été créés, un pour chaque DJ set, façonnant l’identité visuelle de la soirée. Les visuels réagissaient en temps réel au public face aux DJs, tandis qu’une régie live assurait la modération et la curation, transformant les contributions collectives en paysages visuels dynamiques et génératifs amplifiant l’atmosphère du club.',
    mediaSrc: '/Gallery/Club Experience.webm',
    mediaType: 'video',
    imageSrc: '/Gallery/Club Experience.webm',
    videoSrc: '/Gallery/Club Experience.webm',
  },
  {
    id: 'gallery-3',
    year: 'February 2025',
    title: 'Conference Experience',
    titleFr: 'Expérience Conférence',
    tagline: 'AI visuals for talks',
    taglineFr: 'Visuels IA pour les talks',
    client: 'Sommet de l’IA',
    location: 'Grand Palais, Paris, France',
    lora: 'Original',
    role: 'Text to video',
    description:
      'As part of the AI Action Summit organized by the French government at the Grand Palais, the experience was presented in the “Salle des Présidents” between conference sessions. The system generated large-scale visuals designed to keep the audience engaged between talks, adapting to the thematic context of the event and contributing to the continuity of the program.',
    descriptionFr:
      'Dans le cadre de l’AI Action Summit organisé par le gouvernement français au Grand Palais, l’expérience a été présentée dans la « Salle des Présidents » entre les sessions de conférence. Le système générait des visuels grand format conçus pour maintenir l’attention du public entre les talks, en s’adaptant au contexte thématique de l’événement et en contribuant à la continuité du programme.',
    mediaSrc: '/Gallery/Conference Exeprience.webm',
    mediaType: 'video',
    imageSrc: '/Gallery/Conference Exeprience.webm',
    videoSrc: '/Gallery/Conference Exeprience.webm',
  },
  {
    id: 'gallery-4',
    year: 'November 2025',
    title: 'Immersive Reading Experience',
    titleFr: 'Lecture Immersive Experience',
    tagline: 'Interactive reading experience',
    taglineFr: 'Expérience de lecture interactive',
    client: 'Obvious',
    location: 'Theatre de l’IA, Paris, France',
    lora: 'Kastugi',
    role: 'Text & Voice to video',
    description:
      'An interactive artistic installation illustrating selected key passages from a book through real-time generated visuals. The excerpts were read on stage by a professional reader, accompanied by a cello to create an immersive atmosphere. We were present on stage to trigger and analyze the prompts live. A dedicated visual universe was developed in collaboration with the author, creating a direct dialogue between the text, the sound performance, and generative imagery.',
    descriptionFr:
      'Une installation artistique interactive illustrant des passages clés d’un livre grâce à des visuels générés en temps réel. Les extraits étaient lus sur scène par un lecteur professionnel, accompagnés d’un violoncelle pour créer une atmosphère immersive. Nous étions présents sur scène pour déclencher et analyser les prompts en direct. Un univers visuel dédié a été développé en collaboration avec l’auteur, créant un dialogue direct entre le texte, la performance sonore et l’imagerie générative.',
    mediaSrc: '/Gallery/Immersive Reading.webm',
    mediaType: 'video',
    imageSrc: '/Gallery/Immersive Reading.webm',
    videoSrc: '/Gallery/Immersive Reading.webm',
  },
  {
    id: 'gallery-5',
    year: 'May 2024',
    title: 'Sport Experience',
    titleFr: 'Expérience Sport',
    tagline: 'Live AI visuals for sports',
    taglineFr: 'Visuels IA en direct pour le sport',
    client: 'Paris Saint-Germain',
    location: 'Parc des Princes, Paris, France',
    lora: 'PSG JERSEY',
    role: 'Text to video',
    description:
      'During the UEFA Champions League semi-final of Paris Saint-Germain, we deployed a real-time AI visual system during the pre-show and half-time. The audience submitted written prompts through a dedicated web application, which were transformed live into dynamic visuals reacting to the intensity and narrative of the match. In just a few minutes, the system processed over 5,000 prompts, expressing collective support for the players. A custom visual language was developed for the occasion, inspired by PSG’s training kit, reinforcing the club’s identity and the energy of the event.',
    descriptionFr:
      'Lors de la demi‑finale de Ligue des Champions du Paris Saint‑Germain, nous avons déployé un système visuel IA en temps réel pendant le pré‑show et la mi‑temps. Le public soumettait des prompts écrits via une web app dédiée, transformés en direct en visuels dynamiques réagissant à l’intensité et au récit du match. En quelques minutes, le système a traité plus de 5 000 prompts, exprimant le soutien collectif aux joueurs. Un langage visuel sur mesure a été développé pour l’occasion, inspiré du kit d’entraînement du PSG, renforçant l’identité du club et l’énergie de l’événement.',
    mediaSrc: '/Gallery/Sport Experience.webm',
    mediaType: 'video',
    imageSrc: '/Gallery/Sport Experience.webm',
    videoSrc: '/Gallery/Sport Experience.webm',
  },
]

