import { useCallback, useEffect, useRef } from 'react'
import { haptic } from '../telegram.ts'
import { indexAtPointer, mod, randomIndex, targetRotation } from './spin.ts'

const DURATION_MS = 5000
const REDUCED_MOTION_DURATION_MS = 1200
const MIN_TICK_INTERVAL_MS = 40

/**
 * Анимация вращения. Победитель выбирается сразу, потом колесо крутится к нему
 * с замедлением. Поворот пишется в DOM напрямую, без перерисовки React на каждом кадре.
 */
export function useSpin() {
  const groupRef = useRef<SVGGElement>(null)
  const rotation = useRef(0)
  const frame = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const spin = useCallback((n: number, onEnd: (index: number) => void) => {
    const index = randomIndex(n)
    const from = mod(rotation.current, 360)
    const to = targetRotation(from, index, n, 5 + randomIndex(3))
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches
      ? REDUCED_MOTION_DURATION_MS
      : DURATION_MS
    const start = performance.now()
    let lastSector = indexAtPointer(from, n)
    let lastTick = 0

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const current = from + (to - from) * easeOutQuart(t)
      rotation.current = current
      groupRef.current?.setAttribute('transform', `rotate(${current})`)

      const sector = indexAtPointer(current, n)
      if (sector !== lastSector) {
        lastSector = sector
        // На большой скорости секторы мелькают чаще, чем имеет смысл вибрировать.
        if (now - lastTick >= MIN_TICK_INTERVAL_MS) {
          haptic.tick()
          lastTick = now
        }
      }

      if (t < 1) frame.current = requestAnimationFrame(step)
      else onEnd(index)
    }

    frame.current = requestAnimationFrame(step)
  }, [])

  return { groupRef, spin }
}

function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4
}
