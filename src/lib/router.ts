import type { MouseEvent } from 'react'

/** Löst einen Seitenwechsel aus; App.tsx führt ihn samt Transition aus. */
export function navigate(to: string) {
  window.dispatchEvent(new CustomEvent('app:navigate', { detail: to }))
}

/** Props für <a>: echter href (Rechtsklick, neuer Tab), Linksklick läuft über die Transition. */
export function linkProps(to: string) {
  return {
    href: to,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      navigate(to)
    },
  }
}

/** Props für Sprungmarken (z. B. '#praxis'): Auf der Hauptseite normaler Anker, auf einer Unterseite zurück mit Transition. */
export function anchorProps(hash: string) {
  return {
    href: `/${hash}`,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (window.location.pathname === '/') {
        if (hash === '#top') {
          e.preventDefault()
          navigate('/#top')
        }
        return
      }
      e.preventDefault()
      navigate(`/${hash}`)
    },
  }
}
