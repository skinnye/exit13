// Base-aware путь к статике (dev: '/', GitHub Pages: '/exit13/').
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\/+/, '')
