import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Preloader.css'

const TOTAL_MS = 5480
const EXIT_FADE_MS = 220

export default function Preloader({ onComplete }) {
  const phraseRef = useRef(null)
  const pioneeringRef = useRef(null)
  const creativeRef = useRef(null)
  const excellenceRef = useRef(null)

  const [stage, setStage] = useState(0)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [offsets, setOffsets] = useState({ one: 0, two: 0, three: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const phrase = phraseRef.current
      const one = pioneeringRef.current
      const two = creativeRef.current
      const three = excellenceRef.current
      if (!phrase || !one || !two || !three) return

      const oneW = one.getBoundingClientRect().width
      const twoW = two.getBoundingClientRect().width
      const threeW = three.getBoundingClientRect().width
      const fs = parseFloat(getComputedStyle(phrase).fontSize) || 72
      const gap = fs * 0.13

      setOffsets({
        one: oneW / 2,
        two: (oneW + gap + twoW) / 2,
        three: (oneW + gap + twoW + gap + threeW) / 2,
      })
      setReady(true)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('preloader-active')
    document.body.classList.add('preloader-active')

    const timers = [
      window.setTimeout(() => setStage(1), 650),   // Pioneering
      window.setTimeout(() => setStage(2), 1010),  // Creative
      window.setTimeout(() => setStage(3), 1340),  // Excellence
      window.setTimeout(() => setStage(4), 2240),  // phrase begins fading
      window.setTimeout(() => setStage(5), 2760),  // accent bar scene
      window.setTimeout(() => setLeaving(true), TOTAL_MS - EXIT_FADE_MS),
      window.setTimeout(() => {
        document.documentElement.classList.remove('preloader-active')
        document.body.classList.remove('preloader-active')
        onComplete?.()
      }, TOTAL_MS),
    ]

    return () => {
      timers.forEach(window.clearTimeout)
      document.documentElement.classList.remove('preloader-active')
      document.body.classList.remove('preloader-active')
    }
  }, [onComplete])

  const currentHalfWidth =
    stage <= 1 ? offsets.one :
    stage === 2 ? offsets.two :
    offsets.three

  return (
    <div
      className={`reference-loader ${leaving ? 'is-leaving' : ''}`}
      role="status"
      aria-label="Loading LLeveLL"
    >
      <div className="reference-loader__stage" aria-hidden="true">
        <div
          ref={phraseRef}
          className={`reference-loader__phrase ${ready ? 'is-ready' : ''} ${stage >= 4 ? 'is-fading' : ''}`}
          style={{ transform: `translate3d(${-currentHalfWidth}px, -50%, 0)` }}
        >
          <span
            ref={pioneeringRef}
            className={`reference-loader__word reference-loader__word--soft ${stage >= 1 ? 'is-visible' : ''}`}
          >
            Pioneering
          </span>
          <span
            ref={creativeRef}
            className={`reference-loader__word reference-loader__word--focus ${stage >= 2 ? 'is-visible' : ''}`}
          >
            Creative
          </span>
          <span
            ref={excellenceRef}
            className={`reference-loader__word reference-loader__word--soft ${stage >= 3 ? 'is-visible' : ''}`}
          >
            Excellence
          </span>
        </div>

        <div className={`reference-loader__brand-scene ${stage >= 5 ? 'is-active' : ''}`}>
          <span className="reference-loader__brand">LLeveLL</span>
          <span className="reference-loader__bar" />
        </div>
      </div>
    </div>
  )
}
