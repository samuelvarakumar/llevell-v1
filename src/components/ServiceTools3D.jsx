import React, { useMemo, useRef } from 'react'
import {
  ContactShadows,
  Environment,
  Lightformer,
  Line,
  RoundedBox,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function animatedValue(value) {
  if (typeof value === 'number') return value
  return value?.get?.() ?? 0
}

function Material({
  color = '#f4f0e8',
  metalness = 0.08,
  roughness = 0.28,
  emissive = '#000000',
  emissiveIntensity = 0,
  transparent = false,
  opacity = 1,
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      clearcoat={1}
      clearcoatRoughness={0.16}
      envMapIntensity={1.45}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      transparent={transparent}
      opacity={opacity}
    />
  )
}

function Slab({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [1, 1, 0.1],
  radius = 0.12,
  color = '#f4f0e8',
  children,
  dark = false,
  accent = false,
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={size} radius={radius} smoothness={5}>
        <Material
          color={color}
          metalness={dark ? 0.32 : 0.06}
          roughness={dark ? 0.22 : 0.3}
          emissive={accent ? color : '#000000'}
          emissiveIntensity={accent ? 0.16 : 0}
        />
      </RoundedBox>
      {children}
    </group>
  )
}

function Bar({ position, size, color = '#aeb5ad', accent = false, radius = 0.04 }) {
  return (
    <RoundedBox position={position} args={size} radius={radius} smoothness={3}>
      <Material
        color={color}
        roughness={0.32}
        emissive={accent ? color : '#000000'}
        emissiveIntensity={accent ? 0.18 : 0}
      />
    </RoundedBox>
  )
}

function Cursor({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#c8ff45' }) {
  const shape = useMemo(() => {
    const cursor = new THREE.Shape()
    cursor.moveTo(0, 0.56)
    cursor.lineTo(-0.36, -0.48)
    cursor.lineTo(0.01, -0.28)
    cursor.lineTo(0.27, -0.58)
    cursor.lineTo(0.43, -0.44)
    cursor.lineTo(0.18, -0.14)
    cursor.lineTo(0.5, -0.04)
    cursor.closePath()
    return cursor
  }, [])

  return (
    <mesh position={position} rotation={rotation}>
      <shapeGeometry args={[shape]} />
      <meshPhysicalMaterial
        color={color}
        side={THREE.DoubleSide}
        roughness={0.2}
        clearcoat={1}
        emissive={color}
        emissiveIntensity={0.24}
      />
    </mesh>
  )
}

function FigmaMark({ position = [0, 0, 0], scale = 1 }) {
  const nodes = [
    [-0.13, 0.28, '#f24e1e', 'capsule'],
    [0.13, 0.28, '#ff7262', 'circle'],
    [-0.13, 0, '#a259ff', 'capsule'],
    [0.13, 0, '#1abcfe', 'circle'],
    [-0.13, -0.28, '#0acf83', 'circle'],
  ]

  return (
    <group position={position} scale={scale}>
      {nodes.map(([x, y, color, type]) => (
        <RoundedBox
          key={`${x}-${y}`}
          position={[x, y, 0]}
          args={[type === 'capsule' ? 0.26 : 0.25, 0.25, 0.08]}
          radius={type === 'circle' ? 0.125 : 0.12}
          smoothness={5}
        >
          <Material
            color={color}
            roughness={0.22}
            emissive={color}
            emissiveIntensity={0.08}
          />
        </RoundedBox>
      ))}
    </group>
  )
}

function BrowserShell({ children, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <Slab
      position={position}
      rotation={rotation}
      size={[4.6, 3.05, 0.24]}
      radius={0.24}
      color="#151a17"
      dark
    >
      <RoundedBox position={[0, -0.02, 0.145]} args={[4.36, 2.8, 0.055]} radius={0.18} smoothness={5}>
        <Material color="#f2efe7" roughness={0.36} />
      </RoundedBox>
      <group position={[-1.88, 1.22, 0.19]}>
        {['#ff6f61', '#ffc857', '#59d98e'].map((color, index) => (
          <mesh key={color} position={[index * 0.2, 0, 0]}>
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
      {children}
    </Slab>
  )
}

function UIUXScene() {
  return (
    <group>
      <Slab
        position={[-0.72, 0.18, -0.92]}
        rotation={[0.04, -0.22, -0.07]}
        size={[3.65, 2.45, 0.16]}
        color="#383e39"
        dark
      />
      <Slab
        position={[0.72, -0.1, -0.48]}
        rotation={[-0.03, 0.2, 0.07]}
        size={[3.75, 2.55, 0.18]}
        color="#dfe4dc"
      />

      <Slab size={[4.25, 2.86, 0.22]} radius={0.24} color="#f4f0e8">
        <Slab position={[-1.65, 0, 0.145]} size={[0.7, 2.58, 0.045]} radius={0.15} color="#171c18" dark>
          <FigmaMark position={[0, 0.74, 0.045]} scale={0.9} />
          {[0.27, -0.08, -0.43, -0.78].map((y, index) => (
            <Bar
              key={y}
              position={[0, y, 0.045]}
              size={[index === 0 ? 0.38 : 0.3, 0.07, 0.035]}
              color={index === 0 ? '#c8ff45' : '#667069'}
              accent={index === 0}
            />
          ))}
        </Slab>

        <group position={[0.4, 0.58, 0.16]}>
          <Bar position={[-0.62, 0.36, 0]} size={[1.2, 0.13, 0.055]} color="#1c211e" />
          <Bar position={[-0.82, 0.1, 0]} size={[0.8, 0.09, 0.045]} />
          <Bar position={[-0.68, -0.1, 0]} size={[1.08, 0.09, 0.045]} color="#c6cbc4" />
          <Slab position={[-0.65, -0.64, 0]} size={[1.45, 0.64, 0.055]} radius={0.13} color="#d8ddd5" />
          <Slab position={[0.92, -0.64, 0]} size={[1.16, 0.64, 0.055]} radius={0.13} color="#c8ff45" accent />
          <Slab position={[0.94, 0.44, 0]} size={[1.12, 0.82, 0.055]} radius={0.16} color="#242b26" dark>
            <Bar position={[0, 0.16, 0.05]} size={[0.64, 0.09, 0.035]} color="#f4f0e8" />
            <Bar position={[-0.15, -0.08, 0.05]} size={[0.34, 0.07, 0.035]} color="#98a19a" />
          </Slab>
        </group>
      </Slab>

      <Cursor position={[1.63, -1.15, 0.62]} rotation={[0, 0.03, -0.12]} />
      <Slab position={[-2.16, 1.26, 0.62]} rotation={[0.2, 0.3, -0.08]} size={[0.58, 0.58, 0.16]} radius={0.18} color="#a259ff" accent />
      <Slab position={[2.14, 1.08, -0.08]} rotation={[-0.12, -0.18, 0.12]} size={[0.5, 0.5, 0.15]} radius={0.16} color="#1abcfe" accent />
    </group>
  )
}

function WebScene() {
  return (
    <group>
      <BrowserShell rotation={[0.02, -0.07, -0.015]}>
        <Slab position={[-1.04, -0.08, 0.19]} size={[1.84, 2.18, 0.05]} radius={0.13} color="#1b211d" dark>
          {[0.72, 0.42, 0.12, -0.18, -0.48, -0.78].map((y, index) => (
            <group key={y} position={[-0.48 + (index % 3) * 0.12, y, 0.04]}>
              <Bar size={[index % 2 === 0 ? 0.74 : 1.03, 0.07, 0.03]} color={index === 2 ? '#c8ff45' : index === 4 ? '#68d6ff' : '#6f7a72'} accent={index === 2} />
            </group>
          ))}
        </Slab>

        <group position={[1.0, 0.05, 0.19]}>
          <Bar position={[-0.2, 0.87, 0]} size={[1.44, 0.14, 0.045]} color="#242a26" />
          <Bar position={[-0.42, 0.58, 0]} size={[1, 0.09, 0.04]} />
          <Slab position={[-0.2, 0.05, 0]} size={[1.58, 0.62, 0.05]} radius={0.14} color="#c8ff45" accent />
          <Slab position={[-0.58, -0.74, 0]} size={[0.82, 0.58, 0.05]} radius={0.14} color="#d7dcd4" />
          <Slab position={[0.42, -0.74, 0]} size={[0.82, 0.58, 0.05]} radius={0.14} color="#252b27" dark />
        </group>
      </BrowserShell>

      <group position={[2.15, -1.15, 0.5]} rotation={[0.16, -0.18, -0.12]}>
        <group position={[-0.2, 0, 0]} rotation={[0, 0, 0.55]}>
          <Bar size={[0.11, 0.82, 0.09]} color="#68d6ff" accent />
        </group>
        <group position={[0.2, 0, 0]} rotation={[0, 0, -0.55]}>
          <Bar size={[0.11, 0.82, 0.09]} color="#68d6ff" accent />
        </group>
      </group>

      <group position={[-2.18, -1.08, 0.4]}>
        {[0, 1, 2].map((index) => (
          <Slab
            key={index}
            position={[index * 0.14, index * 0.14, -index * 0.12]}
            rotation={[0.08, -0.16, -0.08]}
            size={[0.72, 0.72, 0.12]}
            radius={0.18}
            color={index === 2 ? '#c8ff45' : '#3e4741'}
            accent={index === 2}
            dark={index !== 2}
          />
        ))}
      </group>
    </group>
  )
}

function Phone({ position, rotation, color = '#f2efe7', accent = '#c8ff45', scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Slab size={[1.48, 2.95, 0.26]} radius={0.28} color="#151a17" dark>
        <RoundedBox position={[0, 0, 0.155]} args={[1.28, 2.68, 0.055]} radius={0.22} smoothness={6}>
          <Material color={color} roughness={0.35} />
        </RoundedBox>
        <Bar position={[0, 1.16, 0.2]} size={[0.36, 0.06, 0.035]} color="#1e2420" />
        <Slab position={[0, 0.5, 0.2]} size={[0.96, 0.72, 0.045]} radius={0.16} color={accent} accent />
        <Bar position={[-0.24, -0.02, 0.2]} size={[0.48, 0.09, 0.035]} color="#252b27" />
        <Bar position={[-0.06, -0.24, 0.2]} size={[0.84, 0.075, 0.03]} />
        <Slab position={[-0.28, -0.75, 0.2]} size={[0.42, 0.42, 0.045]} radius={0.12} color="#d2d7d0" />
        <Slab position={[0.28, -0.75, 0.2]} size={[0.42, 0.42, 0.045]} radius={0.12} color="#242a26" dark />
        <Bar position={[0, -1.12, 0.2]} size={[0.78, 0.14, 0.035]} color="#242a26" />
      </Slab>
    </group>
  )
}

function AppScene() {
  return (
    <group>
      <Phone position={[-1.2, -0.12, -0.55]} rotation={[0.04, 0.28, -0.1]} color="#e1e6df" accent="#68d6ff" scale={0.86} />
      <Phone position={[1.18, -0.1, -0.5]} rotation={[-0.02, -0.28, 0.1]} color="#252b27" accent="#a259ff" scale={0.86} />
      <Phone position={[0, 0.12, 0.35]} rotation={[0.02, -0.04, -0.02]} />

      <Slab position={[-2.05, 1.2, 0.12]} rotation={[0.12, 0.18, -0.12]} size={[0.56, 0.56, 0.14]} radius={0.17} color="#ff7262" accent />
      <Slab position={[2.02, 1.08, 0.1]} rotation={[-0.12, -0.2, 0.08]} size={[0.56, 0.56, 0.14]} radius={0.17} color="#68d6ff" accent />
      <Cursor position={[1.55, -1.25, 0.68]} rotation={[0.06, -0.08, -0.15]} color="#c8ff45" />
    </group>
  )
}

function Database({ position = [0, 0, 0], color = '#4d5750' }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[0, index * 0.19, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.17, 48]} />
          <Material
            color={index === 2 ? '#c8ff45' : color}
            metalness={0.32}
            roughness={0.24}
            emissive={index === 2 ? '#c8ff45' : '#000000'}
            emissiveIntensity={index === 2 ? 0.15 : 0}
          />
        </mesh>
      ))}
    </group>
  )
}

