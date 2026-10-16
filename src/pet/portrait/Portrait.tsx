import { useId } from 'react'

// Такса в трёх стилях по референсам владельца. Каждая картинка 200×200 вместе с фоном.
// Формы нарочно неровные, «от руки»; контур рисуется отдельным слоем поверх заливок.

const INK = '#1c1714'

export type PortraitStyle = 'peek' | 'painted' | 'walk'

export function DachshundArt({ style }: { style: PortraitStyle }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  if (style === 'peek') return <Peek />
  if (style === 'walk') return <Walk />
  return <Painted uid={uid} />
}

/* 1. Как колли: выглядывает из-за края, чистая линия, глаза-бусинки. */

function Peek() {
  const fur = '#c97a42'
  const ear = '#7a4426'
  const line = { stroke: INK, strokeWidth: 4.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <g>
      <rect width="200" height="200" fill="#ffffff" />
      {/* висячее ухо слева и торчащее справа, как у колли */}
      <path d="M58 96 C 34 92, 20 74, 30 60 C 40 48, 62 56, 74 72 C 78 80, 74 90, 66 96 Z" fill={ear} {...line} />
      <path d={"M50 74 C 46 70, 42 66, 40 62"} fill="none" {...line} strokeWidth={3} />
      <path d="M128 84 C 128 60, 142 34, 162 26 C 172 40, 172 70, 160 96 Z" fill={fur} {...line} />
      <path d="M140 80 C 142 62, 150 46, 160 38 C 164 52, 162 70, 154 86 Z" fill={ear} opacity="0.55" />
      {hairs(['M152 52 l8 2', 'M150 60 l8 1', 'M148 68 l8 0'], 2.6)}
      {/* голова: щёки распушены зубчиками */}
      <path
        d="M38 160 C 34 146, 30 136, 38 128 C 32 124, 36 116, 42 114 C 40 98, 54 82, 74 76 C 90 70, 112 70, 130 78 C 150 86, 162 102, 160 116 C 166 118, 168 126, 162 130 C 170 136, 166 148, 162 160 Z"
        fill={fur}
        {...line}
      />
      {/* белая проточина от лба к носу */}
      <path d="M94 74 C 92 92, 88 108, 80 124 C 74 136, 78 150, 100 152 C 122 150, 126 136, 120 124 C 112 108, 108 92, 106 74 Z" fill="#ffffff" {...line} strokeWidth={3.6} />
      <ellipse cx="72" cy="114" rx="6.5" ry="7.5" fill={INK} />
      <circle cx="74.5" cy="111" r="2" fill="#ffffff" />
      <ellipse cx="128" cy="114" rx="6.5" ry="7.5" fill={INK} />
      <circle cx="130.5" cy="111" r="2" fill="#ffffff" />
      <path d="M86 132 C 86 122, 114 122, 114 132 C 114 142, 104 146, 100 146 C 96 146, 86 142, 86 132 Z" fill={INK} />
      <ellipse cx="94" cy="128" rx="4" ry="2.4" fill="#ffffff" opacity="0.6" />
      {/* край, из-за которого выглядывает, и лапки поверх */}
      <path d={"M10 160 H190"} fill="none" {...line} strokeWidth={5} />
      {[64, 136].map((x) => (
        <g key={x}>
          <path d={`M${x - 20} 162 C ${x - 22} 144, ${x - 6} 136, ${x + 6} 142 C ${x + 18} 148, ${x + 20} 156, ${x + 20} 162 Z`} fill="#ffffff" {...line} />
          <path d={`M${x - 6} 162 v-8 M${x + 6} 162 v-8`} fill="none" {...line} strokeWidth={3} />
        </g>
      ))}
    </g>
  )
}

/* 2. Как такса, ослик и бобёр: портрет крупно, гуашь, глаза-пуговицы. */

