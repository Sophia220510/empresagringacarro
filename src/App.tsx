import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Camera, Check, ChevronRight, Menu, Phone, ShieldCheck, Upload, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const CarScene = lazy(() => import('./CarScene'))

const services = [
  ['01','Collision Repair','Panel integrity restored to exacting tolerances.'],
  ['02','Auto Body Repair','Precision metalwork built around factory geometry.'],
  ['03','Dent & Scratch Removal','Surface defects disappear without compromise.'],
  ['04','Paint Matching','Digital color calibration for a seamless result.'],
  ['05','Frame Inspection','Measured, documented structural verification.'],
  ['06','Claim Assistance','Clear documentation from inspection to delivery.'],
]
const process = ['Damage Assessment','Repair Planning','Precision Bodywork','Paint Matching','Quality Inspection','Vehicle Delivery']

function Intro() {
  const [show, setShow] = useState(() => typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('blackline-intro'))
  useEffect(() => { if (show) { sessionStorage.setItem('blackline-intro','1'); const t=setTimeout(()=>setShow(false),2200); return()=>clearTimeout(t) } },[show])
  if (!show) return null
  return <div className="intro" aria-hidden="true"><div className="intro-panels"><i/><i/><i/></div><div className="intro-orbit"/><div className="intro-silhouette"/><div className="intro-scan"/><div className="intro-mark"><span>BLACKLINE</span><small>COLLISION</small><em>PRECISION RESTORATION SYSTEMS</em></div><div className="intro-progress"><span>INITIALIZING</span><i/></div></div>
}

