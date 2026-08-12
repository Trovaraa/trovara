;(function () {
  try {
    var key = 'trovara-color-scheme'
    var stored = localStorage.getItem(key)
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    var dark = stored === 'dark' || ((stored === 'auto' || stored == null) && prefersDark)
    if (dark) document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  } catch (_error) {
    // Storage can be unavailable in privacy modes; the light theme remains usable.
  }
})()
