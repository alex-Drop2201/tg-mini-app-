import { useCallback, useLayoutEffect, useState } from 'react'
import { goHome } from '../home.ts'
import { useTelegramNavigation } from '../useTelegramNavigation.ts'
import { AdoptScreen } from './screens/AdoptScreen.tsx'
import { LookScreen } from './screens/LookScreen.tsx'
import { PetScreen } from './screens/PetScreen.tsx'
import { usePet } from './usePet.ts'

type Screen = 'main' | 'look'

export default function PetApp() {
  const { loading, pet, now, adopt, perform, restyle } = usePet()
  const [screen, setScreen] = useState<Screen>('main')

  const openLook = useCallback(() => setScreen('look'), [])
  const back = useCallback(() => setScreen('main'), [])

  // «Настройки» в меню ⋯ Telegram открывают внешность, «Назад» в шапке возвращает.
  // Пока питомца не завели, настраивать нечего.
  useTelegramNavigation({
    inSubscreen: screen === 'look',
    back,
    openSettings: pet ? openLook : undefined,
    home: goHome,
  })

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  if (loading) return <main className="app" />
  if (!pet) {
    return (
      <AdoptScreen
        onAdopt={(name, look) => {
          adopt(name, look)
          setScreen('main')
        }}
      />
    )
  }
  if (screen === 'look') return <LookScreen pet={pet} onChange={restyle} onBack={back} />
  return <PetScreen pet={pet} now={now} perform={perform} onOpenLook={openLook} />
}
