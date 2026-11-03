import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { CasePage } from './components/CasePage'
import { CookieBanner } from './components/CookieBanner'
import { LegalPage } from './components/LegalPage'
import { ReferenzenPage } from './components/ReferenzenPage'
import { Demo } from './components/Demo'
import { DemoNext } from './components/DemoNext'
import { Footer } from './components/Footer'
import { FuerWen } from './components/FuerWen'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { IntroIngest } from './components/IntroIngest'
import { IntroSystem } from './components/IntroSystem'
import { Steps } from './components/Steps'
import { TextReveal } from './components/TextReveal'
import { WordmarkCap } from './components/WordmarkCap'
import { Usps } from './components/Usps'
import { CASES } from './content/cases'
import { LEGAL } from './content/legal'
import { INTRO_PENDING, INTRO_VARIANT } from './lib/intro'
import { jumpTo, lockScroll, smoothScrollTo, unlockScroll } from './lib/lenis'
import { SmoothScroll } from './lib/SmoothScroll'

type AppProps = {
  /** Akzentfarbe (Logo und Rubrik-Labels). Optionen im Original: #601571, #1F3A68, #0F5C55. */
  accent?: string
}

type AccentStyle = CSSProperties & { '--color-accent': string }
type Curtain = { label: string; title: string; titleOn: boolean }

// Seitenwechsel in drei Takten: Eine schwarze Fläche zieht von unten über die Seite, auf ihr läuft die Überschrift
// des Ziels ein (dahinter wird die Seite getauscht), dann zieht sie nach oben weg und gibt die neue Seite frei.
const IN = 850
const HOLD = 1500 // Zeit zwischen Seitentausch und Wegziehen: Überschrift läuft ein und steht kurz
const OUT = 1000
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))
const frames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))

const slugOf = (path: string) => {
  const p = path.replace(/\/$/, '')
  if (p === '/referenzen') return 'referenzen'
  return [...CASES, ...LEGAL].find((c) => `/${c.slug}` === p)?.slug ?? null
}

const HASH_TITLES: Record<string, string> = {
  '#funktionen': 'Funktionen',
  '#usp-h': 'Warum DaSense',
  '#praxis': 'Praxis',
  '#fuer-wen': 'Zielgruppen',
  '#top': 'DaSense',
  '#demo': 'Demo buchen',
}

