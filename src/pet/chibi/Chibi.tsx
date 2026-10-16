import { useId, type ReactNode } from 'react'
import type { Fur, SpeciesId } from '../critter/anatomy.tsx'

// Питомец анфас в стиле «чиби»: большая голова, большие глаза, объём за счёт
// светотени. Координаты 200×200, земля на y=190, центр головы около (100, 88).

export type Expression = 'ok' | 'happy' | 'joy' | 'sad' | 'sleep' | 'eat'

/**
 * Стиль рисовки: gloss — объём и тонкий контур, flat — плоские цвета и жирный
 * контур, как у стикеров, plush — мягкий «плюшевый» объём без контура и пушок.
 */
export type ChibiStyle = 'gloss' | 'flat' | 'plush'

const INK = '#2b1b17'
const WHITE = '#fff8ef'
const PINK = '#ff8fa3'
const INNER_EAR = '#f6b8b0'

type Paint = {
  fur: Fur
  /** Заливки с объёмом: id градиентов этого экземпляра. */
  head: string
  body: string
  ear: string
  line: string
  /** Контур фигур: свой у каждого стиля. */
  o: { stroke: string; strokeWidth: number; strokeOpacity: number }
  style: ChibiStyle
}

type Art = {
  /** Что за головой: уши, хвост. */
  back: (p: Paint) => ReactNode
  body: (p: Paint) => ReactNode
  head: (p: Paint) => ReactNode
  /** Поверх головы: висячие уши. */
  front?: (p: Paint) => ReactNode
  eyes?: 'dog' | 'cat'
  mouth: 'dog' | 'cat' | 'bunny'
  /** Вертикальное смещение лица: у зайца голова ниже. */
  faceDy?: number
  /** Сдвиг рта вниз: у лисёнка нос ниже, чем у остальных. */
  mouthDy?: number
}

type Props = { species: SpeciesId; fur: Fur; expression: Expression; style?: ChibiStyle }

export function Chibi({ species, fur, expression, style = 'gloss' }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const art = ART[species]
  const flat = style === 'flat'
  const line = mix(fur.dark, '#000000', 0.35)
  const paint: Paint = {
    fur,
    head: flat ? fur.main : `url(#${uid}-head)`,
    body: flat ? fur.main : `url(#${uid}-body)`,
    ear: flat ? fur.dark : `url(#${uid}-ear)`,
    line,
    o: {
      gloss: { stroke: line, strokeWidth: 2.4, strokeOpacity: 0.55 },
      flat: { stroke: INK, strokeWidth: 3.6, strokeOpacity: 1 },
      plush: { stroke: mix(fur.main, '#ffffff', 0.55), strokeWidth: 2, strokeOpacity: 0.7 },
    }[style],
    style,
  }
  const dy = art.faceDy ?? 0
  const soft = style === 'plush'
  return (
    <g className={`chibi face-${expression} chibi-${style}`}>
      <defs>
        <Shade id={`${uid}-head`} light={mix(fur.main, '#ffffff', soft ? 0.5 : 0.38)} base={fur.main} edge={mix(fur.main, fur.dark, soft ? 0.75 : 0.55)} />
        <Shade id={`${uid}-body`} light={mix(fur.main, '#ffffff', soft ? 0.4 : 0.28)} base={fur.main} edge={mix(fur.main, fur.dark, soft ? 0.85 : 0.7)} />
        <Shade id={`${uid}-ear`} light={mix(fur.dark, '#ffffff', 0.18)} base={fur.dark} edge={mix(fur.dark, '#000000', 0.25)} />
      </defs>
      <ellipse cx="100" cy="191" rx="54" ry="6" fill="rgba(0,0,0,0.14)" />
      <g className="chibi-back">{art.back(paint)}</g>
      <g className="chibi-body">
        {art.body(paint)}
        {soft && <Fluff x={100} y={124} color={fur.light} spread={18} up />}
      </g>
      <g className="chibi-head">
        {art.head(paint)}
        {/* Пушок на щеках у «плюшевого» стиля */}
        {soft && (
          <>
            <Fluff x={53} y={98 + dy} color={fur.main} spread={9} side={-1} />
            <Fluff x={147} y={98 + dy} color={fur.main} spread={9} side={1} />
          </>
        )}
        {/* Блик на макушке: даёт ощущение объёма */}
        {!flat && <ellipse cx="84" cy={56 + dy} rx="15" ry="7" fill="#ffffff" opacity={soft ? 0.32 : 0.22} transform={`rotate(-18 84 ${56 + dy})`} />}
        <Face expression={expression} eyes={art.eyes ?? 'dog'} mouth={art.mouth} dy={dy} mouthDy={art.mouthDy ?? 0} line={flat ? INK : paint.line} style={style} />
        {art.front?.(paint)}
      </g>
    </g>
  )
}

