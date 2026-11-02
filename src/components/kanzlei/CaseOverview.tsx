import { useState } from 'react'
import { AppWindow, Surface, useSeen } from '../legal/shared'

// Fall-Überblick (Early Case Assessment): Themen im Zeitverlauf und Schlüsseldokumente. Fiktiver Fall, Zahlen illustrativ.

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

type Topic = { id: string; label: string; total: string; series: number[]; docs: { name: string; date: string; score: number }[] }
const TOPICS: Topic[] = [
  {
    id: 'preis',
    label: 'Preisgespräche',
    total: '4.870 Dokumente',
    series: [2, 3, 2, 4, 12, 31, 18, 9, 6, 5, 3, 2],
    docs: [
      { name: 'RE: Preise Q3 abstimmen.eml', date: '14.06.2019', score: 96 },
      { name: 'Notiz Treffen Rheinhotel.docx', date: '19.06.2019', score: 91 },
      { name: 'Preisliste_intern_Q3.xlsx', date: '21.06.2019', score: 84 },
    ],
  },
  {
    id: 'lieferstopp',
    label: 'Lieferstopp',
    total: '3.120 Dokumente',
    series: [1, 1, 2, 3, 4, 6, 9, 24, 33, 14, 6, 3],
    docs: [
      { name: 'FW: Mengen ab September.eml', date: '28.08.2019', score: 94 },
      { name: 'Lieferplan_Anpassung.pdf', date: '03.09.2019', score: 88 },
      { name: 'Protokoll Vertriebsrunde.docx', date: '11.09.2019', score: 79 },
    ],
  },
  {
    id: 'vertrag',
    label: 'Vertragsschluss',
    total: '6.240 Dokumente',
    series: [8, 14, 22, 11, 6, 4, 3, 2, 2, 3, 2, 1],
    docs: [
      { name: 'Rahmenliefervertrag_final.pdf', date: '12.03.2019', score: 97 },
      { name: 'RE: Änderungen §7.eml', date: '08.03.2019', score: 90 },
      { name: 'Unterschriftenseite_scan.pdf', date: '14.03.2019', score: 72 },
    ],
  },
]

const KPIS = [
  ['Dokumente im Bestand', '1.240.512'],
  ['Als relevant eingestuft', '3,4 %'],
  ['Sprachen', 'DE 82 % · EN 16 %'],
  ['Zeitraum', '01/2017 – 12/2021'],
]

export function CaseOverview() {
  const [sel, setSel] = useState(0)
  const { ref, seen } = useSeen<HTMLDivElement>()
  const t = TOPICS[sel]
  const max = Math.max(...t.series)
  const peak = t.series.indexOf(max)

  return (
    <Surface>
      <div ref={ref}>
        <AppWindow tab="Fallüberblick" title="Fall-Überblick">
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">Fall-Überblick</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">Early Case Assessment</span>
            <span className="text-muted">Datenraum Projekt Falke · Stand heute</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 pb-5">
            {KPIS.map(([l, v]) => (
              <div key={l} className="min-w-0 rounded-lg border border-line bg-white p-3.5">
                <div className="text-muted">{l}</div>
                <div className="mt-1 text-[1.25rem] leading-tight font-semibold tabular-nums">{v}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-line px-5 pt-4 pb-5">
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setSel(i)}
                  aria-pressed={i === sel}
                  className={`rounded-full border px-3.5 py-1.5 cursor-pointer transition-colors ${i === sel ? 'bg-ink text-white border-ink' : 'bg-white text-body border-line hover:border-primary/40'}`}
                >
                  {x.label}
                </button>
              ))}
              <span className="ml-auto self-center text-muted">{t.total}</span>
            </div>
            <div className="mt-5 flex items-end gap-1.5 sm:gap-3 h-40">
              {t.series.map((v, i) => (
                <div key={i} className="relative flex-1 min-w-0 h-full flex flex-col justify-end items-center">
                  {i === peak && seen && (
                    <span className="absolute -top-0.5 rounded-full bg-primary text-white px-2 py-0.5 text-[0.6875rem] whitespace-nowrap" style={{ bottom: `calc(${(v / max) * 82}% + 6px)`, top: 'auto', transition: 'bottom 700ms' }}>
                      Spitze
                    </span>
                  )}
                  <div
                    className={`w-full rounded-t-md transition-[height,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${i === peak ? 'bg-primary' : 'bg-[#e1d4e6]'}`}
                    style={{ height: seen ? `${(v / max) * 82}%` : '0%', transitionDelay: seen ? `${i * 35}ms` : '0ms' }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5 sm:gap-3 text-center text-[0.75rem] text-muted">
              {MONTHS.map((m) => (
                <span key={m} className="flex-1 min-w-0">{m}</span>
              ))}
            </div>
          </div>

          <div className="border-t border-line">
            <div className="px-5 py-3 font-semibold">Schlüsseldokumente zu „{t.label}“</div>
            <ul className="list-none m-0 p-0 border-t border-line">
              {t.docs.map((d) => (
                <li key={d.name} className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_0.8fr_1.2fr] gap-3 px-5 py-3 border-b border-line last:border-b-0 items-center">
                  <span className="font-medium truncate">{d.name}</span>
                  <span className="hidden sm:block tabular-nums text-body">{d.date}</span>
                  <span className="flex items-center gap-2 justify-self-end sm:justify-self-stretch">
                    <span className="hidden sm:block flex-1 h-1.5 rounded-full bg-[#efe8f1] overflow-hidden">
                      <span className="block h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${d.score}%` }} />
                    </span>
                    <span className="tabular-nums text-muted w-16 text-right">Treffer {d.score}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
