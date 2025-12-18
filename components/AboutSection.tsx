'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import AboutLinkButton from './AboutLinkButton'

// Keywords to highlight
const highlightKeywords = [
  'artists',
  'researchers',
  'artificial intelligence',
  'Sorbonne University',
  'research laboratory',
  "Christie's",
]

export default function AboutSection() {
  const prefersReducedMotion = useReducedMotion()
  
  // Function to split text and wrap keywords
  const renderTextWithHighlights = (text: string) => {
    let parts: (string | JSX.Element)[] = [text]
    
    highlightKeywords.forEach((keyword) => {
      const newParts: (string | JSX.Element)[] = []
      parts.forEach((part) => {
        if (typeof part === 'string') {
          const regex = new RegExp(`(${keyword})`, 'gi')
          const split = part.split(regex)
          split.forEach((segment, index) => {
            if (segment.toLowerCase() === keyword.toLowerCase()) {
              newParts.push(
                <motion.span
                  key={`${keyword}-${index}`}
                  className="relative inline-block"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white/10 rounded-sm"
                    initial={{ backgroundSize: '0% 100%' }}
                    whileInView={{ backgroundSize: '100% 100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />
                  <span className="relative">{segment}</span>
                </motion.span>
              )
            } else if (segment) {
              newParts.push(segment)
            }
          })
        } else {
          newParts.push(part)
        }
      })
      parts = newParts
    })
    
    return <>{parts}</>
  }
  
  return (
    <section id="about" className="min-h-screen flex flex-col justify-center items-center py-20 snap-start snap-always scroll-mt-[66px]">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div 
          className="space-y-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Title */}
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-white text-center"
            variants={fadeInUp}
          >
            About Us
          </motion.h2>

          {/* Content: Text left, Image right */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text */}
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
            >
              <motion.p 
                className="text-lg text-white leading-relaxed font-light"
                variants={fadeInUp}
              >
                {renderTextWithHighlights('We are Obvious, a French trio of artists and researchers working with artificial intelligence to create art. Inspired by the Renaissance workshops, we operate at the crossroads of academic research and art.')}
              </motion.p>
              <motion.p 
                className="text-lg text-white leading-relaxed font-light"
                variants={fadeInUp}
              >
                {renderTextWithHighlights("Our work consists in researching and building artificial intelligence algorithms in the creative field, and producing artistic series of artworks using those tools. Our research laboratory hosted in Sorbonne University and funded by the French National Research Agency (ANR) is leading research in the fields of image, video and sound generation. We are behind the first artwork created using artificial intelligence to go through a major auction house (Christie's, 2018), and we have been exhibited in some of the world's largest institutions. We are represented in different galleries in France and South Korea.")}
              </motion.p>
              
              {/* Button */}
              <motion.div 
                className="pt-4"
                variants={fadeInUp}
              >
                <AboutLinkButton
                  href="https://www.obvious-art.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  label="Visit our main website"
                />
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div 
              className="relative w-full flex justify-center lg:justify-end"
              variants={fadeInUp}
            >
              <motion.img
                src="/aboutus.webp"
                alt="Obvious team"
                className="w-full max-w-md rounded-xl object-cover"
                style={{ borderRadius: '12px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={!prefersReducedMotion ? { 
                  y: [0, -6, 0],
                } : {}}
                transition={{
                  opacity: { duration: 0.8, ease: 'easeOut' },
                  scale: { duration: 0.8, ease: 'easeOut' },
                  y: !prefersReducedMotion ? {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                  } : {},
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

