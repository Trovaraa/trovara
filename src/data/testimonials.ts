export interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
}

// Customer testimonials are added here when real buyers onboard.
// Do not add placeholder or fabricated partner quotes.
export const testimonials: Testimonial[] = [
  {
    quote: 'We don\'t advise what we haven\'t done ourselves.',
    author: 'Trovara Farm',
    role: 'Brand voice — internal',
  },
]
