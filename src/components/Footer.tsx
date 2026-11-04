import { DOC_LINKS, ORG, VENUE } from '../data'
import { asset } from '../lib/asset'

const CONTACTS = [
  { l: 'Telegram', v: '@exit13_ekb', href: VENUE.tg },
  { l: 'ВКонтакте', v: 'vk.com/exit13_ekb', href: VENUE.vk },
  { l: 'Instagram', v: '@exit13_ekb', href: VENUE.ig },
  { l: 'Телефон для гостей', v: VENUE.phone, href: `tel:${VENUE.phoneRaw}` },
]

const link = 'text-white underline-offset-2 transition-colors hover:text-acid hover:underline'

export default function Footer() {
  return (
    <footer id="contacts" className="relative hairline">
      <div className="section">
        <div className="container-x">
          {/* Unbounded (вариативный) — его перекрывающиеся контуры дают «чертёжную» обводку, как в main */}
          <h2 className="wire-title text-[clamp(2.5rem,9vw,7rem)] leading-[0.92] text-white">
            ЖДЁМ
            <br />
            <span className="wire-stroke">НА ТАНЦПОЛЕ</span>
          </h2>

          <dl className="mt-14 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACTS.map((c) => (
              <div key={c.l}>
                <dt className="text-sm text-dim">{c.l}</dt>
                <dd className="mt-1">
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className={`font-display text-lg font-medium break-words ${link}`}
                  >
                    {c.v}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          {/* Документы и реквизиты — официальные тексты живут на сайте клуба */}
          <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h3 className="font-display text-base font-medium text-text">Документы</h3>
              <ul className="mt-4 space-y-2.5">
                {DOC_LINKS.map((d) => (
                  <li key={d.href}>
                    <a href={d.href} target="_blank" rel="noreferrer" className={link}>
                      {d.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-dim">
                Кратко на этом сайте:{' '}
                <a href={asset('privacy.html')} className="text-fog underline-offset-2 hover:text-acid hover:underline">
                  политика
                </a>{' '}
                и{' '}
                <a href={asset('terms.html')} className="text-fog underline-offset-2 hover:text-acid hover:underline">
                  условия
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="font-display text-base font-medium text-text">Реквизиты</h3>
              <dl className="mt-4 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="text-dim">Организация</dt>
                <dd className="text-white">{ORG.short}</dd>
                <dt className="text-dim">ИНН / КПП</dt>
                <dd className="tabular-nums text-white">
                  {ORG.inn} / {ORG.kpp}
                </dd>
                <dt className="text-dim">ОГРН</dt>
                <dd className="tabular-nums text-white">{ORG.ogrn}</dd>
                <dt className="text-dim">Адрес</dt>
                <dd className="text-white">{ORG.address}</dd>
                <dt className="text-dim">Телефон</dt>
                <dd>
                  <a href={`tel:${ORG.phoneRaw}`} className={`tabular-nums ${link}`}>
                    {ORG.phone}
                  </a>
                </dd>
                <dt className="text-dim">E-mail</dt>
                <dd>
                  <a href={`mailto:${ORG.email}`} className={`break-all ${link}`}>
                    {ORG.email}
                  </a>
                </dd>
              </dl>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-2 text-sm text-dim sm:flex-row">
            <p>
              EXIT 13, {VENUE.address}, {VENUE.city}. Вход строго с 21 года.
            </p>
            <p>© 2026 {ORG.short}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
