import { HOOKAH, VENUE } from '../data'
import Reveal from './Reveal'

export default function Hookah() {
  return (
    <section id="hookah" className="section relative bg-ink hairline overflow-hidden">
      {/* дымчатые неоновые пятна */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #ff1f6b, transparent 60%)' }} />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #19e6ff, transparent 60%)' }} />

      <div className="container-x relative">
        <Reveal className="max-w-2xl">
          <div className="mono-label mb-4">Кальянная</div>
          <h2 className="font-display text-4xl sm:text-6xl text-white">
            Дым под <span className="text-acid">бит</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">{HOOKAH.intro}</p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 border border-white/8">
          {HOOKAH.options.map((o, i) => (
            <Reveal key={o.name} delay={(i % 4) * 80} className="bg-void p-6 hover:bg-panel transition-colors group flex flex-col">
              <div className="font-display text-xl text-white group-hover:text-acid transition-colors">{o.name}</div>
              <p className="mt-2 text-sm text-white/55 leading-relaxed flex-1">{o.desc}</p>
              <div className="mt-5 font-mono text-acid">{o.price}</div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 p-6">
          <p className="text-white/75">{HOOKAH.combo}</p>
          <a href={`tel:${VENUE.phoneRaw}`} className="btn btn-acid shrink-0">Забронировать стол</a>
        </Reveal>

        <p className="mt-5 font-mono text-xs text-white/35">
          Позиции и цены ориентировочные — уточняются у заведения.
        </p>
      </div>
    </section>
  )
}
