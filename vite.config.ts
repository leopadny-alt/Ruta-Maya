import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/Ruta-Maya/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon-32.png",
        "apple-touch-icon-v2.png",
      ],

      manifest: {
        name: "Ruta Maya – Travel Companion",

        short_name: "Ruta Maya",

        description:
          "Itinerario, mappe, budget e guida completa per il road trip nello Yucatán.",

        theme_color: "#071A2E",
        background_color: "#071A2E",

        display: "standalone",

        orientation: "portrait-primary",

        start_url: "/Ruta-Maya/",

        scope: "/Ruta-Maya/",

        lang: "it",

        categories: [
          "travel",
          "navigation",
        ],

        icons: [
          {
            src: "ruta-maya-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },

          {
            src: "ruta-maya-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },

          {
            src: "ruta-maya-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,png,svg,jpg,jpeg,webp,ico}",
        ],
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
});