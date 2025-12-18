'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeInUp, imageZoom } from '@/lib/animations'

export default function ModerationDetails() {
  const prefersReducedMotion = useReducedMotion()
  
  // Split text into words for word-by-word reveal
  const text = "When images are generated from text, the Live comes with a built-in moderation system to ensure control is maintained."
  const words = text.split(' ')
  
  return (
    <section id="moderation" className="min-h-screen flex flex-col justify-center items-center py-16 snap-start snap-always scroll-mt-[66px]">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div 
          className="space-y-12 flex flex-col"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Title */}
          <motion.h2 
            className="text-5xl lg:text-6xl font-bold text-center text-white"
            variants={fadeInUp}
          >
            Moderation
          </motion.h2>

          {/* Keyword cards */}
          <motion.ul 
            className="flex flex-wrap justify-center gap-3 mb-8"
            variants={staggerContainer}
          >
            {['Duration Control', 'Automatic moderation', 'Operator controls'].map((keyword, index) => (
              <motion.li
                key={keyword}
                variants={fadeInUp}
                className="px-4 py-2 rounded-md border border-white/10 bg-white/5 text-xs uppercase tracking-[0.15em] text-white/80 font-medium"
              >
                {keyword}
              </motion.li>
            ))}
          </motion.ul>

          {/* Grid: Text left, Image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <motion.div 
              className="space-y-6"
              variants={staggerContainer}
            >
              {/* Text with word-by-word reveal */}
              <motion.p 
                className="text-lg text-gray-300 leading-relaxed"
                variants={staggerContainer}
              >
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    variants={fadeInUp}
                    className="inline-block mr-1.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>

              {/* Text content without bullet points */}
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
              >
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  variants={fadeInUp}
                >
                  Natural AI Training moderation
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  variants={fadeInUp}
                >
                  Automatic moderation with ban list
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  variants={fadeInUp}
                >
                  Human moderation thought an interface
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  variants={fadeInUp}
                >
                  The human operator can also inject specific prompts, change the duration of prompt display and prioritize some prompts
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div 
              className="w-full flex justify-center lg:justify-end relative"
              variants={imageZoom}
            >
              <motion.img
                src="/Modération.png"
                alt="Moderation dashboard"
                className="max-w-full max-h-[500px] w-auto h-auto object-contain rounded-xl relative z-10"
                whileHover={{ scale: 1.02 }}
                animate={!prefersReducedMotion ? {
                  x: [0, -8, 0],
                } : {}}
                transition={!prefersReducedMotion ? {
                  duration: 14,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                } : { duration: 0.3 }}
              />
              {/* Light sweep */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-15"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                  }}
                  animate={{
                    x: ['-100%', '200%'],
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 10,
                    ease: 'easeInOut',
                  }}
                />
              )}
              {/* Focus effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-25"
                style={{
                  background: 'radial-gradient(circle, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none z-20"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
                  }}
                  animate={{
                    opacity: [0.1, 0.25, 0.1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

