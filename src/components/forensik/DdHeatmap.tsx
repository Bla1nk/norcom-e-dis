import { useState } from 'react'
import { AppWindow, Surface, useSeen } from '../legal/shared'
import { t } from '../../lib/i18n'

// Due Diligence: Risikomatrix über den Datenraum, Zellen führen zu den betroffenen Verträgen. Fiktiv.

const COLS = t(['Change of Control', 'Laufzeit > 5 Jahre', 'Haftung unbegrenzt', 'Exklusivität'], ['Change of control', 'Term > 5 years', 'Unlimited liability', 'Exclusivity'])
const ROWS = t(['Kunden', 'Lieferanten', 'IT & Lizenzen', 'Miete & Leasing', 'Personal'], ['Customers', 'Suppliers', 'IT & licenses', 'Rent & leasing', 'Personnel'])
const N: number[][] = [
  [14, 6, 3, 9],
  [4, 11, 7, 12],
  [9, 8, 15, 2],
  [1, 13, 0, 3],
  [2, 0, 1, 0],
]
const CONTRACTS: Record<string, string[]> = {
  '0-0': t(['Rahmenvertrag Nordwind Handel', 'Servicevertrag Küstenwerk AG', 'Liefervereinbarung Altmann & Söhne'], ['Master agreement Nordwind Handel', 'Service agreement Küstenwerk AG', 'Supply agreement Altmann & Söhne']),
  '1-1': t(['Liefervertrag Rohstahl Süd, 8 Jahre', 'Abnahmevertrag Brennstoffe, 7 Jahre', 'Rahmenvertrag Verpackung, 6 Jahre'], ['Supply agreement Rohstahl Süd, 8 years', 'Offtake agreement fuels, 7 years', 'Master agreement packaging, 6 years']),
  '2-2': t(['Lizenzvertrag Datenplattform Alpha', 'Hostingvertrag Rechenzentrum West', 'Wartungsvertrag ERP, Haftung ohne Obergrenze'], ['License agreement Data Platform Alpha', 'Hosting agreement Data Center West', 'ERP maintenance agreement, uncapped liability']),
  '3-1': t(['Mietvertrag Logistikhalle Ost, 12 Jahre', 'Leasing Fuhrpark, 7 Jahre', 'Mietvertrag Hauptsitz, 10 Jahre'], ['Lease Logistics Hall East, 12 years', 'Fleet leasing, 7 years', 'Lease headquarters, 10 years']),
  '1-3': t(['Exklusivliefervertrag Kupfer', 'Alleinbezug Verpackungsmaterial', 'Exklusivität Ersatzteile Region Nord'], ['Exclusive supply agreement copper', 'Sole sourcing packaging material', 'Exclusivity spare parts North region']),
}
const rest = t(['Vertrag A (Auszug)', 'Vertrag B (Auszug)', 'Vertrag C (Auszug)'], ['Contract A (excerpt)', 'Contract B (excerpt)', 'Contract C (excerpt)'])

const cell = (n: number) =>
  n === 0 ? 'bg-[#f4f1f5] text-muted' : n <= 3 ? 'bg-[#e9d9ee] text-primary' : n <= 8 ? 'bg-[#cfaedb] text-[#3e0c4a]' : n <= 12 ? 'bg-[#a05ab3] text-white' : 'bg-primary text-white'

export function DdHeatmap() {
  const [sel, setSel] = useState<[number, number]>([0, 0])
  const { ref, seen } = useSeen<HTMLDivElement>()
  const key = `${sel[0]}-${sel[1]}`
  const list = CONTRACTS[key] ?? rest
  const total = N.flat().reduce((a, b) => a + b, 0)

  return (
    <Surface tone="grid">
      <div ref={ref}>
        <AppWindow tab={t('Risikomatrix', 'Risk matrix')} title="Due Diligence">
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Risikomatrix', 'Risk matrix')}</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">M&amp;A Due Diligence</span>
            <span className="text-muted">{t(`${total} Auffälligkeiten in 612 Verträgen des Datenraums`, `${total} findings across 612 contracts in the data room`)}</span>
          </div>

          <div className="px-3 sm:px-5 pb-5 overflow-x-auto no-scrollbar">
            <div className="min-w-[34rem] grid grid-cols-[7.5rem_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
              <span />
              {COLS.map((c) => (
                <span key={c} className="px-1 pb-1 text-[0.75rem] leading-tight text-muted text-center">{c}</span>
              ))}
              {ROWS.map((r, i) => (
                <div key={r} className="contents">
                  <span className="self-center pr-2 text-body font-medium">{r}</span>
                  {N[i].map((n, j) => {
                    const active = sel[0] === i && sel[1] === j
                    return (
                      <button
                        key={j}
                        type="button"
                        onClick={() => setSel([i, j])}
                        aria-pressed={active}
                        aria-label={`${r}, ${COLS[j]}: ${n}`}
                        className={`h-14 rounded-lg border-0 cursor-pointer text-[1.125rem] font-semibold tabular-nums transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${cell(n)} ${active ? 'ring-2 ring-ink ring-offset-2 scale-[1.04]' : 'hover:scale-[1.03]'}`}
                        style={{ opacity: seen ? 1 : 0, transform: seen ? undefined : 'scale(0.7)', transitionDelay: seen ? `${(i + j) * 55}ms` : '0ms' }}
                      >
                        {n}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-line bg-[#faf8fb]">
            <div className="px-5 py-3 text-muted">
              <span className="font-semibold text-ink">{ROWS[sel[0]]}</span> · {COLS[sel[1]]} · {N[sel[0]][sel[1]]} {N[sel[0]][sel[1]] === 1 ? t('Vertrag', 'contract') : t('Verträge', 'contracts')}
            </div>
            <ul key={key} className="list-none m-0 p-0 border-t border-line min-h-[10.5rem]">
              {N[sel[0]][sel[1]] === 0 ? (
                <li className="px-5 py-6 text-muted">{t('Keine Auffälligkeit in dieser Gruppe.', 'No findings in this group.')}</li>
              ) : (
                list.map((c, i) => (
                  <li key={c} className="fo-rise flex items-center gap-3 px-5 py-3 border-b border-line last:border-b-0 bg-white" style={{ animationDelay: `${i * 80}ms` }}>
                    <span className="size-2 rounded-full bg-primary flex-none" />
                    <span className="font-medium truncate">{c}</span>
                    <span className="ml-auto text-[0.75rem] text-primary whitespace-nowrap">{t('Fundstelle öffnen', 'Open match')}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
