export const APP_CONFIG = {
  debug: true,
  apiUrl: import.meta.env.VITE_API_URL,
  apiKey: import.meta.env.VITE_API_KEY,
  tokenKey: import.meta.env.VITE_TOKEN_KEY,
  profileKey: import.meta.env.VITE_USER_PROFILE_KEY,
  tokenAdminKey: import.meta.env.VITE_TOKEN_KEY_ADMIN,
  profileAdKey: import.meta.env.VITE_ADMIN_PROFILE_KEY,
} as const;
