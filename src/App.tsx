import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { paletteOf, presetName, useColorSettings } from './colors.ts'
import { labelOf, useOptions } from './options.ts'
import { ColorsScreen } from './screens/ColorsScreen.tsx'
import { WheelScreen } from './screens/WheelScreen.tsx'
import { goHome } from './home.ts'
import { useTelegramNavigation } from './useTelegramNavigation.ts'

type Screen = 'wheel' | 'colors'

export default function App() {
  const [options, setOptions] = useOptions()
  const [colors, setColors] = useColorSettings()
  const [screen, setScreen] = useState<Screen>('wheel')
  const wheelScroll = useRef(0)

  const openColors = useCallback(() => {
    setScreen((current) => {
      if (current === 'wheel') wheelScroll.current = window.scrollY
      return 'colors'
    })
  }, [])
  const back = useCallback(() => setScreen('wheel'), [])

  useTelegramNavigation({ inSubscreen: screen !== 'wheel', back, openSettings: openColors, home: goHome })

  // Настройки открываются сверху, а при возврате колесо там же, где его оставили.
  useLayoutEffect(() => {
    window.scrollTo(0, screen === 'wheel' ? wheelScroll.current : 0)
  }, [screen])

  if (!options || !colors) return <main className="app" />

  const labels = options.map(labelOf)

  return (
    <>
      <WheelScreen
        hidden={screen !== 'wheel'}
        options={options}
        labels={labels}
        palette={paletteOf(colors)}
        paletteName={presetName(colors.preset)}
        onOptionsChange={setOptions}
        onOpenColors={openColors}
      />
      {screen === 'colors' && (
        <ColorsScreen settings={colors} labels={labels} onChange={setColors} onBack={back} />
      )}
    </>
  )
}
