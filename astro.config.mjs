// @ts-check
import { defineConfig } from "astro/config";
import AstroPWA from "@vite-pwa/astro";
import basicSsl from "@vitejs/plugin-basic-ssl";

const isProd = process.env.NODE_ENV === "production";
const assetDir = isProd ? "/_astro" : "/src/assets";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [basicSsl()],
    server: {
      https: {
        key: "./key.pem",
        cert: "./cert.pem",
      },
    },
  },
  server: { port: 4321, host: true },
  experimental: {
    svg: true,
  },
  integrations: [
    AstroPWA({
      mode: isProd ? "production" : "development",
      base: "/",
      scope: "/",
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
      includeAssets: [
        `${assetDir}/favicon.ico`,
        `${assetDir}/favicon-96.png`,
        `${assetDir}/favicon-192.png`,
        `${assetDir}/favicon.svg`,
      ],
      manifest: {
        name: "Alexander Litvinovich — Designer × SWE × Aspiring PM",
        short_name: "Litvinovich.dev",
        description: "A Micro Landing Page",
        theme_color: "#111111",
        background_color: "#111111",
        orientation: "portrait",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: `${assetDir}/favicon-192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: `${assetDir}/favicon-512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        // Development mode config
        ...(!isProd
          ? {
              navigateFallback: null,
              globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
              runtimeCaching: [
                {
                  urlPattern: /^https:\/\/[^/]+\/.*/,
                  handler: "NetworkFirst",
                  options: {
                    cacheName: "dev-site-cache",
                    networkTimeoutSeconds: 5,
                  },
                },
              ],
            }
          : // Production mode config
            {
              globPatterns: [
                "**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot,webp,jpg,jpeg}",
              ],
              runtimeCaching: [
                {
                  urlPattern: /^https:\/\/[^/]+\/.*/,
                  handler: "CacheFirst",
                  options: {
                    cacheName: "site-cache",
                    networkTimeoutSeconds: 5,
                    expiration: {
                      maxEntries: 200,
                      maxAgeSeconds: 24 * 60 * 60, // 24 hours
                    },
                    cacheableResponse: {
                      statuses: [0, 200],
                    },
                  },
                },
              ],
              cleanupOutdatedCaches: true,
            }),
      },
    }),
  ],
});
