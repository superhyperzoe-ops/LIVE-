'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './Layout'
import { fadeInUp, slideInLeft, slideInRight } from '@/lib/animations'

type ExperienceType = 'Text' | 'Speech' | ''
type LoraType = 'Yes' | 'No' | ''

interface FormData {
  name: string
  contact: string
  eventDate: string
  experienceType: ExperienceType
  concept: string
  screenSize: string
  lora: LoraType
}

const TOTAL_STEPS = 7

export default function ContactSection() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    eventDate: '',
    experienceType: '',
    concept: '',
    screenSize: '',
    lora: '',
  })

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 250)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 250)
    }
  }

  const handleStart = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(1)
      setIsAnimating(false)
    }, 250)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleToggle = (field: 'experienceType' | 'lora', value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field] === value ? '' : (value as ExperienceType | LoraType),
    })
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== ''
      case 2:
        return formData.contact.trim() !== '' && formData.contact.includes('@')
      case 3:
        return formData.eventDate !== ''
      case 4:
        return formData.experienceType !== ''
      case 5:
        return formData.concept.trim() !== ''
      case 6:
        return formData.screenSize.trim() !== ''
      case 7:
        return formData.lora !== ''
      default:
        return false
    }
  }

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Want to design your own Live experience? Let&apos;s talk.
          </h2>
          <button
            type="button"
            onClick={handleStart}
            className="contact-start-button relative inline-flex flex-col items-center gap-3 px-8 py-4 bg-transparent text-white text-lg font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
          >
            <span className="contact-start-button-content relative z-10 flex items-center gap-3">
              <span>Start</span>
              <span className="contact-start-button-arrow inline-block">→</span>
            </span>
          </button>
        </motion.div>
      )
    }

    if (isSubmitted) {
      return (
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-white flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-white"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            Thank you{formData.name ? `, ${formData.name}` : ''}!
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300 leading-relaxed"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            We&apos;ve received your request and will get in touch with you shortly.
          </motion.p>
        </motion.div>
      )
    }

    const stepContent = [
      null, // step 0 handled above
      {
        question: "What's your name?",
        input: (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            placeholder="Your name"
            autoFocus
          />
        ),
      },
      {
        question: 'How can we reach you?',
        input: (
          <input
            type="email"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            placeholder="your.email@example.com"
            autoFocus
          />
        ),
      },
      {
        question: 'Date of your event',
        input: (
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            autoFocus
          />
        ),
      },
      {
        question: 'What kind of Live experience do you want?',
        input: (
          <div className="flex gap-4 justify-center">
            <motion.button
              type="button"
              onClick={() => handleToggle('experienceType', 'Text')}
              className={`px-8 py-3 rounded-lg border ${
                formData.experienceType === 'Text'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Text
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('experienceType', 'Speech')}
              className={`px-8 py-3 rounded-lg border ${
                formData.experienceType === 'Speech'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Speech
            </motion.button>
          </div>
        ),
      },
      {
        question: 'Tell us about your concept, the venue, and the type of screen.',
        input: (
          <textarea
            name="concept"
            value={formData.concept}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors resize-none"
            placeholder="Describe your concept..."
            autoFocus
          />
        ),
      },
      {
        question: 'Size of screen?',
        input: (
          <input
            type="text"
            name="screenSize"
            value={formData.screenSize}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            placeholder="e.g., 1920x1080 or Large LED wall"
            autoFocus
          />
        ),
      },
      {
        question: 'Would you like us to create a Lora for you?',
        input: (
          <div className="flex gap-4 justify-center">
            <motion.button
              type="button"
              onClick={() => handleToggle('lora', 'Yes')}
              className={`px-8 py-3 rounded-lg border ${
                formData.lora === 'Yes'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Yes
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('lora', 'No')}
              className={`px-8 py-3 rounded-lg border ${
                formData.lora === 'No'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              No
            </motion.button>
          </div>
        ),
      },
    ]

    const step = stepContent[currentStep]
    if (!step) return null

    return (
      <motion.div 
        className="space-y-8"
        key={currentStep}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              className="text-sm text-gray-400 mb-2"
              initial={{ opacity: 0, x: -10, y: -6 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 10, y: 6 }}
              transition={{ duration: 0.3 }}
            >
              Step {currentStep} of {TOTAL_STEPS}
            </motion.p>
          </AnimatePresence>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <motion.div
              className="bg-white h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="relative">
          {/* Animated highlight behind question */}
          <motion.div
            className="absolute inset-0 bg-white/5 rounded-lg -z-10"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          />
          <motion.h3 
            className="text-2xl lg:text-3xl font-bold text-white text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {step.question}
          </motion.h3>
        </div>
        <div>{step.input}</div>
        <div className="flex justify-between items-center pt-4">
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={handleBack}
              className="text-gray-400 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              ← Back
            </motion.button>
          )}
          <div className="flex-1" />
          {currentStep === TOTAL_STEPS ? (
            <motion.button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-lg border ${
                canProceed()
                  ? 'bg-transparent border-white text-white'
                  : 'bg-transparent border-gray-600 text-gray-600 cursor-not-allowed'
              }`}
              whileHover={canProceed() ? { 
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: '#000000',
              } : {}}
              whileTap={canProceed() ? { scale: 0.95 } : {}}
              transition={{ duration: 0.2 }}
            >
              Submit
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`contact-next-button relative inline-flex flex-col items-center justify-center gap-2 px-6 py-3 bg-transparent text-white text-base font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 ${
                canProceed()
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              <span className="contact-next-button-text relative z-10 inline-block">Next</span>
              <span className="contact-next-button-bottom-line absolute bottom-0 left-50% w-[calc(100%+16px)] h-px bg-white -translate-x-1/2 z-1" />
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <section id="contact" className="min-h-screen flex items-center py-24 lg:py-32 snap-start snap-always scroll-mt-[66px]">
      <Layout>
        <div className="max-w-xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </Layout>
    </section>
  )
}

