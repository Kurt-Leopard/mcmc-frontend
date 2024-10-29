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
        theme_color: '#68192F', 
        icons: [
          {
            src: '/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/favicon.ico', 
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/mobile.png', 
            sizes: '512x512',
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
        orientation: "any",
        scope: "/",
        screenshots: [
          {
            src: "/image.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/mobile.png",
            sizes: "640x360",
            type: "image/png"
          }
        ],
        share_target: {
          action: "/?utm_medium=PWA&utm_source=share-target&share-target",
          method: "POST",
          params: {
            title: "Join Our Community!",
            text: "Discover the Minister Of Christian Mission Church.",
            url: "https://yourwebsite.com" 
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
