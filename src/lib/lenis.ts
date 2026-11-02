import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

/** Scrollt weich zu `top` (px); nutzt Lenis, sonst natives smooth scrolling. */
export function smoothScrollTo(top: number, duration = 1.6) {
  if (instance) instance.scrollTo(top, { duration })
  else window.scrollTo({ top, behavior: 'smooth' })
}

/** Springt sofort zu `top` (px), ohne Animation. Lenis misst vorher die Seitenhöhe neu (sie ändert sich beim Seitenwechsel). */
export function jumpTo(top: number) {
  window.scrollTo(0, top)
  if (instance) {
    instance.resize()
    instance.scrollTo(top, { immediate: true, force: true })
  }
}

/** Hält das Scrollen an (während der Seitentransition) bzw. gibt es wieder frei. */
export function lockScroll() {
  instance?.stop()
}
export function unlockScroll() {
  instance?.start()
}
