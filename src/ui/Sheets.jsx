import { useState } from 'react'
import { ABOUT, EXPERIENCE, EDUCATION, SKILLS } from '../data/about.js'
import { PROFILE, CONTACT_LINKS } from '../data/profile.js'
import { TESTIMONIALS } from '../data/proof.js'
import { SheetHead } from './Chrome.jsx'

/* ───────── about ───────── */
export function About() {
  return (
    <section id="about" className="sheet details" aria-label="About">
      <SheetHead n="02" title="About" note="Who I am, at a glance." />
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
  return (
    <section id="experience" className="sheet revisions" aria-label="Experience and education">
      <SheetHead n="05" title="Experience" note="Where I have worked and studied." />
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
    </section>
  )
}

/* ───────── skills ───────── */
export function Skills() {
  return (
    <section id="skills" className="sheet materials" aria-label="Skills">
      <SheetHead n="06" title="Skills" note="The tools and technologies I work with." />
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

/* ───────── kind words ───────── */
export function Testimonials() {
  const anySample = TESTIMONIALS.some((t) => t.sample)
  return (
    <section id="testimonials" className="sheet kind" aria-label="Testimonials">
      <SheetHead n="07" title="Kind words" note="What the people I work with say." />
      <div className="kind__grid">
        {TESTIMONIALS.map((t, i) => (
          <figure className="quote reveal" key={i} style={{ '--d': i * 0.12 + 's' }}>
            <svg className="quote__mark" viewBox="0 0 48 36" aria-hidden="true">
              <path className="draw" pathLength="1" d="M4 32V18C4 9 9 4 18 3M26 32V18c0-9 5-14 14-15" />
            </svg>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <b>{t.name}</b>
              <span>{t.role}</span>
              {t.sample && <em className="sample">Sample</em>}
            </figcaption>
          </figure>
        ))}
      </div>
      {anySample && <p className="kind__note reveal">Placeholder quotes, shown to preview the layout. Replace them with real ones in src/data/proof.js.</p>}
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
  const [state, setState] = useState('idle') // idle | sending | sent | mail
  const [copied, setCopied] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data.company) return setState('sent') // spam trap
    setState('sending')
    if (EMAILJS.key) {
      try {
        if (await sendWithEmailJs(data)) {
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
      <SheetHead n="08" title="Contact" note="Open to hearing about interesting work." />
      <div className="tm__grid">
        <div className="tm__intro reveal">
          <h2>Let’s work together.</h2>
          <p>
            Send me a message below, or write directly.
          </p>
          <ul className="tm__links">
            {CONTACT_LINKS.map(([label, href]) => (
              <li key={label}>
                <a href={href} target={href.startsWith('mailto:') || href.endsWith('.pdf') ? undefined : '_blank'} rel="noreferrer" download={href.endsWith('.pdf') ? '' : undefined}>
                  {label} <span aria-hidden="true">{href.endsWith('.pdf') ? '↓' : '↗'}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <form className="tm__form reveal" onSubmit={submit}>
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
            {state === 'sent' && <p>Thank you. Your message has been sent.</p>}
            {state === 'mail' && (
              <p>
                Your email app should open with the message filled in. If nothing opened, write to <b>{PROFILE.email}</b>{' '}
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
        <span>Built with React and hand-drawn SVG</span>
      </footer>
    </section>
  )
}
