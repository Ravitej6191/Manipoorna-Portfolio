// Renders the 1200x630 share images: public/og.png for the site and public/og-<project>.png for each project page.
// Usage: node scripts/make-og.mjs   (re-run after changing the name, role or projects)
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

const { PROJECTS } = await import(new URL('../src/data/projects.js', import.meta.url))

const SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
const MONO = "Consolas, 'Courier New', monospace"
const INK = '#13233b'
const BLUE = '#1d4fd7'
const RED = '#c13a21'
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const grid = [
  ...Array.from({ length: 51 }, (_, i) => `<line x1="${i * 24}" y1="0" x2="${i * 24}" y2="630" stroke="${BLUE}" stroke-opacity="0.07"/>`),
  ...Array.from({ length: 27 }, (_, i) => `<line x1="0" y1="${i * 24}" x2="1200" y2="${i * 24}" stroke="${BLUE}" stroke-opacity="0.07"/>`),
  ...Array.from({ length: 11 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="630" stroke="${BLUE}" stroke-opacity="0.13"/>`),
  ...Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 120}" x2="1200" y2="${i * 120}" stroke="${BLUE}" stroke-opacity="0.13"/>`),
].join('')

const cell = (x, y, w, label, value) => `
  <rect x="${x}" y="${y}" width="${w}" height="62" fill="#fbfaf5" stroke="${INK}" stroke-width="1.5"/>
  <text x="${x + 14}" y="${y + 22}" font-family="${MONO}" font-size="12" letter-spacing="3" fill="${INK}" fill-opacity="0.65">${label}</text>
  <text x="${x + 14}" y="${y + 47}" font-family="${MONO}" font-size="19" fill="${INK}">${esc(value)}</text>`

// the developer's desk from the cover, simplified, on the right of the card
const desk = `
  <g transform="translate(676 120)" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M170 50H390V220H170Z" fill="#fbfaf5"/>
    <rect x="182" y="62" width="196" height="146" fill="${BLUE}" fill-opacity="0.08" stroke-width="1.6"/>
    <path d="M182 78H378M214 78V196" stroke-width="1.4" stroke-opacity="0.6"/>
    <path d="M224 94h22M252 94h50M264 108h44M240 122h76M268 136h50M232 150h40M278 150h20" stroke="${BLUE}" stroke-width="4"/>
    <path d="M232 108h26M240 136h22" stroke="${RED}" stroke-width="4"/>
    <path d="M270 220V280M290 220V280M240 288V280H320V288Z"/>
    <rect x="218" y="290" width="124" height="10" fill="#fbfaf5"/>
    <path d="M8 300H512V314H8Z" fill="#fbfaf5"/>
    <path d="M40 314V382M480 314V382" />
    <path d="M90 236H170V282H90Z M80 282H180L174 300H86Z" fill="#fbfaf5"/>
    <path d="M26 300l4-30h24l4 30z M42 270c-14-10-16-30-10-44 8 8 12 26 10 44zM42 270c-2-22 4-40 14-50 4 18 0 36-14 50z" fill="${BLUE}" fill-opacity="0.12"/>
    <path d="M398 270h28v30h-28zM426 278h6a6 6 0 0 1 0 14h-6" fill="#fbfaf5"/>
    <path d="M470 300v-8h36v8zM488 292V150Q488 110 446 110" /><path d="M426 110h40l10 24h-60z" fill="#fbfaf5"/>
  </g>`

function card({ kicker, lines, sub, cells }) {
  const longest = Math.max(...lines.map((l) => l.length))
  const size = Math.max(72, Math.min(132, Math.floor(600 / (longest * 0.6))))
  const y0 = 232 - (lines.length - 1) * 4
  const title = lines
    .map((l, i) => `<text x="68" y="${y0 + i * (size * 0.94)}" font-family="${SANS}" font-size="${size}" font-weight="300" letter-spacing="-3" fill="${i === lines.length - 1 && lines.length > 1 ? BLUE : INK}">${esc(l)}</text>`)
    .join('')
  const base = y0 + (lines.length - 1) * (size * 0.94)
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f3f0e8"/>
  ${grid}
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${INK}" stroke-width="2.5"/>
  ${desk}
  <text x="72" y="96" font-family="${MONO}" font-size="16" letter-spacing="5" fill="${INK}" fill-opacity="0.75">${esc(kicker)}</text>
  ${title}
  <line x1="72" y1="${base + 36}" x2="560" y2="${base + 36}" stroke="${INK}" stroke-opacity="0.5"/>
  <line x1="72" y1="${base + 28}" x2="72" y2="${base + 44}" stroke="${INK}" stroke-opacity="0.5"/>
  <line x1="560" y1="${base + 28}" x2="560" y2="${base + 44}" stroke="${INK}" stroke-opacity="0.5"/>
  <text x="72" y="${base + 74}" font-family="${MONO}" font-size="17" letter-spacing="3" fill="${INK}" fill-opacity="0.8">${esc(sub)}</text>
  ${cells}
</svg>`
}

// split a long title across two lines at the space nearest the middle
const split = (t) => {
  if (t.length <= 13 || !t.includes(' ')) return [t]
  const words = t.split(' ')
  let best = 1
  let gap = Infinity
  for (let i = 1; i < words.length; i++) {
    const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length)
    if (d < gap) [best, gap] = [i, d]
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

const write = async (name, svg) => {
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
  writeFileSync(new URL(`../public/${name}`, import.meta.url), png)
  console.log(`public/${name} written,`, Math.round(png.length / 1024) + ' KB')
}

await write(
  'og.png',
  card({
    kicker: 'FULL-STACK DEVELOPMENT · BENGALURU',
    lines: ['Mani', 'Poorna'],
    sub: 'REACT · SPRING BOOT · POSTGRESQL',
    cells: cell(72, 520, 250, 'NAME', 'Mani Poorna') + cell(322, 520, 220, 'ROLE', 'Full Stack Dev') + cell(542, 520, 200, 'LOCATION', 'Bengaluru'),
  }),
)

for (const [i, p] of PROJECTS.entries()) {
  await write(
    `og-${p.id}.png`,
    card({
      kicker: `PROJECT ${String(i + 1).padStart(2, '0')} · CASE STUDY`,
      lines: split(p.name),
      sub: p.role.toUpperCase().slice(0, 44),
      cells: cell(72, 520, 250, 'BY', 'Mani Poorna') + cell(322, 520, 120, 'PROJECT', `${i + 1} / ${PROJECTS.length}`) + cell(442, 520, 300, 'FOCUS', p.stack[0]),
    }),
  )
}
