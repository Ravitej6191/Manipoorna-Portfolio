import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// VITE_SITE_URL is the final address (https://yourname.com). It fills the canonical link, share images and
// structured data. With none set there is nothing valid to put in the canonical and og:url tags, so they are left out.
const siteUrl = (mode) => (loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL || '').replace(/\/$/, '')

const fillSiteUrl = (mode) => ({
  name: 'site-url',
  transformIndexHtml(html) {
    const url = siteUrl(mode)
    if (!url) html = html.replace(/ *<link rel="canonical"[^>]*>\r?\n/, '').replace(/ *<meta property="og:url"[^>]*>\r?\n/, '')
    return html.replaceAll('%SITE_URL%', url)
  },
})

// After the build: a real HTML page for every project (so each has its own title, description and share image
// even without JavaScript), a 404 page, a sitemap, and robots.txt pointing at it.
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const setMeta = (html, attr, name, value) => html.replace(new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`), `$1${escAttr(value)}$2`)

const prerender = (mode) => ({
  name: 'prerender-projects',
  apply: 'build',
  async closeBundle() {
    const dist = 'dist'
    if (!existsSync(`${dist}/index.html`)) return
    const site = siteUrl(mode)
    const shell = readFileSync(`${dist}/index.html`, 'utf8')
    const { PROJECTS } = await import(pathToFileURL(`${process.cwd()}/src/data/projects.js`).href)

    for (const p of PROJECTS) {
      let html = shell
      const title = `${p.name} — ${p.role} · Mani Poorna`
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${escAttr(title)}</title>`)
      html = setMeta(html, 'name', 'description', p.blurb)
      html = setMeta(html, 'property', 'og:title', title)
      html = setMeta(html, 'property', 'og:description', p.blurb)
      html = setMeta(html, 'name', 'twitter:title', title)
      html = setMeta(html, 'name', 'twitter:description', p.blurb)
      const image = existsSync(`public/og-${p.id}.png`) ? `og-${p.id}.png` : 'og.png'
      html = html.replaceAll(`${site}/og.png`, `${site}/${image}`)
      if (site) {
        html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${site}/work/${p.id}/$2`)
        html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${site}/work/${p.id}/$2`)
      }
      mkdirSync(`${dist}/work/${p.id}`, { recursive: true })
      writeFileSync(`${dist}/work/${p.id}/index.html`, html)
    }

    // the 404 page: hosts serve it for unknown addresses, and the app draws the terminal 404 from the path
    let nf = shell.replace(/<title>[^<]*<\/title>/, '<title>Page not found · Mani Poorna</title>')
    nf = nf.replace(/ *<link rel="canonical"[^>]*>\r?\n/, '').replace(/ *<meta property="og:url"[^>]*>\r?\n/, '')
    nf = nf.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>')
    writeFileSync(`${dist}/404.html`, nf)

    // sitemap and robots only make sense with a final address
    const robots = `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`
    writeFileSync(`${dist}/robots.txt`, robots)
    if (site) {
      const urls = ['/', ...PROJECTS.map((p) => `/work/${p.id}/`)]
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site}${u}</loc></url>`).join('\n')}\n</urlset>\n`
      writeFileSync(`${dist}/sitemap.xml`, xml)
    }
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [react(), fillSiteUrl(mode), prerender(mode)],
  server: { port: 5175 },
  // true when a portrait has been dropped at public/profile.jpg (restart the dev server after adding it)
  define: { __HAS_PHOTO__: JSON.stringify(existsSync('public/profile.jpg')) },
}))
