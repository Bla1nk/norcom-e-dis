import type { CSSProperties } from 'react'
import { Architektur } from './components/Architektur'
import { Demo } from './components/Demo'
import { Footer } from './components/Footer'
import { FuerWen } from './components/FuerWen'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Praxis } from './components/Praxis'
import { Steps } from './components/Steps'
import { Usps } from './components/Usps'
import { SmoothScroll } from './lib/SmoothScroll'

type AppProps = {
  /** Akzentfarbe (Logo und Rubrik-Labels). Optionen im Original: #601571, #1F3A68, #0F5C55. */
  accent?: string
}

type AccentStyle = CSSProperties & { '--color-accent': string }

export default function App({ accent = '#601571' }: AppProps) {
  const style: AccentStyle = { '--color-accent': accent }
  return (
    <SmoothScroll>
      <div className="relative font-sans text-ink bg-white leading-[1.55] text-[1.0625rem]" style={style}>
        <Header />
        <Hero />
        <Steps />
        <Usps />
        <Praxis />
        <Architektur />
        <FuerWen />
        <Demo />
        <Footer />
      </div>
    </SmoothScroll>
  )
}
