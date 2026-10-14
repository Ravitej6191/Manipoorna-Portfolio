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
      <p className="sheethead__tag">
        <b>{n}</b> / {String(SHEETS.length).padStart(2, '0')} <span>— {title.toUpperCase()}</span>
      </p>
      <i className="sheethead__dim" aria-hidden="true" />
      {note && <p className="sheethead__note">{note}</p>}
    </header>
  )
}

export function Header({ theme, onTheme }) {
  const [active, setActive] = useState('cover')
  const bar = useRef()

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
      <a className="hdr__mark" href="#cover" onClick={(e) => (e.preventDefault(), goTo('cover'))} aria-label="Back to the top">
        <b>{PROFILE.initials}</b>
        <span>Portfolio</span>
      </a>
      <nav className="hdr__nav" aria-label="Sections">
        {SHEETS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'is-active' : ''}
            aria-current={active === s.id ? 'true' : undefined}
            onClick={(e) => (e.preventDefault(), goTo(s.id))}
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
