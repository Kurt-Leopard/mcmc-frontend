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
            src: '/public/logo.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        "screenshots": [
          {
            "src": "/public/image.png",
            "sizes": "1280x720",
            "type": "image/png",
            "form_factor": "wide"
          },
          {
            "src": "/public/mobile.png",
            "sizes": "640x360",
            "type": "image/png"
           
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
