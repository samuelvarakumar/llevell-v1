import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TILE_LAYOUT = [
  [1, 0], [2, 0], [3, 0],
  [0, 1], [1, 1], [2, 1], [3, 1],
  [0, 2], [1, 2], [2, 2], [3, 2],
  [0, 3], [1, 3], [2, 3],
]

const HIGHLIGHTED_L_TILES = new Set(['1-0', '1-1', '1-2', '2-2'])

function seededValue(index, salt = 0) {
  const value = Math.sin((index + 1) * 91.731 + salt * 17.13) * 43758.5453
  return value - Math.floor(value)
}

function readAnimatedValue(value) {
  if (typeof value === 'number') return value
  return value?.get?.() ?? 0
}

function SignalDust() {
  const pointsRef = useRef(null)
  const positions = useMemo(() => {
    const count = 120
    const values = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const radius = 2.4 + seededValue(index, 2) * 2.4
      const angle = seededValue(index, 3) * Math.PI * 2
      values[index * 3] = Math.cos(angle) * radius
      values[index * 3 + 1] = (seededValue(index, 4) - 0.5) * 5.4
      values[index * 3 + 2] = (seededValue(index, 5) - 0.5) * 2.8
    }

    return values
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.z += delta * 0.018
    pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c7ff42"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
      />
    </points>
  )
}

function LogoTile({ index, tileRef, isHighlighted }) {
  const frontColor = isHighlighted ? '#ffffff' : '#9a9a96'
  const shellColor = isHighlighted ? '#141414' : '#2a2a2a'
  const glowColor = isHighlighted ? '#ffffff' : '#7d7d78'

  return (
    <group ref={tileRef}>
      <RoundedBox args={[0.82, 0.82, 0.28]} radius={0.18} smoothness={5}>
        <meshPhysicalMaterial
          color={shellColor}
          metalness={0.62}
          roughness={isHighlighted ? 0.16 : 0.34}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.45}
        />
      </RoundedBox>

      <RoundedBox position={[0, 0, 0.17]} args={[0.72, 0.72, 0.065]} radius={0.16} smoothness={5}>
        <meshPhysicalMaterial
          color={frontColor}
          metalness={isHighlighted ? 0.02 : 0.04}
          roughness={isHighlighted ? 0.12 : 0.42}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.8}
        />
      </RoundedBox>

      <RoundedBox position={[0, 0, -0.17]} args={[0.65, 0.65, 0.035]} radius={0.145} smoothness={4}>
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={isHighlighted ? 1.15 : 0.18}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
    </group>
  )
}

