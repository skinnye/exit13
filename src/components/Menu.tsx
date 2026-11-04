import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MENU, MENU_URL } from '../data'
import Reveal from './Reveal'

export default function Menu() {
  const [tab, setTab] = useState(0)
  const g = MENU[tab]

  return (
    <section id="menu" className="section relative">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="section-title">Меню бара и кухни</h2>
          </div>
          <a href={MENU_URL} target="_blank" rel="noreferrer" className="btn btn-outline">
            QR-меню целиком
          </a>
        </Reveal>

        <Reveal className="flex flex-wrap gap-2 mb-10">
          {MENU.map((m, i) => (
            <button
              key={m.group}
              onClick={() => setTab(i)}
              aria-pressed={i === tab}
              className={`chip transition-colors ${
 i === tab ? 'chip-acid' : 'chip-dark hover:text-text'
 }`}
            >
              {m.group}
            </button>
          ))}
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-2 gap-x-14 gap-y-10"
          >
            {g.subs.map((s) => (
              <div key={s.sub}>
                <h3 className="mb-2 border-b border-line pb-3 font-display text-base font-medium text-acid">
                  {s.sub}
                </h3>
                <div>
                  {s.items.map((it) => (
                    <div key={it.name} className="py-3 border-b border-line">
                      <div className="flex items-baseline gap-3">
                        <span className="text-white/90">{it.name}</span>
                        <span className="flex-1 border-b border-dotted border-white/15 translate-y-[-3px]" />
                        {it.vol && <span className="whitespace-nowrap text-sm text-white/40">{it.vol}</span>}
                        <span className="whitespace-nowrap font-semibold tabular-nums text-acid">{it.price} ₽</span>
                      </div>
                      {it.desc && <p className="mt-1 text-xs text-white/45 max-w-md">{it.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="mt-10 text-sm text-white/45">
          Меню с ценами — на exit13.space и в приложении EXIT 13.
        </p>
      </div>
    </section>
  )
}
