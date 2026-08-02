import { createSharedComposable, useDark, useToggle } from '@vueuse/core'
import { watch } from 'vue'

export const THEME_STORAGE_KEY = 'trovara-color-scheme'

/** Apply `html.dark` from localStorage / system preference before Vue mounts. */
export function applyThemeClassEarly(): void {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored === 'dark' || ((stored === 'auto' || stored == null) && prefersDark)
    document.documentElement.classList.toggle('dark', dark)
  } catch {
    // ignore storage / matchMedia failures
  }
}

export const useTheme = createSharedComposable(() => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: THEME_STORAGE_KEY,
  })

  const toggleDark = useToggle(isDark)

  function setDark(next: boolean) {
    isDark.value = next
  }

  watch(
    isDark,
    (dark) => {
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', dark ? '#0f1612' : '#1A6B3C')
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    },
    { immediate: true },
  )

  return { isDark, toggleDark, setDark }
})
