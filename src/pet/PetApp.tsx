import { useEffect, useRef, useState, type FormEvent } from 'react'
import { haptic } from '../telegram.ts'
import { Dachshund, type Activity } from './Dachshund.tsx'
import {
  ageText,
  moodOf,
  needOf,
  refusal,
  STATS,
  type Action,
  type Mood,
  type Pet,
  type Stat,
} from './model.ts'
import { usePet } from './usePet.ts'

const MAX_NAME_LENGTH = 20
const DEFAULT_NAME = 'Сосиска'

const STAT_INFO: Record<Stat, { icon: string; label: string }> = {
  hunger: { icon: '🍖', label: 'Сытость' },
  fun: { icon: '🎾', label: 'Настроение' },
  energy: { icon: '⚡', label: 'Энергия' },
  clean: { icon: '🛁', label: 'Чистота' },
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

const PHRASES: Record<'happy' | 'ok', string[]> = {
  happy: ['Гав! Я тебя люблю!', 'Ты лучший хозяин!', 'Погладь меня ещё!', 'Жизнь прекрасна!'],
  ok: ['Гав!', 'Чем займёмся?', 'Я тут!', 'Что будем делать?'],
}

export default function PetApp() {
  const { loading, pet, now, adopt, perform } = usePet()
  if (loading) return <main className="app" />
  if (!pet) return <AdoptScreen onAdopt={adopt} />
  return <PetScreen pet={pet} now={now} perform={perform} />
}

function PetScreen({ pet, now, perform }: { pet: Pet; now: number; perform: (action: Action) => void }) {
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

  const mood = moodOf(pet)
  const phrase = message && message.until > now ? message.text : phraseFor(pet, mood, now)
  const dirt = pet.clean < 60 ? (60 - pet.clean) / 60 : 0
  const busy = activity !== null && activity !== 'pet'

  const actions: { action: Action; icon: string; label: string }[] = [
    { action: 'feed', icon: '🍖', label: 'Покормить' },
    { action: 'play', icon: '🎾', label: 'Поиграть' },
    { action: 'wash', icon: '🛁', label: 'Помыть' },
    pet.sleeping
      ? { action: 'wake', icon: '☀️', label: 'Разбудить' }
      : { action: 'sleep', icon: '🌙', label: 'Уложить спать' },
  ]

  return (
    <main className="app">
      <header className="pet-header">
        <h1>{pet.name}</h1>
        <p className="hint">Щенок · {ageText(pet.bornAt, now)}</p>
      </header>

      <div className={`scene${pet.sleeping ? ' night' : ''}`}>
        <p className="speech" aria-live="polite">
          {phrase}
        </p>
        <Dachshund
          key={activity === 'pet' ? petCount : 'dog'}
          mood={mood}
          activity={activity}
          dirt={dirt}
          onClick={() => run('pet')}
        />
      </div>

      <section className="card stats">
        {STATS.map((stat) => (
          <div className="stat" key={stat}>
            <span className="stat-icon" aria-hidden>
              {STAT_INFO[stat].icon}
            </span>
            <span className="stat-label">{STAT_INFO[stat].label}</span>
            <span className="bar" role="meter" aria-valuenow={Math.round(pet[stat])} aria-valuemin={0} aria-valuemax={100} aria-label={STAT_INFO[stat].label}>
              <span
                className={`bar-fill${pet[stat] < 30 ? ' low' : ''}`}
                style={{ width: `${pet[stat]}%` }}
              />
            </span>
          </div>
        ))}
      </section>

      <div className="actions">
        {actions.map(({ action, icon, label }) => (
          <button
            key={action}
            className="action"
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

      <p className="footnote center">Нажмите на щенка, чтобы погладить</p>
    </main>
  )
}

function phraseFor(pet: Pet, mood: Mood, now: number) {
  if (mood === 'sleeping') return 'Хр-р-р…'
  const need = needOf(pet)
  if (need) return NEED_PHRASES[need]
  const list = PHRASES[mood === 'happy' ? 'happy' : 'ok']
  return list[Math.floor(now / 8000) % list.length]
}

function AdoptScreen({ onAdopt }: { onAdopt: (name: string) => void }) {
  const [name, setName] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    haptic.success()
    onAdopt(name.trim() || DEFAULT_NAME)
  }

  return (
    <main className="app">
      <h1>Ваш новый друг</h1>
      <div className="scene">
        <p className="speech">Гав! Забери меня домой!</p>
        <Dachshund mood="happy" activity={null} dirt={0} />
      </div>
      <p className="hint center">Щенок таксы ждёт хозяина. Как его назовём?</p>
      <form className="adopt" onSubmit={submit}>
        <div className="card">
          <input
            className="text-input"
            value={name}
            placeholder={DEFAULT_NAME}
            maxLength={MAX_NAME_LENGTH}
            aria-label="Имя щенка"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button className="button" type="submit">
          Забрать домой
        </button>
      </form>
    </main>
  )
}
