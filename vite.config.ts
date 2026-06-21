import { defineConfig } from "vite";

// Build output goes to `dist`, which Capacitor reads as `webDir`.
// `base: "./"` makes asset URLs relative so they resolve from the
// capacitor:// (iOS) and https://localhost (Android) WebView origins.
export default defineConfig({
  base: "./",
  build: {
    target: "es2021",
    outDir: "dist",
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5173,
  },
});
