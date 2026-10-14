import { useCallback, useEffect, useRef, useState } from 'react'
import { Header, goTo } from './ui/Chrome.jsx'
import Cover from './ui/Cover.jsx'
import Work from './ui/Work.jsx'
import Code from './ui/Code.jsx'
import { About, Experience, Skills, Testimonials, Contact } from './ui/Sheets.jsx'
import CaseStudy from './ui/CaseStudy.jsx'
import useReveal from './ui/useReveal.js'
import { useHash, parseWork, closeWork } from './route.js'
import { findProject } from './data/projects.js'

export default function App() {
  const hash = useHash()
  const project = findProject(parseWork(hash))
  const page = useRef()
  const base = useRef(document.title)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('bp:theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'blueprint' : 'paper')
    } catch {
      return 'paper'
    }
  })
  const toggleTheme = useCallback(() => {
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
  const pending = useRef(null) // a sheet to scroll to once the open drawing has closed
  useReveal(page, null, [])

  // closing a drawing goes Back in history; the browser would then restore its own scroll position
  // and undo ours, so scroll restoration is left to the app
  useEffect(() => {
    history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    document.title = project ? `${project.name} — ${project.role} · Mani Poorna` : base.current
  }, [project])

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
  const onContact = useCallback(() => {
    pending.current = 'contact'
    closeWork()
  }, [])

  return (
    <>
      <div className="page" ref={page} inert={!!project}>
        <Header theme={theme} onTheme={toggleTheme} />
        <main>
          <Cover />
          <About />
          <Work />
          <Code />
          <Experience />
          <Skills />
          <Testimonials />
          <Contact />
        </main>
      </div>
      <div className="frame" aria-hidden="true" />
      {project && <CaseStudy key={project.id} project={project} onClose={onClose} onContact={onContact} />}
    </>
  )
}
