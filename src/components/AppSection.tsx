import { APP } from '../data'
import { asset } from '../lib/asset'
import Reveal from './Reveal'

// Телефон-рамка вокруг реального скриншота экрана приложения.
function Phone({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`relative w-[7.2rem] sm:w-[10.5rem] shrink-0 rounded-[1.8rem] border border-white/15 bg-black p-1 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.85)] ${className}`}
    >
      <img src={src} alt={alt} loading="lazy" className="block w-full rounded-[1.5rem]" />
    </div>
  )
}

export default function AppSection() {
  return (
    <section id="app" className="section relative overflow-hidden">
      {/* мягкое свечение */}
      <div
        className="pointer-events-none absolute -top-32 -right-24 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, #19e6ff, transparent 60%)' }}
      />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Левая колонка — текст, фичи, сторы */}
          <div>
            <Reveal>
              <div className="mono-label mb-4">Мобильное приложение</div>
              <h2 className="font-display text-4xl text-white sm:text-6xl">
                Клуб — в твоём <span className="text-acid">телефоне</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg text-white/70">{APP.intro}</p>
            </Reveal>

            <Reveal delay={100} className="mt-9 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2">
              {APP.features.map((f) => (
                <div key={f.t} className="bg-void p-5">
                  <div className="font-display text-lg text-acid">{f.t}</div>
                  <p className="mt-1.5 text-sm text-white/60">{f.d}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={160} className="mt-8 flex flex-wrap gap-3">
              {APP.stores.map((s) => (
                <div
                  key={s.name}
                  className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-ink px-4 py-3"
                >
                  <span className="font-mono text-sm text-white/85">{s.name}</span>
                  <span className="font-mono text-[0.58rem] uppercase tracking-widest text-acid">
                    {s.status}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Правая колонка — экраны приложения «веером» */}
          <Reveal delay={80}>
            <div className="flex items-center justify-center gap-3 sm:gap-5">
              {APP.screens.map((s, i) => (
                <Phone
                  key={s.src}
                  src={asset(s.src)}
                  alt={s.alt}
                  className={
                    i === 1
                      ? 'z-10 -translate-y-3 scale-105'
                      : 'translate-y-3 opacity-85'
                  }
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
