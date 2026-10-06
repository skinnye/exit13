import { Fragment, type ReactNode } from 'react'
import { CLUB_SITE, DOC_LINKS, DOCS, ORG, SUPPORT_BOT, VENUE } from '../data'
import { asset } from '../lib/asset'
import { LegalFooter, LogoLink, OrgRequisites } from './LegalPage'

// Одностраничник для платёжного провайдера: что продаётся, как устроена оплата,
// возвраты, реквизиты. Факты — как на app.exit13.space (главная + оферта + реквизиты).

const FLOW_ONLINE = [
  'Гость выбирает вечеринку в приложении и нажимает «Я иду»',
  'Нажимает «Оплатить» — сервер клуба создаёт заказ и платёж у провайдера',
  'Оплата на защищённой странице провайдера: карта, СБП',
  'Провайдер присылает уведомление — сервер перепроверяет статус запросом к провайдеру',
  'Гость — в списке гостей с отметкой «Вход оплачен», чек 54-ФЗ — на e-mail или телефон',
  'В ночь вечеринки — вход по личному QR-коду и документу (21+)',
]

const FLOW_NOW = [
  'Гость приходит в ночь вечеринки — с отметкой «Я иду» в приложении или без неё',
  'Охрана проверяет возраст 21+ по документу',
  'Оплата входа на кассе клуба: карта, наличные, QR / СБП — по цене на момент прихода',
  'Гость с приложением показывает QR клубной карты — охрана отмечает вход',
]

const link = 'text-acid underline underline-offset-2'

