/** Public customer order bot username (no @). Set via VITE_TELEGRAM_CUSTOMER_BOT. */
export const TELEGRAM_CUSTOMER_BOT = (import.meta.env.VITE_TELEGRAM_CUSTOMER_BOT ?? '')
  .trim()
  .replace(/^@/, '')

export const TELEGRAM_ORDER_URL = TELEGRAM_CUSTOMER_BOT
  ? `https://t.me/${TELEGRAM_CUSTOMER_BOT}`
  : ''

/** Shared button classes for Telegram order CTAs (Telegram blue). */
export const TELEGRAM_CTA_CLASS =
  'inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#229ED9] hover:bg-[#1b8bc0] text-white font-semibold text-sm transition-colors'
