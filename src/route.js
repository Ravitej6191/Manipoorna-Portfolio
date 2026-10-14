import { useSyncExternalStore } from 'react'

// Real paths, so each project can be shared and pre-rendered: `/` is the portfolio, `/work/<id>/` a project page,
// anything else is the 404. The build writes a static page for each project (see vite.config.js), and the dev
// server falls back to index.html, so every one of these works on a plain static host.
// Entries the app creates carry `history.state.ns`, so closing a project goes back instead of stacking history.
const BASE = import.meta.env.BASE_URL // '/' unless the site is served from a sub-folder

// the path inside the site, always starting with '/'
const inside = (pathname) => '/' + pathname.slice(BASE.length).replace(/^\/+/, '')

const subscribe = (cb) => {
  window.addEventListener('popstate', cb)
  window.addEventListener('app:route', cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener('app:route', cb)
  }
}
export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname, () => BASE)

// -> { kind: 'home' } | { kind: 'work', id } | { kind: 'missing' }
export const parseRoute = (pathname) => {
  const p = inside(pathname)
  if (p === '/' || p === '/index.html') return { kind: 'home' }
  const m = /^\/work\/([\w-]+)\/?$/.exec(p)
  return m ? { kind: 'work', id: m[1] } : { kind: 'missing' }
}

export const workPath = (id) => `${BASE}work/${id}/`

const notify = () => window.dispatchEvent(new Event('app:route'))

// links from the first version of the site used `#/work/<id>`; send them to the real path
export function upgradeOldLinks() {
  const m = /^#\/work\/([\w-]+)/.exec(window.location.hash || '')
  if (m) window.history.replaceState(null, '', workPath(m[1]))
}

export function openWork(id, { replace = false } = {}) {
  if (replace) window.history.replaceState(window.history.state, '', workPath(id)) // keeps whether this entry was made by the app
  else window.history.pushState({ ns: true }, '', workPath(id))
  notify()
}

export function closeWork() {
  if (window.history.state && window.history.state.ns) window.history.back()
  else {
    window.history.replaceState(null, '', BASE)
    notify()
  }
}

// Keeps a real href (new tab, copy link) but routes plain clicks through the app.
export const workLinkProps = (id) => ({
  href: workPath(id),
  onClick: (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    openWork(id)
  },
})

// back to the portfolio from the 404
export function goHome() {
  window.history.pushState({ ns: true }, '', BASE)
  notify()
}
