import { useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionStyle,
  type Variants,
} from 'framer-motion'
import { CLUBAPP, VENUE } from '../data'
import { asset } from '../lib/asset'

const EASE = [0.16, 1, 0.3, 1] as const

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

// ── 3D неоновая карта (tilt на ховер) ─────────────────────────────
function NeonCard() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 })
  const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%'])

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
      <motion.div
        style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: 'preserve-3d' } as MotionStyle}
        className="relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl border border-acid/30 p-6"
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#15131f, #0a0a10 60%, #07110f)' }} />
        <div
          className="absolute -inset-1 opacity-40 blur-2xl"
          style={{ background: 'radial-gradient(60% 60% at 20% 10%, #19e6ff55, transparent), radial-gradient(60% 60% at 90% 90%, #ccff0055, transparent)' }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: useTransform(glareX, (v) => `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.10) ${v}, transparent 70%)`) }}
        />
        <div className="relative flex h-full flex-col justify-between text-white" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-2xl font-black tracking-tight">EXIT<span className="text-acid">13</span></div>
              <div className="mt-1 font-mono text-[0.6rem] tracking-[0.3em] text-white/60">CLUB CARD</div>
            </div>
            <div className="h-8 w-11 rounded-md border border-acid/40 bg-gradient-to-br from-acid/80 to-acid/30" />
          </div>
          <div>
            <div className="font-mono text-sm tracking-[0.35em] text-acid sm:text-base">13 · 0000 · EXIT</div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="font-mono text-[0.55rem] tracking-widest text-white/45">ДЕРЖАТЕЛЬ</div>
                <div className="font-mono text-sm tracking-widest text-white/85">ВАШЕ ИМЯ</div>
              </div>
              <div className="font-mono text-[0.55rem] tracking-widest text-white/45">MEMBER 2026</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ── Телефон со скрином: appear-стаггер снаружи, бесконечный «дрейф» внутри ──
function Phone({ src, alt, elevated, reduce, delay }: { src: string; alt: string; elevated: boolean; reduce: boolean | null; delay: number }) {
  return (
    <motion.div variants={rise} className={elevated ? 'z-10' : ''}>
      <motion.div
        animate={reduce ? undefined : { y: [0, elevated ? -10 : -5, 0] }}
        transition={reduce ? undefined : { repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay }}
        className={`relative w-[7rem] shrink-0 rounded-[1.7rem] border border-white/15 bg-black p-1 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.85)] sm:w-[10rem] ${
          elevated ? 'scale-105' : 'opacity-90'
        }`}
      >
        <img src={src} alt={alt} loading="lazy" className="block w-full rounded-[1.4rem]" />
      </motion.div>
    </motion.div>
  )
}

// ── Форма выпуска карты в Apple Wallet ────────────────────────────
const WALLET_API = (import.meta.env as Record<string, string | undefined>).VITE_WALLET_API

function WalletBadge({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-black px-5 py-3 text-white transition-colors hover:border-white/40 disabled:opacity-60"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.543 12.804c-.024-2.43 1.984-3.596 2.074-3.654-1.13-1.654-2.888-1.88-3.51-1.905-1.495-.151-2.916.88-3.673.88-.755 0-1.92-.858-3.158-.834-1.625.024-3.123.945-3.958 2.4-1.688 2.926-.43 7.26 1.21 9.64.802 1.165 1.756 2.471 3.006 2.425 1.206-.048 1.662-.779 3.12-.779 1.456 0 1.868.779 3.142.755 1.297-.024 2.118-1.187 2.913-2.355.918-1.351 1.296-2.66 1.32-2.728-.029-.013-2.533-.973-2.557-3.86zM15.1 5.43c.667-.81 1.117-1.935.994-3.056-.96.039-2.122.64-2.812 1.448-.618.717-1.16 1.863-1.014 2.962 1.07.083 2.165-.544 2.832-1.354z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[0.6rem] text-white/70">Добавить в</span>
        <span className="-mt-0.5 block font-semibold">Apple Wallet</span>
      </span>
    </button>
  )
}

