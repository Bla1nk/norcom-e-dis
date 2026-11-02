import { useEffect, useRef, useState } from 'react'
import { markIntroSeen, releaseIntro } from '../lib/intro'
import { lockScroll, unlockScroll } from '../lib/lenis'

// Konzept „System Initialization“: Wenige Statusmeldungen laufen auf Schwarz, eine feine Linie in der Mitte füllt sich.
// Bei 100 % blenden die Meldungen aus, die Linie teilt die Fläche, beide Hälften ziehen nach oben und unten weg.
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const TOTAL = 3000 // ms bis 100 %
const SPLIT = 1100 // ms Auseinanderziehen
const LINES: { at: number; text: string }[] = [
  { at: 250, text: 'Umgebung geprüft: Air-Gapped' },
  { at: 800, text: 'Lokale KI geladen' },
  { at: 1350, text: 'Index verbunden: 1.284.503 Dokumente' },
  { at: 1900, text: 'Zugriffsrechte synchronisiert' },
  { at: 2450, text: 'Bereit' },
]

const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2)

export function IntroSystem({ onDone }: { onDone: () => void }) {
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const pct = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(0)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    let cancelled = false
    let raf = 0
    const timers: number[] = []
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const lockRaf = requestAnimationFrame(() => lockScroll())
    LINES.forEach((l, i) => timers.push(window.setTimeout(() => setShown(i + 1), l.at)))

    const t0 = performance.now()
    const tick = (now: number) => {
      if (cancelled) return
      const p = ease(Math.min(1, (now - t0) / TOTAL))
      if (line.current) line.current.style.transform = `scaleX(${p})`
      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    timers.push(
      window.setTimeout(() => setFade(true), TOTAL + 150),
      window.setTimeout(() => {
        if (cancelled) return
        releaseIntro()
        const opts = { duration: SPLIT, easing: EASE, fill: 'forwards' as const }
        line.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 150, fill: 'forwards' })
        bottom.current?.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], opts)
        top.current
          ?.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], opts)
          .finished.then(() => {
            if (cancelled) return
            markIntroSeen()
            document.documentElement.style.overflow = prevOverflow
            unlockScroll()
            onDone()
          })
          .catch(() => {})
      }, TOTAL + 650),
    )
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(lockRaf)
      timers.forEach(clearTimeout)
      document.documentElement.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wrap = 'box-border w-full max-w-[1240px] 2xl:max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12'
  const mono = 'font-[ui-monospace,SFMono-Regular,Menlo,monospace] text-[0.8125rem] sm:text-[0.875rem] tracking-[0.02em]'

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[80] select-none text-white">
      <div ref={top} className="absolute inset-x-0 top-0 h-1/2 bg-[#0b0a0e] flex items-end">
        <div className={`${wrap} pb-6 transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
          <ul className={`list-none m-0 p-0 ${mono} text-white/85 min-h-[7.5rem] flex flex-col justify-end gap-1.5`}>
            {LINES.map((l, i) => (
              <li key={l.text} className="transition-[opacity,translate] duration-500 ease-out" style={{ opacity: i < shown ? 1 : 0, translate: i < shown ? '0 0' : '0 6px' }}>
                <span className="text-white/40">{String(i + 1).padStart(2, '0')}</span>
                <span className="mx-3 text-[#c79ad6]">OK</span>
                {l.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div ref={bottom} className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0b0a0e]">
        <div className={`${wrap} pt-5 flex items-start justify-between transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'} ${mono} text-white/55`}>
          <span>DaSense eDiscovery</span>
          <span className="tabular-nums text-white"><span ref={pct}>000</span> %</span>
        </div>
      </div>
      <div ref={line} className="absolute left-0 right-0 top-1/2 h-px -mt-px bg-white origin-left" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}
