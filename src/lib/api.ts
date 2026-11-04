import { API_BASE } from '../data'

// Запросы к API клуба — тот же бэкенд, что у приложения EXIT 13. Токен входа — в
// sessionStorage вкладки (не localStorage): переживает уход на оплату ЮKassa и возврат,
// закрыл вкладку — войдёшь заново по SMS.

const TOKEN_KEY = 'exit13.site.token'

export function loadToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null // приватный режим / хранилище недоступно — просто войдёт заново
  }
}

export function saveToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // хранилище недоступно — токен останется только в памяти
  }
}

export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type Options = { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown; token?: string | null }

export async function api<T>(path: string, { method = 'GET', body, token }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'omit',
    })
  } catch {
    throw new ApiError('Нет связи с сервером. Проверь интернет и попробуй ещё раз.', 0)
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 429) throw new ApiError('Слишком много попыток — подожди минуту и попробуй снова.', 429)
    const m = data && typeof data === 'object' ? (data as { message?: unknown }).message : undefined
    const message = typeof m === 'string' ? m : Array.isArray(m) ? m.join(', ') : `Ошибка сервера (${res.status})`
    throw new ApiError(message, res.status)
  }
  return data as T
}
