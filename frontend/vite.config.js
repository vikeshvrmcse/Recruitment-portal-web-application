import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PIONEER RECUITMENT',
        short_name: 'PIONEER',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/android/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/android/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          }]
      }
    })
  ]
})