import { useEffect } from 'react'
import Lenis from 'lenis'
import Header from './components/Header'
import Hero from './components/Hero'
import Bar from './components/Bar'
import Menu from './components/Menu'
import Hookah from './components/Hookah'
import ClubCard from './components/ClubCard'
import AppSection from './components/AppSection'
import Gallery from './components/Gallery'
import Events from './components/Events'
import ScrollProgress from './components/ScrollProgress'
import Residents from './components/Residents'
import Info from './components/Info'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])

  return (
    <div className="grain">
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Bar />
        <Menu />
        <Hookah />
        <ClubCard />
        <AppSection />
        <Gallery />
        <Events />
        <Residents />
        <Info />
      </main>
      <Footer />
    </div>
  )
}
