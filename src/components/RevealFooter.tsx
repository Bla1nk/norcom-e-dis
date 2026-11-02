import { useEffect, useRef, useState } from 'react'
import { FooterBody } from './FooterColumns'

// Reveal-Footer (Prinzip wie apexcollection.de): Der Footer (Aufbau wie bei Apex) liegt fest am unteren Rand hinter dem Inhalt. Der Inhalt hat
// unten einen Abstand in Footerhöhe (--foot) und scrollt nach oben weg. Dabei schiebt sich der Footerinhalt per Parallax
// nach unten in Position, und die Headline läuft ein, sobald etwa die Hälfte frei liegt.
export function RevealFooter() {
  const root = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = root.current
    const box = inner.current
    if (!el || !box) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const update = () => {
      raf = 0
      const h = el.offsetHeight
      const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      const p = 1 - Math.min(1, Math.max(0, remaining / h))
      box.style.transform = reduce ? '' : `translate3d(0, ${-(1 - p) * 24}%, 0)`
      setOn(p > 0.45)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <footer ref={root} className="fixed inset-x-0 bottom-0 z-0 overflow-hidden bg-[#111111] text-white" style={{ height: 'var(--foot)' }}>
      <div ref={inner} className={`h-full flex flex-col justify-between will-change-transform ${on ? 'tr-on' : ''}`}>
        <FooterBody />
      </div>
    </footer>
  )
}
