import { useCallback, useEffect, useRef, useState } from 'react'
import { loadItem, saveItem } from './storage.ts'

const SAVE_DELAY_MS = 300

/**
 * Состояние, которое сохраняется в облаке Telegram (или localStorage вне Telegram).
 * Пока данные грузятся, возвращает null. Запись откладывается, чтобы не дёргать
 * облако на каждую букву, и досылается, когда приложение сворачивают или закрывают.
 */
export function useStoredState<T>(key: string, fallback: T, parse: (value: unknown) => T | null) {
  const [state, setState] = useState<T | null>(null)
  const timer = useRef(0)
  const pending = useRef<T | null>(null)

  const flush = useCallback(() => {
    clearTimeout(timer.current)
    if (pending.current === null) return
    saveItem(key, JSON.stringify(pending.current))
    pending.current = null
  }, [key])

  useEffect(() => {
    loadItem(key).then((raw) => setState(decode(raw, parse) ?? fallback))
    const onHide = () => document.visibilityState === 'hidden' && flush()
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      flush()
    }
    // fallback и parse передаются константами модуля, так что эффект срабатывает один раз.
  }, [key, flush, fallback, parse])

  const update = useCallback(
    (next: T) => {
      setState(next)
      pending.current = next
      clearTimeout(timer.current)
      timer.current = window.setTimeout(flush, SAVE_DELAY_MS)
    },
    [flush],
  )

  return [state, update] as const
}

function decode<T>(raw: string | null, parse: (value: unknown) => T | null) {
  if (!raw) return null
  try {
    return parse(JSON.parse(raw))
  } catch {
    return null
  }
}
