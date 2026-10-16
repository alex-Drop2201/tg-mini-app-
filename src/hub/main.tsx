import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './hub.css'
import Hub from './Hub.tsx'
import { tg } from '../telegram.ts'

// Сообщаем Telegram, что приложение готово, и разворачиваем его на весь экран.
tg?.ready()
tg?.expand()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Hub />
  </StrictMode>,
)
