/// <reference types="vitest" />
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: "module",
      },

      manifest: {
        name: "TrueVoice",
        short_name: "truevoice",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#000",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        runtimeCaching: [],
        disableDevLogs: true,
        importScripts: ["./firebase-messaging-sw.js", "./sw,js"],
      },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
      "@server": resolve(__dirname, "../server/src/"),
    },
  },
});