function PlatformScene() {
  const points = useMemo(
    () => [
      [-1.55, 0.75, 0.1],
      [-0.8, 0.2, 0.25],
      [0, 0.72, 0.15],
      [0.85, 0.08, 0.28],
      [1.55, 0.7, 0.08],
    ],
    [],
  )

  return (
    <group>
      <Slab size={[4.35, 2.7, 0.2]} radius={0.24} color="#171c18" dark>
        <Slab position={[-1.35, 0, 0.14]} size={[1.18, 2.36, 0.045]} radius={0.16} color="#262d28" dark>
          <Bar position={[0, 0.78, 0.045]} size={[0.68, 0.1, 0.035]} color="#f3f0e8" />
          {[0.38, 0, -0.38].map((y, index) => (
            <Slab key={y} position={[0, y, 0.045]} size={[0.74, 0.24, 0.035]} radius={0.09} color={index === 0 ? '#c8ff45' : '#4a544d'} accent={index === 0} />
          ))}
        </Slab>

        <group position={[0.62, 0.05, 0.15]}>
          <Slab position={[-0.52, 0.68, 0]} size={[1.16, 0.62, 0.04]} radius={0.13} color="#f2efe7">
            <Bar position={[-0.18, 0.08, 0.04]} size={[0.48, 0.08, 0.03]} color="#252b27" />
            <Bar position={[-0.28, -0.12, 0.04]} size={[0.28, 0.06, 0.03]} />
          </Slab>
          <Slab position={[0.82, 0.68, 0]} size={[1.16, 0.62, 0.04]} radius={0.13} color="#c8ff45" accent />
          <Slab position={[-0.5, -0.45, 0]} size={[1.18, 1.2, 0.04]} radius={0.14} color="#e0e5dd">
            {[0.52, 0.15, -0.22].map((y, index) => (
              <Bar key={y} position={[-0.08, y, 0.04]} size={[0.72 - index * 0.12, 0.075, 0.03]} color={index === 1 ? '#68d6ff' : '#6b746d'} accent={index === 1} />
            ))}
          </Slab>
          <Slab position={[0.84, -0.45, 0]} size={[1.16, 1.2, 0.04]} radius={0.14} color="#252b27" dark>
            {[0.35, 0.7, 0.98].map((height, index) => (
              <Bar key={height} position={[-0.32 + index * 0.32, -0.5 + height / 2, 0.04]} size={[0.17, height, 0.03]} color={index === 2 ? '#c8ff45' : '#768079'} accent={index === 2} radius={0.07} />
            ))}
          </Slab>
        </group>
      </Slab>

      <Line points={points} color="#c8ff45" lineWidth={1.2} transparent opacity={0.5} />
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.055, 18, 18]} />
          <meshStandardMaterial color={index === 2 ? '#68d6ff' : '#c8ff45'} emissive={index === 2 ? '#68d6ff' : '#c8ff45'} emissiveIntensity={0.3} />
        </mesh>
      ))}

      <Database position={[2.1, -1.05, 0.45]} />
      <group position={[-2.1, -1.05, 0.45]}>
        <Slab size={[0.95, 0.86, 0.18]} radius={0.19} color="#f2efe7" />
        <mesh position={[0, 0.46, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.045, 14, 36, Math.PI]} />
          <meshStandardMaterial color="#c8ff45" emissive="#c8ff45" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  )
}

