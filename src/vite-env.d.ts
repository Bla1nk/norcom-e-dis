/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL des Formular-Backends (POST, JSON). Leer = kein Versand. */
  readonly VITE_DEMO_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
