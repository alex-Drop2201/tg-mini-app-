import { useState } from 'react'
import { OptionsEditor } from './OptionsEditor.tsx'
import { labelOf, useOptions } from './options.ts'
import { haptic } from './telegram.ts'
import { useSpin } from './wheel/useSpin.ts'
import { Wheel } from './wheel/Wheel.tsx'

export default function App() {
  const [options, setOptions] = useOptions()
  const { groupRef, spin } = useSpin()
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<number | null>(null)

  if (!options) return <main className="app" />

  const labels = options.map(labelOf)

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

  const handleChange = (next: string[]) => {
    setWinner(null)
    setOptions(next)
  }

  return (
    <main className="app">
      <h1>Колесо решений</h1>

      <Wheel labels={labels} winner={winner} groupRef={groupRef} onClick={handleSpin} />

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

      <OptionsEditor options={options} disabled={spinning} onChange={handleChange} />
    </main>
  )
}
