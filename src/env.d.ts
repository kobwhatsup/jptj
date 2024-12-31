/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VOLCANO_APP_ID: string;
  readonly VITE_VOLCANO_ACCESS_TOKEN: string;
  readonly VITE_VOLCANO_SECRET_KEY: string;
  readonly VITE_VOLCANO_TTS_APP_ID: string;
  readonly VITE_VOLCANO_TTS_ACCESS_TOKEN: string;
  readonly VITE_VOLCANO_TTS_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
