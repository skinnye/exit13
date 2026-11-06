import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { API_BASE, DOCS, EVENTS_API, TABLE_DEPOSIT } from '../data'
import { api, ApiError, loadToken, saveToken } from '../lib/api'
import { asset } from '../lib/asset'
import { scrollToId } from '../lib/scroll'
import Reveal from './Reveal'

// Бронь стола на сайте — тот же аккаунт и та же логика, что в приложении EXIT 13:
// вечеринка → стол на плане зала → телефон и код из SMS → новому гостю имя и дата
// рождения (21+) → «Я иду» + бронь → оплата депозита на странице ЮKassa (сумма — с сервера,
// засчитывается в счёт бара). Неоплаченную бронь сервер держит 30 минут, оплата подтверждает.
// План до входа — публичный (/events/:id/tables/public: только «свободен/занят»),
// после входа — личный (/events/:id/tables: видна своя бронь, её можно снять).
// Данные API попадают в DOM только как текст (React экранирует).

type Ev = { id: string; date: string; time: string; title: string }
type TableStatus = 'free' | 'taken' | 'mine'
type HallTable = { id: string; label: string; capacity: number; deposit: number; x: number; y: number; status: TableStatus }
type MyBooking = { id: string; tableId: string; tableLabel: string; status: string; paid: boolean; holdUntil: string | null }
type Plan = { hallImage: string | null; tables: HallTable[]; myBooking: MyBooking | null; deposit: number }
type Step = 'phone' | 'code' | 'profile'

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const MIN_AGE = 21
const MAX_EVENTS = 8
const ACTIVE = ['pending', 'confirmed']
const REFRESH_MS = 30_000
const PAYMENT_POLL_MS = 5_000 // пока бронь ждёт оплаты — проверяем чаще (вебхук ЮKassa)

// Екатеринбург — UTC+5 круглый год (перевода часов в РФ нет с 2014).
function todayYekaterinburg() {
  return new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function dayLabel(iso: string) {
  const m = DATE_RE.exec(iso)
  if (!m) return iso
  const wd = WEEKDAYS[new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).getUTCDay()]
  return `${wd}, ${Number(m[3])} ${MONTHS[Number(m[2]) - 1]}` // «сб, 7 ноября»
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const clampPct = (n: number) => Math.min(100, Math.max(0, n))

// Ближайшие вечеринки (сегодня и дальше), по дате
function parseEvents(data: unknown): Ev[] {
  if (!Array.isArray(data)) return []
  const today = todayYekaterinburg()
  const out: Ev[] = []
  for (const raw of data) {
    if (!raw || typeof raw !== 'object') continue
    const e = raw as Record<string, unknown>
    const id = str(e.id)
    const date = str(e.date)
    if (!id || !DATE_RE.test(date) || date < today) continue
    const time = str(e.timeStart)
    out.push({ id, date, time: TIME_RE.test(time) ? time : '', title: str(e.title) || 'Вечеринка EXIT 13' })
  }
  return out.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, MAX_EVENTS)
}

function parsePlan(data: unknown): Plan {
  const p = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
  const tables: HallTable[] = []
  for (const raw of Array.isArray(p.tables) ? p.tables : []) {
    if (!raw || typeof raw !== 'object') continue
    const t = raw as Record<string, unknown>
    const x = num(t.x)
    const y = num(t.y)
    const id = str(t.id)
    if (!id || x === null || y === null) continue
    const status: TableStatus = t.status === 'mine' || t.status === 'taken' ? t.status : 'free'
    tables.push({ id, label: str(t.label) || '?', capacity: num(t.capacity) ?? 0, deposit: num(t.deposit) ?? 0, x, y, status })
  }
  const mb = p.myBooking && typeof p.myBooking === 'object' ? (p.myBooking as Record<string, unknown>) : null
  const hallImage = str(p.hallImage)
  return {
    // только загрузки сервера клуба (/uploads/…)
    hallImage: hallImage.startsWith('/uploads/') ? hallImage : null,
    tables,
    deposit: num(p.deposit) ?? 0,
    myBooking: mb
      ? {
          id: str(mb.id),
          tableId: str(mb.tableId),
          tableLabel: str(mb.tableLabel),
          status: str(mb.status),
          paid: mb.paid === true,
          holdUntil: str(mb.holdUntil) || null,
        }
      : null,
  }
}

// до входа — публичная схема (free/taken), после — личная (видна своя бронь)
async function fetchPlan(id: string, auth: string | null): Promise<Plan> {
  return parsePlan(await api<unknown>(auth ? `/events/${id}/tables` : `/events/${id}/tables/public`, { token: auth }))
}

