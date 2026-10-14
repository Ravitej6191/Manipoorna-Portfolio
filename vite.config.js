import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Fills %SITE_URL% in index.html (canonical link, share image, structured data) from VITE_SITE_URL.
const siteUrl = (mode) => (loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL || '').replace(/\/$/, '')

export default defineConfig(({ mode }) => ({
  plugins: [react(), { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl(mode)) }],
  server: { port: 5175 },
}))
