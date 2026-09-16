import React from 'react'
import { motion } from 'motion/react'

export default function SectionHeading({ kicker, title, body, light = false, align = 'left' }) {
  return (
    <motion.div
      className={`section-heading section-heading--${align} ${light ? 'section-heading--light' : ''}`}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .35 }}
      transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </motion.div>
  )
}
