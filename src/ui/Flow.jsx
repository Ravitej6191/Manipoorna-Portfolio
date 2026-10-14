// A flow chart for one project, drawn as a proper diagram: rounded terminators for the start and end, boxes for
// steps, a diamond for a check, arrows with heads, and a dashed loop back when a check fails. A dot travels the
// main path and each node lights as it passes. Steps come from the project's `flow` array:
// { kind: 'start' | 'step' | 'check' | 'end', title, text, back? } where `back` is the 1-based step to return to.

// break text into lines of at most `n` characters
const wrap = (text, n) => {
  const lines = []
  let line = ''
  text.split(' ').forEach((w) => {
    if ((line + ' ' + w).trim().length > n && line) {
      lines.push(line)
      line = w
    } else line = (line + ' ' + w).trim()
  })
  if (line) lines.push(line)
  return lines
}

function Shape({ kind, cx, cy, hw }) {
  if (kind === 'check') {
    return <polygon className="fl__shape fl__shape--check" points={`${cx},${cy - 58} ${cx + hw},${cy} ${cx},${cy + 58} ${cx - hw},${cy}`} />
  }
  const rx = kind === 'step' ? 3 : 42
  return <rect className={`fl__shape fl__shape--${kind}`} x={cx - hw} y={cy - 42} width={hw * 2} height="84" rx={rx} />
}

const half = (kind) => (kind === 'check' ? 90 : 74)

// the title (and its number) inside a node, centred on (cx, cy)
function Label({ s, i, cx, cy }) {
  const lines = wrap(s.title, s.kind === 'check' ? 10 : 14)
  const y0 = cy + 7 - (lines.length - 1) * 8
  return (
    <>
      <text className="fl__no" x={cx} y={cy - (lines.length > 1 ? 24 : 17)} textAnchor="middle">{String(i + 1).padStart(2, '0')}</text>
      {lines.map((l, k) => (
        <text key={k} className="fl__title" x={cx} y={y0 + k * 16 + (lines.length > 1 ? 5 : 0)} textAnchor="middle">{l}</text>
      ))}
    </>
  )
}

function Horizontal({ steps }) {
  const N = steps.length
  const W = Math.max(1000, 200 * N)
  const pad = 96
  const gap = (W - pad * 2) / (N - 1)
  const cx = (i) => pad + i * gap
  const cy = 100
  const H = 262
  return (
    <svg className="fl fl--h" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {/* the dot that travels the main path, behind the nodes so it only shows on the arrows */}
      <path id="fl-run" className="fl__packet-path" d={`M${cx(0)} ${cy}H${cx(N - 1)}`} />
      <circle className="fl__packet" r="5" style={{ offsetPath: `path('M${cx(0)} ${cy}H${cx(N - 1)}')`, '--t': `${N * 1.4}s` }} />

      {steps.slice(0, -1).map((s, i) => {
        const x1 = cx(i) + half(s.kind) + 2
        const x2 = cx(i + 1) - half(steps[i + 1].kind) - 2
        return (
          <g key={i} className="fl__arrow">
            <path d={`M${x1} ${cy}H${x2 - 8}`} />
            <polygon points={`${x2},${cy} ${x2 - 10},${cy - 5.5} ${x2 - 10},${cy + 5.5}`} />
            {s.kind === 'check' && <text x={(x1 + x2) / 2} y={cy - 9} textAnchor="middle">YES</text>}
          </g>
        )
      })}

      {steps.map((s, i) =>
        s.back ? (
          <g key={'b' + i} className="fl__loop">
            <path d={`M${cx(i)} ${cy - 58}V26H${cx(s.back - 1)}V${cy - 49}`} />
            <polygon points={`${cx(s.back - 1)},${cy - 44} ${cx(s.back - 1) - 6},${cy - 55} ${cx(s.back - 1) + 6},${cy - 55}`} />
            <text x={cx(i) + 10} y="42">NO</text>
          </g>
        ) : null,
      )}

      {steps.map((s, i) => (
        <g key={s.title} className="fl__node" style={{ '--i': i, '--d': `${(i * (N * 1.4 - 0.4)) / (N - 1) + 0.1}s`, '--t': `${N * 1.4}s` }}>
          <Shape kind={s.kind} cx={cx(i)} cy={cy} hw={half(s.kind)} />
          <Label s={s} i={i} cx={cx(i)} cy={cy} />
          {wrap(s.text, 24).map((l, k) => (
            <text key={k} className="fl__text" x={cx(i)} y={cy + 88 + k * 18} textAnchor="middle">{l}</text>
          ))}
        </g>
      ))}
    </svg>
  )
}

function Vertical({ steps }) {
  const N = steps.length
  const row = 142
  const cx = 122
  const cy = (i) => 66 + i * row
  const H = cy(N - 1) + 76
  return (
    <svg className="fl fl--v" viewBox={`0 0 400 ${H}`} aria-hidden="true">
      {steps.slice(0, -1).map((s, i) => {
        const y1 = cy(i) + (s.kind === 'check' ? 60 : 44)
        const y2 = cy(i + 1) - (steps[i + 1].kind === 'check' ? 60 : 44)
        return (
          <g key={i} className="fl__arrow">
            <path d={`M${cx} ${y1}V${y2 - 8}`} />
            <polygon points={`${cx},${y2} ${cx - 5.5},${y2 - 10} ${cx + 5.5},${y2 - 10}`} />
            {s.kind === 'check' && <text x={cx + 10} y={(y1 + y2) / 2 + 4}>YES</text>}
          </g>
        )
      })}

      {steps.map((s, i) =>
        s.back ? (
          <g key={'b' + i} className="fl__loop">
            <path d={`M${cx - 90} ${cy(i)}H12V${cy(s.back - 1)}H${cx - 84}`} />
            <polygon points={`${cx - 76},${cy(s.back - 1)} ${cx - 87},${cy(s.back - 1) - 6} ${cx - 87},${cy(s.back - 1) + 6}`} />
            <text x="18" y={cy(i) - 8}>NO</text>
          </g>
        ) : null,
      )}

      {steps.map((s, i) => (
        <g key={s.title} className="fl__node" style={{ '--i': i, '--d': `${i * 1.1}s`, '--t': `${N * 1.1}s` }}>
          <Shape kind={s.kind} cx={cx} cy={cy(i)} hw={half(s.kind)} />
          <Label s={s} i={i} cx={cx} cy={cy(i)} />
          {wrap(s.text, 21).map((l, k) => (
            <text key={k} className="fl__text fl__text--side" x="226" y={cy(i) - 8 + k * 18}>{l}</text>
          ))}
        </g>
      ))}
    </svg>
  )
}

export default function Flow({ steps }) {
  return (
    <figure className="flow">
      <Horizontal steps={steps} />
      <Vertical steps={steps} />
      <ol className="sr-only">
        {steps.map((s) => (
          <li key={s.title}>
            {s.title}: {s.text}
            {s.back ? ` If not, go back to step ${s.back}.` : ''}
          </li>
        ))}
      </ol>
    </figure>
  )
}
