import type { ReactNode } from 'react'

type Props = { items: string[]; reverse?: boolean; className?: string; sep?: ReactNode }

export default function Marquee({ items, reverse = false, className = '', sep }: Props) {
  const seq = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`marquee-track ${reverse ? 'rev' : ''}`}>
        {seq.map((it, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="px-5">{it}</span>
            <span className="text-acid/60">{sep ?? '✳'}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