function Painted({ uid }: { uid: string }) {
  const fur = '#8b5a33'
  const brush = `url(#${uid}-brush)`
  const gouache = `url(#${uid}-gouache)`
  const paper = `url(#${uid}-paper)`
  const ink = { fill: 'none', stroke: INK, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const body = 'M-10 210 C -10 176, 14 148, 50 128 C 72 116, 86 100, 92 78 L 124 80 C 128 108, 120 132, 106 154 C 94 174, 90 192, 94 210 Z'
  const head = 'M90 70 C 88 42, 106 24, 128 24 C 150 24, 164 40, 162 62 C 160 84, 170 108, 184 136 C 190 150, 184 162, 170 158 C 148 148, 120 130, 104 112 C 94 100, 90 86, 90 70 Z'
  return (
    <g>
      <defs>
        {/* Неровный край кисти: крупная волна и мелкая шершавость */}
        <filter id={`${uid}-brush`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="4" result="wave" />
          <feDisplacementMap in="SourceGraphic" in2="wave" scale="4" xChannelSelector="R" yChannelSelector="G" result="wavy" />
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="9" result="rough" />
          <feDisplacementMap in="wavy" in2="rough" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Гуашь: пятна светлее и темнее, мелкое зерно бумаги */}
        <filter id={`${uid}-gouache`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="2" result="wave" />
          <feDisplacementMap in="SourceGraphic" in2="wave" scale="3" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="8" result="mottle" />
          <feColorMatrix in="mottle" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.7 0 0 0 -0.3" result="shade" />
          <feComposite in="shade" in2="shape" operator="in" result="shadeIn" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -1 0 0 0 0.5" result="light" />
          <feComposite in="light" in2="shape" operator="in" result="lightIn" />
          <feMerge>
            <feMergeNode in="shape" />
            <feMergeNode in="shadeIn" />
            <feMergeNode in="lightIn" />
          </feMerge>
        </filter>
        <filter id={`${uid}-paper`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -0.8 0 0 0 0.42" result="light" />
          <feComposite in="light" in2="SourceGraphic" operator="in" result="lightIn" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="lightIn" />
          </feMerge>
        </filter>
      </defs>

      <rect width="200" height="200" fill="#ff8db3" filter={paper} />

      <g filter={gouache}>
        {/* ухо, отлетевшее назад, и второе, выглядывающее из-за шеи */}
        <path d="M100 52 C 80 32, 44 32, 32 48 C 22 62, 36 80, 58 78 C 74 76, 90 68, 98 62 Z" fill="#1f1714" />
        <path d="M94 74 C 76 78, 62 90, 66 100 C 76 104, 88 94, 96 86 Z" fill="#1f1714" />
        <path d={body} fill={fur} />
        <path d={head} fill={fur} />
        <path d="M98 94 C 86 96, 72 102, 74 109 C 78 114, 92 108, 102 100 Z" fill="#f2665f" />
      </g>

      <g filter={brush}>
        <path d={body} {...ink} />
        <path d={head} {...ink} />
        <path d="M98 94 C 86 96, 72 102, 74 109 C 78 114, 92 108, 102 100" {...ink} strokeWidth={3} />
        <path d="M102 98 C 124 118, 150 138, 172 150" {...ink} strokeWidth={3.2} />
        <path d="M166 150 C 172 146, 182 150, 182 156 C 182 162, 172 164, 168 160 Z" fill={INK} stroke={INK} strokeWidth="3" />
        {/* лапки-завитки внизу, как на референсе */}
        <path d="M20 168 C 30 160, 44 164, 42 174 C 40 182, 30 182, 28 176" {...ink} strokeWidth={3.4} />
        <path d="M30 168 l-2 -6 M36 168 l2 -6" {...ink} strokeWidth={2.4} />
        <path d="M30 196 C 40 188, 54 192, 52 202" {...ink} strokeWidth={3.4} />
        {/* волоски на макушке */}
        <path d="M120 26 C 120 16, 126 10, 136 8" {...ink} strokeWidth={2.4} />
        <path d="M128 25 C 132 16, 140 12, 150 13" {...ink} strokeWidth={2.4} />
        <path d="M114 28 C 110 20, 112 14, 118 10" {...ink} strokeWidth={2.2} />
        {/* точки усов на морде */}
        <circle cx="160" cy="132" r="1.4" fill={INK} />
        <circle cx="165" cy="137" r="1.4" fill={INK} />
        <circle cx="158" cy="139" r="1.2" fill={INK} />
      </g>

      {/* глаза-пуговицы вылезают за контур головы */}
      <g filter={brush}>
        <circle cx="120" cy="50" r="16" fill="#ffffff" stroke={INK} strokeWidth="4" />
        <circle cx="149" cy="47" r="14" fill="#ffffff" stroke={INK} strokeWidth="4" />
      </g>
      <circle cx="124" cy="52" r="3.6" fill={INK} />
      <circle cx="152" cy="49" r="3.4" fill={INK} />
    </g>
  )
}

/* 3. Как утёнок: в полный рост, на ходу, чистая линия и плоские цвета. */

function Walk() {
  const fur = '#d4843f'
  const ear = '#7a4426'
  const line = { stroke: INK, strokeWidth: 4.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <g>
      <rect width="200" height="200" fill="#f4fbef" />
      {/* брызги и тень под лапами */}
      <ellipse cx="110" cy="176" rx="40" ry="3.5" fill={INK} />
      <path d="M40 176 h14 M150 176 h10 M168 172 h8" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M30 150 l-2 6 M24 158 l-1 5 M36 160 l-1 4" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      {/* хвост */}
      <path d="M44 104 C 30 96, 24 82, 28 70" fill="none" {...line} strokeWidth={13} />
      <path d="M44 104 C 30 96, 24 82, 28 70" fill="none" stroke={fur} strokeWidth="5" strokeLinecap="round" />
      {/* дальние лапы */}
      <path d="M70 128 C 70 144, 66 154, 58 162" fill="none" {...line} strokeWidth={15} />
      <path d="M70 128 C 70 144, 66 154, 58 162" fill="none" stroke={ear} strokeWidth="6.5" strokeLinecap="round" />
      <path d="M138 130 L 140 168" fill="none" {...line} strokeWidth={15} />
      <path d="M138 130 L 140 168" fill="none" stroke={ear} strokeWidth="6.5" strokeLinecap="round" />
      {/* тело-сосиска */}
      <path d="M40 112 C 38 92, 56 84, 76 84 L 132 84 C 152 84, 164 96, 162 114 C 160 132, 146 138, 128 138 L 70 138 C 50 138, 42 128, 40 112 Z" fill={fur} {...line} />
      <path d="M76 118 C 92 128, 116 128, 134 118" fill="none" {...line} strokeWidth={3.4} />
      {/* ближние лапы: задняя отведена назад в шаге, передняя вперёд */}
      <path d="M62 132 C 56 146, 44 152, 34 152" fill="none" {...line} strokeWidth={16} />
      <path d="M62 132 C 56 146, 44 152, 34 152" fill="none" stroke={fur} strokeWidth="7.5" strokeLinecap="round" />
      <path d="M146 130 C 150 146, 158 156, 168 162" fill="none" {...line} strokeWidth={16} />
      <path d="M146 130 C 150 146, 158 156, 168 162" fill="none" stroke={fur} strokeWidth="7.5" strokeLinecap="round" />
      {/* голова с длинной мордой */}
      <path d="M144 70 C 140 50, 154 36, 170 38 C 182 40, 186 50, 184 58 C 190 62, 196 68, 196 74 C 192 80, 180 82, 170 82 C 158 86, 146 82, 144 70 Z" fill={fur} {...line} />
      <path d="M156 46 C 142 44, 132 54, 136 70 C 140 78, 150 74, 154 64 Z" fill={ear} {...line} />
      <circle cx="173" cy="52" r="3.4" fill={INK} />
      <ellipse cx="194" cy="72" rx="4.5" ry="4" fill={INK} />
      <path d="M176 76 C 180 78, 186 78, 190 76" fill="none" {...line} strokeWidth={3} />
    </g>
  )
}

function hairs(paths: string[], width: number) {
  return paths.map((d) => <path key={d} d={d} fill="none" stroke={INK} strokeWidth={width} strokeLinecap="round" />)
}
