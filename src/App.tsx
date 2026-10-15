import { useEffect, useState } from 'react'
import { haptic, isInTelegram, tg, user } from './telegram.ts'

export default function App() {
  const [count, setCount] = useState(0)

  // Нижняя синяя кнопка Telegram (MainButton). Снимаем обработчик при размонтировании.
  useEffect(() => {
    const app = tg
    if (!isInTelegram || !app) return
    const close = () => app.close()
    app.MainButton.setText('Закрыть').show().onClick(close)
    return () => {
      app.MainButton.offClick(close).hide()
    }
  }, [])

  return (
    <main className="app">
      {!isInTelegram && (
        <p className="banner">
          Открыто в браузере, поэтому функции Telegram недоступны. Откройте приложение
          через своего бота.
        </p>
      )}

      <h1>Привет{user ? `, ${user.first_name}` : ''}!</h1>
      <p className="hint">Это заготовка Mini App. Замените её своим приложением.</p>

      <section className="card">
        <Row label="Платформа" value={tg?.platform ?? '—'} />
        <Row label="Версия Bot API" value={tg?.version ?? '—'} />
        <Row label="Тема" value={tg?.colorScheme ?? '—'} />
      </section>

      <button
        className="button"
        onClick={() => {
          haptic()
          setCount((c) => c + 1)
        }}
      >
        Нажато: {count}
      </button>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="row">
      <span className="hint">{label}</span>
      <span>{value}</span>
    </div>
  )
}
