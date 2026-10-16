import { useEffect, useState } from 'react'
import { useStoredState } from '../useStoredState.ts'
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
 * В облако пишется только снимок после действия хозяина.
 */
export function usePet() {
  const [stored, setStored] = useStoredState('pet_v1', NO_PET, parseStored)
  const now = useNow(TICK_MS)
  const pet = stored?.pet ? simulate(stored.pet, now) : null

  const adopt = (name: string) => setStored({ pet: newPet(name, Date.now()) })
  const perform = (action: Action) => {
    if (stored?.pet) setStored({ pet: act(stored.pet, action, Date.now()) })
  }

  return { loading: stored === null, pet, now, adopt, perform }
}

function useNow(interval: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}
