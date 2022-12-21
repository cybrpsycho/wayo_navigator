import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../assets/web",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
  },
});
