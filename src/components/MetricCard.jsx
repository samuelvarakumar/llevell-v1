import React from 'react'
import { motion } from 'motion/react'

export default function MetricCard({ eyebrow, value, suffix, note, className = '', delay = 0 }) {
  return (
    <motion.article
      className={`metric-card ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .5 }}
      transition={{ duration: .65, delay }}
    >
      <span className="metric-eyebrow">{eyebrow}</span>
      <div className="metric-value">{value}<small>{suffix}</small></div>
      {note && <p>{note}</p>}
      <div className="metric-sparkline" aria-hidden="true">
        {[30, 58, 44, 72, 50, 82, 65, 92].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
      </div>
    </motion.article>
  )
}
