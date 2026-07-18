// Plausible is loaded from https://plausible.io (CSP allowlist in netlify.toml).
// No SRI: Plausible updates script.js without versioned URLs. Analytics runs only
// when VITE_PLAUSIBLE_DOMAIN is set; otherwise this module is a no-op.
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN

export function initAnalytics() {
  if (!PLAUSIBLE_DOMAIN || typeof document === 'undefined') return

  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = PLAUSIBLE_DOMAIN
  script.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(script)
}
