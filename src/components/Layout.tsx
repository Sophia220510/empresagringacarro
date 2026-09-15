import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ChevronRight, Menu, Phone, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { businessConfig, contactHref } from '../config'
import { navItems } from '../data'

export function Intro() {
  const reduced = useReducedMotion()
  const [show, setShow] = useState(() => !reduced && typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('blackline-intro-v2'))
  useEffect(() => {
    if (!show) return
    document.documentElement.classList.add('intro-active')
    sessionStorage.setItem('blackline-intro-v2', '1')
    const started = performance.now()
    const finish = () => window.setTimeout(() => setShow(false), Math.max(0, 1050 - (performance.now() - started)))
    const maximum = window.setTimeout(() => setShow(false), 1600)
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    return () => {
      clearTimeout(maximum)
      window.removeEventListener('load', finish)
      document.documentElement.classList.remove('intro-active')
    }
  }, [show])
  useEffect(() => { if (!show) document.documentElement.classList.remove('intro-active') }, [show])
  if (!show) return null
  return <div className="intro intro-fast" aria-hidden="true">
    <div className="intro-panels"><i/><i/><i/></div><div className="intro-orbit"/><div className="intro-silhouette"/><div className="intro-scan"/>
    <div className="intro-mark"><span>BLACKLINE</span><small>COLLISION</small><em>PRECISION RESTORATION SYSTEMS</em></div>
    <div className="intro-progress"><span>INITIALIZING</span><i/></div>
  </div>
}

export function Header({ active }:{ active:string }) {
  const [open,setOpen] = useState(false)
  return <header>
    <a className="brand" href="#top" aria-label="Blackline Collision home"><span>BLACKLINE</span><small>COLLISION</small></a>
    <nav aria-label="Primary navigation">{navItems.map(item => <a key={item.id} className={active === item.id ? 'active' : ''} href={`#${item.id}`}><span>{item.number}</span>{item.label}</a>)}</nav>
    <a className="button small" href="#contact">Free Estimate <ArrowRight size={15}/></a>
    <button className="menu" aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    {open && <div id="mobile-menu" className="mobile-menu">{navItems.map(item => <a key={item.id} className={active === item.id ? 'active' : ''} href={`#${item.id}`} onClick={() => setOpen(false)}><span>{item.number} — {item.label}</span><ChevronRight/></a>)}</div>}
  </header>
}

export function ScrollStatus({ active, progress }:{ active:string; progress:number }) {
  const item = navItems.find(entry => entry.id === active) ?? navItems[0]
  return <aside className="scroll-status" aria-hidden="true"><div className="scroll-track"><i style={{transform:`scaleY(${progress})`}}/></div><b>{item.number}</b><span>{item.label}</span></aside>
}

export function Hero() {
  const reduced = useReducedMotion()
  const container = { hidden:{}, show:{transition:{delayChildren:.12,staggerChildren:.07}} }
  const line = { hidden:{y:'112%',opacity:0}, show:{y:0,opacity:1,transition:{duration:.78,ease:[.16,1,.3,1] as const}} }
  const fade = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:.65,ease:[.16,1,.3,1] as const}} }
  return <section className="hero" aria-labelledby="hero-title">
    <div className="grid-lines"/><div className="hero-glow"/>
    <div className="hero-stage" aria-hidden="true"><i className="stage-ring r1"/><i className="stage-ring r2"/><i className="stage-beam"/><i className="stage-floor"/><span className="stage-code">BL / 01<br/>CALIBRATION ACTIVE</span></div>
    <motion.div className="hero-content" variants={container} initial={reduced?false:'hidden'} animate="show">
      <motion.p className="eyebrow" variants={fade}><span/> PRECISION COLLISION SYSTEMS</motion.p>
      <h1 id="hero-title"><span className="hero-line"><motion.span variants={line}>COLLISION DAMAGE</motion.span></span><span className="hero-line"><motion.span variants={line}>IS TEMPORARY.</motion.span></span><span className="hero-line"><motion.span variants={line}><em>PRECISION</em> IS</motion.span></span><span className="hero-line"><motion.span variants={line}>WHAT LASTS.</motion.span></span></h1>
      <motion.p className="lead" variants={fade}>Advanced collision repair, measured bodywork and controlled refinishing—built to return every line, surface and safety point with confidence.</motion.p>
      <motion.div className="actions" variants={fade}><a href="#contact" className="button">Request a Free Estimate <ArrowRight/></a><a href="#repair" className="text-link">See the restoration <ArrowDown/></a></motion.div>
    </motion.div>
    <div className="hero-mustang" aria-hidden="true"><img src="/images/blackline-hero.webp" alt="" fetchPriority="high"/><div className="car-highlight"/></div>
    <div className="hero-readout" aria-hidden="true"><span>BODY DATUM</span><b>± 0.01</b><small>SURFACE CONTROL</small></div>
    <div className="scroll-note">SCROLL TO BEGIN THE RESTORATION <i/></div>
  </section>
}

export function TrustBand() {
  return <section className="trust-band" aria-label="Service commitments"><span>01</span><p>Insurance documentation</p><span>02</span><p>Measured repair planning</p><span>03</span><p>Digital color matching</p><span>04</span><p>Final quality inspection</p></section>
}

export function Footer() {
  const configured = Boolean(businessConfig.phone || businessConfig.email || businessConfig.address)
  return <footer>
    <div className="footer-head"><div className="brand"><span>BLACKLINE</span><small>COLLISION</small></div><p>Precision repair. Definitive finish.</p></div>
    <div className="footer-grid">
      <div><small>LOCATION</small><p>{businessConfig.address || 'Business address pending verification'}</p></div>
      <div><small>CONTACT</small>{businessConfig.phoneDisplay && <a href={contactHref}>{businessConfig.phoneDisplay}</a>}{businessConfig.email && <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>}{!configured && <a href="#contact">Request verified contact details</a>}</div>
      <div><small>HOURS</small><p>{businessConfig.hours || 'Hours pending verification'}</p></div>
      <div><small>SERVICE AREA</small><p>{businessConfig.serviceArea || 'Service area pending verification'}</p></div>
    </div>
    <div className="footer-bottom"><span>© 2026 {businessConfig.name}</span><a href="#privacy">Privacy Policy</a><span>{businessConfig.conceptNotice}</span></div>
  </footer>
}

export function MobileBar() {
  return <div className="mobile-bar"><a href={contactHref}><Phone/>{businessConfig.phone ? 'Call Now' : 'Contact'}</a><a href="#contact">Free Estimate<ArrowRight/></a></div>
}
