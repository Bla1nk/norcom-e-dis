import { useEffect, useRef } from 'react'

/** Vorhang-Effekt: Das Element bleibt oben am Fenster stehen, solange der vorherige Abschnitt (darüber, höherer
 *  z-index) nach oben wegscrollt, und scrollt danach normal weiter. Verschiebt nur per transform, das Layout bleibt. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.offsetTop - window.scrollY // Abstand der Oberkante (ohne transform) zum Fensterrand
      // top zwischen vh und 0: Oberkante auf 0 halten; darüber versteckt (unter dem vorherigen Abschnitt), danach 0.
      const shift = top >= vh ? -vh : top > 0 ? -top : 0
      el.style.transform = shift ? `translate3d(0, ${shift}px, 0)` : ''
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return ref
}
