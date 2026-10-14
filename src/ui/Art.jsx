// One drawing per project, each showing the product itself rather than a generic stack: a payment moving from a
// phone to a card, a device and its live monitoring screen, a hiring pipeline. The numbered balloons match the
// layers in the legend, and hovering a part (or its legend entry) lights up both.
const BX = 410 // balloon column
const END = 396 // where leader lines stop

function Part({ i, hover, setHover, children }) {
  return (
    <g className={'pa__part' + (hover === i ? ' is-hot' : '')} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
      {children}
    </g>
  )
}

// numbered balloon with a leader line from the part it points at
function Balloon({ n, hover, from }) {
  const [x, y] = from
  return (
    <g className={'pa__balloon' + (hover === n - 1 ? ' is-hot' : '')}>
      <line className="pa__lead" x1={x} y1={y} x2={END} y2={y} />
      <circle className="pa__bubble" cx={BX} cy={y} r="14" />
      <text className="pa__no" x={BX} y={y + 4.5} textAnchor="middle">
        {n}
      </text>
    </g>
  )
}

const dots = (cx, cy) => [0, 1, 2].map((k) => <circle key={k} className="pa__dot" cx={cx + k * 11} cy={cy} r="3" />)

/* ───────── Talus Pay: a payment from a phone, through a card, kept safe, and recorded ───────── */
function Talus({ hover, setHover }) {
  const P = { hover, setHover }
  return (
    <>
      <Part i={0} {...P}>
        <rect className="pa__box pa__tint draw" pathLength="1" x="40" y="40" width="118" height="236" />
        <path className="pa__line" d="M84 52h30" />
        <path className="pa__line" d="M56 84h40" />
        <path className="pa__acc" d="M56 102h74" />
        <path className="pa__line" d="M56 134h86M56 152h60M56 170h72" />
        <rect className="pa__box" x="56" y="232" width="86" height="28" />
        <text className="pa__txt" x="99" y="250" textAnchor="middle">PAY</text>
      </Part>

      <Part i={1} {...P}>
        <rect className="pa__box pa__tint" x="196" y="96" width="134" height="86" />
        <rect className="pa__box" x="210" y="114" width="24" height="18" />
        <path className="pa__line" d="M210 156h70M210 166h40" />
        <circle className="pa__acc" cx="304" cy="164" r="8" />
        <circle className="pa__acc" cx="314" cy="164" r="8" />
        <path className="pa__flow" d="M160 140H194M188 134l6 6-6 6" />
      </Part>

      <Part i={2} {...P}>
        <rect className="pa__box pa__tint" x="196" y="200" width="134" height="44" />
        <path className="pa__acc" d="M222 214l12 5v8c0 7-5 11-12 14-7-3-12-7-12-14v-8z" />
        <path className="pa__acc" d="M217 226l4 4 8-9" />
        <text className="pa__txt" x="246" y="226">ENCRYPTED</text>
      </Part>

      <Part i={3} {...P}>
        <rect className="pa__box" x="196" y="262" width="134" height="76" />
        {[274, 294, 314].map((y, k) => (
          <g key={y}>
            <path className="pa__line" d={`M206 ${y + 6}h48`} />
            <path className="pa__acc pa__blink" style={{ '--i': k }} d={`M284 ${y + 6}h36`} />
          </g>
        ))}
      </Part>

      <Balloon n={1} hover={hover} from={[158, 62]} />
      <Balloon n={2} hover={hover} from={[330, 139]} />
      <Balloon n={3} hover={hover} from={[330, 222]} />
      <Balloon n={4} hover={hover} from={[330, 300]} />
    </>
  )
}

