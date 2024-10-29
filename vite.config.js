import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'Minister Of Christian Mission Church',
        short_name: 'MCMC',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            "src": "/android/logo.png",
            "sizes": "512x512",
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: [
          "church",
          "community",
          "non-profit",
          "religion"
        ],
        description: "Join us at the Minister Of Christian Mission Church for fellowship and community service.",
        lang: "en",
        orientation: "any maskable",
        scope: "/",
        screenshots: [
          {
            src: "/android/desktop.png",
            sizes: "720x1640",
            type: "image/png"
          },
          {
            src: "/android/desktop1.png",
            sizes: "1366x768",
            type: "image/png",
            form_factor: "wide"
          },
        ],
        share_target: {
          action: "/?utm_medium=PWA&utm_source=share-target&share-target",
          method: "POST",
          params: {
            title: "Join Our Community!",
            text: "Discover the Minister Of Christian Mission Church.",
            url: "https://aquamarine-marshmallow-b4034f.netlify.app"
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
