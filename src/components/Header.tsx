import { useEffect, useState } from 'react'
import { anchorProps, navigate } from '../lib/router'

const LINKS = [
  { href: '#funktionen', label: 'Funktionen' },
  { href: '#usp-h', label: 'Warum DaSense' },
  { href: '#praxis', label: 'Praxis' },
  { href: '#fuer-wen', label: 'Für wen' },
]

// Feststehende Navigation: Logo links, Abschnitte mittig, „Demo buchen“ rechts. Die Leiste wechselt auf hell auf
// dunkel, sobald sie über einem Abschnitt mit data-nav-dark liegt, und bekommt nach dem Scrollen eine Haarlinie.
// Auf einer Unterseite führen die Sprungmarken zurück zur Hauptseite (mit Transition) und dann zum Abschnitt.
const goHome = (hash: string) => (e: React.MouseEvent) => {
  if (window.location.pathname === '/') return
  e.preventDefault()
  navigate(`/${hash}`)
}

export function Header() {
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let raf = 0
    let lastY = window.scrollY
    const update = () => {
      raf = 0
      const y = window.scrollY
      setScrolled(y > 8)
      // Nach unten ausblenden, nach oben (oder ganz oben) wieder einblenden; kleine Bewegungen ignorieren.
      if (y < 80) setHidden(false)
      else if (y > lastY + 4) setHidden(true)
      else if (y < lastY - 4) setHidden(false)
      if (Math.abs(y - lastY) > 4) lastY = y
      const probe = 32 // Mitte der Leiste
      setDark(
        Array.from(document.querySelectorAll('[data-nav-dark]')).some((el) => {
          const r = el.getBoundingClientRect()
          return r.top <= probe && r.bottom > probe
        }),
      )
    }
    // Nachlauf: Abschnitte mit eigener Scroll-Logik (Vorhang) haben ihre Position dann schon aktualisiert.
    let trail = 0
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
      clearTimeout(trail)
      trail = window.setTimeout(update, 120)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      clearTimeout(trail)
    }
  }, [])

  const ink = dark ? 'text-white/70 hover:text-white' : 'text-body hover:text-ink'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 backdrop-blur-xl transition-[background-color,border-color,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-b ${
        hidden ? '-translate-y-full focus-within:translate-y-0' : 'translate-y-0'
      } ${
        dark ? 'bg-[#0b0a0e]/70' : 'bg-white/75'
      } ${scrolled ? (dark ? 'border-white/10' : 'border-line') : 'border-transparent'}`}
    >
      <nav
        aria-label="Hauptnavigation"
        className="box-border max-w-[1240px] 2xl:max-w-[1400px] mx-auto px-8 lg:px-12 h-16 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center"
      >
        <a {...anchorProps('#top')} aria-label="NorCom, zur Startseite" className="justify-self-start block no-underline">
          <img src="/images/norcom-logo.png" alt="NorCom" className="block h-8 w-auto" />
        </a>
        <ul className="hidden md:flex list-none m-0 p-0 items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={goHome(l.href)}
                className={`block px-3.5 py-2 rounded-full text-[0.875rem] font-medium no-underline transition-colors duration-200 ${ink}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#demo"
          onClick={goHome('#demo')}
          className={`justify-self-end inline-flex items-center h-10 px-5 rounded-full text-[0.875rem] font-semibold no-underline transition-colors duration-300 ${
            dark
              ? 'bg-white !text-ink hover:bg-white/85'
              : 'bg-primary !text-white hover:bg-primary-hover'
          }`}
        >
          Demo buchen
        </a>
      </nav>
    </header>
  )
}
