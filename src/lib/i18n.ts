// Sprache der Seite: dasense.com zeigt Englisch, dasense.de Deutsch. Auf anderen Hosts (localhost, Vercel-Vorschau)
// gilt ?lang=en|de, danach die gemerkte Wahl, sonst Deutsch. Der Wechsel lädt die Seite neu, daher darf `t` auch beim
// Import von Modulen (Inhaltslisten) aufgerufen werden.
import { track } from './analytics'

export type Lang = 'de' | 'en'

const KEY = 'dasense-lang'
const COM = /(^|\.)dasense\.com$/i
const DE = /(^|\.)dasense\.de$/i

function detect(): Lang {
  if (typeof window === 'undefined') return 'de'
  const host = window.location.hostname
  if (COM.test(host)) return 'en'
  if (DE.test(host)) return 'de'
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'en' || q === 'de') {
      window.localStorage.setItem(KEY, q)
      return q
    }
    const s = window.localStorage.getItem(KEY)
    if (s === 'en' || s === 'de') return s
  } catch {
    /* Speicher gesperrt: Standard */
  }
  return 'de'
}

export const LANG: Lang = detect()
export const EN = LANG === 'en'

/** Text je Sprache: t('Deutsch', 'English'). Funktioniert für Strings, Listen und Objekte. */
export function t<T>(de: T, en: T): T {
  return EN ? en : de
}

if (typeof document !== 'undefined') document.documentElement.lang = LANG

/** Wechselt die Sprache: auf den dasense-Domains zur anderen Domain, sonst per Merker und Neuladen. */
export function switchLang(to: Lang) {
  if (to === LANG) return
  track('lang_switch', { to })
  const { protocol, hostname, pathname, search, hash } = window.location
  if (COM.test(hostname) || DE.test(hostname)) {
    // Feste Zieladressen (nicht nur .de/.com tauschen): www.dasense.com und dasense.de sind die Hauptadressen.
    const href = `${protocol}//${to === 'en' ? 'www.dasense.com' : 'dasense.de'}${pathname}${search}${hash}`
    // Über einen echten Link-Klick, damit Google Analytics die Besucherkennung (Linker) an die andere Domain mitgibt.
    const a = document.createElement('a')
    a.href = href
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    return
  }
  try {
    window.localStorage.setItem(KEY, to)
  } catch {
    /* ignorieren */
  }
  const q = new URLSearchParams(search)
  q.delete('lang')
  window.location.href = pathname + (q.toString() ? '?' + q.toString() : '') + hash
}
