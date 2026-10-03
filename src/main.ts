import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import router from './router'
import App from './App.vue'
import { initAnalytics, trackPageViews } from './lib/analytics'
import { applyThemeClassEarly } from './lib/theme'
import { reloadOnWorkerUpdate } from './lib/service-worker-reload'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-800.css'
import './style.css'

applyThemeClassEarly()
initAnalytics()

// Reload on replacement of an existing worker, not its first claim of a page.
// Genuine updates still refresh stale router tables from previous deploys.
if ('serviceWorker' in navigator) {
  reloadOnWorkerUpdate(navigator.serviceWorker, () => window.location.reload())
}
registerSW({ immediate: true })

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// After mount, so this router hook runs after the one usePageMeta registers and
// reports the new page title rather than the previous one.
trackPageViews(router)
