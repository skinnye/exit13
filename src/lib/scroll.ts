export function scrollToId(id: string) {
  const el = document.querySelector(id) as HTMLElement | null
  if (!el) return
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis
  if (lenis) lenis.scrollTo(el, { offset: -10 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
