import type { Fur, SpeciesId } from './critter/anatomy.tsx'

// Каталог внешности: виды питомцев, окрасы, аксессуары и фоны.

export type { SpeciesId }

export const SPECIES: Record<
  SpeciesId,
  { name: string; baby: string; sound: string; defaultName: string; defaultFur: FurId }
> = {
  dachshund: { name: 'Такса', baby: 'Щенок', sound: 'Гав', defaultName: 'Сосиска', defaultFur: 'ginger' },
  corgi: { name: 'Корги', baby: 'Щенок', sound: 'Гав', defaultName: 'Бисквит', defaultFur: 'ginger' },
  cat: { name: 'Котик', baby: 'Котёнок', sound: 'Мяу', defaultName: 'Пушок', defaultFur: 'gray' },
  fox: { name: 'Лисёнок', baby: 'Лисёнок', sound: 'Тяв', defaultName: 'Рыжик', defaultFur: 'fox' },
  bunny: { name: 'Зайчик', baby: 'Зайчонок', sound: 'Хрум', defaultName: 'Морковка', defaultFur: 'cream' },
}

export const FURS = {
  ginger: { name: 'Рыжий', main: '#c8743f', dark: '#8a4a26', light: '#e3a476' },
  fox: { name: 'Огненный', main: '#e8742c', dark: '#3a2a26', light: '#f6b27a' },
  chocolate: { name: 'Шоколад', main: '#7b4a32', dark: '#4f2d1d', light: '#b78463' },
  cream: { name: 'Кремовый', main: '#ecd3a8', dark: '#c79f6a', light: '#faeedb' },
  black: { name: 'Чёрный', main: '#3b3537', dark: '#1f1b1c', light: '#c9874f' },
  gray: { name: 'Серый', main: '#a3abb5', dark: '#6e7680', light: '#dfe3e8' },
  white: { name: 'Белый', main: '#f5f2ec', dark: '#d3cabd', light: '#ffffff' },
  pink: { name: 'Розовый', main: '#f4a7c3', dark: '#d0779d', light: '#fbd6e4' },
  mint: { name: 'Мятный', main: '#8fd9c4', dark: '#4fae95', light: '#cdf2e7' },
} satisfies Record<string, Fur & { name: string }>
export type FurId = keyof typeof FURS

export const HATS = {
  none: 'Без шапки',
  bow: 'Бантик',
  beanie: 'Шапочка',
  crown: 'Корона',
  party: 'Колпак',
  flower: 'Цветок',
}
export type HatId = keyof typeof HATS

export const GLASSES = {
  none: 'Без очков',
  round: 'Круглые',
  sun: 'Солнечные',
  hearts: 'Сердечки',
}
export type GlassesId = keyof typeof GLASSES

export const NECKWEAR = {
  collar: 'Ошейник',
  bowtie: 'Бабочка',
  bandana: 'Бандана',
  scarf: 'Шарф',
  none: 'Ничего',
}
export type NeckwearId = keyof typeof NECKWEAR

export const SCENES = {
  room: 'Комната',
  park: 'Парк',
  beach: 'Пляж',
  space: 'Космос',
  snow: 'Зима',
}
export type SceneId = keyof typeof SCENES

export type Look = {
  species: SpeciesId
  fur: FurId
  hat: HatId
  glasses: GlassesId
  neck: NeckwearId
  scene: SceneId
}

export function defaultLook(species: SpeciesId = 'dachshund'): Look {
  return { species, fur: SPECIES[species].defaultFur, hat: 'none', glasses: 'none', neck: 'collar', scene: 'room' }
}

/** Внешность из облака: неизвестные значения заменяем на стандартные, а не теряем всё. */
export function parseLook(value: unknown): Look {
  const raw = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>
  const species = pick(raw.species, SPECIES, 'dachshund')
  const base = defaultLook(species)
  return {
    species,
    fur: pick(raw.fur, FURS, base.fur),
    hat: pick(raw.hat, HATS, base.hat),
    glasses: pick(raw.glasses, GLASSES, base.glasses),
    neck: pick(raw.neck, NECKWEAR, base.neck),
    scene: pick(raw.scene, SCENES, base.scene),
  }
}

function pick<T extends string>(value: unknown, catalog: Record<T, unknown>, fallback: T): T {
  return typeof value === 'string' && value in catalog ? (value as T) : fallback
}
