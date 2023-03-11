import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";
import { manifestSource } from "./src/manifestSource";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ protocolImports: true }),
    VitePWA({
      manifest: manifestSource,
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
