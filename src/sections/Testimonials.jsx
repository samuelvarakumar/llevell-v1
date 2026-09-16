import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'

const reviews = [
  {
    name: 'Maya Rao', role: 'Creative director · Bengaluru', metric: 'READINESS 88',
    quote: 'LLeveLL made recovery feel practical. I stopped obsessing over every number and started acting on one clear recommendation each morning.',
    tones: ['#9db4a1', '#e2d4c2']
  },
  {
    name: 'Arjun Mehta', role: 'Endurance runner · Hyderabad', metric: 'HRV +14%',
    quote: 'The pattern insights changed my training. I finally understood which late meetings and meals were quietly hurting my next day.',
    tones: ['#a7a4bd', '#c8bb9d']
  },
  {
    name: 'Leena Thomas', role: 'Founder · Mumbai', metric: 'SLEEP 7H 51M',
    quote: 'It feels less like a fitness tracker and more like a calm health companion. The design is discreet and the advice is genuinely useful.',
    tones: ['#b89a8b', '#d6c8b7']
  }
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const next = () => setActive((active + 1) % reviews.length)
  const prev = () => setActive((active - 1 + reviews.length) % reviews.length)
  const review = reviews[active]

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <SectionHeading kicker="REAL LIFE, BETTER READ" title="What changes when you understand yourself." align="center" />
        <div className="testimonial-stage">
          <AnimatePresence mode="wait">
            <motion.div key={active} className="testimonial-card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .45 }}>
              <div className="portrait" style={{ '--tone-one': review.tones[0], '--tone-two': review.tones[1] }}>
                <div className="portrait-head" />
                <div className="portrait-hair" />
                <div className="portrait-body" />
                <span className="portrait-metric">{review.metric}</span>
              </div>
              <div className="testimonial-copy">
                <span className="quote-mark">“</span>
                <blockquote>{review.quote}</blockquote>
                <div><strong>{review.name}</strong><span>{review.role}</span></div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="testimonial-controls">
            <button className="icon-button" onClick={prev} aria-label="Previous testimonial"><ArrowLeft /></button>
            <div className="testimonial-dots">{reviews.map((_, i) => <button key={i} onClick={() => setActive(i)} className={i === active ? 'active' : ''} aria-label={`Show testimonial ${i + 1}`} />)}</div>
            <button className="icon-button" onClick={next} aria-label="Next testimonial"><ArrowRight /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
