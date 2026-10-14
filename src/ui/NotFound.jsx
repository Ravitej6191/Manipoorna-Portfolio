import { useEffect } from 'react'
import { PROJECTS } from '../data/projects.js'
import { workLinkProps, goHome } from '../route.js'

// The 404, as a terminal: the request fails, and the way back is a few commands away.
export default function NotFound() {
  const path = window.location.pathname
  useEffect(() => {
    document.title = 'Page not found · Mani Poorna'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])
  return (
    <main className="nf" id="main">
      <div className="term nf__term">
        <div className="term__bar" aria-hidden="true">
          <i /> <i /> <i />
          <span>portfolio — zsh</span>
        </div>
        <div className="nf__body">
          <p>
            <span className="nf__ps">$</span> git checkout <b>{path}</b>
          </p>
          <p className="nf__err">error: pathspec '{path}' did not match any page known to this portfolio</p>
          <p>
            <span className="nf__ps">$</span> ls
          </p>
          <ul>
            <li>
              <a href={import.meta.env.BASE_URL} onClick={(e) => (e.preventDefault(), goHome())}>
                home/
              </a>
            </li>
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <a {...workLinkProps(p.id)}>work/{p.id}/</a>
              </li>
            ))}
          </ul>
          <p>
            <span className="nf__ps">$</span> <span className="nf__caret" aria-hidden="true" />
          </p>
        </div>
      </div>
      <h1 className="nf__h">404 · Page not found</h1>
      <a className="btn btn--solid" href={import.meta.env.BASE_URL} onClick={(e) => (e.preventDefault(), goHome())}>
        Back to the portfolio <span aria-hidden="true">→</span>
      </a>
    </main>
  )
}
