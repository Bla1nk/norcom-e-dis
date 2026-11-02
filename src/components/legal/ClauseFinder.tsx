import { useState } from 'react'
import { AppWindow, Surface } from './shared'

// Klauselerkennung: Die KI markiert im Vertrag, welche Klauseln sie findet. Rechts die Klauselarten mit Trefferzahl
// im ganzen Bestand. Beispielvertrag und Zahlen sind fiktiv.

type Id = 'laufzeit' | 'kuendigung' | 'haftung' | 'kontrolle' | 'gericht'

const CLAUSES: { id: Id; label: string; count: number; hi: string; dot: string; strong: string }[] = [
  { id: 'laufzeit', label: 'Laufzeit & Verlängerung', count: 131, hi: 'bg-[#e9d9ee]', strong: 'bg-[#cfaedb]', dot: 'bg-primary' },
  { id: 'kuendigung', label: 'Kündigung', count: 126, hi: 'bg-[#fbe7c8]', strong: 'bg-[#f5c987]', dot: 'bg-[#e08a1e]' },
  { id: 'haftung', label: 'Haftungsbegrenzung', count: 115, hi: 'bg-[#d9e6fb]', strong: 'bg-[#a9c6f5]', dot: 'bg-[#2f6fe0]' },
  { id: 'kontrolle', label: 'Kontrollwechsel', count: 38, hi: 'bg-[#fadbe2]', strong: 'bg-[#f2a9b9]', dot: 'bg-[#d6385c]' },
  { id: 'gericht', label: 'Gerichtsstand & Recht', count: 122, hi: 'bg-[#d6efe8]', strong: 'bg-[#9fdcca]', dot: 'bg-[#16a07c]' },
]

type Seg = { t: string; c?: Id }
const DOC: { h: string; segs: Seg[] }[] = [
  {
    h: '§ 2 Laufzeit',
    segs: [
      { t: 'Der Vertrag beginnt am 01.12.2023 und ' },
      { t: 'läuft bis zum 30.11.2026. Er verlängert sich jeweils um 12 Monate', c: 'laufzeit' },
      { t: ', wenn er nicht ' },
      { t: 'mit einer Frist von drei Monaten zum Quartalsende schriftlich gekündigt wird', c: 'kuendigung' },
      { t: '.' },
    ],
  },
  {
    h: '§ 7 Haftung',
    segs: [
      { t: 'Die Parteien haften für leicht fahrlässig verursachte Schäden nur bei Verletzung wesentlicher Vertragspflichten. ' },
      { t: 'Die Haftung ist auf den vorhersehbaren, vertragstypischen Schaden, höchstens jedoch auf 500.000 Euro je Schadensfall begrenzt.', c: 'haftung' },
    ],
  },
  {
    h: '§ 9 Kontrollwechsel',
    segs: [
      { t: 'Bei einem Wechsel der Kontrolle über eine Partei ist die andere Partei ' },
      { t: 'zur außerordentlichen Kündigung innerhalb von sechs Monaten berechtigt', c: 'kontrolle' },
      { t: '.' },
    ],
  },
  {
    h: '§ 12 Schlussbestimmungen',
    segs: [
      { t: 'Es gilt deutsches Recht. ' },
      { t: 'Ausschließlicher Gerichtsstand ist Hamburg.', c: 'gericht' },
    ],
  },
]

export function ClauseFinder() {
  const [sel, setSel] = useState<Id | null>('kuendigung')
  const cl = (id: Id) => CLAUSES.find((c) => c.id === id)!
  const found = new Set(DOC.flatMap((p) => p.segs.filter((s) => s.c).map((s) => s.c as Id)))

  return (
    <Surface tone="dark">
      <AppWindow tab="Verträge" title="Klauselerkennung">
        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Dokument */}
          <div className="p-5 lg:p-6 bg-[#faf8fb] lg:border-r border-line">
            <div className="flex items-center justify-between gap-3 mb-3 text-muted">
              <span className="font-medium text-ink truncate">Liefervertrag_Nordlicht_2023.pdf</span>
              <span className="whitespace-nowrap">Seite 3 von 11</span>
            </div>
            <div className="rounded-lg bg-white ring-1 ring-black/5 shadow-sm p-5 lg:p-7 text-[0.875rem] leading-[1.75] text-body">
              {DOC.map((p) => (
                <div key={p.h} className="mb-4 last:mb-0">
                  <div className="font-semibold text-ink mb-0.5">{p.h}</div>
                  <p className="m-0">
                    {p.segs.map((s, i) =>
                      s.c ? (
                        <mark
                          key={i}
                          onClick={() => setSel(s.c as Id)}
                          className={`rounded px-0.5 text-ink cursor-pointer transition-colors duration-300 ${
                            sel === null || sel === s.c ? (sel === s.c ? cl(s.c).strong : cl(s.c).hi) : 'bg-transparent text-body'
                          } ${sel !== null && sel !== s.c ? 'opacity-70' : ''}`}
                        >
                          {s.t}
                        </mark>
                      ) : (
                        <span key={i}>{s.t}</span>
                      ),
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Klauselarten */}
          <div className="p-5 lg:p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-[0.9375rem]">Erkannte Klauseln</span>
              <button type="button" onClick={() => setSel(null)} className="text-primary bg-transparent border-0 cursor-pointer p-0 text-[0.8125rem] hover:underline">
                Alle anzeigen
              </button>
            </div>
            <p className="m-0 mt-1 text-muted">5 Klauselarten in diesem Vertrag, im Bestand gesamt:</p>
            <ul className="list-none m-0 mt-4 p-0 flex flex-col gap-2">
              {CLAUSES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSel(sel === c.id ? null : c.id)}
                    aria-pressed={sel === c.id}
                    className={`w-full flex items-center gap-3 text-left rounded-lg border px-3.5 py-2.5 bg-white cursor-pointer transition-all duration-300 ${
                      sel === c.id ? 'border-primary ring-2 ring-primary/15' : 'border-line hover:border-primary/40'
                    }`}
                  >
                    <span className={`size-2.5 rounded-full flex-none ${c.dot}`} />
                    <span className="flex-1 min-w-0 truncate font-medium">{c.label}</span>
                    {found.has(c.id) && <span className="text-[0.6875rem] text-[#16795e] bg-[#e1f4ee] rounded-full px-2 py-0.5">gefunden</span>}
                    <span className="tabular-nums text-muted whitespace-nowrap">{c.count} Verträge</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-lg bg-primary-tint/70 px-3.5 py-3 text-[0.8125rem] text-body leading-[1.5]">
              <span className="font-semibold text-primary">Auswertung im Bestand:</span> 23 Verträge enthalten keine Haftungsbegrenzung, 38 ein Sonderkündigungsrecht bei Kontrollwechsel.
            </div>
          </div>
        </div>
      </AppWindow>
    </Surface>
  )
}
