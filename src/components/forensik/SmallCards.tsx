import { useEffect, useState } from 'react'
import { SubCard } from '../steps/shared'
import { useSeen } from '../legal/shared'

// Zwei kleine Funktionen: Namen zusammenführen und Chronologie eines Vorgangs. Fiktive Daten.

export function ForensikSmallCards() {
  return (
    <div className="grid md:grid-cols-2 border-t border-line">
      <SubCard title="Eine Person, nicht fünf." text="Verschiedene Schreibweisen und Adressen derselben Person werden zusammengeführt. So bleibt kein Beteiligter unentdeckt.">
        <Merge />
      </SubCard>
      <SubCard className="md:border-l border-line" title="Der Vorgang auf einer Zeitleiste." text="Alle Ereignisse eines Vorgangs stehen in der richtigen Reihenfolge, mit Quelle zu jedem Punkt.">
        <Chronology />
      </SubCard>
    </div>
  )
}

const VARIANTS = [
  { t: 'J. Meier', x: -118, y: -62, r: -6 },
  { t: 'Jörg Meier', x: 112, y: -54, r: 5 },
  { t: 'joerg.m@halden-holding.example', x: -96, y: 62, r: 4 },
  { t: 'Meier, Jörg', x: 108, y: 64, r: -5 },
  { t: 'JM (Chat)', x: 0, y: -98, r: 3 },
]

function Merge() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [merged, setMerged] = useState(false)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMerged(true)
      return
    }
    const id = window.setInterval(() => setMerged((v) => !v), 2800)
    const first = window.setTimeout(() => setMerged(true), 500)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(first)
    }
  }, [seen])

  return (
    <div ref={ref} className="relative w-full max-w-[400px] h-[250px] grid place-items-center">
      {VARIANTS.map((v) => (
        <span
          key={v.t}
          className="absolute max-w-[12rem] truncate rounded-full bg-white ring-1 ring-black/10 px-3 py-1 text-[0.75rem] text-body shadow-[0_8px_24px_-14px_rgba(40,10,50,0.35)] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: merged ? 'translate(0,0) scale(0.4)' : `translate(${v.x}px, ${v.y}px) rotate(${v.r}deg)`,
            opacity: merged ? 0 : seen ? 1 : 0,
          }}
        >
          {v.t}
        </span>
      ))}
      <div
        className="relative z-10 rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.35)] px-4 py-3 text-[0.8125rem] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: merged ? 1 : 0.35, transform: merged ? 'scale(1)' : 'scale(0.92)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-white text-[0.75rem] font-semibold">JM</span>
          <div>
            <div className="font-semibold text-ink text-[0.875rem]">Jörg Meier</div>
            <div className="text-muted">Einkaufsleiter · Halden Holding</div>
          </div>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <span className="rounded-full bg-primary-tint px-2 py-0.5 text-[0.75rem] text-primary font-medium">5 Schreibweisen</span>
          <span className="rounded-full bg-[#f4f1f5] px-2 py-0.5 text-[0.75rem] text-body">412 Dokumente</span>
        </div>
      </div>
    </div>
  )
}

const EVENTS = [
  { d: '03.03.', t: 'Angebot Orion Advisory eingegangen', s: 'Mail' },
  { d: '14.03.', t: 'Eilüberweisung angewiesen', s: 'Beleg' },
  { d: '02.04.', t: 'Freigabe ohne zweite Unterschrift', s: 'PDF' },
  { d: '19.04.', t: 'Gesprächsnotiz „nur mündlich“', s: 'Chat' },
  { d: '08.05.', t: 'Barübergabe 25.000 €', s: 'Notiz' },
]

function Chronology() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(EVENTS.length)
      return
    }
    const id = window.setInterval(() => setN((v) => (v >= EVENTS.length + 2 ? 0 : v + 1)), 800)
    return () => window.clearInterval(id)
  }, [seen])

  return (
    <div ref={ref} className="w-full max-w-[400px] relative pl-7">
      <span aria-hidden="true" className="absolute left-[9px] top-2 bottom-2 w-px bg-[#d9c8de] origin-top transition-transform duration-700 ease-out" style={{ transform: `scaleY(${Math.min(1, n / EVENTS.length)})` }} />
      <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
        {EVENTS.map((e, i) => {
          const on = i < n
          return (
            <li key={e.d} className="relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateX(-12px)' }}>
              <span className={`absolute -left-7 top-3.5 size-[19px] rounded-full ring-4 ring-[#f7f6f8] ${i === EVENTS.length - 1 ? 'bg-[#d6385c]' : 'bg-primary'}`} />
              <div className="flex items-center gap-3 rounded-xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-20px_rgba(40,10,50,0.35)] px-3.5 py-2.5 text-[0.8125rem]">
                <span className="tabular-nums text-muted w-10 flex-none">{e.d}</span>
                <span className="min-w-0 flex-1 truncate font-medium text-ink">{e.t}</span>
                <span className="rounded-full bg-[#f4f1f5] px-2 py-0.5 text-[0.6875rem] text-body">{e.s}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
