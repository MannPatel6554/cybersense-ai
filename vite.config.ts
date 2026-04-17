import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      host: true,
      allowedHosts: ['cybersense-ai.onrender.com']
    }
  }
});