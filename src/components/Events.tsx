import { EVENTS, VENUE } from '../data'
import Reveal from './Reveal'

export default function Events() {
  return (
    <section id="afisha" className="section relative bg-ink hairline">
      <div className="container-x">
        <Reveal className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="mono-label mb-4">Афиша</div>
            <h2 className="font-display text-4xl sm:text-6xl text-white">Что играет</h2>
          </div>
          <a href={VENUE.tg} target="_blank" rel="noreferrer" className="hidden sm:inline-flex btn btn-outline">
            Все даты в Telegram
          </a>
        </Reveal>

        <div className="border-t border-white/10">
          {EVENTS.map((e, i) => (
            <Reveal
              as="article"
              key={e.title + e.date}
              delay={(i % 5) * 60}
              className={`group border-b border-white/10 ${e.past ? 'opacity-45' : ''}`}
            >
              <div className="grid md:grid-cols-[auto_1fr_auto] items-center gap-5 md:gap-8 py-6 md:py-7 transition-colors group-hover:bg-panel/60 px-2 md:px-4 -mx-2 md:-mx-4">
                <div className="flex items-baseline gap-3 md:w-44">
                  <span className="font-display font-black text-3xl md:text-4xl text-acid">{e.date}</span>
                  <span className="font-mono text-xs text-white/50 uppercase">{e.day} · {e.time}</span>
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-xl md:text-2xl text-white">{e.title}</h3>
                    {e.badge && (
                      <span className="font-mono text-[0.62rem] uppercase tracking-widest px-2 py-1 border border-acid/50 text-acid rounded-sm">
                        {e.badge}
                      </span>
                    )}
                    {e.past && (
                      <span className="font-mono text-[0.62rem] uppercase tracking-widest px-2 py-1 border border-white/20 text-white/50 rounded-sm">
                        прошло
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-mono text-xs md:text-sm text-white/55">
                    {e.lineup.join('  ·  ')}
                  </p>
                </div>

                <a
                  href={VENUE.tg}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline !py-3 !px-5 justify-self-start md:justify-self-end group-hover:border-acid group-hover:text-acid"
                >
                  {e.past ? 'Архив' : 'Билет / бронь'}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs text-white/40">
          Программа обновляется. Бронь столов и гостей — по телефону {VENUE.phone} и в Telegram.
        </p>
      </div>
    </section>
  )
}
