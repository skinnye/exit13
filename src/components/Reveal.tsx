import { useEffect, useRef, type ReactNode, type Ref } from 'react'

type Props = { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'section' | 'li' | 'article' }

export default function Reveal({ children, className = '', delay = 0, as = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.transitionDelay = `${delay}ms`
            el.classList.add('is-visible')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  const Tag = as as 'div'
  return (
    <Tag ref={ref as Ref<HTMLDivElement>} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