/** Пучок шерсти: три зубчика, торчащих вбок или вверх. */
function Fluff({ x, y, color, spread, side = 1, up = false }: { x: number; y: number; color: string; spread: number; side?: 1 | -1; up?: boolean }) {
  const d = up
    ? `M${x - spread} ${y + 6} L${x - spread * 0.6} ${y - 4} L${x - spread * 0.25} ${y + 4} L${x} ${y - 6} L${x + spread * 0.25} ${y + 4} L${x + spread * 0.6} ${y - 4} L${x + spread} ${y + 6} Z`
    : `M${x - side * 6} ${y - spread} L${x + side * 6} ${y - spread * 0.5} L${x} ${y - spread * 0.1} L${x + side * 7} ${y + spread * 0.35} L${x - side * 2} ${y + spread * 0.6} L${x + side * 4} ${y + spread} L${x - side * 8} ${y + spread * 0.8} Z`
  return <path d={d} fill={color} strokeLinejoin="round" />
}

function Shade({ id, light, base, edge }: { id: string; light: string; base: string; edge: string }) {
  return (
    <radialGradient id={id} cx="0.38" cy="0.3" r="0.85">
      <stop offset="0" stopColor={light} />
      <stop offset="0.5" stopColor={base} />
      <stop offset="1" stopColor={edge} />
    </radialGradient>
  )
}

/* Лицо: глаза, брови, щёки, нос уже нарисован видом, здесь рот. */

function Face({ expression, eyes, mouth, dy, mouthDy, line, style }: { expression: Expression; eyes: 'dog' | 'cat'; mouth: Art['mouth']; dy: number; mouthDy: number; line: string; style: ChibiStyle }) {
  const y = 84 + dy
  return (
    <g>
      <ellipse cx="70" cy={y + 19} rx="9" ry="5.5" fill={PINK} opacity="0.4" />
      <ellipse cx="130" cy={y + 19} rx="9" ry="5.5" fill={PINK} opacity="0.4" />
      {[79, 121].map((x) => (
        <Eye key={x} x={x} y={y} expression={expression} kind={eyes} mirror={x > 100} style={style} />
      ))}
      {expression === 'sad' && (
        <g fill="none" stroke={line} strokeWidth="3" strokeLinecap="round">
          <path d={`M68 ${y - 12} L86 ${y - 18}`} />
          <path d={`M132 ${y - 12} L114 ${y - 18}`} />
        </g>
      )}
      <Mouth expression={expression} kind={mouth} y={y + 22 + mouthDy} />
    </g>
  )
}

