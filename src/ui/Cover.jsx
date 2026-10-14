import { useState } from 'react'
import { PROFILE } from '../data/profile.js'
import Desk from './Desk.jsx'
import { goTo } from './Chrome.jsx'

// A portrait in a frame: registration marks at the corners and a duotone treatment.
// With no photo at /public/profile.jpg the desk drawing is shown instead.
function Figure() {
  const [ok, setOk] = useState(__HAS_PHOTO__)
  if (!ok) return <Desk />
  return (
    <figure className="figure">
      <div className="figure__frame">
        <img src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} onError={() => setOk(false)} draggable="false" />
        <span className="figure__tick figure__tick--tl" />
        <span className="figure__tick figure__tick--tr" />
        <span className="figure__tick figure__tick--bl" />
        <span className="figure__tick figure__tick--br" />
      </div>
      <figcaption>
        FIG. 01 — {PROFILE.initials}, {PROFILE.city.split(',')[0]}
      </figcaption>
    </figure>
  )
}

export default function Cover() {
  return (
    <section id="cover" className="sheet cover" aria-label="Cover">
      <div className="cover__grid">
        <div className="cover__main">
          <p className="tag cover__tag">Hi, I’m</p>
          <h1 className="cover__name">
            <span>{PROFILE.display[0]}</span>
            <span>{PROFILE.display[1]}</span>
          </h1>
          <p className="cover__lede">
            I build scalable web applications, with React up front and Spring Boot behind it. I care about secure, fast interfaces: Spring Security on the backend, and React apps that score 95+ on Lighthouse.
          </p>
          {PROFILE.availability && (
            <p className="avail">
              <i aria-hidden="true" />
              {PROFILE.availability}
            </p>
          )}
          <div className="cover__cta">
            <a className="btn btn--solid" href="#work" onClick={(e) => (e.preventDefault(), goTo('work'))}>
              View projects <span aria-hidden="true">↓</span>
            </a>
            <a className="btn" href="#contact" onClick={(e) => (e.preventDefault(), goTo('contact'))}>
              Get in touch
            </a>
          </div>
        </div>
        <Figure />
      </div>
    </section>
  )
}
