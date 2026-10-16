import { useEffect, useState } from 'react'
import { useStoredState } from '../useStoredState.ts'
import type { Look } from './look.ts'
import { act, newPet, parsePet, simulate, type Action, type Pet } from './model.ts'

type Stored = { pet: Pet | null }

const NO_PET: Stored = { pet: null }
const TICK_MS = 1000

function parseStored(value: unknown): Stored | null {
  if (typeof value !== 'object' || value === null) return null
  const { pet } = value as Record<string, unknown>
  if (pet === null) return NO_PET
  const parsed = parsePet(pet)
  return parsed ? { pet: parsed } : null
}

/**
 * Питомец «вживую»: раз в секунду досчитываем состояние от сохранённого снимка.
 * В облако пишется только снимок после действия хозяина или смены внешности.
 */
export function usePet() {
  const [stored, setStored] = useStoredState('pet_v1', NO_PET, parseStored)
  const now = useNow(TICK_MS)
  const snapshot = stored?.pet ?? null
  const pet = snapshot ? simulate(snapshot, now) : null

  const adopt = (name: string, look: Look) => setStored({ pet: newPet(name, look, Date.now()) })
  const perform = (action: Action) => {
    if (snapshot) setStored({ pet: act(snapshot, action, Date.now()) })
  }
  // Внешность и имя не влияют на шкалы, поэтому меняем их прямо в снимке.
  const restyle = (change: { look?: Look; name?: string }) => {
    if (snapshot) setStored({ pet: { ...snapshot, ...change } })
  }

  return { loading: stored === null, pet, now, adopt, perform, restyle }
}

function useNow(interval: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}
