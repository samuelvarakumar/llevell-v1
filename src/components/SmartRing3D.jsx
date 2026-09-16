import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FINISHES = {
  titanium: {
    label: 'Titanium',
    shell: '#b9b1a5',
    liner: '#111311',
    accent: '#d8ff58',
    roughness: 0.24,
  },
  graphite: {
    label: 'Graphite',
    shell: '#242825',
    liner: '#050605',
    accent: '#c7ff42',
    roughness: 0.18,
  },
  gold: {
    label: 'Soft gold',
    shell: '#c89b56',
    liner: '#17120d',
    accent: '#f3d27d',
    roughness: 0.21,
  },
}

export { FINISHES }

function readAnimatedValue(value) {
  if (typeof value === 'number') return value
  return value?.get?.() ?? 0
}

function Grooves({ color }) {
  const meshRef = useRef(null)
  const count = 42
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2
      const radius = 1.55
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
      dummy.rotation.set(0, 0, angle)
      dummy.scale.set(1, 1, 0.86)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
  }, [dummy])

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.03, 0.75, 0.025]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.34}
        transparent
        opacity={0.34}
      />
    </instancedMesh>
  )
}

function SensorVisual({ color }) {
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.13, 18, 18]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.38}
          metalness={0.15}
          roughness={0.18}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[0, 0, -0.055]}>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 20]} />
        <meshStandardMaterial color="#101310" metalness={0.55} roughness={0.35} />
      </mesh>
    </>
  )
}

function RingCore({ finish = 'titanium', explode = 0 }) {
  const palette = FINISHES[finish] ?? FINISHES.titanium
  const shellRef = useRef(null)
  const linerRef = useRef(null)
  const chipRef = useRef(null)
  const sensorRefs = useRef([])
  const currentExplode = useRef(0)
  const sensorAngles = useMemo(
    () => [Math.PI * 0.15, Math.PI * 0.5, Math.PI * 0.85],
    [],
  )

  useFrame((_, delta) => {
    const target = THREE.MathUtils.clamp(readAnimatedValue(explode), 0, 1)
    currentExplode.current = THREE.MathUtils.damp(currentExplode.current, target, 7, delta)
    const value = currentExplode.current

    if (shellRef.current) shellRef.current.position.z = value * 0.54
    if (linerRef.current) linerRef.current.position.z = -value * 0.46

    sensorAngles.forEach((angle, index) => {
      const node = sensorRefs.current[index]
      if (!node) return
      const radius = 1.12 + value * 0.22
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        -0.12 - value * 0.25,
      )
    })

    if (chipRef.current) {
      chipRef.current.position.set(
        0,
        -1.48 - value * 0.16,
        -0.2 - value * 0.2,
      )
    }
  })

  return (
    <group>
      <group ref={shellRef}>
        <mesh>
          <torusGeometry args={[1.55, 0.43, 48, 128]} />
          <meshPhysicalMaterial
            color={palette.shell}
            metalness={0.96}
            roughness={palette.roughness}
            clearcoat={0.75}
            clearcoatRoughness={0.12}
            envMapIntensity={1.6}
          />
        </mesh>
        <Grooves color={palette.shell} />
      </group>

      <group ref={linerRef}>
        <mesh>
          <torusGeometry args={[1.51, 0.315, 40, 104]} />
          <meshPhysicalMaterial
            color={palette.liner}
            metalness={0.36}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.2}
          />
        </mesh>
        <mesh position={[0, 0, -0.12]}>
          <torusGeometry args={[1.49, 0.22, 32, 88]} />
          <meshPhysicalMaterial
            color="#030403"
            metalness={0.45}
            roughness={0.1}
            clearcoat={1}
          />
        </mesh>
      </group>

      {sensorAngles.map((angle, index) => (
        <group
          key={angle}
          ref={(node) => { sensorRefs.current[index] = node }}
          position={[Math.cos(angle) * 1.12, Math.sin(angle) * 1.12, -0.12]}
          rotation={[0, 0, angle + Math.PI / 2]}
        >
          <SensorVisual color={index === 1 ? '#f4f5eb' : palette.accent} />
        </group>
      ))}

      <group ref={chipRef} position={[0, -1.48, -0.2]}>
        <RoundedBox args={[0.54, 0.19, 0.12]} radius={0.06} smoothness={3}>
          <meshPhysicalMaterial color="#0c0f0c" metalness={0.55} roughness={0.2} clearcoat={1} />
        </RoundedBox>
      </group>
    </group>
  )
}

export default function SmartRing3D({
  finish = 'titanium',
  explode = 0,
  scrollProgress,
  mode = 'hero',
  autoRotate = true,
}) {
  const root = useRef(null)
  const targetRotation = useRef({ x: -0.28, y: 0.35 })

  useFrame((state, delta) => {
    if (!root.current) return

    const progress = scrollProgress?.get?.() ?? 0
    const pointerX = state.pointer.x
    const pointerY = state.pointer.y

    let baseX = mode === 'heart' ? -0.2 : -0.34
    let baseY = mode === 'heart' ? 0.55 : 0.2
    let targetScale = 1
    let targetX = 0
    let targetY = 0

    if (mode === 'hero') {
      baseX += progress * 0.45
      baseY += progress * 1.4
      targetScale = 1 - progress * 0.22
      targetY = progress * -0.45
    }

    if (mode === 'showcase') {
      baseX = -0.32 + progress * 0.75
      baseY = 0.25 + progress * Math.PI * 2.35
      targetScale = 0.92 + Math.sin(progress * Math.PI) * 0.2
      targetX = THREE.MathUtils.lerp(-0.7, 0.65, progress)
      targetY = Math.sin(progress * Math.PI * 2) * 0.28
    }

    if (mode === 'heart') {
      baseX += progress * 0.3
      baseY += progress * 1.6
      targetScale = 1.02 + progress * 0.08
    }

    targetRotation.current.x = baseX - pointerY * 0.14
    targetRotation.current.y = baseY + pointerX * 0.2

    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, targetRotation.current.x, 5, delta)
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      targetRotation.current.y + (autoRotate ? state.clock.elapsedTime * 0.065 : 0),
      5,
      delta,
    )
    root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, pointerX * -0.05, 5, delta)
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, targetX, 4, delta)
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, targetY, 4, delta)
    root.current.scale.setScalar(THREE.MathUtils.damp(root.current.scale.x, targetScale, 4, delta))
  })

  return (
    <group ref={root} rotation={[-0.34, 0.2, 0]}>
      <RingCore finish={finish} explode={explode} />
    </group>
  )
}

export function StudioEnvironment({ dark = false }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.2 : 0.34} />
      <directionalLight
        position={[5, 7, 6]}
        intensity={dark ? 2.8 : 2.25}
        color="#fff8ec"
      />
      <spotLight
        position={[-5, 3, 5]}
        intensity={dark ? 2.35 : 1.8}
        angle={0.5}
        penumbra={0.8}
        color="#d9e7ff"
      />
      <pointLight position={[0, -4, 2]} intensity={dark ? 1.85 : 1.2} color="#c7ff42" />

      <Environment resolution={64}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="rect" intensity={4.2} position={[0, 5, -7]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[-5, 1, 2]} scale={[3, 6, 1]} />
          <Lightformer form="rect" intensity={1.7} position={[5, -1, 1]} scale={[2, 5, 1]} />
        </group>
      </Environment>
    </>
  )
}
