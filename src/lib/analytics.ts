// Besucherstatistik über Vercel Web Analytics und Speed Insights. Beides startet erst, wenn im Cookie-Banner
// „Statistik“ erlaubt ist (lib/consent.ts), auch nachträglich über die Cookie-Einstellungen. Eigene Ereignisse
// enthalten nie personenbezogene Daten (keine Formularinhalte).
import { inject, track as vercelTrack } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { hasConsent } from './consent'
import { LANG } from './i18n'

let started = false

function start() {
  if (started || !hasConsent('stats')) return
  started = true
  inject()
  injectSpeedInsights()
}

/** Ereignis zählen, nur mit Einwilligung. */
export function track(name: string, data?: Record<string, string | number | boolean>) {
  if (!started || !hasConsent('stats')) return
  vercelTrack(name, { lang: LANG, ...data })
}

export function initAnalytics() {
  if (typeof window === 'undefined') return
  start()
  window.addEventListener('consent:changed', start)
  // Klicks auf „Demo buchen“ und andere Sprungmarken zum Formular, von wo aus sie kommen
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="#demo"]')
      if (a) track('demo_cta_click', { path: window.location.pathname })
    },
    true,
  )
}
