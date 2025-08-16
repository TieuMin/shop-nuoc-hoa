import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    define: {
      __APP_VERSION__: JSON.stringify("1.0.0"),
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  };
});
