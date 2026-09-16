import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TAU = Math.PI * 2

function readMotionValue(value) {
  if (typeof value === 'number') return value
  return value?.get?.() ?? 0
}

function collectMaterials(root) {
  const materials = []
  const seen = new Set()

  root?.traverse((object) => {
    if (!object.material) return

    const objectMaterials = Array.isArray(object.material)
      ? object.material
      : [object.material]

    objectMaterials.forEach((material) => {
      if (!material || seen.has(material.uuid)) return
      seen.add(material.uuid)
      material.transparent = true
      materials.push({
        material,
        baseOpacity: material.opacity ?? 1,
      })
    })
  })

  return materials
}

function updateMaterialOpacity(materials, opacity) {
  const depthWrite = opacity > 0.76

  materials.forEach(({ material, baseOpacity }) => {
    material.opacity = baseOpacity * opacity
    if (material.depthWrite !== depthWrite) {
      material.depthWrite = depthWrite
      material.needsUpdate = true
    }
  })
}

function smoothUnit(value) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1)
  return clamped * clamped * (3 - 2 * clamped)
}

function createSceneProgress(scrollProgress, index, count) {
  return {
    get: () => {
      const global = THREE.MathUtils.clamp(readMotionValue(scrollProgress), 0, 1)
      return smoothUnit(global * count - index)
    },
  }
}

function createSceneVisibility(scrollProgress, index, count) {
  return {
    get: () => {
      const scaled = THREE.MathUtils.clamp(readMotionValue(scrollProgress), 0, 1) * count
      const overlap = 0.18

      const enter = index === 0
        ? 1
        : THREE.MathUtils.smoothstep(scaled, index - overlap, index + overlap)

      const leave = index === count - 1
        ? 1
        : 1 - THREE.MathUtils.smoothstep(scaled, index + 1 - overlap, index + 1 + overlap)

      return THREE.MathUtils.clamp(enter * leave, 0, 1)
    },
  }
}

function createAnnularSectorGeometry({
  innerRadius,
  outerRadius,
  start,
  arc,
  depth = 0.22,
  bevelSize = 0.035,
  bevelThickness = 0.035,
  curveSegments = 96,
}) {
  const end = start + arc
  const shape = new THREE.Shape()

  if (arc >= TAU - 0.0001) {
    shape.absarc(0, 0, outerRadius, 0, TAU, false)

    const hole = new THREE.Path()
    hole.absarc(0, 0, innerRadius, 0, TAU, true)
    shape.holes.push(hole)
  } else {
    shape.moveTo(
      Math.cos(start) * outerRadius,
      Math.sin(start) * outerRadius,
    )
    shape.absarc(0, 0, outerRadius, start, end, false)
    shape.lineTo(
      Math.cos(end) * innerRadius,
      Math.sin(end) * innerRadius,
    )
    shape.absarc(0, 0, innerRadius, end, start, true)
    shape.closePath()
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    curveSegments,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize,
    bevelThickness,
  })

  geometry.translate(0, 0, -depth / 2)
  geometry.computeVertexNormals()

  return geometry
}

function SceneGroup({ visibility, children, rotation = [0, 0, 0], scale = 1 }) {
  const ref = useRef(null)
  const materialsRef = useRef([])
  const currentVisibility = useRef(readMotionValue(visibility))
  const lastOpacity = useRef(-1)

  useLayoutEffect(() => {
    materialsRef.current = collectMaterials(ref.current)
    updateMaterialOpacity(materialsRef.current, currentVisibility.current)
  }, [])

  useFrame((_, delta) => {
    const root = ref.current
    if (!root) return

    const target = THREE.MathUtils.clamp(readMotionValue(visibility), 0, 1)
    currentVisibility.current = THREE.MathUtils.damp(
      currentVisibility.current,
      target,
      5.2,
      delta,
    )

    const value = currentVisibility.current
    root.visible = value > 0.002

    const targetScale = scale * THREE.MathUtils.lerp(0.94, 1, value)
    const targetZ = THREE.MathUtils.lerp(-0.42, 0, value)
    const targetX = rotation[0] + (1 - value) * 0.035
    const targetY = rotation[1] - (1 - value) * 0.055

    const nextScale = THREE.MathUtils.damp(root.scale.x, targetScale, 6, delta)
    root.scale.setScalar(nextScale)
    root.position.z = THREE.MathUtils.damp(root.position.z, targetZ, 6, delta)
    root.rotation.x = THREE.MathUtils.damp(root.rotation.x, targetX, 6, delta)
    root.rotation.y = THREE.MathUtils.damp(root.rotation.y, targetY, 6, delta)
    root.rotation.z = THREE.MathUtils.damp(root.rotation.z, rotation[2], 6, delta)

    if (Math.abs(lastOpacity.current - value) > 0.002) {
      updateMaterialOpacity(materialsRef.current, value)
      lastOpacity.current = value
    }
  })

  return <group ref={ref}>{children}</group>
}

