import { useState } from 'react'
import { AppWindow, Surface } from '../legal/shared'

// Review-Steuerung: Prüferzahl und Durchsatz bestimmen die voraussichtliche Fertigstellung. Fiktive Werte.

const TOTAL = 48000 // zu prüfende Dokumente
const DONE = 12000
const DEADLINE_DAY = 14 // Arbeitstag der Deadline
const RATES = [62, 58, 55, 51, 47, 44, 40, 36, 33, 30] // Dok./Std. je Prüfer
const HOURS = 7
const NAMES = ['M. Schulz', 'J. Roth', 'Dr. Lange', 'A. Koç', 'S. Brandt', 'L. Weiß', 'T. Neumann', 'F. Ebert', 'C. Wolf', 'P. Sommer']
const START_DATE = new Date(2026, 10, 3)

function addWorkdays(d: Date, n: number) {
  const r = new Date(d)
  let left = Math.ceil(n)
  while (left > 0) {
    r.setDate(r.getDate() + 1)
    if (r.getDay() !== 0 && r.getDay() !== 6) left--
  }
  return r
}
const dateFmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function ReviewCapacity() {
  const [n, setN] = useState(6)
  const perDay = RATES.slice(0, n).reduce((a, b) => a + b, 0) * HOURS
  const days = (TOTAL - DONE) / perDay
  const finish = addWorkdays(START_DATE, days)
  const deadline = addWorkdays(START_DATE, DEADLINE_DAY)
  const diff = Math.round((deadline.getTime() - finish.getTime()) / 86400000)
  const ok = days <= DEADLINE_DAY

  // Burn-down: verbleibende Dokumente über die Arbeitstage
  const W = 560
  const H = 190
  const maxDay = 20
  const x = (d: number) => 36 + (d / maxDay) * (W - 56)
  const y = (v: number) => 14 + (1 - v / (TOTAL - DONE)) * (H - 40)
  const endDay = Math.min(days, maxDay)
  const path = `M${x(0)} ${y(TOTAL - DONE)} L${x(endDay)} ${y(Math.max(0, TOTAL - DONE - perDay * endDay))}`

  return (
    <Surface tone="dark">
      <AppWindow tab="Smart Filter" title="Review-Steuerung">
        <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">Review-Steuerung</h4>
          <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">Schiedsverfahren Rhein</span>
          <span className="text-muted tabular-nums">{(TOTAL - DONE).toLocaleString('de-DE')} von {TOTAL.toLocaleString('de-DE')} Dokumenten offen</span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] border-t border-line">
          <div className="p-5 lg:border-r border-line">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[0.9375rem]">Prüfer: {n}</span>
              <span className="flex items-center gap-1.5">
                <button type="button" aria-label="Einen Prüfer weniger" disabled={n <= 2} onClick={() => setN((v) => v - 1)} className="grid size-8 place-items-center rounded-full border border-line bg-white text-ink cursor-pointer disabled:opacity-30 disabled:cursor-default hover:border-primary/50">−</button>
                <button type="button" aria-label="Einen Prüfer mehr" disabled={n >= 10} onClick={() => setN((v) => v + 1)} className="grid size-8 place-items-center rounded-full border border-line bg-white text-ink cursor-pointer disabled:opacity-30 disabled:cursor-default hover:border-primary/50">+</button>
              </span>
            </div>
            <ul className="list-none m-0 mt-3 p-0 flex flex-col gap-1.5 min-h-[17rem]">
              {NAMES.map((nm, i) => {
                const on = i < n
                return (
                  <li key={nm} className="grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-2.5 transition-opacity duration-500" style={{ opacity: on ? 1 : 0.22 }}>
                    <span className="truncate text-body">{nm}</span>
                    <span className="h-1.5 rounded-full bg-[#efe8f1] overflow-hidden">
                      <span className="block h-full rounded-full bg-primary transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: on ? `${(RATES[i] / 62) * 100}%` : '0%' }} />
                    </span>
                    <span className="tabular-nums text-right text-muted">{RATES[i]}/Std.</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-line bg-white p-3">
                <div className="text-muted text-[0.75rem]">Durchsatz</div>
                <div className="mt-1 text-[1.25rem] leading-none font-semibold tabular-nums">{perDay.toLocaleString('de-DE')}</div>
                <div className="mt-1 text-[0.6875rem] text-muted">Dok. pro Tag</div>
              </div>
              <div className="rounded-lg border border-line bg-white p-3">
                <div className="text-muted text-[0.75rem]">Fertig voraussichtlich</div>
                <div className="mt-1 text-[1.25rem] leading-none font-semibold tabular-nums">{dateFmt(finish)}</div>
                <div className="mt-1 text-[0.6875rem] text-muted">{Math.ceil(days)} Arbeitstage</div>
              </div>
              <div className={`rounded-lg border p-3 transition-colors duration-500 ${ok ? 'border-[#bfe5d8] bg-[#f1faf6]' : 'border-[#f0d9a0] bg-[#fffaf0]'}`}>
                <div className="text-muted text-[0.75rem]">Deadline {dateFmt(deadline)}</div>
                <div className={`mt-1 text-[1.25rem] leading-none font-semibold tabular-nums ${ok ? 'text-[#16795e]' : 'text-[#a3560b]'}`}>
                  {ok ? `${diff} Tage Puffer` : `${Math.abs(diff)} Tage zu spät`}
                </div>
                <div className={`mt-1 text-[0.6875rem] ${ok ? 'text-[#16795e]' : 'text-[#8a5e07]'}`}>{ok ? 'Deadline wird gehalten' : 'Deadline gefährdet'}</div>
              </div>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full h-auto" role="img" aria-label="Burn-down: verbleibende Dokumente über die Arbeitstage">
              {[0, 0.5, 1].map((t) => (
                <line key={t} x1="36" x2={W - 20} y1={y(t * (TOTAL - DONE))} y2={y(t * (TOTAL - DONE))} stroke="#efe8f1" />
              ))}
              <line x1={x(DEADLINE_DAY)} x2={x(DEADLINE_DAY)} y1="10" y2={H - 26} stroke="#d6385c" strokeDasharray="5 5" />
              <text x={x(DEADLINE_DAY)} y="9" textAnchor="middle" fontSize="11" fill="#b02347">Deadline</text>
              <path key={n} d={path} fill="none" stroke={ok ? '#601571' : '#e0a21e'} strokeWidth="3" strokeLinecap="round" className="dl-draw" pathLength={1} />
              <circle cx={x(endDay)} cy={y(Math.max(0, TOTAL - DONE - perDay * endDay))} r="5" fill={ok ? '#601571' : '#e0a21e'} style={{ transition: 'cx 700ms, cy 700ms' }} />
              {[0, 5, 10, 15, 20].map((d) => (
                <text key={d} x={x(d)} y={H - 8} textAnchor="middle" fontSize="11" fill="#5b5160">Tag {d}</text>
              ))}
              <text x="32" y={y(TOTAL - DONE) + 4} textAnchor="end" fontSize="11" fill="#5b5160">36k</text>
              <text x="32" y={y(0) + 4} textAnchor="end" fontSize="11" fill="#5b5160">0</text>
            </svg>
          </div>
        </div>
      </AppWindow>
    </Surface>
  )
}
