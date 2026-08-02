/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SHOP_API_URL?: string
  /** Telegram customer bot username without @ (e.g. TrovaraFarmBot). */
  readonly VITE_TELEGRAM_CUSTOMER_BOT?: string
  /** Local Trovara OS origin for lot/traceability links (dev). */
  readonly VITE_PUBLIC_OS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
