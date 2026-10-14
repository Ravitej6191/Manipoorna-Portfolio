import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Fills %SITE_URL% in index.html (canonical link, share image, structured data) from VITE_SITE_URL.
// With no site URL set there is nothing valid to put in the canonical and og:url tags, so they are left out.
const siteUrl = (mode) => (loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL || '').replace(/\/$/, '')

const fillSiteUrl = (mode) => ({
  name: 'site-url',
  transformIndexHtml(html) {
    const url = siteUrl(mode)
    if (!url) html = html.replace(/ *<link rel="canonical"[^>]*>\r?\n/, '').replace(/ *<meta property="og:url"[^>]*>\r?\n/, '')
    return html.replaceAll('%SITE_URL%', url)
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [react(), fillSiteUrl(mode)],
  server: { port: 5175 },
}))
