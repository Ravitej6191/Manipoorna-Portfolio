import { useEffect, useState } from 'react'
import { PROFILE } from '../data/profile.js'
import { SheetHead } from './Chrome.jsx'

// The username comes from the GitHub URL in src/data/profile.js. With none set, the section still shows the
// workflow drawing and says where to add the link. With one, it draws the real activity: a year of
// contributions as a heatmap, a language bar, a `git log` of the latest commits, and the repositories.
const USER = (PROFILE.github.match(/github\.com\/([^/?#]+)/i) || [])[1] || ''

const getJson = (url, signal) => fetch(url, { signal }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))

// One request for the repositories, three for the latest commits, and a public heatmap feed. Each panel appears
// as soon as its data arrives, and a panel whose request fails is simply left out. Cached for the session.
function useGithub(user) {
  const [s, setS] = useState({ status: user ? 'loading' : 'none', repos: null, log: null, cal: null })
  useEffect(() => {
    if (!user) return
    const key = 'bp:gh3:' + user
    try {
      const hit = JSON.parse(sessionStorage.getItem(key))
      if (hit) return setS({ status: 'ready', ...hit })
    } catch {
      /* no cache */
    }
    const ctl = new AbortController()
    const part = {}
    const patch = (p) => {
      Object.assign(part, p)
      setS((o) => ({ ...o, status: 'ready', ...p }))
    }

    const reposP = getJson(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, ctl.signal).then(async (all) => {
      const repos = all
        .filter((r) => !r.fork && !r.archived)
        .map((r) => ({ name: r.name, url: r.html_url, lang: r.language, stars: r.stargazers_count, pushed: r.pushed_at }))
        .sort((a, b) => new Date(b.pushed) - new Date(a.pushed))
      patch({ repos })
      const lists = await Promise.allSettled(
        repos.slice(0, 3).map((r) => getJson(`https://api.github.com/repos/${user}/${r.name}/commits?per_page=4`, ctl.signal).then((cs) => cs.map((c) => ({ repo: r.name, sha: c.sha.slice(0, 7), msg: c.commit.message.split('\n')[0], at: c.commit.author.date })))),
      )
      const log = lists.flatMap((l) => (l.status === 'fulfilled' ? l.value : [])).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6)
      patch({ log })
    })
    // the last twelve months; if those are empty, the most recent calendar year that has any activity
    const calP = getJson(`https://github-contributions-api.jogruber.de/v4/${user}?y=all`, ctl.signal).then((d) => {
      const all = (d.contributions || []).map((c) => ({ date: c.date, n: c.count, lv: c.level }))
      const sum = (l) => l.reduce((n, c) => n + c.n, 0)
      const since = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10)
      let days = all.filter((c) => c.date >= since)
      let label = 'in the last year'
      if (!sum(days)) {
        const years = [...new Set(all.map((c) => c.date.slice(0, 4)))].reverse()
        const year = years.find((y) => sum(all.filter((c) => c.date.startsWith(y))) > 0)
        days = year ? all.filter((c) => c.date.startsWith(year)) : []
        label = 'in ' + year
      }
      patch({ cal: days.length && sum(days) ? { days, total: sum(days), label } : null })
    })

    Promise.allSettled([reposP, calP]).then(() => {
      if (ctl.signal.aborted) return
      setS((o) => ({ ...o, status: o.repos || o.cal ? 'ready' : 'error' }))
      try {
        sessionStorage.setItem(key, JSON.stringify({ repos: part.repos ?? null, log: part.log ?? null, cal: part.cal ?? null }))
      } catch {
        /* storage blocked */
      }
    })
    return () => ctl.abort()
  }, [user])
  return s
}

const ago = (iso) => {
  const days = Math.round((Date.now() - new Date(iso)) / 864e5)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (days < 30) return rtf.format(-days, 'day')
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month')
  return rtf.format(-Math.round(days / 365), 'year')
}

const LANG = { JavaScript: '#f1c40f', TypeScript: '#3b82f6', Java: '#e07a3f', HTML: '#e34c26', CSS: '#7c5cd6', Python: '#4b8bbe', SCSS: '#c6538c', Shell: '#4eaa25', Kotlin: '#a97bff' }
const langColor = (l) => LANG[l] || '#8a96b3'

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

// A year of contributions: one square a day, a column a week, drawn in column by column.
function Heatmap({ cal }) {
  const { days, total, label } = cal
  const pad = new Date(days[0].date + 'T00:00:00').getDay() // blank squares so the first column starts on a Sunday
  const cells = [...Array(pad).fill(null), ...days]
  const cols = Math.ceil(cells.length / 7)
  const W = cols * 14
  const months = []
  days.forEach((d, i) => {
    const m = d.date.slice(5, 7)
    const col = Math.floor((i + pad) / 7)
    if (!months.length || months[months.length - 1].m !== m) months.push({ m, col })
  })
  const name = (m) => new Date(2000, Number(m) - 1, 1).toLocaleString('en', { month: 'short' }).toUpperCase()
  return (
    <figure className="hm pop">
      <figcaption>
        <b>{total.toLocaleString()}</b> contribution{total === 1 ? "" : "s"} {label}
      </figcaption>
      <svg viewBox={`0 0 ${W} 120`} role="img" aria-label={`${total} contributions ${label}, drawn as a calendar heatmap`}>
        {months.slice(1).map(({ m, col }) => (
          <text key={m + col} x={col * 14} y="9">{name(m)}</text>
        ))}
        {cells.map((c, i) =>
          c ? (
            <rect key={i} className={`hm__c hm__c--${c.lv}`} x={Math.floor(i / 7) * 14} y={18 + (i % 7) * 14} width="11" height="11" style={{ '--c': Math.floor(i / 7) }}>
              <title>{`${c.n} contribution${c.n === 1 ? '' : 's'} on ${c.date}`}</title>
            </rect>
          ) : null,
        )}
      </svg>
      <div className="hm__key" aria-hidden="true">
        <span>LESS</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} className={`hm__c hm__c--${l}`} />
        ))}
        <span>MORE</span>
      </div>
    </figure>
  )
}

