// canonical und hreflang pro Seite: dasense.de ist die deutsche, www.dasense.com die englische Fassung (gleiche Pfade).
// Wird bei jedem Seitenwechsel neu gesetzt. Nur auf den echten Domains, nicht auf Vorschau- oder Testadressen.
import { LANG } from './i18n'

const HOSTS = /(^|\.)dasense\.(de|com)$/i
const ORIGIN = { de: 'https://dasense.de', en: 'https://www.dasense.com' } as const

function setLink(rel: string, href: string, hreflang?: string) {
  const sel = `link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ':not([hreflang])'}`
  let el = document.head.querySelector<HTMLLinkElement>(sel)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

export function updateSeoLinks() {
  if (!HOSTS.test(window.location.hostname)) return
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  setLink('canonical', ORIGIN[LANG] + path)
  setLink('alternate', ORIGIN.de + path, 'de')
  setLink('alternate', ORIGIN.en + path, 'en')
  setLink('alternate', ORIGIN.en + path, 'x-default')
}