export default function LogoMark3D({ scrollProgress, autoRotate = true }) {
  const rootRef = useRef(null)
  const tileRefs = useRef([])
  const burstRef = useRef(0)
  const introComplete = useRef(false)

  const tileData = useMemo(
    () => TILE_LAYOUT.map(([column, row], index) => {
      const x = (column - 1.5) * 0.94
      const y = (1.5 - row) * 0.94
      const length = Math.max(Math.hypot(x, y), 0.001)

      return {
        index,
        column,
        row,
        isHighlighted: HIGHLIGHTED_L_TILES.has(`${column}-${row}`),
        x,
        y,
        nx: x / length,
        ny: y / length,
        start: new THREE.Vector3(
          (seededValue(index, 7) - 0.5) * 8.5,
          (seededValue(index, 8) - 0.5) * 7.4,
          -3.6 - seededValue(index, 9) * 4.5,
        ),
        startRotation: new THREE.Euler(
          (seededValue(index, 10) - 0.5) * Math.PI * 2,
          (seededValue(index, 11) - 0.5) * Math.PI * 2,
          (seededValue(index, 12) - 0.5) * Math.PI * 2,
        ),
      }
    }),
    [],
  )

  useLayoutEffect(() => {
    tileData.forEach((tile, index) => {
      const node = tileRefs.current[index]
      if (!node) return
      node.position.copy(tile.start)
      node.rotation.copy(tile.startRotation)
      node.scale.setScalar(0.15)
    })
  }, [tileData])

  useFrame((state, delta) => {
    const root = rootRef.current
    if (!root) return

    const elapsed = state.clock.elapsedTime
    const progress = THREE.MathUtils.clamp(readAnimatedValue(scrollProgress), 0, 1)
    const pointerX = state.pointer.x
    const pointerY = state.pointer.y
    const scrollScatter = THREE.MathUtils.smoothstep(progress, 0.24, 0.92)

    burstRef.current = THREE.MathUtils.damp(burstRef.current, 0, 4.8, delta)
    const burst = burstRef.current

    tileData.forEach((tile, index) => {
      const node = tileRefs.current[index]
      if (!node) return

      const delay = index * 0.045
      const assembly = THREE.MathUtils.smootherstep(elapsed - delay, 0.05, 1.28)
      const signalWave = Math.sin(elapsed * 2.25 - (tile.column + tile.row) * 0.72)
      const highlightBoost = tile.isHighlighted ? 1 : 0
      const hoverDepth = (pointerX * tile.nx + pointerY * tile.ny) * 0.14
      const outward = scrollScatter * 0.48 + burst * 1.35

      const targetX = tile.x + tile.nx * outward + pointerX * tile.row * 0.008
      const targetY = tile.y + tile.ny * outward - pointerY * tile.column * 0.008
      const targetZ = signalWave * (tile.isHighlighted ? 0.05 : 0.035) + hoverDepth + scrollScatter * ((index % 3) - 1) * 0.15 + highlightBoost * 0.02

      if (assembly > 0) {
        node.position.x = THREE.MathUtils.damp(node.position.x, targetX, 6.8, delta)
        node.position.y = THREE.MathUtils.damp(node.position.y, targetY, 6.8, delta)
        node.position.z = THREE.MathUtils.damp(node.position.z, targetZ, 6.8, delta)
        node.rotation.x = THREE.MathUtils.damp(node.rotation.x, -pointerY * 0.11 + scrollScatter * 0.12, 6, delta)
        node.rotation.y = THREE.MathUtils.damp(node.rotation.y, pointerX * 0.12 + scrollScatter * 0.22, 6, delta)
        node.rotation.z = THREE.MathUtils.damp(node.rotation.z, signalWave * 0.012, 6, delta)

        const pulse = 1 + Math.max(0, signalWave) * (tile.isHighlighted ? 0.035 : 0.014) * (1 - scrollScatter)
        const targetScale = assembly * pulse
        node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, targetScale, 7.2, delta))
      }
    })

    if (!introComplete.current && elapsed > 1.8) introComplete.current = true

    const idleFloat = introComplete.current ? Math.sin(elapsed * 0.65) * 0.045 : 0
    const targetScale = 1.02 - progress * 0.12
    const targetY = idleFloat - progress * 0.34

    root.rotation.x = THREE.MathUtils.damp(root.rotation.x, -0.08 - pointerY * 0.075 + progress * 0.14, 4.5, delta)
    root.rotation.y = THREE.MathUtils.damp(
      root.rotation.y,
      0.02 + pointerX * 0.105 + progress * 0.46 + (autoRotate ? Math.sin(elapsed * 0.34) * 0.055 : 0),
      4.5,
      delta,
    )
    root.rotation.z = THREE.MathUtils.damp(root.rotation.z, -pointerX * 0.025, 4.5, delta)
    root.position.y = THREE.MathUtils.damp(root.position.y, targetY, 4, delta)
    root.scale.setScalar(THREE.MathUtils.damp(root.scale.x, targetScale, 4, delta))
  })

  return (
    <group
      ref={rootRef}
      scale={0.94}
      onPointerDown={(event) => {
        event.stopPropagation()
        burstRef.current = 1
      }}
    >
      <SignalDust />
      {tileData.map((tile, index) => (
        <LogoTile
          key={`${tile.column}-${tile.row}`}
          index={index}
          isHighlighted={tile.isHighlighted}
          tileRef={(node) => { tileRefs.current[index] = node }}
        />
      ))}
    </group>
  )
}

export function LogoStudioEnvironment() {
  return (
    <>
      <ambientLight intensity={0.38} />
      <directionalLight position={[5, 7, 7]} intensity={2.6} color="#fff7ea" />
      <spotLight position={[-5, 3, 6]} intensity={2.1} angle={0.48} penumbra={0.88} color="#dce8ff" />
      <pointLight position={[0, -3, 3]} intensity={1.6} color="#c7ff42" />

      <Environment resolution={64}>
        <group rotation={[-Math.PI / 3, 0, 0.8]}>
          <Lightformer form="rect" intensity={4.6} position={[0, 5, -6]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={2.8} position={[-5, 1, 2]} scale={[3, 6, 1]} />
          <Lightformer form="rect" intensity={2.1} position={[5, -1, 1]} scale={[2, 5, 1]} />
        </group>
      </Environment>
    </>
  )
}
