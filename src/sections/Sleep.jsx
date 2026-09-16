import React from 'react'
import { motion } from 'motion/react'
import { MoonStar } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'

export default function Sleep() {
  return (
    <section className="sleep-section" id="sleep">
      <div className="container">
        <SectionHeading kicker="SLEEP, DECODED" title="Make tonight work for tomorrow." body="See every stage, understand what shaped it and build a sleep rhythm your nervous system can trust." align="center" />
        <div className="sleep-grid">
          <motion.div className="sleep-visual" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .9 }}>
            <div className="moon-glow" />
            <div className="sleep-face">
              <span className="sleep-eye sleep-eye--left" />
              <span className="sleep-eye sleep-eye--right" />
              <span className="sleep-mouth" />
            </div>
            <div className="sleep-floating-tag"><MoonStar size={16} /> Nervous system restored</div>
          </motion.div>

          <motion.div className="sleep-dashboard" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .9 }}>
            <div className="dashboard-head"><span>LAST NIGHT</span><strong>7<small>H</small> 44<small>M</small></strong></div>
            <div className="sleep-score-large">
              <div className="sleep-donut"><strong>91</strong><span>Excellent</span></div>
              <div><span className="metric-eyebrow">RECOVERY SIGNAL</span><h3>You are ready for a high-output day.</h3></div>
            </div>
            <div className="sleep-stage-list">
              <div><span><i className="stage-dot stage-dot--deep" />Deep sleep</span><strong>1h 32m</strong><em>20%</em></div>
              <div><span><i className="stage-dot stage-dot--rem" />REM sleep</span><strong>1h 48m</strong><em>24%</em></div>
              <div><span><i className="stage-dot stage-dot--light" />Light sleep</span><strong>4h 24m</strong><em>56%</em></div>
            </div>
            <div className="sleep-wave">{Array.from({ length: 44 }, (_, i) => <span key={i} style={{ height: `${18 + ((i * 17) % 52)}%` }} />)}</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
