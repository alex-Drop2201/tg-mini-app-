import type { ReactNode } from 'react'

// Рисунки зверьков в профиль, мордой вправо, в координатах 260×170 (земля на y≈150).
// Общий рендерер (Critter.tsx) собирает их из частей и вешает анимации: поэтому
// у каждого вида заданы точки крепления: хвоста, головы, ушей, глаз, шеи, шляпы.

export type Fur = { main: string; dark: string; light: string }
export type Point = readonly [number, number]

/** Белые отметины: грудка корги и лисы, кончик хвоста. От окраса не зависят. */
export const MARK = '#fff8ef'
const INNER_EAR = '#f4b6b0'
const PINK_NOSE = '#ff8fa3'
export const INK = '#2b1b17'

export type Anatomy = {
  /** Левый и правый край фигуры: для тени. */
  span: Point
  tail: { origin: Point; draw: (f: Fur) => ReactNode }
  farLegs: (f: Fur) => ReactNode
  nearLegs: (f: Fur) => ReactNode
  torso: (f: Fur) => ReactNode
  /** Голова без лица: череп, морда, нос, отметины. */
  head: (f: Fur) => ReactNode
  headOrigin: Point
  farEar?: { origin: Point; draw: (f: Fur) => ReactNode }
  nearEar: { origin: Point; draw: (f: Fur) => ReactNode }
  /** Поворот ушей в градусах: радость и грусть. */
  ear: { happy: number; sad: number }
  eye: Point
  mouth: Point
  mouthScale: number
  cheek: Point
  whiskers?: Point
  neck: Point
  hat: { at: Point; angle: number }
  /** Насколько опускается фигура, когда зверёк ложится спать. */
  sleepDy: number
  /** Наклон головы к миске и где стоит миска. */
  eat: { from: number; to: number; bowlX: number }
  dirt: [number, number, number][]
}

const legs = (spots: Point[], w: number, h: number, fill: string, socks = false) => (
  <>
    {spots.map(([x, y]) => (
      <g key={x}>
        <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={fill} />
        {socks && <rect x={x} y={y + h - 11} width={w} height={11} rx={w / 2} fill={MARK} />}
      </g>
    ))}
  </>
)

const whiskerLines = ([x, y]: Point) => (
  <g stroke={INK} strokeWidth="1" strokeLinecap="round" opacity="0.45">
    <path d={`M${x} ${y} L${x + 18} ${y - 4}`} />
    <path d={`M${x} ${y + 2} L${x + 19} ${y + 3}`} />
    <path d={`M${x - 1} ${y + 4} L${x + 16} ${y + 9}`} />
  </g>
)

const dachshund: Anatomy = {
  span: [36, 243],
  tail: {
    origin: [66, 98],
    draw: (f) => (
      <path d="M66 98 Q 46 96 36 76" fill="none" stroke={f.main} strokeWidth="9" strokeLinecap="round" />
    ),
  },
  farLegs: (f) => legs([[82, 112], [154, 112]], 14, 36, f.dark),
  nearLegs: (f) => legs([[68, 114], [140, 114]], 15, 36, f.main),
  torso: (f) => (
    <>
      <rect x="58" y="80" width="112" height="50" rx="25" fill={f.main} />
      <ellipse cx="112" cy="121" rx="42" ry="8" fill={f.light} />
    </>
  ),
  head: (f) => (
    <>
      <circle cx="182" cy="76" r="30" fill={f.main} />
      <ellipse cx="214" cy="88" rx="24" ry="13" fill={f.main} />
      <ellipse cx="236" cy="84" rx="7" ry="6" fill={INK} />
      <circle cx="234" cy="82" r="1.8" fill="#fff" />
    </>
  ),
  headOrigin: [165, 100],
  nearEar: {
    origin: [174, 52],
    draw: (f) => (
      <path
        d="M174 50 C 154 48, 148 72, 154 98 C 157 110, 172 108, 172 94 C 172 80, 182 64, 174 50 Z"
        fill={f.dark}
      />
    ),
  },
  ear: { happy: 12, sad: -6 },
  eye: [194, 70],
  mouth: [217, 97],
  mouthScale: 1,
  cheek: [204, 85],
  neck: [163, 107],
  hat: { at: [186, 47], angle: -6 },
  sleepDy: 17,
  eat: { from: 18, to: 27, bowlX: 235 },
  dirt: [[88, 96, 7], [118, 110, 5], [142, 92, 6], [104, 86, 3.5], [72, 112, 4]],
}

