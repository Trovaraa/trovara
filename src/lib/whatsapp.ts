export const PHONE = '2348103693426'

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export const PRODUCT_MESSAGES: Record<'coconut' | 'plantain' | 'poultry' | 'eggs' | 'palm-oil', string> = {
  coconut:
    "Hi Trovara Farm, I'd like to enquire about your coconut waitlist (whole fruit), and planned milk, chips, and oil after first harvest.",
  plantain:
    "Hi Trovara Farm, I'd like to enquire about your plantain waitlist (green and ripe fruit), and planned chips and flour after first harvest.",
  poultry:
    "Hi Trovara Farm, I'd like to enquire about your pasture-raised chicken and waitlist updates.",
  eggs: "Hi Trovara Farm, I'd like to enquire about your pasture-raised eggs and waitlist updates.",
  'palm-oil': "Hi Trovara Farm, I'd like to enquire about your palm oil supply plans and waitlist updates.",
}
