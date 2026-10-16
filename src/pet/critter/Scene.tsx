import { useId, type ReactNode } from 'react'
import { SCENES, type Look, type SceneId } from '../look.ts'
import type { Mood } from '../model.ts'
import { ANATOMY } from './anatomy.tsx'
import { Critter, type Activity } from './Critter.tsx'

// Сцена 320×230: фон, ночное небо поверх фона, когда питомец спит, и сам питомец.
// Питомец сдвинут на (30, 52), поэтому его земля (y=150) приходится на y≈202, на пол сцены.

const PET_OFFSET = [30, 52] as const

type Props = {
  look: Look
  mood: Mood
  activity?: Activity | null
  dirt?: number
  /** Без анимаций: для маленьких превью. */
  still?: boolean
  /** Заполнить рамку другой пропорции, обрезав небо, а не землю. */
  crop?: boolean
  onClick?: () => void
  className?: string
}

export function Scene({ look, mood, activity = null, dirt = 0, still = false, crop = false, onClick, className = '' }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg
      className={`scene-art${still ? ' still' : ''} ${className}`}
      viewBox="0 0 320 230"
      preserveAspectRatio={crop ? 'xMidYMax slice' : undefined}
      role="img"
      aria-label={SCENES[look.scene]}
      onClick={onClick}
    >
      <Backdrop id={look.scene} uid={uid} />
      <NightSky visible={mood === 'sleeping'} />
      <g transform={`translate(${PET_OFFSET[0]} ${PET_OFFSET[1]})`}>
        <Critter look={look} mood={mood} activity={activity} dirt={dirt} />
      </g>
    </svg>
  )
}

/** Только питомец, без фона: карточки выбора вида. */
export function CritterPreview({ look, mood = 'happy' }: { look: Look; mood?: Mood }) {
  return (
    <svg className="critter-preview still" viewBox="8 4 250 156" aria-hidden>
      <Critter look={look} mood={mood} />
    </svg>
  )
}

/** Крупный план головы или шеи: карточки аксессуаров. */
export function CloseUp({ look, part }: { look: Look; part: 'head' | 'neck' }) {
  const a = ANATOMY[look.species]
  const [x, y] = part === 'head' ? a.hat.at : a.neck
  const box = part === 'head' ? `${x - 50} ${y - 42} 104 104` : `${x - 48} ${y - 40} 100 100`
  return (
    <svg className="critter-preview still" viewBox={box} aria-hidden>
      <Critter look={look} mood="ok" />
    </svg>
  )
}

function Backdrop({ id, uid }: { id: SceneId; uid: string }) {
  const sky = `${uid}-sky`
  const ground = `${uid}-ground`
  const art = BACKDROPS[id]
  return (
    <g>
      <defs>
        <Gradient id={sky} stops={art.sky} />
        <Gradient id={ground} stops={art.ground} />
      </defs>
      <rect width="320" height="230" fill={`url(#${sky})`} />
      {art.back}
      <path d={art.groundPath ?? 'M0 176 H320 V230 H0 Z'} fill={`url(#${ground})`} />
      {art.front}
    </g>
  )
}

function Gradient({ id, stops }: { id: string; stops: [string, string] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={stops[0]} />
      <stop offset="1" stopColor={stops[1]} />
    </linearGradient>
  )
}

const cloud = (x: number, y: number, s = 1) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff">
    <ellipse cx="0" cy="0" rx="22" ry="11" />
    <ellipse cx="18" cy="-7" rx="17" ry="12" />
    <ellipse cx="36" cy="0" rx="20" ry="10" />
  </g>
)

const sun = (x: number, y: number) => (
  <g>
    <circle cx={x} cy={y} r="32" fill="#ffe066" opacity="0.3" />
    <circle cx={x} cy={y} r="21" fill="#ffd43b" />
  </g>
)

const pine = (x: number, s = 1) => (
  <g transform={`translate(${x} 178) scale(${s})`}>
    <rect x="-4" y="-10" width="8" height="12" fill="#7a5235" />
    <path d="M-26 -10 L0 -46 L26 -10 Z" fill="#2f855a" />
    <path d="M-21 -32 L0 -66 L21 -32 Z" fill="#38a169" />
    <path d="M-10 -52 L0 -66 L10 -52 Z M-14 -22 L-6 -28 L2 -22 Z" fill="#ffffff" opacity="0.9" />
  </g>
)

const STARS = [
  [22, 20, 1.2], [58, 64, 0.9], [96, 18, 1.4], [132, 52, 1], [170, 14, 1.1], [204, 40, 0.8],
  [226, 92, 1], [300, 110, 1.2], [14, 120, 0.9], [72, 140, 1], [300, 18, 1.1], [116, 96, 0.8],
]

type Backdrop = {
  sky: [string, string]
  ground: [string, string]
  groundPath?: string
  back?: ReactNode
  front?: ReactNode
}

