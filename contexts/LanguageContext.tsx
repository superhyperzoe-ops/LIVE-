'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Récupérer la langue depuis localStorage au chargement (uniquement côté client)
    if (typeof window !== 'undefined') {
      try {
        const savedLanguage = localStorage.getItem('language') as Language
        if (savedLanguage === 'fr' || savedLanguage === 'en') {
          setLanguageState(savedLanguage)
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    const translations: Record<string, Record<Language, string>> = {
      // Navbar
      'nav.live': { en: 'LIVE', fr: 'LIVE' },
      'nav.technology': { en: 'TECHNOLOGY', fr: 'TECHNOLOGIE' },
      'nav.gallery': { en: 'GALLERY', fr: 'GALERIE' },
      'nav.contact': { en: 'CONTACT', fr: 'CONTACT' },
      'nav.about': { en: 'ABOUT US', fr: 'À PROPOS' },

      // Hero
      'hero.title': { en: 'LIVE', fr: 'LIVE' },
      'hero.description': {
        en: 'A technology that enables the real-time generation of a continuous video from written or spoken prompts.',
        fr: 'Une technologie qui permet la génération en temps réel d\'une vidéo continue à partir de prompts écrits ou parlés.',
      },
      'hero.discover': { en: 'Discover', fr: 'Découvrir' },

      // Technology Section
      'tech.title': { en: 'Technology', fr: 'Technologie' },
      'tech.description': {
        en: 'Our platform combines artificial intelligence, signal processing and generative design to create unique real-time visual experiences.',
        fr: 'Notre plateforme combine intelligence artificielle, traitement du signal et design génératif pour créer des expériences visuelles uniques en temps réel.',
      },
      'tech.system': { en: 'System', fr: 'Système' },
      'tech.realTime': { en: 'Real-time', fr: 'Temps réel' },
      'tech.moderation': { en: 'Moderation', fr: 'Modération' },
      'tech.safety': { en: 'Safety', fr: 'Sécurité' },
      'tech.style': { en: 'Style', fr: 'Style' },
      'tech.aesthetics': { en: 'Aesthetics', fr: 'Esthétique' },

      // System Summary
      'system.title': { en: 'System', fr: 'Système' },
      'system.mode01': { en: 'Mode 01', fr: 'Mode 01' },
      'system.mode02': { en: 'Mode 02', fr: 'Mode 02' },
      'system.speechToVideo': { en: 'Speech to video', fr: 'Parole en vidéo' },
      'system.speechDescription': {
        en: 'We turn spoken sentences into evolving visuals in real-time, driven by a microphone input.',
        fr: 'Nous transformons les phrases parlées en visuels évolutifs en temps réel, pilotés par une entrée microphone.',
      },
      'system.textToVideo': { en: 'Text to video', fr: 'Texte en vidéo' },
      'system.textDescription': {
        en: 'We generate a continuous video from queued text prompts written by the audience.',
        fr: 'Nous générons une vidéo continue à partir de prompts texte en file d\'attente écrits par le public.',
      },
      'system.discover': { en: 'Discover the setup', fr: 'Découvrir la configuration' },

      // Speech to Video Details
      'speech.title': { en: 'Speech to video', fr: 'Parole en vidéo' },
      'speech.para1': {
        en: 'We created an experience where people can interact with an AI algorithm by speaking inside a microphone.',
        fr: 'Nous avons créé une expérience où les gens peuvent interagir avec un algorithme d\'IA en parlant dans un microphone.',
      },
      'speech.para2': {
        en: 'The users speak a sentence in the microphone. The video will instantly evolve towards a visualisation of the sentence, and remain in an ever moving state until the next sentence is spoken.',
        fr: 'Les utilisateurs prononcent une phrase dans le microphone. La vidéo évoluera instantanément vers une visualisation de la phrase et restera dans un état en mouvement constant jusqu\'à ce que la phrase suivante soit prononcée.',
      },
      'speech.bullet1': {
        en: 'This concept can be applied on any type of screen',
        fr: 'Ce concept peut être appliqué sur tout type d\'écran',
      },
      'speech.bullet2': {
        en: 'The installation is configured to be 100% safe in terms of content with moderation',
        fr: 'L\'installation est configurée pour être 100% sûre en termes de contenu avec modération',
      },
      'speech.bullet3': {
        en: 'The installation is self sufficient and does not need any internet connection',
        fr: 'L\'installation est autonome et ne nécessite aucune connexion internet',
      },

      // Text to Video Details
      'text.title': { en: 'Text to video', fr: 'Texte en vidéo' },
      'text.para1': {
        en: 'Generate continuous video content from text prompts in real-time.',
        fr: 'Générez du contenu vidéo continu à partir de prompts texte en temps réel.',
      },
      'text.para2': {
        en: 'Simply input your text description and watch as the AI transforms your words into dynamic, evolving visual content that adapts and flows seamlessly.',
        fr: 'Saisissez simplement votre description texte et observez l\'IA transformer vos mots en contenu visuel dynamique et évolutif qui s\'adapte et coule de manière fluide.',
      },

      // Moderation Details
      'moderation.title': { en: 'Moderation', fr: 'Modération' },
      'moderation.subtitle': { en: 'Live moderation system', fr: 'Système de modération en direct' },
      'moderation.heading': {
        en: 'Layers of control working together',
        fr: 'Couches de contrôle travaillant ensemble',
      },
      'moderation.description': {
        en: 'Our moderation pipeline ensures that every Live experience remains safe, controlled, and aligned with each event\'s requirements. It combines automated analysis, curated rules, and human operator oversight.',
        fr: 'Notre pipeline de modération garantit que chaque expérience Live reste sûre, contrôlée et alignée avec les exigences de chaque événement. Il combine analyse automatisée, règles organisées et supervision d\'un opérateur humain.',
      },
      'moderation.tag1': { en: 'AI training', fr: 'Formation IA' },
      'moderation.tag2': { en: 'Automatic moderation', fr: 'Modération automatique' },
      'moderation.tag3': { en: 'Operator controls', fr: 'Contrôles opérateur' },

      // Style Details
      'style.aesthetics': { en: 'Aesthetics', fr: 'Esthétique' },
      'style.title': { en: 'Style', fr: 'Style' },
      'style.description': {
        en: 'We can adapt the style of the generation with your artistic direction. It can match some color elements but also some patterns. All we need is a few inspiration images to adapt the style.',
        fr: 'Nous pouvons adapter le style de la génération à votre direction artistique. Il peut correspondre à certains éléments de couleur mais aussi à certains motifs. Tout ce dont nous avons besoin, ce sont quelques images d\'inspiration pour adapter le style.',
      },
      'style.style1': { en: 'Style 1', fr: 'Style 1' },
      'style.style1Desc': {
        en: 'Neon gradients for high-energy live shows.',
        fr: 'Dégradés néon pour les spectacles live haute énergie.',
      },
      'style.style2': { en: 'Style 2', fr: 'Style 2' },
      'style.style2Desc': {
        en: 'Soft cinematic tones for immersive experiences.',
        fr: 'Tons cinématographiques doux pour des expériences immersives.',
      },
      'style.style3': { en: 'Style 3', fr: 'Style 3' },
      'style.style3Desc': {
        en: 'Bold monochrome visuals for minimal setups.',
        fr: 'Visuels monochromes audacieux pour des configurations minimales.',
      },

      // Gallery Section
      'gallery.title': { en: 'Gallery', fr: 'Galerie' },
      'gallery.description': {
        en: 'Discover a selection of events that have used our Live technology in unique and creative ways. Each installation showcases a different approach to real-time AI video generation, offering inspiration for how you can integrate this experience into your own projects.',
        fr: 'Découvrez une sélection d\'événements qui ont utilisé notre technologie Live de manière unique et créative. Chaque installation présente une approche différente de la génération vidéo IA en temps réel, offrant de l\'inspiration sur la façon dont vous pouvez intégrer cette expérience dans vos propres projets.',
      },
      'gallery.client': { en: 'Client', fr: 'Client' },
      'gallery.location': { en: 'Location', fr: 'Lieu' },
      'gallery.date': { en: 'Date', fr: 'Date' },
      'gallery.lora': { en: 'Lora', fr: 'Lora' },
      'gallery.role': { en: 'Role', fr: 'Rôle' },

      // Contact Section
      'contact.title': { en: 'Contact', fr: 'Contact' },
      'contact.subtitle': {
        en: 'Let\'s create something amazing together',
        fr: 'Créons quelque chose d\'extraordinaire ensemble',
      },
      'contact.start': { en: 'Start', fr: 'Commencer' },
      'contact.next': { en: 'Next', fr: 'Suivant' },
      'contact.back': { en: 'Back', fr: 'Retour' },
      'contact.submit': { en: 'Submit', fr: 'Envoyer' },
      'contact.name': { en: 'What\'s your name?', fr: 'Quel est votre nom ?' },
      'contact.email': { en: 'What\'s your email?', fr: 'Quel est votre email ?' },
      'contact.date': { en: 'When is your event?', fr: 'Quand est votre événement ?' },
      'contact.experience': {
        en: 'What type of experience?',
        fr: 'Quel type d\'expérience ?',
      },
      'contact.concept': {
        en: 'Tell us about your concept',
        fr: 'Parlez-nous de votre concept',
      },
      'contact.screen': {
        en: 'What screen size?',
        fr: 'Quelle taille d\'écran ?',
      },
      'contact.lora': {
        en: 'Do you need a custom Lora?',
        fr: 'Avez-vous besoin d\'un Lora personnalisé ?',
      },
      'contact.thanks': {
        en: 'Thank you! We\'ll be in touch soon.',
        fr: 'Merci ! Nous vous contacterons bientôt.',
      },

      // About Section
      'about.title': { en: 'About', fr: 'À propos' },
      'about.para1': {
        en: 'We are Obvious, a French trio of artists and researchers working with artificial intelligence to create art. Inspired by the Renaissance workshops, we operate at the crossroads of academic research and art.',
        fr: 'Nous sommes Obvious, un trio français d\'artistes et de chercheurs travaillant avec l\'intelligence artificielle pour créer de l\'art. Inspirés par les ateliers de la Renaissance, nous opérons au carrefour de la recherche académique et de l\'art.',
      },
      'about.para2': {
        en: 'Our work consists in researching and building artificial intelligence algorithms in the creative field, and producing artistic series of artworks using those tools. Our research laboratory hosted in Sorbonne University and funded by the French National Research Agency (ANR) is leading research in the fields of image, video and sound generation. We are behind the first artwork created using artificial intelligence to go through a major auction house (Christie\'s, 2018), and we have been exhibited in some of the world\'s largest institutions. We are represented in different galleries in France and South Korea.',
        fr: 'Notre travail consiste à rechercher et construire des algorithmes d\'intelligence artificielle dans le domaine créatif, et à produire des séries artistiques d\'œuvres d\'art en utilisant ces outils. Notre laboratoire de recherche hébergé à l\'Université de la Sorbonne et financé par l\'Agence Nationale de la Recherche (ANR) mène des recherches dans les domaines de la génération d\'images, de vidéos et de sons. Nous sommes à l\'origine de la première œuvre d\'art créée à l\'aide de l\'intelligence artificielle à passer par une grande maison de vente aux enchères (Christie\'s, 2018), et nous avons été exposés dans certaines des plus grandes institutions du monde. Nous sommes représentés dans différentes galeries en France et en Corée du Sud.',
      },

      // Footer
      'footer.description': {
        en: 'Creators of immersive live experiences through artificial intelligence and real-time generative design.',
        fr: 'Créateurs d\'expériences live immersives grâce à l\'intelligence artificielle et au design génératif en temps réel.',
      },
      'footer.navigation': { en: 'Navigation', fr: 'Navigation' },
      'footer.contact': { en: 'Contact & Social', fr: 'Contact & Réseaux' },
      'footer.copyright': { en: '© 2025 Obvious. All rights reserved.', fr: '© 2025 Obvious. Tous droits réservés.' },
      
      // Gallery
      'gallery.liveEvent': { en: 'Live Event', fr: 'Événement Live' },
      
      // Contact
      'contact.wantToDesign': {
        en: 'Want to design your own Live experience? Let\'s talk.',
        fr: 'Vous voulez concevoir votre propre expérience Live ? Parlons-en.',
      },
      'contact.howToReach': {
        en: 'How can we reach you?',
        fr: 'Comment pouvons-nous vous joindre ?',
      },
      'contact.eventDate': {
        en: 'Date of your event',
        fr: 'Date de votre événement',
      },
      'contact.whatKind': {
        en: 'What kind of Live experience do you want?',
        fr: 'Quel type d\'expérience Live souhaitez-vous ?',
      },
      'contact.tellUs': {
        en: 'Tell us about your concept, the venue, and the type of screen.',
        fr: 'Parlez-nous de votre concept, du lieu et du type d\'écran.',
      },
      'contact.screenSize': {
        en: 'Size of screen?',
        fr: 'Taille de l\'écran ?',
      },
      'contact.loraQuestion': {
        en: 'Would you like us to create a Lora for you?',
        fr: 'Souhaitez-vous que nous créions un Lora pour vous ?',
      },
      'contact.yes': { en: 'Yes', fr: 'Oui' },
      'contact.no': { en: 'No', fr: 'Non' },
      'contact.text': { en: 'Text', fr: 'Texte' },
      'contact.speech': { en: 'Speech', fr: 'Parole' },
      'contact.yourName': { en: 'Your name', fr: 'Votre nom' },
      'contact.emailPlaceholder': {
        en: 'your.email@example.com',
        fr: 'votre.email@exemple.com',
      },
      'contact.describeConcept': {
        en: 'Describe your concept...',
        fr: 'Décrivez votre concept...',
      },
      'contact.screenPlaceholder': {
        en: 'e.g., 1920x1080 or Large LED wall',
        fr: 'ex: 1920x1080 ou Grand mur LED',
      },
      'contact.thankYou': {
        en: 'Thank you',
        fr: 'Merci',
      },
      'contact.received': {
        en: 'We\'ve received your request and will get in touch with you shortly.',
        fr: 'Nous avons reçu votre demande et vous contacterons sous peu.',
      },
      'contact.visitWebsite': {
        en: 'Visit our main website',
        fr: 'Visitez notre site principal',
      },
      
      // About
      'about.aboutUs': { en: 'About Us', fr: 'À propos de nous' },
    }

    const translation = translations[key]?.[language]
    return translation || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

