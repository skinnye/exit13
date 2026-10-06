import type { ReactNode } from 'react'

type Props = { items: string[]; reverse?: boolean; className?: string; sep?: ReactNode }

// Разделитель по умолчанию — золотая точка (дизайн v2, без неона).
const DOT = <span className="inline-block h-1.5 w-1.5 rounded-full bg-acid align-middle" />

export default function Marquee({ items, reverse = false, className = '', sep }: Props) {
  const seq = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`marquee-track ${reverse ? 'rev' : ''}`}>
        {seq.map((it, i) => (
          // вторая копия нужна только для бесшовной прокрутки — скринридерам её не читаем
          <span key={i} className="inline-flex items-center" aria-hidden={i >= items.length || undefined}>
            <span className="px-5">{it}</span>
            <span className="text-acid" aria-hidden>
              {sep ?? DOT}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
