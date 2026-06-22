import Marquee from './Marquee'
import { VENUE } from '../data'

export default function Footer() {
  return (
    <footer id="contacts" className="relative">
      <div className="border-y border-white/10 py-4 font-display font-black text-acid text-2xl sm:text-4xl">
        <Marquee items={['УВИДИМСЯ В ТРИНАДЦАТОМ', 'EXIT 13', '8 МАРТА 13', 'ЕКАТЕРИНБУРГ']} sep={<span className="text-white/30 px-2">✳</span>} />
      </div>

      <div className="section">
        <div className="container-x">
          <h2 className="font-display font-black text-white text-[clamp(2.5rem,9vw,7rem)] leading-[0.85]">
            ЖДЁМ
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1px #ccff00' }}>НА ТАНЦПОЛЕ</span>
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 border border-white/8">
            {[
              { l: 'Telegram', v: '@exit13_ekb', href: VENUE.tg },
              { l: 'ВКонтакте', v: 'vk.com/exit13_ekb', href: VENUE.vk },
              { l: 'Instagram', v: '@exit13_ekb', href: VENUE.ig },
              { l: 'Телефон', v: VENUE.phone, href: `tel:${VENUE.phoneRaw}` },
            ].map((c) => (
              <a
                key={c.l}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="bg-void p-6 hover:bg-panel transition-colors group"
              >
                <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-3">{c.l}</div>
                <div className="font-display text-lg text-white group-hover:text-acid transition-colors break-words">{c.v}</div>
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs text-white/40">
            <div>EXIT 13 · {VENUE.address} · {VENUE.city} · {VENUE.door}</div>
            <div>© 2026 · концепт-сайт</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