function GrowthScene() {
  return (
    <group>
      <Slab position={[-0.25, 0, 0]} size={[4.2, 2.75, 0.2]} radius={0.24} color="#f2efe7">
        <group position={[-0.82, -0.3, 0.14]}>
          {[0.45, 0.72, 1.05, 1.42, 1.75].map((height, index) => (
            <Bar
              key={height}
              position={[index * 0.43, height / 2 - 0.66, 0]}
              size={[0.24, height, 0.055]}
              color={index === 4 ? '#c8ff45' : index === 3 ? '#68d6ff' : '#a9b0a9'}
              accent={index >= 3}
              radius={0.09}
            />
          ))}
        </group>
        <Bar position={[-1.35, 0.92, 0.14]} size={[0.82, 0.13, 0.045]} color="#252b27" />
        <Bar position={[-1.52, 0.62, 0.14]} size={[0.48, 0.08, 0.04]} />
        <Slab position={[1.24, 0.72, 0.14]} size={[0.92, 0.7, 0.05]} radius={0.15} color="#242a26" dark>
          <Bar position={[0, 0.12, 0.045]} size={[0.48, 0.09, 0.03]} color="#c8ff45" accent />
          <Bar position={[-0.12, -0.13, 0.045]} size={[0.27, 0.06, 0.03]} color="#8d9790" />
        </Slab>
      </Slab>

      <Slab position={[1.78, -0.8, 0.52]} rotation={[0.08, -0.2, 0.1]} size={[1.18, 0.92, 0.18]} radius={0.2} color="#1a201c" dark>
        <Bar position={[0, 0.2, 0.08]} size={[0.64, 0.08, 0.04]} color="#f2efe7" />
        <Bar position={[-0.12, -0.08, 0.08]} size={[0.36, 0.07, 0.035]} color="#c8ff45" accent />
      </Slab>

      <group position={[1.7, 1.05, 0.58]} rotation={[0, 0, -0.12]}>
        <Bar position={[-0.52, -0.32, 0]} size={[0.1, 0.68, 0.08]} color="#c8ff45" accent />
        <Bar position={[-0.05, -0.04, 0]} size={[0.1, 0.98, 0.08]} color="#c8ff45" accent />
        <Bar position={[0.45, 0.34, 0]} size={[0.1, 0.76, 0.08]} color="#c8ff45" accent />
        <mesh position={[0.62, 0.73, 0]} rotation={[0, 0, -0.55]}>
          <coneGeometry args={[0.17, 0.42, 3]} />
          <meshStandardMaterial color="#c8ff45" emissive="#c8ff45" emissiveIntensity={0.22} />
        </mesh>
      </group>

      <Slab position={[-2.1, -1.08, 0.4]} rotation={[-0.12, 0.16, -0.08]} size={[0.72, 0.72, 0.16]} radius={0.2} color="#68d6ff" accent />
    </group>
  )
}

