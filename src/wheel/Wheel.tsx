import type { Ref } from 'react'
import { sectorColors, textColorOn } from '../colors.ts'

const RADIUS = 100
const HUB_RADIUS = 14
// Текст заканчивается раньше края, чтобы стрелка не закрывала название победителя.
const TEXT_END = RADIUS - 16
const TEXT_LENGTH = TEXT_END - HUB_RADIUS - 4

type Props = {
  labels: string[]
  winner: number | null
  /** Цвета палитры; null — оттенки цвета кнопки из темы Telegram. */
  palette: string[] | null
  groupRef?: Ref<SVGGElement>
  onClick?: () => void
  className?: string
}

export function Wheel({ labels, winner, palette, groupRef, onClick, className = '' }: Props) {
  const n = labels.length
  const sector = 360 / n
  const fontSize = n <= 4 ? 11 : n <= 8 ? 9.5 : 8
  const maxChars = Math.floor(TEXT_LENGTH / (fontSize * 0.56))
  const fills = palette && sectorColors(palette, n)

  return (
    <svg
      className={`wheel${fills ? ' palette' : ''} ${className}`}
      viewBox="-110 -110 220 220"
      role="img"
      aria-label="Колесо решений"
      onClick={onClick}
    >
      <g ref={groupRef}>
        <circle r={RADIUS} className="wheel-base" />
        {labels.map((label, i) => {
          const middle = i * sector + sector / 2
          const state = winner === null ? '' : winner === i ? ' winner' : ' dim'
          const tone = fills ? '' : ` tone-${toneOf(i, n)}`
          return (
            <g key={i} className={`sector${tone}${state}`}>
              <path
                d={sectorPath(i * sector, (i + 1) * sector)}
                style={fills ? { fill: fills[i] } : undefined}
              />
              <text
                transform={`rotate(${middle - 90}) translate(${TEXT_END} 0)`}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={fontSize}
                style={fills ? { fill: textColorOn(fills[i]) } : undefined}
              >
                {truncate(label, maxChars)}
              </text>
            </g>
          )
        })}
      </g>
      <circle r={RADIUS} className="wheel-rim" />
      <circle r={HUB_RADIUS} className="wheel-hub" />
      <path d="M -9 -108 L 9 -108 L 0 -90 Z" className="wheel-pointer" />
    </svg>
  )
}

/**
 * Тон сектора в стиле Telegram: 0 — цвет кнопки, 1 и 2 — его прозрачные оттенки.
 * При нечётном n последний сектор получает тон 2, чтобы не совпасть с первым.
 */
function toneOf(i: number, n: number) {
  if (n % 2 === 1 && i === n - 1) return 2
  return i % 2
}

/** Точка на окружности: угол по часовой стрелке от верха. */
function point(angle: number, r = RADIUS) {
  const rad = (angle * Math.PI) / 180
  return `${(r * Math.sin(rad)).toFixed(3)} ${(-r * Math.cos(rad)).toFixed(3)}`
}

function sectorPath(from: number, to: number) {
  const largeArc = to - from > 180 ? 1 : 0
  return `M 0 0 L ${point(from)} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${point(to)} Z`
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}
