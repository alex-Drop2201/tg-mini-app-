import { useId, type ReactNode } from 'react'
import type { Fur, SpeciesId } from '../critter/anatomy.tsx'

// Питомцы в стиле детской книжной иллюстрации: жирный чёрный контур, плоские
// цвета, чудны́е пропорции. Координаты 200×200, земля на y≈190.
// Три варианта отделки: line — глаза-точки и ровная линия; googly — глаза-пуговицы;
// painted — глаза-пуговицы, шершавый контур и фактура краски.

export type DoodleStyle = 'line' | 'googly' | 'painted'

const INK = '#1f1a17'
const WHITE = '#fffaf2'
const PINK = '#ff8fa3'
const TONGUE = '#ff6f7d'

type Paint = { fur: Fur; far: string; o: { stroke: string; strokeWidth: number; strokeLinejoin: 'round'; strokeLinecap: 'round' } }

type EyeSpot = { x: number; y: number; r: number }

type Art = {
  draw: (p: Paint) => ReactNode
  eyes: [EyeSpot, EyeSpot]
  /** Куда смотрят зрачки: сдвиг от центра глаза. */
  look: [number, number]
  /** Рисуется поверх глаз: нос, рот, усы. */
  face: (p: Paint) => ReactNode
}

export function Doodle({ species, fur, style }: { species: SpeciesId; fur: Fur; style: DoodleStyle }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const art = ART[species]
  const paint: Paint = {
    fur,
    far: mix(fur.main, fur.dark, 0.45),
    o: { stroke: INK, strokeWidth: style === 'painted' ? 4.4 : 4, strokeLinejoin: 'round', strokeLinecap: 'round' },
  }
  const painted = style === 'painted'
  return (
    <g filter={painted ? `url(#${uid}-paint)` : undefined}>
      {painted && <PaintFilter id={`${uid}-paint`} />}
      <ellipse cx="100" cy="191" rx="70" ry="5" fill={INK} opacity="0.12" />
      {art.draw(paint)}
      {art.eyes.map((e, i) => (
        <Eye key={i} spot={e} look={art.look} dot={style === 'line'} />
      ))}
      {art.face(paint)}
    </g>
  )
}

/** Шершавый край, как у кисти, и мелкое зерно краски внутри фигур. */
function PaintFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="wobbly" />
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="grain" />
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 -0.52" result="speckle" />
      <feComposite in="speckle" in2="wobbly" operator="in" result="texture" />
      <feMerge>
        <feMergeNode in="wobbly" />
        <feMergeNode in="texture" />
      </feMerge>
    </filter>
  )
}

function Eye({ spot: { x, y, r }, look: [lx, ly], dot }: { spot: EyeSpot; look: [number, number]; dot: boolean }) {
  if (dot) {
    // Глаза-точки, как у колли: чёрная бусинка с крошечным бликом.
    return (
      <g>
        <ellipse cx={x + lx * 0.4} cy={y + ly * 0.4 + 2} rx={r * 0.36} ry={r * 0.44} fill={INK} />
        <circle cx={x + lx * 0.4 + r * 0.12} cy={y + ly * 0.4 - r * 0.1} r={r * 0.11} fill="#ffffff" />
      </g>
    )
  }
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#ffffff" stroke={INK} strokeWidth="3.6" />
      <circle cx={x + lx} cy={y + ly} r={r * 0.27} fill={INK} />
    </g>
  )
}

