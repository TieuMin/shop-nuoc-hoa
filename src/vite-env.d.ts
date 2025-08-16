// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_USER_PROFILE_KEY: string;
  readonly VITE_TOKEN_KEY: string;
  readonly VITE_TOKEN_KEY_ADMIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
