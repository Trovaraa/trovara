/**
 * Shop API base.
 * Default is same-origin `/shop-api` (Vite/Netlify proxy → Trovara OS `/shop`).
 * Override with VITE_SHOP_API_URL only for direct cross-origin calls (also needs CORS).
 */
const SHOP_API_BASE = (import.meta.env.VITE_SHOP_API_URL || '/shop-api').replace(/\/+$/, '')

export type ShopAccount = {
  id: string
  email: string
  name: string
  phone: string | null
}

export type ShopProduct = {
  id: string
  sku: string
  name: string
  unit: string
  priceKobo: number
  currency: string
}

export type ShopOrder = {
  id: string
  reference: string
  status: string
  paymentStatus: string
  totalAmount: number
  currency: string
  source: string
  createdAt: string
  lotCode: string | null
  traceabilityUrl: string | null
  items: { productName: string; quantity: number; unit: string }[]
}

let csrfToken = ''

export class ShopApiError extends Error {
  status: number
  needsVerification: boolean

  constructor(message: string, status: number, needsVerification = false) {
    super(message)
    this.name = 'ShopApiError'
    this.status = status
    this.needsVerification = needsVerification
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase()
  const headers = new Headers(init.headers)
  if (init.body) headers.set('Content-Type', 'application/json')
  if (!['GET', 'HEAD'].includes(method) && csrfToken) headers.set('X-CSRF-Token', csrfToken)
  const response = await fetch(`${SHOP_API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })
  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string
    csrfToken?: string
    needsVerification?: boolean
  }
  if (data.csrfToken) csrfToken = data.csrfToken
  if (!response.ok) {
    const rawError = data.error
    const message =
      typeof rawError === 'string' && rawError.trim()
        ? rawError
        : 'Something went wrong. Please try again.'
    throw new ShopApiError(message, response.status, data.needsVerification === true)
  }
  return data
}

export const shopApi = {
  session: () => request<{ csrfToken: string; account: ShopAccount | null }>('/session'),
  catalog: () => request<{ products: ShopProduct[]; farm: { name: string } }>('/catalog'),
  register: (body: { name: string; email: string; phone?: string; password: string }) =>
    request<{ message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{ account: ShopAccount; csrfToken: string; needsVerification?: boolean }>('/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  logout: () => request<{ ok: boolean }>('/logout', { method: 'POST' }),
  me: () => request<{ account: ShopAccount; channels: { channel: string; name: string | null }[] }>('/me'),
  orders: () => request<{ orders: ShopOrder[] }>('/orders'),
  linkCode: () =>
    request<{ code: string; expiresAt: string; instruction: string }>('/link-code', { method: 'POST' }),
  placeOrder: (body: {
    items: { productId: string; quantity: number }[]
    address: string
    phone?: string
  }) =>
    request<{ reference: string; payment?: { authorizationUrl: string; amountKobo: number } }>(
      '/orders',
      { method: 'POST', body: JSON.stringify(body) },
    ),
  forgotPassword: (body: { email: string }) =>
    request<{ message: string }>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  resetPassword: (body: { token: string; newPassword: string }) =>
    request<{ message: string }>('/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  verifyEmail: (body: { token: string }) =>
    request<{ message: string }>('/verify-email', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  resendVerification: (body: { email: string }) =>
    request<{ message: string }>('/resend-verification', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}

export function formatShopPrice(priceKobo: number, currency = 'NGN'): string {
  if (priceKobo <= 0) return 'Price on request'
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    priceKobo / 100,
  )
}

/** Local OS SPA origin for non-lot OS links during marketing-site development. */
const LOCAL_OS_URL = (import.meta.env.VITE_PUBLIC_OS_URL || 'http://127.0.0.1:5173').replace(/\/+$/, '')
const PROD_OS_HOSTS = new Set(['os.trovara.farm', 'www.os.trovara.farm'])
const PROD_MARKETING_HOSTS = new Set(['trovara.farm', 'www.trovara.farm'])

/**
 * Point lot links at the local marketing app when browsing on localhost;
 * rewrite other OS URLs to the local OS origin. Keep production URLs elsewhere.
 */
export function resolveTraceabilityUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const browsingLocal =
    import.meta.env.DEV ||
    (typeof window !== 'undefined' &&
      /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname))
  if (!browsingLocal) return url
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    const isProdOs = PROD_OS_HOSTS.has(host)
    const isProdMarketing = PROD_MARKETING_HOSTS.has(host)
    if (!isProdOs && !isProdMarketing) return url
    // Track C: branded lot pages live on the marketing site.
    if (parsed.pathname.startsWith('/lot/')) {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : LOCAL_OS_URL
      return `${origin}${parsed.pathname}${parsed.search}${parsed.hash}`
    }
    if (isProdOs) {
      return `${LOCAL_OS_URL}${parsed.pathname}${parsed.search}${parsed.hash}`
    }
    return url
  } catch {
    return url
  }
}
