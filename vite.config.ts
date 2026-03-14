import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://portfolio-platform-1095331155372.asia-southeast1.run.app',
        changeOrigin: true,
        secure: true,
      },
      '/ws': {
        target: 'wss://portfolio-platform-1095331155372.asia-southeast1.run.app',
        ws: true,
        changeOrigin: true,
        rewriteWsOrigin: true,
        secure: true,
      },
    },
  },
})
