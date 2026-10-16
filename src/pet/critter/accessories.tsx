import type { ReactNode } from 'react'
import type { GlassesId, HatId, NeckwearId } from '../look.ts'
import type { Point } from './anatomy.tsx'

// Аксессуары рисуются вокруг точки (0, 0) и переносятся на точку крепления вида:
// шапки — на макушку, очки — на глаз, шейные — на середину шеи.

const HEART = 'M0 3 C0 -1 -6 -2 -6 2 C-6 5 -2 7 0 9 C2 7 6 5 6 2 C6 -2 0 -1 0 3 Z'

export function Hat({ id, at, angle }: { id: HatId; at: Point; angle: number }) {
  if (id === 'none') return null
  return <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle})`}>{HAT_ART[id]}</g>
}

const HAT_ART: Record<Exclude<HatId, 'none'>, ReactNode> = {
  bow: (
    <g>
      <path d="M0 -4 L-15 -13 Q-18 -4 -15 5 Z" fill="#ff5c8a" />
      <path d="M0 -4 L15 -13 Q18 -4 15 5 Z" fill="#ff5c8a" />
      <path d="M-12 -9 L-4 -5 M12 -9 L4 -5" stroke="#d6336c" strokeWidth="1.4" strokeLinecap="round" />
      <circle cy="-4" r="4.5" fill="#e64980" />
    </g>
  ),
  beanie: (
    <g>
      <path d="M-20 0 C -20 -26, 20 -26, 20 0 Z" fill="#e5484d" />
      <path d="M-10 -18 L-10 -2 M0 -20 L0 -2 M10 -18 L10 -2" stroke="#c9363b" strokeWidth="2.5" />
      <rect x="-22" y="-5" width="44" height="9" rx="4.5" fill="#fff4f0" />
      <circle cy="-22" r="6.5" fill="#fff4f0" />
    </g>
  ),
  crown: (
    <g>
      <path d="M-16 0 L-18 -18 L-8 -9 L0 -22 L8 -9 L18 -18 L16 0 Z" fill="#ffcc33" stroke="#e0a100" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="-18" cy="-18" r="2.2" fill="#ffcc33" />
      <circle cy="-22" r="2.2" fill="#ffcc33" />
      <circle cx="18" cy="-18" r="2.2" fill="#ffcc33" />
      <circle cy="-6" r="2.8" fill="#e5484d" />
      <circle cx="-9" cy="-5" r="2" fill="#3b82f6" />
      <circle cx="9" cy="-5" r="2" fill="#22c55e" />
    </g>
  ),
  party: (
    <g>
      <path d="M-13 0 L0 -34 L13 0 Z" fill="#8b5cf6" />
      <path d="M-9 -10 L9 -10 M-5 -21 L5 -21" stroke="#ffd60a" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="-4" cy="-4" r="1.6" fill="#ff5c8a" />
      <circle cx="5" cy="-15" r="1.6" fill="#22d3ee" />
      <circle cy="-35" r="4.5" fill="#ffd60a" />
    </g>
  ),
  flower: (
    <g transform="translate(-4 -4)">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cy="-6" rx="4" ry="6" fill="#ffffff" stroke="#f9c6d8" strokeWidth="1" transform={`rotate(${a})`} />
      ))}
      <circle r="4" fill="#ffc83d" />
    </g>
  ),
}

/** Очки вокруг глаза. Дужка уходит назад к уху, перемычка — вперёд к морде. */
export function Glasses({ id, at }: { id: GlassesId; at: Point }) {
  if (id === 'none') return null
  const frame = id === 'sun' ? '#1c1c1e' : id === 'hearts' ? '#c9184a' : '#2b2b2b'
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <path d="M-9 -2 L-26 -6 M9 1 L16 4" stroke={frame} strokeWidth="2" strokeLinecap="round" fill="none" />
      {id === 'round' && <circle r="9.5" fill="rgba(255,255,255,0.2)" stroke={frame} strokeWidth="2.2" />}
      {id === 'sun' && (
        <>
          <rect x="-11" y="-8" width="22" height="15" rx="7" fill="#1c1c1e" />
          <path d="M-6 -4 L-1 -4" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        </>
      )}
      {id === 'hearts' && (
        <path d={HEART} transform="translate(0 -6) scale(1.8)" fill="#ff4d6d" fillOpacity="0.9" stroke={frame} strokeWidth="0.8" />
      )}
    </g>
  )
}

/** Шейные аксессуары: ошейник рисуется цветом кнопки из темы Telegram. */
export function Neckwear({ id, at }: { id: NeckwearId; at: Point }) {
  if (id === 'none') return null
  return <g transform={`translate(${at[0]} ${at[1]})`}>{NECK_ART[id]}</g>
}

const NECK_ART: Record<Exclude<NeckwearId, 'none'>, ReactNode> = {
  collar: (
    <g>
      <rect x="-6" y="-15" width="12" height="30" rx="5" className="pet-collar" />
      <circle cx="2" cy="17" r="4.5" fill="#f5c542" />
    </g>
  ),
  bowtie: (
    <g transform="translate(5 13)">
      <path d="M0 0 L-12 -8 L-12 8 Z" fill="#e5484d" />
      <path d="M0 0 L12 -8 L12 8 Z" fill="#e5484d" />
      <rect x="-3.5" y="-4" width="7" height="8" rx="2" fill="#b4232c" />
    </g>
  ),
  bandana: (
    <g>
      <path d="M-7 -13 L10 -6 L3 24 Z" fill="#e5484d" strokeLinejoin="round" />
      <circle cx="2" cy="-3" r="1.6" fill="#fff" />
      <circle cx="4" cy="8" r="1.6" fill="#fff" />
      <circle cx="-1" cy="4" r="1.3" fill="#fff" />
      <circle cx="3" cy="16" r="1.3" fill="#fff" />
    </g>
  ),
  scarf: (
    <g>
      <rect x="-12" y="4" width="10" height="26" rx="4" fill="#3b82f6" transform="rotate(16 -7 4)" />
      <rect x="-8" y="-15" width="16" height="30" rx="7" fill="#3b82f6" />
      <path d="M-8 -6 H8 M-8 3 H8" stroke="#ffffff" strokeWidth="3" />
    </g>
  ),
}
