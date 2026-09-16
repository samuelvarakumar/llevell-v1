import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

const ACCENT = new THREE.Color('#c9ff55')
const DARK = new THREE.Color('#0b0f0b')
const EDGE = new THREE.Color('#e9f5cf')

function roundedRectShape(width, height, radius) {
  const x = -width / 2
  const y = -height / 2
  const shape = new THREE.Shape()

  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)

  return shape
}

function createDeviceGeometry() {
  const shape = roundedRectShape(2.86, 4.24, 0.32)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.065,
    bevelThickness: 0.065,
    curveSegments: 16,
  })
  geometry.center()
  return geometry
}

function createOutlineGeometry() {
  const shape = roundedRectShape(2.78, 4.16, 0.29)
  const points = shape.getPoints(64).map((point) => new THREE.Vector3(point.x, point.y, 0))
  return new THREE.BufferGeometry().setFromPoints(points)
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + r, y)
  context.arcTo(x + width, y, x + width, y + height, r)
  context.arcTo(x + width, y + height, x, y + height, r)
  context.arcTo(x, y + height, x, y, r)
  context.arcTo(x, y, x + width, y, r)
  context.closePath()
}

function drawLineChart(context, x, y, width, height, values) {
  context.strokeStyle = 'rgba(201,255,85,.92)'
  context.lineWidth = 5
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.beginPath()
  values.forEach((value, index) => {
    const px = x + (index / (values.length - 1)) * width
    const py = y + height - value * height
    if (index === 0) context.moveTo(px, py)
    else context.lineTo(px, py)
  })
  context.stroke()
}

function drawDashboard(context) {
  const cards = [
    [58, 212, 238, 128],
    [318, 212, 238, 128],
    [58, 362, 498, 244],
  ]
  cards.forEach(([x, y, width, height], index) => {
    roundRect(context, x, y, width, height, 22)
    context.fillStyle = index === 2 ? 'rgba(255,255,255,.055)' : 'rgba(255,255,255,.075)'
    context.fill()
    context.strokeStyle = 'rgba(255,255,255,.08)'
    context.stroke()
  })
  context.fillStyle = 'rgba(255,255,255,.44)'
  context.font = '600 20px Manrope, Arial'
  context.fillText('ACTIVE USERS', 82, 252)
  context.fillText('CONVERSION', 342, 252)
  context.fillStyle = '#ffffff'
  context.font = '600 46px Manrope, Arial'
  context.fillText('8.4K', 82, 311)
  context.fillText('24%', 342, 311)
  drawLineChart(context, 90, 412, 430, 142, [.18, .28, .23, .48, .42, .68, .62, .84])
}