function Languages({ repos }) {
  const count = {}
  repos.forEach((r) => r.lang && (count[r.lang] = (count[r.lang] || 0) + 1))
  const list = Object.entries(count).sort((a, b) => b[1] - a[1])
  const sum = list.reduce((n, [, c]) => n + c, 0)
  if (!sum) return null
  return (
    <div className="langs pop">
      <p>LANGUAGES, BY REPOSITORY</p>
      <div className="langs__bar" role="img" aria-label={list.map(([l, c]) => `${l} ${Math.round((c / sum) * 100)}%`).join(', ')}>
        {list.map(([l, c]) => (
          <i key={l} style={{ flexGrow: c, background: langColor(l) }} title={`${l}: ${c}`} />
        ))}
      </div>
      <ul>
        {list.map(([l, c]) => (
          <li key={l}>
            <i style={{ background: langColor(l) }} />
            {l} <span>{Math.round((c / sum) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// The latest commits across the most recently pushed repositories, in a terminal.
function GitLog({ log }) {
  return (
    <figure className="term pop" aria-label="Latest commits">
      <div className="term__bar" aria-hidden="true">
        <i /> <i /> <i />
        <span>git log --oneline</span>
      </div>
      <ol>
        {log.map((c, i) => (
          <li key={c.sha + c.repo} style={{ '--n': i }}>
            <code>{c.sha}</code>
            <span>{c.msg}</span>
            <em>{c.repo} · {ago(c.at)}</em>
          </li>
        ))}
      </ol>
    </figure>
  )
}

export default function Code() {
  const { status, repos, log, cal } = useGithub(USER)

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
          {status === 'loading' && <p className="code__note">Loading GitHub activity…</p>}
          {status === 'error' && <p className="code__note">Could not load GitHub activity right now. It is all at {PROFILE.github}.</p>}
          {status === 'ready' && (
            <>
              {cal && <Heatmap cal={cal} />}
              {repos && <Languages repos={repos} />}
              {log && log.length > 0 && <GitLog log={log} />}
              {repos && repos.length > 0 && (
                <ul className="rchips pop" aria-label="Repositories">
                  {repos.slice(0, 10).map((r) => (
                    <li key={r.name}>
                      <a href={r.url} target="_blank" rel="noreferrer">
                        <i style={{ background: langColor(r.lang) }} />
                        {r.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {status === 'none' && (
            <div className="code__empty pop">
              <b>GitHub activity appears here.</b>
              <p>
                Add your GitHub URL as <code>github</code> in <code>src/data/profile.js</code> and your contribution heatmap, languages, latest commits and repositories load in automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
