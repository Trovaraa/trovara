export interface Product {
  id: string
  name: string
  category: 'coconut' | 'plantain' | 'poultry' | 'coming-soon'
  tagline: string
  description: string
  benefits: string[]
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
