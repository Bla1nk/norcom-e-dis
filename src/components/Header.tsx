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
  const [menu, setMenu] = useState(false)

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

  // Mobiles Menü: Escape und Wechsel auf breite Ansicht schließen es
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    const mq = window.matchMedia('(min-width: 768px)')
    const onMq = () => mq.matches && setMenu(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [menu])

  const ink = dark ? 'text-white/70 hover:text-white' : 'text-body hover:text-ink'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 backdrop-blur-xl transition-[background-color,border-color,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-b ${
        hidden && !menu ? '-translate-y-full has-[:focus-visible]:translate-y-0' : 'translate-y-0'
      } ${
        menu ? 'bg-white' : dark ? 'bg-[#0b0a0e]/70' : 'bg-white/75'
      } ${scrolled ? (dark ? 'border-white/10' : 'border-line') : 'border-transparent'}`}
    >
      <nav
        aria-label="Hauptnavigation"
        className="box-border max-w-[1240px] 2xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 h-16 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center"
      >
        <a {...anchorProps('#top')} aria-label="NorCom, zur Startseite" className="justify-self-start block no-underline">
          <img src="/images/norcom-logo.png" alt="NorCom" className="block h-7 sm:h-8 w-auto" />
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
        <div className="justify-self-end flex items-center gap-2">
          <a
            href="#demo"
            onClick={goHome('#demo')}
            className={`inline-flex items-center h-10 px-4 sm:px-5 rounded-full text-[0.8125rem] sm:text-[0.875rem] whitespace-nowrap font-semibold no-underline transition-colors duration-300 ${
              dark
                ? 'bg-white !text-ink hover:bg-white/85'
                : 'bg-primary !text-white hover:bg-primary-hover'
            }`}
          >
            Demo buchen
          </a>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-controls="m1-menu"
            aria-label={menu ? 'Menü schließen' : 'Menü öffnen'}
            className={`md:hidden grid size-10 place-items-center rounded-full border-0 cursor-pointer transition-colors ${menu ? 'bg-ink text-white' : 'bg-transparent text-ink hover:bg-black/5'}`}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menu ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>
      <div id="m1-menu" className={`md:hidden grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${menu ? 'grid-rows-[1fr] border-t border-line' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <ul className="list-none m-0 px-5 pt-2 pb-5 flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-hairline last:border-b-0">
                <a
                  href={l.href}
                  onClick={(e) => {
                    goHome(l.href)(e)
                    setMenu(false)
                  }}
                  tabIndex={menu ? 0 : -1}
                  className="flex items-center justify-between min-h-[52px] text-[1.125rem] font-medium text-ink no-underline"
                >
                  {l.label}
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