function drawMobile(context) {
  roundRect(context, 76, 205, 480, 170, 30)
  context.fillStyle = 'rgba(201,255,85,.095)'
  context.fill()
  context.fillStyle = 'rgba(255,255,255,.46)'
  context.font = '600 20px Manrope, Arial'
  context.fillText('TODAY', 108, 250)
  context.fillStyle = '#ffffff'
  context.font = '600 70px Manrope, Arial'
  context.fillText('78', 108, 330)
  context.fillStyle = '#c9ff55'
  context.font = '600 20px Manrope, Arial'
  context.fillText('OPTIMAL', 232, 321)

  ;[0, 1, 2].forEach((index) => {
    const y = 408 + index * 86
    roundRect(context, 76, y, 480, 62, 20)
    context.fillStyle = 'rgba(255,255,255,.055)'
    context.fill()
    context.fillStyle = index === 1 ? '#c9ff55' : 'rgba(255,255,255,.34)'
    context.beginPath()
    context.arc(112, y + 31, 9, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = 'rgba(255,255,255,.62)'
    context.font = '500 19px Manrope, Arial'
    context.fillText(['Focus', 'Progress', 'Recovery'][index], 142, y + 38)
  })
}

function drawPlatform(context) {
  const nodes = [
    [135, 286, 36], [325, 226, 45], [488, 310, 33],
    [190, 476, 42], [405, 500, 48], [312, 390, 62],
  ]
  context.strokeStyle = 'rgba(201,255,85,.35)'
  context.lineWidth = 3
  ;[[0, 1], [1, 2], [0, 3], [1, 5], [2, 5], [3, 5], [4, 5]].forEach(([a, b]) => {
    context.beginPath()
    context.moveTo(nodes[a][0], nodes[a][1])
    context.lineTo(nodes[b][0], nodes[b][1])
    context.stroke()
  })
  nodes.forEach(([x, y, radius], index) => {
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fillStyle = index === 5 ? '#c9ff55' : 'rgba(255,255,255,.085)'
    context.fill()
    context.strokeStyle = index === 5 ? '#e9ffb2' : 'rgba(255,255,255,.16)'
    context.stroke()
  })
  context.fillStyle = 'rgba(255,255,255,.5)'
  context.font = '600 19px Manrope, Arial'
  context.fillText('CONNECTED WORKSPACE', 76, 620)
}

function drawAI(context) {
  ;[0, 1, 2].forEach((index) => {
    const right = index % 2 === 1
    const x = right ? 190 : 68
    const width = right ? 368 : 420
    const y = 220 + index * 132
    roundRect(context, x, y, width, 94, 25)
    context.fillStyle = right ? 'rgba(201,255,85,.12)' : 'rgba(255,255,255,.06)'
    context.fill()
    context.fillStyle = right ? 'rgba(225,255,166,.76)' : 'rgba(255,255,255,.48)'
    context.font = '500 18px Manrope, Arial'
    context.fillText(
      ['How can the product help?', 'Here is the clearest next step.', 'Turn the result into an action.'][index],
      x + 26,
      y + 56,
    )
  })
  context.beginPath()
  for (let index = 0; index < 12; index += 1) {
    const angle = -Math.PI / 2 + index * (Math.PI / 6)
    const radius = index % 2 === 0 ? 45 : 18
    const x = 314 + Math.cos(angle) * radius
    const y = 640 + Math.sin(angle) * radius
    if (index === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  context.closePath()
  context.fillStyle = '#c9ff55'
  context.fill()
}

function createPreviewTexture(app) {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 960
  const context = canvas.getContext('2d')

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#1b2119')
  gradient.addColorStop(0.48, '#0d120d')
  gradient.addColorStop(1, '#070a07')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  const glow = context.createRadialGradient(520, 160, 0, 520, 160, 320)
  glow.addColorStop(0, 'rgba(201,255,85,.15)')
  glow.addColorStop(1, 'rgba(201,255,85,0)')
  context.fillStyle = glow
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = 'rgba(255,255,255,.38)'
  context.font = '600 19px Manrope, Arial'
  context.fillText('LLEVELL / PRODUCT', 58, 78)

  context.fillStyle = '#c9ff55'
  context.font = '700 18px Manrope, Arial'
  context.fillText(app.number, 532, 78)

  context.fillStyle = '#ffffff'
  context.font = '600 43px Manrope, Arial'
  const title = app.title.length > 18 ? `${app.title.slice(0, 17)}…` : app.title
  context.fillText(title, 58, 151)

  context.fillStyle = 'rgba(255,255,255,.36)'
  context.font = '600 16px Manrope, Arial'
  context.fillText(app.eyebrow, 58, 184)

  context.strokeStyle = 'rgba(255,255,255,.09)'
  context.beginPath()
  context.moveTo(58, 194)
  context.lineTo(582, 194)
  context.stroke()

  if (app.variant === 'mobile') drawMobile(context)
  else if (app.variant === 'platform') drawPlatform(context)
  else if (app.variant === 'ai') drawAI(context)
  else drawDashboard(context)

  context.fillStyle = 'rgba(255,255,255,.22)'
  context.font = '500 16px Manrope, Arial'
  context.fillText('SELECT TO EXPLORE', 58, 894)
  context.fillStyle = '#c9ff55'
  context.beginPath()
  context.arc(562, 888, 7, 0, Math.PI * 2)
  context.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 1
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}


function modulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor
}

function shortestIndexDelta(nextIndex, currentUnwrapped, total) {
  const currentWrapped = modulo(currentUnwrapped, total)
  let delta = nextIndex - currentWrapped
  if (delta > total / 2) delta -= total
  if (delta < -total / 2) delta += total
  return delta
}

function wrapContinuousDelta(value, total) {
  let wrapped = value
  while (wrapped > total / 2) wrapped -= total
  while (wrapped < -total / 2) wrapped += total
  return wrapped
}

function smootherStep(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1)
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function interpolateSlot(delta, focusX, mobile) {
  const direction = delta === 0 ? 1 : Math.sign(delta)
  const distance = Math.min(Math.abs(delta), 2)
  const firstLeg = smootherStep(Math.min(distance, 1))
  const secondLeg = smootherStep(Math.max(0, distance - 1))

  const active = mobile
    ? {
        position: [0, 0.25, 1.4],
        rotation: [0, 0, 0],
        scale: 1.03,
        opacity: 1,
      }
    : {
        position: [focusX, 0.1, 1.65],
        rotation: [0, -0.04, 0],
        scale: 1.08,
        opacity: 1,
      }

  const side = mobile
    ? {
        position: [direction * 2.15, direction < 0 ? 0.35 : 0.1, -1.4],
        rotation: [0, -direction * 0.64, direction * 0.04],
        scale: 0.68,
        opacity: 0.34,
      }
    : {
        position: [focusX + direction * 3.65, direction < 0 ? 0.55 : -0.2, -1.38],
        rotation: [direction * 0.03, -direction * 0.72, direction * 0.045],
        scale: 0.76,
        opacity: 0.48,
      }

  const far = mobile
    ? {
        position: [direction * 0.4, 1.2, -4.8],
        rotation: [0, -direction * Math.PI, 0],
        scale: 0.48,
        opacity: 0,
      }
    : {
        position: [focusX + direction * 5.7, 1.45, -4.6],
        rotation: [0, -direction * 1.15, 0],
        scale: 0.52,
        opacity: 0.02,
      }

  const from = distance <= 1 ? active : side
  const to = distance <= 1 ? side : far
  const t = distance <= 1 ? firstLeg : secondLeg

  return {
    position: from.position.map((value, index) => THREE.MathUtils.lerp(value, to.position[index], t)),
    rotation: from.rotation.map((value, index) => THREE.MathUtils.lerp(value, to.rotation[index], t)),
    scale: THREE.MathUtils.lerp(from.scale, to.scale, t),
    opacity: THREE.MathUtils.lerp(from.opacity, to.opacity, t),
    activeInfluence: 1 - smootherStep(Math.min(distance / 0.9, 1)),
  }
}

function DeviceCard({
  app,
  index,
  total,
  focusX,
  mobile,
  onSelect,
  carouselRef,
  pointerRef,
  entranceRef,
  geometry,
  outlineGeometry,
  texture,
}) {
  const groupRef = useRef(null)
  const bodyMaterialRef = useRef(null)
  const screenMaterialRef = useRef(null)
  const outlineMaterialRef = useRef(null)
  const glowMaterialRef = useRef(null)
  const hoveredTargetRef = useRef(0)
  const hoveredMotionRef = useRef(0)

  useEffect(() => () => {
    document.body.style.cursor = ''
  }, [])

  useFrame((state, frameDelta) => {
    const group = groupRef.current
    if (!group) return

    hoveredMotionRef.current = THREE.MathUtils.damp(
      hoveredMotionRef.current,
      hoveredTargetRef.current,
      8.5,
      frameDelta,
    )

    const continuousDelta = wrapContinuousDelta(index - carouselRef.current, total)
    const slot = interpolateSlot(continuousDelta, focusX, mobile)
    const hover = hoveredMotionRef.current
    const activeInfluence = slot.activeInfluence
    const elapsed = state.clock.elapsedTime
    const floatAmount = THREE.MathUtils.lerp(0.018, 0.045, activeInfluence)
    const floatY = Math.sin(elapsed * 0.58 + index * 1.43) * floatAmount
    const hoverDepth = hover * (0.12 + (1 - activeInfluence) * 0.08)

    group.position.set(
      slot.position[0],
      slot.position[1] + floatY,
      slot.position[2] + hoverDepth,
    )

    group.rotation.set(
      slot.rotation[0] - pointerRef.current.y * 0.035 * activeInfluence,
      slot.rotation[1] + pointerRef.current.x * 0.048 * activeInfluence,
      slot.rotation[2],
    )

    const scale = Math.max(
      0.001,
      slot.scale * entranceRef.current * (1 + hover * 0.025),
    )
    group.scale.setScalar(scale)

    const opacity = slot.opacity * entranceRef.current
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.opacity = opacity * 0.96
      bodyMaterialRef.current.emissiveIntensity = 0.025 + activeInfluence * 0.13 + hover * 0.06
    }
    if (screenMaterialRef.current) screenMaterialRef.current.opacity = opacity
    if (outlineMaterialRef.current) {
      outlineMaterialRef.current.opacity = opacity * (0.16 + activeInfluence * 0.62 + hover * 0.18)
    }
    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = entranceRef.current * (activeInfluence * 0.12 + hover * 0.045)
    }

    group.visible = opacity > 0.008
  })

  return (
    <group
      ref={groupRef}
      scale={0.001}
      onPointerOver={(event) => {
        event.stopPropagation()
        hoveredTargetRef.current = 1
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        hoveredTargetRef.current = 0
        document.body.style.cursor = ''
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(index)
      }}
    >
      <mesh geometry={geometry} renderOrder={2}>
        <meshStandardMaterial
          ref={bodyMaterialRef}
          color={DARK}
          emissive={ACCENT}
          emissiveIntensity={0.025}
          metalness={0.82}
          roughness={0.24}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, 0.145]} renderOrder={4}>
        <planeGeometry args={[2.63, 3.98]} />
        <meshBasicMaterial
          ref={screenMaterialRef}
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <lineLoop geometry={outlineGeometry} position={[0, 0, 0.176]} renderOrder={5}>
        <lineBasicMaterial
          ref={outlineMaterialRef}
          color={EDGE}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </lineLoop>

      <mesh position={[0, -2.015, 0.17]} renderOrder={6}>
        <boxGeometry args={[1.28, 0.025, 0.025]} />
        <meshBasicMaterial
          color="#c9ff55"
          transparent
          opacity={0.78}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.18]} renderOrder={1}>
        <planeGeometry args={[3.4, 4.82]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          color="#c9ff55"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Portal({ focusX, mobile, entranceRef }) {
  const groupRef = useRef(null)
  const ringOneRef = useRef(null)
  const ringTwoRef = useRef(null)
  const ringThreeRef = useRef(null)
  const glowMaterialRef = useRef(null)
  const nodes = useMemo(() => Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2
    return [Math.cos(angle) * 3.0, Math.sin(angle) * 3.0, -0.05]
  }), [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const entrance = entranceRef.current
    groupRef.current.scale.setScalar(Math.max(0.001, entrance))
    if (ringOneRef.current) ringOneRef.current.rotation.z += delta * 0.042
    if (ringTwoRef.current) ringTwoRef.current.rotation.z -= delta * 0.029
    if (ringThreeRef.current) ringThreeRef.current.rotation.z += delta * 0.017
    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = entrance * (0.043 + Math.sin(state.clock.elapsedTime * 0.82) * 0.008)
    }
  })

  return (
    <group ref={groupRef} position={[focusX, 0.15, -1.15]} scale={0.001}>
      <mesh ref={ringOneRef} rotation={[0.08, -0.04, 0]}>
        <torusGeometry args={[3.12, 0.018, 6, 96]} />
        <meshBasicMaterial color="#c9ff55" transparent opacity={0.38} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={ringTwoRef} rotation={[-0.11, 0.08, 0.52]}>
        <torusGeometry args={[2.72, 0.012, 6, 88]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={ringThreeRef} rotation={[0.04, 0.12, -0.32]}>
        <torusGeometry args={[3.62, 0.009, 6, 96]} />
        <meshBasicMaterial color="#73835a" transparent opacity={0.1} toneMapped={false} depthWrite={false} />
      </mesh>

      {nodes.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[index % 2 === 0 ? 0.04 : 0.025, 8, 8]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? '#c9ff55' : '#ffffff'}
            transparent
            opacity={index % 2 === 0 ? 0.72 : 0.28}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh position={[0, 0, -0.25]} scale={[mobile ? 1 : 1.08, 1, 1]}>
        <circleGeometry args={[2.55, 64]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          color="#c9ff55"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Dust({ mobile, entranceRef }) {
  const pointsRef = useRef(null)
  const materialRef = useRef(null)
  const geometry = useMemo(() => {
    const count = mobile ? 44 : 86
    const positions = new Float32Array(count * 3)
    let seed = 42
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (random() - 0.5) * (mobile ? 10 : 18)
      positions[index * 3 + 1] = (random() - 0.5) * (mobile ? 13 : 10)
      positions[index * 3 + 2] = -4 + random() * 5
    }
    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return buffer
  }, [mobile])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.004
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.06
    if (materialRef.current) materialRef.current.opacity = entranceRef.current * 0.22
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        color="#c9ff55"
        size={mobile ? 0.017 : 0.022}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  )
}

function Scene({ apps, activeIndex, onSelect, open }) {
  const rootRef = useRef(null)
  const { camera, size, gl } = useThree()
  const mobile = size.width < 760
  const focusX = mobile ? 0 : 2.0
  const carouselRef = useRef(activeIndex)
  const targetIndexRef = useRef(activeIndex)
  const pointerRef = useRef({ x: 0, y: 0 })
  const entranceRef = useRef(0)

  const geometry = useMemo(() => createDeviceGeometry(), [])
  const outlineGeometry = useMemo(() => createOutlineGeometry(), [])
  const textures = useMemo(() => apps.map((app) => createPreviewTexture(app)), [apps])

  useEffect(() => {
    const maxAnisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
    textures.forEach((texture) => {
      texture.anisotropy = maxAnisotropy
      texture.needsUpdate = true
    })
  }, [gl, textures])

  useEffect(() => () => {
    geometry.dispose()
    outlineGeometry.dispose()
    textures.forEach((texture) => texture.dispose())
  }, [geometry, outlineGeometry, textures])

  useEffect(() => {
    const delta = shortestIndexDelta(activeIndex, targetIndexRef.current, apps.length)
    targetIndexRef.current += delta
  }, [activeIndex, apps.length])

  useEffect(() => {
    entranceRef.current = 0
  }, [open])

  useEffect(() => {
    camera.position.set(0, 0, mobile ? 13.2 : 12.6)
    camera.lookAt(mobile ? 0 : 0.75, 0, 0)
  }, [camera, mobile])

  useFrame((state, delta) => {
    entranceRef.current = THREE.MathUtils.damp(
      entranceRef.current,
      open ? 1 : 0,
      open ? 4.6 : 8,
      delta,
    )

    carouselRef.current = THREE.MathUtils.damp(
      carouselRef.current,
      targetIndexRef.current,
      5.6,
      delta,
    )

    pointerRef.current.x = THREE.MathUtils.damp(
      pointerRef.current.x,
      state.pointer.x,
      4.4,
      delta,
    )
    pointerRef.current.y = THREE.MathUtils.damp(
      pointerRef.current.y,
      state.pointer.y,
      4.4,
      delta,
    )

    if (!rootRef.current) return
    const pointerX = pointerRef.current.x
    const pointerY = pointerRef.current.y

    rootRef.current.rotation.y = pointerX * 0.012
    rootRef.current.rotation.x = -pointerY * 0.008
    rootRef.current.position.x = pointerX * (mobile ? 0.025 : 0.065)
    rootRef.current.position.y = pointerY * (mobile ? 0.02 : 0.042)

    camera.position.x = pointerX * (mobile ? 0.045 : 0.11)
    camera.position.y = pointerY * (mobile ? 0.035 : 0.075)
    camera.lookAt(mobile ? 0 : 0.75, 0, 0)
  }, -1)

  return (
    <>
      <color attach="background" args={['#050705']} />
      <fog attach="fog" args={['#050705', 10, 24]} />
      <ambientLight intensity={0.82} />
      <directionalLight position={[4, 7, 8]} intensity={2.05} color="#ffffff" />
      <pointLight position={[focusX - 1, 1, 5]} intensity={3.5} distance={12} color="#c9ff55" />

      <group ref={rootRef}>
        <Dust mobile={mobile} entranceRef={entranceRef} />
        <Portal focusX={focusX} mobile={mobile} entranceRef={entranceRef} />
        {apps.map((app, index) => (
          <DeviceCard
            key={app.number}
            app={app}
            index={index}
            total={apps.length}
            focusX={focusX}
            mobile={mobile}
            onSelect={onSelect}
            carouselRef={carouselRef}
            pointerRef={pointerRef}
            entranceRef={entranceRef}
            geometry={geometry}
            outlineGeometry={outlineGeometry}
            texture={textures[index]}
          />
        ))}
      </group>
    </>
  )
}

export default function AppsShowcase3D({ apps, activeIndex, onSelect, open }) {
  return (
    <Canvas
      className="apps-universe__canvas"
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 12.6], fov: 37, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      frameloop={open ? 'always' : 'never'}
      onPointerMissed={() => {
        document.body.style.cursor = ''
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.02
      }}
    >
      <Scene apps={apps} activeIndex={activeIndex} onSelect={onSelect} open={open} />
    </Canvas>
  )
}
