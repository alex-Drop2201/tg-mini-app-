import { useEffect, useRef, useState } from 'react'
import { haptic } from '../../telegram.ts'
import type { Activity } from '../critter/Critter.tsx'
import { Scene } from '../critter/Scene.tsx'
import { SPECIES } from '../look.ts'
import { ageText, moodOf, needOf, refusal, STATS, type Action, type Mood, type Pet, type Stat } from '../model.ts'

const STAT_INFO: Record<Stat, { icon: string; label: string }> = {
  hunger: { icon: '🍖', label: 'Сытость' },
  fun: { icon: '🎾', label: 'Настроение' },
  energy: { icon: '⚡', label: 'Энергия' },
  clean: { icon: '🫧', label: 'Чистота' },
}

/** Что происходит после действия: анимация, фраза и её длительность. */
const REACTIONS: Record<Action, { activity: Activity | null; text: string; ms: number }> = {
  feed: { activity: 'eat', text: 'Ням-ням!', ms: 2200 },
  play: { activity: 'play', text: 'Ещё! Ещё!', ms: 2400 },
  wash: { activity: 'wash', text: 'Буль-буль…', ms: 2200 },
  sleep: { activity: null, text: 'Спокойной ночи…', ms: 2000 },
  wake: { activity: null, text: 'Уже утро?', ms: 2000 },
  pet: { activity: 'pet', text: 'Хи-хи, щекотно!', ms: 1300 },
}

const NEED_PHRASES: Record<Stat, string> = {
  hunger: 'Хочу кушать!',
  fun: 'Мне скучно… Поиграй со мной!',
  energy: 'Глаза слипаются…',
  clean: 'Я весь грязный, помой меня!',
}

type Props = {
  pet: Pet
  now: number
  perform: (action: Action) => void
  onOpenLook: () => void
}

export function PetScreen({ pet, now, perform, onOpenLook }: Props) {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [message, setMessage] = useState<{ text: string; until: number } | null>(null)
  const [petCount, setPetCount] = useState(0)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const run = (action: Action) => {
    // Пока идёт анимация, ждём. Гладить можно и подряд.
    if (activity && !(action === 'pet' && activity === 'pet')) return
    const reason = refusal(pet, action)
    if (reason) {
      haptic.warning()
      setMessage({ text: reason, until: Date.now() + 2000 })
      return
    }
    perform(action)
    const reaction = REACTIONS[action]
    if (action === 'pet') {
      haptic.soft()
      setPetCount((count) => count + 1)
    } else {
      haptic.success()
    }
    setActivity(reaction.activity)
    setMessage({ text: reaction.text, until: Date.now() + reaction.ms })
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActivity(null), reaction.ms)
  }

  const info = SPECIES[pet.look.species]
  const mood = moodOf(pet)
  const phrase = message && message.until > now ? message.text : phraseFor(pet, mood, info.sound, now)
  const dirt = pet.clean < 60 ? (60 - pet.clean) / 60 : 0
  const busy = activity !== null && activity !== 'pet'

  const actions: { action: Action; icon: string; label: string }[] = [
    { action: 'feed', icon: '🍖', label: 'Покормить' },
    { action: 'play', icon: '🎾', label: 'Играть' },
    { action: 'wash', icon: '🫧', label: 'Помыть' },
    pet.sleeping
      ? { action: 'wake', icon: '☀️', label: 'Разбудить' }
      : { action: 'sleep', icon: '🌙', label: 'Спать' },
  ]

  return (
    <main className="app pet-app">
      <header className="pet-header">
        <h1>{pet.name.trim() || info.defaultName}</h1>
        <p className="hint">
          {info.baby} · {ageText(pet.bornAt, now)}
        </p>
      </header>

      <div className="stage">
        <Scene
          key={activity === 'pet' ? petCount : 'scene'}
          look={pet.look}
          mood={mood}
          activity={activity}
          dirt={dirt}
          onClick={() => run('pet')}
        />
        <p className="speech" aria-live="polite">
          {phrase}
        </p>
        <button className="stage-button" aria-label="Внешность" onClick={onOpenLook}>
          🎨
        </button>
      </div>

      <section className="stat-grid">
        {STATS.map((stat) => {
          const value = Math.round(pet[stat])
          return (
            <div key={stat} className={`stat-tile stat-${stat}${value < 30 ? ' low' : ''}`}>
              <div className="stat-top">
                <span aria-hidden>{STAT_INFO[stat].icon}</span>
                <span className="stat-label">{STAT_INFO[stat].label}</span>
                <span className="stat-value">{value}%</span>
              </div>
              <span
                className="bar"
                role="meter"
                aria-label={STAT_INFO[stat].label}
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="bar-fill" style={{ width: `${pet[stat]}%` }} />
              </span>
            </div>
          )
        })}
      </section>

      <div className="actions">
        {actions.map(({ action, icon, label }) => (
          <button
            key={action}
            className={`action action-${action}`}
            disabled={busy || (pet.sleeping && action !== 'wake')}
            onClick={() => run(action)}
          >
            <span className="action-icon" aria-hidden>
              {icon}
            </span>
            {label}
          </button>
        ))}
      </div>

      <p className="footnote center">Нажмите на питомца, чтобы погладить</p>
    </main>
  )
}

function phraseFor(pet: Pet, mood: Mood, sound: string, now: number) {
  if (mood === 'sleeping') return 'Хр-р-р…'
  const need = needOf(pet)
  if (need) return NEED_PHRASES[need]
  const list =
    mood === 'happy'
      ? [`${sound}! Я тебя люблю!`, 'Ты лучший хозяин!', 'Погладь меня ещё!', 'Жизнь прекрасна!']
      : [`${sound}!`, 'Чем займёмся?', 'Я тут!', 'Что будем делать?']
  return list[Math.floor(now / 8000) % list.length]
}