function AnnularSector({
  innerRadius = 0.9,
  outerRadius = 1.72,
  start = 0,
  arc = Math.PI,
  depth = 0.22,
  bevelSize = 0.035,
  bevelThickness = 0.035,
  color = '#202428',
  metalness = 0.9,
  roughness = 0.18,
  emissive = '#000000',
  emissiveIntensity = 0,
  opacity = 1,
  wireframe = false,
  edgeColor = '#dce4e8',
  edgeOpacity = 0.2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const geometry = useMemo(
    () => createAnnularSectorGeometry({
      innerRadius,
      outerRadius,
      start,
      arc,
      depth,
      bevelSize,
      bevelThickness,
    }),
    [
      innerRadius,
      outerRadius,
      start,
      arc,
      depth,
      bevelSize,
      bevelThickness,
    ],
  )

  const edges = useMemo(
    () => new THREE.EdgesGeometry(geometry, 24),
    [geometry],
  )

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          clearcoat={wireframe ? 0 : 1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.85}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          transparent={opacity < 1}
          opacity={opacity}
          wireframe={wireframe}
          side={THREE.DoubleSide}
        />
      </mesh>

      {!wireframe && edgeOpacity > 0 && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial
            color={edgeColor}
            transparent
            opacity={edgeOpacity}
          />
        </lineSegments>
      )}
    </group>
  )
}

