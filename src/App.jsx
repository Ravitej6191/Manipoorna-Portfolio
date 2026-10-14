import { useCallback, useEffect, useRef, useState } from 'react'
import { Header, BackToTop, goTo } from './ui/Chrome.jsx'
import Cover from './ui/Cover.jsx'
import Work from './ui/Work.jsx'
import Code from './ui/Code.jsx'
import AI from './ui/AI.jsx'
import { About, Experience, Skills, Notes, Testimonials, Contact } from './ui/Sheets.jsx'
import CaseStudy from './ui/CaseStudy.jsx'
import useReveal from './ui/useReveal.js'
import NotFound from './ui/NotFound.jsx'
import Palette, { Toast } from './ui/Palette.jsx'
import { usePath, parseRoute, closeWork } from './route.js'
import { findProject } from './data/projects.js'

export default function App() {
  const route = parseRoute(usePath())
  const project = route.kind === 'work' ? findProject(route.id) : null
  const missing = route.kind === 'missing' || (route.kind === 'work' && !project)
  const page = useRef()
  const base = useRef(document.title)
  const [theme, setTheme] = useState(() => {
    try {
      // a saved choice wins; otherwise the blueprint look at night or when the system prefers dark
      const hour = new Date().getHours()
      const night = hour >= 19 || hour < 6
      return localStorage.getItem('bp:theme') || (night || matchMedia('(prefers-color-scheme: dark)').matches ? 'blueprint' : 'paper')
    } catch {
      return 'paper'
    }
  })
  const toggleTheme = useCallback(() => {
    // for a moment every colour change eases instead of snapping
    const root = document.documentElement
    root.classList.add('theming')
    clearTimeout(window.__theming)
    window.__theming = setTimeout(() => root.classList.remove('theming'), 650)
    setTheme((t) => {
      const next = t === 'paper' ? 'blueprint' : 'paper'
      try {
        localStorage.setItem('bp:theme', next)
      } catch {
        /* the choice just is not remembered */
      }
      return next
    })
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'paper' ? '#f3f0e8' : '#0d3b8e')
  }, [theme])
  // the project page stays mounted for a moment after it is closed, so it can fade out
  const [shown, setShown] = useState(project)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    if (project) {
      setShown(project)
      setLeaving(false)
      return
    }
    setLeaving(true)
    const t = setTimeout(() => {
      setShown(null)
      setLeaving(false)
    }, 280)
    return () => clearTimeout(t)
  }, [project])

  const pending = useRef(null) // a sheet to scroll to once the open drawing has closed

  // the command palette: Ctrl+K, Cmd+K, or / when no field is focused
  const [palette, setPalette] = useState(false)
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setPalette((o) => !o)
      } else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setPalette(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useReveal(page, null, [])

  // closing a drawing goes Back in history; the browser would then restore its own scroll position
  // and undo ours, so scroll restoration is left to the app
  useEffect(() => {
    history.scrollRestoration = 'manual'
  }, [])

  // the tab title, bookmarks and history show which project is open
  const desc = useRef(document.querySelector('meta[name="description"]')?.getAttribute('content') || '')
  useEffect(() => {
    if (missing) return // the 404 sets its own title
    document.title = project ? `${project.name} — ${project.role} · Mani Poorna` : base.current
    document.querySelector('meta[name="description"]')?.setAttribute('content', project ? project.blurb : desc.current)
  }, [project, missing])

  // the page behind an open drawing stays put, and out of the tab order
  useEffect(() => {
    document.documentElement.style.overflow = project ? 'hidden' : ''
    if (!project && pending.current) {
      const id = pending.current
      pending.current = null
      goTo(id) // the page is already unlocked here, so there is nothing to wait for
    }
    return () => (document.documentElement.style.overflow = '')
  }, [project])

  const onClose = useCallback(() => closeWork(), [])
  // jump to a section; from inside a project page, close it first
  const go = useCallback(
    (id) => {
      if (project) {
        pending.current = id
        closeWork()
      } else goTo(id)
    },
    [project],
  )
  const onContact = useCallback(() => {
    pending.current = 'contact'
    closeWork()
  }, [])

  // every hook above has run, so the 404 can take over here
  if (missing) return <NotFound />

  return (
    <>
      <div className="page" ref={page} inert={!!project}>
        <a className="skip" href="#cover" onClick={(e) => (e.preventDefault(), document.getElementById('main')?.focus(), goTo('cover'))}>
          Skip to content
        </a>
        <Header theme={theme} onTheme={toggleTheme} onPalette={() => setPalette(true)} />
        <main id="main" tabIndex={-1}>
          <Cover />
          <About />
          <Work />
          <Experience />
          <Skills />
          <Code />
          <AI />
          <Notes />
          <Testimonials />
          <Contact />
        </main>
      </div>
      <div className="frame" aria-hidden="true" />
      {!project && <BackToTop />}
      <Palette open={palette} onClose={() => setPalette(false)} go={go} theme={theme} onTheme={toggleTheme} />
      <Toast />
      {shown && <CaseStudy key={shown.id} project={shown} leaving={leaving} onClose={onClose} onContact={onContact} />}
    </>
  )
}
