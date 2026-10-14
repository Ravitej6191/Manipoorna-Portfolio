import { useEffect, useRef, useState } from 'react'
import { PROFILE } from '../data/profile.js'

export const SHEETS = [
  { id: 'cover', n: '01', label: 'Home' },
  { id: 'about', n: '02', label: 'About' },
  { id: 'work', n: '03', label: 'Projects' },
  { id: 'code', n: '04', label: 'Code' },
  { id: 'experience', n: '05', label: 'Experience' },
  { id: 'skills', n: '06', label: 'Skills' },
  { id: 'testimonials', n: '07', label: 'Kind words' },
  { id: 'contact', n: '08', label: 'Contact' },
]

export const goTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}

// Heading strip at the top of every section: "03 / 07 — PROJECTS", with a dimension line.
export function SheetHead({ n, title, note }) {
  return (
    <header className="sheethead reveal">
      <h2 className="sheethead__tag">
        <b>{n}</b> / {String(SHEETS.length).padStart(2, '0')} <span>— {title.toUpperCase()}</span>
      </h2>
      <i className="sheethead__dim" aria-hidden="true" />
      {note && <p className="sheethead__note">{note}</p>}
    </header>
  )
}

export function Header({ theme, onTheme }) {
  const [active, setActive] = useState('cover')
  const [open, setOpen] = useState(false)
  const bar = useRef()

  // the section menu (shown on narrower screens) closes on Escape, on a click outside it, and when a section is chosen
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => !e.target.closest('.hdr__nav, .hdr__menu') && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SHEETS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      bar.current?.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : '0')
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      io.disconnect()
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className="hdr">
      <a className="hdr__mark" href="#cover" onClick={(e) => (e.preventDefault(), goTo('cover'))} title="Back to the top">
        <b>{PROFILE.initials}</b>
        <span>Portfolio</span>
      </a>
      <button className="hdr__menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="sections-nav" onClick={() => setOpen((o) => !o)}>
        <i aria-hidden="true" />
        <span>{open ? 'Close' : 'Menu'}</span>
      </button>
      <nav id="sections-nav" className={'hdr__nav' + (open ? ' is-open' : '')} aria-label="Sections">
        {SHEETS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'is-active' : ''}
            aria-current={active === s.id ? 'true' : undefined}
            onClick={(e) => (e.preventDefault(), setOpen(false), goTo(s.id))}
          >
            <i>{s.n}</i>
            <span>{s.label}</span>
          </a>
        ))}
      </nav>
      <button className="hdr__theme" onClick={onTheme} aria-label={theme === 'paper' ? 'Switch to the blueprint look' : 'Switch to the paper look'} title={theme === 'paper' ? 'Blueprint' : 'Paper'}>
        <i aria-hidden="true" />
        <span>{theme === 'paper' ? 'Blueprint' : 'Paper'}</span>
      </button>
      <a className="hdr__cv" href={PROFILE.resume} download>
        Résumé <span aria-hidden="true">↓</span>
      </a>
      <div className="hdr__bar" ref={bar} aria-hidden="true" />
    </header>
  )
}

// A way back to the top once the visitor has scrolled a screen or more.
export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(scrollY > innerHeight * 1.2)
    addEventListener('scroll', on, { passive: true })
    on()
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <button className={'totop' + (show ? ' is-on' : '')} onClick={() => goTo('cover')} aria-label="Back to the top" tabIndex={show ? 0 : -1}>
      <span aria-hidden="true">↑</span>
    </button>
  )
}
