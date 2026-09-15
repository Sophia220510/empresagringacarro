import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, useGLTF } from '@react-three/drei'
import { Component, Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react'
import * as THREE from 'three'

type ExperienceProps = {
  progressRef: MutableRefObject<number>
  invalidateRef: MutableRefObject<(() => void) | null>
}

type MaterialGroups = {
  paint: THREE.MeshPhysicalMaterial[]
  rims: THREE.MeshStandardMaterial[]
  lights: THREE.MeshStandardMaterial[]
  tailLights: THREE.MeshStandardMaterial[]
}

const matches = (name: string, needles: string[]) => needles.some((needle) => name.includes(needle))

function Mustang({ progressRef, onReady }: { progressRef: MutableRefObject<number>; onReady: () => void }) {
  const source = useGLTF('/models/mustang-gt.glb')
  const group = useRef<THREE.Group>(null)
  const disposeTimer = useRef<number | undefined>(undefined)
  const model = useMemo(() => {
    const scene = source.scene.clone(true)
    const groups: MaterialGroups = { paint: [], rims: [], lights: [], tailLights: [] }
    const unique = {
      paint: new Set<THREE.MeshPhysicalMaterial>(), rims: new Set<THREE.MeshStandardMaterial>(),
      lights: new Set<THREE.MeshStandardMaterial>(), tailLights: new Set<THREE.MeshStandardMaterial>(),
    }
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.castShadow = true
      object.receiveShadow = true
      const originals = Array.isArray(object.material) ? object.material : [object.material]
      const materials = originals.map((item) => item.clone())
      object.material = Array.isArray(object.material) ? materials : materials[0]
      materials.forEach((material) => {
        const name = `${object.name} ${material.name}`.toLowerCase()
        material.envMapIntensity = 1.55
        if (matches(name, ['carpaint'])) unique.paint.add(material as THREE.MeshPhysicalMaterial)
        if (matches(name, ['frdperofrmcrim', 'aluminium_clean2', 'aluminium_clean3'])) unique.rims.add(material as THREE.MeshStandardMaterial)
        if (matches(name, ['headlight'])) unique.lights.add(material as THREE.MeshStandardMaterial)
        if (matches(name, ['tailight_reddrk', 'tailight_redglass'])) unique.tailLights.add(material as THREE.MeshStandardMaterial)
      })
    })
    const bounds = new THREE.Box3().setFromObject(scene)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const scale = 5.8 / Math.max(size.x, size.z)
    scene.position.set(-center.x, -bounds.min.y, -center.z)
    groups.paint = [...unique.paint]
    groups.rims = [...unique.rims]
    groups.lights = [...unique.lights]
    groups.tailLights = [...unique.tailLights]
    groups.paint.forEach((material) => {
      material.color.set('#151719'); material.metalness = .78; material.roughness = .34
      material.clearcoat = 1; material.clearcoatRoughness = .08; material.vertexColors = false
    })
    groups.rims.forEach((material) => { material.color.set('#343a3f'); material.metalness = .9; material.roughness = .24 })
    groups.lights.forEach((material) => { material.emissive = new THREE.Color('#eaf7ff'); material.emissiveIntensity = 0 })
    groups.tailLights.forEach((material) => { material.emissive = new THREE.Color('#e12828'); material.emissiveIntensity = .25 })
    return { scene, scale, materials: groups }
  }, [source.scene])

  useEffect(() => {
    if (disposeTimer.current) window.clearTimeout(disposeTimer.current)
    onReady()
    return () => {
      disposeTimer.current = window.setTimeout(() => model.scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      }), 0)
    }
  }, [model, onReady])

  useFrame(({ camera }) => {
    const p = progressRef.current
    const eased = THREE.MathUtils.smoothstep(p, 0, 1)
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(-.48, .52, eased)
      group.current.rotation.z = THREE.MathUtils.lerp(-.015, 0, eased)
      group.current.position.x = THREE.MathUtils.lerp(.32, -.18, eased)
      group.current.scale.setScalar(model.scale * THREE.MathUtils.lerp(1.12, .9, eased))
    }
    camera.position.set(
      THREE.MathUtils.lerp(7.4, 6.6, eased),
      THREE.MathUtils.lerp(2.35, 2.7, eased),
      THREE.MathUtils.lerp(6.1, 8.4, eased),
    )
    camera.lookAt(0, .75, 0)
    model.materials.paint.forEach((material) => {
      material.color.setRGB(THREE.MathUtils.lerp(.055, .085, eased), THREE.MathUtils.lerp(.045, .09, eased), THREE.MathUtils.lerp(.045, .1, eased))
      material.roughness = THREE.MathUtils.lerp(.38, .16, THREE.MathUtils.smoothstep(p, .42, .86))
    })
    const headlight = THREE.MathUtils.smoothstep(p, .72, .94) * 4.2
    model.materials.lights.forEach((material) => { material.emissiveIntensity = headlight })
    model.materials.tailLights.forEach((material) => { material.emissiveIntensity = .35 + headlight * .65 })
  })

  return <group ref={group} rotation={[0, -.48, 0]} scale={model.scale}><primitive object={model.scene} /></group>
}

