export type BusinessReview = {
  name: string
  service: string
  rating: number
  source: string
  quote: string
  date?: string
  photo?: string
}

export const businessConfig = {
  name: 'BLACKLINE COLLISION',
  phone: '',
  phoneDisplay: '',
  email: '',
  address: '',
  hours: '',
  serviceArea: '',
  mapEmbedUrl: '',
  directionsUrl: '',
  formEndpoint: '',
  reviews: [] as BusinessReview[],
  certifications: [] as string[],
  insurancePartners: [] as string[],
  verifiedMetrics: [] as { value: string; label: string }[],
  conceptNotice: 'Concept website created for demonstration purposes. Business information is illustrative.',
} as const

export const contactHref = businessConfig.phone ? `tel:${businessConfig.phone}` : '#contact'
