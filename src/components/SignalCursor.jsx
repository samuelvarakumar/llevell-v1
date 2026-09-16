import React, { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  'summary',
  'input[type="submit"]',
  'input[type="button"]',
  '[data-cursor="interactive"]',
].join(', ')

const TEXT_SELECTOR = [
  'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"])',
  'textarea',
  'select',
  '[contenteditable="true"]',
].join(', ')

const EXPLORE_SELECTOR = 'canvas, [data-cursor="explore"]'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function SignalCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const trailX = useSpring(x, { stiffness: 520, damping: 34, mass: 0.24 })
  const trailY = useSpring(y, { stiffness: 520, damping: 34, mass: 0.24 })

  const rootRef = useRef(null)
  const pointerRef = useRef(null)
  const magnetRef = useRef(null)
  const activeTargetRef = useRef(null)
  const lastRef = useRef({ x: 0, y: 0, time: performance.now() })
  const rafRef = useRef(0)
  const settleRef = useRef(0)
  const activatedRef = useRef(false)

  useEffect(() => {
    const root = rootRef.current
    const pointer = pointerRef.current
    const magnet = magnetRef.current
    if (!root || !pointer || !magnet) return undefined

    const html = document.documentElement

    const activate = () => {
      if (activatedRef.current) return
      activatedRef.current = true
      html.classList.add('llevell-cursor-active')
      root.classList.add('is-enabled')
    }

    const setMagnet = (target) => {
      activeTargetRef.current = target

      if (!target) {
        root.classList.remove('is-interactive')
        magnet.classList.remove('is-active')
        return
      }

      const rect = target.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const computed = window.getComputedStyle(target)
      const parsedRadius = Number.parseFloat(computed.borderTopLeftRadius) || 0
      const radius = clamp(parsedRadius + 6, 8, 24)
      const pad = 6

      magnet.style.setProperty('--magnet-x', `${rect.left - pad}px`)
      magnet.style.setProperty('--magnet-y', `${rect.top - pad}px`)
      magnet.style.setProperty('--magnet-w', `${rect.width + pad * 2}px`)
      magnet.style.setProperty('--magnet-h', `${rect.height + pad * 2}px`)
      magnet.style.setProperty('--magnet-radius', `${radius}px`)

      root.classList.add('is-interactive')
      magnet.classList.add('is-active')
    }

    const refreshMagnet = () => {
      if (activeTargetRef.current) setMagnet(activeTargetRef.current)
    }

    const updateMode = (target) => {
      const textTarget = target?.closest?.(TEXT_SELECTOR)
      const exploreTarget = target?.closest?.(EXPLORE_SELECTOR)
      const interactiveTarget = textTarget ? null : target?.closest?.(INTERACTIVE_SELECTOR)

      root.classList.toggle('is-text', Boolean(textTarget))
      root.classList.toggle('is-explore', Boolean(exploreTarget))

      if (exploreTarget || textTarget) {
        setMagnet(null)
      } else if (interactiveTarget !== activeTargetRef.current) {
        setMagnet(interactiveTarget || null)
      }
    }

    const move = (event) => {
      // Chrome on hybrid Windows devices can report the primary pointer as
      // coarse. Pointer type is the reliable signal that a real mouse exists.
      if (event.pointerType && event.pointerType !== 'mouse') return

      activate()
      root.classList.add('is-visible')
      x.set(event.clientX)
      y.set(event.clientY)
      updateMode(event.target)

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const now = performance.now()
        const previous = lastRef.current
        const elapsed = Math.max(8, now - previous.time)
        const dx = event.clientX - previous.x
        const dy = event.clientY - previous.y
        const speed = clamp(Math.hypot(dx, dy) / elapsed / 1.55, 0, 1)
        const tilt = clamp(dx * 0.42, -10, 10)
        const distance = clamp(4 + speed * 9, 4, 13)
        const length = Math.max(1, Math.hypot(dx, dy))
        const nx = dx / length
        const ny = dy / length

        root.style.setProperty('--cursor-speed', speed.toFixed(3))
        root.style.setProperty('--cursor-scale', (1 + speed * 0.08).toFixed(3))
        root.style.setProperty('--cursor-tilt', `${tilt.toFixed(2)}deg`)
        root.style.setProperty('--tail-x', `${(-nx * distance).toFixed(2)}px`)
        root.style.setProperty('--tail-y', `${(-ny * distance).toFixed(2)}px`)
        root.classList.toggle('is-moving', speed > 0.045)

        window.clearTimeout(settleRef.current)
        settleRef.current = window.setTimeout(() => {
          root.classList.remove('is-moving')
          root.style.setProperty('--cursor-speed', '0')
          root.style.setProperty('--cursor-scale', '1')
          root.style.setProperty('--cursor-tilt', '0deg')
          root.style.setProperty('--tail-x', '0px')
          root.style.setProperty('--tail-y', '0px')
        }, 95)

        lastRef.current = { x: event.clientX, y: event.clientY, time: now }
      })
    }

    const mouseMoveFallback = (event) => {
      if (window.PointerEvent) return
      move(event)
    }

    const down = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      root.classList.add('is-pressed')
    }

    const up = () => root.classList.remove('is-pressed')
    const leave = () => root.classList.remove('is-visible')
    const enter = () => activatedRef.current && root.classList.add('is-visible')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('mousemove', mouseMoveFallback, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('scroll', refreshMagnet, { passive: true })
    window.addEventListener('resize', refreshMagnet, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.clearTimeout(settleRef.current)
      html.classList.remove('llevell-cursor-active')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('mousemove', mouseMoveFallback)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('scroll', refreshMagnet)
      window.removeEventListener('resize', refreshMagnet)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [x, y])

  return (
    <div className="identity-cursor" aria-hidden="true" ref={rootRef}>
      <span className="identity-cursor__magnet" ref={magnetRef}>
        <i className="identity-cursor__corner identity-cursor__corner--tl" />
        <i className="identity-cursor__corner identity-cursor__corner--tr" />
        <i className="identity-cursor__corner identity-cursor__corner--br" />
        <i className="identity-cursor__corner identity-cursor__corner--bl" />
      </span>

      <motion.span
        className="identity-cursor__trail"
        style={{ x: trailX, y: trailY }}
      >
        <i /><i /><i />
      </motion.span>

      <motion.span
        className="identity-cursor__pointer"
        ref={pointerRef}
        style={{ x, y }}
      >
        <i className="identity-cursor__mark" />
        <i className="identity-cursor__explore-ring" />
        <i className="identity-cursor__pulse" />
      </motion.span>
    </div>
  )
}
