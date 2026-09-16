import React, { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'
import Header from './components/Header'
import Hero from './sections/Hero'
import SignalStory from './sections/SignalStory'
import RingLab from './sections/RingLab'
import Accuracy from './sections/Accuracy'
import AboutUs from './sections/AboutUs'
import AIApproach from './sections/AIApproach'
import TeamStatement from './sections/TeamStatement'
import FinalCTA from './sections/FinalCTA'
import Footer from './sections/Footer'
import AppsShowcase from './components/AppsShowcase'
import Preloader from './components/Preloader'
import ContactPanel from './components/ContactPanel'
import SignalChat from './components/SignalChat'
import SignalCursor from './components/SignalCursor'

export default function App() {
  const [appsOpen, setAppsOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [signalOpen, setSignalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return undefined

    if (loading || appsOpen || contactOpen || signalOpen) lenis.stop()
    else lenis.start()

    return () => lenis.start()
  }, [lenis, appsOpen, contactOpen, signalOpen, loading])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setAppsOpen(false)
        setContactOpen(false)
        setSignalOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openApps = () => {
    setSignalOpen(false)
    setContactOpen(false)
    setAppsOpen(true)
  }

  const openContact = () => {
    setSignalOpen(false)
    setAppsOpen(false)
    setContactOpen(true)
  }

  const navigateFromSignal = (sectionId) => {
    setSignalOpen(false)
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <>
      <SignalCursor />
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div className="site-shell" aria-hidden={loading ? 'true' : undefined}>
      <Header onApps={openApps} appsOpen={appsOpen} onContact={openContact} contactOpen={contactOpen} />

      <main>
        <Hero onShop={openApps} />
        <SignalStory />
        <RingLab />
        <Accuracy />
        <AboutUs />
        <AIApproach />
        <TeamStatement />
        <FinalCTA onApps={openApps} />
      </main>

      <Footer />
      <AppsShowcase open={appsOpen} onClose={() => setAppsOpen(false)} />
      <ContactPanel open={contactOpen} onClose={() => setContactOpen(false)} />
      <SignalChat
        open={signalOpen}
        onOpen={() => {
          setAppsOpen(false)
          setContactOpen(false)
          setSignalOpen(true)
        }}
        onClose={() => setSignalOpen(false)}
        onNavigate={navigateFromSignal}
        onApps={openApps}
        onContact={openContact}
        blocked={appsOpen || contactOpen || loading}
      />
      </div>
    </>
  )
}