function Header() {
  const [open,setOpen]=useState(false)
  const links=[['Services','services'],['Our Process','process'],['Results','results'],['Reviews','reviews'],['Contact','contact']]
  return <header><a className="brand" href="#top"><span>BLACKLINE</span><small>COLLISION</small></a><nav>{links.map(([l,id])=><a key={id} href={`#${id}`}>{l}</a>)}</nav><a className="button small" href="#contact">Free Estimate <ArrowRight size={15}/></a><button className="menu" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>{open&&<div className="mobile-menu">{links.map(([l,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{l}<ChevronRight/></a>)}</div>}</header>
}

function Reveal({children,className=''}:{children:React.ReactNode,className?:string}) {
  const reduced=useReducedMotion()
  return <motion.div className={`reveal-block ${className}`} initial={reduced?false:{opacity:0,y:42,filter:'blur(7px)'}} whileInView={reduced?undefined:{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:false,amount:.16,margin:'-45px'}} transition={{duration:.72,ease:[.16,1,.3,1]}}>{children}</motion.div>
}

function RepairStep({children,className=''}:{children:React.ReactNode,className?:string}) {
  const reduced=useReducedMotion()
  return <motion.article className={`repair-step ${className}`} initial={reduced?false:{opacity:.15,y:50,filter:'blur(6px)'}} whileInView={reduced?undefined:{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:false,amount:.36}} transition={{duration:.65,ease:[.16,1,.3,1]}}>{children}</motion.article>
}

function Hero(){
  const reduced=useReducedMotion()
  const container={hidden:{},show:{transition:{delayChildren:.22,staggerChildren:.085}}}
  const line={hidden:{y:'112%',opacity:0},show:{y:0,opacity:1,transition:{duration:.82,ease:[.16,1,.3,1] as const}}}
  const fade={hidden:{opacity:0,y:24},show:{opacity:1,y:0,transition:{duration:.7,ease:[.16,1,.3,1] as const}}}
  return <section className="hero">
    <div className="grid-lines"/><div className="hero-glow"/>
    <div className="hero-stage" aria-hidden="true"><i className="stage-ring r1"/><i className="stage-ring r2"/><i className="stage-beam"/><i className="stage-floor"/><span className="stage-code">BL / 01<br/>CALIBRATION ACTIVE</span></div>
    <motion.div className="hero-content" variants={container} initial={reduced?false:'hidden'} animate="show">
      <motion.p className="eyebrow" variants={fade}><span/> PRECISION COLLISION SYSTEMS</motion.p>
      <h1><span className="hero-line"><motion.span variants={line}>COLLISION DAMAGE</motion.span></span><span className="hero-line"><motion.span variants={line}>IS TEMPORARY.</motion.span></span><span className="hero-line"><motion.span variants={line}><em>PRECISION</em> IS</motion.span></span><span className="hero-line"><motion.span variants={line}>WHAT LASTS.</motion.span></span></h1>
      <motion.p className="lead" variants={fade}>Advanced collision repair, precise bodywork and flawless refinishing—built to restore your vehicle and your confidence.</motion.p>
      <motion.div className="actions" variants={fade}><a href="#contact" className="button">Request a Free Estimate <ArrowRight/></a><a href="#repair" className="text-link">Explore Our Process <ArrowDown/></a></motion.div>
      <motion.div className="hero-notes" variants={fade}><span><Check/> Insurance Claim Assistance</span><span><Check/> Lifetime Paint Warranty</span><span><Check/> Certified Repair Technicians</span></motion.div>
    </motion.div>
    <div className="hero-mustang" aria-hidden="true"><img src="/images/blackline-hero.webp" alt=""/><div className="car-highlight"/></div>
    <div className="scroll-note">SCROLL TO BEGIN THE RESTORATION <i/></div>
  </section>
}

function BeforeAfter({label, variant}:{label:string,variant:number}) {
  const [pos,setPos]=useState(52)
  const slug=['front','side','paint','dent'][variant-1]
  return <div className={`compare compare-${variant}`}><div className="after-shot"><img src={`/images/results/${slug}-after.webp`} alt={`${label} professionally restored`} loading="lazy" decoding="async"/></div><div className="before-shot" style={{clipPath:`inset(0 ${100-pos}% 0 0)`}}><img src={`/images/results/${slug}-before.webp`} alt={`${label} before collision repair`} loading="lazy" decoding="async"/></div><input aria-label={`${label} before and after comparison`} type="range" min="5" max="95" value={pos} onChange={e=>setPos(+e.target.value)}/><div className="compare-line" style={{left:`${pos}%`}}><span>↔</span></div><b>{label}</b><small className="tag before">BEFORE</small><small className="tag after">AFTER</small></div>
}

export default function App(){
  const repairRef=useRef<HTMLElement>(null); const progressRef=useRef(0); const invalidateRef=useRef<(() => void) | null>(null)
  const counterRef=useRef<HTMLDivElement>(null); const sweepRef=useRef<HTMLDivElement>(null); const reduced=useReducedMotion()
  useEffect(()=>{
    const section=repairRef.current; if(!section)return
    let frame=0; let previousStage=-1
    const update=()=>{
      frame=0
      const travel=Math.max(1,section.offsetHeight-innerHeight)
      const progress=reduced?1:Math.min(1,Math.max(0,-section.getBoundingClientRect().top/travel))
      progressRef.current=progress
      if(sweepRef.current)sweepRef.current.style.transform=`translate3d(${progress*120-60}vw, 0, 0) rotate(-12deg)`
      const stage=Math.min(3,Math.floor(progress*4))
      if(stage!==previousStage&&counterRef.current){counterRef.current.firstChild!.textContent=`0${stage+1} `;previousStage=stage}
      invalidateRef.current?.()
    }
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});update()
    return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);if(frame)cancelAnimationFrame(frame)}
  },[reduced])
  return <><Intro/><Header/><main id="top">
    <Hero/>
    <section className="metrics" aria-label="Company highlights"><div><b>15<span>+</span></b><small>Years of Experience</small></div><div><b>2,400<span>+</span></b><small>Vehicles Restored</small></div><div><b>4.9</b><small>Average Rating</small></div><div><ShieldCheck/><small>Lifetime Paint Warranty</small></div></section>

    <section id="repair" ref={repairRef} className="repair-story"><div className="sticky-car"><Suspense fallback={<div className="scene-loading">CALIBRATING VISUAL SYSTEM…</div>}><CarScene progressRef={progressRef} invalidateRef={invalidateRef}/></Suspense><div ref={sweepRef} className="repair-sweep"/></div><div ref={counterRef} className="stage-counter">01 <span>/ 04</span></div>
      <RepairStep><p className="eyebrow">01 — INITIAL DIAGNOSTICS</p><h2>DAMAGE<br/><em>DETECTED.</em></h2><p>We map every visible and hidden impact before a single repair begins.</p><div className="diagnostic"><span>Structural inspection</span><span>Dent analysis</span><span>Paint damage</span><span>Repair estimate</span></div></RepairStep>
      <RepairStep className="right"><p className="eyebrow">02 — CONTROLLED RESTORATION</p><h2>PRECISION<br/><em>REPAIR.</em></h2><p>Factory geometry returns through measured bodywork, disciplined reconstruction and expert hands.</p></RepairStep>
      <RepairStep><p className="eyebrow">03 — COLOR CALIBRATION</p><h2>PAINT &<br/><em>REFINISHING.</em></h2><p>Digitally matched color, controlled application and a finish engineered to disappear into the original.</p><blockquote>“Factory-level color. Flawless finish.”</blockquote></RepairStep>
      <RepairStep className="right restored"><p className="eyebrow">04 — FINAL QUALITY CONTROL</p><h2>FULLY<br/><em>RESTORED.</em></h2><p>Every line, reflection and safety point verified. Your vehicle—returned to its standard.</p><h3>Bring Your Vehicle Back to Perfection.</h3><div className="actions"><a className="button" href="#contact">Request a Free Estimate</a><a className="text-link" href="tel:+15550147290"><Phone/> Call (555) 014-7290</a></div></RepairStep>
    </section>

    <section id="services" className="services wrap"><Reveal><p className="eyebrow">CAPABILITY / 01</p><h2>EVERY DETAIL.<br/><em>RESTORED.</em></h2></Reveal><div className="service-list">{services.map((s,i)=><Reveal key={s[1]} className="service"><span>{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p><div className={`service-visual v${i}`}><i/><i/><i/></div><ArrowRight/></Reveal>)}</div></section>

    <section id="process" className="process"><div className="wrap"><Reveal><p className="eyebrow">THE BLACKLINE STANDARD</p><h2>SIX CHECKPOINTS.<br/><em>ZERO SHORTCUTS.</em></h2></Reveal><div className="timeline">{process.map((p,i)=><Reveal className="timeline-step" key={p}><b>0{i+1}</b><div><h3>{p}</h3><p>{i===0?'Complete visual and structural diagnostics.':i===5?'A final walkthrough, then the road.':'Documented precision at every stage.'}</p></div></Reveal>)}</div></div></section>

    <section id="results" className="results wrap"><Reveal><p className="eyebrow">MEASURED RESULTS</p><h2>DAMAGE IN.<br/><em>PERFECTION OUT.</em></h2><p className="section-copy">Drag across each repair study to inspect the transformation.</p></Reveal><div className="compare-grid"><BeforeAfter label="Front Collision" variant={1}/><BeforeAfter label="Side Panel Damage" variant={2}/><BeforeAfter label="Paint Restoration" variant={3}/><BeforeAfter label="Dent Repair" variant={4}/></div><p className="demo-note">Demonstration visuals shown. Replace with verified shop project photography.</p></section>

    <section className="insurance"><div className="insurance-visual"><div className="doc"><span>BLACKLINE / REPAIR FILE</span><b>CLAIM_0247</b>{[82,64,91,72].map(n=><i key={n} style={{width:`${n}%`}}/>)}<Check/></div></div><Reveal className="insurance-copy"><p className="eyebrow">CLAIM SUPPORT</p><h2>WE HANDLE MORE<br/>THAN THE <em>REPAIR.</em></h2><p>From the initial inspection to communication throughout the repair process, our team helps make collision recovery clear, organized and stress-free.</p><ul>{['Detailed damage documentation','Clear repair estimates','Insurance claim assistance','Progress updates','Final quality inspection'].map(x=><li key={x}><Check/>{x}</li>)}</ul></Reveal></section>

    <section id="reviews" className="reviews wrap"><Reveal><p className="eyebrow">CLIENT RECORDS / DEMO</p><h2>CONFIDENCE,<br/><em>RESTORED.</em></h2></Reveal><div className="review-grid">{[
      ['MARCUS T.','FRONT COLLISION REPAIR','“The car came back looking untouched. Every update was clear, and the panel gaps are perfect.”'],
      ['ELENA R.','PAINT + DENT REMOVAL','“I cannot find where the damage was. The color match is honestly flawless.”'],
      ['DAVID K.','CLAIM ASSISTANCE','“They made a stressful process feel controlled from the estimate through pickup.”']].map((r,i)=><Reveal className="review" key={r[0]}><div className="stars">★★★★★</div><blockquote>{r[2]}</blockquote><div><b>{r[0]}</b><small>{r[1]}</small><span>0{i+1}</span></div></Reveal>)}</div></section>

    <section id="contact" className="contact"><div className="contact-copy"><p className="eyebrow">START YOUR ESTIMATE</p><h2>LET’S SEE<br/>THE <em>DAMAGE.</em></h2><p>Tell us what happened and our team will help you understand the next step.</p><div className="contact-phone"><small>PREFER TO TALK?</small><a href="tel:+15550147290"><Phone/> (555) 014-7290</a></div></div><EstimateForm/></section>
  </main><Footer/><div className="mobile-bar"><a href="tel:+15550147290"><Phone/>Call Now</a><a href="#contact">Free Estimate<ArrowRight/></a></div></>
}