function Eye({ x, y, expression, kind, mirror, style }: { x: number; y: number; expression: Expression; kind: 'dog' | 'cat'; mirror: boolean; style: ChibiStyle }) {
  const line = { fill: 'none', stroke: INK, strokeWidth: 3.2, strokeLinecap: 'round' as const }
  if (expression === 'sleep') return <path d={`M${x - 9} ${y} Q${x} ${y + 7} ${x + 9} ${y}`} {...line} />
  if (expression === 'joy') return <path d={`M${x - 9} ${y + 3} Q${x} ${y - 8} ${x + 9} ${y + 3}`} {...line} />
  const s = mirror ? -1 : 1
  if (style === 'flat') {
    // Стикерный стиль: маленькие глаза-бусинки с одним бликом.
    return (
      <g className="chibi-eye" style={{ transformOrigin: `${x}px ${y}px` }}>
        <ellipse cx={x} cy={y + 2} rx="6.5" ry="7.5" fill={INK} />
        <circle cx={x + 2.2 * s} cy={y - 0.8} r="2.3" fill="#ffffff" />
      </g>
    )
  }
  if (style === 'plush') {
    // Плюшевый стиль: крупные глаза с цветной радужкой и двумя бликами.
    const iris = kind === 'cat' ? '#6fbf6a' : '#8a5a3a'
    return (
      <g className="chibi-eye" style={{ transformOrigin: `${x}px ${y}px` }}>
        <ellipse cx={x} cy={y} rx="11.5" ry="13" fill={INK} />
        <ellipse cx={x} cy={y + 1.5} rx="9" ry="10.5" fill={iris} />
        <ellipse cx={x} cy={y + 2} rx={kind === 'cat' ? 3.5 : 5.5} ry={kind === 'cat' ? 9 : 6.5} fill={INK} />
        <circle cx={x + 4 * s} cy={y - 5} r="4.4" fill="#ffffff" />
        <circle cx={x - 3.5 * s} cy={y + 5.5} r="2" fill="#ffffff" opacity="0.9" />
        {expression === 'sad' && <path d={`M${x + 5 * s} ${y + 13} q2 4 0 7 q-2 -3 0 -7 Z`} fill="#7cc7ff" />}
      </g>
    )
  }
  return (
    <g className="chibi-eye" style={{ transformOrigin: `${x}px ${y}px` }}>
      {kind === 'cat' ? (
        <>
          <ellipse cx={x} cy={y} rx="10.5" ry="12.5" fill="#7cc576" stroke={INK} strokeWidth="2" />
          <ellipse cx={x} cy={y} rx="4.2" ry="10" fill={INK} />
        </>
      ) : (
        <ellipse cx={x} cy={y} rx="9.5" ry="11" fill={INK} />
      )}
      <circle cx={x + 3.5 * s} cy={y - 4.5} r={expression === 'happy' ? 4.2 : 3.6} fill="#ffffff" />
      <circle cx={x - 3 * s} cy={y + 4.5} r="1.7" fill="#ffffff" opacity="0.9" />
      {expression === 'sad' && <path d={`M${x + 5 * s} ${y + 12} q2 4 0 7 q-2 -3 0 -7 Z`} fill="#7cc7ff" />}
    </g>
  )
}

function Mouth({ expression, kind, y }: { expression: Expression; kind: Art['mouth']; y: number }) {
  const line = { fill: 'none', stroke: INK, strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const open = expression === 'happy' || expression === 'joy' || expression === 'eat'
  if (open) {
    return (
      <g className="chibi-mouth" style={{ transformOrigin: `100px ${y}px` }}>
        <path d={`M88 ${y} Q100 ${y + 20} 112 ${y} Q100 ${y + 4} 88 ${y} Z`} fill="#5a1f1f" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <ellipse cx="100" cy={y + 10} rx="6.5" ry="5" fill="#ff7a8a" />
        {kind === 'bunny' && <rect x="95" y={y} width="10" height="6" rx="1.5" fill="#ffffff" stroke={INK} strokeWidth="1.2" />}
      </g>
    )
  }
  if (expression === 'sad') return <path d={`M90 ${y + 6} Q100 ${y - 2} 110 ${y + 6}`} {...line} />
  if (expression === 'sleep') return <ellipse cx="100" cy={y + 3} rx="3.5" ry="2.8" fill="#5a1f1f" />
  return (
    <g>
      <path d={`M89 ${y} Q94.5 ${y + 7} 100 ${y} Q105.5 ${y + 7} 111 ${y}`} {...line} />
      {kind === 'bunny' && <rect x="96" y={y + 2} width="8" height="6" rx="1.5" fill="#ffffff" stroke={INK} strokeWidth="1.2" />}
    </g>
  )
}

/* Общие части тела */

function sittingBody(p: Paint, opts: { width?: number; chest?: string; socks?: boolean; paws?: string } = {}) {
  const w = opts.width ?? 46
  const chest = opts.chest ?? p.fur.light
  const paws = opts.paws ?? p.fur.main
  return (
    <>
      {/* задние лапы по бокам */}
      <ellipse cx={100 - w + 6} cy="182" rx="17" ry="11" fill={p.body} {...p.o} />
      <ellipse cx={100 + w - 6} cy="182" rx="17" ry="11" fill={p.body} {...p.o} />
      <path
        d={`M${100 - w + 4} 188 C ${100 - w - 4} 156, ${100 - w + 14} 124, 100 120 C ${100 + w - 14} 124, ${100 + w + 4} 156, ${100 + w - 4} 188 Z`}
        fill={p.body}
        {...p.o}
      />
      <ellipse cx="100" cy="160" rx={w * 0.52} ry="26" fill={chest} opacity="0.95" />
      {/* передние лапки */}
      {[86, 114].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="182" rx="11.5" ry="10" fill={opts.socks ? WHITE : paws} {...p.o} />
          <path d={`M${x - 4} 186 v-4 M${x + 4} 186 v-4`} stroke={p.line} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
        </g>
      ))}
    </>
  )
}

