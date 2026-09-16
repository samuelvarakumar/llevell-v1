import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ServiceTools3D, { ServicesStudioEnvironment } from './ServiceTools3D'

function useCanvasVisibility(ref) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '280px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return visible
}

export default function ServicesCanvas({ activeIndex, scrollProgress }) {
  const wrapperRef = useRef(null)
  const visible = useCanvasVisibility(wrapperRef)
  const [compactMode, setCompactMode] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(
      '(max-width: 820px), (prefers-reduced-motion: reduce)',
    )

    const updateMode = () => setCompactMode(media.matches)
    updateMode()
    media.addEventListener?.('change', updateMode)

    return () => media.removeEventListener?.('change', updateMode)
  }, [])

  const rendererSettings = useMemo(
    () => ({
      antialias: !compactMode,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    }),
    [compactMode],
  )

  return (
    <div
      ref={wrapperRef}
      className="services-canvas services-canvas--cinematic"
      aria-label="Interactive 3D visualisation of LLeveLL services"
    >
      <Canvas
        dpr={compactMode ? 1 : [1, 1.45]}
        camera={{ position: [0, 0.1, 9.4], fov: 33, near: 0.1, far: 80 }}
        gl={rendererSettings}
        frameloop={visible ? 'always' : 'never'}
        performance={{ min: 0.5, max: 1, debounce: 200 }}
      >
        <Suspense fallback={null}>
          <ServiceTools3D
            activeIndex={activeIndex}
            scrollProgress={scrollProgress}
            compactMode={compactMode}
          />
          <ServicesStudioEnvironment compactMode={compactMode} />
        </Suspense>
      </Canvas>
    </div>
  )
}
