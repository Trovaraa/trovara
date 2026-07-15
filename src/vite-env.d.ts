/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  readonly VITE_BUTTONDOWN_USERNAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
