import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import ServiceRing3D from './ServiceRing3D'

function useCanvasActivity(ref) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '220px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return active
}

function CinematicEnvironment() {
  return (
    <>
      <ambientLight intensity={0.17} />
      <directionalLight
        position={[4.8, 6.2, 6]}
        intensity={2.85}
        color="#fff8eb"
      />
      <spotLight
        position={[-5, 3.2, 5]}
        intensity={2.25}
        angle={0.46}
        penumbra={0.8}
        color="#cfe3ff"
      />
      <pointLight
        position={[1.3, -2.7, 2.7]}
        intensity={1.9}
        color="#b9ff4f"
      />
      <pointLight
        position={[-2.6, 1.9, 1.8]}
        intensity={0.7}
        color="#78b8ff"
      />

      <Environment resolution={64}>
        <group rotation={[-Math.PI / 3, 0, 0.8]}>
          <Lightformer
            form="rect"
            intensity={4.7}
            position={[0, 5, -7]}
            scale={[8, 2.8, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2.5}
            position={[-5, 0, 2]}
            scale={[2.8, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.9}
            position={[5, -1, 1]}
            scale={[2, 5, 1]}
          />
        </group>
      </Environment>
    </>
  )
}

export default function ServiceRingCanvas({ activeIndex, scrollProgress }) {
  const wrapperRef = useRef(null)
  const active = useCanvasActivity(wrapperRef)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(
      '(max-width: 820px), (prefers-reduced-motion: reduce)',
    )

    const update = () => setCompact(query.matches)
    update()
    query.addEventListener?.('change', update)

    return () => query.removeEventListener?.('change', update)
  }, [])

  const rendererSettings = useMemo(
    () => ({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    }),
    [compact],
  )

  return (
    <div
      ref={wrapperRef}
      className="service-ring-canvas"
      aria-label="Animated service ring"
    >
      <Canvas
        dpr={compact ? 1 : [1, 1.25]}
        camera={{
          position: [0, 0, 5.8],
          fov: 34,
          near: 0.1,
          far: 100,
        }}
        gl={rendererSettings}
        frameloop={active ? 'always' : 'never'}
        performance={{ min: 0.72, max: 1, debounce: 260 }}
      >
        <Suspense fallback={null}>
          <ServiceRing3D scrollProgress={scrollProgress} />
          <CinematicEnvironment />
        </Suspense>
      </Canvas>
    </div>
  )
}
