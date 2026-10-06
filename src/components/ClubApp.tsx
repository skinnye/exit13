import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type Variants,
} from 'framer-motion'
import { CASHBACK, CLUBAPP, VENUE } from '../data'
import { asset } from '../lib/asset'

const EASE = [0.16, 1, 0.3, 1] as const

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

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
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 })

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div style={{ perspective: 1000 }} onMouseMove={onMove} onMouseLeave={onLeave} className="select-none">
      <motion.figure
        style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry } as MotionStyle}
        className="relative mx-auto max-w-md rounded-card-lg border border-acid bg-panel p-6 sm:p-7"
        aria-label="Пример клубной карты EXIT 13 в приложении"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <img src={asset('img/logo.png')} alt="EXIT 13" width={1400} height={294} className="h-6 w-auto" />
            <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-dim">Club card</div>
          </div>
          <span className="chip chip-dim">Кешбэк {FIRST.percent}%</span>
        </div>

        <div className="mx-auto mt-6 w-40 overflow-hidden rounded-2xl sm:w-44">
          <FakeQR className="block h-auto w-full" />
        </div>
        <div className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.14em] text-fog">
          Покажи на входе и на баре
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-dim">Бонусы</div>
            <div className="mt-1 font-display text-3xl text-acid">{CASHBACK.welcome}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-dim">Кешбэк</div>
            <div className="mt-1 font-display text-3xl text-white">{FIRST.percent}%</div>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-panel2">
          <div className="h-full w-[6%] rounded-full bg-acid" />
        </div>
        <figcaption className="mt-2.5 flex justify-between font-mono text-[0.6rem] uppercase tracking-[0.12em]">
          <span className="text-acid">{FIRST.percent}%</span>
          <span className="text-dim">
            до {SECOND.percent}% — {rub(SECOND.from)}
          </span>
        </figcaption>
      </motion.figure>
    </div>
  )
}

// ── Лестница кешбэка ───────────────────────────────────────────────
function CashbackLadder() {
  const max = CASHBACK.levels[CASHBACK.levels.length - 1].percent
  return (
    <div className="rounded-card-lg border border-line bg-panel p-6 sm:p-8">
      <div className="mono-label">Кешбэк бонусами</div>
      <h3 className="mt-3 font-display text-2xl uppercase text-white sm:text-3xl">Больше покупок — выше процент</h3>
      <p className="mt-2 text-sm text-fog">
        Уровень растёт сам — по сумме покупок в клубе по вашей карте.
      </p>
      <ol className="mt-6 space-y-3">
        {CASHBACK.levels.map((l) => (
          <li key={l.percent} className="grid grid-cols-[3.25rem_1fr_8.5rem] items-center gap-3 sm:gap-4">
            <span className="font-display text-2xl text-acid">{l.percent}%</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-panel2">
              <span className="block h-full rounded-full bg-acid" style={{ width: `${(l.percent / max) * 100}%` }} />
            </span>
            <span className="text-right font-mono text-xs text-fog">
              {l.from === 0 ? 'с первой покупки' : `от ${rub(l.from)}`}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <span className="chip chip-acid">+{CASHBACK.welcome} бонусов</span>
        <span className="text-sm text-fog">при регистрации в приложении</span>
      </div>
    </div>
  )
}

// ── Раздел: клубная карта + приложение ─────────────────────────────
export default function ClubApp() {
  const reduce = useReducedMotion()
  const viewport = { once: true, margin: '-12%' }

  // Лёгкий скролл-параллакс: карта и лестница едут в противофазе.
  const rowRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'end start'] })
  const ladderY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30])
  const cardY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-18, 18])

  return (
    <section id="club" className="section relative overflow-hidden">
      <div className="container-x relative">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 max-w-2xl"
        >
          <div className="mono-label mb-4">{CLUBAPP.eyebrow}</div>
          <h2 className="font-display text-4xl text-white sm:text-6xl">
            Своя карта — в твоём <span className="text-acid">телефоне</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">{CLUBAPP.intro}</p>
        </motion.div>

        {/* Карта + лестница кешбэка */}
        <div ref={rowRef} className="mb-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div style={{ y: cardY }}>
            <motion.div
              initial={{ opacity: 0, y: 32, rotateY: reduce ? 0 : -8 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={viewport}
              transition={{ duration: 0.85, ease: EASE }}
              style={{ perspective: 1200 }}
            >
              <ClubCard />
            </motion.div>
          </motion.div>

          <motion.div style={{ y: ladderY }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              <CashbackLadder />
            </motion.div>
          </motion.div>
        </div>

        {/* Что умеет приложение */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-8%' }}
          className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {CLUBAPP.features.map((f) => (
            <motion.div key={f.t} variants={rise} className="group bg-void p-6 transition-colors hover:bg-panel">
              <h3 className="font-display text-lg uppercase text-acid">{f.t}</h3>
              <span className="mt-2 block h-px w-8 origin-left scale-x-0 bg-acid transition-transform duration-300 group-hover:scale-x-100" />
              <p className="mt-1.5 text-sm text-white/60">{f.d}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Оплата + сторы */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-card border border-line bg-panel p-6">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-dim">Оплата входа</div>
            <p className="mt-2 text-white">{CLUBAPP.payment.now}</p>
            <p className="mt-1 text-fog">{CLUBAPP.payment.soon}</p>
          </div>
          <div className="rounded-card border border-line bg-panel p-6">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-dim">Где скачать</div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {CLUBAPP.stores.map((s) => (
                <span key={s.name} className="chip chip-dark">
                  <span className="text-text">{s.name}</span>
                  <span className="text-acid">{s.status}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center"
        >
          <div>
            <h3 className="font-display text-2xl uppercase text-white sm:text-3xl">
              Приложение — в <span className="text-acid">закрытом тесте</span>
            </h3>
            <p className="mt-2 max-w-md text-white/60">
              Скоро в App Store, Google Play и RuStore. О запуске расскажем в Telegram-канале клуба.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href={VENUE.tg} target="_blank" rel="noreferrer" className="btn btn-acid">
              Telegram
            </a>
            <a href={`tel:${VENUE.phoneRaw}`} className="btn btn-outline">
              Позвонить
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
