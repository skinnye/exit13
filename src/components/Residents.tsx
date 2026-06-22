import Marquee from './Marquee'
import Reveal from './Reveal'
import { RESIDENTS } from '../data'

const half = Math.ceil(RESIDENTS.length / 2)
const rowA = RESIDENTS.slice(0, half)
const rowB = RESIDENTS.slice(half)

export default function Residents() {
  return (
    <section id="residents" className="section relative overflow-hidden">
      <div className="container-x mb-10">
        <Reveal className="max-w-3xl">
          <div className="mono-label mb-4">Резиденты и гости</div>
          <h2 className="font-display text-4xl sm:text-6xl text-white">
            Те, кто играет <span className="text-acid">в тринадцатом</span>
          </h2>
          <p className="mt-5 text-lg text-white/65 max-w-2xl">
            Локальные резиденты Екатеринбурга и приглашённые артисты московского андеграунда —
            от гипнотик-техно до broken и electro.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col gap-2 select-none">
        <div className="font-display font-black text-[clamp(2rem,7vw,5.5rem)] text-white leading-none py-1 border-y border-white/10">
          <Marquee items={rowA} sep={<span className="text-acid px-2">/</span>} />
        </div>
        <div className="font-display font-black text-[clamp(2rem,7vw,5.5rem)] text-transparent leading-none py-1 border-b border-white/10"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.35)' }}>
          <Marquee items={rowB} reverse sep={<span className="text-acid px-2">/</span>} />
        </div>
      </div>
    </section>
  )
}
