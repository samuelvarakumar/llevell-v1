import React, { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react'
import './AboutUs.css'

const chapters = [
  {
    type: 'intro',
    kicker: 'LLEVELL / STUDIO OS',
    title: <>PRESS TO<br />EXPLORE</>,
    text: <>USE THE CONTROLS<br />TO MOVE THROUGH THE SYSTEM</>,
  },
  {
    type: 'image-one',
    kicker: '01 / UNDERSTAND',
    title: 'Ideas begin before interfaces do.',
  },
  {
    type: 'image-two',
    kicker: '02 / CONNECT',
    title: 'Strategy. Design. Technology. One system.',
  },
  {
    type: 'final',
    kicker: '03 / EVOLVE',
    title: <>LESS<br />HANDOFF.</>,
    text: <>MORE CONNECTION.<br />BETTER WORK.</>,
  },
]

const screenVariants = {
  enter: (direction) => ({
    x: direction >= 0 ? '11%' : '-11%',
    opacity: 0,
    filter: 'blur(5px)',
  }),
  center: {
    x: '0%',
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (direction) => ({
    x: direction >= 0 ? '-11%' : '11%',
    opacity: 0,
    filter: 'blur(5px)',
  }),
}

function ConsoleScreen({ chapter, direction, showApps }) {
  const item = chapters[chapter]

  return (
    <AnimatePresence initial={false} custom={direction} mode="wait">
      <motion.div
        key={chapter}
        className={`studio-console__chapter studio-console__chapter--${item.type}`}
        custom={direction}
        variants={screenVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: .38,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {item.type === 'intro' && (
          <>
            <span className="studio-console__screen-kicker">{item.kicker}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </>
        )}

        {item.type === 'image-one' && (
          <>
            <img
              src="https://ca.slack-edge.com/T02HGQGQM-U04UPJHAMH9-ec7be19e4bf4-512"
              alt="Abdul Raqeeb"
              className="studio-console__screen-image studio-console__screen-image--one"
            />

            <motion.div
              className="studio-console__app-launcher studio-console__designer-panel"
              initial={false}
              animate={{
                opacity: showApps ? 1 : 0,
                y: showApps ? 0 : 18,
                scale: showApps ? 1 : .97,
                pointerEvents: showApps ? 'auto' : 'none',
              }}
              transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="studio-console__app-launcher-head">
                <div>
                  <span>DESIGNER PROFILE</span>
                  <h4>Abdul Raqeeb</h4>
                </div>
                <small>PRESS CENTER TO CLOSE</small>
              </div>

              <div className="studio-console__designer-meta">
                <b>UI/UX Designer · Creative Lead</b>
                <p>
                  Abdul Raqeeb is a designer focused on UI/UX, visual systems
                  and digital experience thinking. He works with clear
                  interfaces, thoughtful interactions and strong creative
                  direction at Olive Technology.
                </p>
              </div>

              <div className="studio-console__designer-tools">
                <span>SELECTED APPS</span>

                <div className="studio-console__apps-grid studio-console__apps-grid--few">
                  <div className="studio-console__app-tile">
                    <i className="studio-console__app-icon studio-console__app-icon--figma">F</i>
                    <div><b>Figma</b><span>UI design</span></div>
                  </div>

                  <div className="studio-console__app-tile">
                    <i className="studio-console__app-icon studio-console__app-icon--miro">M</i>
                    <div><b>Miro</b><span>UX flows</span></div>
                  </div>

                  <div className="studio-console__app-tile">
                    <i className="studio-console__app-icon studio-console__app-icon--ps">Ps</i>
                    <div><b>Photoshop</b><span>Visual work</span></div>
                  </div>

                  <div className="studio-console__app-tile">
                    <i className="studio-console__app-icon studio-console__app-icon--ai">Ai</i>
                    <div><b>Illustrator</b><span>Vector assets</span></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="studio-console__screen-caption"
              animate={{ opacity: showApps ? .14 : 1 }}
              transition={{ duration: .22 }}
            >
              <span>{item.kicker}</span>
              <b>{showApps ? 'DESIGNER PROFILE OPEN' : 'PRESS CENTER L FOR DESIGNER + APPS'}</b>
            </motion.div>
          </>
        )}

        {item.type === 'image-two' && (
          <>
            <img
              src="https://ca.slack-edge.com/T02HGQGQM-U047R0KMZL1-b6c78be1937c-512"
              alt="Samuel Gunthoti"
              className="studio-console__screen-image studio-console__screen-image--two"
            />
            <div className="studio-console__screen-grid" aria-hidden="true" />

            <motion.div
              className="studio-console__app-launcher studio-console__designer-panel studio-console__designer-panel--samuel"
              initial={false}
              animate={{
                opacity: showApps ? 1 : 0,
                y: showApps ? 0 : 18,
                scale: showApps ? 1 : .97,
                pointerEvents: showApps ? 'auto' : 'none',
              }}
              transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="studio-console__app-launcher-head">
                <div>
                  <span>PROFILE</span>
                  <h4>Samuel Gunthoti</h4>
                </div>
                <small>PRESS CENTER TO CLOSE</small>
              </div>

              <div className="studio-console__designer-meta">
                <b>Experience: Olive Technology</b>
                <p>
                  Samuel Gunthoti has public experience listed with Olive Technology.
                  He also has an academic background from NRI Institute of Technology.
                </p>
              </div>

              <div className="studio-console__designer-tools">
                <span>WORK SNAPSHOT</span>

                <div className="studio-console__profile-points">
                  <div>
                    <b>Company</b>
                    <span>Olive Technology</span>
                  </div>
                  <div>
                    <b>Background</b>
                    <span>NRI Institute of Technology</span>
                  </div>
                  <div>
                    <b>Focus</b>
                    <span>Digital work, team collaboration and hands-on project experience</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="studio-console__screen-caption"
              animate={{ opacity: showApps ? .14 : 1 }}
              transition={{ duration: .22 }}
            >
              <span>{item.kicker}</span>
              <b>{showApps ? 'PROFILE OPEN' : 'PRESS CENTER L FOR PROFILE'}</b>
            </motion.div>
          </>
        )}

        {item.type === 'final' && (
          <>
            <span className="studio-console__screen-kicker">{item.kicker}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>

            <div className="studio-console__screen-bars">
              <span style={{ '--w': '88%' }} />
              <span style={{ '--w': '74%' }} />
              <span style={{ '--w': '96%' }} />
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default function AboutUs() {
  const sectionRef = useRef(null)

  const [isPowered, setIsPowered] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showApps, setShowApps] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: .35,
    restDelta: .0004,
  })

  const screenGlow = useTransform(progress, [0, .4, 1], [.12, .34, .2])
  const deviceY = useTransform(progress, [0, 1], ['2.5vh', '-2.5vh'])

  const setManualChapter = (next, nextDirection) => {
    if (!isPowered) return

    setShowApps(false)
    setDirection(nextDirection)
    setChapter(next)
  }

  const nextChapter = () => {
    const next = (chapter + 1) % chapters.length
    setManualChapter(next, 1)
  }

  const previousChapter = () => {
    const next = (chapter - 1 + chapters.length) % chapters.length
    setManualChapter(next, -1)
  }

  const firstChapter = () => setManualChapter(0, chapter === 0 ? 1 : -1)
  const lastChapter = () => setManualChapter(chapters.length - 1, 1)

  const toggleApps = () => {
    if (!isPowered || ![1, 2].includes(chapter)) return
    setShowApps((value) => !value)
  }

  const togglePower = () => {
    if (isPowered) {
      setIsPowered(false)
      setShowApps(false)
      setChapter(0)
      setDirection(-1)
      return
    }

    setShowApps(false)
    setChapter(0)
    setDirection(1)
    setIsPowered(true)
  }

  return (
    <section ref={sectionRef} className="about-console" id="about">
      <div className="about-console__sticky">
        <div className="about-console__copy">
          <div className="about-console__eyebrow">
            <span>ABOUT LLEVELL</span>
            <i />
            <span>STUDIO SYSTEM / 01</span>
          </div>

          <h2>
            The minds behind
            <br />
            <em>LLeveLL.</em>
          </h2>

          <p className="about-console__lead">
            LLeveLL brings strategy, design, development, growth and AI into one
            connected studio — so the thinking stays joined from the first idea
            to the final experience.
          </p>

        </div>

        <motion.div
          className="studio-console-wrap"
          style={{ y: deviceY }}
        >
          <div className={`studio-console ${isPowered ? 'is-powered' : 'is-off'}`}>
            <div className="studio-console__metal-noise" aria-hidden="true" />

            <div className="studio-console__topbar">
              <div className="studio-console__brand">
                <span className="brand-mark" />
                <strong>LLeveLL</strong>
                <small>V.01.26</small>
              </div>

              <div className="studio-console__signal">
                <i /><i /><i /><i /><i /><i /><i />
              </div>

              <span className={`studio-console__status-dot ${isPowered ? 'is-on' : ''}`} />
            </div>

            <div className="studio-console__screen-shell">
              <motion.div
                className="studio-console__screen-glow"
                style={{ opacity: isPowered ? screenGlow : .04 }}
              />

              <div className="studio-console__screen">
                <div className={`studio-console__screen-off ${isPowered ? 'is-hidden' : ''}`}>
                  <span>PRESS POWER</span>
                  <small>TO START STUDIO OS</small>
                </div>

                <div className={`studio-console__screen-content ${isPowered ? 'is-active' : ''}`}>
                  <ConsoleScreen chapter={chapter} direction={direction} showApps={showApps} />
                </div>
              </div>
            </div>

            <div className="studio-console__controls">
              <button
                type="button"
                className="studio-console__power"
                onClick={togglePower}
                aria-pressed={isPowered}
                aria-label={isPowered ? 'Turn studio console off' : 'Turn studio console on'}
              >
                <motion.i
                  animate={{
                    opacity: isPowered ? 1 : .2,
                    scaleY: isPowered ? 1 : .92,
                  }}
                  transition={{ duration: .22 }}
                />
                <span>{isPowered ? 'ON' : 'POWER'}</span>
              </button>

              <div className="studio-console__dial" aria-label="Studio console navigation">
                <div className="studio-console__dial-ring">
                  <button
                    type="button"
                    className={`studio-console__dial-button studio-console__dial-button--top ${chapter === 0 ? 'is-current' : ''}`}
                    onClick={firstChapter}
                    disabled={!isPowered}
                    aria-label="Go to Studio OS home screen"
                    title="Home"
                  >
                    <ChevronUp />
                  </button>

                  <button
                    type="button"
                    className="studio-console__dial-button studio-console__dial-button--right"
                    onClick={nextChapter}
                    disabled={!isPowered}
                    aria-label="Show next studio console screen"
                    title="Next"
                  >
                    <ChevronRight />
                  </button>

                  <button
                    type="button"
                    className={`studio-console__dial-button studio-console__dial-button--bottom ${chapter === chapters.length - 1 ? 'is-current' : ''}`}
                    onClick={lastChapter}
                    disabled={!isPowered}
                    aria-label="Go to final studio console screen"
                    title="Final"
                  >
                    <ChevronDown />
                  </button>

                  <button
                    type="button"
                    className="studio-console__dial-button studio-console__dial-button--left"
                    onClick={previousChapter}
                    disabled={!isPowered}
                    aria-label="Show previous studio console screen"
                    title="Previous"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    type="button"
                    className={`studio-console__dial-core ${[1, 2].includes(chapter) ? 'is-available' : ''} ${showApps ? 'is-active' : ''}`}
                    onClick={toggleApps}
                    disabled={!isPowered || ![1, 2].includes(chapter)}
                    aria-pressed={showApps}
                    aria-label={showApps ? 'Close UI/UX toolkit' : 'Open UI/UX toolkit'}
                    title={[1, 2].includes(chapter) ? (chapter === 1 ? 'View designer profile and apps' : 'View profile') : ''}
                  >
                    <span aria-hidden="true" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="studio-console__back"
                onClick={previousChapter}
                disabled={!isPowered}
                aria-label="Go back one studio console screen"
              >
                <i />
                <span>BACK</span>
              </button>
            </div>
          </div>

          <div className="studio-console-shadow" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
}