function EstimateForm(){const [sent,setSent]=useState(false);return <form onSubmit={e=>{e.preventDefault();setSent(true)}}><div className="field"><label htmlFor="name">Full Name</label><input id="name" required placeholder="Your name"/></div><div className="field"><label htmlFor="phone">Phone Number</label><input id="phone" required type="tel" placeholder="(555) 000-0000"/></div><div className="field"><label htmlFor="email">Email</label><input id="email" required type="email" placeholder="you@email.com"/></div><div className="field"><label htmlFor="vehicle">Vehicle Year, Make & Model</label><input id="vehicle" required placeholder="2022 / Make / Model"/></div><div className="field"><label htmlFor="damage">Type of Damage</label><select id="damage" required defaultValue=""><option value="" disabled>Select damage type</option><option>Collision damage</option><option>Dent or scratch</option><option>Paint damage</option><option>Frame inspection</option><option>Other</option></select></div><div className="field"><label htmlFor="zip">ZIP Code</label><input id="zip" required inputMode="numeric" placeholder="00000"/></div><div className="field full"><label htmlFor="message">Tell Us What Happened</label><textarea id="message" rows={3} placeholder="Briefly describe the damage…"/></div><button type="button" className="upload"><Camera/><span><b>Send Photos of the Damage</b><small>Demo upload — JPG or PNG</small></span><Upload/></button>{sent?<div className="success"><Check/> Estimate request received. We’ll be in touch shortly.</div>:<button className="button submit">Request My Free Estimate <ArrowRight/></button>}<small className="form-note">No payment or sensitive information required. Demo form prepared for email integration.</small></form>}

function Footer(){return <footer><div className="brand"><span>BLACKLINE</span><small>COLLISION</small></div><p>Precision repair. Definitive finish.</p><div className="footer-grid"><div><small>DEMONSTRATION ADDRESS</small><p>1847 Industrial Drive<br/>Your City, ST 00000</p></div><div><small>CONTACT</small><a href="tel:+15550147290">(555) 014-7290</a><a href="mailto:estimates@blacklinecollision.com">estimates@blacklinecollision.com</a></div><div><small>HOURS</small><p>Mon–Fri 7:30 AM–6:00 PM<br/>Sat 8:00 AM–1:00 PM</p></div><div><small>SERVICE AREAS</small><p>Your City · North District<br/>West County · Metro Area</p></div></div><div className="footer-bottom"><span>© 2026 BLACKLINE COLLISION</span><a href="#">Privacy Policy</a><span>DEMONSTRATION WEBSITE</span></div></footer>}
