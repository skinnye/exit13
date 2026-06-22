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

function Form() {
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ name: '', phone: '', bday: '' })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // У клуба нет публичной почты — заявка фиксируется, дальше связь через Telegram/телефон.
    // На боевом сайте здесь подключается отправка в Telegram-бот / CRM.
    setSent(true)
  }

  const field =
    'w-full bg-void/60 border border-white/15 px-4 py-3.5 text-white placeholder:text-white/35 focus:outline-none focus:border-acid/60 transition-colors rounded-sm'

  if (sent) {
    return (
      <div className="text-center py-12 border border-acid/30 rounded-xl bg-acid/5">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="w-16 h-16 mx-auto rounded-full bg-acid text-void grid place-items-center text-3xl font-black"
        >
          ✓
        </motion.div>
        <h4 className="font-display text-2xl text-white mt-4">Заявка принята</h4>
        <p className="mt-2 text-sm text-white/65 max-w-xs mx-auto">
          Заберёшь карту на баре в ближайший визит. Если почта не открылась — напиши нам в Telegram.
        </p>
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
      <button type="submit" className="btn btn-acid w-full !py-4">Оформить карту</button>
      <p className="font-mono text-[0.62rem] text-white/40 text-center">
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
