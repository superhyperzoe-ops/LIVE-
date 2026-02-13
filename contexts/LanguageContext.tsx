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
      'hero.descriptionLine1a': {
        en: 'An art installation that',
        fr: 'Une installation artistique qui',
      },
      'hero.descriptionLine1b': {
        en: 'enables the real-time generation',
        fr: 'permet la génération en temps réel',
      },
      'hero.descriptionLine2': {
        en: 'of a continuous video from written or spoken words.',
        fr: 'd\'une vidéo continue à partir de mots écrits ou prononcés.',
      },
      'hero.discover': { en: 'Discover', fr: 'Découvrir' },

      // Technology Section
      'tech.title': { en: 'The Technology', fr: 'La Technologie' },
      'tech.description': {
        en: 'Developed in house, our technology combines real-time AI generation, signal optimization and artistic expertise to create interactive visual experiences that create emotions.',
        fr: 'Développée en interne, notre technologie combine génération IA en temps réel, optimisation du signal et expertise artistique\npour créer des expériences visuelles interactives qui suscitent des émotions.',
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
        en: 'We turn spoken sentences into evolving visuals in real-time, collected using a microphone.',
        fr: 'Nous transformons les phrases prononcées en visuels évolutifs en temps réel, captées via un microphone.',
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
        en: 'Our speech to video setup lets people command an AI algorithm by speaking inside a microphone.',
        fr: 'Notre dispositif permet de piloter un algorithme d\'IA en parlant dans un microphone.',
      },
      'speech.para2': {
        en: 'Once a sentence is spoken, the video immediately transitions into a visual interpretation of it, then continues in constant motion until a new sentence is voiced.',
        fr: 'Une fois une phrase prononcée, la vidéo bascule immédiatement vers une interprétation visuelle, puis reste en mouvement constant jusqu\'à l\'énoncé suivant.',
      },
      'speech.bullet1': {
        en: 'The experience can be presented on any type of screen or projection',
        fr: 'L\'expérience peut être présentée sur tout type d\'écran ou de projection',
      },
      'speech.bullet2': {
        en: 'An automated moderation allows for content safety',
        fr: 'Une modération automatisée assure la sécurité du contenu',
      },
      'speech.bullet3': {
        en: 'The installation only requires an internet connection',
        fr: 'L\'installation nécessite uniquement une connexion internet',
      },

      // Text to Video Details
      'text.title': { en: 'Text to video', fr: 'Texte en vidéo' },
      'text.para1': {
        en: 'Our text to video system is accessible through a web app, with no download required. Users submit text descriptions that directly steer the AI in real time.',
        fr: 'Notre système text to video est accessible via une web app, sans téléchargement. Les utilisateurs soumettent des descriptions textuelles qui pilotent directement l’IA en temps réel.',
      },
      'text.para2': {
        en: 'Prompts are queued, enabling large scale participation. Each participant can track their position in the queue and see which prompt is currently shaping the video. As a prompt reaches the top, the continuous video stream gradually evolves in response, making each contribution visible and shared.',
        fr: 'Les prompts sont mis en file d’attente, permettant une participation à grande échelle. Chaque participant peut suivre sa position dans la file et voir quel prompt façonne la vidéo. Lorsqu’un prompt arrive en tête, le flux vidéo continu évolue progressivement en réponse, rendant chaque contribution visible et partagée.',
      },
      'text.bullet1': {
        en: 'The experience can be presented on any type of screen or projection',
        fr: 'L’expérience peut être présentée sur tout type d’écran ou de projection',
      },
      'text.bullet2': {
        en: 'The automated + manual moderation allows for 100% safety of the content',
        fr: 'La modération automatisée + manuelle assure 100% de sécurité du contenu',
      },
      'text.bullet3': {
        en: 'The installation only requires an internet connection',
        fr: 'L’installation nécessite uniquement une connexion internet',
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
      'moderation.keyword1': { en: 'Natural moderation', fr: 'Modération naturelle' },
      'moderation.keyword2': { en: 'Automatic moderation', fr: 'Modération automatique' },
      'moderation.keyword3': { en: 'Human moderation', fr: 'Modération humaine' },
      'moderation.intro': {
        en: 'The installation comes with three levels of moderation',
        fr: 'L’installation comporte trois niveaux de modération',
      },
      'moderation.level1': {
        en: 'Natural moderation: the algorithms used for the visual creation are trained on a curated dataset, allowing for the exclusion of the content. We take advantage of the natural bias of the algorithms to ensure content safety without restricting the creative possibilities.',
        fr: 'Modération naturelle : les algorithmes utilisés pour la création visuelle sont entraînés sur un jeu de données curaté, permettant d’exclure certains contenus. Nous tirons parti du biais naturel des algorithmes pour garantir la sécurité du contenu sans restreindre les possibilités créatives.',
      },
      'moderation.level2': {
        en: 'Automatic moderation: we can work together on a ban list which includes a number of words and sentences which will be refused. The user will get a refusal and be able to issue a new prompt.',
        fr: 'Modération automatique : nous pouvons définir ensemble une liste d’interdiction comprenant des mots et des phrases qui seront refusés. L’utilisateur recevra un refus et pourra soumettre un nouveau prompt.',
      },
      'moderation.level3': {
        en: 'Human moderation: we developed an interface allowing for manual moderation. Each prompt is manually accepted or refused. The interface also allows for prompt prioritization, the input of new prompts and the choice of the display duration for each prompt.',
        fr: 'Modération humaine : nous avons développé une interface permettant une modération manuelle. Chaque prompt est accepté ou refusé manuellement. L’interface permet aussi la priorisation des prompts, l’ajout de nouveaux prompts et le choix de la durée d’affichage de chaque prompt.',
      },

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
        en: 'Each project is specific, and each event is unique.\n\nEach installation showcases a different approach to real-time AI video generation, offering inspiration for how you can integrate this experience into your own projects.',
        fr: 'Chaque projet est spécifique, et chaque événement est unique.\n\nChaque installation présente une approche différente de la génération vidéo IA en temps réel, offrant de l\'inspiration sur la façon dont vous pouvez intégrer cette expérience dans vos propres projets.',
      },
      'gallery.client': { en: 'Client', fr: 'Client' },
      'gallery.location': { en: 'Location', fr: 'Lieu' },
      'gallery.date': { en: 'Date', fr: 'Date' },
      'gallery.lora': { en: 'Lora', fr: 'Lora' },
      'gallery.role': { en: 'Role', fr: 'Rôle' },

      // About Section
      'about.title': { en: 'About Us', fr: 'À propos' },
      'about.para1': {
        en: 'We are Obvious, a French trio of artists and researchers working with artificial intelligence to create art. Inspired by the Renaissance workshops, we operate at the crossroads of academic research and art.',
        fr: 'Nous sommes Obvious, un trio français d’artistes et de chercheurs travaillant avec l’intelligence artificielle pour créer de l’art. Inspirés par les ateliers de la Renaissance, nous opérons à la croisée de la recherche académique et de l’art.',
      },
      'about.para2': {
        en: 'Our work consists in building artificial intelligence algorithms in the creative field, and producing artworks using those tools. Our research laboratory hosted in Sorbonne University and funded by the French National Research Agency (ANR) is leading research in the fields of image, video and sound generation. We are behind the first artwork created using artificial intelligence to go through a major auction house (Christie\'s, 2018), and our work has been exhibited in some of the world\'s most iconic museums.',
        fr: 'Notre travail consiste à développer des algorithmes d’intelligence artificielle dans le domaine créatif et à produire des œuvres grâce à ces outils. Notre laboratoire de recherche, hébergé à la Sorbonne et financé par l’Agence nationale de la recherche (ANR), mène des recherches de pointe en génération d’images, de vidéo et de son. Nous sommes à l’origine de la première œuvre créée par IA à passer chez une grande maison de ventes aux enchères (Christie’s, 2018), et notre travail a été exposé dans certains des musées les plus emblématiques du monde.',
      },
      'about.cta': { en: 'Visit our main website', fr: 'Visiter notre site principal' },

      // Contact Section
      'contact.title': { en: 'Contact', fr: 'Contact' },
      'contact.subtitle': {
        en: 'Let\'s create something amazing together',
        fr: 'Créons quelque chose d\'extraordinaire ensemble',
      },
      'contact.introLine1': {
        en: 'Want to design your own experience?',
        fr: 'Vous voulez concevoir votre propre expérience ?',
      },
      'contact.introLine2': {
        en: 'We built it, we can adapt it.',
        fr: 'Nous l’avons construite, nous pouvons l’adapter.',
      },
      'contact.start': { en: 'Let’s talk', fr: 'Parlons-en' },
      'contact.step': { en: 'Step', fr: 'Étape' },
      'contact.of': { en: 'of', fr: 'sur' },
      'contact.q1': {
        en: 'What is your first and last name?',
        fr: 'Quel est votre prénom et votre nom ?',
      },
      'contact.q2': {
        en: 'What email address can we use to reach you?',
        fr: 'Quelle adresse e‑mail pouvons‑nous utiliser pour vous contacter ?',
      },
      'contact.q3': {
        en: 'Do you represent a company or an organization? If so, which one?',
        fr: 'Représentez‑vous une entreprise ou une organisation ? Si oui, laquelle ?',
      },
      'contact.q4': {
        en: 'Which best describes you?',
        fr: 'Quel profil vous décrit le mieux ?',
      },
      'contact.q5': {
        en: 'What type of event are you planning?',
        fr: 'Quel type d’événement préparez‑vous ?',
      },
      'contact.q6': {
        en: 'When will the event take place and where will it be held?',
        fr: 'Quand aura lieu l’événement et où se tiendra‑t‑il ?',
      },
      'contact.q7': {
        en: 'Could you briefly describe your project?',
        fr: 'Pouvez‑vous décrire brièvement votre projet ?',
      },
      'contact.q8': {
        en: 'Do you already have a budget range in mind for this project?',
        fr: 'Avez‑vous déjà une fourchette de budget en tête pour ce projet ?',
      },
      'contact.q9': {
        en: 'What type of live experience are you considering?',
        fr: 'Quel type d’expérience live envisagez‑vous ?',
      },
      'contact.q10': {
        en: 'What type of screen will be mainly used for the experience?',
        fr: 'Quel type d’écran sera principalement utilisé pour l’expérience ?',
      },
      'contact.q11': {
        en: 'Will you need human moderation during the experience?',
        fr: 'Aurez‑vous besoin d’une modération humaine pendant l’expérience ?',
      },
      'contact.q12': {
        en: 'Do you need a dedicated artistic direction ?',
        fr: 'Avez‑vous besoin d’une direction artistique dédiée ?',
      },
      'contact.q13': {
        en: 'Will the web app need specific adaptation?',
        fr: 'La web app nécessitera‑t‑elle une adaptation spécifique ?',
      },
      'contact.q14': {
        en: 'Are you planning any scenography linked to the experience?',
        fr: 'Prévoyez‑vous une scénographie liée à l’expérience ?',
      },
      'contact.q15': {
        en: 'Is there anything else important you would like to share before we get back to you?',
        fr: 'Y a‑t‑il autre chose d’important que vous souhaitez partager avant notre retour ?',
      },
      'contact.profile.finalClient': { en: 'Final client', fr: 'Client final' },
      'contact.profile.eventAgency': { en: 'Event agency', fr: 'Agence événementielle' },
      'contact.profile.other': { en: 'Other', fr: 'Autre' },
      'contact.experience.micro': { en: 'Text to video', fr: 'Texte en vidéo' },
      'contact.experience.webApp': { en: 'Speech to video', fr: 'Parole en vidéo' },
      'contact.experience.both': { en: 'Both', fr: 'Les deux' },
      'contact.yes': { en: 'Yes', fr: 'Oui' },
      'contact.no': { en: 'No', fr: 'Non' },
      'contact.placeholder.name': { en: 'First and last name', fr: 'Prénom et nom' },
      'contact.placeholder.email': { en: 'your.email@example.com', fr: 'votre.email@exemple.com' },
      'contact.placeholder.company': { en: 'Company or organization', fr: 'Entreprise ou organisation' },
      'contact.placeholder.eventType': { en: 'Event type', fr: 'Type d’événement' },
      'contact.placeholder.dateLocation': { en: 'Date and location', fr: 'Date et lieu' },
      'contact.placeholder.project': { en: 'Project description...', fr: 'Description du projet…' },
      'contact.placeholder.budget': { en: 'Budget range', fr: 'Fourchette de budget' },
      'contact.placeholder.screen': { en: 'Screen type', fr: 'Type d’écran' },
      'contact.placeholder.additional': { en: 'Additional details...', fr: 'Informations complémentaires…' },
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

