import { useEffect, useState } from 'react'
import { CLUB_SITE, CLUBAPP, EVENTS_API, EVENTS_ARCHIVE, VENUE } from '../data'
import Reveal from './Reveal'

// Афиша: живые данные с сервера клуба (GET /events — тот же источник, что у приложения).
// Сайт на GitHub Pages — другой origin, поэтому запрос пройдёт, только когда сервер
// разрешит CORS для него. Не разрешил / сеть упала / ближайших дат нет — показываем
// архив прошедших вечеринок из Telegram и ссылку на актуальную афишу.
// Данные из API попадают в DOM только как текст (React экранирует) и как src картинки
// с сервера клуба (/uploads/…).

const TIMEOUT_MS = 8000
const MAX_UPCOMING = 12
const ARCHIVE_LIMIT = 3
// Прошедшие события из API пока не показываем: в базе прода это сид-данные
// (backend/prisma/seed.ts — ACID NIGHT, RAVE 13, DARK ROOM) и тестовое событие.
// Когда там останутся только настоящие вечеринки — поставить 3.
const API_RECENT_LIMIT: number = 0

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const WEEKDAYS = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']

type Show = {
  key: string
  date: string // YYYY-MM-DD
  time: string
  title: string
  style?: string
  lineup: string[]
  priceEarly?: number
  priceLate?: number
  poster?: string
  badge?: string
}

type State =
  | { status: 'loading' }
  | { status: 'upcoming'; events: Show[] }
  | { status: 'recent'; events: Show[] }
  | { status: 'empty' }
  | { status: 'error' }

