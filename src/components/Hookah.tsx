import { HOOKAH } from '../data'
import { scrollToId } from '../lib/scroll'

export default function Hookah() {
  return (
    <section id="hookah" className="section relative overflow-hidden bg-ink hairline">
      <div className="container-x relative">
        <div className="max-w-2xl">
          <h2 className="section-title">Кальян</h2>
          <p className="mt-5 text-lg text-white/70">{HOOKAH.intro}</p>
        </div>

        <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOOKAH.options.map((o) => (
            <div key={o.name}>
              <dt className="font-display text-lg font-medium text-text">{o.name}</dt>
              <dd className="mt-2 leading-relaxed text-white/60">{o.desc}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-white/75">{HOOKAH.priceNote}</p>
          <button type="button" className="btn btn-acid shrink-0" onClick={() => scrollToId('#booking')}>
            Забронировать стол
          </button>
        </div>
      </div>
    </section>
  )
}
