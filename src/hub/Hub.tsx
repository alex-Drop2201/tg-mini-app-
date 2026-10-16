import type { ReactNode } from 'react'
import { paletteOf, useColorSettings } from '../colors.ts'
import { labelOf, useOptions } from '../options.ts'
import { Scene } from '../pet/critter/Scene.tsx'
import { defaultLook, SPECIES } from '../pet/look.ts'
import { moodOf, needOf, type Pet, type Stat } from '../pet/model.ts'
import { usePet } from '../pet/usePet.ts'
import { haptic, tg } from '../telegram.ts'
import { useTelegramNavigation } from '../useTelegramNavigation.ts'
import { Wheel } from '../wheel/Wheel.tsx'

// Главный экран: все приложения в одном месте. Карточки живые: колесо с вашими
// вариантами и цветами, питомец в своём образе и с текущим настроением.

const noop = () => {}

const NEED_TEXT: Record<Stat, string> = {
  hunger: 'Хочет кушать 🍖',
  fun: 'Скучает 🎾',
  energy: 'Хочет спать ⚡',
  clean: 'Пора мыться 🫧',
}

export default function Hub() {
  const [options] = useOptions()
  const [colors] = useColorSettings()
  const { loading, pet } = usePet()

  // Это корень: ни «Назад», ни «Настройки» здесь не нужны.
  useTelegramNavigation({ inSubscreen: false, back: noop })

  if (!options || !colors || loading) return <main className="app" />

  const labels = options.map(labelOf)
  const name = tg?.initDataUnsafe.user?.first_name
  const extra = labels.length - 3

  return (
    <main className="app hub">
      <header className="hub-header">
        <p className="hint">{name ? `Привет, ${name}!` : 'Привет!'}</p>
        <h1>Мои приложения</h1>
      </header>

      <AppCard
        href="./wheel/"
        title="Колесо решений"
        subtitle={labels.slice(0, 3).join(', ') + (extra > 0 ? ` и ещё ${extra}` : '')}
        art={
          <div className="wheel-art">
            <Wheel labels={labels} winner={null} palette={paletteOf(colors)} className="hub-wheel" />
          </div>
        }
      />

      <AppCard
        href="./pet/"
        title={pet ? pet.name.trim() || SPECIES[pet.look.species].defaultName : 'Питомец'}
        subtitle={pet ? petStatus(pet) : 'Заведите питомца: такса, корги, котик, лисёнок или зайчик'}
        alert={pet !== null && needOf(pet) !== null && !pet.sleeping}
        art={
          <Scene
            look={pet?.look ?? defaultLook()}
            mood={pet ? moodOf(pet) : 'happy'}
            dirt={pet && pet.clean < 60 ? (60 - pet.clean) / 60 : 0}
            crop
          />
        }
      />

      <p className="footnote center">Скоро здесь появятся новые приложения ✨</p>
    </main>
  )
}

function petStatus(pet: Pet) {
  const baby = SPECIES[pet.look.species].baby
  if (pet.sleeping) return `${baby} · Спит 💤`
  const need = needOf(pet)
  if (need) return `${baby} · ${NEED_TEXT[need]}`
  return `${baby} · ${moodOf(pet) === 'happy' ? 'Отличное настроение ❤️' : 'Всё хорошо'}`
}

type CardProps = {
  href: string
  title: string
  subtitle: string
  art: ReactNode
  alert?: boolean
}

function AppCard({ href, title, subtitle, art, alert = false }: CardProps) {
  return (
    <a className="app-card" href={href} onClick={() => haptic.tick()}>
      <span className="app-card-art">
        {art}
        {alert && <span className="app-card-alert">Нужна забота</span>}
      </span>
      <span className="app-card-body">
        <span className="app-card-text">
          <span className="app-card-title">{title}</span>
          <span className="app-card-subtitle">{subtitle}</span>
        </span>
        <span className="app-card-open">Открыть</span>
      </span>
    </a>
  )
}

