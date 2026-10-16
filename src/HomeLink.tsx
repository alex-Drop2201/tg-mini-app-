import { HOME_URL } from './home.ts'
import { hasBackButton } from './telegram.ts'

/** Ссылка «‹ Приложения» для браузера. В Telegram её роль играет кнопка «Назад» в шапке. */
export function HomeLink() {
  if (hasBackButton) return null
  return (
    <a className="back-button" href={HOME_URL}>
      ‹ Приложения
    </a>
  )
}
