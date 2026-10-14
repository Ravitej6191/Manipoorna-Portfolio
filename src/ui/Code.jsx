import { useEffect, useState } from 'react'
import { PROFILE } from '../data/profile.js'
import { SheetHead } from './Chrome.jsx'

// The username comes from the GitHub URL in src/data/profile.js. With none set, the section still shows the
// workflow drawing, and says where to add the link. With one, it lists the real public repositories.
const USER = (PROFILE.github.match(/github\.com\/([^/?#]+)/i) || [])[1] || ''

function useRepos(user) {
  const [state, setState] = useState({ status: user ? 'loading' : 'none', repos: [] })
  useEffect(() => {
    if (!user) return
    const key = 'bp:repos:' + user
    try {
      const hit = JSON.parse(sessionStorage.getItem(key))
      if (hit) return setState({ status: 'ready', repos: hit })
    } catch {
      /* no cache */
    }
    const ctl = new AbortController()
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((all) => {
        const repos = all
          .filter((r) => !r.fork && !r.archived)
          .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
          .map((r) => ({ name: r.name, url: r.html_url, text: r.description, lang: r.language, stars: r.stargazers_count, forks: r.forks_count, pushed: r.pushed_at }))
        try {
          sessionStorage.setItem(key, JSON.stringify(repos))
        } catch {
          /* storage blocked */
        }
        setState({ status: 'ready', repos })
      })
      .catch((e) => e?.name !== 'AbortError' && setState({ status: 'error', repos: [] }))
    return () => ctl.abort()
  }, [user])
  return state
}

const ago = (iso) => {
  const days = Math.round((Date.now() - new Date(iso)) / 864e5)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (days < 30) return rtf.format(-days, 'day')
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month')
  return rtf.format(-Math.round(days / 365), 'year')
}

// How a change travels to main, drawn as a git graph. Illustrative: it is not this account's history.
function GitGraph() {
  const main = [30, 110, 230, 350, 470, 570]
  return (
    <figure className="gitgraph reveal">
      <svg viewBox="0 0 600 214" role="img" aria-label="A git graph: two feature branches leave main, go through review, and merge back">
        <path className="gitgraph__line draw" pathLength="1" d="M18 50H582" />
        <path className="gitgraph__line gitgraph__line--a draw" pathLength="1" d="M110 50C140 50 140 112 172 112H268C300 112 318 50 350 50" />
        <path className="gitgraph__line gitgraph__line--b draw" pathLength="1" d="M350 50C382 50 382 174 414 174H508C540 174 556 50 570 50" />
        {main.map((x, i) => (
          <circle key={x} className="gitgraph__dot" cx={x} cy="50" r="6" style={{ '--i': i }} />
        ))}
        {[190, 250].map((x, i) => (
          <circle key={x} className="gitgraph__dot gitgraph__dot--a" cx={x} cy="112" r="6" style={{ '--i': i + 6 }} />
        ))}
        {[434, 488].map((x, i) => (
          <circle key={x} className="gitgraph__dot gitgraph__dot--b" cx={x} cy="174" r="6" style={{ '--i': i + 8 }} />
        ))}
        <text x="18" y="30">main</text>
        <text x="172" y="140">feature branch</text>
        <text x="414" y="202">pull request · review · CI</text>
        <text x="582" y="30" textAnchor="end">merge</text>
      </svg>
      <figcaption>FIG. 02 — HOW A CHANGE REACHES MAIN (ILLUSTRATIVE)</figcaption>
    </figure>
  )
}

export default function Code() {
  const { status, repos } = useRepos(USER)
  const stars = repos.reduce((n, r) => n + r.stars, 0)
  const langs = Object.entries(repos.reduce((m, r) => (r.lang ? { ...m, [r.lang]: (m[r.lang] || 0) + 1 } : m), {})).sort((a, b) => b[1] - a[1])
  const shown = repos.slice(0, 6)

  return (
    <section id="code" className="sheet code" aria-label="Code and GitHub">
      <SheetHead n="04" title="Code" note="Small, reviewed changes that reach main through CI." />
      <div className="code__grid">
        <div className="code__left">
          <GitGraph />
          <p className="code__text reveal">
            I work in Agile teams, in a continuous-integration flow: a branch for each change, a review, and checks before anything merges.
          </p>
          {PROFILE.github && (
            <a className="btn btn--solid reveal" href={PROFILE.github} target="_blank" rel="noreferrer">
              View GitHub <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        <div className="code__right">
          {status === 'ready' && shown.length > 0 && (
            <>
              <dl className="code__stats pop">
                <div>
                  <dt>Public repos</dt>
                  <dd>{repos.length}</dd>
                </div>
                <div>
                  <dt>Stars</dt>
                  <dd>{stars}</dd>
                </div>
                {langs[0] && (
                  <div>
                    <dt>Most used</dt>
                    <dd>{langs[0][0]}</dd>
                  </div>
                )}
              </dl>
              <ul className="repos">
                {shown.map((r) => (
                  <li key={r.name} className="pop" style={{ "--n": shown.indexOf(r) }}>
                    <a className="repo" href={r.url} target="_blank" rel="noreferrer">
                      <b>{r.name}</b>
                      <p>{r.text || 'No description yet.'}</p>
                      <span>
                        {r.lang && <em>{r.lang}</em>}
                        <em>★ {r.stars}</em>
                        <em>Updated {ago(r.pushed)}</em>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {status === 'loading' && <p className="code__note">Loading repositories…</p>}
          {status === 'error' && <p className="code__note">Could not load repositories right now. They are all at {PROFILE.github}.</p>}
          {status === 'ready' && shown.length === 0 && <p className="code__note">No public repositories yet.</p>}
          {status === 'none' && (
            <div className="code__empty pop">
              <b>Repositories appear here.</b>
              <p>Add your GitHub URL as <code>github</code> in <code>src/data/profile.js</code> and the latest public repositories, stars and top language load in automatically.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
