'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  
  const footerNav = [
    { label: t('nav.live'), href: '#hero' },
    { label: t('nav.technology'), href: '#technology' },
    { label: t('nav.gallery'), href: '#gallery' },
    { label: t('nav.contact'), href: '#contact' },
    { label: t('nav.about'), href: '#about' },
  ]
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
      <footer 
        id="footer-section" 
        className="w-full bg-neutral-900 py-3 md:py-4"
      >
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 md:justify-items-center gap-6 lg:gap-8 mb-3 items-center">
            {/* Portal - Left */}
            <div className="space-y-2 text-center md:text-center">
              <div className="text-xl font-semibold tracking-wider text-white">
                Portal
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                <span className="block whitespace-nowrap">
                  {t('hero.descriptionLine1a')} {t('hero.descriptionLine1b')}
                </span>
                <span className="block whitespace-nowrap">
                  {t('hero.descriptionLine2')}
                </span>
              </p>
            </div>

            {/* Contact & Social - Right */}
            <div className="space-y-2 text-center md:text-center">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                {t('footer.contact')}
              </h3>
              <a
                href="mailto:hello.obvious@gmail.com"
                className="block text-sm text-gray-400 hover:text-gray-300"
              >
                hello.obvious@gmail.com
              </a>
              <div className="flex gap-4 pt-2 justify-center md:justify-center">
                <a
                  href="https://www.instagram.com/obvious_art?igsh=dGxzY3o0a205cno3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 -translate-y-[3px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.6a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8zm6-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM20.6 7a4.6 4.6 0 0 0-1-1.6 4.6 4.6 0 0 0-1.6-1c-1.1-.4-3.7-.3-6-.3s-4.9-.1-6 .3a4.6 4.6 0 0 0-1.6 1A4.6 4.6 0 0 0 3.4 7c-.4 1.1-.3 3.7-.3 6s-.1 4.9.3 6a4.6 4.6 0 0 0 1 1.6 4.6 4.6 0 0 0 1.6 1c1.1.4 3.7.3 6 .3s4.9.1 6-.3a4.6 4.6 0 0 0 1.6-1 4.6 4.6 0 0 0 1-1.6c.4-1.1.3-3.7.3-6s.1-4.9-.3-6z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/obvious_art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/obv_ious"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300"
                  aria-label="X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2H21l-6.542 7.475L22 22h-6.828l-4.96-6.62L4.4 22H1.64l7.01-8.01L2 2h6.828l4.48 5.98L18.244 2zm-1.2 18h1.6L7.08 4H5.4l11.644 16z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="pt-3 border-t border-gray-900/50 text-center">
            <p className="text-sm text-gray-500">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
  )
}

