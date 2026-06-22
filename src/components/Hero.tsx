import { motion } from 'framer-motion'
import ShaderBG from './ShaderBG'
import Marquee from './Marquee'
import { VENUE, GENRES } from '../data'
import { scrollToId } from '../lib/scroll'

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col overflow-hidden">
      <ShaderBG className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-transparent to-void" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,transparent_40%,rgba(7,7,10,0.6))]" />

      <div className="relative flex-1 container-x flex flex-col justify-center pt-28 pb-10">
        <motion.div
          className="mono-label flex items-center gap-3"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-acid animate-pulse" />
          {VENUE.city} · {VENUE.address}
        </motion.div>

        <motion.h1
          className="glitch mt-4 font-display font-black text-white leading-[0.82] text-[clamp(4rem,18vw,15rem)]"
          data-text="EXIT 13"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.18 }}
        >
          EXIT<span className="text-acid">13</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-xl text-lg sm:text-2xl text-white/80 font-medium"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.32 }}
        >
          {VENUE.tagline}
        </motion.p>

        <motion.div
          className="mt-7 flex flex-wrap gap-2.5 font-mono text-[0.7rem] uppercase tracking-widest"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.44 }}
        >
          {[VENUE.metro, VENUE.door, VENUE.payments].map((c) => (
            <span key={c} className="px-3 py-1.5 border border-white/15 text-white/70 rounded-sm">{c}</span>
          ))}
        </motion.div>

        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.56 }}
        >
          <button className="btn btn-acid" onClick={() => scrollToId('#afisha')}>Смотреть афишу</button>
          <a className="btn btn-outline" href={`tel:${VENUE.phoneRaw}`}>Забронировать стол</a>
        </motion.div>
      </div>

      <div className="relative border-y border-white/10 bg-void/40 backdrop-blur-sm py-3 font-display font-extrabold text-white/85 text-lg sm:text-2xl">
        <Marquee items={GENRES} />
      </div>
    </section>
  )
}
