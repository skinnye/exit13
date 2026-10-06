import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, VENUE } from '../data'
import { scrollToId } from '../lib/scroll'
import { asset } from '../lib/asset'

const LOGO = asset('img/logo.png')

function Logo({ className }: { className: string }) {
  return <img src={LOGO} alt="EXIT 13" width={1400} height={294} draggable={false} className={`block w-auto select-none ${className}`} />
}

export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    scrollToId(href)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding] duration-300 ${
          solid ? 'border-line bg-ink/90 py-3 backdrop-blur-md' : 'border-transparent py-5'
        }`}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); go('#top') }}
            className="shrink-0 rounded-sm"
          >
            <Logo className="h-[22px] sm:h-6" />
          </a>

          <nav className="hidden items-center gap-5 md:flex lg:gap-8" aria-label="Разделы">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => { e.preventDefault(); go(n.href) }}
                className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-fog transition-colors hover:text-acid"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={VENUE.tg} target="_blank" rel="noreferrer" className="btn btn-acid btn-sm hidden sm:inline-flex">
              Афиша в TG
            </a>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-outline bg-panel2/80 text-text md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Меню"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="block w-[18px] space-y-[5px]" aria-hidden>
                <span className="block h-0.5 rounded-full bg-text" />
                <span className="block h-0.5 rounded-full bg-text" />
                <span className="block h-0.5 w-3/5 rounded-full bg-acid" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="fixed inset-0 z-[60] overflow-y-auto bg-void md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="container-x flex items-center justify-between py-5">
              <Logo className="h-[22px]" />
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-outline bg-panel2 text-text"
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
                autoFocus
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="container-x mt-4 flex flex-col" aria-label="Разделы">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => { e.preventDefault(); go(n.href) }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  className="flex items-center justify-between border-b border-line py-4 font-display text-4xl font-bold uppercase text-text transition-colors active:text-acid"
                >
                  {n.label}
                  <span className="font-mono text-xs font-medium text-dim" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.a>
              ))}
            </nav>
            <div className="container-x mt-8 flex flex-col gap-3 pb-10">
              <a href={VENUE.tg} target="_blank" rel="noreferrer" className="btn btn-acid w-full">Афиша в Telegram</a>
              <a href={`tel:${VENUE.phoneRaw}`} className="btn btn-outline w-full">{VENUE.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
