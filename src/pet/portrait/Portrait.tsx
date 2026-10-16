import { useId } from 'react'

// Такса в трёх стилях по референсам владельца. Каждая картинка 200×200 вместе с фоном.
// Контур рисуется отдельным слоем поверх заливок; неровность «от руки» даёт SVG-фильтр,
// причём у заливки и контура одна и та же карта искажений, чтобы цвет не вылезал за линию.

const INK = '#1b1714'

export type PortraitStyle = 'peek' | 'painted' | 'walk'

export function DachshundArt({ style }: { style: PortraitStyle }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  if (style === 'peek') return <Peek uid={uid} />
  if (style === 'walk') return <Walk uid={uid} />
  return <Painted uid={uid} />
}

const round = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const ink = (w: number) => ({ fill: 'none', stroke: INK, strokeWidth: w, ...round })

/** Лёгкая дрожь линии, как у маркера: без зерна, только неидеальная форма. */
function Marker({ id, seed = 3 }: { id: string; seed?: number }) {
  return (
    <filter id={id} filterUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} result="wave" />
      <feDisplacementMap in="SourceGraphic" in2="wave" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  )
}

/* 1. Как колли: выглядывает из-за края, чистая линия, глаза-бусинки. */

function Peek({ uid }: { uid: string }) {
  const fur = '#d0844a'
  const ear = '#80431f'
  const mask = '#f7d3a6'
  const hand = `url(#${uid}-hand)`
  const line = { stroke: INK, strokeWidth: 3.4, ...round }

  const head = 'M60 160 C 58 142, 56 122, 58 104 C 60 72, 78 50, 100 50 C 122 50, 140 72, 142 104 C 144 122, 142 142, 140 160 Z'
  const blaze = 'M92 76 C 90 94, 82 108, 80 124 C 78 140, 86 152, 100 152 C 114 152, 122 140, 120 124 C 118 108, 110 94, 108 76 C 104 72, 96 72, 92 76 Z'
  const earL = 'M70 60 C 54 54, 38 64, 34 86 C 30 110, 32 134, 40 148 C 46 158, 58 156, 61 146 C 63 124, 63 98, 70 72 Z'
  const earR = 'M128 66 C 136 48, 154 34, 174 30 C 184 28, 188 36, 182 46 C 172 64, 156 80, 138 88 Z'
  const earRIn = 'M136 72 C 144 56, 158 44, 172 39 C 166 54, 154 68, 140 80 Z'
  const paw = (x: number) => `M${x - 19} 161 C ${x - 20} 147, ${x - 10} 139, ${x} 139 C ${x + 10} 139, ${x + 20} 147, ${x + 19} 161 Z`

  return (
    <g>
      <defs>
        <Marker id={`${uid}-hand`} />
      </defs>
      <rect width="200" height="200" fill="#ffffff" />
      <g filter={hand}>
        {/* дальнее ухо вывернуто наизнанку, как у колли одно ухо торчит */}
        <path d={earR} fill={fur} {...line} />
        <path d={earRIn} fill="#f2a98c" />
        <path d="M150 60 l-6 -2 M146 68 l-6 -1" {...ink(2.2)} />
        <path d={head} fill={fur} {...line} />
        <path d={blaze} fill={mask} {...line} strokeWidth={2.8} />
        {/* хохолок */}
        <path d="M96 51 C 94 44, 96 39, 100 36 M103 51 C 104 45, 108 41, 113 40" {...ink(2.4)} />
        {/* брови домиком и глаза-бусинки */}
        <path d="M71 84 C 75 79, 82 78, 86 81" {...ink(2.6)} />
        <path d="M114 81 C 118 78, 125 79, 129 84" {...ink(2.6)} />
        <ellipse cx="79" cy="97" rx="6.2" ry="7.4" fill={INK} />
        <ellipse cx="121" cy="97" rx="6.2" ry="7.4" fill={INK} />
        {/* нос и точки усов */}
        <path d="M87 134 C 87 125, 113 125, 113 134 C 113 142, 105 147, 100 147 C 95 147, 87 142, 87 134 Z" fill={INK} />
        {[[86, 142], [82, 136], [114, 142], [118, 136]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill={INK} />
        ))}
        {/* висячее ухо поверх щеки */}
        <path d={earL} fill={ear} {...line} />
        <path d="M54 76 C 48 92, 46 110, 48 128" {...ink(2.2)} opacity="0.5" />
        {/* край и лапки */}
        <path d="M8 161 H192" {...ink(3.6)} />
        {[68, 132].map((x) => (
          <g key={x}>
            <path d={paw(x)} fill={fur} {...line} />
            <path d={`M${x - 6} 161 v-7 M${x + 6} 161 v-7`} {...ink(2.6)} />
          </g>
        ))}
      </g>
    </g>
  )
}

