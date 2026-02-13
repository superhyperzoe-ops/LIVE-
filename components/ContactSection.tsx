'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './Layout'
import GlitchLinesAnimation from './GlitchLinesAnimation'
import { fadeInUp, slideInLeft, slideInRight } from '@/lib/animations'
import { useLanguage } from '@/contexts/LanguageContext'

type ProfileType = 'Final client' | 'Event agency' | 'Other' | ''
type ExperienceType = 'Micro' | 'Web app' | 'Both' | ''
type YesNo = 'Yes' | 'No' | ''

interface FormData {
  name: string
  contact: string
  company: string
  profile: ProfileType
  eventType: string
  eventDateLocation: string
  projectDescription: string
  budgetRange: string
  experienceType: ExperienceType
  humanModeration: YesNo
  graphicAdaptation: YesNo
  webAppAdaptation: YesNo
  scenography: YesNo
  additionalInfo: string
}

const TOTAL_STEPS = 14

export default function ContactSection() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    company: '',
    profile: '',
    eventType: '',
    eventDateLocation: '',
    projectDescription: '',
    budgetRange: '',
    experienceType: '',
    humanModeration: '',
    graphicAdaptation: '',
    webAppAdaptation: '',
    scenography: '',
    additionalInfo: '',
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

  const handleToggle = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field] === value ? '' : value,
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
        return formData.company.trim() !== ''
      case 4:
        return formData.profile !== ''
      case 5:
        return formData.eventType.trim() !== ''
      case 6:
        return formData.eventDateLocation.trim() !== ''
      case 7:
        return formData.projectDescription.trim() !== ''
      case 8:
        return formData.budgetRange.trim() !== ''
      case 9:
        return formData.experienceType !== ''
      case 10:
        return formData.humanModeration !== ''
      case 11:
        return formData.graphicAdaptation !== ''
      case 12:
        return formData.webAppAdaptation !== ''
      case 13:
        return formData.scenography !== ''
      case 14:
        return formData.additionalInfo.trim() !== ''
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
          <div className="w-full flex flex-col items-center text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              <span className="whitespace-nowrap inline-block">{t('contact.introLine1')}</span>
              <br />
              {t('contact.introLine2')}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="contact-start-button relative inline-flex flex-col items-center gap-3 px-8 py-4 bg-transparent text-white text-lg font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
          >
            <span className="contact-start-button-content relative z-10 flex items-center gap-3">
              <span>{t('contact.start')}</span>
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
        question: t('contact.q1'),
        input: (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            placeholder={t('contact.placeholder.name')}
            autoFocus
          />
        ),
      },
      {
        question: t('contact.q2'),
        input: (
          <input
            type="email"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            placeholder={t('contact.placeholder.email')}
            autoFocus
          />
        ),
      },
      {
        question: t('contact.q3'),
        input: (
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            autoFocus
            placeholder={t('contact.placeholder.company')}
          />
        ),
      },
      {
        question: t('contact.q4'),
        input: (
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              type="button"
              onClick={() => handleToggle('profile', 'Final client')}
              className={`px-8 py-3 rounded-lg border ${
                formData.profile === 'Final client'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.profile.finalClient')}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('profile', 'Event agency')}
              className={`px-8 py-3 rounded-lg border ${
                formData.profile === 'Event agency'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.profile.eventAgency')}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('profile', 'Other')}
              className={`px-8 py-3 rounded-lg border ${
                formData.profile === 'Other'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.profile.other')}
            </motion.button>
          </div>
        ),
      },
      {
        question: t('contact.q5'),
        input: (
          <input
            type="text"
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors resize-none"
            placeholder={t('contact.placeholder.eventType')}
            autoFocus
          />
        ),
      },
      {
        question: t('contact.q6'),
        input: (
          <input
            type="date"
            name="eventDateLocation"
            value={formData.eventDateLocation}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            placeholder={t('contact.placeholder.dateLocation')}
            autoFocus
          />
        ),
      },
      {
        question: t('contact.q7'),
        input: (
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors resize-none"
            placeholder={t('contact.placeholder.project')}
            autoFocus
          />
        ),
      },
      {
        question: t('contact.q8'),
        input: (
          <input
            type="text"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
            placeholder={t('contact.placeholder.budget')}
            autoFocus
          />
        ),
      },
      {
        question: t('contact.q9'),
        input: (
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              type="button"
              onClick={() => handleToggle('experienceType', 'Micro')}
              className={`px-8 py-3 rounded-lg border ${
                formData.experienceType === 'Micro'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.experience.micro')}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('experienceType', 'Web app')}
              className={`px-8 py-3 rounded-lg border ${
                formData.experienceType === 'Web app'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.experience.webApp')}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('experienceType', 'Both')}
              className={`px-8 py-3 rounded-lg border ${
                formData.experienceType === 'Both'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.experience.both')}
            </motion.button>
          </div>
        ),
      },
      {
        question: t('contact.q11'),
        input: (
          <div className="flex gap-4 justify-center">
            <motion.button
              type="button"
              onClick={() => handleToggle('humanModeration', 'Yes')}
              className={`px-8 py-3 rounded-lg border ${
                formData.humanModeration === 'Yes'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.yes')}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('humanModeration', 'No')}
              className={`px-8 py-3 rounded-lg border ${
                formData.humanModeration === 'No'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.no')}
            </motion.button>
          </div>
        ),
      },
      {
        question: t('contact.q12'),
        input: (
          <div className="flex gap-4 justify-center">
            <motion.button
              type="button"
              onClick={() => handleToggle('graphicAdaptation', 'Yes')}
              className={`px-8 py-3 rounded-lg border ${
                formData.graphicAdaptation === 'Yes'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.yes')}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('graphicAdaptation', 'No')}
              className={`px-8 py-3 rounded-lg border ${
                formData.graphicAdaptation === 'No'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.no')}
            </motion.button>
          </div>
        ),
      },
      {
        question: t('contact.q13'),
        input: (
          <div className="flex gap-4 justify-center">
            <motion.button
              type="button"
              onClick={() => handleToggle('webAppAdaptation', 'Yes')}
              className={`px-8 py-3 rounded-lg border ${
                formData.webAppAdaptation === 'Yes'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.yes')}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('webAppAdaptation', 'No')}
              className={`px-8 py-3 rounded-lg border ${
                formData.webAppAdaptation === 'No'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.no')}
            </motion.button>
          </div>
        ),
      },
      {
        question: t('contact.q14'),
        input: (
          <div className="flex gap-4 justify-center">
            <motion.button
              type="button"
              onClick={() => handleToggle('scenography', 'Yes')}
              className={`px-8 py-3 rounded-lg border ${
                formData.scenography === 'Yes'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.yes')}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleToggle('scenography', 'No')}
              className={`px-8 py-3 rounded-lg border ${
                formData.scenography === 'No'
                  ? 'bg-white text-bg-global border-white'
                  : 'bg-transparent text-white border-white/20'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {t('contact.no')}
            </motion.button>
          </div>
        ),
      },
      {
        question: t('contact.q15'),
        input: (
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-3 bg-bg-global border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors resize-none"
            placeholder={t('contact.placeholder.additional')}
            autoFocus
          />
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
              {t('contact.step')} {currentStep} {t('contact.of')} {TOTAL_STEPS}
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
    <section id="contact" className="h-[100svh] flex items-center py-10 lg:py-12 scroll-mt-[66px] overflow-hidden">
      {/* Animation de lignes avec glitch sur la droite */}
      <GlitchLinesAnimation zIndex={5} />
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
