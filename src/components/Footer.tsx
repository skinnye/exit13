import Marquee from './Marquee'
import { DOC_LINKS, ORG, VENUE } from '../data'
import { asset } from '../lib/asset'

export default function Footer() {
  return (
    <footer id="contacts" className="relative">
      <div className="border-y border-line py-4 font-display text-acid text-2xl sm:text-4xl">
        <Marquee items={['УВИДИМСЯ В ТРИНАДЦАТОМ', 'EXIT 13', '8 МАРТА 13', 'ЕКАТЕРИНБУРГ']} sep={<span className="text-white/30 px-2">✳</span>} />
      </div>

      <div className="section">
        <div className="container-x">
          {/* Unbounded (вариативный) — его перекрывающиеся контуры дают «чертёжную» обводку, как в main */}
          <h2 className="wire-title text-white text-[clamp(2.5rem,9vw,7rem)] leading-[0.92]">
            ЖДЁМ
            <br />
            <span className="wire-stroke">НА ТАНЦПОЛЕ</span>
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-card bg-line border border-line">
            {[
              { l: 'Telegram', v: '@exit13_ekb', href: VENUE.tg },
              { l: 'ВКонтакте', v: 'vk.com/exit13_ekb', href: VENUE.vk },
              { l: 'Instagram', v: '@exit13_ekb', href: VENUE.ig },
              { l: 'Телефон для гостей', v: VENUE.phone, href: `tel:${VENUE.phoneRaw}` },
            ].map((c) => (
              <a
                key={c.l}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="bg-void p-6 hover:bg-panel transition-colors group"
              >
                <div className="font-mono text-xs text-dim uppercase tracking-[0.12em] mb-3">{c.l}</div>
                <div className="font-display text-lg text-white group-hover:text-acid transition-colors break-words">{c.v}</div>
              </a>
            ))}
          </div>

          {/* Документы и реквизиты — официальные тексты живут на сайте клуба */}
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <div className="rounded-card border border-line bg-panel p-6">
              <div className="font-mono text-xs text-dim uppercase tracking-[0.12em]">Документы</div>
              <ul className="mt-4 space-y-2.5">
                {DOC_LINKS.map((d) => (
                  <li key={d.href}>
                    <a href={d.href} target="_blank" rel="noreferrer" className="text-white transition-colors hover:text-acid">
                      {d.label} <span aria-hidden className="text-dim">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-dim">
                Кратко на этом сайте:{' '}
                <a href={asset('privacy.html')} className="text-fog underline-offset-2 hover:text-acid hover:underline">
                  политика
                </a>{' '}
                ·{' '}
                <a href={asset('terms.html')} className="text-fog underline-offset-2 hover:text-acid hover:underline">
                  условия
                </a>
              </p>
            </div>

            <div className="rounded-card border border-line bg-panel p-6">
              <div className="font-mono text-xs text-dim uppercase tracking-[0.12em]">Реквизиты</div>
              <dl className="mt-4 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="text-dim">Организация</dt>
                <dd className="text-white">{ORG.short}</dd>
                <dt className="text-dim">ИНН / КПП</dt>
                <dd className="font-mono text-white">
                  {ORG.inn} / {ORG.kpp}
                </dd>
                <dt className="text-dim">ОГРН</dt>
                <dd className="font-mono text-white">{ORG.ogrn}</dd>
                <dt className="text-dim">Адрес</dt>
                <dd className="text-white">{ORG.address}</dd>
                <dt className="text-dim">Телефон</dt>
                <dd>
                  <a href={`tel:${ORG.phoneRaw}`} className="text-white hover:text-acid">
                    {ORG.phone}
                  </a>
                </dd>
                <dt className="text-dim">E-mail</dt>
                <dd>
                  <a href={`mailto:${ORG.email}`} className="text-white break-all hover:text-acid">
                    {ORG.email}
                  </a>
                </dd>
              </dl>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs text-dim">
            <div>
              EXIT 13 · {VENUE.address} · {VENUE.city} · {VENUE.door}
            </div>
            <div>© 2026 {ORG.short}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
