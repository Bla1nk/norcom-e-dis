import { useEffect, useState } from 'react'
import { SubCard } from '../steps/shared'
import { useSeen } from '../legal/shared'

// Zwei kleine Funktionen: Dubletten ausblenden und Produktion mit fortlaufender Nummerierung. Fiktive Daten.

export function KanzleiSmallCards() {
  return (
    <div className="grid md:grid-cols-2 border-t border-line">
      <SubCard title="Jedes Dokument nur einmal lesen." text="Dubletten und nahezu gleiche Fassungen werden gruppiert. Ihr Team prüft nur die jeweils maßgebliche Version.">
        <Dedup />
      </SubCard>
      <SubCard className="md:border-l border-line" title="Produktion mit fortlaufender Nummer." text="Für die Herausgabe erhalten die Dokumente eine durchgehende Kennzeichnung, die sich im Verfahren zitieren lässt.">
        <Stamping />
      </SubCard>
    </div>
  )
}

const GROUPS = [
  { name: 'Angebot_Rahmenvertrag.pdf', more: 41 },
  { name: 'RE: Preise Q3 abstimmen.eml', more: 27 },
  { name: 'Lieferplan_Anpassung.xlsx', more: 63 },
]

function Dedup() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setOn((v) => !v), 3200)
    return () => window.clearInterval(id)
  }, [seen])
  const total = on ? 213 : 1284

  return (
    <div ref={ref} className="w-full max-w-[400px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.3)] p-4 text-[0.8125rem]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-muted">Dokumente zur Prüfung</div>
          <div className="text-[1.75rem] leading-tight font-semibold tabular-nums">{total.toLocaleString('de-DE')}</div>
        </div>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          className="flex items-center gap-2 bg-transparent border-0 cursor-pointer text-body p-0"
        >
          Dubletten ausblenden
          <span className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${on ? 'bg-primary' : 'bg-[#d9d0dd]'}`}>
            <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all duration-300 ${on ? 'left-[18px]' : 'left-0.5'}`} />
          </span>
        </button>
      </div>
      <ul className="list-none m-0 mt-4 p-0 flex flex-col gap-2">
        {GROUPS.map((g, i) => (
          <li key={g.name} className="relative">
            {[1, 2].map((k) => (
              <span
                key={k}
                aria-hidden="true"
                className="absolute inset-x-0 h-full rounded-lg border border-line bg-white transition-all duration-500"
                style={{ top: on ? 0 : k * 5, opacity: on ? 0 : 0.9, transform: on ? 'scale(1)' : `scale(${1 - k * 0.02})`, zIndex: 0, transitionDelay: `${i * 60}ms` }}
              />
            ))}
            <div className="relative z-10 flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5">
              <span className="min-w-0 flex-1 truncate font-medium">{g.name}</span>
              <span className={`rounded-full bg-primary-tint px-2 py-0.5 text-[0.75rem] font-medium text-primary transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}>
                +{g.more} ähnliche
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Stamping() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [n, setN] = useState(1)
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setN((v) => v + 1), 900)
    return () => window.clearInterval(id)
  }, [seen])
  const num = (v: number) => `KAN-${String(v).padStart(6, '0')}`

  return (
    <div ref={ref} className="relative w-full max-w-[400px] h-[250px]">
      {[2, 1, 0].map((k) => (
        <div
          key={k}
          className="absolute left-1/2 w-[230px] rounded-lg bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.35)] p-4 transition-all duration-500"
          style={{ top: 10 + k * 14, transform: `translateX(-50%) rotate(${(k - 1) * 2.5}deg)`, zIndex: 3 - k }}
        >
          <div className="h-2 w-2/3 rounded bg-[#e6dee9]" />
          <div className="mt-2.5 h-2 w-full rounded bg-[#efe8f1]" />
          <div className="mt-2 h-2 w-5/6 rounded bg-[#efe8f1]" />
          <div className="mt-2 h-2 w-3/4 rounded bg-[#efe8f1]" />
          <div className="mt-5 flex items-center justify-end">
            <span key={k === 0 ? n : 'x'} className={`rounded border-2 border-primary px-2 py-0.5 text-[0.75rem] font-semibold tabular-nums tracking-[0.04em] text-primary ${k === 0 ? 'stamp-in' : ''}`}>
              {num(k === 0 ? n : Math.max(1, n - k))}
            </span>
          </div>
        </div>
      ))}
      <div className="absolute bottom-0 inset-x-0 text-center text-[0.8125rem] text-muted">Produktionssatz 3 · {n} Dokumente nummeriert</div>
    </div>
  )
}
