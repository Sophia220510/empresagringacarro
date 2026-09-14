import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, ContactShadows } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'

function Wheel({ x, z }: { x: number; z: number }) {
  return <group position={[x, -.64, z]} rotation={[Math.PI / 2, 0, 0]}>
    <mesh castShadow><cylinderGeometry args={[.47, .47, .3, 32]} /><meshStandardMaterial color="#050607" roughness={.55} /></mesh>
    <mesh position={[0, -.16, 0]}><cylinderGeometry args={[.27, .27, .32, 12]} /><meshStandardMaterial color="#6f777d" metalness={1} roughness={.22} /></mesh>
  </group>
}

function Car({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.MeshStandardMaterial>(null)
  const silhouette = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-2.2, -.38); s.lineTo(-2.12, .08); s.quadraticCurveTo(-1.98, .42, -1.55, .5)
    s.lineTo(-.92, .58); s.quadraticCurveTo(-.55, 1.1, -.18, 1.22)
    s.quadraticCurveTo(.52, 1.34, .98, .93); s.lineTo(1.45, .56)
    s.quadraticCurveTo(2.05, .48, 2.22, .12); s.lineTo(2.18, -.38); s.closePath()
    return s
  }, [])
  const glass = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-.79, .63); s.lineTo(-.29, 1.11); s.quadraticCurveTo(.31, 1.2, .73, .92)
    s.lineTo(1.13, .6); s.closePath(); return s
  }, [])
  useFrame((state) => {
    if (!group.current || !body.current) return
    group.current.rotation.y = -.34 + progress * .44 + Math.sin(state.clock.elapsedTime * .2) * .018
    group.current.position.y = Math.sin(state.clock.elapsedTime * .6) * .018
    body.current.roughness = THREE.MathUtils.lerp(.62, .09, Math.max(0, (progress - .48) * 2))
  })
  const dark = new THREE.Color('#0a0c0e')
  return <Float speed={1.1} rotationIntensity={.04} floatIntensity={.08}>
    <group ref={group} scale={1.08} position={[.25, -.12, 0]}>
      <mesh castShadow position={[0, 0, -.8]}>
        <extrudeGeometry args={[silhouette, { depth: 1.6, bevelEnabled: true, bevelThickness: .1, bevelSize: .1, bevelSegments: 5 }]} />
        <meshStandardMaterial ref={body} color={dark} metalness={.9} roughness={.25} />
      </mesh>
      <mesh position={[0, 0, .835]}><shapeGeometry args={[glass]} /><meshPhysicalMaterial color="#10202a" transmission={.22} metalness={.65} roughness={.08} clearcoat={1} /></mesh>
      <mesh position={[0, -.29, .925]}><boxGeometry args={[3.5,.06,.025]} /><meshStandardMaterial color="#111518" metalness={.9} roughness={.16} /></mesh>
      {[-1.48,1.42].flatMap(x => [-.82,.82].map(z => <Wheel key={`${x}${z}`} x={x} z={z}/>))}
      <mesh position={[-2.13,.08,.72]} rotation={[0,0,-.12]}><boxGeometry args={[.1,.18,.43]} /><meshStandardMaterial color="#e12828" emissive="#e12828" emissiveIntensity={progress > .7 ? 3 : .3} /></mesh>
      <mesh position={[2.14,.12,.72]} rotation={[0,0,.18]}><boxGeometry args={[.1,.13,.38]} /><meshStandardMaterial color="#eaf7ff" emissive="#ffffff" emissiveIntensity={progress > .78 ? 4 : .2} /></mesh>
      <mesh position={[0,-.02,.94]}><boxGeometry args={[3.35,.025,.025]} /><meshBasicMaterial color={progress < .3 ? '#e12828' : '#d7eef8'} transparent opacity={.68} /></mesh>
    </group>
  </Float>
}

export default function CarScene({ progress }: { progress: number }) {
  return <div className="car-canvas" aria-hidden="true"><Canvas dpr={[1, 1.5]} camera={{ position: [5, 2.1, 5.8], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <Suspense fallback={null}>
      <ambientLight intensity={.18} />
      <spotLight position={[-4,4,3]} color={progress < .45 ? '#e12828' : '#ddecf5'} intensity={70} angle={.38} penumbra={1} castShadow />
      <pointLight position={[4,1,-2]} color="#b9ddf2" intensity={progress > .45 ? 24 : 4} />
      <Car progress={progress} />
      <ContactShadows position={[0,-.83,0]} opacity={.72} scale={8} blur={2.5} far={4} />
      <Environment preset="warehouse" environmentIntensity={.24} />
    </Suspense>
  </Canvas></div>
}
