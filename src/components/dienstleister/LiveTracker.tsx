import { useEffect, useRef, useState } from 'react'
import { Surface, useSeen } from '../legal/shared'

// Live-Tracker im Stil der Live-Ansicht des Ingest-Cockpits: Gesamtfortschritt, Durchsatz, Restzeit und voraussichtliche
// Fertigstellung, dazu die Pipeline-Stufen und die laufenden Mandate. Die Zeit läuft hier gerafft (1 s = 1 Minute).
// Mandate, Zahlen und Uhrzeiten sind fiktive Beispiele.

const TOTAL = 2640000
const BASE_RATE = 142 // Dokumente pro Sekunde bei 4 Workern
const fmt = (n: number) => Math.round(n).toLocaleString('de-DE')

function dur(sec: number) {
  const m = Math.max(0, Math.round(sec / 60))
  if (m >= 60) return `${Math.floor(m / 60)} Std. ${String(m % 60).padStart(2, '0')} Min.`
  return `${m} Min.`
}

const MANDATES = [
  { name: 'Mandat Nordwind', phase: 'Einlesen', total: 1280000, offset: 0 },
  { name: 'Mandat Falke', phase: 'Anreicherung', total: 940000, offset: 0.12 },
  { name: 'Mandat Lindgrün', phase: 'Vektorisierung', total: 420000, offset: 0.28 },
]
const STAGES = ['Scanner', 'NiFi', 'Anreicherung', 'Vektorisierung']

