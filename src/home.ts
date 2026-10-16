// Главный экран со списком приложений лежит в корне сайта, приложения — на уровень ниже.
export const HOME_URL = '../'

export function goHome() {
  window.location.assign(HOME_URL)
}