/* ───────── Schneider Electric: a device, its controls, and the screen that monitors it ───────── */
function Schneider({ hover, setHover }) {
  const P = { hover, setHover }
  return (
    <>
      <Part i={0} {...P}>
        <rect className="pa__box pa__tint draw" pathLength="1" x="40" y="40" width="290" height="130" />
        <path className="pa__line" d="M40 62H330" />
        {dots(52, 51)}
        {[82, 108, 134].map((y, k) => (
          <g key={y}>
            <path className="pa__line" d={`M56 ${y}h${44 + (k % 2) * 14}`} />
            <rect className="pa__box" x="132" y={y - 8} width="28" height="14" />
            <circle className={k === 1 ? 'pa__dot' : 'pa__solid'} cx={k === 1 ? 140 : 152} cy={y - 1} r="4" />
          </g>
        ))}
        <rect className="pa__box" x="184" y="72" width="132" height="86" />
        <path className="pa__line" d="M184 100H316M184 128H316M222 72V158M270 72V158" />
        <path className="pa__acc draw" pathLength="1" d="M190 140L214 118 238 128 262 92 288 104 310 84" />
      </Part>

      <Part i={1} {...P}>
        <rect className="pa__box pa__tint" x="40" y="204" width="170" height="104" />
        <circle className="pa__box" cx="92" cy="250" r="26" />
        <path className="pa__acc pa__needle" d="M92 250L110 236" />
        <path className="pa__line" d="M70 270a26 26 0 0 0 44 0" />
        <circle className="pa__solid pa__led" cx="148" cy="226" r="4" />
        <circle className="pa__dot" cx="164" cy="226" r="4" />
        <circle className="pa__dot" cx="180" cy="226" r="4" />
        <rect className="pa__box" x="136" y="244" width="58" height="12" />
        <path className="pa__line" d="M136 270h58" />
        {[50, 70, 90, 110, 130, 150, 170, 190].map((x) => (
          <rect key={x} className="pa__box" x={x - 4} y="292" width="8" height="16" />
        ))}
        <path className="pa__flow" d="M125 204V172" />
      </Part>

      <Part i={2} {...P}>
        {[40, 140, 240].map((x, k) => (
          <g key={x}>
            <path className={k === 1 ? 'pa__box pa__tint' : 'pa__box'} d={`M${x} 326h78l14 17-14 17H${x}l14-17z`} />
            <path className="pa__line" d={`M${x + 22} 343h40`} />
          </g>
        ))}
      </Part>

      <Balloon n={1} hover={hover} from={[330, 70]} />
      <Balloon n={2} hover={hover} from={[210, 256]} />
      <Balloon n={3} hover={hover} from={[332, 343]} />
    </>
  )
}

/* ───────── B2B Talent Hub: search, an applicant pipeline, a profile, and the hiring flow ───────── */
function Talent({ hover, setHover }) {
  const P = { hover, setHover }
  return (
    <>
      <Part i={0} {...P}>
        <rect className="pa__box pa__tint draw" pathLength="1" x="40" y="40" width="290" height="36" />
        <circle className="pa__acc" cx="58" cy="57" r="6" />
        <path className="pa__acc" d="M63 62l6 6" />
        <path className="pa__line" d="M80 58h66" />
        {[178, 220, 262].map((x) => (
          <rect key={x} className="pa__box" x={x} y="49" width="36" height="16" />
        ))}
      </Part>

      <Part i={1} {...P}>
        {[40, 140, 240].map((x, k) => (
          <g key={x}>
            <rect className="pa__box pa__tint" x={x} y="92" width="90" height="112" />
            <path className="pa__line" d={`M${x} 112H${x + 90}`} />
            <rect className="pa__box" x={x + 8} y="120" width="74" height="30" />
            <path className="pa__line" d={`M${x + 16} 132h36M${x + 16} 141h22`} />
            {k === 0 && (
              <>
                <rect className="pa__box pa__card" x={x + 8} y="158" width="74" height="30" />
                <path className="pa__line" d={`M${x + 16} 170h30M${x + 16} 179h40`} />
              </>
            )}
          </g>
        ))}
      </Part>

      <Part i={2} {...P}>
        <rect className="pa__box pa__tint" x="40" y="220" width="290" height="62" />
        <circle className="pa__box" cx="70" cy="251" r="16" />
        <circle className="pa__line" cx="70" cy="246" r="5" />
        <path className="pa__line" d="M60 262a10 8 0 0 1 20 0" />
        <path className="pa__line" d="M100 238h60M100 252h110M100 266h80" />
        <path className="pa__acc" d="M100 238h36M100 252h82M100 266h40" />
        <circle className="pa__acc" cx="298" cy="251" r="20" />
        <path className="pa__acc" d="M288 251l7 7 13-14" />
      </Part>

      <Part i={3} {...P}>
        {[40, 125, 210, 295].map((x, k) => (
          <path key={x} className={k === 3 ? 'pa__box pa__tint' : 'pa__box'} d={k === 3 ? `M${x} 304h27l12 16-12 16H${x}z` : `M${x} 304h69l14 16-14 16H${x}l14-16z`} />
        ))}
        <path className="pa__flow" d="M52 320H320" />
      </Part>

      <Balloon n={1} hover={hover} from={[330, 58]} />
      <Balloon n={2} hover={hover} from={[330, 148]} />
      <Balloon n={3} hover={hover} from={[330, 251]} />
      <Balloon n={4} hover={hover} from={[334, 320]} />
    </>
  )
}

const ARTS = { 'talus-pay': Talus, 'schneider-electric': Schneider, 'b2b-talent-hub': Talent }

export default function ProjectArt({ project, hover = null, setHover = () => {} }) {
  const Art = ARTS[project.id]
  if (!Art) return null
  return (
    <svg className="pa reveal" viewBox="0 0 440 380" role="img" aria-label={`${project.name}: ${project.layers.length} parts, ${project.layers.map((l) => l[0]).join(', ')}`}>
      <Art hover={hover} setHover={setHover} />
    </svg>
  )
}
