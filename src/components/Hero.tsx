import { useEffect, useRef, type CSSProperties } from 'react'
import Marquee from './Marquee'
import { GENRES } from '../data'
import { scrollToId } from '../lib/scroll'
import { asset } from '../lib/asset'

// Первый экран — неоновая вывеска, как на exit13.space: золотой ореол логотипа, дышащее
// пятно света и виньетка (стили — .neon-logo/.hero-* в index.css) поверх
// приглушённого видео танцпола клуба (ролик из Telegram-канала клуба, без звука).
// prefers-reduced-motion — видео не запускаем, остаётся кадр-постер.
export default function Hero() {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = video.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    v.muted = true // iOS запускает автоплей только без звука
    v.play().catch(() => {
      // автоплей запрещён (режим энергосбережения) — остаётся постер
    })
  }, [])

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <video
        ref={video}
        aria-hidden
        tabIndex={-1}
        muted
        loop
        playsInline
        preload="auto"
        poster={asset('video/dance.jpg')}
        className="absolute inset-0 h-full w-full object-cover opacity-80 [filter:blur(1px)_saturate(0.9)]"
      >
        <source src={asset('video/dance.mp4')} type="video/mp4" />
      </video>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/35 to-void" />
      <div aria-hidden className="hero-light" />
      <div aria-hidden className="hero-vignette" />

      <div className="container-x relative flex flex-1 flex-col items-center justify-center pb-12 pt-28 text-center sm:pb-16">
        <h1>
          {/* глитч при наведении — как в main: голубая и розовая копии логотипа со сдвигом */}
          <span
            className="glitch-logo mx-auto w-[min(88vw,44rem)]"
            style={{ '--logo': `url(${asset('img/logo.png')})` } as CSSProperties}
          >
            <img
              src={asset('img/logo.png')}
              alt=""
              width={1400}
              height={294}
              fetchPriority="high"
              draggable={false}
              className="neon-logo block h-auto w-full select-none"
            />
          </span>
          <span className="sr-only">EXIT 13 — клуб-бар в Екатеринбурге</span>
        </h1>

        <p className="mt-10 max-w-xl text-balance text-lg text-fog sm:mt-12 sm:text-xl">
          Клуб-бар в центре Екатеринбурга, на 8 Марта, 13. Вход строго с 21 года.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn btn-acid" onClick={() => scrollToId('#afisha')}>
            Смотреть афишу
          </button>
          <button type="button" className="btn btn-outline" onClick={() => scrollToId('#booking')}>
            Забронировать стол
          </button>
        </div>
      </div>

      <div className="relative border-y border-line bg-ink/70 py-3.5 font-display text-lg font-bold text-text/85 backdrop-blur-sm sm:text-2xl">
        <Marquee items={GENRES} />
      </div>
    </section>
  )
}
