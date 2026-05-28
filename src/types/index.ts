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
