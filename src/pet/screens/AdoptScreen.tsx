import { useState, type FormEvent } from 'react'
import { HomeLink } from '../../HomeLink.tsx'
import { haptic } from '../../telegram.ts'
import { Scene } from '../critter/Scene.tsx'
import { defaultLook, SPECIES, type Look, type SpeciesId } from '../look.ts'
import { SpeciesGrid } from './parts.tsx'

const MAX_NAME_LENGTH = 20

export function AdoptScreen({ onAdopt }: { onAdopt: (name: string, look: Look) => void }) {
  const [species, setSpecies] = useState<SpeciesId>('dachshund')
  const [name, setName] = useState('')
  const info = SPECIES[species]

  const choose = (id: SpeciesId) => {
    haptic.tick()
    setSpecies(id)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    haptic.success()
    onAdopt(name.trim() || info.defaultName, defaultLook(species))
  }

  return (
    <main className="app pet-app">
      <HomeLink />
      <h1>Кого заведём?</h1>
      <div className="stage">
        <Scene look={defaultLook(species)} mood="happy" />
        <p className="speech">{info.sound}! Забери меня домой!</p>
      </div>

      <SpeciesGrid value={species} onChange={choose} />

      <form className="adopt" onSubmit={submit}>
        <h2 className="section-title">Как назовём?</h2>
        <div className="card">
          <input
            className="text-input"
            value={name}
            placeholder={info.defaultName}
            maxLength={MAX_NAME_LENGTH}
            aria-label="Имя питомца"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button className="button" type="submit">
          Забрать домой
        </button>
      </form>
      <p className="footnote center">Окрас, аксессуары и фон можно поменять потом во «Внешности»</p>
    </main>
  )
}
