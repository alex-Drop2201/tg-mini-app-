import { useEffect } from 'react'
import { hasBackButton, hasSettingsButton, tg } from './telegram.ts'

/**
 * Подключает родные кнопки Telegram: пункт «Настройки» в меню ⋯ открывает настройки,
 * а кнопка «Назад» в шапке видна, пока открыт вложенный экран.
 * settingsEnabled = false прячет «Настройки», когда настраивать пока нечего.
 */
export function useTelegramNavigation(
  inSubscreen: boolean,
  openSettings: () => void,
  back: () => void,
  settingsEnabled = true,
) {
  useEffect(() => {
    const app = tg
    if (!settingsEnabled || !hasSettingsButton || !app) return
    app.SettingsButton.onClick(openSettings).show()
    return () => {
      app.SettingsButton.offClick(openSettings).hide()
    }
  }, [openSettings, settingsEnabled])

  useEffect(() => {
    const app = tg
    if (!inSubscreen || !hasBackButton || !app) return
    app.BackButton.onClick(back).show()
    return () => {
      app.BackButton.offClick(back).hide()
    }
  }, [inSubscreen, back])
}
