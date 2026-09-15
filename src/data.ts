export const navItems = [
  { number: '01', label: 'Diagnostics', id: 'repair' },
  { number: '02', label: 'Services', id: 'services' },
  { number: '03', label: 'Process', id: 'process' },
  { number: '04', label: 'Results', id: 'results' },
  { number: '05', label: 'Proof', id: 'proof' },
  { number: '06', label: 'Estimate', id: 'contact' },
] as const

export const repairPhases = [
  { title: 'Structural Scan', heading: ['IMPACT', 'MAPPED.'], text: 'Visible and hidden damage is recorded against factory reference points.', code: 'SCAN / 01', checks: ['Impact zone', 'Safety points', 'Panel geometry'] },
  { title: 'Impact Analysis', heading: ['DAMAGE', 'UNDERSTOOD.'], text: 'Repair direction is established before a single component is moved.', code: 'ANL / 02', checks: ['Repair path', 'Parts strategy', 'Access points'] },
  { title: 'Frame Alignment', heading: ['GEOMETRY', 'RETURNED.'], text: 'Measured corrections return structural points to specification.', code: 'FRM / 03', checks: ['Datum control', 'Rail alignment', 'Panel gaps'] },
  { title: 'Surface Repair', heading: ['SURFACE', 'REFINED.'], text: 'Metal and composite surfaces are rebuilt with disciplined bodywork.', code: 'SRF / 04', checks: ['Contour', 'Edge definition', 'Substrate'] },
  { title: 'Digital Color Match', heading: ['COLOR', 'CALIBRATED.'], text: 'Color is measured, mixed and blended for a seamless transition.', code: 'CLR / 05', checks: ['Spectral read', 'Spray card', 'Blend control'] },
  { title: 'Final Calibration', heading: ['FULLY', 'RESTORED.'], text: 'Alignment, finish and repaired safety points receive final verification.', code: 'QC / 06', checks: ['Fit and finish', 'Lighting check', 'Delivery review'] },
] as const

export const services = [
  { number: '01', title: 'Collision Repair', text: 'A controlled path from impact mapping through final verification.', detail: 'Structure / panels / safety points', image: '/images/workshop/frame-alignment.webp', size: 'feature' },
  { number: '02', title: 'Auto Body Repair', text: 'Metalwork shaped around original body lines and factory geometry.', detail: 'Panel forming / fit / finish', image: '/images/results/side-after.webp', size: 'standard' },
  { number: '03', title: 'Dent & Scratch Removal', text: 'Targeted surface correction designed to preserve surrounding material.', detail: 'Contour / surface / polish', image: '/images/results/dent-after.webp', size: 'standard' },
  { number: '04', title: 'Paint Matching', text: 'Measured color formulation and controlled application under inspection light.', detail: 'Measure / mix / blend', image: '/images/workshop/paint-booth.webp', size: 'wide' },
  { number: '05', title: 'Frame Inspection', text: 'Reference-point measurement to reveal structural movement after impact.', detail: 'Scan / measure / document', image: '/images/workshop/frame-alignment.webp', size: 'standard' },
  { number: '06', title: 'Claim Assistance', text: 'Organized documentation that keeps the repair story clear from start to finish.', detail: 'Estimate / evidence / updates', image: '/images/results/front-before.webp', size: 'standard' },
] as const

export const processSteps = [
  ['Damage Assessment', 'Visible and hidden damage is mapped before repairs begin.'],
  ['Repair Planning', 'Parts, procedures and timelines are organized into a precise repair plan.'],
  ['Precision Bodywork', 'Panels and structural components are restored to factory geometry.'],
  ['Digital Paint Matching', 'Color is measured, mixed and applied for a seamless factory-level finish.'],
  ['Quality Inspection', 'Alignment, finish, safety points and repaired surfaces are carefully verified.'],
  ['Vehicle Delivery', 'The final repair is reviewed with the customer before the vehicle returns to the road.'],
] as const

export const resultStudies = [
  { slug: 'front', label: 'Front Collision', category: 'Structural + body repair', duration: 'Timeline set after inspection', areas: 'Front structure · hood · fascia', summary: 'Impact mapping, geometry correction and complete front-end refinishing.' },
  { slug: 'side', label: 'Side Panel Damage', category: 'Panel restoration', duration: 'Timeline set after inspection', areas: 'Door · quarter panel · body line', summary: 'Panel alignment and surface reconstruction across a continuous character line.' },
  { slug: 'paint', label: 'Paint Restoration', category: 'Refinishing', duration: 'Timeline set after inspection', areas: 'Color · clearcoat · blend zone', summary: 'Digital color measurement followed by a controlled seamless blend.' },
  { slug: 'dent', label: 'Dent Repair', category: 'Surface correction', duration: 'Timeline set after inspection', areas: 'Outer panel · contour · finish', summary: 'Targeted metal correction with a final reflection and contour inspection.' },
] as const

export const faqs = [
  ['Do you work with insurance companies?', 'The workflow is prepared for claim documentation and insurer communication. Confirm participating insurers directly with the business before scheduling.'],
  ['How long does an estimate take?', 'Estimate timing depends on vehicle access and the possibility of hidden damage. The team confirms the expected window when your request is reviewed.'],
  ['Can I send photos before visiting?', 'Yes. The estimate form accepts clear JPG, PNG or WebP images so the visible damage can be reviewed before an in-person inspection.'],
  ['Is the paintwork covered by warranty?', 'Warranty terms must be confirmed in writing by the business for the specific repair. Coverage details should appear on the final repair order.'],
  ['How long will the repair take?', 'The timeline depends on damage depth, parts availability and insurer approvals. A repair plan is prepared after assessment.'],
  ['Do I need an appointment?', 'Submitting the estimate form first helps the team prepare for your vehicle and recommend the correct next step.'],
] as const
