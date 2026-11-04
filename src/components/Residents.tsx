import Marquee from './Marquee'
import { RESIDENTS } from '../data'

const half = Math.ceil(RESIDENTS.length / 2)
const rowA = RESIDENTS.slice(0, half)
const rowB = RESIDENTS.slice(half)

export default function Residents() {
  return (
    <section id="residents" className="section relative overflow-hidden">
      <div className="container-x mb-10">
        <div className="max-w-3xl">
          <h2 className="section-title">Кто играет в тринадцатом</h2>
          <p className="mt-5 max-w-2xl text-lg text-white/65">
            Локальные резиденты Екатеринбурга и приглашённые артисты московского андеграунда.
          </p>
        </div>
      </div>

      <div className="flex select-none flex-col gap-2">
        <div className="border-y border-line py-1 font-display text-[clamp(2rem,7vw,5.5rem)] font-black leading-none text-white">
          <Marquee items={rowA} sep={<span className="px-2 text-acid">/</span>} />
        </div>
        <div
          className="border-b border-line py-1 font-display text-[clamp(2rem,7vw,5.5rem)] font-black leading-none text-transparent"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.35)' }}
        >
          <Marquee items={rowB} reverse sep={<span className="px-2 text-acid">/</span>} />
        </div>
      </div>
    </section>
  )
}
