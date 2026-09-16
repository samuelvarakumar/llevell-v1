import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import AppsShowcase3D from './AppsShowcase3D'

export const apps = [
  {
    number: '01',
    eyebrow: 'WEB APPLICATION',
    title: 'App name',
    description: 'Replace this with a short description of your first application and the problem it solves.',
    status: 'PROJECT LINK COMING SOON',
    href: '#',
    variant: 'dashboard',
  },
  {
    number: '02',
    eyebrow: 'MOBILE PRODUCT',
    title: 'App name',
    description: 'Replace this with a short description of your second application and its key experience.',
    status: 'PROJECT LINK COMING SOON',
    href: '#',
    variant: 'mobile',
  },
  {
    number: '03',
    eyebrow: 'SAAS PLATFORM',
    title: 'App name',
    description: 'Replace this with a short description of your third application and the workflow it improves.',
    status: 'PROJECT LINK COMING SOON',
    href: '#',
    variant: 'platform',
  },
  {
    number: '04',
    eyebrow: 'AI PRODUCT',
    title: 'App name',
    description: 'Replace this with a short description of your fourth application and its intelligent capability.',
    status: 'PROJECT LINK COMING SOON',
    href: '#',
    variant: 'ai',
  },
]

function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  )
}

function ArrowGlyph({ direction = 'right' }) {
  return (
    <svg className={direction === 'left' ? 'is-left' : ''} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 12h10M13 8l4 4-4 4" />
    </svg>
  )
}

function ExternalGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

export default function AppsShowcase({ open, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const wheelRef = useRef({ accumulated: 0, lastStepAt: 0, resetTimer: null })
  const activeApp = apps[activeIndex]

  const goTo = (index) => {
    const total = apps.length
    setActiveIndex(((index % total) + total) % total)
  }

  const previous = () => setActiveIndex((current) => (current - 1 + apps.length) % apps.length)
  const next = () => setActiveIndex((current) => (current + 1) % apps.length)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.documentElement.style.overflow
    const previouslyFocused = document.activeElement
    document.documentElement.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      rootRef.current?.querySelector('.apps-universe__close')?.focus()
    }, 420)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((current) => (current - 1 + apps.length) % apps.length)
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((current) => (current + 1) % apps.length)
      }

      if (event.key !== 'Tab' || !rootRef.current) return
      const focusable = [...rootRef.current.querySelectorAll(
        'button:not([disabled]), a[href]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.offsetParent !== null)

      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.documentElement.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  useEffect(() => () => {
    window.clearTimeout(wheelRef.current.resetTimer)
  }, [])

  const handleWheel = (event) => {
    if (!open) return
    const wheel = wheelRef.current
    const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
      ? event.deltaY
      : event.deltaX

    wheel.accumulated += dominantDelta
    window.clearTimeout(wheel.resetTimer)
    wheel.resetTimer = window.setTimeout(() => {
      wheel.accumulated = 0
    }, 170)

    const now = window.performance.now()
    if (Math.abs(wheel.accumulated) < 54 || now - wheel.lastStepAt < 290) return

    const direction = wheel.accumulated > 0 ? 1 : -1
    wheel.accumulated = 0
    wheel.lastStepAt = now
    setActiveIndex((current) => (current + direction + apps.length) % apps.length)
  }

  return (
    <section
      ref={rootRef}
      className={`apps-universe ${open ? 'apps-universe--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Llevell applications"
      inert={!open}
    >
      <button
        className="apps-universe__backdrop"
        type="button"
        onClick={onClose}
        aria-label="Close applications"
        tabIndex={open ? 0 : -1}
      />

      <div className="apps-universe__surface" data-lenis-prevent>
        <div className="apps-universe__grain" aria-hidden="true" />
        <div className="apps-universe__glow apps-universe__glow--one" aria-hidden="true" />
        <div className="apps-universe__glow apps-universe__glow--two" aria-hidden="true" />

        <header className="apps-universe__header">
          <div className="apps-universe__brandline">
            <span>LLEVELL</span>
            <i />
            <span>APP ECOSYSTEM</span>
          </div>

          <div className="apps-universe__header-actions">
            <span>{String(apps.length).padStart(2, '0')} DIGITAL PRODUCTS</span>
            <button
              className="apps-universe__close"
              type="button"
              onClick={onClose}
              aria-label="Close applications"
              tabIndex={open ? 0 : -1}
            >
              <CloseGlyph />
            </button>
          </div>
        </header>

        <div className="apps-universe__stage" onWheel={handleWheel}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeApp.number}
              className="apps-universe__copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="apps-universe__meta">
                <span>{activeApp.number}</span>
                <i />
                <span>{activeApp.eyebrow}</span>
              </div>

              <h2>{activeApp.title}</h2>
              <p>{activeApp.description}</p>

              <div className="apps-universe__status">
                <span className="apps-universe__status-dot" />
                {activeApp.status}
              </div>

              <a
                href={activeApp.href}
                className={`apps-universe__launch ${activeApp.href === '#' ? 'is-disabled' : ''}`}
                onClick={(event) => {
                  if (activeApp.href === '#') event.preventDefault()
                }}
                tabIndex={open && activeApp.href !== '#' ? 0 : -1}
                aria-disabled={activeApp.href === '#'}
              >
                <span>Open product</span>
                <ExternalGlyph />
              </a>
            </motion.div>
          </AnimatePresence>

          <div className="apps-universe__visual" aria-label="Interactive three-dimensional app carousel">
            <AppsShowcase3D
              apps={apps}
              activeIndex={activeIndex}
              onSelect={goTo}
              open={open}
            />
          </div>

          <div className="apps-universe__controls" aria-label="Application carousel controls">
            <button type="button" onClick={previous} aria-label="Previous application" tabIndex={open ? 0 : -1}>
              <ArrowGlyph direction="left" />
            </button>
            <div className="apps-universe__progress" aria-hidden="true">
              <span style={{ '--progress': `${((activeIndex + 1) / apps.length) * 100}%` }} />
            </div>
            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(apps.length).padStart(2, '0')}</span>
            <button type="button" onClick={next} aria-label="Next application" tabIndex={open ? 0 : -1}>
              <ArrowGlyph />
            </button>
          </div>

          <nav className="apps-universe__rail" aria-label="Choose an application">
            {apps.map((app, index) => (
              <button
                key={app.number}
                type="button"
                className={activeIndex === index ? 'is-active' : ''}
                onClick={() => goTo(index)}
                aria-pressed={activeIndex === index}
                tabIndex={open ? 0 : -1}
              >
                <span>{app.number}</span>
                <strong>{app.title}</strong>
                <i />
              </button>
            ))}
          </nav>

          <div className="apps-universe__hint" aria-hidden="true">
            Drag your cursor · use arrow keys · scroll to explore
          </div>
        </div>
      </div>
    </section>
  )
}
