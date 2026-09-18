import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Focus, Scan } from 'lucide-react'
import './AIApproach.css'

const perspectives = [
  {
    name: 'Strategy',
    title: ['Ask', 'better.'],
    question: 'Are we solving the right problem?',
    ai: 'Research',
    copy: 'AI can explore a thousand directions. We connect the evidence to your ambition and choose the question worth answering.',
    raw: ['More data', 'Search results', 'Market signals', 'A thousand directions', 'New possibilities', 'Another answer'],
    clear: ['The real need', 'Relevant evidence', 'Business context', 'One clear direction', 'A useful opportunity', 'A better question'],
  },
  {
    name: 'Taste',
    title: ['Make it', 'matter.'],
    question: 'Does it feel unmistakably you?',
    ai: 'Variation',
    copy: 'AI can multiply the options. We bring a point of view, shaping the details that make the work feel considered, distinctive and yours.',
    raw: ['Another variation', 'Trending styles', 'More layouts', 'Endless options', 'Fresh palettes', 'New combinations'],
    clear: ['A point of view', 'Lasting character', 'Intentional detail', 'One distinct voice', 'Your visual language', 'A coherent experience'],
  },
  {
    name: 'Judgment',
    title: ['Choose', 'wisely.'],
    question: 'Is it right, not just convincing?',
    ai: 'Automation',
    copy: 'AI can accelerate the work. We challenge assumptions, check the details and take responsibility for what is ready to leave the studio.',
    raw: ['Faster drafts', 'Plausible answers', 'More output', 'Instant decisions', 'Automated steps', 'New predictions'],
    clear: ['Verified details', 'Sound reasoning', 'Quality over volume', 'Accountable decisions', 'Thoughtful review', 'Evidence, not guesses'],
  },
  {
    name: 'Empathy',
    title: ['Keep it', 'human.'],
    question: 'Does this make someone’s day easier?',
    ai: 'Optimization',
    copy: 'AI can find patterns at scale. We listen to the people behind them, making experiences clearer, more accessible and genuinely useful.',
    raw: ['Behavior patterns', 'User segments', 'More metrics', 'Predicted intent', 'Conversion rates', 'Engagement signals'],
    clear: ['People, not patterns', 'Individual needs', 'Real-world context', 'Less friction', 'Meaningful progress', 'An easier experience'],
  },
]

const fragmentPositions = [
  { left: '18%', top: '26%', angle: '-8deg' },
  { left: '79%', top: '23%', angle: '7deg' },
  { left: '13%', top: '53%', angle: '5deg' },
  { left: '84%', top: '53%', angle: '-5deg' },
  { left: '22%', top: '78%', angle: '-5deg' },
  { left: '77%', top: '79%', angle: '6deg' },
]

const workflow = [
  ['Discover', 'AI scans wider. We decide what matters.'],
  ['Design', 'AI multiplies directions. We protect the taste.'],
  ['Build', 'AI removes repetition. We engineer the experience.'],
  ['Grow', 'AI finds patterns. We choose the next move.'],
]

function LensField({ perspective, index, revealed }) {
  const fieldRef = useRef(null)
  const rimRef = useRef(null)
  const frameRef = useRef(0)

  const resetPosition = useCallback(() => {
    window.cancelAnimationFrame(frameRef.current)
    fieldRef.current?.style.setProperty('--lens-x', '50%')
    fieldRef.current?.style.setProperty('--lens-y', '50%')
  }, [])

  useEffect(() => {
    resetPosition()
  }, [index, revealed, resetPosition])

  useEffect(() => {
    // Keep the lens inside the field after a viewport or orientation change.
    const observer = new ResizeObserver(resetPosition)
    if (fieldRef.current) observer.observe(fieldRef.current)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frameRef.current)
    }
  }, [resetPosition])

  const moveLens = (event) => {
    if (revealed || !fieldRef.current || !rimRef.current) return
    const rect = fieldRef.current.getBoundingClientRect()
    const radius = rimRef.current.offsetWidth / 2 + 12
    const x = Math.min(rect.width - radius, Math.max(radius, event.clientX - rect.left))
    const y = Math.min(rect.height - radius, Math.max(radius, event.clientY - rect.top))

    // Update only the visual mask, never React state, during pointer movement.
    window.cancelAnimationFrame(frameRef.current)
    frameRef.current = window.requestAnimationFrame(() => {
      fieldRef.current?.style.setProperty('--lens-x', `${(x / rect.width) * 100}%`)
      fieldRef.current?.style.setProperty('--lens-y', `${(y / rect.height) * 100}%`)
    })
  }

  const renderFragments = (focused) => (focused ? perspective.clear : perspective.raw).map((text, itemIndex) => (
    <span
      className="ll-lens__fragment"
      key={itemIndex}
      style={{ left: fragmentPositions[itemIndex].left, top: fragmentPositions[itemIndex].top, '--fragment-angle': focused ? '0deg' : fragmentPositions[itemIndex].angle }}
    >
      <i>{focused ? '+' : `0${itemIndex + 1}`}</i>{text}
    </span>
  ))

  return (
    <div
      ref={fieldRef}
      className={`ll-lens__field${revealed ? ' is-revealed' : ''}`}
      data-cursor="explore"
      aria-hidden="true"
      onPointerMove={(event) => {
        if (event.pointerType !== 'touch') moveLens(event)
      }}
      onPointerDown={moveLens}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') resetPosition()
      }}
    >
      <div className="ll-lens__possibilities">
        <span className="ll-lens__field-label">MACHINE POSSIBILITIES</span>
        <div className="ll-lens__raw-title">More output.<br />More possibility.</div>
        {renderFragments(false)}
        <span className="ll-lens__field-foot">POSSIBILITY IS THE STARTING POINT.</span>
      </div>

      <div className="ll-lens__clarity">
        <span className="ll-lens__field-label">HUMAN PERSPECTIVE</span>
        <div className="ll-lens__focused-title" key={perspective.name}>
          <span>THROUGH OUR LENS</span>
          <strong>{perspective.title[0]}<br /><em>{perspective.title[1]}</em></strong>
          <small>0{index + 1} / {perspective.name.toUpperCase()}</small>
        </div>
        {renderFragments(true)}
        <span className="ll-lens__field-foot">CLARITY IS A HUMAN DECISION.</span>
      </div>

      <div className="ll-lens__rim" ref={rimRef}>
        <span className="ll-lens__rim-label">LLeveLL Lens</span>
        <span className="ll-lens__rim-point ll-lens__rim-point--left" />
        <span className="ll-lens__rim-point ll-lens__rim-point--right" />
      </div>
    </div>
  )
}

