import { useState } from 'react'
import { AppWindow, Surface, useSeen } from './shared'

// Vertragsenden: Kennzahlen, Verteilung je Monat und die nächsten Enddaten, alles aus den Dokumenten gelesen.
// Beispieldaten (fiktive Vertragspartner), Zahlen illustrativ.

const MONTHS = [
  { m: 'Nov', v: 6 }, { m: 'Dez', v: 11 }, { m: 'Jan', v: 17 }, { m: 'Feb', v: 8 }, { m: 'Mär', v: 12 }, { m: 'Apr', v: 9 },
  { m: 'Mai', v: 14 }, { m: 'Jun', v: 21 }, { m: 'Jul', v: 10 }, { m: 'Aug', v: 7 }, { m: 'Sep', v: 15 },
]

type Kpi = { id: 'all' | '90' | 'notice' | 'auto'; label: string; value: number; sub: string; months: number[] }
const KPIS: Kpi[] = [
  { id: 'all', label: 'Verträge mit Enddatum', value: 138, sub: 'aus 18.760 Fundstellen', months: MONTHS.map((_, i) => i) },
  { id: '90', label: 'Enden in 90 Tagen', value: 34, sub: 'bis 31.01.2027', months: [0, 1, 2] },
  { id: 'notice', label: 'Kündigungsfrist läuft bald ab', value: 9, sub: 'innerhalb von 30 Tagen', months: [0, 1] },
  { id: 'auto', label: 'Automatische Verlängerung', value: 41, sub: 'ohne Kündigung 12 Monate', months: [1, 3, 4, 6, 7, 10] },
]

type Row = { partner: string; type: string; end: string; notice: string; flags: Kpi['id'][]; badge: string; tone: 'amber' | 'purple' | 'gray' }
const ROWS: Row[] = [
  { partner: 'Nordlicht Logistik GmbH', type: 'Liefervertrag', end: '30.11.2026', notice: '3 Monate zum Quartalsende', flags: ['90', 'notice'], badge: 'Frist läuft', tone: 'amber' },
  { partner: 'Brandt & Kollegen Beratung', type: 'Beratungsvertrag', end: '15.12.2026', notice: '6 Wochen', flags: ['90', 'notice'], badge: 'Frist läuft', tone: 'amber' },
  { partner: 'Lensa Cloud Services AG', type: 'Rahmenvertrag IT', end: '31.12.2026', notice: '6 Monate zum Jahresende', flags: ['90', 'auto'], badge: 'verlängert sich', tone: 'purple' },
  { partner: 'Nordic Facility Management', type: 'Dienstleistungsvertrag', end: '31.01.2027', notice: '3 Monate', flags: ['90', 'auto'], badge: 'verlängert sich', tone: 'purple' },
  { partner: 'Hartmann Fuhrpark KG', type: 'Leasingvertrag', end: '28.02.2027', notice: '3 Monate', flags: ['auto'], badge: 'verlängert sich', tone: 'purple' },
  { partner: 'Kessler Software GmbH', type: 'Lizenzvertrag', end: '31.03.2027', notice: '6 Monate zum Jahresende', flags: [], badge: 'läuft aus', tone: 'gray' },
]
const TONE = {
  amber: 'bg-[#fdebd3] text-[#a3560b]',
  purple: 'bg-primary-tint text-primary',
  gray: 'bg-[#efeaf1] text-muted',
}

export function ContractEnds() {
  const [sel, setSel] = useState<Kpi['id']>('90')
  const { ref, seen } = useSeen<HTMLDivElement>()
  const kpi = KPIS.find((k) => k.id === sel)!
  const rows = sel === 'all' ? ROWS : ROWS.filter((r) => r.flags.includes(sel))

  return (
    <Surface>
      <div ref={ref}>
        <AppWindow tab="Fristen" title="Vertragsenden">
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">Vertragsenden</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">Verträge</span>
            <span className="text-muted">aus 18.760 Fundstellen · 138 Verträge mit erkanntem Enddatum</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 pb-5">
            {KPIS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setSel(k.id)}
                aria-pressed={sel === k.id}
                className={`min-w-0 text-left rounded-lg border bg-white p-3.5 cursor-pointer transition-all duration-300 ${
                  sel === k.id ? 'border-primary ring-2 ring-primary/15 -translate-y-0.5' : 'border-line hover:border-primary/40'
                }`}
              >
                <div className="text-muted">{k.label}</div>
                <div className={`mt-1 text-[1.75rem] leading-none font-semibold tabular-nums ${sel === k.id ? 'text-primary' : 'text-ink'}`}>{k.value}</div>
                <div className="mt-1.5 text-[0.75rem] text-muted">{k.sub}</div>
              </button>
            ))}
          </div>

          <div className="border-t border-line px-5 pt-4 pb-5">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">Vertragsenden je Monat</span>
              <span className="text-muted">Anzahl Verträge</span>
            </div>
            <div className="mt-4 flex items-end gap-1.5 sm:gap-3 h-44">
              {MONTHS.map((b, i) => {
                const on = kpi.months.includes(i)
                return (
                  <div key={b.m} className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-1">
                    <span className={`text-[0.75rem] tabular-nums transition-colors ${on ? 'text-ink font-semibold' : 'text-muted/60'}`}>{b.v}</span>
                    <div
                      className={`w-full rounded-t-md transition-[height,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'bg-primary' : 'bg-[#e1d4e6]'}`}
                      style={{ height: seen ? `${(b.v / 24) * 78}%` : '0%', transitionDelay: seen ? `${i * 45}ms` : '0ms' }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="mt-2 flex gap-1.5 sm:gap-3 text-center text-[0.75rem] text-muted">
              {MONTHS.map((b) => (
                <span key={b.m} className="flex-1 min-w-0">{b.m}</span>
              ))}
            </div>
          </div>

          <div className="border-t border-line">
            <div className="px-5 py-3 text-muted">
              <span className="font-semibold text-ink">Nächste Vertragsenden</span> nach Enddatum · {rows.length} {rows.length === 1 ? 'Vertrag' : 'Verträge'}
            </div>
            <div className="hidden sm:grid grid-cols-[1.6fr_1.2fr_0.8fr_1.3fr_0.9fr] gap-3 px-5 py-2 text-[0.6875rem] uppercase tracking-[0.08em] text-muted border-y border-line bg-[#faf8fb]">
              <span>Vertragspartner</span><span>Art</span><span>Enddatum</span><span>Kündigungsfrist</span><span />
            </div>
            <ul className="list-none m-0 p-0 min-h-[17.5rem]">
              {rows.map((r) => (
                <li key={r.partner} className="grid sm:grid-cols-[1.6fr_1.2fr_0.8fr_1.3fr_0.9fr] gap-x-3 gap-y-0.5 px-5 py-3 border-b border-line last:border-b-0 items-center">
                  <span className="font-medium">{r.partner}</span>
                  <span className="text-body">{r.type}</span>
                  <span className="tabular-nums">{r.end}</span>
                  <span className="text-body">{r.notice}</span>
                  <span className={`justify-self-start sm:justify-self-end rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${TONE[r.tone]}`}>{r.badge}</span>
                </li>
              ))}
            </ul>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
