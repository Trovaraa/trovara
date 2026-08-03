import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

const BASE_URL = 'https://trovara.farm'
const DEFAULT_TITLE = 'Trovara Farm'
const DEFAULT_DESCRIPTION =
  'Food you can trust, from a farm built for tomorrow. Trovara Farm grows premium regenerative food for homes and businesses in Nigeria.'
const DEFAULT_OG_IMAGE = `${BASE_URL}/brand/trovara-social-card-v2.png`

type RouteMetaLike = {
  title?: unknown
  description?: unknown
}

type PageMetaOverrides = {
  title?: string
  description?: string
  canonicalPath?: string
  ogImage?: string
}

function upsertMeta(key: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(key, value)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function resolveCanonical(pathname: string): string {
  if (!pathname || pathname === '/') return BASE_URL
  return `${BASE_URL}${pathname}`
}

export function applyPageMeta(route: RouteLocationNormalizedLoaded, overrides: PageMetaOverrides = {}) {
  const routeMeta = (route.meta ?? {}) as RouteMetaLike
  const title = overrides.title ?? (typeof routeMeta.title === 'string' ? routeMeta.title : DEFAULT_TITLE)
  const description =
    overrides.description ??
    (typeof routeMeta.description === 'string' ? routeMeta.description : DEFAULT_DESCRIPTION)
  const canonical = resolveCanonical(overrides.canonicalPath ?? route.path)

  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', canonical)
  const socialImage = overrides.ogImage ?? DEFAULT_OG_IMAGE
  upsertMeta('property', 'og:type', overrides.ogImage ? 'article' : 'website')
  upsertMeta('property', 'og:image', socialImage)
  upsertMeta('property', 'og:image:width', '1200')
  upsertMeta('property', 'og:image:height', '630')
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', socialImage)
  upsertCanonical(canonical)
}

export function usePageMeta(router: Router) {
  applyPageMeta(router.currentRoute.value)
  router.afterEach((to) => {
    applyPageMeta(to)
  })
}
