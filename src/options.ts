import { useStoredState } from './useStoredState.ts'

export const MIN_OPTIONS = 2
export const MAX_OPTIONS = 12
export const MAX_LABEL_LENGTH = 40

const DEFAULT_OPTIONS = ['Пицца', 'Суши', 'Бургер', 'Шаурма', 'Паста', 'Салат']

/** Текст сектора: пустой вариант показываем как «Вариант N». */
export function labelOf(option: string, index: number) {
  return option.trim() || `Вариант ${index + 1}`
}

/** Варианты колеса с сохранением. Пока данные грузятся, возвращает null. */
export function useOptions() {
  return useStoredState('wheel_v1', DEFAULT_OPTIONS, parseOptions)
}

function parseOptions(value: unknown): string[] | null {
  const valid =
    Array.isArray(value) &&
    value.length >= MIN_OPTIONS &&
    value.length <= MAX_OPTIONS &&
    value.every((item) => typeof item === 'string')
  return valid ? value : null
}
