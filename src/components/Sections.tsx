import { useState, type ReactNode } from 'react'
import { ArrowRight, Check, Crosshair, Gauge, MapPin, ScanLine, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { businessConfig } from '../config'
import { faqs, processSteps, resultStudies, services } from '../data'
import { EstimateForm } from './EstimateForm'

export function Reveal({children,className=''}:{children:ReactNode;className?:string}) {
  const reduced = useReducedMotion()
  return <motion.div className={`reveal-block ${className}`} initial={reduced?false:{opacity:.35,y:34}} whileInView={reduced?undefined:{opacity:1,y:0}} viewport={{once:false,amount:.08,margin:'-24px'}} transition={{duration:.62,ease:[.16,1,.3,1]}}>{children}</motion.div>
}

function BeforeAfter({study,index}:{study:typeof resultStudies[number];index:number}) {
  const [position,setPosition] = useState(52)
  const [loaded,setLoaded] = useState(0)
  return <article className={`case-study ${index === 0 ? 'case-feature' : ''}`}>
    <div className={`compare ${loaded === 2 ? 'images-ready' : 'images-loading'}`}>
      <div className="compare-loader" aria-hidden="true"><i/></div>
      <div className="after-shot"><img src={`/images/results/${study.slug}-after.webp`} alt={`${study.label} professionally restored`} loading={index===0?'eager':'lazy'} fetchPriority={index===0?'high':'auto'} decoding="async" onLoad={()=>setLoaded(value=>value+1)}/></div>
      <div className="before-shot" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}><img src={`/images/results/${study.slug}-before.webp`} alt={`${study.label} before collision repair`} loading={index===0?'eager':'lazy'} fetchPriority={index===0?'high':'auto'} decoding="async" onLoad={()=>setLoaded(value=>value+1)}/></div>
      <input aria-label={`${study.label}: move to compare before and after`} type="range" min="5" max="95" value={position} onChange={event=>setPosition(Number(event.target.value))}/>
      <div className="compare-line" style={{left:`${position}%`}} aria-hidden="true"><span>↔</span></div><small className="tag before">BEFORE</small><small className="tag after">AFTER</small>
    </div>
    <div className="case-info"><div><small>{study.category}</small><h3>{study.label}</h3><p>{study.summary}</p></div><dl><div><dt>Typical timing</dt><dd>{study.duration}</dd></div><div><dt>Restored areas</dt><dd>{study.areas}</dd></div></dl></div>
  </article>
}

export function ServicesSection() {
  return <section id="services" className="services services-editorial wrap chapter"><Reveal><p className="eyebrow">CAPABILITY / 02</p><h2>EVERY DETAIL.<br/><em>RESTORED.</em></h2><p className="section-copy">Six disciplines, one controlled repair system. Each service is measured by the quality of the final surface, fit and safety check.</p></Reveal><div className="service-editorial-grid">{services.map(service => <Reveal key={service.title} className={`service-editorial ${service.size}`}><img src={service.image} alt="" loading="lazy" decoding="async"/><div className="service-shade"/><span>{service.number}</span><div><small>{service.detail}</small><h3>{service.title}</h3><p>{service.text}</p></div><ArrowRight/></Reveal>)}</div></section>
}

export function ProcessSection() {
  const icons = [ScanLine, Crosshair, Gauge, Sparkles, ShieldCheck, Check]
  return <section id="process" className="process chapter"><div className="wrap"><Reveal><p className="eyebrow">THE BLACKLINE STANDARD / 03</p><h2>SIX CHECKPOINTS.<br/><em>ZERO SHORTCUTS.</em></h2></Reveal><div className="process-line">{processSteps.map(([title,text],index)=>{const Icon=icons[index];return <Reveal className="process-node" key={title}><div className="process-marker"><Icon/><i/></div><b>0{index+1}</b><h3>{title}</h3><p>{text}</p></Reveal>})}</div></div></section>
}

export function ResultsSection() {
  return <section id="results" className="results results-expanded wrap chapter"><Reveal><p className="eyebrow">MEASURED RESULTS / 04</p><h2>DAMAGE IN.<br/><em>PERFECTION OUT.</em></h2><p className="section-copy">Use the control on each repair study to inspect the transformation.</p></Reveal><div className="case-grid">{resultStudies.map((study,index)=><BeforeAfter key={study.slug} study={study} index={index}/>)}</div></section>
}

export function WorkshopSection() {
  return <section className="workshop chapter" aria-labelledby="workshop-title"><div className="workshop-grid">
    <Reveal className="workshop-heading"><p className="eyebrow">THE REPAIR ENVIRONMENT</p><h2 id="workshop-title">BUILT AROUND<br/><em>THE PROCESS.</em></h2><p>From structural measurement to final reflection control, each environment exists to make the repair more repeatable and easier to verify.</p></Reveal>
    <figure className="shop-image shop-structure"><img src="/images/workshop/frame-alignment.webp" alt="Technicians measuring a muscle car on a structural alignment rack" loading="lazy"/><figcaption><b>01 / STRUCTURE</b><span>Reference-point alignment</span></figcaption></figure>
    <figure className="shop-image shop-paint"><img src="/images/workshop/paint-booth.webp" alt="Technician refinishing a black muscle car in a paint booth" loading="lazy"/><figcaption><b>02 / REFINISH</b><span>Controlled paint environment</span></figcaption></figure>
    <figure className="shop-image shop-final"><img src="/images/workshop/final-inspection.webp" alt="Technician inspecting the finish of a restored black muscle car" loading="lazy"/><figcaption><b>03 / VERIFY</b><span>Final surface inspection</span></figcaption></figure>
  </div></section>
}

