// The cover's drawing: a developer's desk, line-drawn like the rest of the site. Code types itself on the
// monitor, a terminal prints a build on the laptop, the coffee steams, the lamp glows, and the three
// technologies from the résumé float around the screen. The code on screen is illustrative.
//
// Layout grid (viewBox 520 x 400): the monitor (170-390), its neck and foot, the keyboard and the drawer all share the
// centre line x = 280; the plant and laptop sit to its left, the mug and lamp to its right.
const CX = 280 // the monitor's centre line

const chip = (x, y, text, i, anchor = 'start') => {
  const w = Math.round(text.length * 6.4 + 18)
  const left = anchor === 'end' ? x - w : x
  return (
    <g className="desk__chip" style={{ '--i': i }} key={text}>
      <rect x={left} y={y} width={w} height="22" />
      <text x={left + 9} y={y + 14.5}>{text}</text>
    </g>
  )
}

// code, as [x, width, colour] segments per line: indent steps of 8, a 6px gap between words
const CODE = [
  { y: 94, seg: [[224, 22, 'a'], [252, 50, 'i']] },
  { y: 108, seg: [[232, 26, 'r'], [264, 44, 'i']] },
  { y: 122, seg: [[240, 76, 'i']] },
  { y: 136, seg: [[240, 22, 'a'], [268, 50, 'i']] },
  { y: 150, seg: [[232, 40, 'i'], [278, 20, 'a']] },
  { y: 164, seg: [[224, 12, 'i']] },
]

export default function Desk() {
  const ink = { className: 'desk__ink draw', pathLength: 1 }
  let n = 0
  return (
    <figure className="art desk">
      <svg viewBox="0 0 520 400" role="img" aria-label="A developer's desk: a monitor with code, a laptop running a build, a coffee, a lamp and a plant" className="art__svg">
        {/* lamp light, from the shade down onto the desk */}
        <path className="desk__glow" d="M418 134L392 300H504L474 134Z" />

        {/* desk: top, two legs, and a drawer centred under the monitor */}
        <path {...ink} style={{ '--i': 0 }} d="M8 300H512V314H8Z" />
        <path {...ink} style={{ '--i': 1 }} d="M40 314V382M480 314V382" />
        <path className="desk__floor" d="M40 382H480" />
        <path {...ink} style={{ '--i': 1 }} d="M205 314h150v42H205z" />
        <path className="desk__thin" d="M267 335h26" />

        {/* monitor, its neck and foot, all on the centre line */}
        <path {...ink} style={{ '--i': 2 }} d="M170 50H390V220H170Z" />
        <path className="desk__ink" d="M270 220V280M290 220V280" />
        <path className="desk__ink" d="M240 288V280H320V288Z" />
        <rect className="desk__screen" x="182" y="62" width="196" height="146" />
        <path className="desk__thin" d="M182 78H378M214 78V196M182 196H378" />
        {[192, 201, 210].map((x) => (
          <circle key={x} className="desk__dot" cx={x} cy="70" r="2.4" />
        ))}
        <path className="desk__thin" d="M190 92h16M190 106h12M190 120h16M190 134h10M190 148h14" />
        {CODE.flatMap(({ y, seg }) =>
          seg.map(([x, w, c]) => <path key={x + '-' + y} className={'desk__type desk__type--' + c} pathLength="1" style={{ '--i': n++ }} d={`M${x} ${y}h${w}`} />),
        )}
        <rect className="desk__cursor" x="242" y="158" width="6" height="12" />
        {/* a three-layer stack, drawn small in the corner of the screen */}
        {[94, 118, 142].map((y, k) => (
          <g key={y}>
            <rect className={k === 0 ? 'desk__layer desk__layer--on' : 'desk__layer'} x="332" y={y} width="38" height="14" />
            {k < 2 && <path className="desk__thin" d={`M351 ${y + 14}v10`} />}
          </g>
        ))}
        <rect className="desk__bar" x="182" y="196" width="196" height="12" />
        <text className="desk__tiny" x="190" y="205">MAIN · BUILD PASSING</text>

        {/* sticky note, stuck square on the bezel's bottom-right corner */}
        <g transform="rotate(-6 398 196)">
          <rect className="desk__note" x="386" y="184" width="24" height="24" />
          <path className="desk__thin" d="M391 192h14M391 198h9" />
        </g>

        {/* keyboard centred under the monitor, mouse beside it, both resting on the desk */}
        <rect className="desk__ink desk__keyboard" x={CX - 62} y="290" width="124" height="10" />
        <path className="desk__keys" d={`M${CX - 56} 293h112M${CX - 56} 297h112`} />
        <path className="desk__ink" d="M354 300v-6a8 8 0 0 1 16 0v6" />

        {/* laptop, running a build */}
        <path {...ink} style={{ '--i': 3 }} d="M90 236H170V282H90Z" />
        <path className="desk__ink" d="M80 282H180L174 300H86Z" />
        <path className="desk__print" pathLength="1" style={{ '--i': 0 }} d="M98 248h32" />
        <path className="desk__print" pathLength="1" style={{ '--i': 1 }} d="M98 258h48" />
        <path className="desk__print" pathLength="1" style={{ '--i': 2 }} d="M98 268h22" />
        <path className="desk__ok" d="M140 268l4 4 9-10" />

        {/* plant, clear of the laptop */}
        <path className="desk__ink" d="M26 300l4-30h24l4 30z" />
        <path className="desk__leaf" d="M42 270c-14-10-16-30-10-44 8 8 12 26 10 44zM42 270c-2-22 4-40 14-50 4 18 0 36-14 50zM42 270c8-12 18-18 26-18-4 10-14 20-26 18z" />

        {/* coffee, with the steam centred over the mug */}
        <path className="desk__ink" d="M398 270h28v30h-28zM426 278h6a6 6 0 0 1 0 14h-6" />
        {[405, 412, 419].map((x, k) => (
          <path key={x} className="desk__steam" style={{ '--i': k }} d={`M${x} 264c-4-6 4-10 0-16`} />
        ))}

        {/* lamp: base, post, arm meeting the shade at its top centre */}
        <path className="desk__ink" d="M470 300v-8h36v8zM488 292V150Q488 110 446 110" />
        <path className="desk__ink" d="M426 110h40l10 24h-60z" />

        {/* the three technologies, floating: left chips share one left edge, the right one an edge with the lamp base */}
        {chip(24, 76, 'React.js', 0)}
        {chip(24, 146, 'PostgreSQL', 1)}
        {chip(506, 40, 'Spring Boot', 2, 'end')}
      </svg>
      <figcaption>FIG. 01 — WHERE IT GETS BUILT</figcaption>
    </figure>
  )
}
