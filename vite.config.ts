import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false, // false en producción
        // suppressWarnings: true  // para evitar mensajes en consola quitando en producción
      },
      workbox: {
        navigateFallback: null,
        runtimeCaching: [],
      },
      manifest: {
        name: 'Project Tracking',
        short_name: 'Project Tracking',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ]
      }
    })
  ],
})
