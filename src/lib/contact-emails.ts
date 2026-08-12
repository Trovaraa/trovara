/** Canonical Trovara public contact addresses for the marketing site. */
export const CONTACT_EMAILS = {
  hello: 'hello@trovara.farm',
  finance: 'finance@trovara.farm',
  /** Legacy inbox; prefer hello@ for new public copy. */
  info: 'info@trovara.farm',
} as const

export function mailto(email: string, subject?: string): string {
  if (!subject) return `mailto:${email}`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}
