import { Fragment } from 'react'
import { VENUE } from '../data'
import { asset } from '../lib/asset'

// Одностраничник для платёжного провайдера (Platega): описание бизнеса + схема
// платёжного флоу + комплаенс. Юр-данные — плейсхолдеры, их заполняет клуб.

const FLOW_APP = [
  'Гость выбирает вход на событие или бронь стола',
  'Нажимает «Оплатить» в приложении',
  'Бэкенд создаёт заказ и инвойс в PSP',
  'Оплата банковской картой на защищённой странице PSP',
  'PSP присылает вебхук (проверяем подпись)',
  'Вход / бронь отмечаются оплаченными',
]

const FLOW_ONSITE = [
  'Персонал вводит сумму в разделе «Касса»',
  'Бэкенд создаёт заказ и инвойс в PSP',
  'Приложение показывает QR со ссылкой на оплату',
  'Гость сканирует QR и платит картой на странице PSP',
  'PSP присылает вебхук (проверяем подпись)',
  'Заказ отмечается «Оплачено»',
]

function Fill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[2px] border-b border-dashed border-acid/50 bg-acid/5 px-1 text-acid/85">
      {children}
    </span>
  )
}

function FlowRow({ label, steps, accent }: { label: string; steps: string[]; accent: string }) {
  return (
    <div className="rounded-sm border border-white/10 bg-ink p-5 sm:p-7">
      <div className="mono-label mb-5" style={{ color: accent }}>
        {label}
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
        {steps.map((s, i) => (
          <Fragment key={i}>
            <div
              className="flex-1 rounded-sm border bg-void p-4"
              style={{ borderColor: `${accent}33` }}
            >
              <span className="font-mono text-xs font-medium" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-1.5 text-sm leading-snug text-white/80">{s}</p>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex shrink-0 items-center justify-center font-mono text-lg"
                style={{ color: accent }}
                aria-hidden
              >
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-white/10 bg-ink p-6">
      <div className="font-display text-lg text-acid">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{children}</div>
    </div>
  )
}

export default function Partners() {
  return (
    <div className="grain min-h-screen">
      {/* Шапка */}
      <header className="border-b border-white/8">
        <div className="container-x flex items-center justify-between py-5">
          <a href={asset('/')} className="font-display text-xl font-black tracking-tight text-white">
            EXIT<span className="text-acid">13</span>
          </a>
          <a
            href={asset('/')}
            className="font-mono text-xs uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-acid"
          >
            ← на сайт
          </a>
        </div>
      </header>

      <main className="container-x py-14 sm:py-20">
        {/* Заголовок */}
        <div className="max-w-3xl">
          <div className="mono-label mb-4">Для платёжного провайдера</div>
          <h1 className="font-display text-4xl leading-[0.95] text-white sm:text-6xl">
            EXIT 13 — <span className="text-acid">платёжное</span> подключение
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Ночной клуб и бар в Екатеринбурге. Приложение лояльности с афишей, бронью столов и
            онлайн-оплатой входа. Ниже — что продаётся, как устроен платёжный флоу и данные для
            подключения эквайринга.
          </p>
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-sm border border-white/15 bg-ink px-4 py-2.5 font-mono text-xs text-white/70">
            <span className="h-2 w-2 shrink-0 rounded-full bg-cyan" />
            Интеграция готова к подключению эквайринга — сейчас на этапе финального подключения PSP.
          </div>
        </div>

        {/* О бизнесе */}
        <section className="mt-14">
          <h2 className="font-display text-2xl text-white sm:text-3xl">О бизнесе</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Что за бизнес">
              EXIT 13 — ночной клуб и пивной бар, {VENUE.city}, {VENUE.address}. Формат 21+: афиша
              техно-вечеринок, бар и кухня, бронь столов.
            </Card>
            <Card title="Онлайн-продукт">
              Мобильное приложение: клубная карта и бонусы, афиша с записью «Я иду», бронь столов,
              оплата входа. Приложение — на публикации в сторы; сайт-витрина: {' '}
              <a href="https://exit13.space" className="text-acid underline">exit13.space</a>.
            </Card>
            <Card title="Аудитория">
              Гости клуба, {VENUE.city}. Оплата в рублях (RUB), география — РФ. Доступ по возрасту 21+.
            </Card>
          </div>
        </section>

        {/* Что оплачивается */}
        <section className="mt-14">
          <h2 className="font-display text-2xl text-white sm:text-3xl">Что оплачивается онлайн</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Вход на событие">
              Оплата входа (кавер) на вечеринку — обычно 500–1000&nbsp;₽ в зависимости от времени и
              события.
            </Card>
            <Card title="Бронь стола">
              Депозит/бронь стола на событие. Сумма — по столу и событию.
            </Card>
            <Card title="Оплата на месте">
              «Касса» для персонала: приём оплаты картой по QR на входе (та же PSP-страница).
            </Card>
          </div>

          <div className="mt-5 rounded-sm border border-cyan/30 bg-cyan/5 p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-white/85">
              <span className="font-semibold text-cyan">Онлайн — только вход и бронь стола.</span>{' '}
              Алкоголь, еда и напитки через приложение и эквайринг{' '}
              <span className="font-semibold">не продаются</span> — они реализуются только офлайн, в
              клубе через кассу. Онлайн-платёж — это оплата услуги (вход на событие или бронь), а не
              товаров с высоким риском возвратов.
            </p>
          </div>

          <p className="mt-4 font-mono text-xs text-white/40">
            Средний чек и месячный оборот: <Fill>заполнить</Fill> · Валюта: RUB · Тип — разовые
            платежи (без подписок).
          </p>
        </section>

        {/* Схема платёжного флоу */}
        <section className="mt-14">
          <h2 className="font-display text-2xl text-white sm:text-3xl">Схема платёжного флоу</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Данные карт не проходят через наши серверы — оплата идёт на защищённой странице PSP.
            Подтверждение — по вебхуку с проверкой подписи. Два сценария:
          </p>
          <div className="mt-6 space-y-5">
            <FlowRow label="1 · Оплата в приложении" steps={FLOW_APP} accent="#ccff00" />
            <FlowRow label="2 · Оплата на месте (QR)" steps={FLOW_ONSITE} accent="#19e6ff" />
          </div>
        </section>

        {/* Возвраты + Безопасность */}
        <section className="mt-14 grid gap-4 lg:grid-cols-2">
          <Card title="Возвраты">
            Возврат инициирует гость или менеджер клуба. Отмена оплаченного входа: бонусами
            (мгновенно) или деньгами — вручную менеджером через PSP (по заявке). Условия и сроки
            возврата: <Fill>заполнить (оферта)</Fill>.
          </Card>
          <Card title="Данные и безопасность">
            Реквизиты карт обрабатывает только PSP на своей стороне — мы их не получаем и не храним.
            Персональные данные (телефон) — на хостинге в РФ (152-ФЗ).
          </Card>
        </section>

        {/* Контакты */}
        <section className="mt-14">
          <h2 className="font-display text-2xl text-white sm:text-3xl">Контакты</h2>
          <div className="mt-6 overflow-hidden rounded-sm border border-white/10">
            {[
              ['Сайт', <a key="site" href="https://exit13.space" className="text-acid underline">exit13.space</a>],
              ['Приложение', <span key="app" className="text-white/70">iOS (TestFlight) / Android (APK) — по запросу</span>],
              ['Документы', <span key="docs" className="flex flex-wrap gap-x-4 gap-y-1">
                <a href={asset('privacy.html')} className="text-acid underline">Политика конфиденциальности</a>
                <a href={asset('terms.html')} className="text-acid underline">Пользовательское соглашение</a>
              </span>],
              ['Поддержка', <span key="sup" className="text-white/80"><Fill>e-mail / @username — заполнить</Fill> · {VENUE.phone}</span>],
              ['Адрес', <span key="addr" className="text-white/70">{`${VENUE.city}, ${VENUE.address}`}</span>],
              ['Контакт', <a key="tg" href={VENUE.tg} className="text-acid underline">Telegram-канал</a>],
            ].map(([k, v], i) => (
              <div
                key={i}
                className="flex flex-col gap-1 border-b border-white/8 bg-ink px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="w-full font-mono text-xs uppercase tracking-widest text-white/40 sm:w-56">
                  {k}
                </div>
                <div className="text-sm text-white/85">{v}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-8 sm:flex-row sm:items-center">
          <span className="font-display text-lg font-black text-white">
            EXIT<span className="text-acid">13</span>
          </span>
          <span className="font-mono text-xs text-white/40">
            {VENUE.city} · {VENUE.address} · 21+
          </span>
        </div>
      </footer>
    </div>
  )
}
