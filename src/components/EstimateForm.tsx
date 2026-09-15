import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Camera, Check, FileImage, LoaderCircle, Upload, X } from 'lucide-react'
import { businessConfig } from '../config'

type Preview = { file: File; url: string }
type Status = 'idle' | 'sending' | 'success' | 'error'

const MAX_FILES = 4
const MAX_SIZE = 8 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export function EstimateForm() {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const chooseFiles = (files: FileList | null) => {
    if (!files) return
    setMessage('')
    const selected = Array.from(files).slice(0, MAX_FILES)
    const invalid = selected.find(file => !ACCEPTED.includes(file.type) || file.size > MAX_SIZE)
    if (invalid) {
      setStatus('error')
      setMessage('Use JPG, PNG or WebP files up to 8 MB each.')
      return
    }
    previews.forEach(item => URL.revokeObjectURL(item.url))
    setPreviews(selected.map(file => ({ file, url: URL.createObjectURL(file) })))
    setStatus('idle')
  }

  const removeFile = (index:number) => setPreviews(current => current.filter((item, itemIndex) => {
    if (itemIndex === index) URL.revokeObjectURL(item.url)
    return itemIndex !== index
  }))

  const submit = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    if (!businessConfig.formEndpoint) {
      setStatus('error')
      setMessage('This form is not connected to a business inbox. No information was sent.')
      return
    }
    setStatus('sending'); setMessage('Sending your secure estimate request…')
    try {
      const payload = new FormData(form)
      previews.forEach(item => payload.append('photos', item.file))
      const response = await fetch(businessConfig.formEndpoint, { method:'POST', body:payload, headers:{ Accept:'application/json' } })
      if (!response.ok) throw new Error('Request failed')
      setStatus('success'); setMessage('Your estimate request was received. The team will contact you shortly.')
      form.reset(); previews.forEach(item => URL.revokeObjectURL(item.url)); setPreviews([])
    } catch {
      setStatus('error'); setMessage('We could not send your request. Please try again or contact the shop directly.')
    }
  }

  return <form className="estimate-form" onSubmit={submit} noValidate={false}>
    <div className="form-sequence" aria-hidden="true"><span className="active">01 Damage</span><span>02 Vehicle</span><span>03 Photos</span><span>04 Contact</span><span>05 Request</span></div>
    <div className="field"><label htmlFor="damage">Type of Damage</label><select id="damage" name="damage" required defaultValue=""><option value="" disabled>Select damage type</option><option>Collision damage</option><option>Dent or scratch</option><option>Paint damage</option><option>Frame inspection</option><option>Other</option></select></div>
    <div className="field"><label htmlFor="vehicle">Vehicle Year, Make & Model</label><input id="vehicle" name="vehicle" required autoComplete="off" placeholder="2022 / Make / Model"/></div>
    <div className="field full"><label htmlFor="message">Tell Us What Happened</label><textarea id="message" name="message" required rows={3} placeholder="Briefly describe the impact and visible damage…"/></div>
    <div className="upload-field full">
      <input ref={inputRef} id="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => chooseFiles(event.target.files)}/>
      <button type="button" className="upload" onClick={() => inputRef.current?.click()}><Camera/><span><b>Add Damage Photos</b><small>JPG, PNG or WebP · up to 4 files · 8 MB each</small></span><Upload/></button>
      {previews.length > 0 && <div className="file-previews" aria-label="Selected damage photos">{previews.map((item,index) => <figure key={`${item.file.name}-${item.file.lastModified}`}><img src={item.url} alt={`Preview of ${item.file.name}`}/><figcaption><FileImage/>{item.file.name}</figcaption><button type="button" aria-label={`Remove ${item.file.name}`} onClick={() => removeFile(index)}><X/></button></figure>)}</div>}
    </div>
    <div className="field"><label htmlFor="name">Full Name</label><input id="name" name="name" required autoComplete="name" placeholder="Your name"/></div>
    <div className="field"><label htmlFor="phone">Phone Number</label><input id="phone" name="phone" required type="tel" autoComplete="tel" minLength={7} maxLength={24} placeholder="Your phone number"/></div>
    <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" required type="email" autoComplete="email" placeholder="you@email.com"/></div>
    <div className="field"><label htmlFor="zip">ZIP Code</label><input id="zip" name="zip" required inputMode="numeric" autoComplete="postal-code" minLength={4} maxLength={10} placeholder="ZIP code"/></div>
    <label className="consent full"><input name="consent" type="checkbox" required/><span>I agree that the information provided may be used to respond to this estimate request. See the <a href="#privacy">privacy policy</a>.</span></label>
    <button className="button submit" disabled={status === 'sending'}>{status === 'sending' ? <><LoaderCircle className="spin"/> Sending…</> : <>Request My Free Estimate <ArrowRight/></>}</button>
    {message && <div className={`form-status ${status}`} role="status">{status === 'success' && <Check/>}{message}</div>}
    <small className="form-note">Photos remain on your device until you submit this request securely.</small>
  </form>
}
