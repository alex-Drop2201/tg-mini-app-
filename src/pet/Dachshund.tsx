import type { Mood } from './model.ts'

export type Activity = 'eat' | 'play' | 'wash' | 'pet'

type Props = {
  mood: Mood
  activity: Activity | null
  /** Насколько щенок грязный: 0 — чистый, 1 — очень. */
  dirt: number
  onClick?: () => void
}

/**
 * Щенок таксы в профиль, мордой вправо. Анимации (хвост, дыхание, моргание, прыжки)
 * задаются в pet.css через классы mood-* и doing-* на корневом svg.
 */
export function Dachshund({ mood, activity, dirt, onClick }: Props) {
  const joyful = activity === 'pet' || activity === 'play'
  return (
    <svg
      className={`dog mood-${mood}${activity ? ` doing-${activity}` : ''}`}
      viewBox="0 0 260 170"
      role="img"
      aria-label="Щенок таксы"
      onClick={onClick}
    >
      <ellipse className="dog-shadow" cx="135" cy="151" rx="90" ry="7" />
      {activity === 'eat' && <Bowl />}

      <g className="dog-figure">
        <g className="dog-tail">
          <path d="M66 98 Q 46 96 36 76" />
        </g>
        <g className="dog-legs dog-legs-far">
          <rect x="82" y="112" width="14" height="36" rx="7" />
          <rect x="154" y="112" width="14" height="36" rx="7" />
        </g>
        <g className="dog-breath">
          <rect className="dog-body" x="58" y="80" width="112" height="50" rx="25" />
          <ellipse className="dog-belly" cx="112" cy="121" rx="42" ry="8" />
          {dirt > 0 && (
            <g className="dog-dirt" style={{ opacity: dirt }}>
              <circle cx="88" cy="96" r="7" />
              <circle cx="118" cy="110" r="5" />
              <circle cx="142" cy="92" r="6" />
              <circle cx="104" cy="86" r="3.5" />
              <circle cx="72" cy="112" r="4" />
            </g>
          )}
        </g>
        <g className="dog-legs">
          <rect x="68" y="114" width="15" height="36" rx="7.5" />
          <rect x="140" y="114" width="15" height="36" rx="7.5" />
        </g>
        <rect className="dog-collar" x="157" y="92" width="12" height="30" rx="5" />
        <circle className="dog-tag" cx="165" cy="124" r="4.5" />

        <g className="dog-head">
          <circle className="dog-skin" cx="182" cy="76" r="30" />
          <ellipse className="dog-skin" cx="214" cy="88" rx="24" ry="13" />
          <ellipse className="dog-nose" cx="236" cy="84" rx="7" ry="6" />
          <circle className="dog-shine" cx="234" cy="82" r="1.8" />
          <Mouth mood={mood} open={activity === 'eat' || joyful} />
          <ellipse className="dog-cheek" cx="204" cy="85" rx="5" ry="3" />
          <Eye mood={mood} joyful={joyful} />
          {/* Грустная бровь: край у носа приподнят, как «домиком» */}
          {mood === 'sad' && <path className="dog-line" d="M186 62 Q193 61 200 55" />}
          <g className="dog-ear">
            <path d="M174 50 C 154 48, 148 72, 154 98 C 157 110, 172 108, 172 94 C 172 80, 182 64, 174 50 Z" />
          </g>
        </g>
      </g>

      {activity === 'play' && <Ball />}
      {activity === 'wash' && <Bubbles />}
      {activity === 'pet' && <Hearts />}
      {mood === 'sleeping' && <Snore />}
      {dirt > 0.6 && <Stink />}
    </svg>
  )
}

function Eye({ mood, joyful }: { mood: Mood; joyful: boolean }) {
  if (mood === 'sleeping') return <path className="dog-line" d="M188 71 Q194 76 200 71" />
  if (joyful) return <path className="dog-line" d="M188 73 Q194 65 200 73" />
  return (
    <g className="dog-eye">
      <ellipse className="dog-nose" cx="194" cy="70" rx="5.5" ry="6.5" />
      <circle className="dog-shine" cx="196" cy="67" r="2" />
    </g>
  )
}

function Mouth({ mood, open }: { mood: Mood; open: boolean }) {
  if (open || mood === 'happy') {
    return (
      <g className="dog-mouth-open">
        <path className="dog-mouth" d="M207 97 Q217 109 228 97 Z" />
        <ellipse className="dog-tongue" cx="216" cy="103" rx="5" ry="4" />
      </g>
    )
  }
  if (mood === 'sad') return <path className="dog-line" d="M210 101 Q217 96 225 101" />
  return <path className="dog-line" d="M210 97 Q217 102 225 97" />
}

function Bowl() {
  return (
    <g className="bowl">
      <circle cx="224" cy="137" r="3.5" />
      <circle cx="232" cy="135" r="3.5" />
      <circle cx="240" cy="137" r="3.5" />
      <circle cx="247" cy="138" r="3" />
      <path className="bowl-dish" d="M213 139 H256 L250 151 H219 Z" />
    </g>
  )
}

function Ball() {
  return (
    <g className="ball">
      <circle cx="238" cy="140" r="9" />
      <path d="M231 135 Q238 140 231 146 M245 134 Q238 140 245 146" />
    </g>
  )
}

const BUBBLES = [
  [76, 74, 7, 0],
  [118, 66, 9, 0.3],
  [152, 78, 6, 0.6],
  [96, 104, 5, 0.9],
  [134, 96, 8, 0.4],
  [196, 50, 6, 0.75],
]

function Bubbles() {
  return (
    <g>
      {BUBBLES.map(([cx, cy, r, delay]) => (
        <circle
          key={`${cx}-${cy}`}
          className="soap"
          cx={cx}
          cy={cy}
          r={r}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </g>
  )
}

const HEART = 'M0 3 C0 -1 -6 -2 -6 2 C-6 5 -2 7 0 9 C2 7 6 5 6 2 C6 -2 0 -1 0 3 Z'

function Hearts() {
  return (
    <g>
      {[
        [176, 40, 0],
        [200, 32, 0.2],
        [160, 30, 0.4],
      ].map(([x, y, delay]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <path className="heart" d={HEART} style={{ animationDelay: `${delay}s` }} />
        </g>
      ))}
    </g>
  )
}

function Snore() {
  return (
    <g className="snore">
      <text x="216" y="58" fontSize="12">z</text>
      <text x="228" y="44" fontSize="16">z</text>
      <text x="242" y="28" fontSize="20">Z</text>
    </g>
  )
}

function Stink() {
  return (
    <g className="stink">
      <path d="M92 70 q-5 -6 0 -12 q5 -6 0 -12" />
      <path d="M116 64 q-5 -6 0 -12 q5 -6 0 -12" />
      <path d="M140 70 q-5 -6 0 -12 q5 -6 0 -12" />
    </g>
  )
}
