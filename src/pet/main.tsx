import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './pet.css'
import PetApp from './PetApp.tsx'
import { tg } from '../telegram.ts'

// Сообщаем Telegram, что приложение готово, и разворачиваем его на весь экран.
tg?.ready()
tg?.expand()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PetApp />
  </StrictMode>,
)