/** Тонкая часть тела с контуром: хвост, лапа. Сначала чёрная толстая линия, сверху цветная. */
function Tube({ d, width, color }: { d: string; width: number; color: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

const hair = (d: string) => <path d={d} fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />

const ART: Record<SpeciesId, Art> = {
  dachshund: {
    draw: (p) => (
      <>
        <Tube d="M34 128 Q 16 120 12 98" width={7} color={p.fur.main} />
        <rect x="50" y="146" width="15" height="40" rx="7.5" fill={p.far} {...p.o} />
        <rect x="128" y="146" width="15" height="40" rx="7.5" fill={p.far} {...p.o} />
        <path d="M30 130 C 30 114, 42 106, 60 106 L 122 106 C 142 106, 152 118, 152 134 C 152 150, 140 160, 122 160 L 58 160 C 40 160, 30 148, 30 130 Z" fill={p.fur.main} {...p.o} />
        <path d="M58 140 C 74 150, 110 150, 128 138" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" opacity="0.8" />
        <rect x="36" y="148" width="16" height="40" rx="8" fill={p.fur.main} {...p.o} />
        <rect x="114" y="148" width="16" height="40" rx="8" fill={p.fur.main} {...p.o} />
        {hair('M40 182 l0 5 M46 182 l0 5 M120 182 l0 5 M126 182 l0 5')}
        <path d="M146 54 C 116 40, 84 52, 82 80 C 86 98, 112 98, 128 86 C 136 80, 142 72, 146 64 Z" fill={p.fur.dark} {...p.o} />
        <path d="M120 116 C 112 86, 120 54, 152 46 C 176 42, 188 58, 186 76 C 188 92, 196 104, 199 116 C 194 124, 182 126, 170 122 C 158 120, 150 126, 146 136 C 136 136, 124 128, 120 116 Z" fill={p.fur.main} {...p.o} />
        {hair('M148 46 l-5 -11 M156 44 l0 -12 M164 45 l5 -10')}
      </>
    ),
    eyes: [
      { x: 151, y: 66, r: 13 },
      { x: 176, y: 62, r: 11 },
    ],
    look: [3, 1],
    face: (p) => (
      <>
        <path d="M156 121 C 150 134, 158 142, 166 136 C 169 131, 167 126, 164 122 Z" fill={TONGUE} {...p.o} strokeWidth={3} />
        <path d="M146 116 Q 172 126 194 120" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
        <ellipse cx="196" cy="115" rx="6.5" ry="5.5" fill={INK} transform="rotate(-20 196 115)" />
      </>
    ),
  },
  cat: {
    draw: (p) => (
      <>
        <Tube d="M134 178 C 170 176, 178 140, 160 120" width={9} color={p.fur.main} />
        <path d="M58 190 C 52 150, 64 116, 100 112 C 136 116, 148 150, 142 190 Z" fill={p.fur.main} {...p.o} />
        <path d="M80 190 C 78 162, 88 140, 100 138 C 112 140, 122 162, 120 190 Z" fill={p.fur.light} />
        {hair('M62 150 l10 2 M60 162 l10 1 M138 150 l-10 2 M140 162 l-10 1')}
        <ellipse cx="84" cy="186" rx="13" ry="8" fill={p.fur.main} {...p.o} />
        <ellipse cx="116" cy="186" rx="13" ry="8" fill={p.fur.main} {...p.o} />
        {hair('M80 184 l0 5 M88 184 l0 5 M112 184 l0 5 M120 184 l0 5')}
        <path d="M52 66 L56 16 L94 40 Z" fill={p.fur.main} {...p.o} />
        <path d="M62 54 L64 30 L82 42 Z" fill={PINK} />
        <path d="M148 66 L144 16 L106 40 Z" fill={p.fur.main} {...p.o} />
        <path d="M138 54 L136 30 L118 42 Z" fill={PINK} />
        <path d="M46 84 C 46 52, 72 34, 100 34 C 128 34, 154 52, 154 84 C 154 112, 130 128, 100 128 C 70 128, 46 112, 46 84 Z" fill={p.fur.main} {...p.o} />
        {hair('M92 40 l2 10 M100 38 l0 12 M108 40 l-2 10 M48 80 l10 2 M48 90 l9 0 M152 80 l-10 2 M152 90 l-9 0')}
      </>
    ),
    eyes: [
      { x: 80, y: 76, r: 17 },
      { x: 120, y: 76, r: 17 },
    ],
    look: [2, 3],
    face: () => (
      <>
        <path d="M94 97 L106 97 L100 104 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 104 v4 M89 110 Q94.5 116 100 108 Q105.5 116 111 110" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <g stroke={INK} strokeWidth="1.8" strokeLinecap="round">
          <path d="M84 102 L46 96 M84 106 L44 108" />
          <path d="M116 102 L154 96 M116 106 L156 108" />
        </g>
      </>
    ),
  },
  fox: {
    draw: (p) => (
      <>
        <path d="M74 182 C 32 188, 12 150, 26 116 C 36 138, 52 150, 76 158 Z" fill={p.fur.main} {...p.o} />
        <path d="M26 116 C 18 132, 20 146, 28 154 C 34 142, 34 128, 26 116 Z" fill={WHITE} {...p.o} strokeWidth={3} />
        <path d="M62 190 C 54 146, 66 98, 102 94 C 136 98, 148 146, 140 190 Z" fill={p.fur.main} {...p.o} />
        <path d="M98 190 C 94 160, 102 132, 116 124 C 128 134, 132 166, 128 190 Z" fill={WHITE} />
        <ellipse cx="92" cy="186" rx="12" ry="8" fill={p.fur.dark} {...p.o} />
        <ellipse cx="124" cy="186" rx="12" ry="8" fill={p.fur.dark} {...p.o} />
        <path d="M68 60 L70 8 L102 40 Z" fill={p.fur.main} {...p.o} />
        <path d="M70 8 L70 26 L84 22 Z" fill={p.fur.dark} />
        <path d="M122 42 L140 2 L152 50 Z" fill={p.fur.main} {...p.o} />
        <path d="M140 2 L136 20 L148 22 Z" fill={p.fur.dark} />
        <path d="M60 72 C 60 42, 86 30, 110 32 C 134 34, 150 50, 152 64 C 166 70, 182 80, 194 90 C 184 102, 162 106, 140 104 C 124 112, 100 114, 84 108 C 68 102, 60 90, 60 72 Z" fill={p.fur.main} {...p.o} />
        <path d="M64 86 C 76 104, 100 110, 124 106 C 140 104, 162 104, 186 98 C 166 100, 142 96, 128 92 C 110 96, 84 96, 64 86 Z" fill={WHITE} />
        {hair('M96 32 l-2 -10 M104 31 l1 -10')}
      </>
    ),
    eyes: [
      { x: 104, y: 62, r: 15 },
      { x: 132, y: 60, r: 13 },
    ],
    look: [4, 1],
    face: () => (
      <>
        <path d="M150 100 Q 170 104 188 96" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="192" cy="90" rx="6.5" ry="5.5" fill={INK} />
      </>
    ),
  },
  // Корги и зайчик появятся в этом стиле после выбора варианта.
  corgi: { draw: () => null, eyes: [{ x: 0, y: 0, r: 0 }, { x: 0, y: 0, r: 0 }], look: [0, 0], face: () => null },
  bunny: { draw: () => null, eyes: [{ x: 0, y: 0, r: 0 }, { x: 0, y: 0, r: 0 }], look: [0, 0], face: () => null },
}

/** Смесь двух цветов #rrggbb: t=0 — первый, t=1 — второй. */
function mix(a: string, b: string, t: number) {
  const ca = rgb(a)
  const cb = rgb(b)
  return `#${ca.map((c, i) => Math.round(c + (cb[i] - c) * t).toString(16).padStart(2, '0')).join('')}`
}

function rgb(hex: string) {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}