function ArcLine({
  radius,
  start,
  arc,
  color = '#d8dde3',
  opacity = 0.45,
  segments = 112,
  z = 0.18,
  progress = null,
  offset = 0,
}) {
  const lineRef = useRef(null)
  const lastDrawCount = useRef(-1)
  const geometry = useMemo(() => {
    const points = []

    for (let index = 0; index <= segments; index += 1) {
      const angle = start + (arc * index) / segments
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          z,
        ),
      )
    }

    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius, start, arc, segments, z])

  useFrame(() => {
    if (!lineRef.current || !progress) return

    const value = THREE.MathUtils.clamp(readMotionValue(progress), 0, 1)
    const reveal = THREE.MathUtils.clamp(
      0.18 + value * 0.98 - offset,
      0,
      1,
    )

    const drawCount = Math.max(2, Math.floor((segments + 1) * reveal))
    if (drawCount !== lastDrawCount.current) {
      geometry.setDrawRange(0, drawCount)
      lastDrawCount.current = drawCount
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

function CurveLine({
  points,
  color = '#d8dde3',
  opacity = 0.22,
  z = 0.2,
  progress = null,
  offset = 0,
}) {
  const lineRef = useRef(null)
  const lastDrawCount = useRef(-1)
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y]) => new THREE.Vector3(x, y, z)),
      false,
      'catmullrom',
      0.34,
    )

    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(88))
  }, [points, z])

  useFrame(() => {
    if (!lineRef.current || !progress) return

    const value = THREE.MathUtils.clamp(readMotionValue(progress), 0, 1)
    const reveal = THREE.MathUtils.clamp(
      0.14 + value * 1.02 - offset,
      0,
      1,
    )

    const drawCount = Math.max(2, Math.floor(89 * reveal))
    if (drawCount !== lastDrawCount.current) {
      geometry.setDrawRange(0, drawCount)
      lastDrawCount.current = drawCount
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

function StraightLine({
  from,
  to,
  color = '#d7dfe4',
  opacity = 0.22,
  z = 0.2,
}) {
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(from[0], from[1], z),
      new THREE.Vector3(to[0], to[1], z),
    ]),
    [from, to, z],
  )

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

function Anchor({
  angle,
  radius = 1.5,
  size = 0.045,
  color = '#e7edf0',
  z = 0.22,
  square = false,
}) {
  return (
    <mesh position={[
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      z,
    ]}>
      {square ? (
        <boxGeometry args={[size * 1.9, size * 1.9, size * 0.8]} />
      ) : (
        <sphereGeometry args={[size, 14, 14]} />
      )}
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function Crosshair({ size = 2.35, opacity = 0.14 }) {
  return (
    <group position={[0, 0, -0.14]}>
      <mesh>
        <boxGeometry args={[size * 2, 0.008, 0.008]} />
        <meshBasicMaterial color="#c9d1d7" transparent opacity={opacity} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.008, size * 2, 0.008]} />
        <meshBasicMaterial color="#c9d1d7" transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

function DesignRing({ localProgress }) {
  const root = useRef(null)
  const draftRoot = useRef(null)
  const polishedRoot = useRef(null)
  const leftStart = Math.PI / 2
  const rightStart = -Math.PI / 2
  const halfArc = Math.PI

  const sketchRadii = [0.96, 1.06, 1.17, 1.29, 1.4, 1.51, 1.62, 1.73]
  const radialAngles = [
    Math.PI / 2,
    Math.PI * 0.68,
    Math.PI * 0.83,
    Math.PI,
    Math.PI * 1.17,
    Math.PI * 1.33,
    Math.PI * 1.5,
  ]

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(readMotionValue(localProgress), 0, 1)

    if (root.current) {
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        -0.09 - state.pointer.y * 0.028,
        5,
        delta,
      )
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        state.pointer.x * 0.035,
        5,
        delta,
      )
    }

    if (draftRoot.current) {
      draftRoot.current.rotation.z = THREE.MathUtils.damp(
        draftRoot.current.rotation.z,
        Math.sin(state.clock.elapsedTime * 0.22) * 0.008,
        3.4,
        delta,
      )
      const draftScale = THREE.MathUtils.damp(
        draftRoot.current.scale.x,
        0.97 + progress * 0.03,
        4.5,
        delta,
      )
      draftRoot.current.scale.setScalar(draftScale)
    }

    if (polishedRoot.current) {
      polishedRoot.current.position.z = THREE.MathUtils.damp(
        polishedRoot.current.position.z,
        0.035 + progress * 0.055,
        4.5,
        delta,
      )
      const polishedScale = THREE.MathUtils.damp(
        polishedRoot.current.scale.x,
        0.975 + progress * 0.025,
        4.5,
        delta,
      )
      polishedRoot.current.scale.setScalar(polishedScale)
    }
  })

  return (
    <group ref={root}>
      <Crosshair />

      <group ref={draftRoot}>
        <AnnularSector
          innerRadius={0.9}
          outerRadius={1.72}
          start={leftStart}
          arc={halfArc}
          depth={0.08}
          bevelSize={0.008}
          bevelThickness={0.008}
          color="#aeb8bf"
          metalness={0.05}
          roughness={0.72}
          opacity={0.34}
          wireframe
          edgeOpacity={0}
          position={[0, 0, -0.03]}
        />

        {sketchRadii.map((radius, index) => (
          <ArcLine
            key={radius}
            radius={radius}
            start={leftStart}
            arc={halfArc}
            color={index % 2 === 0 ? '#e4eaed' : '#8e989f'}
            opacity={0.15 + index * 0.035}
            z={0.16 + index * 0.004}
            progress={localProgress}
            offset={index * 0.045}
          />
        ))}

        {radialAngles.map((angle, index) => (
          <StraightLine
            key={angle}
            from={[
              Math.cos(angle) * 0.88,
              Math.sin(angle) * 0.88,
            ]}
            to={[
              Math.cos(angle) * 1.78,
              Math.sin(angle) * 1.78,
            ]}
            color={index % 2 ? '#9ba6ad' : '#dfe5e8'}
            opacity={0.12 + index * 0.018}
          />
        ))}

        <CurveLine
          points={[
            [-0.05, 1.82],
            [-0.55, 1.53],
            [-1.12, 1.13],
            [-1.66, 0.52],
            [-1.76, -0.18],
          ]}
          progress={localProgress}
        />
        <CurveLine
          points={[
            [-0.16, 1.55],
            [-0.75, 1.31],
            [-1.32, 0.71],
            [-1.49, -0.02],
            [-1.18, -0.99],
          ]}
          opacity={0.32}
          progress={localProgress}
          offset={0.12}
        />
        <CurveLine
          points={[
            [-0.08, -1.7],
            [-0.68, -1.5],
            [-1.27, -1.06],
            [-1.69, -0.29],
            [-1.55, 0.49],
          ]}
          opacity={0.29}
          progress={localProgress}
          offset={0.22}
        />
        <CurveLine
          points={[
            [-0.08, 1.18],
            [-0.61, 0.87],
            [-1.17, 0.37],
            [-1.43, -0.36],
            [-1.06, -1.17],
          ]}
          opacity={0.24}
          progress={localProgress}
          offset={0.3}
        />

        {radialAngles.map((angle, index) => (
          <Anchor
            key={`outer-${angle}`}
            angle={angle}
            radius={1.72}
            size={index % 2 ? 0.034 : 0.042}
            square={index % 2 === 0}
          />
        ))}

        {[Math.PI * 0.68, Math.PI * 0.87, Math.PI * 1.12, Math.PI * 1.33].map((angle) => (
          <Anchor
            key={`inner-${angle}`}
            angle={angle}
            radius={1.02}
            size={0.032}
            color="#b8ff42"
          />
        ))}
      </group>

      <group ref={polishedRoot}>
        <AnnularSector
          innerRadius={0.9}
          outerRadius={1.72}
          start={rightStart}
          arc={halfArc}
          depth={0.27}
          bevelSize={0.045}
          bevelThickness={0.045}
          color="#171b21"
          metalness={0.92}
          roughness={0.14}
          edgeColor="#dce5e8"
          edgeOpacity={0.48}
        />

        <AnnularSector
          innerRadius={0.98}
          outerRadius={1.63}
          start={rightStart + 0.018}
          arc={halfArc - 0.036}
          depth={0.045}
          bevelSize={0.012}
          bevelThickness={0.012}
          color="#10151a"
          metalness={0.72}
          roughness={0.24}
          opacity={0.76}
          edgeOpacity={0.1}
          position={[0, 0, 0.17]}
        />

        <AnnularSector
          innerRadius={0.9}
          outerRadius={0.975}
          start={rightStart + 0.01}
          arc={halfArc - 0.02}
          depth={0.08}
          bevelSize={0.014}
          bevelThickness={0.014}
          color="#b9ff51"
          metalness={0.22}
          roughness={0.12}
          emissive="#8fe72d"
          emissiveIntensity={2.2}
          edgeColor="#e9ffc5"
          edgeOpacity={0.5}
          position={[0, 0, 0.17]}
        />

        <AnnularSector
          innerRadius={1.675}
          outerRadius={1.72}
          start={rightStart + 0.014}
          arc={halfArc - 0.028}
          depth={0.055}
          bevelSize={0.008}
          bevelThickness={0.008}
          color="#f0f4f5"
          metalness={0.94}
          roughness={0.08}
          emissive="#b8ff42"
          emissiveIntensity={0.12}
          edgeOpacity={0}
          position={[0, 0, 0.19]}
        />

        {[
          -Math.PI / 2,
          -Math.PI / 4,
          0,
          Math.PI / 4,
          Math.PI / 2,
        ].map((angle, index) => (
          <Anchor
            key={`polished-${angle}`}
            angle={angle}
            radius={1.74}
            color="#caff57"
            size={index % 2 ? 0.038 : 0.046}
            square={index % 2 === 0}
            z={0.28}
          />
        ))}

        <pointLight
          position={[1.2, -0.8, 1.25]}
          color="#a9ff4f"
          intensity={1.4}
          distance={3.2}
        />
      </group>

      <mesh position={[0, 0, -0.16]}>
        <ringGeometry args={[0.82, 0.9, 128]} />
        <meshBasicMaterial
          color="#0b0f12"
          transparent
          opacity={0.74}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, 0.24]}>
        <boxGeometry args={[0.012, 3.52, 0.014]} />
        <meshBasicMaterial color="#dce4e7" transparent opacity={0.48} />
      </mesh>

      {[-1.72, -0.9, 0, 0.9, 1.72].map((y, index) => (
        <mesh key={y} position={[0, y, 0.255]}>
          <boxGeometry args={[index === 2 ? 0.035 : 0.055, index === 2 ? 0.035 : 0.055, 0.022]} />
          <meshBasicMaterial color={index % 2 ? '#c9ff5c' : '#edf2f3'} />
        </mesh>
      ))}
    </group>
  )
}