export default function AIApproach() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const perspective = perspectives[activeIndex]

  return (
    <section className="ll-ai" id="ai-approach" aria-labelledby="ll-ai-heading">
      <div className="ll-ai__shell">
        <header className="ll-ai__intro">
          <div className="ll-ai__eyebrow">
            <span>OUR AI APPROACH</span>
            <span>HUMAN-LED / AI-ASSISTED</span>
          </div>
          <h2 id="ll-ai-heading">
            <span>AI makes us faster.</span>
            <em>Good thinking makes us better.</em>
          </h2>
          <div className="ll-ai__intro-row">
            <p>We use AI to expand speed, range and possibility — without handing over the decisions that shape the work.</p>
            <span>A wider view.<br /><strong>A sharper point of view.</strong></span>
          </div>
        </header>

        <div className="ll-lens" aria-labelledby="ll-lens-heading">
          <div className="ll-lens__masthead">
            <h3 id="ll-lens-heading">
              <img src="/llevell-final-white.svg" width="1070" height="222" alt="LLeveLL" />
              <span>Lens<span className="ll-lens__asterisk" aria-hidden="true">✳</span></span>
            </h3>
            <p>AI opens up the possibilities.<br /><strong>We bring them into focus.</strong></p>
          </div>

          <LensField perspective={perspective} index={activeIndex} revealed={revealed} />

          <div className="ll-lens__toolbar">
            <span className="ll-lens__hint"><Focus size={18} aria-hidden="true" /><span>Move or tap the lens to explore</span></span>
            <button
              className="ll-lens__reveal"
              type="button"
              aria-pressed={revealed}
              onClick={() => setRevealed((value) => !value)}
            >
              <Scan size={17} aria-hidden="true" />
              {revealed ? 'Return to the lens' : 'See the full picture'}
            </button>
          </div>

          <div className="ll-lens__perspectives" role="group" aria-label="Choose a human perspective">
            {perspectives.map((item, index) => (
              <button
                className={`ll-lens__perspective${activeIndex === index ? ' is-active' : ''}`}
                type="button"
                key={item.name}
                aria-pressed={activeIndex === index}
                aria-controls="ll-lens-insight"
                onClick={() => setActiveIndex(index)}
              >
                <span>0{index + 1}</span>
                <strong>{item.name}</strong>
                <ArrowUpRight size={19} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="ll-lens__insight" id="ll-lens-insight" aria-live="polite" aria-atomic="true">
            <div>
              <span className="ll-lens__insight-label">{perspective.ai.toUpperCase()} × {perspective.name.toUpperCase()}</span>
              <h4>{perspective.question}</h4>
            </div>
            <p>{perspective.copy}</p>
            <ul className="ll-lens__accessible-outcomes">
              {perspective.clear.map((outcome) => <li key={outcome}>{outcome}</li>)}
            </ul>
          </div>
        </div>

        <div className="ll-ai__workflow">
          <div className="ll-ai__workflow-head"><span>THE LENS, AT EVERY STEP.</span><span>FROM FIRST IDEA TO WHAT’S NEXT</span></div>
          <div className="ll-ai__workflow-list">
            {workflow.map(([title, copy], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>

        <footer className="ll-ai__principle">
          <span>THE PRINCIPLE</span>
          <p>AI multiplies the output.<br /><strong>Human thinking protects the outcome.</strong></p>
          <Focus size={36} strokeWidth={1} aria-hidden="true" />
        </footer>
      </div>
    </section>
  )
}
