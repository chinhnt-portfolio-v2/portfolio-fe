import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite HTML plugin: replaces {{VITE_PLAUSIBLE_DOMAIN}} placeholder with the
// actual env var value at build time so Plausible tracks the correct domain.
function plausibleDomainPlugin() {
  return {
    name: 'vite-plugin-plausible-domain',
    transformIndexHtml(html: string) {
      const domain = process.env.VITE_PLAUSIBLE_DOMAIN ?? ''
      return html.replace('{{VITE_PLAUSIBLE_DOMAIN}}', domain)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), plausibleDomainPlugin()],
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
