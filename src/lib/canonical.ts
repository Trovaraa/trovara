export const BASE_URL = 'https://www.trovara.farm'

// Netlify serves prerendered directories with trailing slashes. Use the actual
// destination in every SEO signal, independent of query/hash or slash variants.
export function canonicalUrl(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, '')
  return `${BASE_URL}${path}/`
}
