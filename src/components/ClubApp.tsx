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

// ── Раздел: клубная карта + приложение в одном ────────────────────
export default function ClubApp() {
  const reduce = useReducedMotion()
  const viewport = { once: true, margin: '-12%' }

  // Скролл-параллакс: карта и телефоны едут в противофазе, создавая глубину.
  const rowRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'end start'] })
  const phonesY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [46, -46])
  const cardY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-24, 24])

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

        {/* Карта + телефоны (со скролл-параллаксом) */}
        <div ref={rowRef} className="mb-16 grid items-center gap-12 lg:grid-cols-2">
          <motion.div style={{ y: cardY }}>
            <motion.div
              initial={{ opacity: 0, y: 32, rotateY: reduce ? 0 : -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={viewport}
              transition={{ duration: 0.85, ease: EASE }}
              style={{ perspective: 1200 }}
            >
              <NeonCard />
            </motion.div>
            <div className="mt-7 flex flex-wrap gap-3">
              {CLUBAPP.stores.map((s) => (
                <div key={s.name} className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-ink px-4 py-3">
                  <span className="font-mono text-sm text-white/85">{s.name}</span>
                  <span className="font-mono text-[0.58rem] uppercase tracking-widest text-acid">{s.status}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div style={{ y: phonesY }}>
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
              <span className="mt-2 block h-px w-8 origin-left scale-x-0 bg-acid transition-transform duration-300 group-hover:scale-x-100" />
              <p className="mt-1.5 text-sm text-white/60">{f.d}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA: карта живёт в приложении */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/8 pt-10 sm:flex-row sm:items-center"
        >
          <div>
            <h3 className="font-display text-2xl text-white sm:text-3xl">
              Карта — в <span className="text-acid">приложении</span>
            </h3>
            <p className="mt-2 max-w-md text-white/60">
              Скоро в App Store, RuStore и Google Play. Пока — оформи на баре или напиши в Telegram.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <a href={VENUE.tg} target="_blank" rel="noreferrer" className="btn btn-acid">Telegram</a>
            <a href={`tel:${VENUE.phoneRaw}`} className="btn btn-outline">Позвонить</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
