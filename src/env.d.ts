/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VOLCANO_MODEL_ENDPOINT: string
  readonly VITE_VOLCANO_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
