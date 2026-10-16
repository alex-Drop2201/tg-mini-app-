import type { CSSProperties } from 'react'
import { FURS, type Look } from '../look.ts'
import type { Mood } from '../model.ts'
import { Glasses, Hat, Neckwear } from './accessories.tsx'
import { ANATOMY, INK, whiskerLines, type Point } from './anatomy.tsx'

export type Activity = 'eat' | 'play' | 'wash' | 'pet'

type Props = {
  look: Look
  mood: Mood
  activity?: Activity | null
  /** Насколько зверёк грязный: 0 — чистый, 1 — очень. */
  dirt?: number
}

/** Точка, вокруг которой поворачивается часть тела, в координатах рисунка. */
const origin = ([x, y]: Point): CSSProperties => ({ transformOrigin: `${x}px ${y}px` })

/**
 * Зверёк в координатах 260×170. Анимации задаются в pet.css через классы
 * mood-* и doing-*, а углы и смещения конкретного вида — через CSS-переменные.
 */
export function Critter({ look, mood, activity = null, dirt = 0 }: Props) {
  const a = ANATOMY[look.species]
  const fur = FURS[look.fur]
  const joyful = activity === 'pet' || activity === 'play'
  // На тёмной шерсти тёмные линии лица не видно: рисуем их светлыми.
  const dark = look.fur === 'black' || look.fur === 'chocolate'
  const ink = dark ? '#f3e6dc' : INK
  const [left, right] = a.span
  const center = (left + right) / 2
  const [hx, hy] = a.hat.at

  const vars = {
    '--ear-happy': `${a.ear.happy}deg`,
    '--ear-sad': `${a.ear.sad}deg`,
    '--sleep-dy': `${a.sleepDy}px`,
    '--eat-from': `${a.eat.from}deg`,
    '--eat-to': `${a.eat.to}deg`,
  } as CSSProperties

  return (
    <g className={`critter mood-${mood}${activity ? ` doing-${activity}` : ''}`} style={vars}>
      <ellipse className="pet-shadow" cx={center} cy="151" rx={(right - left) / 2} ry="7" />
      {activity === 'eat' && <Bowl x={a.eat.bowlX} />}

      <g className="pet-figure">
        <g className="pet-tail" style={origin(a.tail.origin)}>
          {a.tail.draw(fur)}
        </g>
        <g className="pet-legs">{a.farLegs(fur)}</g>
        <g className="pet-breath">
          {a.torso(fur)}
          {dirt > 0 && (
            <g className="pet-dirt" style={{ opacity: dirt }}>
              {a.dirt.map(([cx, cy, r]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
              ))}
            </g>
          )}
        </g>
        <g className="pet-legs">{a.nearLegs(fur)}</g>
        <Neckwear id={look.neck} at={a.neck} />

        <g className="pet-head" style={origin(a.headOrigin)}>
          {a.farEar && (
            <g className="pet-ear" style={origin(a.farEar.origin)}>
              {a.farEar.draw(fur)}
            </g>
          )}
          {a.head(fur)}
          {a.whiskers && whiskerLines(a.whiskers)}
          <Mouth at={a.mouth} scale={a.mouthScale} mood={mood} open={activity === 'eat' || joyful} ink={ink} />
          <ellipse className="pet-cheek" cx={a.cheek[0]} cy={a.cheek[1]} rx="5" ry="3" />
          <Eye at={a.eye} mood={mood} joyful={joyful} ink={ink} ring={dark} />
          {mood === 'sad' && <Line d={brow(a.eye)} ink={ink} />}
          <Glasses id={look.glasses} at={a.eye} />
          <g className="pet-ear" style={origin(a.nearEar.origin)}>
            {a.nearEar.draw(fur)}
          </g>
          <Hat id={look.hat} at={a.hat.at} angle={a.hat.angle} />
        </g>
      </g>

      {activity === 'play' && <Ball x={a.eat.bowlX + 4} />}
      {activity === 'wash' && <Bubbles x={center} />}
      {activity === 'pet' && <Hearts x={hx} y={hy} />}
      {mood === 'sleeping' && <Snore x={hx} y={hy} />}
      {dirt > 0.6 && <Stink x={center} />}
    </g>
  )
}

function Line({ d, ink }: { d: string; ink: string }) {
  return <path d={d} fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
}

function brow([x, y]: Point) {
  // Грустная бровь «домиком»: край у носа приподнят.
  return `M${x - 8} ${y - 8} Q${x - 1} ${y - 9} ${x + 6} ${y - 15}`
}

