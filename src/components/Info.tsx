import { CLUBAPP, HOURS, TABLE_DEPOSIT_TEXT, VENUE } from '../data'
import { scrollToId } from '../lib/scroll'

// Карточка клуба в Яндекс Картах (организация «Exit13»): метка на клубе, а не на доме
// 8 Марта, 13 (там много организаций), и сразу — часы, телефон, отзывы, «Как добраться».
const YA_ORG = 'exit13/143006228461'
const mapSrc = `https://yandex.ru/map-widget/v1/org/${YA_ORG}/?ll=60.600322,56.836510&z=17`
const mapLink = `https://yandex.ru/maps/org/${YA_ORG}/`

export default function Info() {
  return (
    <section id="info" className="section bg-ink hairline">
      <div className="container-x grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="section-title">Часы и правила</h2>

          <table className="mt-8 w-full border-collapse text-left">
            <caption className="sr-only">Часы работы</caption>
            <tbody>
              {HOURS.map((h) => (
                <tr key={h.d} className="border-b border-line">
                  <th scope="row" className="py-4 pr-4 font-normal text-white/70">
                    {h.d}
                  </th>
                  <td className={`py-4 text-right tabular-nums ${h.club ? 'font-semibold text-acid' : 'text-text'}`}>
                    {h.h}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-dim">
            Со вторника по четверг: бизнес-ланчи с 14:00 до 17:00 (450 ₽), кино-вечера с 20:00 до полуночи.
          </p>

          <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="font-display text-base font-medium text-text">Вход</dt>
              <dd className="mt-1.5 text-white/65">{VENUE.door}</dd>
            </div>
            <div>
              <dt className="font-display text-base font-medium text-text">Оплата</dt>
              <dd className="mt-1.5 text-white/65">
                {CLUBAPP.payment.onsite} {CLUBAPP.payment.online}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-display text-base font-medium text-text">Столы</dt>
              <dd className="mt-1.5 text-white/65">
                Бронь столов с внесением депозита {TABLE_DEPOSIT_TEXT} — он включает вход для компании по числу мест за столом и засчитывается в счёт бара. Забронировать —{' '}
                <a
                  href="#booking"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId('#booking')
                  }}
                  className="text-acid underline-offset-2 hover:underline"
                >
                  на сайте
                </a>{' '}
                или в приложении EXIT 13. Можно и по телефону{' '}
                <a href={`tel:${VENUE.phoneRaw}`} className="whitespace-nowrap text-acid underline-offset-2 hover:underline">
                  {VENUE.phone}
                </a>
                .
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col">
          <div className="min-h-[20rem] flex-1 overflow-hidden rounded-card border border-line">
            <iframe
              title="EXIT 13 на Яндекс Картах"
              src={mapSrc}
              className="h-full min-h-[20rem] w-full"
              loading="lazy"
              style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(0.9)' }}
            />
          </div>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <div className="font-display text-lg font-medium text-text">{VENUE.address}</div>
              <div className="mt-1 text-sm text-dim">{VENUE.metro}</div>
            </div>
            <a href={mapLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm shrink-0">
              Маршрут
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
