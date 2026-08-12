/**
 * Public brand pack API base.
 * Default is same-origin `/brand-api` (Vite/Netlify proxy → Trovara OS `/public/brand`).
 */
const BRAND_API_BASE = (import.meta.env.VITE_BRAND_API_URL || '/brand-api').replace(/\/+$/, '')

export type BrandPackMeta = {
  title: string
  notes: string | null
  passwordRequired: boolean
  unlocked: boolean
  expiresAt: string | null
}

export type BrandPackItem = {
  id: string
  originalName: string
  mimeType: string
  mediaKind: 'image' | 'video'
  byteSize: number | null
  width: number | null
  height: number | null
  durationSeconds: number | null
  mediaUrl: string
  posterUrl: string | null
}

export type BrandPackItemsResponse = {
  title: string
  notes: string | null
  items: BrandPackItem[]
}

function absolutize(path: string | null | undefined): string | null {
  if (!path) return null
  return `${BRAND_API_BASE}${path.startsWith('/') ? path : `/${path}`}`
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string }
    if (body.error) return body.error
  } catch {
    /* ignore */
  }
  return `Request failed (${response.status})`
}

export async function fetchBrandPackMeta(token: string): Promise<BrandPackMeta> {
  const response = await fetch(`${BRAND_API_BASE}/${encodeURIComponent(token)}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(await parseError(response))
  return response.json()
}

export async function unlockBrandPack(token: string, password?: string): Promise<void> {
  const response = await fetch(`${BRAND_API_BASE}/${encodeURIComponent(token)}/unlock`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password || undefined }),
  })
  if (!response.ok) throw new Error(await parseError(response))
}

export async function fetchBrandPackItems(token: string): Promise<BrandPackItemsResponse> {
  const response = await fetch(`${BRAND_API_BASE}/${encodeURIComponent(token)}/items`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(await parseError(response))
  const data = (await response.json()) as BrandPackItemsResponse
  return {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      mediaKind: item.mediaKind ?? (item.mimeType?.startsWith('video/') ? 'video' : 'image'),
      durationSeconds: item.durationSeconds ?? null,
      mediaUrl: absolutize(item.mediaUrl)!,
      posterUrl: absolutize(item.posterUrl),
    })),
  }
}

export function brandPackZipUrl(token: string): string {
  return `${BRAND_API_BASE}/${encodeURIComponent(token)}/download.zip`
}

export function formatBrandDuration(seconds: number | null | undefined): string | null {
  if (seconds == null) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
