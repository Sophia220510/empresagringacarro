import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { repairPhases, navItems } from './data'
import { Footer, Header, Hero, Intro, MobileBar, ScrollStatus, TrustBand } from './components/Layout'
import { ContactSection, FAQSection, FinalCTA, LocationSection, PrivacySection, ProcessSection, ProofSection, ResultsSection, ServicesSection, TechnologySection, WorkshopSection } from './components/Sections'

const CarScene = lazy(() => import('./CarScene'))

function usePageNavigation() {
  const [active,setActive] = useState('repair')
  const [progress,setProgress] = useState(0)
  useEffect(() => {
    let frame=0
    const update=()=>{
      frame=0
      const max=Math.max(1,document.documentElement.scrollHeight-innerHeight)
      setProgress(Math.min(1,scrollY/max))
      const line=innerHeight*.38
      let current:string=navItems[0].id
      navItems.forEach(item=>{const element=document.getElementById(item.id);if(element&&element.getBoundingClientRect().top<=line)current=item.id})
      setActive(current)
    }
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});update()
    return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);if(frame)cancelAnimationFrame(frame)}
  },[])
  return {active,progress}
}

function RepairStep({phase,index}:{phase:typeof repairPhases[number];index:number}) {
  const reduced=useReducedMotion()
  return <motion.article className={`repair-step ${index%2?'right':''} ${index===repairPhases.length-1?'restored':''}`} initial={reduced?false:{opacity:.3,y:34}} whileInView={reduced?undefined:{opacity:1,y:0}} viewport={{once:false,amount:.22}} transition={{duration:.55,ease:[.16,1,.3,1]}}>
    <p className="eyebrow">0{index+1} — {phase.title.toUpperCase()}</p><h2>{phase.heading[0]}<br/><em>{phase.heading[1]}</em></h2><p>{phase.text}</p>
    <div className="phase-checks">{phase.checks.map(check=><span key={check}><Check/>{check}</span>)}</div><small className="phase-code">{phase.code} / COMPLETE</small>
  </motion.article>
}

function RepairStory() {
  const sectionRef=useRef<HTMLElement>(null)
  const progressRef=useRef(0)
  const invalidateRef=useRef<(() => void)|null>(null)
  const sweepRef=useRef<HTMLDivElement>(null)
  const [stage,setStage]=useState(0)
  const reduced=useReducedMotion()
  useEffect(()=>{
    const section=sectionRef.current;if(!section)return
    let frame=0;let previous=-1
    const update=()=>{
      frame=0
      const travel=Math.max(1,section.offsetHeight-innerHeight)
      const progress=reduced?1:Math.min(1,Math.max(0,-section.getBoundingClientRect().top/travel))
      progressRef.current=progress
      if(sweepRef.current)sweepRef.current.style.transform=`translate3d(${progress*122-61}vw,0,0) rotate(-12deg)`
      const next=Math.min(repairPhases.length-1,Math.floor(progress*repairPhases.length))
      if(next!==previous){setStage(next);previous=next}
      invalidateRef.current?.()
    }
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});update()
    return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);if(frame)cancelAnimationFrame(frame)}
  },[reduced])
  return <section id="repair" ref={sectionRef} className="repair-story chapter">
    <div className="sticky-car"><Suspense fallback={<div className="scene-loading">CALIBRATING VISUAL SYSTEM…</div>}><CarScene progressRef={progressRef} invalidateRef={invalidateRef}/></Suspense><div ref={sweepRef} className="repair-sweep"/>
      <div className="diagnostic-hud" aria-hidden="true"><div className="hud-axis horizontal"/><div className="hud-axis vertical"/>{repairPhases.map((phase,index)=><span key={phase.code} className={stage===index?'active':''} style={{'--index':index} as CSSProperties}><i/> {phase.code}</span>)}</div>
      <div className="repair-status" aria-live="polite"><small>ACTIVE PROCEDURE</small><b>0{stage+1} / 0{repairPhases.length}</b><span>{repairPhases[stage].title}</span><i><em style={{transform:`scaleX(${(stage+1)/repairPhases.length})`}}/></i></div>
    </div>
    {repairPhases.map((phase,index)=><RepairStep key={phase.code} phase={phase} index={index}/>) }
  </section>
}

export default function App(){
  const {active,progress}=usePageNavigation()
  return <><Intro/><Header active={active}/><ScrollStatus active={active} progress={progress}/><main id="top"><Hero/><TrustBand/><RepairStory/><ServicesSection/><ProcessSection/><ResultsSection/><WorkshopSection/><TechnologySection/><ProofSection/><FAQSection/><LocationSection/><ContactSection/><FinalCTA/><PrivacySection/></main><Footer/><MobileBar/></>
}
