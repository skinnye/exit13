import { CASHBACK, CLUBAPP } from '../data'
import { asset } from '../lib/asset'

const rub = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} ₽`
const [FIRST, SECOND] = CASHBACK.levels

// ── Декоративный QR (не сканируется): 21×21 модуль, три «глаза» как у настоящего ──
const QR_N = 21
const QR_CELLS: Array<[number, number]> = (() => {
  const cells: Array<[number, number]> = []
  let seed = 13
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  const finder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > QR_N - 9 && y < 8) || (x < 8 && y > QR_N - 9)
  for (let y = 0; y < QR_N; y++) for (let x = 0; x < QR_N; x++) if (!finder(x, y) && rnd() > 0.5) cells.push([x, y])
  return cells
})()

function FakeQR({ className = '' }: { className?: string }) {
  const eyes: Array<[number, number]> = [
    [0, 0],
    [QR_N - 7, 0],
    [0, QR_N - 7],
  ]
  return (
    <svg viewBox={`-2 -2 ${QR_N + 4} ${QR_N + 4}`} className={className} aria-hidden shapeRendering="crispEdges">
      <rect x={-2} y={-2} width={QR_N + 4} height={QR_N + 4} fill="#fff" />
      {eyes.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={7} height={7} fill="#080808" />
          <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="#080808" />
        </g>
      ))}
      {QR_CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#080808" />
      ))}
    </svg>
  )
}

// ── Клубная карта как в приложении (v2): золотая рамка, один QR, метрики ──────────
// Пример — карта нового гостя: приветственные бонусы и стартовый кешбэк.
function ClubCard() {
  return (
    <figure
      className="relative mx-auto max-w-md select-none rounded-card-lg border border-acid bg-panel p-6 sm:p-7"
      aria-label="Пример клубной карты EXIT 13 в приложении"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <img src={asset('img/logo.png')} alt="EXIT 13" width={1400} height={294} className="h-6 w-auto" />
          <div className="mt-2 text-xs text-dim">Клубная карта</div>
        </div>
        <span className="chip chip-dim">Кешбэк {FIRST.percent}%</span>
      </div>

      <div className="mx-auto mt-6 w-40 overflow-hidden rounded-2xl sm:w-44">
        <FakeQR className="block h-auto w-full" />
      </div>
      <div className="mt-4 text-center text-sm text-fog">Покажи на входе и на баре</div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
        <div>
          <div className="text-xs text-dim">Бонусы</div>
          <div className="mt-1 font-display text-3xl font-semibold tabular-nums text-acid">{CASHBACK.welcome}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-dim">Кешбэк</div>
          <div className="mt-1 font-display text-3xl font-semibold tabular-nums text-white">{FIRST.percent}%</div>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-panel2">
        <div className="h-full w-[6%] rounded-full bg-acid" />
      </div>
      <figcaption className="mt-2.5 flex justify-between text-xs tabular-nums">
        <span className="text-acid">{FIRST.percent}%</span>
        <span className="text-dim">
          {SECOND.percent}% с покупок от {rub(SECOND.from)}
        </span>
      </figcaption>
    </figure>
  )
}

// ── Лестница кешбэка ───────────────────────────────────────────────
function CashbackLadder() {
  const max = CASHBACK.levels[CASHBACK.levels.length - 1].percent
  return (
    <div className="rounded-card-lg border border-line bg-panel p-6 sm:p-8">
      <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">Больше покупок — выше кешбэк</h3>
      <p className="mt-2 text-sm text-fog">Кешбэк начисляется бонусами. Процент растёт сам — по сумме покупок по твоей карте.</p>
      <ol className="mt-6 space-y-3">
        {CASHBACK.levels.map((l) => (
          <li key={l.percent} className="grid grid-cols-[4.5rem_1fr_8.5rem] items-center gap-3 sm:gap-4">
            <span className="font-display text-2xl font-semibold tabular-nums text-acid">{l.percent}%</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-panel2">
              <span className="block h-full rounded-full bg-acid" style={{ width: `${(l.percent / max) * 100}%` }} />
            </span>
            <span className="text-right text-sm tabular-nums text-fog">
              {l.from === 0 ? 'с первой покупки' : `от ${rub(l.from)}`}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t border-line pt-5 text-sm text-fog">
        <span className="font-semibold text-acid">+{CASHBACK.welcome} бонусов</span> при регистрации в приложении
      </p>
    </div>
  )
}

// ── Раздел: клубная карта + приложение ─────────────────────────────
export default function ClubApp() {
  const apps = CLUBAPP.stores.filter((s) => s.href)
  return (
    <section id="club" className="section relative overflow-hidden">
      <div className="container-x relative">
        <div className="mb-12 max-w-2xl">
          <h2 className="section-title">Клубная карта в телефоне</h2>
          <p className="mt-5 text-lg text-white/70">{CLUBAPP.intro}</p>
        </div>

        <div className="mb-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <ClubCard />
          <CashbackLadder />
        </div>

        <h3 className="font-display text-xl font-medium text-text">Что есть в приложении</h3>
        <dl className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {CLUBAPP.features.map((f) => (
            <div key={f.t}>
              <dt className="font-semibold text-text">{f.t}</dt>
              <dd className="mt-1.5 text-white/60">{f.d}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-base font-medium text-text">Оплата входа</h3>
            <p className="mt-2 text-white/80">{CLUBAPP.payment.online}</p>
            <p className="mt-1 text-fog">{CLUBAPP.payment.onsite}</p>
          </div>
          <div>
            <h3 className="font-display text-base font-medium text-text">Скачать</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {apps.map((s, i) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn btn-sm ${i === 0 ? 'btn-acid' : 'btn-outline'}`}
                >
                  {s.name}
                </a>
              ))}
            </div>
            <p className="mt-3 text-sm text-dim">
              {CLUBAPP.stores
                .filter((s) => !s.href)
                .map((s) => `${s.name} — ${s.status}`)
                .join(', ')}
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