export default function App({ accent = '#601571' }: AppProps) {
  const style: AccentStyle = { '--color-accent': accent }
  const [slug, setSlug] = useState<string | null>(() => slugOf(window.location.pathname))
  const [curtain, setCurtain] = useState<Curtain | null>(null)
  const [entering, setEntering] = useState(false)
  const [intro, setIntro] = useState(INTRO_PENDING)
  const curtainRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const slugRef = useRef(slug)
  slugRef.current = slug
  const savedY = useRef(0) // Scrollposition der Hauptseite beim Verlassen

  const run = useCallback(async (target: string | null, hash: string) => {
    busy.current = true
    const from = slugRef.current
    const item = CASES.find((c) => c.slug === target)
    const legal = LEGAL.find((c) => c.slug === target)
    const refs = target === 'referenzen'
    const label = item ? `${String(CASES.indexOf(item) + 1).padStart(2, '0')} · Für wen` : legal ? legal.eyebrow : refs ? 'NorCom' : 'Zurück zu'
    const title = item ? item.title : legal ? legal.title : refs ? 'Referenzen' : (HASH_TITLES[hash] ?? 'Zielgruppen')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const swap = () => {
      flushSync(() => {
        if (target && !from) savedY.current = window.scrollY // nur beim Verlassen der Hauptseite merken
        setSlug(target)
        setEntering(!!target)
      })
      jumpTo(target ? 0 : savedY.current)
      window.dispatchEvent(new Event('resize'))
    }

    if (reduce) {
      swap()
      busy.current = false
      return
    }

    lockScroll()
    flushSync(() => setCurtain({ label, title, titleOn: false }))
    await frames()
    const el = curtainRef.current
    if (!el) {
      swap()
      unlockScroll()
      busy.current = false
      return
    }
    await el.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: IN, easing: EASE, fill: 'forwards' }).finished
    swap()
    setCurtain((c) => c && { ...c, titleOn: true })
    // Abschnitte setzen ihre Höhen erst nach dem Resize neu: Position unter dem Vorhang mehrmals nachziehen.
    // Beim Zurückgehen mit Sprungmarke wird stattdessen der Abschnitt angesprungen.
    const anchor = !target && hash ? hash : ''
    const place = () => {
      const t = anchor && anchor !== '#top' ? document.querySelector(anchor) : null
      jumpTo(anchor === '#top' ? 0 : t ? t.getBoundingClientRect().top + window.scrollY : target ? 0 : savedY.current)
    }
    for (const wait of [120, 250, 400]) {
      await sleep(wait)
      place()
    }
    await sleep(HOLD - 770)
    await el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { duration: OUT, easing: EASE, fill: 'forwards' }).finished
    setCurtain(null)
    setEntering(false)
    unlockScroll()
    busy.current = false
  }, [])

  const go = useCallback(
    (to: string, push = true) => {
      if (busy.current) return
      const url = new URL(to, window.location.origin)
      const target = slugOf(url.pathname)
      if (push && (url.pathname !== window.location.pathname || url.hash !== window.location.hash)) {
        window.history.pushState({}, '', url.pathname + url.hash)
      }
      if (target === slugRef.current) {
        if (!target && url.hash === '#top') {
          smoothScrollTo(0, 1.4)
          return
        }
        const el = !target && url.hash ? document.querySelector(url.hash) : null
        if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY, 1.4)
        return
      }
      void run(target, url.hash)
    },
    [run],
  )

  useEffect(() => {
    const onNav = (e: Event) => go((e as CustomEvent<string>).detail)
    const onPop = () => go(window.location.pathname + window.location.hash, false)
    window.addEventListener('app:navigate', onNav)
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('app:navigate', onNav)
      window.removeEventListener('popstate', onPop)
    }
  }, [go])

  const item = CASES.find((c) => c.slug === slug) ?? null
  const legalDoc = LEGAL.find((c) => c.slug === slug) ?? null
  const refPage = slug === 'referenzen'
  const page = item ?? legalDoc ?? (refPage ? true : null)

  return (
    <SmoothScroll>
      <div className="relative font-sans text-ink bg-white leading-[1.55] text-[1.0625rem]" style={style}>
        <Header />
        {/* Beide Seiten bleiben eingehängt, damit die Scrollposition der Hauptseite erhalten bleibt */}
        <div style={page ? { display: 'none' } : undefined} aria-hidden={!!page || undefined} inert={!!page || undefined}>
          {/* Gesamter Inhalt in einem Stapelkontext über dem festen Footer, sonst scheint der Footer durch */}
          <div className="relative z-10">
            <div className="bg-white">
              <Hero />
              <Steps />
              <Usps />
            </div>
            {/* Folgt dem dunklen Abschnitt; liegt ebenfalls über dem stehenbleibenden „So funktioniert es“.
                Unten Abstand in Footerhöhe: Der Footer liegt fest dahinter und wird freigelegt. */}
            <div className="relative z-10 bg-white rounded-b-[2.5rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]" style={{ marginBottom: 'var(--foot)' }}>
              <FuerWen />
              <Demo />
              <DemoNext />
              <WordmarkCap />
            </div>
          </div>
          <Footer />
        </div>
        {item && <CasePage item={item} startDelay={entering ? HOLD + 150 : 150} />}
        {refPage && <ReferenzenPage startDelay={entering ? HOLD + 150 : 150} />}
        {legalDoc && <LegalPage doc={legalDoc} startDelay={entering ? HOLD + 150 : 150} />}

        {!intro && <CookieBanner />}
        {intro && ((INTRO_VARIANT === 'a' || (INTRO_VARIANT === 'i' && window.innerWidth < 768)) ? <Intro onDone={() => setIntro(false)} /> : INTRO_VARIANT === 'c' ? <IntroSystem onDone={() => setIntro(false)} /> : <IntroIngest onDone={() => setIntro(false)} />)}

        {curtain && (
          <div
            ref={curtainRef}
            aria-hidden="true"
            className="fixed inset-0 z-[60] flex items-end bg-[#0b0a0e] text-white"
            style={{ transform: 'translateY(100%)' }}
          >
            <div className="box-border w-full max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pb-[14vh]">
              <div className="text-[0.8125rem] font-medium tracking-[0.12em] uppercase text-white/60 h-5 overflow-hidden">
                {curtain.titleOn && <TextReveal text={curtain.label} immediate delay={0} />}
              </div>
              <div className="mt-4 min-h-[1.1em] text-[8.4vw] md:text-[clamp(3rem,9.5vw,9rem)] leading-[1.06] tracking-[-0.045em] font-bold">
                {curtain.titleOn && <TextReveal text={curtain.title} immediate delay={120} stagger={90} className="block" />}
              </div>
            </div>
          </div>
        )}
      </div>
    </SmoothScroll>
  )
}
