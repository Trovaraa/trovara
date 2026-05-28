import { defineStore } from 'pinia'
import type { Product } from '../types'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [
      {
        id: 'coconut',
        name: 'Coconut',
        category: 'coconut' as const,
        tagline: 'The Fruit of a Thousand Uses',
        description:
          'Our coconuts are grown in rich tropical soil, harvested at peak maturity to deliver maximum sweetness, water content, and nutritional value. From fresh coconut water to dried copra, every coconut from Trovara Farm tells the story of the earth it grew in.',
        benefits: [
          'Rich in electrolytes and hydration',
          'Naturally sweet, chemical-free',
          'Harvested at full maturity',
          'Multi-purpose: water, flesh, oil, husk',
        ],
        icon: '🥥',
        color: '#7B4F2E',
        bgColor: '#FDF5EE',
        available: true,
      },
      {
        id: 'plantain',
        name: 'Plantain',
        category: 'plantain' as const,
        tagline: 'The World\'s Most Versatile Staple',
        description:
          'Our plantains are grown across rich tropical soil and harvested at the perfect stage — green for cooking, ripe for sweeter preparations. Starchier and heartier than regular bananas, plantains are a dietary staple across Africa, the Caribbean, and Latin America. From boiled and fried to dried and milled into flour, every plantain from Trovara Farm is grown with zero synthetic chemicals and harvested to export-grade standards.',
        benefits: [
          'High in resistant starch and complex carbohydrates',
          'Rich in potassium, vitamin C, and fiber',
          'Versatile: boiled, fried, dried, or milled into flour',
          'Lower glycemic index than regular bananas',
          'No artificial ripening — grown and harvested naturally',
          'Export-grade quality for local and international markets',
        ],
        icon: '🍌',
        color: '#C8841A',
        bgColor: '#FEFAED',
        available: true,
      },
      {
        id: 'poultry',
        name: 'Poultry',
        category: 'poultry' as const,
        tagline: 'Raised with Care. Served with Pride.',
        description:
          'At Trovara Farm, our poultry is raised in open, free-range environments with natural feed and clean water. We believe animals raised with dignity produce the finest quality meat and eggs. Our birds are healthy, our practices are ethical, and our produce is exceptional.',
        benefits: [
          'Free-range, open environment',
          'Natural grain-based feed',
          'No growth hormones',
          'Fresh eggs and premium poultry meat',
        ],
        icon: '🐔',
        color: '#1A6B3C',
        bgColor: '#EDF7F1',
        available: true,
      },
      {
        id: 'coming-soon',
        name: 'More Coming Soon',
        category: 'coming-soon' as const,
        tagline: 'The harvest never stops growing',
        description:
          'Trovara Farm is constantly expanding. We are actively developing new crop lines and agricultural products to bring more of the earth\'s finest to your table. Stay close — the next harvest is already underway.',
        benefits: [
          'New crop varieties in development',
          'Expanding into processing and packaging',
          'Export-ready product lines',
          'Partnering with global distributors',
        ],
        icon: '🌱',
        color: '#2D9960',
        bgColor: '#EDF7F1',
        available: false,
      },
    ] as Product[],
  }),

  getters: {
    availableProducts: (state) => state.products.filter((p) => p.available && p.category !== 'coming-soon'),
    allProducts: (state) => state.products,
    getProductById: (state) => (id: string) => state.products.find((p) => p.id === id),
  },
})
