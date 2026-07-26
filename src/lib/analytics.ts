import type { Router } from 'vue-router'

// Plausible is loaded from https://plausible.io (CSP allowlist in netlify.toml).
// No SRI: Plausible updates script.js without versioned URLs. Plausible runs only
// when VITE_PLAUSIBLE_DOMAIN is set; otherwise that half is a no-op.
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN

// WebMetrix (dashboard: https://trovara.webmetrix.ai) is loaded from
// analytics.webmetrix.ai, also on the CSP allowlist. The tenant and tenantUid are
// public identifiers that ship in the bundle by design. No SRI: the SDK is served
// unversioned with a 10-second cache, so the file changes under the same URL.
const WEBMETRIX_SRC = 'https://analytics.webmetrix.ai/sdk/webmetrix.analytics.min.js'
const WEBMETRIX_TENANT = 'trovara'
const WEBMETRIX_TENANT_UID = '4f39626f-8bc9-49b8-b3af-998da08d005d'

type WebMetrixEvent = {
  event_type: string
  ts: string
  page_path: string
  props?: Record<string, unknown>
}

type WebMetrixSdk = {
  init: (config: { tenant: string; tenantUid: string; debug?: boolean }) => void
  push?: (event: WebMetrixEvent) => void
}

declare global {
  interface Window {
    WebMetrix?: WebMetrixSdk
  }
}

// Events pushed before init() are lost - the SDK parks them on window._wmq and
// never drains it - so hold them here until init has run.
let sdkReady = false
const pending: WebMetrixEvent[] = []
let lastTrackedPath = ''

function initPlausible() {
  if (!PLAUSIBLE_DOMAIN) return

  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = PLAUSIBLE_DOMAIN
  script.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(script)
}

function initWebMetrix() {
  const script = document.createElement('script')
  script.async = true
  script.src = WEBMETRIX_SRC
  script.addEventListener('load', () => {
    window.WebMetrix?.init({ tenant: WEBMETRIX_TENANT, tenantUid: WEBMETRIX_TENANT_UID })
    sdkReady = true
    pending.splice(0).forEach(send)
  })
  document.head.appendChild(script)
}

function send(event: WebMetrixEvent) {
  if (!sdkReady) {
    pending.push(event)
    return
  }
  window.WebMetrix?.push?.(event)
}

export function initAnalytics() {
  if (typeof document === 'undefined') return

  // The SDK reports a page_view for the landing URL as soon as it loads, so the
  // router hook must not report that same path a second time.
  lastTrackedPath = window.location.pathname
  initPlausible()
  initWebMetrix()
}

// The SDK only reports its one page_view at load time, so every in-app route
// change has to be reported by hand or the site looks like a single page.
export function trackPageViews(router: Router) {
  if (typeof document === 'undefined') return

  router.afterEach((to) => {
    if (to.path === lastTrackedPath) return
    lastTrackedPath = to.path
    send({
      event_type: 'page_view',
      ts: new Date().toISOString(),
      page_path: window.location.href,
      props: { page_title: document.title, referrer: document.referrer },
    })
  })
}
