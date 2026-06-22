import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, VENUE } from '../data'
import { scrollToId } from '../lib/scroll'

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    scrollToId(href)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid ? 'bg-void/85 backdrop-blur-md border-b border-white/8 py-3' : 'py-5'
        }`}
      >
        <div className="container-x flex items-center justify-between">
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); go('#top') }}
            className="font-display font-black text-xl tracking-tight text-white"
          >
            EXIT<span className="text-acid">13</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => { e.preventDefault(); go(n.href) }}
                className="font-mono text-xs uppercase tracking-[0.18em] text-white/70 hover:text-acid transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={VENUE.tg} target="_blank" rel="noreferrer" className="hidden sm:inline-flex btn btn-acid !py-2.5 !px-5">
              Афиша в TG
            </a>
            <button
              className="md:hidden w-11 h-11 grid place-items-center border border-white/15 text-white"
              onClick={() => setOpen(true)}
              aria-label="Меню"
            >
              <span className="block w-5 space-y-1.5">
                <span className="block h-0.5 bg-white" />
                <span className="block h-0.5 bg-white" />
                <span className="block h-0.5 bg-acid" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-void md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="container-x flex items-center justify-between py-5">
              <span className="font-display font-black text-xl text-white">EXIT<span className="text-acid">13</span></span>
              <button className="w-11 h-11 grid place-items-center border border-white/15 text-white text-2xl" onClick={() => setOpen(false)} aria-label="Закрыть">×</button>
            </div>
            <nav className="container-x mt-6 flex flex-col">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => { e.preventDefault(); go(n.href) }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  className="font-display text-4xl py-3 border-b border-white/8 text-white"
                >
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <div className="container-x mt-8 flex flex-col gap-3">
              <a href={VENUE.tg} target="_blank" rel="noreferrer" className="btn btn-acid w-full">Афиша в Telegram</a>
              <a href={`tel:${VENUE.phoneRaw}`} className="btn btn-outline w-full">{VENUE.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
