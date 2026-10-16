import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Относительные пути: сборка работает на GitHub Pages при любом имени репозитория.
  base: './',
  build: {
    rolldownOptions: {
      // Главный экран со списком приложений в корне сайта, приложения — в своих папках.
      input: {
        hub: new URL('./index.html', import.meta.url).pathname,
        wheel: new URL('./wheel/index.html', import.meta.url).pathname,
        pet: new URL('./pet/index.html', import.meta.url).pathname,
      },
    },
  },
})
