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
  category: 'coconut' | 'plantain' | 'poultry' | 'eggs' | 'palm-oil' | 'coming-soon'
  tagline: string
  description: string
  benefits: string[]
  specs?: ProductSpecRow[]
  orderTiers?: OrderTier[]
  icon: string
  color: string
  bgColor: string
  available: boolean
  /** Product is visible, but not yet accepting orders. */
  waitlist?: boolean
  availabilityNote?: string
  image?: string
  imageAlt?: string
}

export interface TeamMember {
  name: string
  /** Full role title shown in the biography dialog. */
  role: string
  /** Abbreviated role shown on the team card (e.g. MD, CTO). */
  roleShort: string
  /** Short blurb shown on the team card. */
  bio: string
  /** Full biography shown in the read-more dialog. */
  fullBio: string[]
  initials: string
  image?: string
  /** CSS object-position for circular crop (e.g. 'center 22%'). */
  imagePosition?: string
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

export interface JournalPostFrontmatter {
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

export interface JournalPost {
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
