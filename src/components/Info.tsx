import { HOURS, VENUE } from '../data'
import Reveal from './Reveal'

const mapSrc =
  'https://yandex.ru/map-widget/v1/?text=' +
  encodeURIComponent('Екатеринбург, улица 8 Марта, 13') +
  '&z=16'

export default function Info() {
  return (
    <section id="info" className="section bg-ink hairline">
      <div className="container-x grid lg:grid-cols-2 gap-10">
        <Reveal>
          <div className="mono-label mb-4">Инфо</div>
          <h2 className="font-display text-4xl sm:text-5xl text-white">Часы и правила</h2>

          <div className="mt-8 border border-white/10">
            {HOURS.map((h) => (
              <div
                key={h.d}
                className={`flex items-center justify-between px-5 py-4 border-b border-white/10 last:border-0 ${
                  h.club ? 'bg-acid/5' : ''
                }`}
              >
                <span className="font-mono text-sm uppercase tracking-widest text-white/70">{h.d}</span>
                <span className={`font-display text-lg ${h.club ? 'text-acid' : 'text-white'}`}>{h.h}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="border border-white/10 p-5">
              <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-2">Вход</div>
              <div className="text-white">{VENUE.door}</div>
            </div>
            <div className="border border-white/10 p-5">
              <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-2">Оплата</div>
              <div className="text-white">{VENUE.payments}</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="flex flex-col">
          <div className="border border-white/10 overflow-hidden flex-1 min-h-[20rem]">
            <iframe
              title="Карта — Exit 13"
              src={mapSrc}
              className="w-full h-full min-h-[20rem]"
              loading="lazy"
              style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(0.9)' }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 border border-white/10 p-5">
            <div>
              <div className="font-display text-lg text-white">{VENUE.address}</div>
              <div className="font-mono text-xs text-white/55 mt-1">{VENUE.metro}</div>
            </div>
            <a
              href={'https://yandex.ru/maps/?text=' + encodeURIComponent('Екатеринбург улица 8 Марта 13')}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline !py-3 !px-5 shrink-0"
            >
              Маршрут
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
