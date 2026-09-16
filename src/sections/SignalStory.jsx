import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import {
  Braces,
  Check,
  Compass,
  Palette,
  Rocket,
  TrendingUp,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading'

const stories = [
  {
    icon: Compass,
    index: '01',
    kicker: 'STRATEGY',
    title: 'Define the digital direction',
    text: 'We turn your goals, audience and brand into a focused digital plan before design or development begins.',
    ui: 'strategy',
  },
  {
    icon: Palette,
    index: '02',
    kicker: 'UX & INTERFACE DESIGN',
    title: 'Design experiences people understand',
    text: 'Clear journeys, distinctive interfaces and thoughtful interactions make every screen feel effortless and recognisably yours.',
    ui: 'design',
  },
  {
    icon: Braces,
    index: '03',
    kicker: 'DEVELOPMENT',
    title: 'Build fast, scalable products',
    text: 'We develop responsive websites and applications with clean architecture, strong performance and room to grow.',
    ui: 'development',
  },
  {
    icon: Rocket,
    index: '04',
    kicker: 'LAUNCH & OPTIMISATION',
    title: 'Launch with confidence',
    text: 'Testing, performance checks and careful deployment turn the final build into a polished product ready for real users.',
    ui: 'launch',
  },
  {
    icon: TrendingUp,
    index: '05',
    kicker: 'GROWTH & EVOLUTION',
    title: 'Improve what comes next',
    text: 'After launch, we use real behaviour and business priorities to refine, expand and strengthen your digital presence.',
    ui: 'growth',
  },
]

function StrategyInterface() {
  const mapRef = useRef(null)
  const brandRef = useRef(null)
  const websiteRef = useRef(null)
  const appRef = useRef(null)
  const contentRef = useRef(null)
  const growthRef = useRef(null)
  const [routes, setRoutes] = useState(null)
  const [cycle, setCycle] = useState(0)
  const inView = useInView(mapRef, { amount: 0.58 })

  useEffect(() => {
    if (inView) setCycle((value) => value + 1)
  }, [inView])

  useLayoutEffect(() => {
    const map = mapRef.current
    if (!map) return undefined

    let frame = 0

    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const mapBox = map.getBoundingClientRect()
        const nodes = {
          brand: brandRef.current?.getBoundingClientRect(),
          website: websiteRef.current?.getBoundingClientRect(),
          app: appRef.current?.getBoundingClientRect(),
          content: contentRef.current?.getBoundingClientRect(),
          growth: growthRef.current?.getBoundingClientRect(),
        }

        if (Object.values(nodes).some((node) => !node)) return

        const point = (box, edge) => ({
          x: box.left - mapBox.left + box.width / 2,
          y: edge === 'top'
            ? box.top - mapBox.top
            : box.bottom - mapBox.top,
        })

        const brandBottom = point(nodes.brand, 'bottom')
        const websiteTop = point(nodes.website, 'top')
        const websiteBottom = point(nodes.website, 'bottom')
        const appTop = point(nodes.app, 'top')
        const appBottom = point(nodes.app, 'bottom')
        const contentTop = point(nodes.content, 'top')
        const growthTop = point(nodes.growth, 'top')

        const rowTwoTop = Math.min(websiteTop.y, appTop.y)
        const splitY = brandBottom.y + (rowTwoTop - brandBottom.y) * 0.46

        const makeElbow = (from, to) => {
          const midY = from.y + (to.y - from.y) * 0.5
          return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`
        }

        setRoutes({
          width: Math.max(1, mapBox.width),
          height: Math.max(1, mapBox.height),
          stem: `M ${brandBottom.x} ${brandBottom.y} L ${brandBottom.x} ${splitY}`,
          website: `M ${brandBottom.x} ${splitY} L ${websiteTop.x} ${splitY} L ${websiteTop.x} ${websiteTop.y}`,
          app: `M ${brandBottom.x} ${splitY} L ${appTop.x} ${splitY} L ${appTop.x} ${appTop.y}`,
          content: makeElbow(websiteBottom, contentTop),
          growth: makeElbow(appBottom, growthTop),
        })
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(map)
    ;[brandRef, websiteRef, appRef, contentRef, growthRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const reveal = (delay) => ({
    initial: {
      opacity: 0,
      clipPath: 'inset(0 50% 0 50% round 16px)',
    },
    animate: inView
      ? {
          opacity: 1,
          clipPath: 'inset(0 0% 0 0% round 16px)',
        }
      : {
          opacity: 0,
          clipPath: 'inset(0 50% 0 50% round 16px)',
            },
    transition: {
      duration: 0.48,
      delay: inView ? delay : 0,
      ease: [0.22, 1, 0.36, 1],
    },
  })

  const routeMask = (id, d, delay, duration) => (
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={routes.width} height={routes.height}>
      <rect width={routes.width} height={routes.height} fill="black" />
      <motion.path
        key={`${id}-${cycle}`}
        d={d}
        fill="none"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration, delay: inView ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      />
    </mask>
  )

  return (
    <div className="signal-ui studio-ui studio-ui--strategy">
      <div className="studio-ui__top">
        <span>DIGITAL BLUEPRINT</span>
        <motion.span
          className="studio-status"
          key={`aligned-${cycle}`}
          initial={{ opacity: .32, scale: .97 }}
          animate={inView ? { opacity: 1, scale: [0.97, 1.06, 1] } : { opacity: .32, scale: .97 }}
          transition={{ duration: .5, delay: inView ? 2.82 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          Aligned
        </motion.span>
      </div>

      <div
        ref={mapRef}
        className="strategy-map strategy-map--precise-flow"
        aria-label="Digital strategy map"
      >
        {routes && (
          <svg
            className="strategy-flow strategy-flow--precise"
            viewBox={`0 0 ${routes.width} ${routes.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {routeMask('blueprint-mask-stem', routes.stem, .48, .42)}
              {routeMask('blueprint-mask-website', routes.website, .88, .62)}
              {routeMask('blueprint-mask-app', routes.app, .94, .62)}
              {routeMask('blueprint-mask-content', routes.content, 1.78, .58)}
              {routeMask('blueprint-mask-growth', routes.growth, 1.84, .58)}
            </defs>

            <path className="strategy-flow__path" d={routes.stem} mask="url(#blueprint-mask-stem)" />
            <path className="strategy-flow__path" d={routes.website} mask="url(#blueprint-mask-website)" />
            <path className="strategy-flow__path" d={routes.app} mask="url(#blueprint-mask-app)" />
            <path className="strategy-flow__path" d={routes.content} mask="url(#blueprint-mask-content)" />
            <path className="strategy-flow__path" d={routes.growth} mask="url(#blueprint-mask-growth)" />
          </svg>
        )}

        <motion.div
          ref={brandRef}
          key={`brand-${cycle}`}
          className="strategy-node strategy-node--main"
          {...reveal(.06)}
        >
          Your brand
        </motion.div>

        <motion.div
          ref={websiteRef}
          key={`website-${cycle}`}
          className="strategy-node"
          {...reveal(1.46)}
        >
          Website
        </motion.div>

        <motion.div
          ref={appRef}
          key={`app-${cycle}`}
          className="strategy-node"
          {...reveal(1.52)}
        >
          Mobile app
        </motion.div>

        <motion.div
          ref={contentRef}
          key={`content-${cycle}`}
          className="strategy-node"
          {...reveal(2.34)}
        >
          Content
        </motion.div>

        <motion.div
          ref={growthRef}
          key={`growth-${cycle}`}
          className="strategy-node"
          {...reveal(2.4)}
        >
          Growth
        </motion.div>
      </div>

      <p className="studio-ui__note">
        One clear direction connecting every digital touchpoint.
      </p>
    </div>
  )
}

function DesignInterface() {
  const previewRef = useRef(null)
  const inView = useInView(previewRef, { amount: 0.48 })

  return (
    <div className="signal-ui studio-ui studio-ui--design">
      <div className="studio-ui__top">
        <span>INTERFACE SYSTEM</span>
        <span className={`design-screen-count ${inView ? 'is-live' : ''}`}>
          12 screens
        </span>
      </div>

      <div
        ref={previewRef}
        className={`design-preview design-preview--session ${inView ? 'is-live' : ''}`}
      >
        <div className="design-sidebar">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="design-canvas">
          <span className="design-session-cursor" aria-hidden="true">
            <i />
          </span>

          <div className="design-hero-block" />

          <div className="design-card-row">
            <i />
            <i />
            <i />
          </div>

          <div className="design-copy-lines">
            <b />
            <b />
            <b />
          </div>
        </div>
      </div>

      <div className={`design-swatches design-swatches--session ${inView ? 'is-live' : ''}`} aria-label="Interface colour palette">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function DevelopmentInterface() {
  const developmentRef = useRef(null)
  const inView = useInView(developmentRef, { amount: 0.48 })

  return (
    <div
      ref={developmentRef}
      className={`signal-ui studio-ui studio-ui--development development-session ${inView ? 'is-live' : ''}`}
    >
      <div className="code-window">
        <div className="code-window__bar">
          <div className="code-window__lights"><span /><span /><span /></div>
          <small className="code-window__filename">llevell-product.jsx</small>
        </div>

        <div className="code-lines" aria-hidden="true">
          <span className="code-line code-line--1"><i>01</i><b className="code-purple">const</b> experience = {'{'}</span>
          <span className="code-line code-line--2"><i>02</i>&nbsp;&nbsp;design: <b className="code-green">'distinctive'</b>,</span>
          <span className="code-line code-line--3"><i>03</i>&nbsp;&nbsp;performance: <b className="code-orange">100</b>,</span>
          <span className="code-line code-line--4"><i>04</i>&nbsp;&nbsp;responsive: <b className="code-purple">true</b>,</span>
          <span className="code-line code-line--5"><i>05</i>&nbsp;&nbsp;scalable: <b className="code-purple">true</b></span>
          <span className="code-line code-line--6"><i>06</i>{'}'}</span>
          <span className="code-typing-caret" aria-hidden="true" />
        </div>
      </div>

      <div className="build-status build-status--session">
        <span><Check size={15} /> Responsive</span>
        <span><Check size={15} /> Accessible</span>
        <span><Check size={15} /> Optimised</span>
      </div>
    </div>
  )
}

function LaunchInterface() {
  const checks = ['Cross-device testing', 'Performance audit', 'SEO foundations', 'Production deployment']
  const launchRef = useRef(null)
  const inView = useInView(launchRef, { amount: 0.48 })

  return (
    <div
      ref={launchRef}
      className={`signal-ui studio-ui studio-ui--launch launch-session ${inView ? 'is-live' : ''}`}
    >
      <div className="launch-orbit">
        <Rocket size={42} />
      </div>

      <span className="recommendation-label launch-ready-label">READY FOR RELEASE</span>
      <h3>Every detail checked before your product meets the world.</h3>

      <div className="launch-checks launch-checks--session">
        {checks.map((item, index) => (
          <div key={item} className={`launch-check launch-check--${index + 1}`}>
            <Check size={15} />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="launch-progress launch-progress--session"><span /></div>
    </div>
  )
}

function GrowthInterface() {
  const bars = [42, 57, 49, 68, 73, 84, 92]
  const growthRef = useRef(null)
  const inView = useInView(growthRef, { amount: 0.48 })

  return (
    <div
      ref={growthRef}
      className={`signal-ui studio-ui studio-ui--growth growth-session ${inView ? 'is-live' : ''}`}
    >
      <div className="studio-ui__top">
        <span>PRODUCT MOMENTUM</span>
        <span className="growth-positive growth-positive--session">+38%</span>
      </div>

      <div className="growth-metric growth-metric--session">
        <strong className="growth-metric__value">
          <span className="growth-stage growth-stage--1">1.6×</span>
          <span className="growth-stage growth-stage--2">2.7×</span>
          <span className="growth-stage growth-stage--3">3.9×</span>
          <span className="growth-stage growth-stage--4">4.8×</span>
        </strong>
        <span>more meaningful user actions</span>
      </div>

      <div className="growth-chart growth-chart--session" aria-label="Rising product performance chart">
        {bars.map((height, index) => (
          <span key={`${height}-${index}`} className={`growth-bar growth-bar--${index + 1}`}>
            <i style={{ height: `${height}%` }} />
          </span>
        ))}
      </div>

      <p className="studio-ui__note growth-note--session">
        Measure, learn and keep improving after launch.
      </p>
    </div>
  )
}

function Interface({ type }) {
  if (type === 'strategy') return <StrategyInterface />
  if (type === 'design') return <DesignInterface />
  if (type === 'development') return <DevelopmentInterface />
  if (type === 'launch') return <LaunchInterface />
  return <GrowthInterface />
}

export default function SignalStory() {
  return (
    <section className="signal-story" id="fitness">
      <div className="container signal-intro">
        <SectionHeading
          kicker="FROM FIRST IDEA TO WHAT COMES NEXT"
          title={
            <>
              <span className="signal-title-line">One studio.</span>
              <span className="signal-title-line signal-title-line--presence">
                Your entire digital presence.
              </span>
            </>
          }
          body="From first idea to long-term growth, we bring strategy, design and development together under one roof."
        />
      </div>

      <div className="story-stack container">
        {stories.map(({ icon: Icon, index, kicker, title, text, ui }, cardIndex) => (
          <motion.article
            className="story-card"
            key={title}
            initial={{ opacity: 0, y: 90 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{
              duration: 0.9,
              delay: cardIndex * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="story-copy">
              <div className="story-number">{index}</div>
              <Icon className="story-icon" size={25} />
              <span className="kicker">{kicker}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>

            <Interface type={ui} />
          </motion.article>
        ))}
      </div>
    </section>
  )
}
