'use client'

import Navbar from '@/components/Navbar'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import Hero from '@/components/Hero'
import TechnologySection from '@/components/TechnologySection'
import SystemSummary from '@/components/SystemSummary'
import SystemDetails from '@/components/SystemDetails'
import TextToVideoDetails from '@/components/TextToVideoDetails'
import ModerationDetails from '@/components/ModerationDetails'
import StyleDetails from '@/components/StyleDetails'
import dynamic from 'next/dynamic'

const GallerySection = dynamic(() => import('@/components/GallerySection'), {
  ssr: false,
})
import ContactSection from '@/components/ContactSection'
import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <ScrollProgressBar />
      <main className="w-full bg-black">
        <Hero />
        <TechnologySection />
        <SystemSummary />
        <SystemDetails />
        <TextToVideoDetails />
        <ModerationDetails />
        <StyleDetails />
        <GallerySection />
        <ContactSection />
        <AboutSection />
        <Footer />
      </main>
    </>
  )
}

