import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PHOTOS } from '../data'
import { asset } from '../lib/asset'
import Reveal from './Reveal'

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => ((i ?? 0) + 1) % PHOTOS.length)
      if (e.key === 'ArrowLeft') setOpen((i) => ((i ?? 0) - 1 + PHOTOS.length) % PHOTOS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section id="gallery" className="section relative">
      <div className="container-x">
        <Reveal className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="mono-label mb-4">Интерьер</div>
            <h2 className="font-display text-4xl sm:text-6xl text-white">Внутри</h2>
          </div>
          <span className="hidden sm:block font-mono text-xs text-white/45">нажмите, чтобы открыть</span>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {PHOTOS.map((p, i) => (
            <Reveal
              key={p.src}
              delay={(i % 3) * 70}
              className={`group relative overflow-hidden ${i === 0 ? 'col-span-2 lg:col-span-2 row-span-2' : ''}`}
            >
              <button onClick={() => setOpen(i)} className="block w-full h-full">
                <img
                  src={asset(p.src)}
                  alt={p.alt}
                  loading="lazy"
                  className="w-full h-full object-cover aspect-[16/10] transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-acid/40 transition-colors" />
                <span className="absolute inset-0 bg-gradient-to-t from-void/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 font-mono text-xs text-white/40">Фото — из официального аккаунта клуба.</p>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[70] bg-void/96 backdrop-blur-sm grid place-items-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <button
              className="absolute top-5 right-5 w-12 h-12 grid place-items-center border border-white/15 text-white text-2xl"
              onClick={() => setOpen(null)} aria-label="Закрыть"
            >
              ×
            </button>
            <motion.figure
              key={open}
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl max-h-[82vh]" onClick={(e) => e.stopPropagation()}
            >
              <img src={asset(PHOTOS[open].src)} alt={PHOTOS[open].alt} className="max-h-[76vh] w-auto mx-auto" />
              <figcaption className="text-center mt-3 font-mono text-xs text-white/55">{PHOTOS[open].alt}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
