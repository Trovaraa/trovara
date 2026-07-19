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
        specs: [
          { label: 'Grades', value: 'Export-grade, mature coconuts' },
          { label: 'Packaging', value: 'Mesh bags (25-50 kg) or custom bulk' },
          { label: 'Shelf life', value: '3-4 weeks at ambient; longer with cold chain' },
          { label: 'MOQ', value: 'Contact for volume-based minimums' },
          { label: 'Delivery', value: 'Ogun, Lagos, Ibadan' },
        ],
        orderTiers: [
          {
            id: 'one-time',
            name: 'One-Time Order',
            period: 'per order · quote-based',
            description: 'A single delivery sized to your needs - homes, shops, or events.',
            features: [
              'Order any volume',
              'Fresh, mature coconuts',
              'Delivery in Ogun, Lagos & Ibadan',
            ],
            ctaLabel: 'Order on WhatsApp',
            whatsappMessage:
              "Hi Trovara Farm, I'd like to place a one-time coconut order. Please share pricing and availability.",
          },
          {
            id: 'recurring',
            name: 'Recurring Supply',
            period: 'weekly or monthly',
            description: 'A standing order delivered on a schedule - ideal for shops, juice bars & kitchens.',
            features: [
              'Priority harvest allocation',
              'Locked-in supply schedule',
              'Preferential recurring pricing',
              'Pause or adjust anytime',
            ],
            ctaLabel: 'Set Up Recurring Supply',
            popular: true,
            whatsappMessage:
              "Hi Trovara Farm, I'd like to set up a recurring coconut supply. Please share subscription pricing and scheduling.",
          },
        ],
      },
      {
        id: 'plantain',
        name: 'Plantain',
        category: 'plantain' as const,
        tagline: 'The World\'s Most Versatile Staple',
        description:
          'Our plantains are grown across rich tropical soil and harvested at the perfect stage - green for cooking, ripe for sweeter preparations. Starchier and heartier than regular bananas, plantains are a dietary staple across Africa, the Caribbean, and Latin America. From boiled and fried to dried and milled into flour, every plantain from Trovara Farm is grown with zero synthetic chemicals and harvested to export-grade standards.',
        benefits: [
          'High in resistant starch and complex carbohydrates',
          'Rich in potassium, vitamin C, and fiber',
          'Versatile: boiled, fried, dried, or milled into flour',
          'Lower glycemic index than regular bananas',
          'No artificial ripening - grown and harvested naturally',
          'Export-grade quality for local and international markets',
        ],
        icon: '🍌',
        color: '#C8841A',
        bgColor: '#FEFAED',
        available: true,
        specs: [
          { label: 'Grades', value: 'Grade A green; Grade A ripe (prepackaged boxes)' },
          { label: 'Packaging', value: 'Graded cartons, 18-20 kg; chips & flour in sealed packs' },
          { label: 'Shelf life', value: 'Green: 7-10 days; ripe: 3-5 days; flour: 12 months' },
          { label: 'MOQ', value: 'Contact for product-specific minimums' },
          { label: 'Delivery', value: 'Ogun, Lagos, Ibadan - scheduled routes' },
        ],
        orderTiers: [
          {
            id: 'one-time',
            name: 'One-Time Order',
            period: 'per order · quote-based',
            description: 'A single delivery of green, ripe, chips, or flour - sized to your needs.',
            features: [
              'Green, ripe, chips or flour',
              'Graded, export-quality',
              'Delivery in Ogun, Lagos & Ibadan',
            ],
            ctaLabel: 'Order on WhatsApp',
            whatsappMessage:
              "Hi Trovara Farm, I'd like to place a one-time plantain order. Please share pricing and availability.",
          },
          {
            id: 'recurring',
            name: 'Recurring Supply',
            period: 'weekly or monthly',
            description: 'A standing order delivered on a schedule - ideal for kitchens, retailers & processors.',
            features: [
              'Priority harvest allocation',
              'Locked-in supply schedule',
              'Preferential recurring pricing',
              'Pause or adjust anytime',
            ],
            ctaLabel: 'Set Up Recurring Supply',
            popular: true,
            whatsappMessage:
              "Hi Trovara Farm, I'd like to set up a recurring plantain supply. Please share subscription pricing and scheduling.",
          },
        ],
      },
      {
        id: 'poultry',
        name: 'Free-range Dressed Noilers & Mature Hens',
        category: 'poultry' as const,
        tagline: 'Raised with Care. Served with Pride.',
        description:
          'At Trovara Farm, our free-range dressed noilers and mature hens are raised in open environments with natural feed and clean water. We believe animals raised with dignity produce the finest quality meat - healthy birds, ethical practices, and carefully dressed birds ready for kitchens and retailers. (Looking for eggs? See our pasture-raised eggs.)',
        benefits: [
          'Free-range, open environment',
          'Natural grain-based feed',
          'No growth hormones',
          'Free-range dressed noilers & mature hens',
        ],
        icon: '🐔',
        color: '#1A6B3C',
        bgColor: '#EDF7F1',
        available: true,
        specs: [
          { label: 'Grades', value: 'Free-range dressed noilers & mature hens' },
          { label: 'Packaging', value: 'Vacuum-sealed or ice-packed' },
          { label: 'Shelf life', value: 'Fresh dressed birds: 3-5 days refrigerated; longer frozen' },
          { label: 'MOQ', value: 'Contact for recurring supply contracts' },
          { label: 'Delivery', value: 'Ogun, Lagos, Ibadan' },
        ],
        orderTiers: [
          {
            id: 'one-time',
            name: 'One-Time Order',
            period: 'per order · quote-based',
            description:
              'A single delivery of free-range dressed noilers and mature hens, sized to your needs.',
            features: [
              'Whole dressed birds or cuts',
              'Vacuum-sealed or ice-packed',
              'Delivery in Ogun, Lagos & Ibadan',
            ],
            ctaLabel: 'Order on WhatsApp',
            whatsappMessage:
              "Hi Trovara Farm, I'd like to place a one-time order for free-range dressed noilers and mature hens. Please share pricing and availability.",
          },
          {
            id: 'recurring',
            name: 'Recurring Supply',
            period: 'weekly or monthly',
            description: 'A standing order delivered on a schedule - ideal for restaurants & retailers.',
            features: [
              'Priority production allocation',
              'Locked-in supply schedule',
              'Preferential recurring pricing',
              'Pause or adjust anytime',
            ],
            ctaLabel: 'Set Up Recurring Supply',
            popular: true,
            whatsappMessage:
              "Hi Trovara Farm, I'd like to set up a recurring supply of free-range dressed noilers and mature hens. Please share subscription pricing and scheduling.",
          },
        ],
      },
      {
        id: 'eggs',
        name: 'Eggs',
        category: 'eggs' as const,
        tagline: 'Taste what an egg is supposed to be.',
        description:
          'Our hens live outdoors on open pasture every day - rotated across fresh grass, never caged, never crammed into a shed. They forage on natural feed and clean water, with no antibiotics and no hormones. Eggs are hand-collected at dawn and graded before they leave the farm, so every deep-golden yolk carries the taste of the open pasture.',
        benefits: [
          'Genuinely pasture-raised - hens on grass every day',
          'Deep-golden, richer-tasting yolks',
          'No antibiotics, no hormones, ever',
          'Hand-collected at dawn and date-stamped',
        ],
        icon: '🥚',
        color: '#D98A2B',
        bgColor: '#FEF6E7',
        available: true,
        specs: [
          { label: 'Grades', value: 'Farm-fresh, graded pasture-raised eggs' },
          { label: 'Packaging', value: 'Crates of 30; half-crates on request' },
          { label: 'Freshness', value: 'Collected at dawn; date-stamped per crate' },
          { label: 'Delivery', value: 'Ogun, Lagos, Ibadan - scheduled routes' },
          { label: 'MOQ', value: 'None for home orders; volume pricing for trade' },
        ],
        orderTiers: [
          {
            id: 'one-time',
            name: 'One-Time Crate',
            price: '₦6,500',
            period: 'per crate (30 eggs)',
            description: 'Order whenever you like - no commitment.',
            features: [
              '30 pasture-raised eggs',
              'Collected at dawn, date-stamped',
              'Delivered on our scheduled routes',
            ],
            ctaLabel: 'Order on WhatsApp',
            whatsappMessage:
              "Hi Trovara Farm, I'd like to order a one-time crate (30) of pasture-raised eggs. Please confirm price and delivery.",
          },
          {
            id: 'subscription',
            name: 'Weekly Subscription',
            price: '₦23,400',
            period: 'per month · 4 crates',
            description: 'Fresh eggs delivered every week. Save 10% - pause or cancel anytime.',
            features: [
              '4 weekly crates (120 eggs)',
              'Save 10% vs one-time',
              'Priority on every harvest',
              'Pause, skip or cancel anytime',
            ],
            ctaLabel: 'Subscribe on WhatsApp',
            popular: true,
            whatsappMessage:
              "Hi Trovara Farm, I'd like to start a weekly pasture-raised egg subscription (4 crates/month). Please share next steps.",
          },
        ],
      },
      {
        id: 'coming-soon',
        name: 'More Coming Soon',
        category: 'coming-soon' as const,
        tagline: 'The harvest never stops growing',
        description:
          'Trovara Farm is constantly expanding. We are actively developing new crop lines and agricultural products to bring more of the earth\'s finest to your table. Stay close - the next harvest is already underway.',
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
