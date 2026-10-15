import { useStoredState } from './useStoredState.ts'

export const MIN_CUSTOM_COLORS = 2
export const MAX_CUSTOM_COLORS = 6

export type PresetId = 'telegram' | 'bright' | 'pastel' | 'ocean' | 'sunset' | 'forest' | 'custom'

type Preset = { id: Exclude<PresetId, 'custom'>; name: string; colors: string[] | null }

/** colors: null — оттенки цвета кнопки из темы Telegram (подстраиваются под тему). */
export const PRESETS: Preset[] = [
  { id: 'telegram', name: 'Telegram', colors: null },
  {
    id: 'bright',
    name: 'Яркая',
    colors: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#a855f7'],
  },
  {
    id: 'pastel',
    name: 'Пастель',
    colors: ['#ffb3ba', '#ffdfba', '#fff5ba', '#baffc9', '#bae1ff', '#d7baff'],
  },
  {
    id: 'ocean',
    name: 'Океан',
    colors: ['#023e8a', '#48cae4', '#0077b6', '#90e0ef', '#0096c7', '#caf0f8'],
  },
  {
    id: 'sunset',
    name: 'Закат',
    colors: ['#e94f64', '#ffb26b', '#a64ac9', '#ffd56f', '#ff7b54', '#ff8fab'],
  },
  {
    id: 'forest',
    name: 'Лес',
    colors: ['#2d6a4f', '#95d5b2', '#40916c', '#b7e4c7', '#1b4332', '#74c69d'],
  },
]

/** Цвета, из которых собирается своя палитра. */
export const SWATCHES = [
  '#ef4444', '#f97316', '#f59e0b', '#facc15', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#78716c', '#1c1c1e', '#ffffff',
]

export type ColorSettings = { preset: PresetId; custom: string[] }

const DEFAULT_SETTINGS: ColorSettings = {
  preset: 'telegram',
  custom: ['#3b82f6', '#f97316', '#22c55e'],
}

export function useColorSettings() {
  return useStoredState('wheel_colors_v1', DEFAULT_SETTINGS, parseSettings)
}

/** Палитра колеса; null — стиль Telegram. */
export function paletteOf(settings: ColorSettings) {
  if (settings.preset === 'custom') return settings.custom
  return PRESETS.find((preset) => preset.id === settings.preset)?.colors ?? null
}

export function presetName(id: PresetId) {
  if (id === 'custom') return 'Свои цвета'
  return PRESETS.find((preset) => preset.id === id)?.name ?? 'Telegram'
}

/**
 * Цвета n секторов: палитра по кругу. Если последний сектор совпал бы с первым
 * (они соседи), берём другой цвет палитры, а при двух цветах — их смесь.
 */
export function sectorColors(palette: string[], n: number) {
  const k = palette.length
  const colors = Array.from({ length: n }, (_, i) => palette[i % k])
  if ((n - 1) % k === 0) {
    colors[n - 1] = k >= 3 ? palette[1] : mix(palette[0], palette[1])
  }
  return colors
}

/** Тёмный или белый текст, смотря что лучше читается на этом фоне. */
export function textColorOn(hex: string) {
  return luminance(hex) > 0.3 ? '#1c1c1e' : '#ffffff'
}

function channels(hex: string) {
  const value = parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

/** Относительная яркость по WCAG, от 0 (чёрный) до 1 (белый). */
function luminance(hex: string) {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function mix(a: string, b: string) {
  const cb = channels(b)
  return `#${channels(a)
    .map((c, i) => Math.round((c + cb[i]) / 2).toString(16).padStart(2, '0'))
    .join('')}`
}

const HEX_COLOR = /^#[0-9a-f]{6}$/

function parseSettings(value: unknown): ColorSettings | null {
  if (typeof value !== 'object' || value === null) return null
  const { preset, custom } = value as Record<string, unknown>
  const validPreset = preset === 'custom' || PRESETS.some((p) => p.id === preset)
  const validCustom =
    Array.isArray(custom) &&
    custom.length >= MIN_CUSTOM_COLORS &&
    custom.length <= MAX_CUSTOM_COLORS &&
    custom.every((color) => typeof color === 'string' && HEX_COLOR.test(color))
  return validPreset && validCustom ? { preset: preset as PresetId, custom } : null
}
