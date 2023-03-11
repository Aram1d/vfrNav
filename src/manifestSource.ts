import { ManifestOptions } from "vite-plugin-pwa";

export const manifestSource: Partial<ManifestOptions> = {
  id: "e846bc0a-c041-11ed-afa1-0242ac120002",
  name: "VFR Navigation planner",
  short_name: "VFR Nav",
  description:
    "VFR nav planner to compute legs course and duration, taking wind in account",
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  display: "standalone",
  theme_color: "#000",
  background_color: "#fff",
  orientation: "landscape",
  start_url: "http://localhost:5173/",
  scope: "/",
};
