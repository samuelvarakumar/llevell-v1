import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight, HeartPulse, ShieldCheck, Waves } from 'lucide-react'
import React, { useRef } from 'react'
import RingCanvas from '../components/RingCanvas'
import SectionHeading from '../components/SectionHeading'

export default function Heart() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 85, damping: 25, mass: 0.5 })
  const y = useTransform(smoothProgress, [0, 1], [70, -70])

  return (
    <section className="heart-section" id="heart" ref={ref}>
      <div className="container heart-layout">
        <div className="heart-copy">
          <SectionHeading light kicker="HEART HEALTH" title="Clarity, right at your fingertips." body="Continuous heart rate, resting trends and HRV reveal how your system responds to work, stress, recovery and life." />
          <div className="heart-features">
            <div><HeartPulse /><span><strong>24/7 pulse tracking</strong>Stay aware without staring at a screen.</span></div>
            <div><Waves /><span><strong>Personal HRV baseline</strong>Understand recovery in your own context.</span></div>
            <div><ShieldCheck /><span><strong>Secure by design</strong>Your health data remains yours.</span></div>
          </div>
          <a className="text-link text-link--light" href="#testimonials">See the experience <ArrowUpRight size={17} /></a>
        </div>
        <div className="heart-stage heart-stage--3d">
          <div className="heart-radar"><span /><span /><span /><span /></div>
          <motion.div style={{ y }} className="heart-ring-holder heart-ring-holder--3d">
            <RingCanvas mode="heart" finish="graphite" scrollProgress={smoothProgress} dark cameraZ={7} />
          </motion.div>
          <div className="bpm-card"><span>LIVE HEART RATE</span><strong>72 <small>bpm</small></strong><div className="mini-pulse" /></div>
          <div className="heart-glow" />
        </div>
      </div>
    </section>
  )
}
