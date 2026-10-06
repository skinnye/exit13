import type React from 'react'
import { motion } from 'framer-motion'
import ShaderBG from './ShaderBG'
import Marquee from './Marquee'
import { VENUE, GENRES } from '../data'
import { scrollToId } from '../lib/scroll'
import { asset } from '../lib/asset'

const ease = [0.16, 1, 0.3, 1] as const
const rise = (delay: number, y = 18) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, ease, delay },
})

// Иконки — Feather (тот же набор, что в приложении), инлайном, без зависимостей.
const ArrowDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
)
const Phone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export default function Hero() {
  const chips = [
    { text: VENUE.metro, tone: 'chip-dark' },
    { text: VENUE.door, tone: 'chip-dim' },
    { text: VENUE.payments, tone: 'chip-dark' },
  ]

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <ShaderBG className="absolute inset-0 h-full w-full" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void" />

      <div className="container-x relative flex flex-1 flex-col justify-center pb-12 pt-28 sm:pb-16">
        <motion.p className="mono-label flex items-center gap-3" {...rise(0.1)}>
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
          </span>
          {VENUE.city} · {VENUE.address}
        </motion.p>

        <motion.h1 className="mt-6 sm:mt-8" {...rise(0.18, 28)}>
          {/* глитч при наведении — как в main: голубая и розовая копии логотипа со сдвигом */}
          <span
            className="glitch-logo w-[min(100%,56rem)]"
            style={{ '--logo': `url(${asset('img/logo.png')})` } as React.CSSProperties}
          >
            <img
              src={asset('img/logo.png')}
              alt=""
              width={1400}
              height={294}
              fetchPriority="high"
              draggable={false}
              className="block h-auto w-full select-none"
            />
          </span>
          <span className="sr-only">EXIT 13 — ночной клуб в Екатеринбурге</span>
        </motion.h1>

        <motion.p
          className="mt-7 max-w-xl text-lg font-semibold leading-snug text-text sm:mt-9 sm:text-2xl"
          {...rise(0.32)}
        >
          {VENUE.tagline}
        </motion.p>

        <motion.ul className="mt-6 flex flex-wrap gap-2" {...rise(0.44, 16)}>
          {chips.map((c) => (
            <li key={c.text} className={`chip ${c.tone}`}>
              {c.text}
            </li>
          ))}
        </motion.ul>

        <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" {...rise(0.56, 16)}>
          <button type="button" className="btn btn-acid" onClick={() => scrollToId('#afisha')}>
            Смотреть афишу <ArrowDown />
          </button>
          <a className="btn btn-outline" href={`tel:${VENUE.phoneRaw}`} aria-label={`Забронировать стол по телефону ${VENUE.phone}`}>
            <Phone /> Забронировать стол
          </a>
        </motion.div>
        <motion.p
          className="mt-4 font-mono text-[0.68rem] font-medium uppercase tracking-[0.1em] text-dim"
          {...rise(0.64, 10)}
        >
          Бронь — по телефону {VENUE.phone} · скоро в приложении
        </motion.p>
      </div>

      <div className="relative border-y border-line bg-ink/70 py-3.5 font-display text-lg font-bold uppercase tracking-[0.04em] text-text/85 backdrop-blur-sm sm:text-2xl">
        <Marquee items={GENRES} />
      </div>
    </section>
  )
}
