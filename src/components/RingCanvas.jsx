import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import SmartRing3D, { StudioEnvironment } from './SmartRing3D'

function useCanvasActivity(ref) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '260px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])

  return active
}

export default function RingCanvas({
  className = '',
  finish = 'titanium',
  explode = 0,
  scrollProgress,
  mode = 'hero',
  dark = false,
  cameraZ = 6.8,
}) {
  const wrapperRef = useRef(null)
  const active = useCanvasActivity(wrapperRef)
  const [compactQuality, setCompactQuality] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 820px), (prefers-reduced-motion: reduce)')
    const update = () => setCompactQuality(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  const rendererSettings = useMemo(
    () => ({
      antialias: !compactQuality,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    }),
    [compactQuality],
  )

  return (
    <div
      ref={wrapperRef}
      className={`ring-canvas ${className}`}
      aria-label="Interactive 3D LLeveLL smart ring"
    >
      <Canvas
        dpr={compactQuality ? 1 : [1, 1.35]}
        camera={{ position: [0, 0, cameraZ], fov: 36, near: 0.1, far: 100 }}
        gl={rendererSettings}
        frameloop={active ? 'always' : 'never'}
        performance={{ min: 0.55, max: 1, debounce: 180 }}
      >
        <Suspense fallback={null}>
          <SmartRing3D
            finish={finish}
            explode={explode}
            scrollProgress={scrollProgress}
            mode={mode}
            autoRotate={!compactQuality}
          />
          <StudioEnvironment dark={dark} />
        </Suspense>
      </Canvas>
      <span className="ring-canvas-hint">Move your cursor</span>
    </div>
  )
}
