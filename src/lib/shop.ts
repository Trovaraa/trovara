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
  const data = (await response.json().catch(() => ({}))) as T & { error?: string; csrfToken?: string }
  if (data.csrfToken) csrfToken = data.csrfToken
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

export const shopApi = {
  session: () => request<{ csrfToken: string; account: ShopAccount | null }>('/session'),
  catalog: () => request<{ products: ShopProduct[]; farm: { name: string } }>('/catalog'),
  register: (body: { name: string; email: string; phone?: string; password: string }) =>
    request<{ account: ShopAccount; csrfToken: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{ account: ShopAccount; csrfToken: string }>('/login', {
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
}

export function formatShopPrice(priceKobo: number, currency = 'NGN'): string {
  if (priceKobo <= 0) return 'Price on request'
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    priceKobo / 100,
  )
}
