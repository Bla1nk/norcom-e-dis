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