const corgi: Anatomy = {
  span: [50, 234],
  tail: {
    origin: [70, 96],
    draw: (f) => (
      <path d="M72 92 C 58 82, 46 90, 52 100 C 56 106, 66 106, 72 101 Z" fill={f.main} />
    ),
  },
  farLegs: (f) => legs([[84, 114], [156, 114]], 15, 34, f.dark, true),
  nearLegs: (f) => legs([[72, 116], [142, 116]], 16, 34, f.main, true),
  torso: (f) => (
    <>
      <rect x="64" y="78" width="110" height="54" rx="27" fill={f.main} />
      <ellipse cx="116" cy="125" rx="42" ry="8" fill={MARK} />
      <path d="M170 90 Q 188 100 182 128 Q 164 132 158 112 Z" fill={MARK} />
    </>
  ),
  head: (f) => (
    <>
      <circle cx="186" cy="74" r="29" fill={f.main} />
      <ellipse cx="212" cy="86" rx="18" ry="11.5" fill={f.main} />
      <ellipse cx="209" cy="92" rx="17" ry="7" fill={MARK} />
      {/* Белая проточина на лбу, чуть впереди глаза */}
      <path d="M205 56 Q 210 64 209 80 Q 204 82 202 78 Q 203 66 205 56 Z" fill={MARK} />
      <ellipse cx="228" cy="82" rx="6" ry="5" fill={INK} />
      <circle cx="226.5" cy="80.5" r="1.6" fill="#fff" />
    </>
  ),
  headOrigin: [168, 98],
  farEar: {
    origin: [176, 50],
    draw: (f) => <path d="M168 56 L163 20 L188 44 Z" fill={f.dark} strokeLinejoin="round" />,
  },
  nearEar: {
    origin: [198, 46],
    draw: (f) => (
      <>
        <path d="M184 48 L194 10 L212 44 Z" fill={f.main} stroke={f.main} strokeWidth="4" strokeLinejoin="round" />
        <path d="M190 44 L195 22 L205 43 Z" fill={INNER_EAR} />
      </>
    ),
  },
  ear: { happy: 4, sad: -22 },
  eye: [192, 70],
  mouth: [213, 96],
  mouthScale: 0.85,
  cheek: [202, 84],
  neck: [166, 104],
  hat: { at: [182, 46], angle: -10 },
  sleepDy: 15,
  eat: { from: 26, to: 34, bowlX: 226 },
  dirt: [[92, 94, 7], [120, 108, 5], [146, 90, 6], [108, 84, 3.5], [78, 110, 4]],
}

const cat: Anatomy = {
  span: [40, 228],
  tail: {
    origin: [74, 100],
    draw: (f) => (
      <path
        d="M76 102 Q 44 104 42 76 Q 40 52 56 50"
        fill="none"
        stroke={f.main}
        strokeWidth="8"
        strokeLinecap="round"
      />
    ),
  },
  farLegs: (f) => legs([[88, 112], [150, 112]], 12, 37, f.dark),
  nearLegs: (f) => legs([[76, 114], [138, 114]], 13, 36, f.main),
  torso: (f) => (
    <>
      <rect x="70" y="84" width="96" height="44" rx="22" fill={f.main} />
      <ellipse cx="118" cy="121" rx="32" ry="6" fill={f.light} />
      <g fill="none" stroke={f.dark} strokeWidth="3" strokeLinecap="round" opacity="0.55">
        <path d="M100 86 q4 8 0 15" />
        <path d="M118 85 q4 8 0 15" />
        <path d="M136 86 q4 8 0 15" />
      </g>
    </>
  ),
  head: (f) => (
    <>
      <circle cx="182" cy="76" r="27" fill={f.main} />
      <ellipse cx="200" cy="87" rx="11" ry="8" fill={f.light} />
      <path d="M205.5 79 h7 l-3.5 4 Z" fill={PINK_NOSE} stroke={PINK_NOSE} strokeWidth="2" strokeLinejoin="round" />
      <g fill="none" stroke={f.dark} strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
        <path d="M176 51 q1 5 0 9" />
        <path d="M183 50 q1 5 0 9" />
      </g>
    </>
  ),
  headOrigin: [166, 100],
  farEar: {
    origin: [170, 58],
    draw: (f) => <path d="M160 64 L158 32 L182 52 Z" fill={f.dark} stroke={f.dark} strokeWidth="3" strokeLinejoin="round" />,
  },
  nearEar: {
    origin: [190, 54],
    draw: (f) => (
      <>
        <path d="M178 54 L190 24 L202 56 Z" fill={f.main} stroke={f.main} strokeWidth="3" strokeLinejoin="round" />
        <path d="M183 52 L190 33 L197 53 Z" fill={INNER_EAR} />
      </>
    ),
  },
  ear: { happy: 4, sad: -24 },
  eye: [192, 72],
  mouth: [205, 92],
  mouthScale: 0.7,
  cheek: [194, 85],
  whiskers: [208, 86],
  neck: [164, 104],
  hat: { at: [178, 50], angle: -8 },
  sleepDy: 20,
  eat: { from: 32, to: 42, bowlX: 214 },
  dirt: [[94, 98, 6], [122, 110, 5], [146, 94, 5], [82, 112, 4]],
}

