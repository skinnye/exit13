import { BAR_FEATURES } from '../data'
import Reveal from './Reveal'

export default function Bar() {
  return (
    <section id="bar" className="section relative">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <div className="mono-label mb-5">17:00 → 07:00 · одно место, два состояния</div>
          <h2 className="font-display text-4xl sm:text-6xl text-white leading-[0.95]">
            Вечером — <span className="text-white/40">бар.</span>
            <br />
            Ночью — <span className="text-acid">рейв.</span>
          </h2>
          <p className="mt-6 text-lg text-white/70 max-w-2xl">
            Заходишь на пиво и закуски в уютный пивной бар у Площади 1905 года. Сдаёшь обувь,
            получаешь тапочки. А ближе к ночи в пятницу и субботу свет гаснет, включается звук —
            и Exit 13 превращается в танцпол с андеграунд-электроникой до семи утра.
          </p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 border border-white/8">
          {BAR_FEATURES.map((f, i) => (
            <Reveal
              key={f.t}
              delay={(i % 4) * 80}
              className="bg-void p-7 hover:bg-panel transition-colors group"
            >
              <div className="font-mono text-acid text-sm mb-4">0{i + 1}</div>
              <h3 className="font-display text-xl text-white group-hover:text-acid transition-colors">{f.t}</h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">{f.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
