import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { tg } from './telegram.ts'

// Сообщаем Telegram, что приложение готово, и разворачиваем его на весь экран.
tg?.ready()
tg?.expand()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
