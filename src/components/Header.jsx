import React, { useEffect, useRef, useState } from 'react'

const links = [
  ['Overview', '#overview'],
  ['Fitness', '#fitness'],
  ['Sleep', '#sleep'],
  ['Heart', '#heart'],
]

function LlevellWordmark({ className = '' }) {
  return (
    <img
      src="/llevell-final-white.svg"
      alt=""
      className={`llevell-wordmark-image ${className}`.trim()}
      aria-hidden="true"
      draggable="false"
    />
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.75 10.6 12 3.9l8.25 6.7v8.15a1.35 1.35 0 0 1-1.35 1.35h-4.55v-5.35h-4.7v5.35H5.1a1.35 1.35 0 0 1-1.35-1.35V10.6Z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.2h16M4 12h16M4 16.8h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  )
}

function AppsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect className="apps-icon-tile apps-icon-tile--one" x="4.25" y="4.25" width="6.1" height="6.1" rx="1.45" />
      <rect className="apps-icon-tile apps-icon-tile--two" x="13.65" y="4.25" width="6.1" height="6.1" rx="1.45" />
      <rect className="apps-icon-tile apps-icon-tile--three" x="4.25" y="13.65" width="6.1" height="6.1" rx="1.45" />
      <rect className="apps-icon-tile apps-icon-tile--four" x="13.65" y="13.65" width="6.1" height="6.1" rx="1.45" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

