// Обёртка над window.Telegram.WebApp.
// Вне Telegram (обычный браузер, превью) скрипт может не загрузиться,
// а если загрузился, initData будет пустой, поэтому проверяем оба случая.

export const tg: WebApp | undefined = (window as Partial<Window>).Telegram?.WebApp

export const isInTelegram = Boolean(tg?.initData)

export const hasCloudStorage = isInTelegram && Boolean(tg?.isVersionAtLeast('6.9'))

/** Кнопка «Назад» в шапке Telegram. */
export const hasBackButton = isInTelegram && Boolean(tg?.isVersionAtLeast('6.1'))

/** Пункт «Настройки» в меню ⋯ мини-приложения. */
export const hasSettingsButton = isInTelegram && Boolean(tg?.isVersionAtLeast('7.0'))

export const haptic = {
  /** Короткий «щелчок»: сектор колеса прошёл под стрелкой. */
  tick() {
    if (isInTelegram) tg?.HapticFeedback.selectionChanged()
  },
  success() {
    if (isInTelegram) tg?.HapticFeedback.notificationOccurred('success')
  },
  warning() {
    if (isInTelegram) tg?.HapticFeedback.notificationOccurred('warning')
  },
  /** Мягкий толчок, например при поглаживании. */
  soft() {
    if (isInTelegram) tg?.HapticFeedback.impactOccurred('soft')
  },
}

type WebApp = Window['Telegram']['WebApp']
