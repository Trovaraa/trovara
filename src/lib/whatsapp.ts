export const PHONE = '2348103693426'

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export const PRODUCT_MESSAGES: Record<'coconut' | 'plantain' | 'poultry' | 'eggs' | 'palm-oil', string> = {
  coconut: "Hi Trovara Farm, I'd like to enquire about your coconut products and waitlist updates.",
  plantain: "Hi Trovara Farm, I'd like to enquire about your plantain products (green, ripe, chips, flour) and waitlist updates.",
  poultry:
    "Hi Trovara Farm, I'd like to enquire about your pasture-raised chicken and waitlist updates.",
  eggs: "Hi Trovara Farm, I'd like to enquire about your pasture-raised eggs and waitlist updates.",
  'palm-oil': "Hi Trovara Farm, I'd like to enquire about your palm oil supply plans and waitlist updates.",
}
