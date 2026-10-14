import { useSyncExternalStore } from 'react'

// Hash routing keeps deep links working on any static host. `#/work/<id>` opens a project's drawing.
// Entries the app creates carry `history.state.ns`, so closing one goes back instead of stacking history.
const subscribe = (cb) => {
  window.addEventListener('hashchange', cb)
  window.addEventListener('popstate', cb)
  return () => {
    window.removeEventListener('hashchange', cb)
    window.removeEventListener('popstate', cb)
  }
}
export const useHash = () => useSyncExternalStore(subscribe, () => window.location.hash, () => '')

export const parseWork = (hash) => {
  const m = /^#\/work\/([\w-]+)/.exec(hash || '')
  return m ? m[1] : null
}

const notify = () => window.dispatchEvent(new Event('hashchange'))

export function openWork(id, { replace = false } = {}) {
  const url = `${window.location.pathname}${window.location.search}#/work/${id}`
  if (replace) window.history.replaceState(window.history.state || { ns: true }, '', url)
  else window.history.pushState({ ns: true }, '', url)
  notify()
}

export function closeWork() {
  if (window.history.state && window.history.state.ns) window.history.back()
  else {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    notify()
  }
}

// Keeps a real href (new tab, copy link) but routes plain clicks through the app.
export const workLinkProps = (id) => ({
  href: `#/work/${id}`,
  onClick: (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    openWork(id)
  },
})
