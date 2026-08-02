/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SHOP_API_URL?: string
  /** Telegram customer bot username without @ (e.g. TrovaraFarmBot). */
  readonly VITE_TELEGRAM_CUSTOMER_BOT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
