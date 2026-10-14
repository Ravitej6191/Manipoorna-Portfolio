// Renders the 1200x630 share image (public/og.png): a title-block style card.
// Usage: node scripts/make-og.mjs   (re-run after changing the name or role)
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

const SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
const MONO = "Consolas, 'Courier New', monospace"
const INK = '#13233b'
const BLUE = '#1d4fd7'
const RED = '#d4442a'

const minor = Array.from({ length: 51 }, (_, i) => `<line x1="${i * 24}" y1="0" x2="${i * 24}" y2="630" stroke="${BLUE}" stroke-opacity="0.07"/>`).join('')
const minorH = Array.from({ length: 27 }, (_, i) => `<line x1="0" y1="${i * 24}" x2="1200" y2="${i * 24}" stroke="${BLUE}" stroke-opacity="0.07"/>`).join('')
const major = Array.from({ length: 11 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="630" stroke="${BLUE}" stroke-opacity="0.13"/>`).join('')
const majorH = Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 120}" x2="1200" y2="${i * 120}" stroke="${BLUE}" stroke-opacity="0.13"/>`).join('')

const cell = (x, y, w, label, value) => `
  <rect x="${x}" y="${y}" width="${w}" height="62" fill="#fbfaf5" stroke="${INK}" stroke-width="1.5"/>
  <text x="${x + 14}" y="${y + 22}" font-family="${MONO}" font-size="12" letter-spacing="3" fill="${INK}" fill-opacity="0.6">${label}</text>
  <text x="${x + 14}" y="${y + 47}" font-family="${MONO}" font-size="19" fill="${INK}">${value}</text>`

// a small isometric stack, echoing the work sheet
const iso = [0, 1, 2, 3].map((i) => {
  const cx = 930, y = 170 + i * 66, hw = 128, hh = 38
  return `<path d="M${cx} ${y - hh} L${cx + hw} ${y} L${cx} ${y + hh} L${cx - hw} ${y} Z" fill="${BLUE}" fill-opacity="0.09" stroke="${INK}" stroke-width="2"/>
  <line x1="${cx + hw}" y1="${y}" x2="${cx + hw + 36}" y2="${y}" stroke="${INK}" stroke-opacity="0.5"/>
  <circle cx="${cx + hw + 50}" cy="${y}" r="13" fill="#fbfaf5" stroke="${RED}" stroke-width="1.6"/>
  <text x="${cx + hw + 50}" y="${y + 5}" text-anchor="middle" font-family="${MONO}" font-size="14" fill="${RED}">${i + 1}</text>`
}).join('')

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f3f0e8"/>
  ${minor}${minorH}${major}${majorH}
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${INK}" stroke-width="2.5"/>
  ${iso}
  <text x="72" y="96" font-family="${MONO}" font-size="16" letter-spacing="6" fill="${INK}" fill-opacity="0.7">FULL-STACK DEVELOPMENT · BENGALURU</text>
  <text x="68" y="262" font-family="${SANS}" font-size="132" font-weight="300" letter-spacing="-4" fill="${INK}">Mani</text>
  <text x="68" y="382" font-family="${SANS}" font-size="132" font-weight="300" letter-spacing="-4" fill="${BLUE}">Poorna</text>
  <line x1="72" y1="418" x2="560" y2="418" stroke="${INK}" stroke-opacity="0.5"/>
  <line x1="72" y1="410" x2="72" y2="426" stroke="${INK}" stroke-opacity="0.5"/>
  <line x1="560" y1="410" x2="560" y2="426" stroke="${INK}" stroke-opacity="0.5"/>
  <text x="72" y="452" font-family="${MONO}" font-size="17" letter-spacing="4" fill="${INK}" fill-opacity="0.75">REACT · SPRING BOOT · POSTGRESQL</text>
  ${cell(72, 500, 250, 'NAME', 'Mani Poorna')}
  ${cell(322, 500, 220, 'ROLE', 'Full Stack Dev')}
  ${cell(542, 500, 200, 'LOCATION', 'Bengaluru')}
  ${cell(742, 500, 130, 'EXP.', '2 years')}
</svg>`

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
writeFileSync(new URL('../public/og.png', import.meta.url), png)
console.log('public/og.png written,', Math.round(png.length / 1024) + ' KB')
