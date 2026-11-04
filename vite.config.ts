import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Три режима:
// • GitHub Pages (`npm run build`) — подпуть /exit13/, API клуба по абсолютному адресу;
// • app.exit13.space (`npm run build:app`) — корень, API того же origin (сайт отдаёт бэкенд клуба);
// • локально (`npm run dev`) — корень, API проксируется на бэкенд разработки (localhost:3001).
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const pages = command === 'build' && mode !== 'app'
  return {
    base: pages ? '/exit13/' : '/',
    define: {
      __API_BASE__: JSON.stringify(pages ? 'https://app.exit13.space' : ''),
    },
    plugins: [react(), tailwindcss()],
    server: {
      // только пути API (бронь, вход, афиша, обложки) — остальное отдаёт сам Vite
      proxy: { '^/(events|auth|me|bookings|payments|uploads)(/|$)': 'http://localhost:3001' },
    },
    // Мультистраничная сборка: главная + одностраничник для платёжного провайдера.
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          partners: 'partners.html',
          privacy: 'privacy.html',
          terms: 'terms.html',
        },
      },
    },
  }
})
