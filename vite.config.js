import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Chỉ cache ảnh và font — KHÔNG cache JS/CSS để iOS luôn tải bản mới
        globPatterns: ['**/*.{ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // JS và CSS: luôn lấy từ network trước, cache chỉ là fallback
            urlPattern: /\.(?:js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: { maxAgeSeconds: 60 }, // hết hạn sau 60 giây
            },
          },
        ],
      },
      includeAssets: ['favicon.svg', 'logo.png', 'icons.svg'],
      manifest: false, // dùng manifest.json có sẵn trong public/
    }),
  ],
  base: process.env.GITHUB_REPOSITORY === 'cuong-bo/ecocompostAI'
    ? '/ecocompostAI/'
    : '/ecocompost-ai/',
})
