import React, { useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import './TeamStatement.css'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const testimonials = [
  {
    brand: 'VERDANT',
    logo: '/projects/verdant-logo.svg',
    preview: '/projects/verdant-preview.gif',
    projectUrl: '',
    quote:
      'Thoughtful work, sharp collaboration and a team that knows how to turn complexity into something clear.',
    name: 'PARTNER NOTE',
    role: 'Brand & Marketing',
  },
  {
    brand: 'REMEDIA',
    logo: '/projects/remedia-logo.svg',
    preview: '/projects/remedia-preview.gif',
    projectUrl: '',
    quote:
      'The team immersed themselves in the story quickly and kept strategy, design and execution moving together.',
    name: 'PARTNER NOTE',
    role: 'Creative Direction',
  },
  {
    brand: 'KALYANI MUDUMBA',
    logo: '/projects/kalyani-logo.svg',
    preview: '/projects/kalyani-preview.gif',
    projectUrl: '',
    quote:
      'An exceptional creative partner — responsive, rigorous and committed to pushing the experience forward.',
    name: 'PARTNER NOTE',
    role: 'Product & Experience',
  },
  {
    brand: 'ASR',
    logo: '/projects/asr-logo.svg',
    preview: '/projects/asr-preview.gif',
    projectUrl: '',
    quote:
      'They bring ambition to complicated digital work while staying flexible, collaborative and focused on the outcome.',
    name: 'PARTNER NOTE',
    role: 'Digital Product',
  },
]

function CurvedGlassCard({ item, index, progress }) {
  /*
    Rebuilt from the uploaded Noomo recording.

    All four cards share ONE horizontal conveyor.
    Fixed spacing between cards: ~23.4vw.

    Each card's vertical position, scale and perspective are derived
    from its CURRENT x position, creating the same curved carousel path:
      right edge -> lower / slightly smaller
      centre     -> highest / full scale
      left edge  -> lower / slightly smaller
  */

  const cardLeft = (value) => {
    const t = clamp((value - 0.17) / 0.70, 0, 1)
    const trackX = 112 - t * 222
    return trackX + index * 23.4
  }

  const x = useTransform(progress, (value) => `${cardLeft(value)}vw`)

  const y = useTransform(progress, (value) => {
    const left = cardLeft(value)
    const cardCenter = left + 9.15
    const q = clamp((cardCenter - 50) / 50, -1.25, 1.25)

    // Matches the arc seen in the screen recording:
    // ~37vh at centre, falling to ~52–55vh at the edges.
    const top = 37 + 25 * q * q
    return `${top}vh`
  })

  const scale = useTransform(progress, (value) => {
    const left = cardLeft(value)
    const cardCenter = left + 9.15
    const q = clamp((cardCenter - 50) / 55, -1.2, 1.2)
    return 1 - Math.min(0.085, Math.abs(q) * 0.07)
  })

  const rotateY = useTransform(progress, (value) => {
    const left = cardLeft(value)
    const cardCenter = left + 9.15
    const q = clamp((cardCenter - 50) / 55, -1.15, 1.15)
    return -q * 5.2
  })

  const rotateX = useTransform(progress, (value) => {
    const left = cardLeft(value)
    const cardCenter = left + 9.15
    const q = clamp((cardCenter - 50) / 55, -1.15, 1.15)
    return Math.abs(q) * 1.7
  })

  const rotateZ = useTransform(progress, (value) => {
    const left = cardLeft(value)
    const cardCenter = left + 9.15
    const q = clamp((cardCenter - 50) / 55, -1.15, 1.15)
    return q * 0.42
  })

  const z = useTransform(progress, (value) => {
    const left = cardLeft(value)
    const cardCenter = left + 9.15
    const q = clamp((cardCenter - 50) / 55, -1, 1)
    return 52 * (1 - q * q)
  })

  return (
    <motion.article
      className={`noomo-glass-card noomo-glass-card--${index + 1}`}
      style={{
        x,
        y,
        scale,
        rotateX,
        rotateY,
        rotateZ,
        z,
      }}
    >
      <div className="noomo-glass-card__optics" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>

      {index <= 3 ? (
        <div className="project-showcase-card">
          <div className="project-showcase-card__header">
            <img
              src={item.logo}
              alt={item.brand}
              className="project-showcase-card__logo"
            />

            <a
              className="project-showcase-card__link"
              href={item.projectUrl || undefined}
              target={item.projectUrl ? '_blank' : undefined}
              rel={item.projectUrl ? 'noreferrer' : undefined}
              aria-label={`Open ${item.brand} project`}
            >
              <ExternalLink aria-hidden="true" />
            </a>
          </div>

          <p className="project-showcase-card__quote">“{item.quote}”</p>

          <div className="project-showcase-card__media">
            <img
              src={item.preview}
              alt={`${item.brand} project website preview`}
              className="project-showcase-card__preview"
            />
          </div>
        </div>
      ) : (
        <>
          <strong className="noomo-glass-card__brand">{item.brand}</strong>

          <p className="noomo-glass-card__quote">“{item.quote}”</p>

          <div className="noomo-glass-card__person">
            <b>{item.name}</b>
            <span>{item.role}</span>
          </div>
        </>
      )}
    </motion.article>
  )
}

export default function TeamStatement() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  /*
    Less spring lag than the previous version.
    The recording feels tightly tied to scroll, but not robotic.
  */
  const progress = useSpring(scrollYProgress, {
    stiffness: 165,
    damping: 38,
    mass: 0.27,
    restDelta: 0.00025,
  })

  const hazeX = useTransform(progress, [0.17, 0.87], ['4vw', '-4vw'])

  return (
    <section ref={sectionRef} className="noomo-team" id="team">
      <div className="noomo-team__sticky">
        <div className="noomo-team__wash" aria-hidden="true" />

        <h2 className="noomo-team__headline">
          <span>MADE AT LLeveLL.</span>
          <em className="noomo-team__headline-accent">Selected projects. Real outcomes.</em>
        </h2>

        <p className="noomo-team__copy">
          These projects show how strategy, design and development come together
          in practice. Each one starts with a real problem and ends with an
          outcome that matters.
        </p>

        <div className="noomo-team__card-field">
          {testimonials.map((item, index) => (
            <CurvedGlassCard
              key={item.brand}
              item={item}
              index={index}
              progress={progress}
            />
          ))}
        </div>

        <motion.div
          className="noomo-team__haze noomo-team__haze--blue"
          aria-hidden="true"
          style={{ x: hazeX }}
        />

        <motion.div
          className="noomo-team__haze noomo-team__haze--pink"
          aria-hidden="true"
          style={{ x: hazeX }}
        />
      </div>
    </section>
  )
}