export function LiveTracker() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [done, setDone] = useState(TOTAL * 0.56)
  const [workers, setWorkers] = useState(4)
  const [rate, setRate] = useState(BASE_RATE)
  const [hist, setHist] = useState<number[]>(Array.from({ length: 36 }, () => BASE_RATE))
  const workersRef = useRef(workers)
  workersRef.current = workers

  useEffect(() => {
    if (!seen) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = window.setInterval(() => {
      const target = BASE_RATE * (workersRef.current / 4)
      const r = target * (0.93 + Math.random() * 0.14)
      setRate(r)
      setHist((h) => [...h.slice(1), r])
      setDone((d) => (d + r * 60 >= TOTAL ? TOTAL * 0.2 : d + r * 60))
    }, 1000)
    return () => window.clearInterval(id)
  }, [seen])

  const avg = hist.slice(-8).reduce((a, b) => a + b, 0) / 8
  const left = (TOTAL - done) / avg
  const pct = (done / TOTAL) * 100
  const now = new Date()
  now.setHours(9, 30, 0, 0)
  const end = new Date(now.getTime() + left * 1000)
  const endTxt = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')} Uhr`

  const maxH = Math.max(...hist, BASE_RATE * 2)
  const pts = hist.map((v, i) => `${(i / (hist.length - 1)) * 300},${70 - (v / maxH) * 62}`).join(' ')
  const stagePct = [Math.min(100, pct + 44), Math.min(100, pct + 22), Math.min(100, pct + 4), Math.max(2, pct - 14)]

  return (
    <Surface>
      <div ref={ref} className="rounded-xl overflow-hidden ring-1 ring-black/20 shadow-[0_30px_80px_-30px_rgba(10,10,20,0.7)] bg-[#0a0a0b] text-[#f4f4f5] text-[0.8125rem]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-4 border-b border-[#26262b]">
          <span className="inline-flex border-[1.5px] border-[#e4e4e7] rounded-[6px] overflow-hidden text-[0.9375rem] font-extrabold leading-none">
            <span className="px-[3px] pl-1.5 py-1">Nor</span>
            <b className="px-1.5 pl-1 py-1 bg-[#6d28d9] text-white font-extrabold">Com</b>
          </span>
          <h4 className="m-0 text-[1.0625rem] font-semibold">Live</h4>
          <span className="flex items-center gap-1.5 text-[#4ade80]"><span className="size-1.5 rounded-full bg-[#4ade80] blink-dot" />3 Mandate laufen</span>
          <span className="ml-auto flex items-center gap-2 text-[#8b8b94]">
            Worker
            <button type="button" onClick={() => setWorkers((w) => Math.max(2, w - 1))} aria-label="Weniger Worker" className="size-7 rounded-[8px] border border-[#26262b] bg-[#1b1b1f] text-[#f4f4f5] cursor-pointer hover:border-[#3b6cf6]">−</button>
            <b className="w-4 text-center text-[#f4f4f5] tabular-nums">{workers}</b>
            <button type="button" onClick={() => setWorkers((w) => Math.min(10, w + 1))} aria-label="Mehr Worker" className="size-7 rounded-[8px] border border-[#26262b] bg-[#1b1b1f] text-[#f4f4f5] cursor-pointer hover:border-[#3b6cf6]">+</button>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5">
          <div className="rounded-[14px] bg-[#3b6cf6]/12 border border-[#3b6cf6]/40 p-4 min-w-0">
            <div className="text-[#8b8b94]">Noch</div>
            <div className="mt-1 text-[1.5rem] leading-tight font-semibold tabular-nums">{dur(left)}</div>
            <div className="text-[0.75rem] text-[#7d9bff]">bis alles durchsuchbar ist</div>
          </div>
          <div className="rounded-[14px] bg-[#141416] border border-[#26262b] p-4 min-w-0">
            <div className="text-[#8b8b94]">Fertig voraussichtlich</div>
            <div className="mt-1 text-[1.5rem] leading-tight font-semibold tabular-nums">{endTxt}</div>
            <div className="text-[0.75rem] text-[#8b8b94]">heute</div>
          </div>
          <div className="rounded-[14px] bg-[#141416] border border-[#26262b] p-4 min-w-0">
            <div className="text-[#8b8b94]">Durchsatz</div>
            <div className="mt-1 text-[1.5rem] leading-tight font-semibold tabular-nums">{fmt(rate)}<span className="text-[0.8125rem] text-[#8b8b94] font-normal"> Dok./s</span></div>
            <div className="text-[0.75rem] text-[#8b8b94]">{workers} Worker</div>
          </div>
          <div className="rounded-[14px] bg-[#141416] border border-[#26262b] p-4 min-w-0">
            <div className="text-[#8b8b94]">Verarbeitet</div>
            <div className="mt-1 text-[1.5rem] leading-tight font-semibold tabular-nums">{pct.toFixed(1).replace('.', ',')} %</div>
            <div className="text-[0.75rem] text-[#8b8b94] tabular-nums">{fmt(done)} von {fmt(TOTAL)}</div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="h-2.5 rounded-full bg-[#1e1e22] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#3b6cf6] to-[#7d9bff] transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-3 px-5 pb-5">
          <div className="rounded-[14px] bg-[#141416] border border-[#26262b] p-4">
            <div className="font-semibold mb-3">Pipeline</div>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {STAGES.map((s, i) => (
                <li key={s} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3">
                  <span className="text-[#a1a1aa]">{s}</span>
                  <span className="h-2 rounded-full bg-[#1e1e22] overflow-hidden"><span className="block h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${stagePct[i]}%`, background: stagePct[i] >= 99 ? '#4ade80' : '#3b6cf6' }} /></span>
                  <span className="tabular-nums text-right text-[#8b8b94]">{Math.round(stagePct[i])} %</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-[10px] bg-[#0a0a0b] border border-[#1e1e22] p-3">
              <div className="flex items-center justify-between text-[0.75rem] text-[#8b8b94]"><span>Durchsatz, letzte Minuten</span><span className="tabular-nums">{fmt(avg)} Ø</span></div>
              <svg viewBox="0 0 300 76" className="mt-2 w-full h-14" preserveAspectRatio="none" aria-hidden="true">
                <polyline points={`0,76 ${pts} 300,76`} fill="rgba(59,108,246,.14)" stroke="none" />
                <polyline points={pts} fill="none" stroke="#7d9bff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>

          <div className="rounded-[14px] bg-[#141416] border border-[#26262b] p-4">
            <div className="font-semibold mb-3">Mandate</div>
            <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
              {MANDATES.map((m) => {
                const p = Math.min(100, Math.max(2, pct + 18 - m.offset * 100 * 0.9 + (m.name === 'Mandat Lindgrün' ? 6 : 0)))
                const eta = ((100 - p) / 100) * (m.total / avg)
                return (
                  <li key={m.name}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium truncate">{m.name}</span>
                      <span className="text-[0.75rem] text-[#8b8b94]">{m.phase}</span>
                      <span className="ml-auto tabular-nums text-[#7d9bff]">noch {dur(eta)}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-[#1e1e22] overflow-hidden"><div className="h-full rounded-full bg-[#3b6cf6] transition-[width] duration-1000 ease-linear" style={{ width: `${p}%` }} /></div>
                  </li>
                )
              })}
              <li className="flex items-baseline gap-2 text-[#8b8b94]">
                <span className="font-medium">Mandat Rheinbogen</span><span className="text-[0.75rem]">wartet</span>
                <span className="ml-auto tabular-nums">startet nach Nordwind</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="m-0 mt-3 text-[0.75rem] text-muted">Zeit gerafft: eine Sekunde entspricht hier einer Minute. Mit mehr Workern sinkt die Restzeit sofort.</p>
    </Surface>
  )
}
