import type { ReactNode } from 'react'
import { VENUE } from '../data'
import { asset } from '../lib/asset'

// Плейсхолдер — данные, которые заполняет клуб (юрлицо, почта поддержки и т.п.)
export function Fill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[2px] border-b border-dashed border-acid/50 bg-acid/5 px-1 text-acid/85">
      {children}
    </span>
  )
}

export type LegalSection = { h: string; p: ReactNode[] }

// Единый макет юридической страницы (политика / соглашение) в стиле сайта.
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string
  updated: string
  intro: ReactNode
  sections: LegalSection[]
}) {
  return (
    <div className="grain min-h-screen">
      <header className="border-b border-white/8">
        <div className="container-x flex items-center justify-between py-5">
          <a href={asset('/')} className="font-display text-xl font-black tracking-tight text-white">
            EXIT<span className="text-acid">13</span>
          </a>
          <div className="flex items-center gap-5">
            <a href={asset('privacy.html')} className="font-mono text-xs uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-acid">
              Политика
            </a>
            <a href={asset('terms.html')} className="font-mono text-xs uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-acid">
              Соглашение
            </a>
            <a href={asset('/')} className="font-mono text-xs uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-acid">
              ← на сайт
            </a>
          </div>
        </div>
      </header>

      <main className="container-x py-14 sm:py-20">
        <div className="max-w-3xl">
          <div className="mono-label mb-3">Действует с {updated}</div>
          <h1 className="font-display text-3xl leading-[1.02] text-white sm:text-5xl">{title}</h1>
          <div className="mt-5 text-white/70">{intro}</div>

          <div className="mt-10 space-y-8">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="font-display text-xl text-acid">
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
        </div>
      </main>

      <footer className="border-t border-white/8">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-8 sm:flex-row sm:items-center">
          <span className="font-display text-lg font-black text-white">
            EXIT<span className="text-acid">13</span>
          </span>
          <span className="font-mono text-xs text-white/40">
            {VENUE.city} · {VENUE.address} · 21+
          </span>
        </div>
      </footer>
    </div>
  )
}
