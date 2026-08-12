import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import router from './router'
import App from './App.vue'
import { initAnalytics, trackPageViews } from './lib/analytics'
import { applyThemeClassEarly } from './lib/theme'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-800.css'
import './style.css'

applyThemeClassEarly()
initAnalytics()

// Reload once when a new SW takes control so deep links never run against a
// stale router table from a previous deploy.
if ('serviceWorker' in navigator) {
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })
}
registerSW({ immediate: true })

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// After mount, so this router hook runs after the one usePageMeta registers and
// reports the new page title rather than the previous one.
trackPageViews(router)
