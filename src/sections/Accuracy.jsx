import React, { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { ChevronDown } from 'lucide-react'

export default function Accuracy() {
  const sectionRef = useRef(null)

  /*
   * The scene stays pinned while the photograph grows from the centred
   * panoramic frame into the complete rounded section. The text is anchored
   * to the outer scene, so it does not scale or drift with the photograph.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.42,
    restDelta: 0.001,
  })

  const mediaWidth = useTransform(progress, [0.04, 0.58], ['72%', '100%'])
  const mediaHeight = useTransform(progress, [0.04, 0.58], ['63%', '100%'])
  const mediaLeft = useTransform(progress, [0.04, 0.58], ['14%', '0%'])
  const mediaTop = useTransform(progress, [0.04, 0.58], ['18.5%', '0%'])
  const mediaRadius = useTransform(progress, [0.04, 0.58], [18, 0])
  const imageScale = useTransform(progress, [0.04, 0.58], [1.055, 1])

  const structureOpacity = useTransform(
    progress,
    [0, 0.28, 0.56],
    [1, 0.82, 0],
  )
  const kickerOpacity = useTransform(
    progress,
    [0, 0.24, 0.48],
    [1, 1, 0],
  )
  const shadeOpacity = useTransform(
    progress,
    [0.04, 0.58],
    [0.34, 1],
  )
  const cueOpacity = useTransform(
    progress,
    [0.58, 0.7],
    [0, 1],
  )

  return (
    <section
      className="accuracy-section"
      ref={sectionRef}
      aria-labelledby="accuracy-title"
    >
      <div className="accuracy-sticky">
        <div className="accuracy-panel">
          <motion.div
            className="accuracy-structure"
            aria-hidden="true"
            style={{ opacity: structureOpacity }}
          />

          <motion.p
            className="accuracy-kicker"
            style={{ opacity: kickerOpacity }}
          >
            Better precision
          </motion.p>

          <motion.div
            className="accuracy-media"
            style={{
              width: mediaWidth,
              height: mediaHeight,
              left: mediaLeft,
              top: mediaTop,
              borderRadius: mediaRadius,
            }}
          >
            <motion.img
              className="accuracy-image"
              src="/athlete-expansion.webp"
              alt="Athlete stretching outdoors while wearing a smart ring"
              style={{ scale: imageScale }}
            />

            <motion.div
              className="accuracy-shade"
              aria-hidden="true"
              style={{ opacity: shadeOpacity }}
            />
          </motion.div>

          <motion.a
            className="accuracy-scroll-cue"
            href="#sleep"
            aria-label="Continue to the sleep section"
            style={{ opacity: cueOpacity }}
          >
            <ChevronDown size={18} strokeWidth={1.5} />
          </motion.a>
        </div>

        <div className="accuracy-content">
          <h2 id="accuracy-title" className="accuracy-heading accuracy-heading--better">
            <span className="accuracy-heading__better-line">
              <strong>Better</strong>
              <em>Campaigns.</em>
            </span>
            <span className="accuracy-heading__better-line">
              <strong>Better</strong>
              <em>Experiences.</em>
            </span>
            <span className="accuracy-heading__better-line">
              <strong>Better</strong>
              <em>Reach.</em>
            </span>
          </h2>

          <div className="accuracy-reference-copy">
            <div className="accuracy-journey" aria-label="Customer journey">
              <span>Attention</span>
              <b>→</b>
              <span>Discovery</span>
              <b>→</b>
              <span>Experience</span>
              <b>→</b>
              <span>Conversion</span>
            </div>

            <p className="accuracy-reference-description">
              <span>We connect ads, landing pages, UX, content, SEO</span>
              <span>and AI discovery into one journey.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