function FlowRow({ label, steps, muted = false }: { label: string; steps: string[]; muted?: boolean }) {
  const accent = muted ? 'text-fog' : 'text-acid'
  return (
    <div className="rounded-card border border-line bg-panel p-5 sm:p-7">
      <h3 className={`mb-5 font-mono text-xs font-medium uppercase tracking-[0.12em] ${accent}`}>{label}</h3>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
        {steps.map((s, i) => (
          <Fragment key={i}>
            <div className="flex-1 rounded-card border border-line bg-void p-4">
              <span className={`font-mono text-xs ${accent}`}>{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-1.5 text-sm leading-snug text-white/80">{s}</p>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex shrink-0 items-center justify-center font-mono text-lg ${muted ? 'text-dim' : 'text-acid'}`}
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

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-panel p-6">
      <h3 className="font-display text-lg uppercase text-acid">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{children}</div>
    </div>
  )
}

export default function Partners() {
  return (
    <div className="grain min-h-screen">
      {/* Шапка */}
      <header className="border-b border-line">
        <div className="container-x flex items-center justify-between py-5">
          <LogoLink />
          <a
            href={asset('/')}
            className="font-mono text-xs uppercase tracking-[0.1em] text-fog transition-colors hover:text-acid"
          >
            ← на сайт
          </a>
        </div>
      </header>

      <main className="container-x py-14 sm:py-20">
        {/* Заголовок */}
        <div className="max-w-3xl">
          <div className="mono-label mb-4">Для платёжного провайдера</div>
          <h1 className="font-display text-4xl uppercase leading-[0.95] text-white sm:text-6xl">
            EXIT 13 — <span className="text-acid">платёжное</span> подключение
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Ночной клуб в Екатеринбурге ({ORG.short}). Онлайн продаём одну услугу — входной билет на
            вечеринку клуба. Ниже — что продаётся, как устроена оплата, возвраты и реквизиты.
          </p>
          <div className="mt-6 inline-flex items-start gap-2.5 rounded-card border border-line bg-panel px-4 py-3 font-mono text-xs leading-relaxed text-white/75">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-acid" />
            <span>
              Сейчас вход оплачивается на месте — на кассе клуба. Онлайн-оплата в приложении готова в коде и
              ждёт подключения эквайринга.
            </span>
          </div>
        </div>

        {/* О бизнесе */}
        <section className="mt-14">
          <h2 className="font-display text-2xl uppercase text-white sm:text-3xl">О бизнесе</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Что за бизнес">
              EXIT 13 — ночной клуб: {VENUE.city}, {VENUE.address}. Вечеринки с электронной музыкой, бар и
              кухня, бронь столов. Вход строго 21+ по документу.
            </Card>
            <Card title="Онлайн-продукт">
              Мобильное приложение EXIT 13 (iOS, Android): клубная карта с QR и кешбэком бонусами, афиша с
              записью «Я иду», бесплатная бронь столов, оплата входа. Сайт клуба с ценами и афишей —{' '}
              <a href={CLUB_SITE} target="_blank" rel="noreferrer" className={link}>
                app.exit13.space
              </a>
              .
            </Card>
            <Card title="Аудитория">
              Гости клуба, {VENUE.city}. Оплата в рублях, география — РФ. Только совершеннолетние 21+.
            </Card>
          </div>
        </section>

        {/* Что оплачивается */}
        <section className="mt-14">
          <h2 className="font-display text-2xl uppercase text-white sm:text-3xl">Что оплачивается онлайн</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Входной билет">
              Право прохода одного гостя на конкретную вечеринку. Онлайн оплачивается цена «до 01:00» из афиши —
              от 500&nbsp;₽; вход действует всю ночь. После 01:00 вход дороже и оплачивается на месте.
            </Card>
            <Card title="Бронь стола — бесплатно">
              Стол бронируется в приложении без оплаты и без предоплаты; бронь действует сразу. Это не платная
              услуга.
            </Card>
            <Card title="Бар и кухня — офлайн">
              Напитки, алкоголь и еда онлайн не продаются — только на месте, через кассу клуба.
            </Card>
          </div>

          <div className="mt-5 rounded-card border border-acid/40 bg-acid-dim p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-text">
              <span className="font-semibold text-acid">Онлайн — только входной билет.</span> Услуга оказывается
              очно в клубе, доставки нет: билет электронный — это отметка об оплате в списке гостей и QR-код
              клубной карты в приложении. Валюта — RUB, разовые платежи, без подписок.
            </p>
          </div>
        </section>

        {/* Схема платёжного флоу */}
        <section className="mt-14">
          <h2 className="font-display text-2xl uppercase text-white sm:text-3xl">Как устроена оплата</h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Данные карт не проходят через сервер клуба — оплата идёт на защищённой странице провайдера. Статус
            платежа сервер всегда перепроверяет запросом к провайдеру, а не по одному уведомлению.
          </p>
          <div className="mt-6 space-y-5">
            <FlowRow label="1 · Онлайн-билет в приложении (после подключения)" steps={FLOW_ONLINE} />
            <FlowRow label="2 · Сейчас: оплата на месте" steps={FLOW_NOW} muted />
          </div>
        </section>

        {/* Возвраты + Безопасность */}
        <section className="mt-14 grid gap-4 lg:grid-cols-2">
          <Card title="Отмена и возврат">
            До прохода на вход гость отменяет билет в приложении и выбирает: бонусы на клубную карту (сразу) или
            возврат денег тем же способом оплаты — в течение 10 дней со дня обращения. Клуб отменил или перенёс
            вечеринку — полная стоимость. После прохода на вход возврата нет. Заявки без приложения —{' '}
            <a href={`mailto:${ORG.email}`} className={link}>
              {ORG.email}
            </a>
            , {ORG.phone}. Полные условия —{' '}
            <a href={`${DOCS.offer}#s7`} target="_blank" rel="noreferrer" className={link}>
              оферта, раздел 7
            </a>
            .
          </Card>
          <Card title="Данные и безопасность">
            Реквизиты карт обрабатывает только провайдер — клуб их не получает и не хранит. Персональные данные
            гостей — на серверах в России (152-ФЗ). Электронный чек 54-ФЗ — через провайдера.
          </Card>
        </section>

        {/* Документы */}
        <section className="mt-14">
          <h2 className="font-display text-2xl uppercase text-white sm:text-3xl">Документы</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {DOC_LINKS.map((d) => (
              <a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                {d.label} ↗
              </a>
            ))}
          </div>
        </section>

        {/* Реквизиты и контакты */}
        <section className="mt-14">
          <h2 className="font-display text-2xl uppercase text-white sm:text-3xl">Реквизиты</h2>
          <div className="mt-6">
            <OrgRequisites bank />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card title="Поддержка гостей">
              Telegram-бот{' '}
              <a href={SUPPORT_BOT.href} target="_blank" rel="noreferrer" className={link}>
                {SUPPORT_BOT.label}
              </a>{' '}
              · бронь и вопросы — {VENUE.phone}
            </Card>
            <Card title="Приложение">
              iOS (TestFlight) и Android (закрытый тест) — доступ для проверки по запросу. Публично — скоро в App
              Store, Google Play и RuStore.
            </Card>
          </div>
        </section>
      </main>

      <LegalFooter />
    </div>
  )
}
