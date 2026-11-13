// Besucherstatistik über Google Analytics 4, Vercel Web Analytics und Speed Insights. Alles startet erst, wenn im
// Cookie-Banner „Statistik“ erlaubt ist (lib/consent.ts), auch nachträglich über die Cookie-Einstellungen. Ohne
// Einwilligung wird das Google-Skript nicht einmal geladen. Wird die Einwilligung widerrufen, stoppt Google Analytics
// sofort und seine Cookies werden gelöscht. Eigene Ereignisse enthalten nie personenbezogene Daten (keine Formularinhalte).
import { inject, track as vercelTrack } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { hasConsent } from './consent'
import { LANG } from './i18n'

// Google Analytics 4: ein Datenstream für dasense.de und dasense.com (domainübergreifend über den Linker).
// Läuft nur auf den echten Domains, damit Vorschau- und Testseiten die Zahlen nicht verfälschen.
const GA_ID: string = import.meta.env.VITE_GA_ID ?? 'G-KMD0RVB508'
const GA_HOSTS = /(^|\.)dasense\.(de|com)$/i
const GA_DOMAINS = ['dasense.de', 'www.dasense.de', 'dasense.com', 'www.dasense.com']

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    [key: `ga-disable-${string}`]: boolean | undefined
  }
}

const gaAllowed = () => typeof window !== 'undefined' && GA_HOSTS.test(window.location.hostname)

// gtag.js erwartet das arguments-Objekt in der dataLayer, kein Array.
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  ;(window.dataLayer ??= []).push(arguments)
}

let gaLoaded = false
let gaOn = false

function clearGaCookies() {
  const parts = window.location.hostname.split('.')
  const domains = ['', window.location.hostname, '.' + window.location.hostname, '.' + parts.slice(-2).join('.')]
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (name !== '_ga' && !name.startsWith('_ga_') && name !== '_gid' && !name.startsWith('_gat')) continue
    for (const d of domains) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? '; domain=' + d : ''}`
  }
}

function startGa() {
  if (!gaAllowed() || gaOn) return
  gaOn = true
  window[`ga-disable-${GA_ID}`] = false
  if (gaLoaded) {
    gtag('consent', 'update', { analytics_storage: 'granted' })
    return
  }
  gaLoaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = gtag
  // Consent Mode v2: Standard ist „abgelehnt“, erst jetzt (mit Einwilligung) wird Statistik freigegeben.
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  gtag('js', new Date())
  gtag('consent', 'update', { analytics_storage: 'granted' })
  gtag('config', GA_ID, { linker: { domains: GA_DOMAINS } })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(s)
}

function stopGa() {
  if (!gaOn) return
  gaOn = false
  window[`ga-disable-${GA_ID}`] = true
  gtag('consent', 'update', { analytics_storage: 'denied' })
  clearGaCookies()
}

let started = false

function start() {
  if (started || !hasConsent('stats')) return
  started = true
  inject()
  injectSpeedInsights()
}

function sync() {
  if (hasConsent('stats')) {
    start()
    startGa()
  } else {
    stopGa()
  }
}

/** Ereignis zählen, nur mit Einwilligung. */
export function track(name: string, data?: Record<string, string | number | boolean>) {
  if (!hasConsent('stats')) return
  if (started) vercelTrack(name, { lang: LANG, ...data })
  if (gaOn) gtag('event', name, { lang: LANG, ...data })
}

export function initAnalytics() {
  if (typeof window === 'undefined') return
  sync()
  window.addEventListener('consent:changed', sync)
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
