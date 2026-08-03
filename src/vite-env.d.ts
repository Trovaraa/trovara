/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SHOP_API_URL?: string
  /** Public lot API base; default same-origin `/lot-api`. */
  readonly VITE_LOT_API_URL?: string
  /** Telegram customer bot username without @ (e.g. TrovaraFarmBot). */
  readonly VITE_TELEGRAM_CUSTOMER_BOT?: string
  /** Local Trovara OS origin for certificate / rewrite links (dev). */
  readonly VITE_PUBLIC_OS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