/* 2. Как такса, ослик и бобёр: портрет крупно, гуашь, шершавый контур, глаза-пуговицы. */

// Общая «дрожь руки»: одинаковая карта искажений для заливок, белков и контура.
function Wobble() {
  return (
    <>
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="wave" />
      <feDisplacementMap in="SourceGraphic" in2="wave" scale="3" xChannelSelector="R" yChannelSelector="G" result="shape" />
    </>
  )
}

function Painted({ uid }: { uid: string }) {
  const fur = '#8f5a32'
  const ear = '#2a1c16'
  const f = (name: string) => `url(#${uid}-${name})`

  // Голова — вытянутая капля: круглый затылок плавно сужается в длинную морду с носом внизу слева.
  const head =
    'M46 144 C 62 120, 86 92, 100 66 C 106 46, 116 32, 132 32 C 150 32, 162 46, 162 64 C 162 84, 152 98, 136 110 C 112 128, 82 146, 58 156 C 50 159, 43 152, 46 144 Z'
  const neck = 'M74 210 C 80 176, 98 148, 116 124 L 154 96 C 166 128, 172 168, 174 210 Z'
  const earNear = 'M150 52 C 168 48, 184 62, 186 86 C 188 110, 184 132, 174 140 C 166 146, 158 136, 156 122 C 152 102, 148 80, 150 52 Z'
  const earFar = 'M112 42 C 100 28, 82 20, 68 24 C 60 26, 60 36, 68 40 C 80 46, 96 48, 108 52 Z'
  const tongue = 'M98 135 C 96 144, 98 152, 104 154 C 111 154, 113 144, 110 128 Z'

  return (
    <g>
      <defs>
        <filter id={`${uid}-wobble`} filterUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">
          <Wobble />
        </filter>
        <filter id={`${uid}-crayon`} filterUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">
          <Wobble />
          {/* шершавый край мелка и редкие просветы, как у сухой кисти */}
          <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" seed="9" result="rough" />
          <feDisplacementMap in="shape" in2="rough" scale="1.2" xChannelSelector="R" yChannelSelector="G" result="fuzzy" />
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="12" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  6 0 0 0 -1.5" result="holes" />
          <feComposite in="fuzzy" in2="holes" operator="in" />
        </filter>
        <filter id={`${uid}-gouache`} filterUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">
          <Wobble />
          {/* краска ложится неровно: крупные пятна чуть темнее, мелкое зерно чуть светлее */}
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="7" result="mottle" />
          <feColorMatrix in="mottle" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.4 0 0 0 -0.16" result="dark" />
          <feComposite in="dark" in2="shape" operator="in" result="darkIn" />
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="8" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -0.3 0 0 0 0.14" result="light" />
          <feComposite in="light" in2="shape" operator="in" result="lightIn" />
          <feMerge>
            <feMergeNode in="shape" />
            <feMergeNode in="darkIn" />
            <feMergeNode in="lightIn" />
          </feMerge>
        </filter>
        {/* мягкое пятно без контура, как светлая морда и тень у ослика */}
        <filter id={`${uid}-soft`} filterUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="blur" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${uid}-paper`} filterUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.07" numOctaves="3" seed="21" result="streak" />
          <feColorMatrix in="streak" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -0.3 0 0 0 0.14" result="light" />
          <feComposite in="light" in2="SourceGraphic" operator="in" result="lightIn" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="lightIn" />
          </feMerge>
        </filter>
        <clipPath id={`${uid}-neckClip`}>
          <path d={neck} />
        </clipPath>
      </defs>

      <rect width="200" height="200" fill="#f8d548" filter={f('paper')} />

      {/* заливки */}
      <g filter={f('gouache')}>
        <path d={earFar} fill={ear} />
        <path d={neck} fill={fur} />
        <path d={earNear} fill={ear} />
        <path d={tongue} fill="#ef5b56" />
        <path d={head} fill={fur} />
      </g>
      {/* тень от головы на шее */}
      <g clipPath={f('neckClip')}>
        <path d="M112 128 C 128 120, 142 110, 156 98 L 160 124 C 144 136, 126 144, 108 148 Z" fill="#5a381f" opacity="0.5" filter={f('soft')} />
      </g>

      {/* контур */}
      <g filter={f('crayon')}>
        <path d={earFar} {...ink(3)} />
        <path d="M74 210 C 80 176, 98 148, 116 126 M154 98 C 166 128, 172 168, 174 210" {...ink(3.2)} />
        <path d={earNear} {...ink(3)} />
        <path d={tongue.replace(' Z', '')} {...ink(2.6)} />
        <path d="M104 139 C 105 143, 105 147, 104 150" {...ink(1.8)} />
        <path d={head} {...ink(3.2)} />
        {/* улыбка в уголке рта */}
        <path d="M118 120 C 124 116, 130 115, 133 119" {...ink(2.6)} />
        {/* волоски на макушке, шерсть на шее, точки усов */}
        <path d="M132 33 C 130 23, 134 15, 142 11 M140 34 C 144 26, 152 22, 160 23 M126 35 C 122 28, 122 22, 125 17" {...ink(2.2)} />
        <path d="M132 170 l7 -3 M136 180 l7 -3 M128 190 l7 -3" {...ink(2.4)} />
        {[[66, 136], [72, 132], [70, 142], [78, 138]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill={INK} />
        ))}
      </g>

      {/* нос и белки — без просветов, чистые */}
      <g filter={f('wobble')}>
        <ellipse cx="49" cy="150" rx="8.5" ry="6.5" transform="rotate(-38 49 150)" fill={INK} />
        <ellipse cx="112" cy="54" rx="13.5" ry="14.5" fill="#ffffff" />
        <ellipse cx="142" cy="50" rx="15.5" ry="16.5" fill="#ffffff" />
      </g>
      {/* глаза-пуговицы вылезают за контур головы */}
      <g filter={f('crayon')}>
        <ellipse cx="112" cy="54" rx="13.5" ry="14.5" {...ink(3.6)} />
        <ellipse cx="142" cy="50" rx="15.5" ry="16.5" {...ink(3.6)} />
      </g>
      <circle cx="117" cy="57" r="2.6" fill={INK} />
      <circle cx="137" cy="54" r="2.8" fill={INK} />
    </g>
  )
}

/* 3. Как утёнок: в полный рост, шагает по лужам в резиновых сапожках. */

function Walk({ uid }: { uid: string }) {
  const fur = '#cf7f43'
  const furFar = '#a9632f'
  const ear = '#7c401d'
  const boot = '#2f9e6c'
  const bootFar = '#237a53'
  const hand = `url(#${uid}-hand)`
  const line = { stroke: INK, strokeWidth: 3.2, ...round }

  // Резиновый сапожок с носком вперёд; (x, y) — середина подошвы под пяткой.
  const bootPath = (x: number, y: number) =>
    `M${x - 7} ${y - 16} L ${x - 7} ${y - 2} C ${x - 7} ${y + 1}, ${x - 5} ${y + 2}, ${x - 2} ${y + 2} L ${x + 12} ${y + 2} C ${x + 16} ${y + 2}, ${x + 17} ${y - 3}, ${x + 14} ${y - 6} C ${x + 11} ${y - 8}, ${x + 7} ${y - 9}, ${x + 6} ${y - 12} L ${x + 6} ${y - 16} Z`
  const bootRim = (x: number, y: number) => `M${x - 8.5} ${y - 16} L ${x + 7.5} ${y - 16}`
  // Лапка-трубочка с контуром: от тела до голенища.
  const leg = (d: string, color: string) => (
    <>
      <path d={d} {...ink(13)} />
      <path d={d} fill="none" stroke={color} strokeWidth="6.6" strokeLinecap="round" />
    </>
  )

  const body =
    'M32 104 C 30 88, 44 80, 62 80 L 124 78 C 138 77, 148 82, 152 92 C 156 104, 152 118, 142 124 C 132 130, 116 130, 100 130 L 58 130 C 42 130, 34 120, 32 104 Z'
  const head =
    'M136 78 C 130 62, 136 46, 148 40 C 160 34, 174 38, 178 50 C 180 56, 180 60, 182 64 C 188 66, 194 72, 192 78 C 190 84, 180 86, 170 84 C 160 86, 152 90, 146 92 Z'
  const neck = 'M120 84 C 124 72, 132 62, 140 58 L 160 84 C 157 90, 155 96, 153 102 L 146 108 L 122 96 Z'
  const headLine =
    'M135 55 C 137.5 48.5, 142 43, 148 40 C 160 34, 174 38, 178 50 C 180 56, 180 60, 182 64 C 188 66, 194 72, 192 78 C 190 84, 180 86, 170 84 C 166 85, 162 86, 159 87'
  const earPath = 'M152 44 C 144 44, 140 52, 140 62 C 140 74, 144 84, 150 82 C 156 80, 158 70, 158 58 Z'
  const tail = 'M36 94 C 26 88, 18 76, 16 62 C 15 56, 19 54, 22 58 C 26 72, 34 82, 44 88 Z'

  return (
    <g>
      <defs>
        <Marker id={`${uid}-hand`} seed={6} />
      </defs>
      <rect width="200" height="200" fill="#f3f9ee" />
      {/* белое облачко за спиной, как на референсе */}
      <path d="M92 58 C 92 38, 118 32, 128 46 C 138 36, 162 42, 158 62 C 172 68, 166 90, 148 88 L 104 88 C 84 90, 78 64, 92 58 Z" fill="#ffffff" />

      <g filter={hand}>
        {/* лужа и брызги из-под шагающей лапы */}
        <path d="M22 166 h22 M56 168 h40 M108 166 h14 M136 168 h30" {...ink(3.6)} />
        <path d="M176 128 l4 -6 M184 138 l6 -2 M180 148 l6 1" {...ink(3)} />
        <ellipse cx="172" cy="120" rx="2" ry="3" fill={INK} />
        <ellipse cx="190" cy="124" rx="1.6" ry="2.4" fill={INK} />

        <path d={tail} fill={fur} {...line} />

        {/* дальние лапы стоят, сапожки темнее */}
        {leg('M74 124 L 74 140', furFar)}
        <path d={bootPath(74, 160)} fill={bootFar} {...line} />
        {leg('M124 124 L 124 140', furFar)}
        <path d={bootPath(124, 160)} fill={bootFar} {...line} />

        <path d={body} fill={fur} {...line} />
        <path d={neck} fill={fur} />
        <path d="M135 56 C 128 62, 124 70, 121 80" {...ink(3.2)} />
        <path d="M160 86 C 157 91, 155 96, 153 101" {...ink(3.2)} />
        <path d={head} fill={fur} />
        <path d={headLine} {...ink(3.2)} />

        {/* ближние лапы: задняя стоит, передняя шагает и брызгает */}
        {leg('M52 124 L 52 140', fur)}
        <path d={bootPath(52, 160)} fill={boot} {...line} />
        <path d={bootRim(52, 160)} {...ink(3.2)} />
        {leg('M140 120 L 150 134', fur)}
        <g transform="rotate(-30 158 150)">
          <path d={bootPath(158, 158)} fill={boot} {...line} />
          <path d={bootRim(158, 158)} {...ink(3.2)} />
        </g>

        {/* живот, ухо, глаз, нос, улыбка */}
        <path d="M76 114 C 92 121, 112 121, 128 114" {...ink(2.8)} />
        <path d={earPath} fill={ear} {...line} />
        <ellipse cx="165" cy="56" rx="3.4" ry="4" fill={INK} />
        <path d="M158 47 C 161 44, 166 44, 169 46" {...ink(2.4)} />
        <ellipse cx="190" cy="72" rx="4.2" ry="3.8" fill={INK} />
        <path d="M168 78 C 174 82, 182 82, 187 79" {...ink(2.6)} />
      </g>
    </g>
  )
}
