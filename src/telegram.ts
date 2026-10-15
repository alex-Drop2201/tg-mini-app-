// Обёртка над window.Telegram.WebApp.
// Вне Telegram (обычный браузер, превью) скрипт может не загрузиться,
// а если загрузился, initData будет пустой, поэтому проверяем оба случая.

export const tg: WebApp | undefined = (window as Partial<Window>).Telegram?.WebApp

export const isInTelegram = Boolean(tg?.initData)

export const user = tg?.initDataUnsafe.user

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (isInTelegram) tg?.HapticFeedback.impactOccurred(style)
}

type WebApp = Window['Telegram']['WebApp']