const DEVELOPMENT_SEGMENTS = [
  { start: -1.47, arc: 0.55, push: 0.36, spin: -0.16 },
  { start: -0.76, arc: 0.51, push: 0.31, spin: 0.12 },
  { start: -0.08, arc: 0.49, push: 0.38, spin: -0.13 },
  { start: 0.58, arc: 0.61, push: 0.29, spin: 0.15 },
  { start: 1.39, arc: 0.53, push: 0.36, spin: -0.12 },
  { start: 2.09, arc: 0.62, push: 0.32, spin: 0.14 },
  { start: 2.9, arc: 0.5, push: 0.38, spin: -0.14 },
  { start: 3.57, arc: 0.6, push: 0.3, spin: 0.13 },
  { start: 4.35, arc: 0.52, push: 0.35, spin: -0.12 },
]

function DevelopmentSegment({ segment, index, localProgress }) {
  const ref = useRef(null)
  const middle = segment.start + segment.arc / 2
  const direction = useMemo(
    () => new THREE.Vector3(Math.cos(middle), Math.sin(middle), 0),
    [middle],
  )

  useFrame((state, delta) => {
    const root = ref.current
    if (!root) return

    const progress = THREE.MathUtils.clamp(readMotionValue(localProgress), 0, 1)
    const assemble = THREE.MathUtils.smootherstep(progress, 0.02, 0.94)
    const idle = Math.sin(state.clock.elapsedTime * 0.72 + index * 0.73) * 0.009
    const distance = (1 - assemble) * segment.push

    root.position.x = THREE.MathUtils.damp(
      root.position.x,
      direction.x * distance,
      4.8,
      delta,
    )
    root.position.y = THREE.MathUtils.damp(
      root.position.y,
      direction.y * distance,
      4.8,
      delta,
    )
    root.position.z = THREE.MathUtils.damp(
      root.position.z,
      (1 - assemble) * (index % 2 ? 0.22 : -0.12),
      4.8,
      delta,
    )
    root.rotation.z = THREE.MathUtils.damp(
      root.rotation.z,
      (1 - assemble) * segment.spin + idle,
      4.8,
      delta,
    )
    root.rotation.x = THREE.MathUtils.damp(
      root.rotation.x,
      (1 - assemble) * (index % 2 ? 0.12 : -0.08),
      4.8,
      delta,
    )
  })

  return (
    <group ref={ref}>
      <AnnularSector
        innerRadius={0.93}
        outerRadius={1.72}
        start={segment.start}
        arc={segment.arc}
        depth={0.28}
        bevelSize={0.045}
        bevelThickness={0.045}
        color={index % 2 ? '#292e35' : '#3a4049'}
        metalness={0.93}
        roughness={0.15}
        edgeColor="#dce4e8"
        edgeOpacity={0.4}
      />

      <AnnularSector
        innerRadius={0.93}
        outerRadius={1.005}
        start={segment.start + 0.018}
        arc={Math.max(0.12, segment.arc - 0.036)}
        depth={0.065}
        bevelSize={0.012}
        bevelThickness={0.012}
        color="#b9ff51"
        metalness={0.24}
        roughness={0.12}
        emissive="#8be62d"
        emissiveIntensity={1.8}
        edgeOpacity={0.24}
        position={[0, 0, 0.18]}
      />
    </group>
  )
}

