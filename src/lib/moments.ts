const MOMENTS_PROXY_BASE = '/moments-api'
const OS_PUBLIC_MOMENTS_BASE = '/public/moments'
export const MOMENTS_CONSENT_VERSION = '2026-08-11'
export const MOMENTS_MAX_UPLOAD_BYTES = 12 * 1024 * 1024

export function momentsMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url === OS_PUBLIC_MOMENTS_BASE) return MOMENTS_PROXY_BASE
  if (url.startsWith(`${OS_PUBLIC_MOMENTS_BASE}/`)) {
    return `${MOMENTS_PROXY_BASE}${url.slice(OS_PUBLIC_MOMENTS_BASE.length)}`
  }
  return url
}
