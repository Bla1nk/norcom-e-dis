import { t } from '../lib/i18n'
import { useEffect, useState } from 'react'
import { linkProps } from '../lib/router'
import { readConsent, saveConsent } from '../lib/consent'

const CATEGORIES = [
  { id: 'necessary', title: t('Notwendig', 'Necessary'), text: t('Damit die Seite funktioniert, zum Beispiel für Ihre Auswahl hier.', 'Required for the site to work, for example to remember your choice here.') },
  { id: 'stats', title: t('Statistik', 'Statistics'), text: t('Hilft uns zu verstehen, welche Inhalte genutzt werden.', 'Helps us understand which content is used.') },
  { id: 'external', title: t('Externe Inhalte', 'External content'), text: t('Eingebundene Videos und Karten von Drittanbietern.', 'Embedded videos and maps from third-party providers.') },
] as const

// Cookie-Hinweis unten links: ruhig, abgerundet, mit drei Wegen (nur Notwendige, alle, eigene Auswahl).
// Ohne Klick bleibt alles außer „Notwendig“ aus. Die Auswahl speichert lib/consent.ts.
export function CookieBanner() {
  const [shown, setShown] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [details, setDetails] = useState(false)
  const [stats, setStats] = useState(false)
  const [external, setExternal] = useState(false)

  useEffect(() => {
    const existing = readConsent()
    if (existing) {
      setStats(existing.stats)
      setExternal(existing.external)
    } else {
      const timer = window.setTimeout(() => setShown(true), 1400)
      return () => window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const open = () => {
      const c = readConsent()
      setStats(c?.stats ?? false)
      setExternal(c?.external ?? false)
      setDetails(true)
      setLeaving(false)
      setShown(true)
    }
    window.addEventListener('consent:open', open)
    return () => window.removeEventListener('consent:open', open)
  }, [])

  const close = (s: boolean, e: boolean) => {
    saveConsent({ stats: s, external: e })
    setStats(s)
    setExternal(e)
    setLeaving(true)
    window.setTimeout(() => {
      setShown(false)
      setLeaving(false)
      setDetails(false)
    }, 350)
  }

  if (!shown) return null

  const on = (id: string) => (id === 'necessary' ? true : id === 'stats' ? stats : external)
  const flip = (id: string) => (id === 'stats' ? setStats((v) => !v) : id === 'external' ? setExternal((v) => !v) : undefined)

  return (
    <div
      role="dialog"
      aria-label={t('Cookie-Einstellungen', 'Cookie settings')}
      className={`fixed z-50 box-border inset-x-3 bottom-3 sm:inset-x-auto sm:left-4 sm:bottom-4 sm:w-[min(23.5rem,calc(100vw_-_2rem))] max-h-[calc(100svh_-_1.5rem)] overflow-y-auto rounded-[22px] bg-white/95 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_24px_70px_-24px_rgba(30,10,40,0.45)] p-5 text-ink text-[0.875rem] leading-[1.55] ${leaving ? 'cookie-out' : 'cookie-in'}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-primary-tint text-primary flex-none">
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 4 4 0 0 1-4-4 1 1 0 0 0-1-1z" />
            <path d="M8.5 11.5h.01M12 16h.01M15.5 13.5h.01" />
          </svg>
        </span>
        <h2 className="m-0 text-[1rem] font-semibold tracking-[-0.01em]">{t('Ihre Privatsphäre', 'Your privacy')}</h2>
      </div>
      <p className="m-0 mt-3 text-body">
        {t('Wir nutzen notwendige Cookies, damit die Seite läuft. Mit Ihrer Einwilligung ergänzen wir Statistik und externe Inhalte. Mehr dazu in der', 'We use necessary cookies to keep the site running. With your consent, we add statistics and external content. Learn more in our')}{' '}
        <a {...linkProps('/datenschutzerklaerung')} className="text-primary underline underline-offset-2">{t('Datenschutzerklärung', 'Privacy Policy')}</a>.
      </p>

      <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${details ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <ul className="list-none m-0 mt-4 p-0 flex flex-col gap-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.id} className="flex items-start gap-3 rounded-2xl bg-mist px-3.5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-[0.8125rem] text-muted leading-[1.45]">{c.text}</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on(c.id)}
                  aria-label={c.title}
                  disabled={c.id === 'necessary'}
                  onClick={() => flip(c.id)}
                  className={`relative mt-0.5 h-6 w-10 flex-none rounded-full border-0 p-0 transition-colors duration-300 ${on(c.id) ? 'bg-primary' : 'bg-[#d9d0dd]'} ${c.id === 'necessary' ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
                >
                  <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-300 ${on(c.id) ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {details ? (
          <button type="button" onClick={() => close(stats, external)} className="flex-1 h-10 rounded-full border-0 bg-ink px-4 text-white font-semibold [font:inherit] cursor-pointer transition-colors hover:bg-primary-deep">
            {t('Auswahl speichern', 'Save selection')}
          </button>
        ) : (
          <>
            <button type="button" onClick={() => close(false, false)} className="flex-1 h-10 rounded-full border border-ink/20 bg-white px-4 text-ink font-medium [font:inherit] cursor-pointer transition-colors hover:border-ink">
              {t('Nur notwendige', 'Necessary only')}
            </button>
            <button type="button" onClick={() => close(true, true)} className="flex-1 h-10 rounded-full border-0 bg-ink px-4 text-white font-semibold [font:inherit] cursor-pointer transition-colors hover:bg-primary-deep">
              {t('Alle akzeptieren', 'Accept all')}
            </button>
          </>
        )}
      </div>
      <button type="button" onClick={() => setDetails((v) => !v)} aria-expanded={details} className="mt-3 block mx-auto bg-transparent border-0 p-0 text-[0.8125rem] text-muted underline underline-offset-2 cursor-pointer hover:text-ink [font:inherit]">
        {details ? t('Weniger anzeigen', 'Show less') : t('Einstellungen', 'Settings')}
      </button>
    </div>
  )
}