function Form() {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [f, setF] = useState({ name: '', phone: '', bday: '' })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }))

  const issuePass = async (): Promise<boolean> => {
    if (!WALLET_API) return false
    setBusy(true)
    try {
      const r = await fetch(`${WALLET_API}/api/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      })
      if (!r.ok) throw new Error('issue failed')
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'exit13.pkpass'
      a.click()
      URL.revokeObjectURL(url)
      return true
    } catch {
      return false
    } finally {
      setBusy(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await issuePass()
    setSent(true)
  }

  const field =
    'w-full bg-void/60 border border-white/15 px-4 py-3.5 text-white placeholder:text-white/35 focus:outline-none focus:border-acid/60 transition-colors rounded-sm'

  if (sent) {
    return (
      <div className="rounded-xl border border-acid/30 bg-acid/5 px-6 py-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-acid text-3xl font-black text-void"
        >
          ✓
        </motion.div>
        <h4 className="mt-4 font-display text-2xl text-white">Карта готова</h4>
        <p className="mx-auto mt-2 max-w-xs text-sm text-white/65">
          {WALLET_API
            ? 'Файл карты скачался — открой его на iPhone, чтобы добавить в Apple Wallet.'
            : 'Карта оформлена. Добавь её в Apple Wallet кнопкой ниже (активна после подключения бэкенда).'}
        </p>
        <div className="mt-5 flex justify-center">
          <WalletBadge busy={busy} onClick={async () => { if (!(await issuePass())) alert('Wallet подключается после настройки бэкенда.') }} />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className={field} placeholder="Имя" required value={f.name} onChange={set('name')} />
      <input className={field} placeholder="Телефон" type="tel" required value={f.phone} onChange={set('phone')} />
      <label className="block">
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">Дата рождения (для подарка)</span>
        <input className={`${field} mt-1`} type="date" value={f.bday} onChange={set('bday')} />
      </label>
      <button type="submit" disabled={busy} className="btn btn-acid w-full !py-4 disabled:opacity-60">
        {busy ? 'Выпускаем…' : 'Оформить и добавить в Wallet'}
      </button>
      <p className="pt-1 text-center font-mono text-[0.62rem] text-white/40">
        Нажимая, вы соглашаетесь на обработку персональных данных (152-ФЗ).
      </p>
    </form>
  )
}

// ── Раздел: клубная карта + приложение в одном ────────────────────
export default function ClubApp() {
  const reduce = useReducedMotion()
  const viewport = { once: true, margin: '-12%' }

  return (
    <section id="club" className="section relative overflow-hidden">
      {/* фоновые свечения */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-[45rem] w-[45rem] -translate-x-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ccff00, transparent 60%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-[38rem] w-[38rem] rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #19e6ff, transparent 60%)' }}
      />

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

        {/* Карта + телефоны */}
        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 32, rotateY: reduce ? 0 : -10 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={viewport}
            transition={{ duration: 0.85, ease: EASE }}
            style={{ perspective: 1200 }}
          >
            <NeonCard />
            <div className="mt-7 flex flex-wrap gap-3">
              {CLUBAPP.stores.map((s) => (
                <div key={s.name} className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-ink px-4 py-3">
                  <span className="font-mono text-sm text-white/85">{s.name}</span>
                  <span className="font-mono text-[0.58rem] uppercase tracking-widest text-acid">{s.status}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="flex items-center justify-center gap-3 sm:gap-5"
          >
            {CLUBAPP.screens.map((s, i) => (
              <Phone key={s.src} src={asset(s.src)} alt={s.alt} elevated={i === 1} reduce={reduce} delay={i * 0.6} />
            ))}
          </motion.div>
        </div>

        {/* Привилегии карты + возможности приложения — вместе */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-8%' }}
          className="grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CLUBAPP.features.map((f) => (
            <motion.div key={f.t} variants={rise} className="group bg-void p-6 transition-colors hover:bg-panel">
              <div className="font-display text-lg text-acid">{f.t}</div>
              <p className="mt-1.5 text-sm text-white/60">{f.d}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Оформление карты */}
        <div className="mt-16 grid items-start gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.7, ease: EASE }}>
            <h3 className="font-display text-3xl text-white sm:text-4xl">
              Оформи карту <span className="text-acid">за минуту</span>
            </h3>
            <p className="mt-4 max-w-md text-white/60">
              Заполни — и карта откроется в Apple Wallet. В приложении она же станет твоим входом, бонусами и оплатой.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={VENUE.tg} target="_blank" rel="noreferrer" className="btn btn-outline">Telegram</a>
              <a href={`tel:${VENUE.phoneRaw}`} className="btn btn-outline">Позвонить</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="border border-white/10 bg-ink p-6 sm:p-8"
          >
            <Form />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
