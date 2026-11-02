import { useEffect, useState } from 'react'
import { SubCard } from '../steps/shared'
import { useSeen } from '../legal/shared'

// Zwei kleine Funktionen: Statusbericht für Mandanten und Rechte je Projekt. Fiktive Daten.

export function DienstleisterSmallCards() {
  return (
    <div className="grid md:grid-cols-2 border-t border-line">
      <SubCard title="Der Statusbericht schreibt sich selbst." text="Kennzahlen aus dem laufenden Projekt werden zum Bericht, den Sie mit einem Klick an Ihren Mandanten senden.">
        <StatusReport />
      </SubCard>
      <SubCard className="md:border-l border-line" title="Rechte je Projekt." text="Legen Sie fest, wer in einem Projekt suchen, prüfen oder exportieren darf.">
        <Rights />
      </SubCard>
    </div>
  )
}

const KPI: [string, string, number][] = [
  ['Eingelesen', '1.240.512', 100],
  ['Geprüft', '412.870', 33],
  ['Als relevant markiert', '9.804', 8],
]

function StatusReport() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [sent, setSent] = useState(false)
  useEffect(() => {
    if (!sent) return
    const id = window.setTimeout(() => setSent(false), 4000)
    return () => window.clearTimeout(id)
  }, [sent])

  return (
    <div ref={ref} className="w-full max-w-[400px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.3)] p-4 text-[0.8125rem]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-semibold text-[0.9375rem]">Statusbericht KW 45</div>
          <div className="text-muted">Projekt Falke</div>
        </div>
        <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-[0.75rem] font-medium text-primary">Entwurf</span>
      </div>
      <ul className="list-none m-0 mt-3.5 p-0 flex flex-col gap-3">
        {KPI.map(([l, v, w], i) => (
          <li key={l}>
            <div className="flex justify-between"><span className="text-body">{l}</span><span className="font-semibold tabular-nums">{v}</span></div>
            <div className="mt-1.5 h-1.5 rounded-full bg-[#efe8f1] overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out" style={{ width: seen ? `${w}%` : '0%', transitionDelay: `${i * 180}ms` }} />
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setSent((v) => !v)}
        className={`mt-4 w-full rounded-full py-2 border-0 cursor-pointer font-semibold transition-colors ${sent ? 'bg-[#e1f4ee] text-[#16795e]' : 'bg-primary text-white hover:bg-primary-hover'}`}
      >
        {sent ? '✓ Gesendet' : 'An Mandant senden'}
      </button>
    </div>
  )
}

const ROLES = ['Projektleitung', 'Prüfer', 'Mandant']
const PERMS = ['Suchen', 'Prüfen', 'Exportieren']
const INIT: boolean[][] = [
  [true, true, true],
  [true, true, false],
  [true, false, false],
]

function Rights() {
  const [m, setM] = useState(INIT)
  const toggle = (r: number, p: number) => setM((x) => x.map((row, i) => (i === r ? row.map((v, j) => (j === p ? !v : v)) : row)))

  return (
    <div className="w-full max-w-[400px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.3)] overflow-hidden text-[0.8125rem]">
      <div className="px-4 py-3 border-b border-line font-semibold text-[0.875rem]">Rechte · Projekt Falke</div>
      <div className="grid grid-cols-[1fr_repeat(3,4.5rem)] items-center px-4 py-2 text-[0.6875rem] uppercase tracking-[0.08em] text-muted bg-[#faf8fb] border-b border-line">
        <span>Rolle</span>
        {PERMS.map((p) => <span key={p} className="text-center">{p}</span>)}
      </div>
      {ROLES.map((r, i) => (
        <div key={r} className="grid grid-cols-[1fr_repeat(3,4.5rem)] items-center px-4 py-3 border-b border-line last:border-b-0">
          <span className="font-medium">{r}</span>
          {PERMS.map((p, j) => (
            <button
              key={p}
              type="button"
              role="switch"
              aria-checked={m[i][j]}
              aria-label={`${r}: ${p}`}
              onClick={() => toggle(i, j)}
              className={`relative mx-auto h-5 w-9 rounded-full border-0 cursor-pointer transition-colors duration-300 ${m[i][j] ? 'bg-primary' : 'bg-[#d9d0dd]'}`}
            >
              <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all duration-300 ${m[i][j] ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
