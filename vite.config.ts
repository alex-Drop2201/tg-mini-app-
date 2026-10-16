import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Относительные пути: сборка работает на GitHub Pages при любом имени репозитория.
  base: './',
  build: {
    rolldownOptions: {
      // Два приложения: колесо в корне сайта, такса в /pet/.
      input: {
        wheel: new URL('./index.html', import.meta.url).pathname,
        pet: new URL('./pet/index.html', import.meta.url).pathname,
      },
    },
  },
})