const SCENES = [UIUXScene, WebScene, AppScene, PlatformScene, GrowthScene]

function CornerFrame() {
  const corners = [
    [-2.65, 1.82, 0],
    [2.65, 1.82, 0],
    [-2.65, -1.82, 0],
    [2.65, -1.82, 0],
  ]

  return (
    <group position={[0, 0, -1.35]}>
      {corners.map(([x, y], index) => {
        const right = x > 0
        const top = y > 0

        return (
          <group key={`${x}-${y}`} position={[x, y, 0]}>
            <Bar
              position={[right ? -0.26 : 0.26, 0, 0]}
              size={[0.54, 0.025, 0.025]}
              color={index === 0 ? '#c8ff45' : '#475049'}
              accent={index === 0}
            />
            <Bar
              position={[0, top ? -0.26 : 0.26, 0]}
              size={[0.025, 0.54, 0.025]}
              color={index === 0 ? '#c8ff45' : '#475049'}
              accent={index === 0}
            />
          </group>
        )
      })}
    </group>
  )
}

function ServiceStage({ activeIndex, scrollProgress, compactMode }) {
  const rootRef = useRef(null)
  const sceneRefs = useRef([])

  useFrame((state, delta) => {
    const root = rootRef.current
    if (!root) return

    const pointerStrength = compactMode ? 0 : 1
    const progress = THREE.MathUtils.clamp(animatedValue(scrollProgress), 0, 1)
    const elapsed = state.clock.elapsedTime

    root.rotation.y = THREE.MathUtils.damp(
      root.rotation.y,
      state.pointer.x * 0.09 * pointerStrength,
      4.5,
      delta,
    )
    root.rotation.x = THREE.MathUtils.damp(
      root.rotation.x,
      -0.045 - state.pointer.y * 0.055 * pointerStrength,
      4.5,
      delta,
    )
    root.position.y = THREE.MathUtils.damp(
      root.position.y,
      Math.sin(elapsed * 0.58) * 0.055 - progress * 0.08,
      4,
      delta,
    )

    sceneRefs.current.forEach((scene, index) => {
      if (!scene) return

      const difference = index - activeIndex
      const active = difference === 0
      const direction = Math.sign(difference)
      const targetX = active ? 0 : direction * 6.4
      const targetY = active ? 0 : -0.38
      const targetZ = active ? 0 : -3.6
      const targetScale = active ? 1 : 0.72
      const targetRotation = active ? 0 : -direction * 0.48

      scene.position.x = THREE.MathUtils.damp(scene.position.x, targetX, 5.2, delta)
      scene.position.y = THREE.MathUtils.damp(scene.position.y, targetY, 5.2, delta)
      scene.position.z = THREE.MathUtils.damp(scene.position.z, targetZ, 5.2, delta)
      scene.rotation.y = THREE.MathUtils.damp(scene.rotation.y, targetRotation, 5.2, delta)

      const nextScale = THREE.MathUtils.damp(scene.scale.x, targetScale, 5.2, delta)
      scene.scale.setScalar(nextScale)
      scene.visible = active || Math.abs(scene.position.x) < 5.8
    })
  })

  return (
    <group ref={rootRef} position={[0.28, 0.04, 0]}>
      <CornerFrame />

      {SCENES.map((Scene, index) => (
        <group
          key={index}
          ref={(node) => {
            sceneRefs.current[index] = node
          }}
          position={[index === 0 ? 0 : 6.4, 0, index === 0 ? 0 : -3.6]}
          scale={index === 0 ? 1 : 0.72}
        >
          <Scene />
        </group>
      ))}
    </group>
  )
}