function headShape(p: Paint, rx: number, ry: number, cy = 88) {
  return <ellipse cx="100" cy={cy} rx={rx} ry={ry} fill={p.head} {...p.o} />
}

function dogNose(y: number) {
  return (
    <g>
      <path d={`M90 ${y - 4} Q100 ${y - 8} 110 ${y - 4} Q110 ${y + 4} 100 ${y + 6} Q90 ${y + 4} 90 ${y - 4} Z`} fill={INK} />
      <ellipse cx="96" cy={y - 2} rx="3.2" ry="1.8" fill="#ffffff" opacity="0.7" />
    </g>
  )
}

function pointyEars(p: Paint, opts: { spread: number; top: number; inner?: string; tips?: string }) {
  const { spread: s, top: t } = opts
  const ear = (side: 1 | -1) => {
    const x = (v: number) => 100 + side * v
    return (
      <g key={side} className="chibi-ear" style={{ transformOrigin: `${x(s - 22)}px 60px` }}>
        <path
          d={`M${x(s)} 72 Q${x(s + 8)} ${t + 18} ${x(s + 2)} ${t} Q${x(s - 22)} ${t + 20} ${x(s - 34)} 50 Z`}
          fill={p.head}
          {...p.o}
          strokeLinejoin="round"
        />
        <path d={`M${x(s - 4)} 64 Q${x(s + 2)} ${t + 24} ${x(s)} ${t + 12} Q${x(s - 18)} ${t + 28} ${x(s - 26)} 52 Z`} fill={opts.inner ?? INNER_EAR} />
        {opts.tips && <path d={`M${x(s + 2)} ${t} Q${x(s + 5)} ${t + 10} ${x(s + 4)} ${t + 16} Q${x(s - 6)} ${t + 10} ${x(s - 10)} ${t + 8} Z`} fill={opts.tips} />}
      </g>
    )
  }
  return [ear(-1), ear(1)]
}

/* Виды */

