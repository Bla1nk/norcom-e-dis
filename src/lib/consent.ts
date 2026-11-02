// Einwilligung zu Cookies: wird im Browser gespeichert (localStorage). Andere Teile der Seite fragen mit hasConsent() ab,
// bevor sie Statistik oder externe Inhalte laden. Notwendige Cookies brauchen keine Einwilligung.

export type ConsentCategory = 'stats' | 'external'
export type Consent = { stats: boolean; external: boolean; savedAt: number }

const KEY = 'dasense-cookie-consent-v1'

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const c = JSON.parse(raw) as Consent
    return typeof c.stats === 'boolean' && typeof c.external === 'boolean' ? c : null
  } catch {
    return null
  }
}

export function saveConsent(c: Omit<Consent, 'savedAt'>) {
  const full: Consent = { ...c, savedAt: Date.now() }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(full))
  } catch {
    /* Speichern nicht möglich: Auswahl gilt nur für diese Sitzung */
  }
  window.dispatchEvent(new CustomEvent('consent:changed', { detail: full }))
}

export function hasConsent(cat: ConsentCategory): boolean {
  return readConsent()?.[cat] === true
}

/** Öffnet den Banner erneut (z. B. über „Cookie-Einstellungen“ im Footer). */
export function openConsentSettings() {
  window.dispatchEvent(new Event('consent:open'))
}
