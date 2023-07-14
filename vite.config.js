import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8000,
  },
  build: {
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
  },
});
