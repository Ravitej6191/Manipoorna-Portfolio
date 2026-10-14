import { useEffect, useRef, useState } from 'react'
import { ABOUT, EXPERIENCE, EDUCATION, SKILLS } from '../data/about.js'
import { PROFILE, CONTACT_LINKS } from '../data/profile.js'
import { TESTIMONIALS } from '../data/proof.js'
import { NOTES } from '../data/notes.js'
import { copyEmail } from './Palette.jsx'
import { SheetHead } from './Chrome.jsx'

/* ───────── about ───────── */
export function About() {
  return (
    <section id="about" className="sheet details" aria-label="About">
      <SheetHead id="about" title="About" note="Who I am, at a glance." />
      <div className="rev__intro reveal">
        <p>{ABOUT.summary}</p>
        <dl className="titleblock titleblock--2" aria-label="At a glance">
          {ABOUT.facts.map(([k, v]) => (
            <div className="tb" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ───────── experience + education ───────── */
export function Experience() {
  const rail = useRef()
  useEffect(() => {
    const update = () => {
      const el = rail.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const p = (innerHeight * 0.65 - r.top) / r.height
      el.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3))
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [])
  return (
    <section id="experience" className="sheet revisions" aria-label="Experience and education">
      <SheetHead id="experience" title="Experience" note="Where I have worked and studied." />
      <div className="exp" ref={rail}>
        <i className="exp__rail" aria-hidden="true" />
      <table className="revtable reveal">
        <caption className="sr-only">Experience and education</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {EXPERIENCE.map((job) => (
            <tr key={job.company}>
              <td className="revtable__when">{job.period}</td>
              <td>
                <h3>
                  {job.role} <span>— {job.company}, {job.place}</span>
                </h3>
                <ul>
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
          {EDUCATION.map((e) => (
            <tr key={e.school}>
              <td className="revtable__when">{e.period}</td>
              <td>
                <h3>
                  {e.degree} <span>— {e.school}, {e.place}</span>
                </h3>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  )
}

/* ───────── skills ───────── */
export function Skills() {
  return (
    <section id="skills" className="sheet materials" aria-label="Skills">
      <SheetHead id="skills" title="Skills" note="The tools and technologies I work with." />
      <table className="bom reveal">
        <caption className="sr-only">Skills</caption>
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Area</th>
            <th scope="col">Technologies</th>
          </tr>
        </thead>
        <tbody>
          {SKILLS.map(([group, items], i) => (
            <tr key={group}>
              <td className="bom__no">{String(i + 1).padStart(2, '0')}</td>
              <th scope="row">{group}</th>
              <td>
                <ul>
                  {items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

/* ───────── notes (only when there are some) ───────── */
export function Notes() {
  if (!NOTES.length) return null
  return (
    <section id="notes" className="sheet notes" aria-label="Notes">
      <SheetHead id="notes" title="Notes" note="Short write-ups on things I have built and learned." />
      <ul className="notes__list">
        {NOTES.map((n) => (
          <li key={n.title} className="reveal">
            <a href={n.url} target="_blank" rel="noreferrer">
              <time dateTime={n.date}>{new Date(n.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
              <b>{n.title}</b>
              <p>{n.summary}</p>
              <span aria-hidden="true">Read ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ───────── kind words ───────── */
// A profile icon: the person's photo if  is set on their entry and loads, otherwise a drawn head-and-shoulders.
function Avatar({ name, photo, tone }) {
  const [ok, setOk] = useState(Boolean(photo))
  return (
    <span className={'quote__av quote__av--' + tone} aria-hidden="true">
      {ok ? (
        <img src={photo} alt="" onError={() => setOk(false)} draggable="false" />
      ) : (
        <svg viewBox="0 0 48 48">
          <circle cx="24" cy="18" r="8" />
          <path d="M8 42c1-9 8-14 16-14s15 5 16 14" />
        </svg>
      )}
    </span>
  )
}
export function Testimonials() {
  return (
    <section id="testimonials" className="sheet kind" aria-label="Testimonials">
      <SheetHead id="testimonials" title="Kind words" note="What the people I work with say." />
      <div className="kind__grid">
        {TESTIMONIALS.map((t, i) => (
          <figure className="quote reveal" key={i} style={{ '--d': i * 0.12 + 's' }}>
            <svg className="quote__mark" viewBox="0 0 48 36" aria-hidden="true">
              <path className="draw" pathLength="1" d="M4 32V18C4 9 9 4 18 3M26 32V18c0-9 5-14 14-15" />
            </svg>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <Avatar name={t.name} photo={t.photo} tone={i % 3} />
              <div>
                <b>{t.name}</b>
                <span>{t.role}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ───────── contact ───────── */
// How the form sends. Order: EmailJS (needs the public key), then a custom endpoint, then the visitor's email app.
// EmailJS ids are public by design; the public key goes in .env as VITE_EMAILJS_PUBLIC_KEY.
const EMAILJS = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_081rxbt',
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_5z0hq53',
  key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
}
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || ''

async function sendWithEmailJs(data) {
  // the template can use any of these names
  const template_params = {
    name: data.name,
    from_name: data.name,
    email: data.email,
    from_email: data.email,
    reply_to: data.email,
    message: data.message,
    to_name: PROFILE.name,
    to_email: PROFILE.email,
    time: new Date().toLocaleString(),
  }
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: EMAILJS.service, template_id: EMAILJS.template, user_id: EMAILJS.key, template_params }),
  })
  return res.ok
}

export function Contact() {
  const [state, setState] = useState('idle') // idle | sending | sent | mail | wait
  const [copied, setCopied] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.company) return setState('sent') // spam trap
    // one message every 30 seconds from the same browser
    try {
      const last = Number(localStorage.getItem('bp:sent')) || 0
      if (Date.now() - last < 30000) return setState('wait')
    } catch {
      /* no limit if storage is blocked */
    }
    setState('sending')
    if (EMAILJS.key) {
      try {
        if (await sendWithEmailJs(data)) {
          try {
            localStorage.setItem('bp:sent', String(Date.now()))
          } catch {
            /* fine */
          }
          setState('sent')
          form.reset()
          return
        }
      } catch {
        /* fall through */
      }
    }
    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        // only a JSON answer counts: a host that returns its HTML page with a 200 must not read as success
        if (res.ok && (res.headers.get('content-type') || '').includes('json')) {
          setState('sent')
          form.reset()
          return
        }
      } catch {
        /* fall through to the email app */
      }
    }
    const body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')')
    window.location.href = 'mailto:' + PROFILE.email + '?subject=' + encodeURIComponent('Hello from ' + data.name) + '&body=' + body
    setState('mail')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard blocked: the address is on screen to select by hand */
    }
  }

  return (
    <section id="contact" className="sheet transmittal" aria-label="Contact">
      <SheetHead id="contact" title="Contact" note="Open to hearing about interesting work." />
      <div className="tm__grid">
        <div className="tm__intro reveal">
          <h2>Let’s work together.</h2>
          <p>
            Send me a message below, or write directly.
          </p>
          {PROFILE.availability && (
            <p className="tm__avail">
              <i aria-hidden="true" />
              {PROFILE.availability}
            </p>
          )}
          <ul className="tm__links">
            {CONTACT_LINKS.map(([label, href]) => (
              <li key={label}>
                <a href={href} target={href.startsWith('mailto:') || href.endsWith('.pdf') ? undefined : '_blank'} rel="noreferrer" download={href.endsWith('.pdf') ? '' : undefined}>
                  {label} <span aria-hidden="true">{href.endsWith('.pdf') ? '↓' : '↗'}</span>
                </a>
              </li>
            ))}
            {PROFILE.booking && (
              <li>
                <a href={PROFILE.booking} target="_blank" rel="noreferrer">
                  Book a call <span aria-hidden="true">↗</span>
                </a>
              </li>
            )}
            <li>
              <button type="button" onClick={copyEmail}>
                Copy email address <span aria-hidden="true">⧉</span>
              </button>
            </li>
          </ul>
        </div>
        <form className="tm__form reveal" onSubmit={submit} aria-busy={state === 'sending'}>
          <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label>
            <span>Your name</span>
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            <span>Your email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="wide">
            <span>Message</span>
            <textarea name="message" rows="4" required />
          </label>
          <button className="btn btn--solid" type="submit" disabled={state === 'sending' || state === 'sent'}>
            {state === 'sent' ? 'Message sent' : state === 'sending' ? 'Sending…' : state === 'mail' ? 'Open email again →' : 'Send message →'}
          </button>
          <div className="tm__status" role="status" aria-live="polite">
            {state === 'sent' && <p>Thank you. Your message has been sent, and I will reply to the address you gave.</p>}
            {state === 'wait' && <p>That was a moment ago. Please wait a few seconds before sending another.</p>}
            {state === 'mail' && (
              <p>
                The message could not be sent from here, so your email app should open with it filled in. If nothing opened, write to <b>{PROFILE.email}</b>{' '}
                <button type="button" className="linklike" onClick={copy}>
                  {copied ? 'Copied' : 'Copy address'}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
      <footer className="foot">
        <span>
          © {new Date().getFullYear()} {PROFILE.name}
        </span>
        <span>
          Built with <span role="img" aria-label="love">❤️</span> · Thanks to{' '}
          <a href="https://ravitejaavvaru.com" target="_blank" rel="noreferrer">
            ravitejaavvaru.com
          </a>
        </span>
      </footer>
    </section>
  )
}
