import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { Code2, PenTool, Search } from 'lucide-react'
import ServiceRingCanvas from '../components/ServiceRingCanvas'
import './RingLab.css'

const services = [
  {
    number: '01',
    mobileLabel: 'UI / UX',
    title: 'UI & UX Design',
    line: 'Make it easy. Make it beautiful.',
    details: 'UX Research · Product Design · UI Design · Design Systems · Web · Mobile · SaaS · Dashboards · Prototypes · UX Audits · AI UX · Wireframes · AI Legible Designs · AI Assisted Designs',
    icon: PenTool,
  },
  {
    number: '02',
    mobileLabel: 'Build',
    title: 'Product Development',
    line: 'From pixels to production.',
    details: 'Web Apps · Websites · Mobile Apps · SaaS · E-commerce · React · Next.js · 3.js · Flutter · Angular · APIs · Cloud · CMS · AI Integrations · AI Products',
    icon: Code2,
  },
  {
    number: '03',
    mobileLabel: 'Brand',
    title: 'Branding',
    line: 'Give your brand a point of view.',
    details: 'Brand Strategy · Naming · Logo · Visual Identity · Brand Systems · Guidelines · Brand Voice · Digital Branding',
    icon: PenTool,
  },
  {
    number: '04',
    mobileLabel: 'Grow',
    title: 'Marketing',
    line: 'Be there when people search.',
    details: 'Technical SEO · Content · Keywords · Search Intent · Local SEO · International SEO · Performance · Schema · Analytics · GEO · AEO · AI Search Optimization · AI Visibility · Entity Optimization · Structured Content · AI-Citable Content · AI Search',
    icon: Search,
  },
]

const clampIndex = (value) => Math.min(services.length - 1, Math.max(0, Math.floor(value * services.length)))

function getCapabilities(service) {
  return service.details.split(' · ').filter(Boolean)
}

function StageAnnotations({ activeIndex, localProgress }) {
  if (activeIndex === 0) {
    return (
      <div className="cinematic-annotations cinematic-annotations--design">
        <motion.div className="design-draw-progress" style={{ scaleX: localProgress }} />
      </div>
    )
  }

  return null
}

function CapabilityList({ service, compact = false }) {
  const capabilities = useMemo(() => getCapabilities(service), [service])
  const limit = compact ? 8 : 11
  const visible = capabilities.slice(0, limit)
  const hiddenCount = Math.max(0, capabilities.length - visible.length)

  return (
    <div className="service-capabilities" aria-label={`${service.title} capabilities`}>
      {visible.map((item, index) => (
        <motion.span
          key={`${service.number}-${item}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: index * 0.025 }}
        >
          {item}
        </motion.span>
      ))}
      {hiddenCount > 0 && <span className="service-capabilities__more">+{hiddenCount} more</span>}
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
        <header className="mobile-services__header">
          <div className="mobile-services__eyebrow"><i /> OUR SERVICES</div>
          <h2>Four disciplines.<br /><em>One connected system.</em></h2>
          <p>Strategy, design and technology working as one — from first idea to measurable growth.</p>
        </header>

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
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-services__copy">
              <div className="mobile-services__meta">
                <span>SERVICE {service.number}</span>
                <small>{String(activeIndex + 1).padStart(2, '0')} / 04</small>
              </div>

              <div className="mobile-services__title-row">
                <span className="mobile-services__icon"><ServiceIcon size={18} /></span>
                <h3>{service.title}</h3>
              </div>

              <p className="mobile-services__line">{service.line}</p>
              <CapabilityList service={service} compact />
            </div>

            <div className="mobile-services__visual" aria-hidden="true">
              <div className="mobile-services__visual-head">
                <span>LIVE SYSTEM</span>
                <small>0{activeIndex + 1}</small>
              </div>
              <span className="mobile-services__ghost-number">{service.number}</span>
              <ServiceRingCanvas activeIndex={activeIndex} scrollProgress={sceneProgress} />
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

        <div className="cinematic-services__shell">
          <header className="cinematic-services__header">
            <div className="cinematic-services__eyebrow"><i /> OUR SERVICES</div>
            <div className="cinematic-services__headline">
              <h2>Four disciplines.<br /><em>One connected system.</em></h2>
              <p>Strategy, design and technology working as one — from first idea to measurable growth.</p>
            </div>
            <div className="cinematic-services__counter">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <i />
              <small>04</small>
            </div>
          </header>

          <div className="cinematic-services__workspace">
            <div className="cinematic-services__visual">
              <div className="cinematic-services__visual-head">
                <span>LIVE SYSTEM / {service.mobileLabel.toUpperCase()}</span>
                <small>INTERACTIVE 3D</small>
              </div>
              <span className="cinematic-services__ghost-number">{service.number}</span>
              <div className="cinematic-services__visual-orbit orbit-line--one" />
              <div className="cinematic-services__visual-orbit orbit-line--two" />
              <ServiceRingCanvas activeIndex={activeIndex} scrollProgress={smoothProgress} />
              <StageAnnotations activeIndex={activeIndex} localProgress={localProgress} />
              <div className="cinematic-services__visual-corners" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="cinematic-services__center-label"><span>LEVELED SYSTEM</span><i /><small>0{activeIndex + 1} / 04</small></div>
            </div>

            <nav className="services-constellation" aria-label="Service slides">
              {services.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    type="button"
                    key={item.number}
                    className={`service-node service-node--${index + 1} ${index === activeIndex ? 'is-active' : ''}`}
                    onClick={() => jumpTo(index)}
                    aria-current={index === activeIndex ? 'step' : undefined}
                  >
                    <span className="service-node__number">{item.number}</span>
                    <span className="service-node__icon"><Icon size={15} /></span>
                    <span className="service-node__body">
                      <strong>{item.title}</strong>
                      <em>{item.line}</em>
                    </span>
                    <span className="service-node__line"><motion.i animate={{ scaleX: index === activeIndex ? localProgress : 0 }} /></span>
                  </button>
                )
              })}
            </nav>

            <motion.aside
              className="service-focus-card"
              key={service.number}
              initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: .5, ease: [.22,1,.36,1] }}
            >
              <div className="service-focus-card__top">
                <span>SERVICE {service.number}</span>
                <span>{String(activeIndex + 1).padStart(2, '0')} / 04</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.line}</p>
              <CapabilityList service={service} />
            </motion.aside>
          </div>

          <footer className="cinematic-services__footer">
            <span>SCROLL TO EXPLORE SERVICES</span>
            <div className="cinematic-services__steps" aria-hidden="true">
              {services.map((item, index) => <i key={item.number} className={index <= activeIndex ? 'is-on' : ''} />)}
            </div>
            <small>DESIGN → BUILD → BRAND → GROW</small>
          </footer>
        </div>
      </div>
    </section>
  )
}