function ConnectorBlock({ angle, radius = 1.48, width = 0.35, height = 0.23 }) {
  return (
    <group
      position={[
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0.1,
      ]}
      rotation={[0, 0, angle]}
    >
      <mesh>
        <boxGeometry args={[width, height, 0.24]} />
        <meshPhysicalMaterial
          color="#242a31"
          metalness={0.9}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>
    </group>
  )
}

function DevelopmentRing({ localProgress }) {
  const root = useRef(null)

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(readMotionValue(localProgress), 0, 1)

    if (!root.current) return

    root.current.rotation.z = THREE.MathUtils.damp(
      root.current.rotation.z,
      -0.1 + progress * 0.08 + Math.sin(state.clock.elapsedTime * 0.24) * 0.018,
      5,
      delta,
    )
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      -0.1 - state.pointer.y * 0.035,
      5,
      delta,
    )
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      state.pointer.x * 0.045,
      5,
      delta,
    )
  })

  return (
    <group ref={root}>
      <Crosshair size={2.2} opacity={0.13} />

      {DEVELOPMENT_SEGMENTS.map((segment, index) => (
        <DevelopmentSegment
          key={`${segment.start}-${segment.arc}`}
          segment={segment}
          index={index}
          localProgress={localProgress}
        />
      ))}

      <ConnectorBlock angle={2.7} width={0.4} height={0.25} />
      <ConnectorBlock angle={5.65} width={0.34} height={0.22} />

      <ArcLine radius={1.91} start={0} arc={TAU} color="#aeb7be" opacity={0.18} />
      <ArcLine radius={1.82} start={0} arc={TAU} color="#aeb7be" opacity={0.1} />
      <ArcLine radius={0.82} start={0} arc={TAU} color="#aeb7be" opacity={0.14} />

      {Array.from({ length: 8 }, (_, index) => (
        <Anchor
          key={index}
          angle={(TAU / 8) * index}
          radius={1.92}
          color={index % 2 ? '#e7edf0' : '#aaff4f'}
          size={0.036}
          square={index % 2 === 0}
        />
      ))}

      <pointLight
        position={[1.1, -0.9, 1.1]}
        color="#a9ff4f"
        intensity={1.15}
        distance={3}
      />
    </group>
  )
}

