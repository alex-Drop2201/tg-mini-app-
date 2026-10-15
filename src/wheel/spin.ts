// Математика колеса. Углы в градусах, по часовой стрелке от верха, где стоит стрелка.
// Сектор i занимает углы [i·s, (i+1)·s) в системе колеса, s = 360 / n.
// Колесо повёрнуто на rotation градусов, поэтому под стрелкой угол колеса −rotation.

export function mod(a: number, m: number) {
  return ((a % m) + m) % m
}

/** Честный случайный индекс от 0 до n−1: crypto без перекоса остатка от деления. */
export function randomIndex(n: number) {
  const limit = Math.floor(0x1_0000_0000 / n) * n
  const buffer = new Uint32Array(1)
  do {
    crypto.getRandomValues(buffer)
  } while (buffer[0] >= limit)
  return buffer[0] % n
}

/** Индекс сектора под стрелкой при повороте колеса на rotation градусов. */
export function indexAtPointer(rotation: number, n: number) {
  return Math.floor(mod(-rotation, 360) / (360 / n)) % n
}

/**
 * Итоговый поворот: от from делаем turns полных оборотов и останавливаемся внутри
 * сектора index. Точка остановки сдвинута от центра сектора, так выглядит естественнее.
 */
export function targetRotation(from: number, index: number, n: number, turns: number) {
  const sector = 360 / n
  const offset = (Math.random() - 0.5) * sector * 0.7
  const stop = mod(-(index * sector + sector / 2 + offset), 360)
  return from + turns * 360 + mod(stop - from, 360)
}
