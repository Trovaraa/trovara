export const PHONE = '2348103693426'

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export const PRODUCT_MESSAGES: Record<'coconut' | 'plantain' | 'poultry' | 'eggs', string> = {
  coconut: "Hi Trovara Farm, I'd like to enquire about your coconut products and wholesale pricing.",
  plantain: "Hi Trovara Farm, I'd like to enquire about your plantain products (green, ripe, chips, flour) and bulk availability.",
  poultry:
    "Hi Trovara Farm, I'd like to enquire about your free-range dressed noilers and mature hens, and wholesale supply options.",
  eggs: "Hi Trovara Farm, I'd like to enquire about your pasture-raised eggs and delivery.",
}