const fox: Anatomy = {
  span: [14, 243],
  tail: {
    origin: [76, 92],
    draw: (f) => (
      <>
        <path d="M78 90 C 62 106, 30 102, 16 66 C 32 74, 50 76, 62 82 C 68 84, 74 86, 78 86 Z" fill={f.main} />
        <path d="M16 66 C 20 78, 28 86, 38 88 C 32 80, 26 74, 16 66 Z" fill={MARK} />
      </>
    ),
  },
  farLegs: (f) => legs([[86, 112], [152, 112]], 12, 37, f.dark),
  nearLegs: (f) => legs([[74, 114], [140, 114]], 13, 36, f.dark),
  torso: (f) => (
    <>
      <rect x="68" y="84" width="100" height="44" rx="22" fill={f.main} />
      <ellipse cx="118" cy="122" rx="34" ry="6" fill={MARK} />
      <path d="M166 92 Q 182 100 178 126 Q 162 128 156 110 Z" fill={MARK} />
    </>
  ),
  head: (f) => (
    <>
      <circle cx="182" cy="76" r="27" fill={f.main} />
      <path d="M196 64 Q 226 74 241 85 Q 228 96 198 96 Z" fill={f.main} />
      <path d="M190 90 Q 218 96 238 89 Q 226 104 200 102 Q 188 100 190 90 Z" fill={MARK} />
      <ellipse cx="240" cy="86" rx="5" ry="4.5" fill={INK} />
      <circle cx="238.7" cy="84.8" r="1.3" fill="#fff" />
    </>
  ),
  headOrigin: [166, 100],
  farEar: {
    origin: [168, 56],
    draw: (f) => <path d="M158 64 L154 24 L180 50 Z" fill={f.dark} stroke={f.dark} strokeWidth="3" strokeLinejoin="round" />,
  },
  nearEar: {
    origin: [190, 52],
    draw: (f) => (
      <>
        <path d="M176 54 L190 16 L204 54 Z" fill={f.main} stroke={f.main} strokeWidth="3" strokeLinejoin="round" />
        <path d="M182 51 L190 28 L198 51 Z" fill={MARK} />
        <path d="M186 27 L190 16 L194 27 Z" fill={f.dark} stroke={f.dark} strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  },
  ear: { happy: 4, sad: -22 },
  eye: [194, 72],
  mouth: [222, 96],
  mouthScale: 0.75,
  cheek: [204, 86],
  neck: [164, 104],
  hat: { at: [178, 50], angle: -8 },
  sleepDy: 20,
  eat: { from: 22, to: 31, bowlX: 232 },
  dirt: [[94, 98, 6], [122, 110, 5], [146, 94, 5], [82, 112, 4]],
}

const bunny: Anatomy = {
  span: [68, 210],
  tail: {
    origin: [82, 104],
    draw: (f) => <circle cx="80" cy="102" r="11" fill={f.light} />,
  },
  farLegs: (f) => (
    <>
      {legs([[156, 116]], 11, 32, f.dark)}
      <ellipse cx="104" cy="147" rx="16" ry="5" fill={f.dark} />
    </>
  ),
  nearLegs: (f) => (
    <>
      {legs([[146, 117]], 12, 32, f.main)}
      <ellipse cx="92" cy="146" rx="21" ry="6.5" fill={f.main} />
    </>
  ),
  torso: (f) => (
    <>
      <rect x="80" y="86" width="86" height="46" rx="23" fill={f.main} />
      <ellipse cx="102" cy="114" rx="26" ry="22" fill={f.main} />
      <ellipse cx="134" cy="126" rx="24" ry="6" fill={f.light} />
    </>
  ),
  head: (f) => (
    <>
      <circle cx="180" cy="82" r="26" fill={f.main} />
      <ellipse cx="198" cy="92" rx="10" ry="7.5" fill={f.light} />
      <ellipse cx="205" cy="88" rx="3.5" ry="3" fill={PINK_NOSE} />
    </>
  ),
  headOrigin: [164, 104],
  farEar: {
    origin: [172, 62],
    draw: (f) => (
      <path d="M166 62 C 156 34, 160 8, 170 8 C 180 10, 180 36, 176 60 Z" fill={f.dark} />
    ),
  },
  nearEar: {
    origin: [184, 60],
    draw: (f) => (
      <>
        <path d="M178 60 C 174 30, 186 4, 196 8 C 206 14, 194 40, 188 62 Z" fill={f.main} />
        <path d="M183 56 C 181 34, 189 15, 194 15 C 199 20, 191 40, 187 57 Z" fill={INNER_EAR} />
      </>
    ),
  },
  ear: { happy: 6, sad: -32 },
  eye: [190, 78],
  mouth: [201, 97],
  mouthScale: 0.65,
  cheek: [192, 91],
  whiskers: [203, 92],
  neck: [162, 108],
  hat: { at: [174, 58], angle: -8 },
  sleepDy: 17,
  eat: { from: 32, to: 42, bowlX: 212 },
  dirt: [[100, 104, 7], [128, 98, 5], [148, 112, 5], [116, 120, 4]],
}

export const ANATOMY = { dachshund, corgi, cat, fox, bunny }
export type SpeciesId = keyof typeof ANATOMY

export { whiskerLines }
