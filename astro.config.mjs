// @ts-check
import { defineConfig } from "astro/config";
import AstroPWA from "@vite-pwa/astro";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  },
  server: { port: 4321, host: true },
  experimental: {
    svg: true,
  },
  integrations: [
    AstroPWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["/src/assets/favicon-192.png"],
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
            src: "/src/assets/favicon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/src/assets/favicon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        navigateFallback: "/404",
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  // integrations: [serviceWorker({})],
});

// workbox: {
//   globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/api\.*/i,
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'api-cache',
//         expiration: {
//           maxEntries: 100,
//           maxAgeSeconds: 24 * 60 * 60 // 24 hours
//         },
//         cacheableResponse: {
//           statuses: [0, 200]
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico)$/i,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'images',
//         expiration: {
//           maxEntries: 60,
//           maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
//         },
//         cacheableResponse: {
//           statuses: [0, 200]
//         }
//       }
//     },
//     {
//       urlPattern: /\.(?:js|css|woff2?|ttf)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-resources',
//         expiration: {
//           maxEntries: 60,
//           maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
//         }
//       }
//     }
//   ]
// }
