// Модель питомца. Хранится только снимок состояния на момент последнего действия,
// а текущее состояние каждый раз досчитывается от снимка до «сейчас»: так время
// идёт и пока приложение закрыто. Уход мягкий: шкалы не опускаются ниже нуля,
// питомец грустит, но не пропадает.

import { parseLook, type Look } from './look.ts'

export const STATS = ['hunger', 'fun', 'energy', 'clean'] as const
export type Stat = (typeof STATS)[number]

export type Pet = {
  name: string
  look: Look
  bornAt: number
  updatedAt: number
  sleeping: boolean
} & Record<Stat, number>

export type Action = 'feed' | 'play' | 'wash' | 'sleep' | 'wake' | 'pet'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
/** Дольше двух недель без хозяина считать незачем: все шкалы уже на нуле или полны. */
const MAX_ELAPSED = 14 * DAY

/** Изменение шкал в час: бодрствуя и во сне. Сытость пустеет примерно за 12 часов. */
const RATES: Record<'awake' | 'asleep', Record<Stat, number>> = {
  awake: { hunger: -8, fun: -6, energy: -5, clean: -3 },
  asleep: { hunger: -3, fun: 0, energy: 20, clean: -1 },
}

export function newPet(name: string, look: Look, now: number): Pet {
  return { name, look, bornAt: now, updatedAt: now, sleeping: false, hunger: 80, fun: 80, energy: 90, clean: 100 }
}

/**
 * Состояние на момент now. Считаем по минутам, потому что сон меняет скорости:
 * выбившись из сил, питомец засыпает сам, а выспавшись, сам просыпается.
 */
export function simulate(pet: Pet, now: number): Pet {
  let time = Math.max(pet.updatedAt, now - MAX_ELAPSED)
  if (now <= time) return pet
  const next = { ...pet }
  while (time < now) {
    const step = Math.min(MINUTE, now - time)
    const rates = RATES[next.sleeping ? 'asleep' : 'awake']
    for (const stat of STATS) next[stat] = clamp(next[stat] + (rates[stat] * step) / HOUR)
    if (next.sleeping && next.energy >= 100) next.sleeping = false
    else if (!next.sleeping && next.energy <= 0) next.sleeping = true
    time += step
  }
  next.updatedAt = now
  return next
}

/** Почему действие сейчас не получится, или null, если можно. */
export function refusal(pet: Pet, action: Action): string | null {
  if (pet.sleeping) return action === 'wake' ? null : 'Тсс… Я сплю'
  switch (action) {
    case 'feed':
      return pet.hunger >= 95 ? 'Я сыт, спасибо!' : null
    case 'play':
      return pet.energy < 15 ? 'Я слишком устал…' : null
    case 'wash':
      return pet.clean >= 95 ? 'Я и так чистый!' : null
    case 'sleep':
      return pet.energy >= 90 ? 'Не хочу спать, хочу играть!' : null
    default:
      return null
  }
}

export function act(pet: Pet, action: Action, now: number): Pet {
  const p = simulate(pet, now)
  switch (action) {
    case 'feed':
      return change(p, { hunger: 35, clean: -3 })
    case 'play':
      return change(p, { fun: 25, energy: -12, hunger: -6, clean: -5 })
    case 'wash':
      return change({ ...p, clean: 100 }, { fun: -3 })
    case 'sleep':
      return { ...p, sleeping: true }
    case 'wake':
      return { ...p, sleeping: false }
    case 'pet':
      return change(p, { fun: 2 })
  }
}

export type Mood = 'happy' | 'ok' | 'sad' | 'sleeping'

export function moodOf(pet: Pet): Mood {
  if (pet.sleeping) return 'sleeping'
  if (needOf(pet)) return 'sad'
  const average = STATS.reduce((sum, stat) => sum + pet[stat], 0) / STATS.length
  return average >= 70 ? 'happy' : 'ok'
}

/** Самая срочная потребность: шкала ниже 30. */
export function needOf(pet: Pet): Stat | null {
  const lowest = STATS.reduce((a, b) => (pet[b] < pet[a] ? b : a))
  return pet[lowest] < 30 ? lowest : null
}

/** «3 дня», «меньше дня». */
export function ageText(bornAt: number, now: number) {
  const days = Math.floor((now - bornAt) / DAY)
  if (days < 1) return 'меньше дня'
  const mod10 = days % 10
  const mod100 = days % 100
  const word =
    mod10 === 1 && mod100 !== 11
      ? 'день'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'дня'
        : 'дней'
  return `${days} ${word}`
}

function change(pet: Pet, delta: Partial<Record<Stat, number>>): Pet {
  const next = { ...pet }
  for (const stat of STATS) next[stat] = clamp(next[stat] + (delta[stat] ?? 0))
  return next
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

export function parsePet(value: unknown): Pet | null {
  if (typeof value !== 'object' || value === null) return null
  const p = value as Record<string, unknown>
  const valid =
    typeof p.name === 'string' &&
    typeof p.bornAt === 'number' &&
    typeof p.updatedAt === 'number' &&
    typeof p.sleeping === 'boolean' &&
    STATS.every((stat) => typeof p[stat] === 'number')
  // У питомцев, заведённых до выбора внешности, её нет: они остаются рыжими таксами.
  return valid ? { ...(p as Pet), look: parseLook(p.look) } : null
}
