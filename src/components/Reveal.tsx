import type { ReactNode } from 'react'

type Props = { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'section' | 'li' | 'article' }

// Раньше — появление при прокрутке у каждого блока. Убрано: страница не «въезжает»
// по кускам, контент виден сразу. Обёртка оставлена, чтобы не перекраивать разметку.
export default function Reveal({ children, className = '', as = 'div' }: Props) {
  const Tag = as
  return <Tag className={className || undefined}>{children}</Tag>
}