const ART: Record<SpeciesId, Art> = {
  dachshund: {
    back: (p) => (
      <g className="chibi-tail" style={{ transformOrigin: '136px 168px' }}>
        <path d="M134 170 Q168 162 170 128" fill="none" stroke={p.fur.main} strokeWidth="10" strokeLinecap="round" />
      </g>
    ),
    body: (p) => sittingBody(p, { width: 44 }),
    head: (p) => (
      <>
        {headShape(p, 49, 45)}
        <ellipse cx="100" cy="108" rx="25" ry="18" fill={p.fur.light} />
        {dogNose(99)}
      </>
    ),
    front: (p) => (
      <>
        {[-1, 1].map((side) => {
          const x = (v: number) => 100 + side * v
          return (
            <g key={side} className="chibi-ear" style={{ transformOrigin: `${x(36)}px 58px` }}>
              <path
                d={`M${x(36)} 54 C ${x(62)} 54, ${x(72)} 96, ${x(64)} 134 C ${x(60)} 150, ${x(38)} 148, ${x(36)} 128 C ${x(34)} 106, ${x(28)} 78, ${x(36)} 54 Z`}
                fill={p.ear}
                {...p.o}
              />
            </g>
          )
        })}
      </>
    ),
    mouth: 'dog',
  },
  corgi: {
    back: (p) => (
      <>
        {pointyEars(p, { spread: 50, top: 12 })}
        <g className="chibi-tail" style={{ transformOrigin: '140px 166px' }}>
          <ellipse cx="150" cy="164" rx="15" ry="12" fill={p.body} {...p.o} />
        </g>
      </>
    ),
    body: (p) => sittingBody(p, { width: 50, chest: WHITE, socks: true }),
    head: (p) => (
      <>
        {headShape(p, 50, 44)}
        <path d="M100 50 C 94 62, 92 74, 93 88 L 107 88 C 108 74, 106 62, 100 50 Z" fill={WHITE} />
        <ellipse cx="100" cy="108" rx="29" ry="19" fill={WHITE} />
        {dogNose(99)}
      </>
    ),
    mouth: 'dog',
  },
  cat: {
    back: (p) => (
      <>
        {pointyEars(p, { spread: 44, top: 26 })}
        <g className="chibi-tail" style={{ transformOrigin: '132px 176px' }}>
          <path d="M130 178 C 168 178, 174 140, 158 118" fill="none" stroke={p.fur.main} strokeWidth="10" strokeLinecap="round" />
          <path d="M163 128 l7 -3 M165 142 l8 0 M160 156 l8 3" stroke={p.fur.dark} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </g>
      </>
    ),
    body: (p) => (
      <>
        {sittingBody(p, { width: 40 })}
        <g fill="none" stroke={p.fur.dark} strokeWidth="3" strokeLinecap="round" opacity="0.5">
          <path d="M68 140 q6 4 10 0" />
          <path d="M122 140 q6 4 10 0" />
        </g>
      </>
    ),
    head: (p) => (
      <>
        {headShape(p, 48, 42, 90)}
        <g fill="none" stroke={p.fur.dark} strokeWidth="3.2" strokeLinecap="round" opacity="0.55">
          <path d="M92 52 q1 6 0 11" />
          <path d="M100 50 q1 7 0 13" />
          <path d="M108 52 q1 6 0 11" />
        </g>
        <ellipse cx="92" cy="106" rx="10" ry="8" fill={p.fur.light} />
        <ellipse cx="108" cy="106" rx="10" ry="8" fill={p.fur.light} />
        <path d="M95 97 h10 l-5 6 Z" fill={PINK} stroke={PINK} strokeWidth="3" strokeLinejoin="round" />
        <g stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity="0.45">
          <path d="M84 104 L56 98 M84 107 L54 108 M84 110 L58 118" />
          <path d="M116 104 L144 98 M116 107 L146 108 M116 110 L142 118" />
        </g>
      </>
    ),
    eyes: 'cat',
    mouth: 'cat',
  },
  fox: {
    back: (p) => (
      <>
        {pointyEars(p, { spread: 48, top: 14, inner: WHITE, tips: p.fur.dark })}
        <g className="chibi-tail" style={{ transformOrigin: '136px 172px' }}>
          <path d="M132 180 C 176 184, 192 146, 176 112 C 168 130, 156 142, 138 150 Z" fill={p.body} {...p.o} />
          <path d="M176 112 C 186 128, 184 142, 178 152 C 172 140, 170 128, 176 112 Z" fill={WHITE} />
        </g>
      </>
    ),
    body: (p) => sittingBody(p, { width: 42, chest: WHITE, paws: p.fur.dark }),
    head: (p) => (
      <>
        {headShape(p, 48, 42)}
        <path d="M54 92 C 70 96, 86 104, 100 120 C 114 104, 130 96, 146 92 C 142 118, 122 132, 100 132 C 78 132, 58 118, 54 92 Z" fill={WHITE} />
        {dogNose(104)}
      </>
    ),
    mouth: 'dog',
    mouthDy: 7,
  },
  bunny: {
    back: (p) => (
      <>
        {[-1, 1].map((side) => {
          const x = (v: number) => 100 + side * v
          return (
            <g key={side} className="chibi-ear" style={{ transformOrigin: `${x(16)}px 60px` }}>
              <path
                d={`M${x(26)} 62 C ${x(38)} 26, ${x(34)} 0, ${x(22)} 0 C ${x(8)} 2, ${x(6)} 30, ${x(8)} 62 Z`}
                fill={p.head}
                {...p.o}
              />
              <path d={`M${x(22)} 58 C ${x(30)} 30, ${x(28)} 10, ${x(21)} 9 C ${x(13)} 11, ${x(12)} 32, ${x(13)} 58 Z`} fill={INNER_EAR} />
            </g>
          )
        })}
        <g className="chibi-tail" style={{ transformOrigin: '144px 174px' }}>
          <circle cx="146" cy="172" r="12" fill={WHITE} {...p.o} />
        </g>
      </>
    ),
    body: (p) => (
      <>
        {sittingBody(p, { width: 42 })}
        <ellipse cx="64" cy="187" rx="17" ry="7" fill={p.body} {...p.o} />
        <ellipse cx="136" cy="187" rx="17" ry="7" fill={p.body} {...p.o} />
      </>
    ),
    head: (p) => (
      <>
        {headShape(p, 46, 41, 92)}
        <ellipse cx="93" cy="110" rx="9" ry="7" fill={p.fur.light} />
        <ellipse cx="107" cy="110" rx="9" ry="7" fill={p.fur.light} />
        <ellipse cx="100" cy="102" rx="4.5" ry="3.5" fill={PINK} />
        <g stroke={INK} strokeWidth="1.3" strokeLinecap="round" opacity="0.4">
          <path d="M86 108 L62 104 M86 111 L60 114" />
          <path d="M114 108 L138 104 M114 111 L140 114" />
        </g>
      </>
    ),
    mouth: 'bunny',
    faceDy: 4,
  },
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
