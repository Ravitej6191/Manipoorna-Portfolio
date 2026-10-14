// One drawing per project, each showing the product itself rather than a generic stack: a till and its receipt,
// an asset tag being scanned, a dashboard. The four numbered balloons match the four layers in the legend, and
// hovering a part (or its legend entry) lights up both.
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

/* ───────── POS: a till, its receipt, and a tenant per business ───────── */
function Pos({ hover, setHover }) {
  const P = { hover, setHover }
  const teeth = 'l-8 6 -8 -6 '.repeat(5)
  return (
    <>
      <Part i={3} {...P}>
        {[40, 140, 240].map((x, k) => (
          <g key={x}>
            <rect className="pa__box pa__tint" x={x} y="298" width="90" height="48" />
            <path className="pa__line" d={`M${x + 10} 314h70M${x + 10} 326h44`} />
            <text className="pa__txt" x={x + 10} y="340">
              TENANT {'ABC'[k]}
            </text>
          </g>
        ))}
        <path className="pa__dash" d="M135 290v64M235 290v64" />
      </Part>

      <Part i={0} {...P}>
        <rect className="pa__box pa__tint draw" pathLength="1" x="40" y="50" width="290" height="170" />
        <path className="pa__line" d="M40 74H330M185 220v22M150 242h70" />
        {dots(52, 62)}
        <text className="pa__txt" x="262" y="66">TILL 02</text>
        {[52, 112, 172].flatMap((x, c) =>
          [88, 134].map((y, r) => (
            <g key={x + '-' + y}>
              <rect className="pa__box" x={x} y={y} width="50" height="38" />
              <path className="pa__line" d={`M${x + 8} ${y + 26}h28`} />
              <circle className="pa__dot" cx={x + 25} cy={y + 13} r="5" />
            </g>
          )),
        )}
        <rect className="pa__box" x="234" y="86" width="86" height="122" />
        {[100, 116, 132, 148].map((y, k) => (
          <path key={y} className="pa__line pa__blink" style={{ '--i': k }} d={`M244 ${y}h44M300 ${y}h10`} />
        ))}
        <path className="pa__line" d="M234 168H320" />
        <path className="pa__acc pa__total" d="M244 190h66" />
      </Part>

      <Part i={1} {...P}>
        <rect className="pa__box pa__tint" x="330" y="108" width="30" height="44" />
        <rect className="pa__acc" x="338" y="128" width="14" height="11" />
        <path className="pa__acc" d="M341 128v-5a4 4 0 0 1 8 0v5" />
      </Part>

      <Part i={2} {...P}>
        <path className="pa__box pa__tint" d={`M246 228H326V284${teeth}Z`} />
        {[242, 254, 266].map((y, k) => (
          <path key={y} className="pa__line pa__print" pathLength="1" style={{ '--i': k }} d={`M256 ${y}h${k === 2 ? 28 : 46}`} />
        ))}
        <path className="pa__acc pa__print" pathLength="1" style={{ '--i': 3 }} d="M256 276h60" />
      </Part>

      <Balloon n={1} hover={hover} from={[330, 62]} />
      <Balloon n={2} hover={hover} from={[360, 130]} />
      <Balloon n={3} hover={hover} from={[326, 256]} />
      <Balloon n={4} hover={hover} from={[330, 322]} />
    </>
  )
}

/* ───────── Audit: an asset tag with a QR code, being scanned and verified ───────── */
const QR = [[3, 0], [3, 2], [0, 3], [2, 3], [4, 3], [6, 3], [3, 4], [5, 4], [4, 5], [6, 5], [3, 6], [5, 6], [4, 4]]

