import type { ReactNode } from 'react'
import { DOC_LINKS, ORG, VENUE } from '../data'
import { asset } from '../lib/asset'

export type LegalSection = { h: string; p: ReactNode[] }

// Логотип-вордмарк EXIT 13 со ссылкой на главную.
export function LogoLink({ className = 'h-5' }: { className?: string }) {
  return (
    <a href={asset('/')} className="inline-flex items-center" aria-label="EXIT 13 — на главную">
      <img src={asset('img/logo.png')} alt="EXIT 13" width={1400} height={294} className={`${className} w-auto`} />
    </a>
  )
}

// Реквизиты организации (как на app.exit13.space/legal/contacts).
export function OrgRequisites({ bank = false }: { bank?: boolean }) {
  const rows: Array<[string, ReactNode]> = [
    ['Организация', `${ORG.full} (${ORG.short})`],
    ['ИНН / КПП', <span className="font-mono">{`${ORG.inn} / ${ORG.kpp}`}</span>],
    ['ОГРН', <span className="font-mono">{ORG.ogrn}</span>],
    ['Адрес', ORG.address],
    ['Генеральный директор', ORG.ceo],
    [
      'Телефон',
      <a href={`tel:${ORG.phoneRaw}`} className="hover:text-acid">
        {ORG.phone}
      </a>,
    ],
    [
      'E-mail',
      <a href={`mailto:${ORG.email}`} className="break-all hover:text-acid">
        {ORG.email}
      </a>,
    ],
  ]
  if (bank) {
    rows.push(
      ['Расчётный счёт', <span className="font-mono">{ORG.bank.account}</span>],
      ['Банк', ORG.bank.name],
      ['Корр. счёт', <span className="font-mono">{ORG.bank.corr}</span>],
      ['БИК', <span className="font-mono">{ORG.bank.bik}</span>],
    )
  }
  return (
    <dl className="overflow-hidden rounded-card border border-line">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="flex flex-col gap-1 border-b border-line bg-panel px-5 py-3.5 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6"
        >
          <dt className="w-full shrink-0 font-mono text-xs uppercase tracking-[0.1em] text-dim sm:w-56">{k}</dt>
          <dd className="text-sm text-white">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

// Подвал юридических страниц и одностраничника: реквизиты одной строкой + документы.
export function LegalFooter() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-5 py-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <LogoLink className="h-4" />
          <span className="font-mono text-xs text-dim">
            {VENUE.city} · {VENUE.address} · 21+
          </span>
        </div>
        <p className="font-mono text-xs leading-relaxed text-dim">
          {ORG.short} · ИНН {ORG.inn} · ОГРН {ORG.ogrn} · {ORG.address} · {ORG.phone} · {ORG.email}
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs" aria-label="Документы">
          {DOC_LINKS.map((d) => (
            <a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="text-fog hover:text-acid">
              {d.label} ↗
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

// Краткая юридическая страница: пересказ + ссылка на официальный текст на сайте клуба,
// чтобы не держать два расходящихся юридических документа.
export function LegalPage({
  title,
  updated,
  intro,
  canonical,
  sections,
}: {
  title: string
  updated: string
  intro: ReactNode
  canonical: { label: string; href: string }
  sections: LegalSection[]
}) {
  return (
    <div className="grain min-h-screen">
      <header className="border-b border-line">
        <div className="container-x flex items-center justify-between gap-4 py-5">
          <LogoLink />
          <nav className="flex items-center gap-4 sm:gap-5">
            <a href={asset('privacy.html')} className="font-mono text-xs uppercase tracking-[0.1em] text-fog transition-colors hover:text-acid">
              Политика
            </a>
            <a href={asset('terms.html')} className="font-mono text-xs uppercase tracking-[0.1em] text-fog transition-colors hover:text-acid">
              Условия
            </a>
            <a href={asset('/')} className="hidden font-mono text-xs uppercase tracking-[0.1em] text-fog transition-colors hover:text-acid sm:inline">
              ← на сайт
            </a>
          </nav>
        </div>
      </header>

      <main className="container-x py-14 sm:py-20">
        <div className="max-w-3xl">
          <div className="mono-label mb-3">Кратко · сверено {updated}</div>
          <h1 className="font-display text-3xl uppercase leading-[1.02] text-white sm:text-5xl">{title}</h1>
          <div className="mt-5 text-white/70">{intro}</div>

          <div className="mt-8 flex flex-col gap-4 rounded-card border border-acid/40 bg-acid-dim p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="text-sm text-text">
              Здесь — краткий пересказ. Юридическую силу имеет официальный текст:{' '}
              <span className="text-acid">{canonical.label}</span> на сайте клуба.
            </p>
            <a href={canonical.href} target="_blank" rel="noreferrer" className="btn btn-acid btn-sm shrink-0 self-start sm:self-auto">
              Открыть ↗
            </a>
          </div>

          <div className="mt-10 space-y-8">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="font-display text-xl uppercase text-acid">
                  {i + 1}. {s.h}
                </h2>
                <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-white/75">
                  {s.p.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12">
            <h2 className="font-display text-xl uppercase text-white">Реквизиты</h2>
            <div className="mt-4">
              <OrgRequisites />
            </div>
          </section>
        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