export default function ServiceTools3D({
  activeIndex,
  scrollProgress,
  compactMode = false,
}) {
  return (
    <>
      <ServiceStage
        activeIndex={activeIndex}
        scrollProgress={scrollProgress}
        compactMode={compactMode}
      />

      {!compactMode && (
        <ContactShadows
          position={[0, -2.15, -0.4]}
          opacity={0.4}
          scale={9}
          blur={2.8}
          far={4.5}
          resolution={512}
          color="#000000"
        />
      )}
    </>
  )
}

export function ServicesStudioEnvironment({ compactMode = false }) {
  return (
    <>
      <ambientLight intensity={compactMode ? 0.48 : 0.34} />
      <directionalLight position={[5, 7, 7]} intensity={2.7} color="#fff4df" />
      <spotLight
        position={[-5, 3, 6]}
        intensity={2.2}
        angle={0.5}
        penumbra={0.9}
        color="#dceaff"
      />
      <pointLight position={[0, -1.8, 4]} intensity={1.4} color="#c8ff45" />
      <pointLight position={[3.5, 1.8, 2]} intensity={0.8} color="#68d6ff" />

      <Environment resolution={64}>
        <group rotation={[-Math.PI / 3, 0, 0.8]}>
          <Lightformer form="rect" intensity={4.8} position={[0, 5, -6]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={2.8} position={[-5, 1, 2]} scale={[3, 6, 1]} />
          <Lightformer form="rect" intensity={2.2} position={[5, -1, 1]} scale={[2, 5, 1]} />
        </group>
      </Environment>
    </>
  )
}
