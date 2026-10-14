import { AI as DATA } from '../data/ai.js'
import { LOGOS } from '../data/logos.js'
import { SheetHead } from './Chrome.jsx'

// A line icon for each way AI is used, drawn in the same pen as the rest of the site.
const ICON = {
  review: 'M10 10h28v28H10z M16 19h16 M16 25h10 M28 34l4 4 9-10',
  bug: 'M17 22a7 7 0 0 1 14 0v7a7 7 0 0 1-14 0z M24 15v21 M17 24h14 M12 18l5 3 M36 18l-5 3 M12 34l5-3 M36 34l-5-3 M20 14l-3-4 M28 14l3-4',
  tools: 'M7 10h34v28H7z M7 18h34 M14 25l6 5-6 5 M25 35h10',
  learn: 'M7 12h14c2 0 4 2 4 4v24c0-2-2-4-4-4H7z M41 12H27c-2 0-4 2-4 4v24c0-2 2-4 4-4h14z',
}

// An SVG dropped in src/assets/logos/<slug>.svg is picked up automatically (for tools missing from the open icon set)
const FILES = import.meta.glob('../assets/logos/*.svg', { eager: true, query: '?url', import: 'default' })

// The tool's own logo on a light tile (so dark logos still show on the Blueprint look); a letter if there is none.
function Logo({ slug, name }) {
  const mark = LOGOS[slug]
  const file = FILES[`../assets/logos/${slug}.svg`]
  return (
    <i className="ai__logo" aria-hidden="true">
      {mark ? (
        <svg viewBox="0 0 24 24">
          <path d={mark.path} fill={mark.hex} />
        </svg>
      ) : file ? (
        <img src={file} alt="" />
      ) : (
        <b>{name[0]}</b>
      )}
    </i>
  )
}

export default function AI() {
  return (
    <section id="ai" className="sheet ai" aria-label="AI in my workflow">
      <SheetHead id="ai" title="AI" note="How I work with it, and the tools I reach for." />
      <p className="ai__intro reveal">{DATA.intro}</p>

      <div className="ai__grid">
        {DATA.uses.map((u) => (
          <article className="ai__card reveal" key={u.title}>
            <svg viewBox="0 0 48 48" className="ai__icon" aria-hidden="true">
              <path className="draw" pathLength="1" d={ICON[u.icon]} />
            </svg>
            <h3>{u.title}</h3>
            <p>{u.text}</p>
            <ul className="chips" aria-label={`Tools for ${u.title.toLowerCase()}`}>
              {u.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <h3 className="ai__sub reveal">The toolbox</h3>
      <div className="ai__tools reveal">
        {DATA.tools.map((g) => (
          <div key={g.group}>
            <p>{g.group}</p>
            <ul>
              {g.items.map((t) => (
                <li key={t.name}>
                  <Logo slug={t.logo} name={t.name} />
                  {t.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="ai__note reveal">Logos belong to their owners and are shown only to name the tools I use.</p>
    </section>
  )
}
