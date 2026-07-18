export interface ProductColorClasses {
  headerBg: string
  overlayBg: string
  text: string
  bgAccent: string
  borderAccent: string
  ringAccent: string
  btnOutline: string
}

const PRODUCT_COLOR_MAP: Record<string, ProductColorClasses> = {
  coconut: {
    headerBg: 'bg-[#FDF5EE]',
    overlayBg: 'bg-trovara-earth',
    text: 'text-trovara-earth',
    bgAccent: 'bg-trovara-earth',
    borderAccent: 'border-trovara-earth',
    ringAccent: 'ring-trovara-earth',
    btnOutline:
      'border-trovara-earth text-trovara-earth hover:bg-trovara-earth hover:text-white',
  },
  plantain: {
    headerBg: 'bg-trovara-gold-50',
    overlayBg: 'bg-trovara-gold-500',
    text: 'text-trovara-gold-500',
    bgAccent: 'bg-trovara-gold-500',
    borderAccent: 'border-trovara-gold-500',
    ringAccent: 'ring-trovara-gold-500',
    btnOutline:
      'border-trovara-gold-500 text-trovara-gold-500 hover:bg-trovara-gold-500 hover:text-white',
  },
  poultry: {
    headerBg: 'bg-trovara-green-50',
    overlayBg: 'bg-trovara-green',
    text: 'text-trovara-green',
    bgAccent: 'bg-trovara-green',
    borderAccent: 'border-trovara-green',
    ringAccent: 'ring-trovara-green',
    btnOutline:
      'border-trovara-green text-trovara-green hover:bg-trovara-green hover:text-white',
  },
  eggs: {
    headerBg: 'bg-[#FEF6E7]',
    overlayBg: 'bg-trovara-gold-600',
    text: 'text-trovara-gold-600',
    bgAccent: 'bg-trovara-gold-600',
    borderAccent: 'border-trovara-gold-600',
    ringAccent: 'ring-trovara-gold-600',
    btnOutline:
      'border-trovara-gold-600 text-trovara-gold-600 hover:bg-trovara-gold-600 hover:text-white',
  },
  'coming-soon': {
    headerBg: 'bg-trovara-green-50',
    overlayBg: 'bg-trovara-green-500',
    text: 'text-trovara-green-500',
    bgAccent: 'bg-trovara-green-500',
    borderAccent: 'border-trovara-green-500',
    ringAccent: 'ring-trovara-green-500',
    btnOutline:
      'border-trovara-green-500 text-trovara-green-500 hover:bg-trovara-green-500 hover:text-white',
  },
}

const FALLBACK: ProductColorClasses = {
  headerBg: 'bg-trovara-green-50',
  overlayBg: 'bg-trovara-green',
  text: 'text-trovara-green',
  bgAccent: 'bg-trovara-green',
  borderAccent: 'border-trovara-green',
  ringAccent: 'ring-trovara-green',
  btnOutline:
    'border-trovara-green text-trovara-green hover:bg-trovara-green hover:text-white',
}

export function productColorClasses(productId: string): ProductColorClasses {
  return PRODUCT_COLOR_MAP[productId] ?? FALLBACK
}
