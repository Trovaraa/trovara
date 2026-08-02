import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import router from './router'
import App from './App.vue'
import { initAnalytics, trackPageViews } from './lib/analytics'
import { applyThemeClassEarly } from './lib/theme'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/inter/900.css'
import './style.css'

applyThemeClassEarly()
initAnalytics()

registerSW({ immediate: true })

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// After mount, so this router hook runs after the one usePageMeta registers and
// reports the new page title rather than the previous one.
trackPageViews(router)
