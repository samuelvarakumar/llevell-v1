import React from 'react'
import { motion } from 'motion/react'

export default function ProductRing({ className = '', dark = false }) {
  return (
    <motion.div
      className={`product-ring ${dark ? 'product-ring--dark' : ''} ${className}`}
      animate={{ rotateY: [0, 16, 0, -14, 0], rotateX: [0, -6, 0, 5, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="ring-outer" />
      <div className="ring-inner" />
      <div className="ring-shine" />
      <div className="sensor sensor-a" />
      <div className="sensor sensor-b" />
      <div className="sensor sensor-c" />
    </motion.div>
  )
}