function BrandingRing({ localProgress }) {
  const root = useRef(null)
  const colors = ['#c7ff42', '#f2bd57', '#8b67ff', '#f45138', '#58c8ff', '#f4f1e8']
  const step = TAU / colors.length

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(readMotionValue(localProgress), 0, 1)

    if (!root.current) return

    root.current.rotation.z = THREE.MathUtils.damp(
      root.current.rotation.z,
      progress * 0.16 + Math.sin(state.clock.elapsedTime * 0.22) * 0.02,
      4,
      delta,
    )
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      -0.09 - state.pointer.y * 0.04,
      5,
      delta,
    )
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      state.pointer.x * 0.05,
      5,
      delta,
    )
  })

  return (
    <group ref={root}>
      <Crosshair size={2.1} opacity={0.1} />

      {colors.map((color, index) => (
        <AnnularSector
          key={color}
          innerRadius={0.92}
          outerRadius={1.72}
          start={index * step + 0.035}
          arc={step - 0.07}
          depth={0.25}
          bevelSize={0.04}
          bevelThickness={0.04}
          color={color}
          metalness={0.76}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.04}
          edgeColor="#f0f2ef"
          edgeOpacity={0.24}
        />
      ))}

      <AnnularSector
        innerRadius={0.83}
        outerRadius={0.9}
        start={0}
        arc={TAU}
        depth={0.05}
        bevelSize={0.01}
        bevelThickness={0.01}
        color="#f4f1e8"
        metalness={0.82}
        roughness={0.1}
        edgeOpacity={0.14}
        position={[0, 0, 0.16]}
      />

      <ArcLine radius={1.94} start={0} arc={TAU} color="#d8dde3" opacity={0.12} />

      {colors.map((color, index) => (
        <Anchor
          key={`brand-${color}`}
          angle={step * index}
          radius={1.95}
          color={color}
          size={0.044}
        />
      ))}
    </group>
  )
}

