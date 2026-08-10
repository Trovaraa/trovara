const MOMENTS_PROXY_BASE = '/moments-api'
const OS_PUBLIC_MOMENTS_BASE = '/public/moments'

export function momentsMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url === OS_PUBLIC_MOMENTS_BASE) return MOMENTS_PROXY_BASE
  if (url.startsWith(`${OS_PUBLIC_MOMENTS_BASE}/`)) {
    return `${MOMENTS_PROXY_BASE}${url.slice(OS_PUBLIC_MOMENTS_BASE.length)}`
  }
  return url
}
