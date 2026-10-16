import { useEffect } from 'react'
import { hasBackButton, hasSettingsButton, tg } from './telegram.ts'

type Options = {
  /** Открыт вложенный экран: «Назад» возвращает с него. */
  inSubscreen: boolean
  back: () => void
  /** Что делает пункт «Настройки» в меню ⋯. Без него пункт спрятан. */
  openSettings?: () => void
  /** Куда ведёт «Назад» с главного экрана приложения. Без него кнопка спрятана. */
  home?: () => void
}

/**
 * Подключает родные кнопки Telegram. Состояние задаём явно и при «спрятано»:
 * при переходе между страницами кнопки остаются такими, какими их оставила
 * прошлая страница, и без этого лишняя кнопка висела бы без обработчика.
 */
export function useTelegramNavigation({ inSubscreen, back, openSettings, home }: Options) {
  useEffect(() => {
    const app = tg
    if (!hasSettingsButton || !app) return
    if (!openSettings) {
      app.SettingsButton.hide()
      return
    }
    app.SettingsButton.onClick(openSettings).show()
    return () => {
      app.SettingsButton.offClick(openSettings).hide()
    }
  }, [openSettings])

  useEffect(() => {
    const app = tg
    if (!hasBackButton || !app) return
    const handler = inSubscreen ? back : home
    if (!handler) {
      app.BackButton.hide()
      return
    }
    app.BackButton.onClick(handler).show()
    return () => {
      app.BackButton.offClick(handler).hide()
    }
  }, [inSubscreen, back, home])
}