const BACKDROPS: Record<SceneId, Backdrop> = {
  room: {
    sky: ['#fdebd8', '#f6d9bf'],
    ground: ['#d9a677', '#c48e60'],
    back: (
      <g>
        <rect x="26" y="24" width="74" height="62" rx="8" fill="#bfe5ff" stroke="#ffffff" strokeWidth="5" />
        {cloud(42, 46, 0.45)}
        <path d="M63 24 V86 M26 55 H100" stroke="#ffffff" strokeWidth="4" />
        <rect x="236" y="30" width="52" height="40" rx="4" fill="#fff3e0" stroke="#c9915f" strokeWidth="4" />
        <path d="M241 66 L254 50 L264 60 L272 52 L284 66 Z" fill="#8fc98a" />
        <circle cx="275" cy="42" r="4" fill="#ffcc4d" />
        <rect x="0" y="170" width="320" height="7" fill="#ecc8a1" />
      </g>
    ),
    front: (
      <g>
        <path d="M0 198 H320 M0 216 H320" stroke="#000000" strokeOpacity="0.06" strokeWidth="2" />
        <ellipse cx="166" cy="205" rx="122" ry="13" fill="#ffffff" opacity="0.28" />
      </g>
    ),
  },
  park: {
    sky: ['#8fd3ff', '#dbf3ff'],
    ground: ['#86d36f', '#67bb57'],
    back: (
      <g>
        {sun(272, 40)}
        {cloud(58, 40)}
        {cloud(170, 26, 0.8)}
        <ellipse cx="60" cy="184" rx="150" ry="34" fill="#a8e09a" />
        <ellipse cx="275" cy="186" rx="120" ry="28" fill="#98d78a" />
      </g>
    ),
    front: (
      <g>
        <circle cx="36" cy="200" r="3" fill="#ffffff" />
        <circle cx="300" cy="210" r="3" fill="#ffd43b" />
        <circle cx="18" cy="222" r="3" fill="#ff8fab" />
        <circle cx="290" cy="224" r="3" fill="#ffffff" />
        <path d="M10 196 l4 -8 l4 8 M306 196 l4 -8 l4 8" stroke="#4f9e45" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  beach: {
    sky: ['#7dd3fc', '#e3f7ff'],
    ground: ['#f7e0a8', '#ebc685'],
    groundPath: 'M0 180 Q 80 172 160 178 T 320 176 V230 H0 Z',
    back: (
      <g>
        {sun(62, 44)}
        {cloud(196, 34, 0.7)}
        <path d="M222 62 q6 -6 12 0 q6 -6 12 0" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="0" y="146" width="320" height="40" fill="#38bdf8" />
        <path d="M10 160 q10 -5 20 0 t20 0 M120 168 q10 -5 20 0 t20 0 M230 158 q10 -5 20 0 t20 0" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.7" />
      </g>
    ),
    front: (
      <path
        d="M292 212 l3 -8 l3 8 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 Z"
        fill="#ff8a5b"
      />
    ),
  },
  space: {
    sky: ['#120a2a', '#2d1660'],
    ground: ['#9490ad', '#7a7693'],
    groundPath: 'M0 184 Q 160 168 320 184 V230 H0 Z',
    back: (
      <g>
        {STARS.map(([x, y, r], i) => (
          <circle key={i} className={i % 3 === 0 ? 'twinkle' : undefined} cx={x} cy={y} r={r} fill="#ffffff" />
        ))}
        <circle cx="262" cy="52" r="20" fill="#ff9ecd" />
        <ellipse cx="262" cy="54" rx="34" ry="8" fill="none" stroke="#ffd6ec" strokeWidth="3" transform="rotate(-15 262 54)" />
        <circle cx="42" cy="44" r="8" fill="#7dd3fc" />
      </g>
    ),
    front: (
      <g fill="#6f6b88">
        <ellipse cx="44" cy="206" rx="16" ry="5" />
        <ellipse cx="270" cy="214" rx="22" ry="6" />
        <ellipse cx="150" cy="224" rx="12" ry="3.5" />
      </g>
    ),
  },
  snow: {
    sky: ['#bfe3ff', '#f0f8ff'],
    ground: ['#ffffff', '#e2effb'],
    groundPath: 'M0 182 Q 160 170 320 182 V230 H0 Z',
    back: (
      <g>
        {pine(30, 1.1)}
        {pine(70, 0.75)}
        {pine(292, 1)}
        {[
          [40, 20], [120, 40], [200, 16], [260, 60], [90, 90], [180, 100], [300, 120], [20, 140],
        ].map(([x, y], i) => (
          <circle key={i} className="flake" cx={x} cy={y} r="2.2" fill="#ffffff" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </g>
    ),
  },
}

function NightSky({ visible }: { visible: boolean }) {
  return (
    <g className={`night-sky${visible ? ' on' : ''}`}>
      <rect width="320" height="230" fill="#0b1033" opacity="0.6" />
      {/* Луна левее правого угла: там кнопка «Внешность» и «Z-z-z» */}
      <path d="M232 14 a15 15 0 1 0 12 26 a12 12 0 1 1 -12 -26 Z" fill="#fff3c4" />
      {STARS.slice(0, 7).map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" />
      ))}
    </g>
  )
}
