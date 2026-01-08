import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

// OldStandardTT Bold pour les titres
const oldStandardBold = localFont({
  src: '../public/OldStandardTT-Bold.woff',
  variable: '--font-heading',
  display: 'swap',
  weight: '700',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'serif'],
})

// CoFoSansMonoVF pour les sous-titres et labels
const coFoSansMono = localFont({
  src: '../public/CoFoSansMonoVF-Regular.woff',
  variable: '--font-label',
  display: 'swap',
  weight: '400',
  fallback: ['monospace', 'Courier New', 'monospace'],
})

// OldStandardTT Regular pour le corps de texte
const oldStandardRegular = localFont({
  src: '../public/OldStandardTT-Regular.woff',
  variable: '--font-body',
  display: 'swap',
  weight: '400',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'serif'],
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
        className={`${oldStandardBold.variable} ${coFoSansMono.variable} ${oldStandardRegular.variable} font-sans`}
        style={{ backgroundColor: '#000000', color: '#f9fafb' }}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

