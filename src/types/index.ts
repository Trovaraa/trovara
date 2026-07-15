export interface ProductSpecRow {
  label: string
  value: string
}

export interface OrderTier {
  id: string
  name: string
  /** Display price, e.g. "₦6,500". Omit for quote-based (bulk/wholesale) products. */
  price?: string
  /** Unit/period shown under the price, e.g. "per crate (30 eggs)" or "per month". */
  period?: string
  description: string
  features: string[]
  ctaLabel: string
  popular?: boolean
  /** Prefilled WhatsApp message used when the customer taps the tier CTA. */
  whatsappMessage: string
}

export interface Product {
  id: string
  name: string
  category: 'coconut' | 'plantain' | 'poultry' | 'eggs' | 'coming-soon'
  tagline: string
  description: string
  benefits: string[]
  specs?: ProductSpecRow[]
  orderTiers?: OrderTier[]
  icon: string
  color: string
  bgColor: string
  available: boolean
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  initials: string
}

export interface Stat {
  value: string
  label: string
  icon: string
}

export interface NavLink {
  label: string
  to: string
}

export interface BlogPostFrontmatter {
  title?: string
  excerpt?: string
  author?: string
  publishedAt?: string
  category?: string
  tags?: string[]
  coverEmoji?: string
  coverImage?: string
  readTimeMinutes?: number
  published?: boolean | string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  publishedAt: string
  category: string
  tags: string[]
  coverEmoji: string
  coverImage?: string
  readTimeMinutes: number
  published: boolean
  html: string
}
