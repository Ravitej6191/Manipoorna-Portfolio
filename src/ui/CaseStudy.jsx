import { useEffect, useRef, useState } from 'react'
import { PROJECTS, accentStyle } from '../data/projects.js'
import { PROFILE } from '../data/profile.js'
import { openWork } from '../route.js'
import { Legend, Spec } from './Work.jsx'
import ProjectArt from './Art.jsx'
import Flow from './Flow.jsx'
import useReveal from './useReveal.js'

// One project as a full page: hero, a contents rail that follows the reader, the write-up,
// optional screenshots (`shots` on the project), and previous / next navigation.
export default function CaseStudy({ project, onClose, onContact }) {
  const root = useRef()
  const body = useRef()
  const bar = useRef()
  const [hover, setHover] = useState(null)
  const [active, setActive] = useState('overview')
  useReveal(body, root, [project.id])

  const at = PROJECTS.findIndex((p) => p.id === project.id)
  const next = PROJECTS[(at + 1) % PROJECTS.length]
  const prev = PROJECTS[(at - 1 + PROJECTS.length) % PROJECTS.length]
  const shots = project.shots || []
  const toc = [
    ['overview', 'Overview'],
    ['problem', 'The problem'],
    ['approach', 'Approach'],
    ['architecture', 'Architecture'],
    ...(project.flow ? [['flow', 'Flow']] : []),
    ...(shots.length ? [['screens', 'Screens']] : []),
    ['outcomes', 'Outcomes'],
  ]

  useEffect(() => {
    const el = root.current
    el.scrollTo(0, 0)
    const onKey = (e) => e.key === 'Escape' && onClose()
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight
      bar.current?.style.setProperty('--p', max > 0 ? Math.min(1, el.scrollTop / max).toFixed(4) : '0')
    }
    window.addEventListener('keydown', onKey)
    el.addEventListener('scroll', onScroll, { passive: true })
    el.focus({ preventScroll: true })
    onScroll()
    return () => {
      window.removeEventListener('keydown', onKey)
      el.removeEventListener('scroll', onScroll)
    }
  }, [project.id, onClose])

  // which section the reader is in, for the contents rail
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.sec)), {
      root: root.current,
      rootMargin: '-30% 0px -60% 0px',
    })
    body.current.querySelectorAll('[data-sec]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [project.id])

  const jump = (id) => {
    const el = body.current.querySelector(`[data-sec="${id}"]`)
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

  const hasLinks = project.links && (project.links.live || project.links.repo)

  return (
    <div className="cs" style={accentStyle(project)} ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${project.name} case study`}>
      <div className="cs__bar">
        <button className="cs__back" onClick={onClose}>
          <span aria-hidden="true">←</span> Back to portfolio
        </button>
        <span>{project.dwg}</span>
        <span className="cs__esc">Esc</span>
        <div className="cs__prog" ref={bar} aria-hidden="true" />
      </div>

      <div className="cs__body" ref={body}>
        <header className="cs__hero" data-sec="overview">
          <div>
            <p className="tag">
              {project.dwg} · Case study
            </p>
            <h1>{project.name}</h1>
            <p className="cs__role">{project.role}</p>
            <p className="cs__lede">{project.blurb}</p>
            <ul className="chips" aria-label="Stack">
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {hasLinks && (
              <div className="drawing__cta">
                {project.links.live && (
                  <a className="btn btn--solid" href={project.links.live} target="_blank" rel="noreferrer">
                    Live demo <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.links.repo && (
                  <a className="btn" href={project.links.repo} target="_blank" rel="noreferrer">
                    Source <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
          </div>
          <ProjectArt project={project} hover={hover} setHover={setHover} />
        </header>

        <div className="cs__layout">
          <nav className="cs__toc" aria-label="On this page">
            <p>On this page</p>
            <ol>
              {toc.map(([id, label], i) => (
                <li key={id}>
                  <button className={active === id ? 'is-on' : ''} onClick={() => jump(id)} aria-current={active === id ? 'true' : undefined}>
                    <i>{String(i + 1).padStart(2, '0')}</i>
                    {label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="cs__main">
            <Spec rows={project.meta} />

            <section className="cs__sec reveal" data-sec="problem">
              <h2>The problem</h2>
              <p className="cs__big">{project.challenge}</p>
            </section>

            <section className="cs__sec reveal" data-sec="approach">
              <h2>Approach</h2>
              <ol className="cs__approach">
                {project.approach.map((a, i) => (
                  <li key={i}>
                    <i>{String(i + 1).padStart(2, '0')}</i>
                    <p>{a}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="cs__sec reveal" data-sec="architecture">
              <h2>Architecture</h2>
              <Legend layers={project.layers} hover={hover} setHover={setHover} />
            </section>

            {project.flow && (
              <section className="cs__sec reveal" data-sec="flow">
                <h2>Flow</h2>
                <Flow steps={project.flow} />
              </section>
            )}

            {shots.length > 0 && (
              <section className="cs__sec reveal" data-sec="screens">
                <h2>Screens</h2>
                <div className="shots">
                  {shots.map((s, i) => (
                    <figure className="shot" key={s.src}>
                      <div className="shot__frame">
                        <span aria-hidden="true">
                          <i /> <i /> <i />
                        </span>
                        <img src={s.src} alt={s.alt || `${project.name} screen ${i + 1}`} loading="lazy" />
                      </div>
                      {s.caption && <figcaption>{s.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section className="cs__sec reveal" data-sec="outcomes">
              <h2>Outcomes</h2>
              <ul className="cs__out">
                {project.outcomes.map(([v, l]) => (
                  <li key={l}>
                    <b>{v}</b>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="cs__cta reveal">
          <p>Want something like this built?</p>
          <button className="btn btn--solid" onClick={onContact}>
            Get in touch <span aria-hidden="true">→</span>
          </button>
        </div>

        <nav className="cs__pn reveal" aria-label="More projects">
          <button onClick={() => openWork(prev.id, { replace: true })}>
            <span className="tag">← Previous</span>
            <b>{prev.name}</b>
            <em>{prev.role}</em>
          </button>
          <button onClick={() => openWork(next.id, { replace: true })}>
            <span className="tag">Next →</span>
            <b>{next.name}</b>
            <em>{next.role}</em>
          </button>
        </nav>
        <p className="cs__sig">
          {PROFILE.name} · {PROFILE.role}
        </p>
      </div>
    </div>
  )
}