function MarketingRing({ localProgress }) {
  const root = useRef(null)
  const sweepRef = useRef(null)

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(readMotionValue(localProgress), 0, 1)

    if (root.current) {
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        -0.09 - state.pointer.y * 0.035,
        5,
        delta,
      )
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        state.pointer.x * 0.04,
        5,
        delta,
      )
    }

    if (sweepRef.current) {
      sweepRef.current.rotation.z = state.clock.elapsedTime * 0.72 + progress * 0.8
    }
  })

  return (
    <group ref={root}>
      <Crosshair size={2.25} opacity={0.12} />

      <AnnularSector
        innerRadius={1.08}
        outerRadius={1.5}
        start={0}
        arc={TAU}
        depth={0.2}
        bevelSize={0.03}
        bevelThickness={0.03}
        color="#1a2227"
        metalness={0.86}
        roughness={0.2}
        emissive="#74cf2e"
        emissiveIntensity={0.18}
        edgeColor="#b8c1c7"
        edgeOpacity={0.18}
      />

      {[0.84, 1.76].map((radius) => (
        <ArcLine
          key={radius}
          radius={radius}
          start={0}
          arc={TAU}
          color="#8f9aa1"
          opacity={0.24}
        />
      ))}

      <group ref={sweepRef}>
        <mesh position={[0.92, 0, 0.2]}>
          <boxGeometry args={[1.84, 0.032, 0.025]} />
          <meshBasicMaterial color="#b9ff4f" transparent opacity={0.86} />
        </mesh>
        <pointLight
          position={[1.62, 0, 0.4]}
          color="#b9ff4f"
          intensity={2}
          distance={2.4}
        />
      </group>

      {Array.from({ length: 10 }, (_, index) => {
        const angle = (TAU / 10) * index
        const radius = index % 3 === 0 ? 1.76 : 1.5

        return (
          <Anchor
            key={index}
            angle={angle}
            radius={radius}
            color={index % 2 ? '#d9e1e5' : '#b9ff4f'}
            size={0.04}
          />
        )
      })}
    </group>
  )
}

export default function ServiceRing3D({ scrollProgress }) {
  const root = useRef(null)
  const sceneCount = 4

  const sceneProgress = useMemo(
    () => Array.from(
      { length: sceneCount },
      (_, index) => createSceneProgress(scrollProgress, index, sceneCount),
    ),
    [scrollProgress],
  )

  const sceneVisibility = useMemo(
    () => Array.from(
      { length: sceneCount },
      (_, index) => createSceneVisibility(scrollProgress, index, sceneCount),
    ),
    [scrollProgress],
  )

  useFrame((state, delta) => {
    if (!root.current) return

    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      -0.025 - state.pointer.y * 0.009,
      3.2,
      delta,
    )
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      state.pointer.x * 0.009,
      3.2,
      delta,
    )
  })

  return (
    <group ref={root} scale={1.16}>
      <SceneGroup visibility={sceneVisibility[0]} scale={1.04}>
        <DesignRing localProgress={sceneProgress[0]} />
      </SceneGroup>

      <SceneGroup visibility={sceneVisibility[1]} scale={1.04}>
        <DevelopmentRing localProgress={sceneProgress[1]} />
      </SceneGroup>

      <SceneGroup visibility={sceneVisibility[2]} scale={1.04}>
        <BrandingRing localProgress={sceneProgress[2]} />
      </SceneGroup>

      <SceneGroup visibility={sceneVisibility[3]} scale={1.04}>
        <MarketingRing localProgress={sceneProgress[3]} />
      </SceneGroup>
    </group>
  )
}