function Audit({ hover, setHover }) {
  const P = { hover, setHover }
  const qx = 62
  const qy = 110
  const c = 14
  const finder = (x, y) => (
    <g key={x + '-' + y}>
      <rect className="pa__line" x={x} y={y} width={c * 3} height={c * 3} />
      <rect className="pa__solid" x={x + c} y={y + c} width={c} height={c} />
    </g>
  )
  return (
    <>
      <Part i={0} {...P}>
        <rect className="pa__box pa__tint draw" pathLength="1" x="40" y="40" width="290" height="34" />
        {[56, 110, 164].map((x) => (
          <rect key={x} className="pa__line" x={x} y="50" width="46" height="14" />
        ))}
        <circle className="pa__acc" cx="308" cy="57" r="9" />
        <path className="pa__acc" d="M303 60a5 5 0 0 1 10 0" />
      </Part>

      <Part i={1} {...P}>
        <path className="pa__box pa__tint" d="M310 92l16 6v13c0 9-7 15-16 19-9-4-16-10-16-19V98z" />
        <path className="pa__acc" d="M303 111l5 5 10-11" />
      </Part>

      <Part i={2} {...P}>
        <rect className="pa__box pa__tint" x="208" y="146" width="122" height="86" />
        <path className="pa__line" d="M208 168H330M208 190H330M208 212H330M248 146v86M288 146v86" />
        <path className="pa__acc" d="M214 157h28M254 157h28M294 157h28" />
        <path className="pa__flow" d="M206 189H188M194 183l-6 6 6 6" />
      </Part>

      <Part i={3} {...P}>
        <rect className="pa__box pa__tint draw" pathLength="1" x="40" y="96" width="144" height="150" />
        {finder(qx, qy)}
        {finder(qx + c * 4, qy)}
        {finder(qx, qy + c * 4)}
        {QR.map(([x, y]) => (
          <rect key={x + '-' + y} className="pa__solid" x={qx + x * c + 2} y={qy + y * c + 2} width={c - 4} height={c - 4} />
        ))}
        <path className="pa__acc" d="M52 120v-12h12M172 108h12v12M184 222v12h-12M64 234H52v-12" transform="translate(-4 -4)" />
        <line className="pa__scan" x1="56" y1="112" x2="168" y2="112" />
        <rect className="pa__box" x="70" y="216" width="84" height="18" />
        <text className="pa__txt" x="112" y="228.5" textAnchor="middle">VERIFIED</text>
        <rect className="pa__box pa__tint" x="40" y="262" width="290" height="38" />
        <text className="pa__txt" x="52" y="285">STATUS</text>
        <rect className="pa__line" x="112" y="275" width="200" height="10" />
        <rect className="pa__bar" x="112" y="275" width="200" height="10" />
      </Part>

      <Balloon n={1} hover={hover} from={[330, 57]} />
      <Balloon n={2} hover={hover} from={[326, 113]} />
      <Balloon n={3} hover={hover} from={[330, 189]} />
      <Balloon n={4} hover={hover} from={[330, 281]} />
    </>
  )
}

/* ───────── Insight: a dashboard fed by an API, scoped by role, over the data ───────── */
function Insight({ hover, setHover }) {
  const P = { hover, setHover }
  return (
    <>
      <Part i={0} {...P}>
        <rect className="pa__box pa__tint draw" pathLength="1" x="40" y="40" width="290" height="230" />
        <path className="pa__line" d="M40 64H330" />
        {dots(52, 52)}
        <rect className="pa__line" x="226" y="46" width="42" height="12" />
        <rect className="pa__line" x="274" y="46" width="42" height="12" />
        {[56, 146, 236].map((x) => (
          <g key={x}>
            <rect className="pa__box" x={x} y="76" width="78" height="34" />
            <path className="pa__line" d={`M${x + 8} 88h26`} />
            <path className="pa__acc" d={`M${x + 8} 100h44`} />
          </g>
        ))}
        <path className="pa__line" d="M56 250H190M208 250H320" />
        {[30, 52, 40, 74, 60, 90].map((h, k) => (
          <rect key={k} className="pa__rise pa__tint" style={{ '--i': k }} x={64 + k * 20} y={250 - h} width="12" height={h} />
        ))}
        <path className="pa__acc draw" pathLength="1" d="M208 236L232 208 256 220 280 176 304 158 320 146" />
      </Part>

      <Part i={1} {...P}>
        <rect className="pa__box pa__tint" x="330" y="150" width="30" height="36" />
        <text className="pa__txt" x="345" y="172" textAnchor="middle">{'</>'}</text>
      </Part>

      <Part i={2} {...P}>
        <rect className="pa__box pa__tint" x="330" y="214" width="30" height="36" />
        <rect className="pa__acc" x="338" y="232" width="14" height="11" />
        <path className="pa__acc" d="M341 232v-5a4 4 0 0 1 8 0v5" />
      </Part>

      <Part i={3} {...P}>
        {[40, 150, 260].map((x) => (
          <g key={x}>
            <path className="pa__box pa__tint" d={`M${x} 304v34a45 8 0 0 0 90 0v-34`} />
            <ellipse className="pa__box pa__tint" cx={x + 45} cy="304" rx="45" ry="8" />
          </g>
        ))}
        <path className="pa__flow" d="M85 292V272M195 292V272M305 292V272" />
      </Part>

      <Balloon n={1} hover={hover} from={[330, 92]} />
      <Balloon n={2} hover={hover} from={[360, 168]} />
      <Balloon n={3} hover={hover} from={[360, 232]} />
      <Balloon n={4} hover={hover} from={[350, 322]} />
    </>
  )
}

const ARTS = { pos: Pos, audit: Audit, insight: Insight }

export default function ProjectArt({ project, hover = null, setHover = () => {} }) {
  const Art = ARTS[project.id]
  if (!Art) return null
  return (
    <svg className="pa reveal" viewBox="0 0 440 380" role="img" aria-label={`${project.name}: ${project.layers.length} layers, ${project.layers.map((l) => l[0]).join(', ')}`}>
      <Art hover={hover} setHover={setHover} />
    </svg>
  )
}