// '2026-11-05T21:30:00Z' → '02:30' по Екатеринбургу
function clock(iso: string) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Yekaterinburg' })
}

const rub = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} ₽`

// '9123456789' → '912 345-67-89'
function formatPhone(d: string) {
  return [d.slice(0, 3), d.slice(3, 6) && ` ${d.slice(3, 6)}`, d.slice(6, 8) && `-${d.slice(6, 8)}`, d.slice(8, 10) && `-${d.slice(8, 10)}`]
    .filter(Boolean)
    .join('')
}

// '01021990' → '01.02.1990'
function formatBirthday(d: string) {
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('.')
}

// Полных лет по 'ДДММГГГГ'; null — дата неполная или не существует
function ageFrom(d: string): number | null {
  if (d.length !== 8) return null
  const day = Number(d.slice(0, 2))
  const month = Number(d.slice(2, 4))
  const year = Number(d.slice(4, 8))
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  const [ty, tm, td] = todayYekaterinburg().split('-').map(Number)
  let age = ty - year
  if (tm < month || (tm === month && td < day)) age -= 1
  return age >= 0 && age < 120 ? age : null
}

const input =
  'w-full rounded-card border border-line bg-panel2 px-4 py-3.5 text-text placeholder:text-dim outline-none transition-colors focus:border-acid'

const MARKER: Record<TableStatus | 'selected', string> = {
  free: 'bg-panel2 border-outline text-text hover:border-acid hover:text-acid cursor-pointer',
  selected: 'bg-acid border-acid text-void cursor-pointer',
  taken: 'bg-line border-line text-dim cursor-not-allowed',
  mine: 'bg-acid-dim border-acid text-acid',
}

export default function Booking() {
  const [events, setEvents] = useState<Ev[] | null>(null) // null — грузим
  const [eventsFailed, setEventsFailed] = useState(false)
  const [eventId, setEventId] = useState<string | null>(null)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [planFailed, setPlanFailed] = useState(false)
  const [tableId, setTableId] = useState<string | null>(null)
  const [comment, setComment] = useState('')

  const [token, setToken] = useState<string | null>(loadToken)
  const [step, setStep] = useState<Step | null>(null)
  const [digits, setDigits] = useState('')
  const [consent, setConsent] = useState(false) // обязательное согласие на обработку ПДн (152-ФЗ)
  const [ads, setAds] = useState(false) // рекламные рассылки — отдельно и по умолчанию выключены
  const [code, setCode] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [birthday, setBirthday] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justBooked, setJustBooked] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const phone = `+7${digits}`
  const event = events?.find((e) => e.id === eventId) ?? null
  const table = plan?.tables.find((t) => t.id === tableId) ?? null
  const mine = plan?.myBooking && ACTIVE.includes(plan.myBooking.status) ? plan.myBooking : null
  // депозит у каждого стола свой (стол 9 — дороже): plan.deposit — наименьший («от N ₽»)
  const deposit = plan?.deposit ?? 0
  const sameDeposit = !!plan && plan.tables.every((t) => t.deposit === plan.tables[0]?.deposit)
  const tableDeposit = table?.deposit ?? 0
  const mineDeposit = (mine && plan?.tables.find((t) => t.id === mine.tableId)?.deposit) || deposit
  const waitingPayment = !!mine && mine.status === 'pending' && !mine.paid

  // только асинхронные setState — сброс состояния делают обработчики (retryEvents, pickEvent)
  const fetchEvents = useCallback(() => {
    api<unknown>(EVENTS_API.slice(API_BASE.length))
      .then((data) => {
        const list = parseEvents(data)
        setEvents(list)
        setEventId((cur) => cur ?? list[0]?.id ?? null)
      })
      .catch(() => setEventsFailed(true))
  }, [])

  // перечитать план после действия гостя (бронь, снятие)
  async function reloadPlan(id: string, auth: string | null) {
    try {
      setPlan(await fetchPlan(id, auth))
      setPlanFailed(false)
    } catch {
      setPlanFailed(true)
    }
  }

  useEffect(fetchEvents, [fetchEvents])

  function retryEvents() {
    setEventsFailed(false)
    setEvents(null)
    fetchEvents()
  }

  // смена вечеринки: новый план, выбор стола сбрасываем
  function pickEvent(id: string) {
    if (id === eventId) return
    setEventId(id)
    setPlan(null)
    setTableId(null)
    setJustBooked(false)
    setError(null)
  }

  // план выбранной вечеринки (после входа — личный), обновляется раз в 30 с
  // alive — ответ по прошлой вечеринке не перезапишет план новой при быстром переключении
  useEffect(() => {
    if (!eventId) return
    let alive = true
    const load = () =>
      fetchPlan(eventId, token).then(
        (p) => {
          if (!alive) return
          setPlan(p)
          setPlanFailed(false)
        },
        (e) => {
          if (!alive) return
          // токен протух (или вкладку открыли спустя дни) — выходим, план станет публичным
          if (e instanceof ApiError && e.status === 401) {
            saveToken(null)
            setToken(null)
            return
          }
          setPlanFailed(true)
        },
      )
    void load()
    const timer = window.setInterval(() => void load(), waitingPayment ? PAYMENT_POLL_MS : REFRESH_MS)
    return () => {
      alive = false
      window.clearInterval(timer)
    }
  }, [eventId, token, waitingPayment])

  // вернулись с оплаты ЮKassa (/#booking) — блок брони рисуется после загрузки, докручиваем
  useEffect(() => {
    if (window.location.hash !== '#booking') return
    const timer = window.setTimeout(() => scrollToId('#booking'), 600)
    return () => window.clearTimeout(timer)
  }, [])

  // таймер повторной SMS
  useEffect(() => {
    if (resendIn <= 0) return
    const timer = window.setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [resendIn])

  const fail = (e: unknown) => setError(e instanceof Error ? e.message : 'Что-то пошло не так. Попробуй ещё раз.')

  // Депозит: заказ → ссылка ЮKassa → уходим на оплату (токен в sessionStorage — вернёмся
  // вошедшими). Повторный вызов отдаёт ту же ссылку (сервер не создаёт второй платёж).
  async function pay(auth: string, bookingId: string) {
    const order = await api<{ payUrl: string | null }>('/payments/orders', {
      method: 'POST',
      token: auth,
      body: { kind: 'booking', refId: bookingId },
    })
    if (!order.payUrl) throw new Error('Оплата сейчас недоступна. Попробуй позже или позвони в клуб.')
    saveToken(auth)
    window.location.assign(order.payUrl)
  }

  // «Я иду» + бронь (+ оплата депозита). Ошибки занятости/повтора — перечитываем план и
  // показываем причину; не ушли на оплату — бронь ждёт оплаты, кнопка «Оплатить» в панели.
  async function submit(auth: string) {
    if (!eventId || !tableId) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await api(`/events/${eventId}/rsvp`, { method: 'POST', token: auth })
      const booking = await api<{ id: string; deposit?: number }>(`/events/${eventId}/bookings`, {
        method: 'POST',
        token: auth,
        body: { tableId, ...(comment.trim() ? { comment: comment.trim() } : {}), ...(tableDeposit > 0 ? { pay: true } : {}) },
      })
      if ((booking.deposit ?? 0) > 0) {
        await pay(auth, booking.id)
        return
      }
      setJustBooked(true)
      setStep(null)
      setTableId(null)
      setComment('')
    } catch (e) {
      fail(e)
      if (e instanceof ApiError && (e.status === 409 || e.status === 400)) {
        setTableId(null)
        setStep(null)
      }
    } finally {
      await reloadPlan(eventId, auth)
      setBusy(false)
    }
  }

  function onBook() {
    setError(null)
    if (token) void submit(token)
    else setStep('phone')
  }

  async function onRequestCode(e?: FormEvent) {
    e?.preventDefault()
    if (digits.length !== 10) return setError('Введи номер полностью')
    if (!consent) return setError('Поставь галочку согласия на обработку данных')
    setBusy(true)
    setError(null)
    try {
      const res = await api<{ resendAfterSec?: number }>('/auth/request-code', { method: 'POST', body: { phone } })
      setResendIn(res.resendAfterSec ?? 60)
      setCode('')
      setStep('code')
    } catch (err) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  async function onVerify(value: string) {
    setBusy(true)
    setError(null)
    try {
      const { token: auth } = await api<{ token: string }>('/auth/verify', {
        method: 'POST',
        body: { phone, code: value, marketingOptIn: ads },
      })
      const me = await api<{ hasBirthday?: boolean }>('/me', { token: auth })
      setToken(auth)
      saveToken(auth)
      if (!me.hasBirthday) {
        setStep('profile')
        setBusy(false)
      } else {
        await submit(auth)
      }
    } catch (err) {
      fail(err)
      setCode('')
      setBusy(false)
    }
  }

  async function onProfile(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    const age = ageFrom(birthday)
    if (!name.trim() || !lastname.trim()) return setError('Укажи имя и фамилию')
    if (age === null) return setError('Проверь дату рождения: ДД.ММ.ГГГГ')
    if (age < MIN_AGE) return setError(`Бронь и вход — строго ${MIN_AGE}+`)
    setBusy(true)
    setError(null)
    try {
      await api('/me/profile', {
        method: 'PATCH',
        token,
        body: {
          name: name.trim(),
          lastname: lastname.trim(),
          birthday: `${birthday.slice(4, 8)}-${birthday.slice(2, 4)}-${birthday.slice(0, 2)}`,
        },
      })
      await submit(token)
    } catch (err) {
      fail(err)
      setBusy(false)
    }
  }

  async function onPay() {
    if (!mine || !token) return
    setBusy(true)
    setError(null)
    try {
      await pay(token, mine.id)
    } catch (err) {
      fail(err)
      setBusy(false)
    }
  }

  async function onCancel() {
    if (!mine || !token || !eventId) return
    const ask = mine.paid
      ? `Снять бронь стола ${mine.tableLabel}? Депозит ${rub(mineDeposit)} вернём.`
      : `Снять бронь стола ${mine.tableLabel}?`
    if (!window.confirm(ask)) return
    setBusy(true)
    setError(null)
    try {
      const res = await api<{ refund?: boolean; amount?: number }>(`/bookings/${mine.id}`, { method: 'DELETE', token })
      setJustBooked(false)
      if (res.refund) {
        setNotice(`Бронь снята. Депозит ${rub(res.amount ?? mineDeposit)} вернём тем же способом оплаты в течение 10 дней.`)
      }
    } catch (err) {
      fail(err)
    } finally {
      await reloadPlan(eventId, token)
      setBusy(false)
    }
  }

  const free = plan?.tables.filter((t) => t.status === 'free').length ?? 0
  const planSrc = plan?.hallImage ? API_BASE + plan.hallImage : asset('hall.svg')

  return (
    <section id="booking" className="section relative hairline">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <h2 className="section-title">Забронировать стол</h2>
          <p className="mt-5 text-lg text-white/65 max-w-2xl">
            {/* до загрузки плана (или без вечеринок) — сумма из текстов сайта */}
            {(plan ? deposit : TABLE_DEPOSIT) > 0
              ? `Депозит за стол — ${plan && sameDeposit ? '' : 'от '}${rub(plan ? deposit : TABLE_DEPOSIT)}, засчитаем в счёт бара. Выбери вечеринку и стол на плане зала, подтверди номер телефона и оплати — бронь подтвердится сразу.`
              : 'Выбери вечеринку и стол на плане зала, подтверди номер телефона — бронь подтвердится сразу.'}
          </p>
        </Reveal>

        {events === null && !eventsFailed ? (
          <p className="mt-10 text-fog" role="status">
            Загружаем ближайшие вечеринки…
          </p>
        ) : eventsFailed ? (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <p className="text-fog" role="status">
              Не удалось загрузить афишу. Проверь соединение.
            </p>
            <button type="button" className="btn btn-outline btn-sm" onClick={retryEvents}>
              Повторить
            </button>
          </div>
        ) : !events?.length ? (
          <p className="mt-10 text-fog" role="status">
            Ближайших вечеринок в афише пока нет — бронь откроется вместе с анонсом.
          </p>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap gap-2.5" role="radiogroup" aria-label="Вечеринка">
              {events.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  role="radio"
                  aria-checked={e.id === eventId}
                  onClick={() => pickEvent(e.id)}
                  className={`chip cursor-pointer ${e.id === eventId ? 'chip-acid' : 'chip-dark hover:border-acid'}`}
                >
                  <span>{dayLabel(e.date)}</span>
                  <span className="opacity-75">{e.title}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-8">
              {/* план зала: координаты столов — проценты плана (центр стола), как в приложении */}
              <div className="rounded-card-lg border border-line bg-panel p-2.5 sm:p-4">
                <div className="relative">
                  <img src={planSrc} alt="План зала EXIT 13" className="block w-full rounded-card" draggable={false} />
                  {plan?.tables.map((t) => {
                    const look = t.id === tableId ? 'selected' : t.status
                    const state = t.status === 'free' ? 'свободен' : t.status === 'mine' ? 'твоя бронь' : 'занят'
                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={t.status !== 'free' || !!mine || busy}
                        aria-pressed={t.id === tableId}
                        aria-label={`Стол ${t.label}, до ${t.capacity} гостей, ${state}`}
                        onClick={() => {
                          setTableId(t.id)
                          setError(null)
                          setJustBooked(false)
                        }}
                        style={{ left: `${clampPct(t.x)}%`, top: `${clampPct(t.y)}%` }}
                        className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 tabular-nums text-xs font-medium transition-colors sm:h-10 sm:w-10 sm:text-sm ${MARKER[look]}`}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
                  <span className="chip chip-outline">Свободен</span>
                  <span className="chip chip-dark">Занят</span>
                  <span className="chip chip-dim">Твой</span>
                  {plan ? (
                    <span className="ml-auto text-sm tabular-nums text-dim">
                      свободно {free} из {plan.tables.length}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="rounded-card border border-line bg-panel p-6">
                {planFailed && !plan ? (
                  <p className="text-fog">Не удалось загрузить план зала. Обнови страницу.</p>
                ) : mine && waitingPayment ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold text-acid">Ждём оплату депозита</p>
                    <div className="font-display text-4xl font-semibold text-white">Стол {mine.tableLabel}</div>
                    {event ? (
                      <p className="text-fog">
                        {event.title}, {dayLabel(event.date)}
                        {event.time ? `, ${event.time}` : ''}
                      </p>
                    ) : null}
                    <p className="text-white/70">
                      {mine.holdUntil ? `Держим стол до ${clock(mine.holdUntil)}. ` : ''}
                      Оплати депозит {rub(mineDeposit)} — бронь подтвердится, а деньги засчитаем в счёт бара. Уже
                      оплатил — подтверждение появится здесь через минуту.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button type="button" className="btn btn-acid" disabled={busy} onClick={onPay}>
                        {busy ? 'Открываю оплату…' : `Оплатить ${rub(mineDeposit)}`}
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={onCancel}>
                        Отменить
                      </button>
                    </div>
                  </div>
                ) : mine ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold text-acid">{justBooked ? 'Стол забронирован' : 'Твоя бронь'}</p>
                    <div className="font-display text-4xl font-semibold text-white">Стол {mine.tableLabel}</div>
                    {event ? (
                      <p className="text-fog">
                        {event.title}, {dayLabel(event.date)}
                        {event.time ? `, ${event.time}` : ''}
                      </p>
                    ) : null}
                    {mine.paid ? (
                      <p className="text-white/80">
                        Депозит {rub(mineDeposit)} оплачен — засчитаем в счёт бара. Отменишь до начала вечеринки — вернём.
                      </p>
                    ) : null}
                    <p className="text-white/70">
                      Ты в списке гостей. Возьми паспорт — вход строго {MIN_AGE}+. Клубная карта с QR и бронь — в
                      приложении EXIT 13 по тому же номеру.
                    </p>
                    <button type="button" className="btn btn-outline btn-sm self-start" disabled={busy} onClick={onCancel}>
                      Снять бронь
                    </button>
                  </div>
                ) : step === 'phone' ? (
                  <form className="flex flex-col gap-4" onSubmit={onRequestCode}>
                    <h3 className="font-display text-xl font-medium text-text">Вход по телефону</h3>
                    <p className="text-white/70">Стол {table?.label}. Пришлём код в SMS — по этому номеру бронь увидит охрана на входе.</p>
                    <label className="flex items-center gap-2 rounded-card border border-line bg-panel2 px-4 focus-within:border-acid">
                      <span className="tabular-nums text-text">+7</span>
                      <input
                        className="w-full bg-transparent py-3.5 text-text placeholder:text-dim outline-none"
                        value={formatPhone(digits)}
                        onChange={(e) => {
                          let d = e.target.value.replace(/\D/g, '')
                          // автозаполнение отдаёт номер целиком («+7 912…» / «8 912…») — код страны срезаем
                          if (d.length > 10 && (d[0] === '7' || d[0] === '8')) d = d.slice(1)
                          setDigits(d.slice(0, 10))
                        }}
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="912 345-67-89"
                        aria-label="Номер телефона"
                      />
                    </label>
                    <label className="flex items-start gap-3 text-sm text-white/80">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#f0c030]"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                      />
                      <span>
                        Согласен на обработку персональных данных по{' '}
                        <a href={DOCS.privacy} target="_blank" rel="noreferrer" className="text-acid underline">
                          политике конфиденциальности
                        </a>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 text-sm text-white/80">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#f0c030]"
                        checked={ads}
                        onChange={(e) => setAds(e.target.checked)}
                      />
                      <span>Хочу получать новости и акции клуба</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="btn btn-acid" disabled={busy || digits.length !== 10 || !consent}>
                        {busy ? 'Отправляю…' : 'Получить код'}
                      </button>
                      <button type="button" className="btn btn-outline" disabled={busy} onClick={() => setStep(null)}>
                        Назад
                      </button>
                    </div>
                  </form>
                ) : step === 'code' ? (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-display text-xl font-medium text-text">Код из SMS</h3>
                    <p className="text-white/70">Отправили на +7 {formatPhone(digits)}.</p>
                    <input
                      className={`${input} text-2xl tabular-nums tracking-[0.4em]`}
                      value={code}
                      onChange={(e) => {
                        const next = e.target.value.replace(/\D/g, '').slice(0, 4)
                        setCode(next)
                        setError(null)
                        if (next.length === 4) void onVerify(next)
                      }}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="••••"
                      aria-label="Код из SMS"
                      disabled={busy}
                      autoFocus
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        disabled={busy || resendIn > 0}
                        onClick={() => void onRequestCode()}
                      >
                        {resendIn > 0 ? `Новый код через ${resendIn} с` : 'Отправить ещё раз'}
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => setStep('phone')}>
                        Другой номер
                      </button>
                    </div>
                  </div>
                ) : step === 'profile' ? (
                  <form className="flex flex-col gap-4" onSubmit={onProfile}>
                    <h3 className="font-display text-xl font-medium text-text">Пара слов о себе</h3>
                    <p className="text-white/70">
                      Ты у нас впервые. Имя увидит охрана на входе, дата рождения нужна для проверки {MIN_AGE}+.
                    </p>
                    <input
                      className={input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="given-name"
                      placeholder="Имя"
                      aria-label="Имя"
                    />
                    <input
                      className={input}
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      autoComplete="family-name"
                      placeholder="Фамилия"
                      aria-label="Фамилия"
                    />
                    <input
                      className={input}
                      value={formatBirthday(birthday)}
                      onChange={(e) => setBirthday(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      inputMode="numeric"
                      autoComplete="bday"
                      placeholder="Дата рождения: ДД.ММ.ГГГГ"
                      aria-label="Дата рождения"
                    />
                    <button type="submit" className="btn btn-acid self-start" disabled={busy}>
                      {busy ? 'Бронирую…' : tableDeposit > 0 ? `Перейти к оплате ${rub(tableDeposit)}` : 'Забронировать'}
                    </button>
                  </form>
                ) : table ? (
                  <div className="flex flex-col gap-4">
                    <div className="font-display text-4xl font-semibold text-white">Стол {table.label}</div>
                    <p className="text-fog">
                      До {table.capacity} гостей{event ? `. ${event.title}, ${dayLabel(event.date)}` : ''}
                    </p>
                    {tableDeposit > 0 ? (
                      <p className="text-white/80">
                        Депозит {rub(tableDeposit)} — засчитаем в счёт бара. Отменишь до начала вечеринки — вернём.
                      </p>
                    ) : null}
                    <textarea
                      className={`${input} min-h-24 resize-y`}
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, 300))}
                      placeholder="Пожелания к брони (необязательно)"
                      aria-label="Пожелания к брони"
                    />
                    <button type="button" className="btn btn-acid self-start" disabled={busy} onClick={onBook}>
                      {busy ? 'Бронирую…' : tableDeposit > 0 ? `Забронировать за ${rub(tableDeposit)}` : 'Забронировать'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-display text-xl font-medium text-text">Как забронировать</h3>
                    <p className="text-white/70">
                      Нажми на свободный стол на плане. Есть столы на 2, 4 и 8 гостей — число гостей видно, когда
                      выбираешь стол.
                    </p>
                    <p className="text-sm text-dim">
                      {deposit > 0
                        ? `Депозит за стол — ${sameDeposit ? '' : 'от '}${rub(deposit)}, засчитаем в счёт бара. Передумал до начала вечеринки — снимешь бронь здесь же, деньги вернём.`
                        : 'Передумал — снимешь бронь здесь же или в приложении EXIT 13.'}
                    </p>
                  </div>
                )}

                {notice ? (
                  <p className="mt-4 text-sm text-fog" role="status">
                    {notice}
                  </p>
                ) : null}
                {error ? (
                  <p className="mt-4 text-sm text-magenta" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
