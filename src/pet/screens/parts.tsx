import type { ReactNode } from 'react'
import { CritterPreview } from '../critter/Scene.tsx'
import { defaultLook, SPECIES, type SpeciesId } from '../look.ts'

/** Переключатель вкладок в стиле iOS. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: [T, string][]
  onChange: (value: T) => void
}) {
  return (
    <div className="segmented" role="tablist">
      {options.map(([id, label]) => (
        <button
          key={id}
          role="tab"
          aria-selected={id === value}
          className={id === value ? 'on' : undefined}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/** Карточка выбора: картинка, подпись и галочка у выбранной. */
export function Pick({
  selected,
  label,
  onClick,
  children,
}: {
  selected: boolean
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button className={`pick${selected ? ' selected' : ''}`} aria-pressed={selected} onClick={onClick}>
      <span className="pick-art">{children}</span>
      <span className="pick-label">{label}</span>
    </button>
  )
}

const SPECIES_IDS = Object.keys(SPECIES) as SpeciesId[]

/** Выбор вида: каждый зверёк в своём родном окрасе. */
export function SpeciesGrid({ value, onChange }: { value: SpeciesId; onChange: (id: SpeciesId) => void }) {
  return (
    <div className="pick-grid">
      {SPECIES_IDS.map((id) => (
        <Pick key={id} selected={id === value} label={SPECIES[id].name} onClick={() => onChange(id)}>
          <CritterPreview look={defaultLook(id)} />
        </Pick>
      ))}
    </div>
  )
}
