import { useEffect, useRef } from 'react'
import {
  MAX_CUSTOM_COLORS,
  MIN_CUSTOM_COLORS,
  PRESETS,
  SWATCHES,
  paletteOf,
  textColorOn,
  type ColorSettings,
  type PresetId,
} from '../colors.ts'
import { haptic, hasBackButton } from '../telegram.ts'
import { Wheel } from '../wheel/Wheel.tsx'

type Props = {
  settings: ColorSettings
  labels: string[]
  onChange: (settings: ColorSettings) => void
  onBack: () => void
}

export function ColorsScreen({ settings, labels, onChange, onBack }: Props) {
  const { preset, custom } = settings

  const selectPreset = (id: PresetId) => {
    if (id === preset) return
    haptic.tick()
    onChange({ ...settings, preset: id })
  }

  // Нажатие на цвет добавляет его в конец палитры или убирает, в пределах 2–6 цветов.
  const toggleColor = (color: string) => {
    const selected = custom.includes(color)
    if (selected ? custom.length <= MIN_CUSTOM_COLORS : custom.length >= MAX_CUSTOM_COLORS) return
    haptic.tick()
    onChange({
      preset: 'custom',
      custom: selected ? custom.filter((c) => c !== color) : [...custom, color],
    })
  }

  // Цвета из системной палитры, которых нет в сетке, тоже показываем, чтобы их можно было убрать.
  const swatches = [...SWATCHES, ...custom.filter((color) => !SWATCHES.includes(color))]

  return (
    <main className="app">
      {!hasBackButton && (
        <button className="back-button" onClick={onBack}>
          ‹ Назад
        </button>
      )}
      <h1>Цвета колеса</h1>

      <Wheel labels={labels} winner={null} palette={paletteOf(settings)} className="wheel-preview" />

      <section>
        <h2 className="section-title">Палитра</h2>
        <div className="card">
          {PRESETS.map(({ id, name, colors }) => (
            <PaletteRow
              key={id}
              name={name}
              colors={colors}
              selected={preset === id}
              onClick={() => selectPreset(id)}
            />
          ))}
          <PaletteRow
            name="Свои цвета"
            colors={custom}
            selected={preset === 'custom'}
            onClick={() => selectPreset('custom')}
          />
        </div>
      </section>

      {preset === 'custom' && (
        <section>
          <h2 className="section-title">
            Свои цвета · {custom.length} из {MAX_CUSTOM_COLORS}
          </h2>
          <div className="card swatches">
            {swatches.map((color) => {
              const order = custom.indexOf(color)
              return (
                <button
                  key={color}
                  className={`swatch${order >= 0 ? ' selected' : ''}`}
                  style={{ background: color, color: textColorOn(color) }}
                  aria-label={order >= 0 ? `Убрать цвет ${color}` : `Добавить цвет ${color}`}
                  aria-pressed={order >= 0}
                  onClick={() => toggleColor(color)}
                >
                  {order >= 0 ? order + 1 : ''}
                </button>
              )
            })}
            <OtherColorButton
              disabled={custom.length >= MAX_CUSTOM_COLORS}
              onPick={(color) => !custom.includes(color) && toggleColor(color)}
            />
          </div>
          <p className="footnote">
            Нажмите на цвет, чтобы добавить или убрать его. Цвета идут по кругу в порядке номеров,
            нужно от {MIN_CUSTOM_COLORS} до {MAX_CUSTOM_COLORS}. «+» открывает палитру телефона.
          </p>
        </section>
      )}
    </main>
  )
}

type PaletteRowProps = {
  name: string
  colors: string[] | null
  selected: boolean
  onClick: () => void
}

function PaletteRow({ name, colors, selected, onClick }: PaletteRowProps) {
  return (
    <button className="row-button" aria-pressed={selected} onClick={onClick}>
      <span className="dots" aria-hidden>
        {colors
          ? colors.map((color) => <span key={color} className="dot" style={{ background: color }} />)
          : [0, 1, 2].map((tone) => <span key={tone} className={`dot dot-tone-${tone}`} />)}
      </span>
      <span className="row-label">{name}</span>
      {selected && <span className="check">✓</span>}
    </button>
  )
}

/**
 * Системная палитра цветов. Слушаем родное событие change, а не onChange React:
 * тот срабатывает на каждое движение пальца в палитре.
 */
function OtherColorButton({ disabled, onPick }: { disabled: boolean; onPick: (color: string) => void }) {
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const element = input.current
    if (!element) return
    const handle = () => onPick(element.value.toLowerCase())
    element.addEventListener('change', handle)
    return () => element.removeEventListener('change', handle)
  }, [onPick])

  return (
    <label className={`swatch swatch-other${disabled ? ' disabled' : ''}`} aria-label="Другой цвет">
      +
      <input ref={input} type="color" defaultValue="#2aabee" disabled={disabled} />
    </label>
  )
}
