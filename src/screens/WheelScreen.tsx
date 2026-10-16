import { useState } from 'react'
import { HomeLink } from '../HomeLink.tsx'
import { OptionsEditor } from '../OptionsEditor.tsx'
import { haptic } from '../telegram.ts'
import { useSpin } from '../wheel/useSpin.ts'
import { Wheel } from '../wheel/Wheel.tsx'

type Props = {
  hidden: boolean
  options: string[]
  labels: string[]
  palette: string[] | null
  paletteName: string
  onOptionsChange: (options: string[]) => void
  onOpenColors: () => void
}

/**
 * Главный экран. Пока открыты настройки, он только скрыт, а не размонтирован,
 * чтобы колесо сохраняло поворот и могло докрутиться.
 */
export function WheelScreen(props: Props) {
  const { hidden, options, labels, palette, paletteName, onOptionsChange, onOpenColors } = props
  const { groupRef, spin } = useSpin()
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<number | null>(null)

  const handleSpin = () => {
    if (spinning) return
    setWinner(null)
    setSpinning(true)
    spin(labels.length, (index) => {
      setSpinning(false)
      setWinner(index)
      haptic.success()
    })
  }

  const handleOptionsChange = (next: string[]) => {
    setWinner(null)
    onOptionsChange(next)
  }

  return (
    <main className="app" hidden={hidden}>
      <HomeLink />
      <h1>Колесо решений</h1>

      <Wheel
        labels={labels}
        winner={winner}
        palette={palette}
        groupRef={groupRef}
        onClick={handleSpin}
      />

      <div className="result" aria-live="polite">
        {winner !== null ? (
          <>
            <span className="hint">Выпало</span>
            <strong>{labels[winner]}</strong>
          </>
        ) : (
          <span className="hint">{spinning ? 'Крутится…' : 'Нажмите «Крутить» или на колесо'}</span>
        )}
      </div>

      <button className="button" onClick={handleSpin} disabled={spinning}>
        {spinning ? 'Крутится…' : 'Крутить'}
      </button>

      <OptionsEditor options={options} disabled={spinning} onChange={handleOptionsChange} />

      <section>
        <h2 className="section-title">Оформление</h2>
        <div className="card">
          <button className="row-button" onClick={onOpenColors}>
            <span className="row-label">Цвета колеса</span>
            <span className="hint">{paletteName}</span>
            <span className="chevron" aria-hidden>
              ›
            </span>
          </button>
        </div>
      </section>
    </main>
  )
}
