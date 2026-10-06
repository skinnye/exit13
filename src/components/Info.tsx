import { CLUBAPP, HOURS, VENUE } from '../data'
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

          <div className="mt-8 overflow-hidden rounded-card border border-line">
            {HOURS.map((h) => (
              <div
                key={h.d}
                className={`flex items-center justify-between px-5 py-4 border-b border-line last:border-0 ${
                  h.club ? 'bg-acid-dim' : ''
                }`}
              >
                <span className="font-mono text-sm uppercase tracking-[0.1em] text-white/70">{h.d}</span>
                <span className={`font-display text-lg ${h.club ? 'text-acid' : 'text-white'}`}>{h.h}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="rounded-card border border-line p-5">
              <div className="font-mono text-xs text-dim uppercase tracking-[0.12em] mb-2">Вход</div>
              <div className="text-white">{VENUE.door}</div>
            </div>
            <div className="rounded-card border border-line p-5">
              <div className="font-mono text-xs text-dim uppercase tracking-[0.12em] mb-2">Оплата на месте</div>
              <div className="text-white">{VENUE.payments}</div>
              <div className="mt-1 text-sm text-fog">{CLUBAPP.payment.soon}</div>
            </div>
            <div className="rounded-card border border-line p-5 sm:col-span-2">
              <div className="font-mono text-xs text-dim uppercase tracking-[0.12em] mb-2">Столы</div>
              <div className="text-white">
                В приложении EXIT 13 — бесплатно и без предоплаты. Или по телефону{' '}
                <a href={`tel:${VENUE.phoneRaw}`} className="whitespace-nowrap text-acid hover:underline">
                  {VENUE.phone}
                </a>
                .
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="flex flex-col">
          <div className="overflow-hidden rounded-card border border-line flex-1 min-h-[20rem]">
            <iframe
              title="Карта — EXIT 13"
              src={mapSrc}
              className="w-full h-full min-h-[20rem]"
              loading="lazy"
              style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(0.9)' }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-card border border-line p-5">
            <div>
              <div className="font-display text-lg text-white">{VENUE.address}</div>
              <div className="font-mono text-xs text-dim mt-1">{VENUE.metro}</div>
            </div>
            <a
              href={'https://yandex.ru/maps/?text=' + encodeURIComponent('Екатеринбург улица 8 Марта 13')}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm shrink-0"
            >
              Маршрут
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
