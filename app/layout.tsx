import type { Metadata } from 'next'
import { IBM_Plex_Sans_Condensed, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

// IBM Plex Sans Condensed pour les titres et éléments UI
const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['500', '600', '700'],
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

// IBM Plex Sans pour le corps de texte
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500'],
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'OBVIOUS LIVE - Real-time AI experiences',
  description: 'Real-time AI experiences for live events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body 
        className={`${ibmPlexSansCondensed.variable} ${ibmPlexSans.variable} font-sans`}
        style={{ backgroundColor: '#000000', color: '#f9fafb' }}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

