import { useLayoutEffect, type RefObject } from 'react'

// Einstieg wie auf apexcollection.de: Jedes Wort steigt aus einer Maske auf,
// danach folgen die übrigen Elemente. Die Startposition wird vor dem ersten
// Paint gesetzt, damit nichts aufblitzt.
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

type Reveal = { ref: RefObject<HTMLElement | null>; duration: number; delay: number; from?: number }

export function useHeroReveal(headingRef: RefObject<HTMLElement | null>, extras: Reveal[] = []) {
  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return

    const words = Array.from(headingRef.current?.querySelectorAll<HTMLElement>('.word-inner') ?? [])
    const others = extras
      .map((e) => ({ ...e, el: e.ref.current }))
      .filter((e): e is Reveal & { el: HTMLElement } => e.el !== null)
    const targets = [...words, ...others.map((o) => o.el)]
    const animations: Animation[] = []
    let cancelled = false

    const restore = (el: HTMLElement) => {
      el.style.transform = ''
      el.style.willChange = ''
    }
    for (const word of words) word.style.transform = 'translate3d(0, 110%, 0)'
    for (const o of others) o.el.style.transform = `translate3d(0, ${o.from ?? 130}%, 0)`

    const reveal = (el: HTMLElement, duration: number, delay: number) => {
      if (cancelled) return
      el.style.willChange = 'transform'
      const animation = el.animate(
        [{ transform: el.style.transform }, { transform: 'translate3d(0, 0, 0)' }],
        { duration, delay, easing: EASE, fill: 'both' },
      )
      animations.push(animation)
      animation.onfinish = () => {
        restore(el)
        animation.cancel()
      }
    }

    // Erst animieren, wenn die Schrift geladen ist, sonst springt der Text beim Font-Swap.
    const font = words[0] && getComputedStyle(words[0])
    const fontReady = font
      ? document.fonts.load(`${font.fontWeight} ${font.fontSize} ${font.fontFamily}`, headingRef.current?.textContent ?? '')
      : Promise.resolve([])
    const start = () => {
      words.forEach((word, i) => reveal(word, 1000, 150 + i * 100))
      others.forEach((o) => reveal(o.el, o.duration, o.delay))
    }
    void fontReady.then(start, start)

    const stop = () => {
      cancelled = true
      animations.forEach((a) => a.cancel())
      targets.forEach(restore)
    }
    const onMotionChange = () => motion.matches && stop()
    motion.addEventListener('change', onMotionChange)
    return () => {
      motion.removeEventListener('change', onMotionChange)
      stop()
    }
    // extras ist pro Render ein neues Array; die Refs darin bleiben stabil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headingRef])
}
