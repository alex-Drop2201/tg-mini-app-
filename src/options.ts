import { useCallback, useEffect, useRef, useState } from 'react'
import { loadItem, saveItem } from './storage.ts'

export const MIN_OPTIONS = 2
export const MAX_OPTIONS = 12
export const MAX_LABEL_LENGTH = 40

const DEFAULT_OPTIONS = ['Пицца', 'Суши', 'Бургер', 'Шаурма', 'Паста', 'Салат']
const STORAGE_KEY = 'wheel_v1'
const SAVE_DELAY_MS = 400

/** Текст сектора: пустой вариант показываем как «Вариант N». */
export function labelOf(option: string, index: number) {
  return option.trim() || `Вариант ${index + 1}`
}

/**
 * Варианты колеса с сохранением. Пока данные грузятся, возвращает null.
 * Запись откладывается, чтобы не дёргать облако на каждую букву.
 */
export function useOptions() {
  const [options, setOptions] = useState<string[] | null>(null)
  const saveTimer = useRef(0)

  useEffect(() => {
    loadItem(STORAGE_KEY).then((raw) => setOptions(parse(raw) ?? DEFAULT_OPTIONS))
    return () => clearTimeout(saveTimer.current)
  }, [])

  const update = useCallback((next: string[]) => {
    setOptions(next)
    clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(
      () => saveItem(STORAGE_KEY, JSON.stringify(next)),
      SAVE_DELAY_MS,
    )
  }, [])

  return [options, update] as const
}

function parse(raw: string | null): string[] | null {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    const valid =
      Array.isArray(value) &&
      value.length >= MIN_OPTIONS &&
      value.length <= MAX_OPTIONS &&
      value.every((item) => typeof item === 'string')
    return valid ? value : null
  } catch {
    return null
  }
}