export function TechnologySection() {
  const items=[
    ['01','Structural measurement','Reference points reveal movement that visual inspection alone can miss.'],
    ['02','Digital color analysis','Measured color data guides mixing, spray-card confirmation and blending.'],
    ['03','Controlled refinishing','Airflow, cleanliness and inspection lighting support a consistent finish.'],
    ['04','Quality documentation','Repair checkpoints keep alignment, surface and delivery review traceable.'],
  ]
  return <section className="technology"><div className="wrap tech-layout"><Reveal><p className="eyebrow">REPAIR TECHNOLOGY</p><h2>MEASURE.<br/><em>CORRECT.</em><br/>VERIFY.</h2></Reveal><div className="tech-readout"><div className="tech-radar" aria-hidden="true"><i/><i/><i/><span>DATUM<br/>CONTROL</span></div>{items.map(item=><article key={item[0]}><b>{item[0]}</b><div><h3>{item[1]}</h3><p>{item[2]}</p></div></article>)}</div></div></section>
}

export function ProofSection() {
  const hasReviews=businessConfig.reviews.length>0
  return <section id="proof" className="proof wrap chapter"><Reveal><p className="eyebrow">PROOF / 05</p><h2>TRUST IS<br/><em>VERIFIED.</em></h2><p className="section-copy">A credible repair business should make its workmanship, communication and records easy to inspect.</p></Reveal>
    <div className="proof-ledger"><article><b>01</b><ShieldCheck/><h3>Written repair record</h3><p>Assessment, plan and final checks belong in one clear repair story.</p></article><article><b>02</b><ScanLine/><h3>Visible quality control</h3><p>Panel fit, finish and repaired safety points are checked before delivery.</p></article><article><b>03</b><Crosshair/><h3>Clear communication</h3><p>Questions, approvals and next steps stay understandable throughout the job.</p></article></div>
    <div className="verified-reviews"><div className="review-head"><span><Star/> VERIFIED CUSTOMER REVIEWS</span><small>{hasReviews ? `${businessConfig.reviews.length} published records` : 'Awaiting verified business records'}</small></div>{hasReviews ? <div className="review-grid">{businessConfig.reviews.map(review=><article className="review" key={`${review.name}-${review.source}`}><div className="stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}</div><blockquote>“{review.quote}”</blockquote><footer><b>{review.name}</b><small>{review.service} · {review.source}{review.date ? ` · ${review.date}` : ''}</small></footer></article>)}</div> : <p className="review-empty">Customer stories will appear here only after their source and details have been verified.</p>}</div>
  </section>
}

export function FAQSection() {
  return <section className="faq wrap"><Reveal><p className="eyebrow">COMMON QUESTIONS</p><h2>BEFORE THE<br/><em>ESTIMATE.</em></h2></Reveal><div className="faq-list">{faqs.map(([question,answer],index)=><details key={question}><summary><span>0{index+1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></section>
}

export function LocationSection() {
  const hasLocation=Boolean(businessConfig.address && businessConfig.mapEmbedUrl)
  return <section className="location"><div className="location-map">{hasLocation?<iframe title="Blackline Collision location" src={businessConfig.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>:<div className="map-placeholder" aria-label="Location pending verification"><div className="map-grid"/><MapPin/><span>LOCATION DATA<br/>PENDING VERIFICATION</span></div>}</div><div className="location-copy"><p className="eyebrow">VISIT THE FACILITY</p><h2>PLAN YOUR<br/><em>ARRIVAL.</em></h2><dl><div><dt>Address</dt><dd>{businessConfig.address || 'To be supplied by the business'}</dd></div><div><dt>Hours</dt><dd>{businessConfig.hours || 'To be supplied by the business'}</dd></div><div><dt>Service area</dt><dd>{businessConfig.serviceArea || 'To be supplied by the business'}</dd></div></dl>{businessConfig.directionsUrl ? <a className="button" href={businessConfig.directionsUrl} target="_blank" rel="noreferrer">Get Directions <ArrowRight/></a> : <a className="text-link" href="#contact">Ask for location details <ArrowRight/></a>}</div></section>
}

export function ContactSection() {
  return <section id="contact" className="contact chapter"><div className="contact-copy"><p className="eyebrow">START YOUR ESTIMATE / 06</p><h2>LET’S SEE<br/>THE <em>DAMAGE.</em></h2><p>Share the visible damage, identify your vehicle and add clear photos so the repair can be reviewed before you visit.</p><ol><li><span>01</span>Describe the impact</li><li><span>02</span>Identify the vehicle</li><li><span>03</span>Add clear photos</li><li><span>04</span>Leave your contact</li></ol></div><EstimateForm/></section>
}

export function FinalCTA() {
  return <section className="final-cta"><img src="/images/workshop/final-inspection.webp" alt="Fully restored black American muscle car after final inspection" loading="lazy"/><div><p className="eyebrow">READY FOR THE NEXT MILE</p><h2>RESTORE<br/><em>CONFIDENCE.</em></h2><a className="button" href="#contact">Start Your Estimate <ArrowRight/></a></div></section>
}

export function PrivacySection() {
  return <section id="privacy" className="privacy wrap"><div><p className="eyebrow">PRIVACY POLICY</p><h2>YOUR REQUEST.<br/><em>HANDLED WITH CARE.</em></h2></div><div><p>The estimate form is designed to collect only the information needed to review a request: contact details, vehicle information, a damage description and optional photographs.</p><p>Data is not sold or placed in a public record. Until a secure receiving endpoint is activated, submissions are not transmitted. Before launch, the operating business must provide its retention period, contact information and any jurisdiction-specific disclosures.</p><p>Do not upload insurance cards, identification documents, payment information or images containing unrelated personal information.</p></div></section>
}
