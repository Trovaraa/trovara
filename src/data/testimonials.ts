export interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
}

// Customer testimonials are added here when real buyers onboard.
// Do not add placeholder or fabricated partner quotes.
export const testimonials: Testimonial[] = []
