import React, { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { Check, CloudUpload, Code2, PenTool, Search, SquareTerminal } from 'lucide-react'
import ServiceRingCanvas from '../components/ServiceRingCanvas'
import ToolLogo from '../components/ToolLogo'
import './RingLab.css'

const services = [
  {
    number: '01',
    mobileLabel: 'UI / UX',
    title: 'UI & UX Design',
    line: 'Make it easy. Make it beautiful.',
    details: 'UX Research · Product Design · UI Design · Design Systems · Web · Mobile · SaaS · Dashboards · Prototypes · UX Audits · AI UX · Wireframes · AI Legible Designs · AI Assisted Designs',
    category: 'DESIGN TOOLS',
    icon: PenTool,
    tools: [
      { id: 'figma', label: 'Figma' },
      { id: 'sketch', label: 'Sketch' },
      { id: 'principle', label: 'Principle' },
      { id: 'miro', label: 'Miro' },
      { id: 'envato', label: 'Envato' },
      { id: 'adobe', label: 'Adobe' },
    ],
  },
  {
    number: '02',
    mobileLabel: 'Build',
    title: 'Product Development',
    line: 'From pixels to production.',
    details: 'Web Apps · Websites · Mobile Apps · SaaS · E-commerce · React · Next.js · 3.js · Flutter · Angular · APIs · Cloud · CMS · AI Integrations · AI Products',
    category: 'TECHNOLOGIES',
    icon: Code2,
    tools: [
      { id: 'react', label: 'React' },
      { id: 'next', label: 'Next.js' },
      { id: 'threejs', label: '3.js' },
      { id: 'flutter', label: 'Flutter' },
      { id: 'angular', label: 'Angular' },
      { id: 'cloud', label: 'APIs / Cloud' },
    ],
  },
  {
    number: '03',
    mobileLabel: 'Brand',
    title: 'Branding',
    line: 'Give your brand a point of view.',
    details: 'Brand Strategy · Naming · Logo · Visual Identity · Brand Systems · Guidelines · Brand Voice · Digital Branding',
    category: 'BRAND TOOLS',
    icon: PenTool,
    tools: [
      { id: 'adobe', label: 'Adobe' },
      { id: 'figma', label: 'Figma' },
      { id: 'sketch', label: 'Sketch' },
      { id: 'miro', label: 'Miro' },
      { id: 'envato', label: 'Envato' },
      { id: 'principle', label: 'Motion' },
    ],
  },
  {
    number: '04',
    mobileLabel: 'Grow',
    title: 'Marketing',
    line: 'Be there when people search.',
    details: 'Technical SEO · Content · Keywords · Search Intent · Local SEO · International SEO · Performance · Schema · Analytics · GEO · AEO · AI Search Optimization · AI Visibility · Entity Optimization · Structured Content · AI-Citable Content · AI Search',
    category: 'SEARCH & GROWTH',
    icon: Search,
    tools: [
      { id: 'analytics', label: 'Analytics' },
      { id: 'lighthouse', label: 'Lighthouse' },
      { id: 'wordpress', label: 'WordPress' },
      { id: 'cloudflare', label: 'Cloudflare' },
      { id: 'vercel', label: 'Vercel' },
      { id: 'github', label: 'GitHub' },
    ],
  },
]

const clampIndex = (value) => Math.min(services.length - 1, Math.max(0, Math.floor(value * services.length)))

function StageAnnotations({ activeIndex, localProgress }) {
  if (activeIndex === 0) {
    return (
      <div className="cinematic-annotations cinematic-annotations--design">
        <span className="annotation annotation--measure">120px</span>
        <span className="annotation annotation--radius">R120</span>
        <span className="annotation annotation--radius-small">R32</span>
        <span className="annotation annotation--angle">45°</span>
        <div className="annotation-toolbox">
          <PenTool size={17} />
          <span>VECTOR</span>
        </div>
        <motion.div className="design-draw-progress" style={{ scaleX: localProgress }} />
      </div>
    )
  }

  if (activeIndex === 1) {
    return (
      <div className="cinematic-annotations cinematic-annotations--development">
        <div className="dev-chip dev-chip--build"><Code2 size={18} /><span>BUILD</span></div>
        <div className="dev-chip dev-chip--compile"><SquareTerminal size={18} /><span>COMPILE</span></div>
        <div className="dev-chip dev-chip--deploy"><CloudUpload size={18} /><span>DEPLOY</span></div>

        <div className="build-terminal">
          <span>&gt; Installing modules <Check size={13} /></span>
          <span>&gt; Compiling <Check size={13} /></span>
          <span>&gt; Running tests <Check size={13} /></span>
          <span>&gt; Building assets <Check size={13} /></span>
          <strong>&gt; Build successful</strong>
        </div>

        <div className="build-progress">
          <span>BUILD PROGRESS</span>
          <div><motion.i style={{ scaleX: localProgress }} /></div>
          <b>78%</b>
        </div>
      </div>
    )
  }

  if (activeIndex === 2) {
    return (
      <div className="cinematic-annotations cinematic-annotations--branding">
        <span className="brand-note brand-note--strategy">STRATEGY</span>
        <span className="brand-note brand-note--voice">VOICE</span>
        <span className="brand-note brand-note--system">SYSTEM</span>
        <div className="brand-spectrum" />
      </div>
    )
  }

  return (
    <div className="cinematic-annotations cinematic-annotations--marketing">
      <span className="search-signal search-signal--one">SEARCH INTENT</span>
      <span className="search-signal search-signal--two">AI VISIBILITY</span>
      <span className="search-signal search-signal--three">ENTITY SIGNALS</span>
      <div className="ranking-card"><b>+38%</b><span>ORGANIC VISIBILITY</span></div>
    </div>
  )
}

function MobileServices({ activeIndex, onSelect, sectionRef }) {
  const service = services[activeIndex]
  const ServiceIcon = service.icon
  const sceneProgress = (activeIndex + 0.5) / services.length

  return (
    <section className="cinematic-services cinematic-services--mobile" id="services" ref={sectionRef}>
      <div className="mobile-services">
        <div className="mobile-services__eyebrow">
          <span>OUR SERVICES</span>
          <i aria-hidden="true" />
          <small>DESIGN. BUILD. GROW.</small>
        </div>

        <nav className="mobile-services__tabs" aria-label="Choose a service">
          {services.map((item, index) => (
            <button
              type="button"
              key={item.number}
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => onSelect(index)}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <span>{item.number}</span>
              <small>{item.mobileLabel}</small>
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.article
            className="mobile-services__card"
            key={service.number}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-services__copy">
              <div className="mobile-services__number">
                <span>{service.number}</span>
                <i aria-hidden="true" />
              </div>

              <div className="mobile-services__title-row">
                <ServiceIcon size={17} />
                <h2>{service.title}</h2>
              </div>

              <span className="mobile-services__accent" />
              <h3>{service.line}</h3>
              <p>{service.details}</p>
            </div>

            <div className="mobile-services__visual" aria-hidden="true">
              <ServiceRingCanvas
                activeIndex={activeIndex}
                scrollProgress={sceneProgress}
              />
            </div>

            <div className="mobile-services__tools-wrap">
              <span className="mobile-services__tools-label">{service.category}</span>
              <div className="mobile-services__tools">
                {service.tools.map((tool, index) => (
                  <motion.button
                    type="button"
                    key={`${service.number}-${tool.id}-${tool.label}`}
                    className="mobile-service-tool"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.025 * index }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span><ToolLogo id={tool.id} label={tool.label} /></span>
                    <small>{tool.label}</small>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default function RingLab() {
  const sectionRef = useRef(null)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const update = () => setIsMobile(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 48,
    damping: 28,
    mass: 0.82,
    restDelta: 0.0005,
    restSpeed: 0.0005,
  })

  const sectionProgress = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const localProgress = useTransform(smoothProgress, (value) => {
    const safeValue = Math.min(1, Math.max(0, value))
    const scaled = safeValue * services.length
    const index = safeValue >= 1 ? services.length - 1 : Math.floor(scaled)
    const local = Math.min(1, Math.max(0, scaled - index))
    return local * local * (3 - 2 * local)
  })

  useMotionValueEvent(smoothProgress, 'change', (value) => {
    if (isMobile) return
    const next = clampIndex(value)
    if (next === activeIndexRef.current) return
    activeIndexRef.current = next
    setActiveIndex(next)
  })

  const selectMobileService = (index) => {
    activeIndexRef.current = index
    setActiveIndex(index)
  }

  if (isMobile) {
    return <MobileServices activeIndex={activeIndex} onSelect={selectMobileService} sectionRef={sectionRef} />
  }

  const jumpTo = (index) => {
    const section = sectionRef.current
    if (!section) return
    const top = window.scrollY + section.getBoundingClientRect().top
    const distance = Math.max(0, section.offsetHeight - window.innerHeight)
    window.scrollTo({
      top: top + distance * ((index + 0.08) / services.length),
      behavior: 'smooth',
    })
  }

  const service = services[activeIndex]
  const ServiceIcon = service.icon

  return (
    <section className="cinematic-services cinematic-services--desktop" id="services" ref={sectionRef}>
      <div className="cinematic-services__sticky">
        <motion.div className="cinematic-services__top-progress" style={{ width: sectionProgress }} />
        <div className="cinematic-services__backdrop" />

        <div className="cinematic-services__header">
          <span>OUR SERVICES</span>
          <i aria-hidden="true" />
          <small>DESIGN. BUILD. GROW.</small>
        </div>

        <div className="cinematic-services__card">
          <AnimatePresence mode="wait">
            <motion.div
              className="cinematic-services__copy"
              key={service.number}
              initial={{ opacity: 0, y: 22, filter: 'blur(7px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="cinematic-services__index">
                <span>{service.number}</span>
                <i />
              </div>

              <div className="cinematic-services__title-row">
                <ServiceIcon size={19} />
                <h2>{service.title}</h2>
              </div>

              <span className="cinematic-services__accent-line" />
              <h3>{service.line}</h3>
              <p>{service.details}</p>
            </motion.div>
          </AnimatePresence>

          <div className="cinematic-services__visual">
            <ServiceRingCanvas activeIndex={activeIndex} scrollProgress={smoothProgress} />
            <StageAnnotations activeIndex={activeIndex} localProgress={localProgress} />
          </div>

          <div className="cinematic-services__tool-tray">
            <span>{service.category}</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={service.number}
                className="cinematic-services__tools"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {service.tools.map((tool, index) => (
                  <motion.button
                    type="button"
                    key={`${service.number}-${tool.id}-${tool.label}`}
                    className="cinematic-tool"
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.04 + index * 0.045 }}
                    whileHover={{ y: -6, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span><ToolLogo id={tool.id} label={tool.label} /></span>
                    <small>{tool.label}</small>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <nav className="cinematic-services__nav" aria-label="Service slides">
          {services.map((item, index) => (
            <button
              type="button"
              key={item.number}
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => jumpTo(index)}
              aria-current={index === activeIndex ? 'step' : undefined}
            >
              <span>{item.number}</span>
              <b>{item.title}</b>
              <i><motion.em animate={{ scaleX: index === activeIndex ? localProgress : 0 }} /></i>
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}