function Eye({ at: [x, y], mood, joyful, ink, ring }: { at: Point; mood: Mood; joyful: boolean; ink: string; ring: boolean }) {
  if (mood === 'sleeping') return <Line d={`M${x - 6} ${y + 1} Q${x} ${y + 6} ${x + 6} ${y + 1}`} ink={ink} />
  if (joyful) return <Line d={`M${x - 6} ${y + 3} Q${x} ${y - 5} ${x + 6} ${y + 3}`} ink={ink} />
  return (
    <g className="pet-eye" style={origin([x, y])}>
      <ellipse
        cx={x}
        cy={y}
        rx="5.5"
        ry="6.5"
        fill={INK}
        stroke={ring ? '#f3e6dc' : 'none'}
        strokeWidth="1.4"
      />
      <circle cx={x + 2} cy={y - 3} r="2" fill="#fff" />
    </g>
  )
}

function Mouth({ at: [x, y], scale: s, mood, open, ink }: { at: Point; scale: number; mood: Mood; open: boolean; ink: string }) {
  if (open || mood === 'happy') {
    return (
      <g>
        <path d={`M${x - 10 * s} ${y - s} Q${x} ${y + 11 * s} ${x + 11 * s} ${y - s} Z`} fill={INK} />
        <ellipse cx={x - s} cy={y + 5 * s} rx={5 * s} ry={4 * s} fill="#ff7a8a" />
      </g>
    )
  }
  if (mood === 'sad') return <Line d={`M${x - 7 * s} ${y + 4 * s} Q${x} ${y - s} ${x + 8 * s} ${y + 4 * s}`} ink={ink} />
  return <Line d={`M${x - 7 * s} ${y} Q${x} ${y + 5 * s} ${x + 8 * s} ${y}`} ink={ink} />
}

function Bowl({ x }: { x: number }) {
  return (
    <g className="bowl">
      <circle cx={x - 11} cy="137" r="3.5" />
      <circle cx={x - 3} cy="135" r="3.5" />
      <circle cx={x + 5} cy="137" r="3.5" />
      <circle cx={x + 12} cy="138" r="3" />
      <path className="bowl-dish" d={`M${x - 22} 139 H${x + 21} L${x + 15} 151 H${x - 16} Z`} />
    </g>
  )
}

function Ball({ x }: { x: number }) {
  return (
    <g className="ball">
      <circle cx={x} cy="140" r="9" />
      <path d={`M${x - 7} 135 Q${x} 140 ${x - 7} 146 M${x + 7} 134 Q${x} 140 ${x + 7} 146`} />
    </g>
  )
}

const BUBBLES = [
  [-62, 74, 7, 0],
  [-20, 66, 9, 0.3],
  [14, 78, 6, 0.6],
  [-42, 104, 5, 0.9],
  [-4, 96, 8, 0.4],
  [58, 50, 6, 0.75],
]

function Bubbles({ x }: { x: number }) {
  return (
    <g>
      {BUBBLES.map(([dx, cy, r, delay]) => (
        <circle key={dx} className="soap" cx={x + dx} cy={cy} r={r} style={{ animationDelay: `${delay}s` }} />
      ))}
    </g>
  )
}

const HEART = 'M0 3 C0 -1 -6 -2 -6 2 C-6 5 -2 7 0 9 C2 7 6 5 6 2 C6 -2 0 -1 0 3 Z'

function Hearts({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[
        [-8, -10, 0],
        [16, -18, 0.2],
        [-24, -20, 0.4],
      ].map(([dx, dy, delay]) => (
        <g key={dx} transform={`translate(${x + dx} ${y + dy})`}>
          <path className="heart" d={HEART} style={{ animationDelay: `${delay}s` }} />
        </g>
      ))}
    </g>
  )
}

function Snore({ x, y }: { x: number; y: number }) {
  return (
    <g className="snore">
      <text x={x + 30} y={y + 11} fontSize="12">
        z
      </text>
      <text x={x + 42} y={y - 3} fontSize="16">
        z
      </text>
      <text x={x + 56} y={y - 19} fontSize="20">
        Z
      </text>
    </g>
  )
}

function Stink({ x }: { x: number }) {
  return (
    <g className="stink">
      {[-30, -6, 18].map((dx) => (
        <path key={dx} d={`M${x + dx} 70 q-5 -6 0 -12 q5 -6 0 -12`} />
      ))}
    </g>
  )
}
