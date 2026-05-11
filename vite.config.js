import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
      },
      includeAssets: ['favicon.svg', 'logo.png', 'icons.svg'],
      manifest: false, // dùng manifest.json có sẵn trong public/
    }),
  ],
  base: '/ecocompost-ai/',
})
