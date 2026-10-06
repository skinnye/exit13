import { HOOKAH, VENUE } from '../data'
import Reveal from './Reveal'

export default function Hookah() {
  return (
    <section id="hookah" className="section relative bg-ink hairline overflow-hidden">
      <div className="container-x relative">
        <Reveal className="max-w-2xl">
          <div className="mono-label mb-4">Кальянная</div>
          <h2 className="font-display text-4xl sm:text-6xl text-white">
            Дым под <span className="text-acid">бит</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">{HOOKAH.intro}</p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {HOOKAH.options.map((o, i) => (
            <Reveal key={o.name} delay={(i % 4) * 80} className="bg-void p-6 hover:bg-panel transition-colors group flex flex-col">
              <div className="font-mono text-acid text-sm mb-4">0{i + 1}</div>
              <h3 className="font-display text-xl uppercase text-white group-hover:text-acid transition-colors">{o.name}</h3>
              <p className="mt-2 text-sm text-white/55 leading-relaxed">{o.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-card border border-line bg-panel p-6">
          <p className="text-white/75">{HOOKAH.priceNote}</p>
          <a href={`tel:${VENUE.phoneRaw}`} className="btn btn-acid shrink-0">
            Забронировать стол
          </a>
        </Reveal>
      </div>
    </section>
  )
}