function Scene({ progressRef, onReady }: { progressRef: MutableRefObject<number>; onReady: () => void }) {
  return <>
    <ambientLight intensity={.7} color="#c9d7e2" />
    <directionalLight position={[5, 7, 6]} color="#f3f7fa" intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
    <directionalLight position={[-5, 3, 1]} color="#a8c6df" intensity={2.1} />
    <spotLight position={[-4, 4, -5]} color="#e12828" intensity={55} angle={.48} penumbra={1} />
    <pointLight position={[1, .8, 5]} color="#eaf7ff" intensity={8} distance={10} />
    <Suspense fallback={null}><Mustang progressRef={progressRef} onReady={onReady} /></Suspense>
    <ContactShadows position={[0, -.02, 0]} scale={9} opacity={.72} blur={2.4} far={4.5} resolution={512} />
    <Environment resolution={64}>
      <Lightformer intensity={3} color="#ffffff" position={[0, 5, -4]} scale={[8, 1, 1]} />
      <Lightformer intensity={2} color="#dceaff" position={[4, 2, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 1, 1]} />
      <Lightformer intensity={2} color="#e12828" position={[-4, 1, -2]} rotation={[0, Math.PI / 2, 0]} scale={[3, .5, 1]} />
    </Environment>
  </>
}

function Fallback() {
  return <div className="mustang-fallback" role="img" aria-label="Classic American muscle car in a collision repair studio"><img src="/images/blackline-hero.webp" alt="Black classic American muscle car in a premium studio" /></div>
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function canRender3D() {
  if (typeof window === 'undefined' || window.innerWidth < 768) return false
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return false
  try { return Boolean(document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl')) } catch { return false }
}

export default function CarScene({ progressRef, invalidateRef }: ExperienceProps) {
  const [enabled] = useState(canRender3D)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const readyCallback = useMemo(() => () => setReady(true), [])
  useEffect(() => {
    if (!root.current) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting) setEngaged(true)
    }, { rootMargin: '150px' })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  if (!enabled) return <div ref={root} className="car-canvas fallback-only"><Fallback /></div>
  return <div ref={root} className={`car-canvas ${ready ? 'model-ready' : 'model-loading'}`}>
    {!ready && <div className="scene-placeholder" aria-hidden="true"><i/><i/><i/></div>}
    {engaged && !ready && <div className="model-status"><i /> LOADING VEHICLE</div>}
    {engaged && <SceneBoundary fallback={<Fallback />}>
      <Canvas
        frameloop={visible ? 'demand' : 'never'} dpr={[1, 1.45]} shadows
        camera={{ fov: 36, near: .1, far: 80, position: [7.4, 2.35, 6.1] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, invalidate }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.28
          gl.outputColorSpace = THREE.SRGBColorSpace; invalidateRef.current = invalidate
        }}
      ><Scene progressRef={progressRef} onReady={readyCallback} /></Canvas>
    </SceneBoundary>}
  </div>
}
