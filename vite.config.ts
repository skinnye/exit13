import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// На GitHub Pages — подпуть /exit13/, локально — корень.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/exit13/' : '/',
  plugins: [react(), tailwindcss()],
}))
