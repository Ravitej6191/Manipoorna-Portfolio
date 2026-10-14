// A quick check that the build and the content are sound. Run it after `npm run build` (npm test does).
// No dependencies: it reads dist/ and the data files, and exits with an error if anything is off.
import { existsSync, readFileSync } from 'node:fs'

const failures = []
const check = (ok, message) => ok || failures.push(message)

const { PROJECTS } = await import(new URL('../src/data/projects.js', import.meta.url))
const { TESTIMONIALS } = await import(new URL('../src/data/proof.js', import.meta.url))
const { ABOUT, EXPERIENCE, SKILLS } = await import(new URL('../src/data/about.js', import.meta.url))
const art = readFileSync(new URL('../src/ui/Art.jsx', import.meta.url), 'utf8')

// content
const ids = PROJECTS.map((p) => p.id)
check(new Set(ids).size === ids.length, 'project ids are not unique')
for (const p of PROJECTS) {
  const where = `project ${p.id}`
  check(/^[\w-]+$/.test(p.id), `${where}: id must be letters, numbers and dashes`)
  check(p.layers.length >= 3 && p.layers.length <= 4, `${where}: needs 3 or 4 layers (the drawing has that many balloons)`)
  check(art.includes(`'${p.id}':`), `${where}: no drawing registered in src/ui/Art.jsx`)
  check(Array.isArray(p.accent) && p.accent.length === 2, `${where}: accent needs [paper, blueprint] colours`)
  check(p.outcomes.length === 3, `${where}: needs three outcomes`)
  for (const [i, s] of (p.flow || []).entries()) {
    check(['start', 'step', 'check', 'end'].includes(s.kind), `${where}: flow step ${i + 1} has an unknown kind`)
    check(!s.back || (s.back >= 1 && s.back <= i), `${where}: flow step ${i + 1} loops back to a step that does not exist`)
  }
  const text = JSON.stringify(p).toLowerCase()
  check(!/to be added|lorem|todo|sample/.test(text), `${where}: still has placeholder wording`)
}
for (const t of TESTIMONIALS) check(t.name && t.role && t.quote, `testimonial from ${t.name || '?'} is incomplete`)
check(ABOUT.summary.length > 40 && EXPERIENCE.length > 0 && SKILLS.length > 0, 'about, experience or skills data is empty')

// the build
const dist = new URL('../dist/', import.meta.url)
const read = (f) => (existsSync(new URL(f, dist)) ? readFileSync(new URL(f, dist), 'utf8') : null)
const home = read('index.html')
check(home && /<title>[^<]+<\/title>/.test(home), 'dist/index.html is missing or has no title')
for (const p of PROJECTS) {
  const page = read(`work/${p.id}/index.html`)
  check(page && page.includes(p.name.replace(/&/g, '&amp;')), `dist/work/${p.id}/index.html is missing or has the wrong title`)
  check(existsSync(new URL(`og-${p.id}.png`, dist)), `dist/og-${p.id}.png is missing (run node scripts/make-og.mjs)`)
}
const nf = read('404.html')
check(nf && nf.includes('noindex'), 'dist/404.html is missing or is not marked noindex')
check(existsSync(new URL('og.png', dist)), 'dist/og.png is missing')

if (failures.length) {
  console.error('Smoke test failed:\n' + failures.map((f) => ' - ' + f).join('\n'))
  process.exit(1)
}
console.log(`Smoke test passed: ${PROJECTS.length} projects, ${TESTIMONIALS.length} testimonials, build output and share images present.`)
