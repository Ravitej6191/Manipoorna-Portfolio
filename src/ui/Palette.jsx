import { useEffect, useMemo, useRef, useState } from 'react'
import { PROFILE } from '../data/profile.js'
import { PROJECTS } from '../data/projects.js'
import { SHEETS } from './Chrome.jsx'
import { openWork } from '../route.js'

export const toast = (text) => window.dispatchEvent(new CustomEvent('app:toast', { detail: text }))

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(PROFILE.email)
    toast(`Copied ${PROFILE.email}`)
  } catch {
    toast(`Write to ${PROFILE.email}`)
  }
}

// Ctrl+K (or Cmd+K, or /) opens a list of everything the site can do: jump to a section, open a project, switch
// the look, copy the email, open a profile. Type to filter, arrows to move, Enter to run, Escape to close.
export default function Palette({ open, onClose, go, theme, onTheme }) {
  const [q, setQ] = useState('')
  const [at, setAt] = useState(0)
  const input = useRef()
  const list = useRef()

  // mounted while open and for a moment after, so closing can animate
  const [mounted, setMounted] = useState(open)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    if (open) {
      setMounted(true)
      setLeaving(false)
      return
    }
    if (!mounted) return
    setLeaving(true)
    const t = setTimeout(() => {
      setMounted(false)
      setLeaving(false)
    }, 180)
    return () => clearTimeout(t)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const items = useMemo(() => {
    const out = [
      ...SHEETS.map((s) => ({ kind: 'Go to', label: s.label, hint: s.n, keys: s.id, run: () => go(s.id) })),
      ...PROJECTS.map((p) => ({ kind: 'Open', label: p.name, hint: p.role, keys: 'project case study ' + p.id, run: () => openWork(p.id) })),
      { kind: 'Do', label: `Switch to the ${theme === 'paper' ? 'blueprint' : 'paper'} look`, hint: 'theme', keys: 'theme dark light blueprint paper night day', run: onTheme },
      { kind: 'Do', label: 'Copy my email address', hint: PROFILE.email, keys: 'email copy contact mail', run: copyEmail },
      { kind: 'Do', label: 'Send a message', hint: 'form', keys: 'contact message hire write', run: () => go('contact') },
      { kind: 'Do', label: 'Download the résumé', hint: 'PDF', keys: 'resume cv pdf download', run: () => window.open(PROFILE.resume, '_blank') },
    ]
    if (PROFILE.github) out.push({ kind: 'Open', label: 'GitHub profile', hint: 'new tab', keys: 'github code repositories git', run: () => window.open(PROFILE.github, '_blank', 'noopener') })
    if (PROFILE.linkedin) out.push({ kind: 'Open', label: 'LinkedIn profile', hint: 'new tab', keys: 'linkedin social', run: () => window.open(PROFILE.linkedin, '_blank', 'noopener') })
    return out
  }, [go, theme, onTheme])

  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length) return items
    return items.filter((i) => {
      const hay = `${i.kind} ${i.label} ${i.hint} ${i.keys}`.toLowerCase()
      return words.every((w) => hay.includes(w))
    })
  }, [items, q])

  useEffect(() => {
    if (open) {
      setQ('')
      setAt(0)
      // wait a frame so the input exists
      requestAnimationFrame(() => input.current?.focus())
    }
  }, [open])
  useEffect(() => setAt(0), [q])
  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [at, shown])

  if (!mounted) return null

  const run = (item) => {
    if (!item) return
    onClose()
    // let the palette close first, so focus and scroll locks are released before the action
    setTimeout(item.run, 30)
  }
  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAt((a) => (shown.length ? (a + 1) % shown.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAt((a) => (shown.length ? (a - 1 + shown.length) % shown.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(shown[at])
    } else if (e.key === 'Tab') {
      e.preventDefault() // the palette is one field and one list: keep focus in the field
    }
  }

  return (
    <div className={'pal' + (leaving ? ' pal--leaving' : '')} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pal__box" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKey}>
        <div className="pal__in">
          <span aria-hidden="true">›</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search commands…"
            role="combobox"
            aria-expanded="true"
            aria-controls="pal-list"
            aria-activedescendant={shown[at] ? `pal-${at}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd>esc</kbd>
        </div>
        <ul id="pal-list" role="listbox" ref={list} aria-label="Commands">
          {shown.map((it, i) => (
            <li key={it.kind + it.label} id={`pal-${i}`} role="option" aria-selected={i === at} className={i === at ? 'is-on' : ''} onMouseMove={() => setAt(i)} onClick={() => run(it)}>
              <em>{it.kind}</em>
              <b>{it.label}</b>
              <span>{it.hint}</span>
            </li>
          ))}
          {!shown.length && <li className="pal__none">Nothing matches “{q}”. Try “project”, “contact” or “theme”.</li>}
        </ul>
        <div className="pal__foot" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> run</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

// a short message at the bottom of the screen
export function Toast() {
  const [text, setText] = useState('')
  useEffect(() => {
    let t
    const on = (e) => {
      setText(e.detail)
      clearTimeout(t)
      t = setTimeout(() => setText(''), 2400)
    }
    window.addEventListener('app:toast', on)
    return () => (window.removeEventListener('app:toast', on), clearTimeout(t))
  }, [])
  return (
    <div className={'toast' + (text ? ' is-on' : '')} role="status" aria-live="polite">
      {text}
    </div>
  )
}
