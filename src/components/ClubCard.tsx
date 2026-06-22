import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionStyle } from 'framer-motion'
import { CLUB, VENUE } from '../data'
import Reveal from './Reveal'

function NeonCard() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 })
  const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%'])

  const onMove = (e: React.MouseEvent) => {
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
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' } as MotionStyle}
        className="relative aspect-[1.586/1] w-full rounded-2xl p-6 overflow-hidden border border-acid/30"
      >
        {/* фон карты */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-700/0 via-[#12131b] to-[#05060a]" style={{ background: 'linear-gradient(135deg,#15131f, #0a0a10 60%, #07110f)' }} />
        <div className="absolute -inset-1 opacity-40 blur-2xl" style={{ background: 'radial-gradient(60% 60% at 20% 10%, #19e6ff55, transparent), radial-gradient(60% 60% at 90% 90%, #ccff0055, transparent)' }} />
        {/* блик */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ background: useTransform(glareX, (v) => `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.10) ${v}, transparent 70%)`) }} />

        <div className="relative h-full flex flex-col justify-between text-white" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display font-black text-2xl tracking-tight">EXIT<span className="text-acid">13</span></div>
              <div className="font-mono text-[0.6rem] tracking-[0.3em] text-white/60 mt-1">CLUB CARD</div>
            </div>
            {/* чип */}
            <div className="w-11 h-8 rounded-md bg-gradient-to-br from-acid/80 to-acid/30 border border-acid/40" />
          </div>

          <div>
            <div className="font-mono text-acid tracking-[0.35em] text-sm sm:text-base">13 · 0000 · EXIT</div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="font-mono text-[0.55rem] text-white/45 tracking-widest">ДЕРЖАТЕЛЬ</div>
                <div className="font-mono text-sm text-white/85 tracking-widest">ВАШЕ ИМЯ</div>
              </div>
              <div className="font-mono text-[0.55rem] text-white/45 tracking-widest">MEMBER 2026</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const WALLET_API = (import.meta.env as Record<string, string | undefined>).VITE_WALLET_API

function WalletBadge({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2.5 bg-black text-white rounded-xl px-5 py-3 border border-white/20 hover:border-white/40 transition-colors disabled:opacity-60"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.543 12.804c-.024-2.43 1.984-3.596 2.074-3.654-1.13-1.654-2.888-1.88-3.51-1.905-1.495-.151-2.916.88-3.673.88-.755 0-1.92-.858-3.158-.834-1.625.024-3.123.945-3.958 2.4-1.688 2.926-.43 7.26 1.21 9.64.802 1.165 1.756 2.471 3.006 2.425 1.206-.048 1.662-.779 3.12-.779 1.456 0 1.868.779 3.142.755 1.297-.024 2.118-1.187 2.913-2.355.918-1.351 1.296-2.66 1.32-2.728-.029-.013-2.533-.973-2.557-3.86zM15.1 5.43c.667-.81 1.117-1.935.994-3.056-.96.039-2.122.64-2.812 1.448-.618.717-1.16 1.863-1.014 2.962 1.07.083 2.165-.544 2.832-1.354z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[0.6rem] text-white/70">Добавить в</span>
        <span className="block font-semibold -mt-0.5">Apple Wallet</span>
      </span>
    </button>
  )
}

function Form() {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [f, setF] = useState({ name: '', phone: '', bday: '' })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }))

  // Выпуск карты через бэкенд: получаем .pkpass и отдаём — на iPhone откроется Wallet.
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
      <div className="text-center py-10 border border-acid/30 rounded-xl bg-acid/5 px-6">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="w-16 h-16 mx-auto rounded-full bg-acid text-void grid place-items-center text-3xl font-black"
        >
          ✓
        </motion.div>
        <h4 className="font-display text-2xl text-white mt-4">Карта готова</h4>
        <p className="mt-2 text-sm text-white/65 max-w-xs mx-auto">
          {WALLET_API
            ? 'Файл карты скачался — открой его на iPhone, чтобы добавить в Apple Wallet.'
            : 'Карта оформлена. Добавь её в Apple Wallet кнопкой ниже (активна после подключения бэкенда — см. wallet/SETUP.md).'}
        </p>
        <div className="mt-5 flex justify-center">
          <WalletBadge busy={busy} onClick={async () => { if (!(await issuePass())) alert('Wallet подключается после настройки бэкенда (wallet/SETUP.md).') }} />
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
      <div className="flex items-center gap-3 py-1">
        <span className="flex-1 h-px bg-white/10" />
        <span className="font-mono text-[0.6rem] text-white/40 uppercase">или сразу</span>
        <span className="flex-1 h-px bg-white/10" />
      </div>
      <div className="flex justify-center">
        <WalletBadge busy={busy} onClick={async () => { if (!(await issuePass())) alert('Заполни имя и телефон выше, либо Wallet подключится после настройки бэкенда (wallet/SETUP.md).') }} />
      </div>
      <p className="font-mono text-[0.62rem] text-white/40 text-center pt-1">
        Нажимая, вы соглашаетесь на обработку персональных данных (152-ФЗ).
      </p>
    </form>
  )
}

export default function ClubCard() {
  return (
    <section id="club" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, #ccff00, transparent 60%)' }} />

      <div className="container-x relative">
        <Reveal className="max-w-2xl mb-12">
          <div className="mono-label mb-4">Клубная карта</div>
          <h2 className="font-display text-4xl sm:text-6xl text-white">
            Свой среди <span className="text-acid">своих</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">{CLUB.intro}</p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <NeonCard />
            <div className="mt-8 grid sm:grid-cols-2 gap-px bg-white/8 border border-white/8">
              {CLUB.perks.map((p) => (
                <div key={p.t} className="bg-void p-5">
                  <div className="font-display text-lg text-acid">{p.t}</div>
                  <p className="mt-1.5 text-sm text-white/60">{p.d}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="border border-white/10 p-6 sm:p-8 bg-ink">
            <h3 className="font-display text-2xl text-white mb-1">Оформить за минуту</h3>
            <p className="text-sm text-white/55 mb-6">Заполни — карта будет ждать тебя на баре.</p>
            <Form />
            <div className="mt-5 pt-5 border-t border-white/10 flex gap-3">
              <a href={VENUE.tg} target="_blank" rel="noreferrer" className="btn btn-outline flex-1">Telegram</a>
              <a href={`tel:${VENUE.phoneRaw}`} className="btn btn-outline flex-1">Позвонить</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
