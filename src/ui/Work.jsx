import { useState } from 'react'
import { PROJECTS, accentStyle } from '../data/projects.js'
import { workLinkProps } from '../route.js'
import { SheetHead } from './Chrome.jsx'
import ProjectArt from './Art.jsx'

export function Legend({ layers, hover = null, setHover = () => {} }) {
  return (
    <ol className="legend">
      {layers.map(([name, text], i) => (
        <li key={name} className={hover === i ? 'is-hot' : ''} tabIndex={0} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
          <i>{i + 1}</i>
          <div>
            <b>{name}</b>
            <span>{text}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Spec({ rows }) {
  return (
    <dl className="spec">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Drawing({ p, flip }) {
  const [hover, setHover] = useState(null)
  return (
    <article className={'drawing' + (flip ? ' drawing--flip' : '')} style={accentStyle(p)}>
      <ProjectArt project={p} hover={hover} setHover={setHover} />
      <div className="drawing__body reveal">
        <p className="drawing__no">
          {p.dwg} <span>/ {p.role}</span>{p.sample && <em className="sample">Sample</em>}
        </p>
        <h3 className="drawing__name">{p.name}</h3>
        <p className="drawing__blurb">{p.blurb}</p>
        <Spec rows={p.meta} />
        <Legend layers={p.layers} hover={hover} setHover={setHover} />
        <ul className="chips" aria-label="Stack">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="drawing__cta">
          <a className="btn btn--solid" {...workLinkProps(p.id)}>
            View case study <span aria-hidden="true">→</span>
          </a>
          {p.links && p.links.live && (
            <a className="btn" href={p.links.live} target="_blank" rel="noreferrer">
              Live demo <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  return (
    <section id="work" className="sheet work" aria-label="Projects">
      <SheetHead n="03" title="Projects" note="Selected projects. Hover a layer, or its entry in the list, to match them up." />
      {PROJECTS.map((p, i) => (
        <Drawing key={p.id} p={p} flip={i % 2 === 1} />
      ))}
    </section>
  )
}
