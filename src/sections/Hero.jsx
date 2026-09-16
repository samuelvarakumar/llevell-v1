import React, { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import LogoCanvas from '../components/LogoCanvas'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 })
  const opacity = useTransform(smoothProgress, [0, 0.82], [1, 0.12])
  const badgeY = useTransform(smoothProgress, [0, 1], [0, -55])

  return (
    <section className="hero hero--logo-magic" id="overview" ref={ref}>
      <div className="hero-grain" />

      <div className="hero-copy container">
        <motion.span
          className="hero-kicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          WEBSITES • APPLICATIONS • DIGITAL PRODUCTS
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Ideas in layers.<br /><em className="hero-experiences-nowrap">Experiences without limits.</em>
        </motion.h1>

      </div>

      <motion.div className="hero-stage hero-stage--3d hero-stage--logo" style={{ opacity }}>
        <div className="hero-logo-halo" />
        <div className="hero-orbit hero-orbit--one" />
        <div className="hero-orbit hero-orbit--two" />

        <div className="hero-ring-3d-wrap hero-logo-3d-wrap">
          <LogoCanvas scrollProgress={smoothProgress} cameraZ={7.4} />
        </div>

        <motion.div className="hero-logo-badge" style={{ y: badgeY }}>
          <span>14</span>
          <small>signal cells<br />one system</small>
        </motion.div>

        <motion.aside
          className="hero-system-tag hero-system-tag--build"
          initial={{ opacity: 0, x: -22, rotate: -4 }}
          animate={{ opacity: 1, x: 0, rotate: -2 }}
          transition={{ duration: .8, delay: .7, ease: [0.22, 1, 0.36, 1] }}
          aria-label="LLeveLL build signal: strategy, design, development and growth"
        >
          <div className="hero-system-tag__topline">
            <span>BUILD SIGNAL</span>
            <i className="hero-system-tag__live" aria-hidden="true" />
          </div>
          <div className="hero-build-track" aria-hidden="true">
            <span>STRATEGY</span>
            <b />
            <span>DESIGN</span>
            <b />
            <span>BUILD</span>
            <b />
            <span>GROW</span>
            <i className="hero-build-track__pulse" />
          </div>
        </motion.aside>

        <motion.aside
          className="hero-system-tag hero-system-tag--ai"
          initial={{ opacity: 0, x: 22, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          transition={{ duration: .8, delay: .82, ease: [0.22, 1, 0.36, 1] }}
          aria-label="LLeveLL combines human judgement with AI velocity"
        >
          <div className="hero-system-tag__topline">
            <span>HUMAN × AI</span>
            <small>LIVE STACK</small>
          </div>
          <div className="hero-ai-stack" aria-hidden="true">
            <div>
              <span>H</span>
              <small>JUDGEMENT</small>
            </div>
            <i>+</i>
            <div>
              <span>AI</span>
              <small>VELOCITY</small>
            </div>
          </div>
          <div className="hero-ai-stack__status"><i /> THINK FASTER. BUILD SMARTER.</div>
        </motion.aside>

      </motion.div>

      <a className="scroll-cue" href="#fitness">
        <ArrowDown size={18} /> Scroll to explore
      </a>
    </section>
  )
}
