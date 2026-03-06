import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import feedbackPlugin from './vite-plugin-feedback'

export default defineConfig({
  plugins: [react(), feedbackPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
    allowedHosts: true,
  },
})
