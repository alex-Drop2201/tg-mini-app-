import { useState } from 'react'
import { haptic, hasBackButton } from '../../telegram.ts'
import { CloseUp, CritterPreview, Scene } from '../critter/Scene.tsx'
import {
  FURS,
  GLASSES,
  HATS,
  NECKWEAR,
  SCENES,
  SPECIES,
  type FurId,
  type Look,
  type SpeciesId,
} from '../look.ts'
import type { Pet } from '../model.ts'
import { Pick, Segmented, SpeciesGrid } from './parts.tsx'

type Tab = 'pet' | 'fur' | 'accessories' | 'scene'

const TABS: [Tab, string][] = [
  ['pet', 'Питомец'],
  ['fur', 'Окрас'],
  ['accessories', 'Вещи'],
  ['scene', 'Фон'],
]

const MAX_NAME_LENGTH = 20

const ids = <T extends string>(catalog: Record<T, unknown>) => Object.keys(catalog) as T[]

type Props = {
  pet: Pet
  onChange: (change: { look?: Look; name?: string }) => void
  onBack: () => void
}

export function LookScreen({ pet, onChange, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('pet')
  const look = pet.look
  const info = SPECIES[look.species]

  const update = (patch: Partial<Look>) => {
    haptic.tick()
    onChange({ look: { ...look, ...patch } })
  }

  // При смене вида родной окрас прошлого меняем на родной окрас нового: рыжая такса
  // станет серым котиком. Если окрас выбирали сами, оставляем его.
  const changeSpecies = (species: SpeciesId) => {
    const keepFur = look.fur !== info.defaultFur
    update({ species, fur: keepFur ? look.fur : SPECIES[species].defaultFur })
  }

  const switchTab = (next: Tab) => {
    haptic.tick()
    setTab(next)
  }

  return (
    <main className="app pet-app">
      {!hasBackButton && (
        <button className="back-button" onClick={onBack}>
          ‹ Назад
        </button>
      )}

      <div className="look-preview">
        <div className="stage">
          <Scene look={look} mood="happy" />
          <p className="speech">{info.sound}! Красиво?</p>
        </div>
        <Segmented value={tab} options={TABS} onChange={switchTab} />
      </div>

      {tab === 'pet' && (
        <>
          <section>
            <h2 className="section-title">Кто</h2>
            <SpeciesGrid value={look.species} onChange={changeSpecies} />
          </section>
          <section>
            <h2 className="section-title">Имя</h2>
            <div className="card">
              <input
                className="text-input"
                value={pet.name}
                placeholder={info.defaultName}
                maxLength={MAX_NAME_LENGTH}
                aria-label="Имя питомца"
                onChange={(e) => onChange({ name: e.target.value })}
                onBlur={() => !pet.name.trim() && onChange({ name: info.defaultName })}
              />
            </div>
          </section>
        </>
      )}

      {tab === 'fur' && (
        <div className="pick-grid">
          {ids(FURS).map((fur: FurId) => (
            <Pick key={fur} selected={look.fur === fur} label={FURS[fur].name} onClick={() => update({ fur })}>
              <CritterPreview look={{ ...look, fur, hat: 'none', glasses: 'none' }} />
            </Pick>
          ))}
        </div>
      )}

      {tab === 'accessories' && (
        <>
          <section>
            <h2 className="section-title">На голову</h2>
            <div className="pick-grid">
              {ids(HATS).map((hat) => (
                <Pick key={hat} selected={look.hat === hat} label={HATS[hat]} onClick={() => update({ hat })}>
                  <CloseUp look={{ ...look, hat }} part="head" />
                </Pick>
              ))}
            </div>
          </section>
          <section>
            <h2 className="section-title">Очки</h2>
            <div className="pick-grid">
              {ids(GLASSES).map((glasses) => (
                <Pick key={glasses} selected={look.glasses === glasses} label={GLASSES[glasses]} onClick={() => update({ glasses })}>
                  <CloseUp look={{ ...look, glasses, hat: 'none' }} part="head" />
                </Pick>
              ))}
            </div>
          </section>
          <section>
            <h2 className="section-title">На шею</h2>
            <div className="pick-grid">
              {ids(NECKWEAR).map((neck) => (
                <Pick key={neck} selected={look.neck === neck} label={NECKWEAR[neck]} onClick={() => update({ neck })}>
                  <CloseUp look={{ ...look, neck }} part="neck" />
                </Pick>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === 'scene' && (
        <div className="pick-grid two">
          {ids(SCENES).map((scene) => (
            <Pick key={scene} selected={look.scene === scene} label={SCENES[scene]} onClick={() => update({ scene })}>
              <Scene look={{ ...look, scene }} mood="ok" still />
            </Pick>
          ))}
        </div>
      )}
    </main>
  )
}
