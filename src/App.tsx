import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Camera, Check, ChevronRight, Menu, Phone, ShieldCheck, Upload, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CarScene = lazy(() => import('./CarScene'))
gsap.registerPlugin(ScrollTrigger)

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
  useEffect(() => { if (show) { sessionStorage.setItem('blackline-intro','1'); const t=setTimeout(()=>setShow(false),1900); return()=>clearTimeout(t) } },[show])
  if (!show) return null
  return <motion.div className="intro" initial={{opacity:1}} exit={{opacity:0}} animate={{opacity:1}}><div className="intro-scan"/><div className="intro-mark"><span>BLACKLINE</span><small>COLLISION</small></div></motion.div>
}

function Header() {
  const [open,setOpen]=useState(false); const [solid,setSolid]=useState(false)
  useEffect(()=>{const fn=()=>setSolid(scrollY>40); addEventListener('scroll',fn,{passive:true}); fn(); return()=>removeEventListener('scroll',fn)},[])
  const links=[['Services','services'],['Our Process','process'],['Results','results'],['Reviews','reviews'],['Contact','contact']]
  return <header className={solid?'solid':''}><a className="brand" href="#top"><span>BLACKLINE</span><small>COLLISION</small></a><nav>{links.map(([l,id])=><a key={id} href={`#${id}`}>{l}</a>)}</nav><a className="button small" href="#contact">Free Estimate <ArrowRight size={15}/></a><button className="menu" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>{open&&<div className="mobile-menu">{links.map(([l,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{l}<ChevronRight/></a>)}</div>}</header>
}

function Reveal({children,className=''}:{children:React.ReactNode,className?:string}) { return <motion.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:.7,ease:[.2,.8,.2,1]}}>{children}</motion.div> }

function BeforeAfter({label, variant}:{label:string,variant:number}) {
  const [pos,setPos]=useState(52)
  return <div className={`compare compare-${variant}`}><div className="after-shot"><div className="panel-car restored-car"/></div><div className="before-shot" style={{clipPath:`inset(0 ${100-pos}% 0 0)`}}><div className="panel-car damaged-car"/></div><input aria-label={`${label} before and after comparison`} type="range" min="5" max="95" value={pos} onChange={e=>setPos(+e.target.value)}/><div className="compare-line" style={{left:`${pos}%`}}><span>↔</span></div><b>{label}</b><small className="tag before">BEFORE</small><small className="tag after">AFTER</small></div>
}

export default function App(){
  const [progress,setProgress]=useState(0); const repairRef=useRef<HTMLElement>(null); const reduced=useReducedMotion()
  useEffect(()=>{if(!repairRef.current||reduced)return; const st=ScrollTrigger.create({trigger:repairRef.current,start:'top top',end:'bottom bottom',scrub:.4,onUpdate:s=>setProgress(s.progress)}); return()=>st.kill()},[reduced])
  const stage=useMemo(()=>Math.min(3,Math.floor(progress*4)),[progress])
  return <><Intro/><Header/><main id="top">
    <section className="hero"><div className="grid-lines"/><div className="hero-glow"/><div className="hero-content"><p className="eyebrow"><span/> PRECISION COLLISION SYSTEMS</p><h1>COLLISION DAMAGE<br/>IS TEMPORARY.<br/><em>PRECISION</em> IS<br/>WHAT LASTS.</h1><p className="lead">Advanced collision repair, precise bodywork and flawless refinishing—built to restore your vehicle and your confidence.</p><div className="actions"><a href="#contact" className="button">Request a Free Estimate <ArrowRight/></a><a href="#repair" className="text-link">Explore Our Process <ArrowDown/></a></div><div className="hero-notes"><span><Check/> Insurance Claim Assistance</span><span><Check/> Lifetime Paint Warranty</span><span><Check/> Certified Repair Technicians</span></div></div><Suspense fallback={<div className="scene-loading">CALIBRATING VISUAL SYSTEM…</div>}><CarScene progress={progress}/></Suspense><div className="scroll-note">SCROLL TO BEGIN THE RESTORATION <i/></div></section>
    <section className="metrics" aria-label="Company highlights"><div><b>15<span>+</span></b><small>Years of Experience</small></div><div><b>2,400<span>+</span></b><small>Vehicles Restored</small></div><div><b>4.9</b><small>Average Rating</small></div><div><ShieldCheck/><small>Lifetime Paint Warranty</small></div></section>

    <section id="repair" ref={repairRef} className="repair-story"><div className="sticky-car"><Suspense fallback={null}><CarScene progress={progress}/></Suspense><div className="scanner" style={{top:`${20+progress*58}%`}}/></div><div className="stage-counter">0{stage+1} <span>/ 04</span></div>
      <article className="repair-step"><p className="eyebrow">01 — INITIAL DIAGNOSTICS</p><h2>DAMAGE<br/><em>DETECTED.</em></h2><p>We map every visible and hidden impact before a single repair begins.</p><div className="diagnostic"><span>Structural inspection</span><span>Dent analysis</span><span>Paint damage</span><span>Repair estimate</span></div></article>
      <article className="repair-step right"><p className="eyebrow">02 — CONTROLLED RESTORATION</p><h2>PRECISION<br/><em>REPAIR.</em></h2><p>Factory geometry returns through measured bodywork, disciplined reconstruction and expert hands.</p></article>
      <article className="repair-step"><p className="eyebrow">03 — COLOR CALIBRATION</p><h2>PAINT &<br/><em>REFINISHING.</em></h2><p>Digitally matched color, controlled application and a finish engineered to disappear into the original.</p><blockquote>“Factory-level color. Flawless finish.”</blockquote></article>
      <article className="repair-step right restored"><p className="eyebrow">04 — FINAL QUALITY CONTROL</p><h2>FULLY<br/><em>RESTORED.</em></h2><p>Every line, reflection and safety point verified. Your vehicle—returned to its standard.</p><h3>Bring Your Vehicle Back to Perfection.</h3><div className="actions"><a className="button" href="#contact">Request a Free Estimate</a><a className="text-link" href="tel:+15550147290"><Phone/> Call (555) 014-7290</a></div></article>
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