export default function Header({ onApps, appsOpen = false, onContact, contactOpen = false }) {
  const [compact, setCompact] = useState(false)
  const [smallScreen, setSmallScreen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [appsHintDismissed, setAppsHintDismissed] = useState(false)

  const compactRef = useRef(false)
  const desiredCompactRef = useRef(false)
  const changeTimerRef = useRef(null)
  const scrollFrameRef = useRef(null)
  const manuallyExpandedRef = useRef(false)
  const manualExpandScrollYRef = useRef(0)

  useEffect(() => {
    const applyCompactState = (nextCompact) => {
      compactRef.current = nextCompact
      desiredCompactRef.current = nextCompact
      setCompact(nextCompact)
    }

    const scheduleCompactState = (nextCompact) => {
      if (desiredCompactRef.current === nextCompact) return

      desiredCompactRef.current = nextCompact
      window.clearTimeout(changeTimerRef.current)

      // A short pause avoids the header changing at the exact same
      // instant the hero crosses the top edge. The CSS then performs
      // the longer staged morph.
      const delay = nextCompact ? 180 : 110
      changeTimerRef.current = window.setTimeout(() => {
        applyCompactState(nextCompact)
      }, delay)
    }

    const evaluateHeader = () => {
      // On desktop, clicking the compact menu temporarily restores the full
      // navigation. The first intentional scroll collapses it again.
      if (manuallyExpandedRef.current) {
        const moved = Math.abs(window.scrollY - manualExpandScrollYRef.current)

        if (moved < 4) {
          scrollFrameRef.current = null
          return
        }

        manuallyExpandedRef.current = false
        scheduleCompactState(true)
        scrollFrameRef.current = null
        return
      }

      const nextSection = document.getElementById('fitness')
      const nextSectionTop = nextSection
        ? nextSection.getBoundingClientRect().top
        : window.innerHeight

      // Match the reference transition: the compact header appears while
      // part of the hero is still visible, as soon as the next white section
      // rises to roughly the upper two-fifths of the viewport.
      //
      // Separate enter/exit lines create hysteresis so the header does not
      // flicker when the user pauses or changes direction near the boundary.
      const enterCompactLine = window.innerHeight * 0.39
      const restoreFullLine = window.innerHeight * 0.52

      let nextCompact = compactRef.current
      if (nextSectionTop <= enterCompactLine) nextCompact = true
      if (nextSectionTop >= restoreFullLine) nextCompact = false

      scheduleCompactState(nextCompact)
      scrollFrameRef.current = null
    }

    const requestHeaderUpdate = () => {
      if (scrollFrameRef.current !== null) return
      scrollFrameRef.current = window.requestAnimationFrame(evaluateHeader)
    }

    evaluateHeader()
    window.addEventListener('scroll', requestHeaderUpdate, { passive: true })
    window.addEventListener('resize', requestHeaderUpdate)

    return () => {
      window.removeEventListener('scroll', requestHeaderUpdate)
      window.removeEventListener('resize', requestHeaderUpdate)
      window.clearTimeout(changeTimerRef.current)
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 960px)')
    const updateScreenSize = () => setSmallScreen(media.matches)

    updateScreenSize()
    media.addEventListener?.('change', updateScreenSize)

    return () => media.removeEventListener?.('change', updateScreenSize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const compactHeader = compact || smallScreen

  const handleCompactMenu = () => {
    if (smallScreen) {
      setMenuOpen(true)
      return
    }

    // Temporarily expand the complete desktop navigation at the current
    // scroll position. A later scroll event restores the compact state.
    window.clearTimeout(changeTimerRef.current)
    manuallyExpandedRef.current = true
    manualExpandScrollYRef.current = window.scrollY
    desiredCompactRef.current = false
    compactRef.current = false
    setCompact(false)
  }

  const goHome = () => {
    closeMenu()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openApps = () => {
    setAppsHintDismissed(true)
    onApps?.()
  }

  const openContact = () => {
    closeMenu()
    onContact?.()
  }

  const showAppsHint = !compactHeader && !appsOpen && !contactOpen && !appsHintDismissed

  return (
    <>
      {/* The wordmark is intentionally outside the fixed header stacking
          context. This allows mix-blend-mode to read the actual page
          background underneath it. */}
      <a
        className={`sensiq-floating-logo ${compactHeader ? 'sensiq-floating-logo--compact' : 'sensiq-floating-logo--full'}`}
        href="#overview"
        aria-label="llevell home"
        onClick={closeMenu}
      >
        <LlevellWordmark />
      </a>

      <header className={`sensiq-header ${compactHeader ? 'sensiq-header--compact' : 'sensiq-header--full'}`}>
        <div className="sensiq-header__inner">
          <span className="sensiq-logo-slot" aria-hidden="true" />

          <button className="sensiq-home-button" type="button" onClick={goHome} aria-label="Go to the top">
            <HomeIcon />
          </button>

          <div className="sensiq-desktop-panel" aria-hidden={compactHeader}>
            <nav className="sensiq-main-nav" aria-label="Primary navigation">
              {links.map(([label, href]) => (
                <a key={label} href={href}>{label}</a>
              ))}
            </nav>

            <div className="sensiq-panel-spacer" />

            <button className={`sensiq-apps-button ${appsOpen ? 'sensiq-apps-button--active' : ''}`} type="button" onClick={openApps} aria-label="Open our apps" aria-expanded={appsOpen}>
              <span className="sensiq-apps-icon"><AppsIcon /></span>
            </button>

            <button className="sensiq-shop-button" type="button" onClick={openContact} aria-label="Start something with LLeveLL" aria-expanded={contactOpen}>
              <span>Start Something</span>
              <ArrowIcon />
            </button>
          </div>

          <button
            className="sensiq-compact-menu"
            type="button"
            onClick={handleCompactMenu}
            aria-label={smallScreen ? 'Open menu' : 'Expand navigation'}
            aria-hidden={!compactHeader}
            tabIndex={compactHeader ? 0 : -1}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      <div
        className={`sensiq-apps-comic-hint ${showAppsHint ? 'sensiq-apps-comic-hint--visible' : ''}`}
        aria-hidden={!showAppsHint}
      >
        <span className="sensiq-apps-comic-hint__shout">PSST!</span>
        <span className="sensiq-apps-comic-hint__copy">
          Tap the 4 squares<br />to explore our apps.
        </span>
      </div>

      <div className={`sensiq-mobile-menu ${menuOpen ? 'sensiq-mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="sensiq-mobile-menu-head">
          <button className="sensiq-mobile-home" type="button" onClick={goHome} aria-label="Go to home">
            <LlevellWordmark className="llevell-wordmark--mobile" />
          </button>
          <button type="button" onClick={closeMenu} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <nav className="sensiq-mobile-links" aria-label="Menu navigation">
          <a href="#overview" onClick={closeMenu}>Home</a>
          {links.map(([label, href]) => (
            <a key={label} href={href} onClick={closeMenu}>{label}</a>
          ))}
        </nav>

        <div className="sensiq-mobile-actions">
          <button
            className="sensiq-mobile-shop"
            type="button"
            onClick={() => {
              closeMenu()
              openApps()
            }}
          >
            <span>Our apps</span>
            <span className="sensiq-mobile-apps-icon"><AppsIcon /></span>
          </button>

          <button
            className="sensiq-mobile-contact"
            type="button"
            onClick={openContact}
          >
            <span>Start Something</span>
            <ArrowIcon />
          </button>
        </div>
      </div>
    </>
  )
}