// Екатеринбург — UTC+5 круглый год (перевода часов в РФ нет с 2014).
function todayYekaterinburg() {
  return new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function text(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

function price(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : undefined
}

// Только загрузки сервера клуба (/uploads/…), как на app.exit13.space.
function poster(v: unknown): string | undefined {
  return typeof v === 'string' && v.startsWith('/uploads/') ? CLUB_SITE + v : undefined
}

function parseEvents(data: unknown): Show[] {
  if (!Array.isArray(data)) throw new Error('Ожидался массив событий')
  const out: Show[] = []
  for (const raw of data) {
    if (!raw || typeof raw !== 'object') continue
    const e = raw as Record<string, unknown>
    const date = text(e.date)
    if (!date || !DATE_RE.test(date)) continue
    const time = text(e.timeStart)
    const title = text(e.title) ?? 'Вечеринка EXIT 13'
    const lineup = Array.isArray(e.lineup)
      ? e.lineup
          .map((l) => (l && typeof l === 'object' ? text((l as Record<string, unknown>).name) : undefined))
          .filter((n): n is string => !!n)
      : []
    out.push({
      key: text(e.id) ?? `${date}-${title}`,
      date,
      time: time && TIME_RE.test(time) ? time : '',
      title,
      style: text(e.style),
      lineup,
      priceEarly: price(e.priceEarly),
      priceLate: price(e.priceLate),
      poster: poster(e.imageUrl),
    })
  }
  return out
}

const byDate = (a: Show, b: Show) => (a.date + a.time).localeCompare(b.date + b.time)

const ARCHIVE: Show[] = [...EVENTS_ARCHIVE]
  .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
  .slice(0, ARCHIVE_LIMIT)
  .map((e) => ({ key: `${e.date}-${e.title}`, date: e.date, time: e.time, title: e.title, lineup: e.lineup, badge: e.badge }))

function dateParts(iso: string) {
  const m = DATE_RE.exec(iso)
  if (!m) return { dm: iso, weekday: '', year: '' }
  const weekday = WEEKDAYS[new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).getUTCDay()]
  return { dm: `${m[3]}.${m[2]}`, weekday, year: m[1] }
}

const NOTE: Record<State['status'], string> = {
  loading: 'Загружаем ближайшие даты…',
  upcoming: '',
  recent: '',
  empty: 'Ближайшие вечеринки скоро появятся в афише — следи в приложении и Telegram.',
  error: 'Актуальная афиша — в приложении EXIT 13 и Telegram-канале клуба.',
}

const rub = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} ₽`

function PriceLine({ early, late }: { early?: number; late?: number }) {
  if (!early && !late) return <span className="text-fog">Цена — в приложении</span>
  return (
    <>
      {early && (
        <span className="whitespace-nowrap">
          до 01:00 — <span className="text-acid">{rub(early)}</span>
        </span>
      )}
      {early && late && <span className="text-dim"> · </span>}
      {late && (
        <span className="whitespace-nowrap">
          {early ? 'после' : 'после 01:00'} — <span className="text-acid">{rub(late)}</span>
        </span>
      )}
    </>
  )
}

function EventRow({ e, past, index }: { e: Show; past: boolean; index: number }) {
  const { dm, weekday, year } = dateParts(e.date)
  return (
    <Reveal as="article" delay={(index % 5) * 60} className="group border-b border-line">
      <div className="-mx-2 grid items-center gap-5 px-2 py-6 transition-colors group-hover:bg-panel/60 md:-mx-4 md:grid-cols-[auto_1fr_auto] md:gap-8 md:px-4 md:py-7">
        <div className="flex items-center gap-4 md:w-56">
          {!past &&
            (e.poster ? (
              <img
                src={e.poster}
                alt={`Постер вечеринки «${e.title}»`}
                loading="lazy"
                decoding="async"
                className="h-20 w-16 shrink-0 rounded-xl border border-line bg-panel2 object-cover"
              />
            ) : (
              <div
                aria-hidden
                className="grid h-20 w-16 shrink-0 place-items-center rounded-xl border border-line bg-panel2 font-display text-xl text-dim"
              >
                13
              </div>
            ))}
          <div>
            <time
              dateTime={e.time ? `${e.date}T${e.time}+05:00` : e.date}
              className="block font-display text-3xl text-acid md:text-4xl"
            >
              {dm}
            </time>
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-dim">
              {[weekday, e.time, past ? year : ''].filter(Boolean).join(' · ')}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-display text-xl uppercase text-white md:text-2xl">{e.title}</h3>
            {e.badge && <span className="chip chip-dim">{e.badge}</span>}
            {past && <span className="chip chip-dark">прошло</span>}
          </div>
          {e.style && (
            <p className="mt-1.5 font-mono text-xs uppercase tracking-[0.1em] text-fog">{e.style} · 21+</p>
          )}
          {e.lineup.length > 0 && (
            <p className="mt-2 font-mono text-xs text-white/55 md:text-sm">{e.lineup.join('  ·  ')}</p>
          )}
        </div>

        {!past && (
          <div className="font-mono text-sm text-text md:text-right">
            <PriceLine early={e.priceEarly} late={e.priceLate} />
          </div>
        )}
      </div>
    </Reveal>
  )
}

export default function Events() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const ctrl = new AbortController()
    let cancelled = false
    const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS)

    fetch(EVENTS_API, { headers: { Accept: 'application/json' }, credentials: 'omit', signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<unknown>
      })
      .then((data) => {
        if (cancelled) return
        const events = parseEvents(data)
        const today = todayYekaterinburg()
        const upcoming = events.filter((e) => e.date >= today).sort(byDate).slice(0, MAX_UPCOMING)
        if (upcoming.length) {
          setState({ status: 'upcoming', events: upcoming })
          return
        }
        const recent =
          API_RECENT_LIMIT > 0
            ? events.filter((e) => e.date < today).sort(byDate).reverse().slice(0, API_RECENT_LIMIT)
            : []
        setState(recent.length ? { status: 'recent', events: recent } : { status: 'empty' })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
      .finally(() => window.clearTimeout(timer))

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      ctrl.abort()
    }
  }, [])

  const live = state.status === 'upcoming'
  const list = state.status === 'upcoming' || state.status === 'recent' ? state.events : ARCHIVE
  const listTitle = live ? 'Ближайшие вечеринки' : state.status === 'recent' ? 'Недавние вечеринки' : 'Из архива'

  return (
    <section id="afisha" className="section relative bg-ink hairline">
      <div className="container-x">
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="mono-label mb-4">Афиша</div>
            <h2 className="font-display text-4xl text-white sm:text-6xl">Что играет</h2>
          </div>
          <a href={VENUE.tg} target="_blank" rel="noreferrer" className="btn btn-outline hidden sm:inline-flex">
            Афиша в Telegram
          </a>
        </Reveal>

        {NOTE[state.status] && (
          <div className="mb-10 flex flex-col gap-4 rounded-card border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="flex items-center gap-3 text-text" role="status">
              {state.status === 'loading' && <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-acid" />}
              {NOTE[state.status]}
            </p>
            <a
              href={VENUE.tg}
              target="_blank"
              rel="noreferrer"
              className="btn btn-acid btn-sm shrink-0 self-start sm:self-auto"
            >
              Telegram
            </a>
          </div>
        )}

        <div className="mb-2 font-mono text-xs uppercase tracking-[0.12em] text-dim">{listTitle}</div>
        <div className="border-t border-line">
          {list.map((e, i) => (
            <EventRow key={e.key} e={e} past={!live} index={i} />
          ))}
        </div>

        <div className="mt-6 space-y-1.5 font-mono text-xs text-dim">
          {live && <p>Цена — за вход одного гостя: до 01:00 и после 01:00.</p>}
          <p>
            {CLUBAPP.payment.now} {CLUBAPP.payment.soon}
          </p>
          <p>Бронь стола в приложении — бесплатно. По телефону — {VENUE.phone}.</p>
        </div>
      </div>
    </section>
  )
}
