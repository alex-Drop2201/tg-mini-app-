import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Относительные пути: сборка работает на GitHub Pages при любом имени репозитория.
  base: './',
})
