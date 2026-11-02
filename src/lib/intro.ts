// Intro beim ersten Aufruf der Startseite (einmal pro Browser-Sitzung; bei Neuladen und mit ?intro in der Adresse immer).
// Die Hero-Animationen warten auf `introGate`, damit sie erst unter dem wegziehenden Vorhang loslaufen.
const KEY = 'dasense-intro-v1'

function decide() {
  try {
    if (window.location.pathname !== '/') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    // Jedes Neuladen (auch Cmd+Shift+R) zeigt das Intro erneut
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (nav?.type === 'reload') return true
    if (new URLSearchParams(window.location.search).has('intro')) return true
    return !window.sessionStorage.getItem(KEY)
  } catch {
    return false
  }
}

export const INTRO_PENDING = typeof window !== 'undefined' && decide()

let release: () => void = () => {}
export const introGate: Promise<void> = INTRO_PENDING ? new Promise<void>((r) => (release = r)) : Promise.resolve()

export function releaseIntro() {
  release()
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(KEY, '1')
  } catch {
    /* ohne Speicher spielt das Intro beim nächsten Laden erneut */
  }
}
