import { useState } from 'react'
import { AppWindow, Surface } from '../legal/shared'

// Erkennung und Schwärzung personenbezogener Daten in einer Beispiel-Mail. Fiktiv.

type Cat = 'name' | 'mail' | 'health' | 'iban' | 'phone'
const CATS: { id: Cat; label: string; hi: string; dot: string }[] = [
  { id: 'name', label: 'Name', hi: 'bg-[#e9d9ee]', dot: 'bg-primary' },
  { id: 'mail', label: 'E-Mail', hi: 'bg-[#d9e6fb]', dot: 'bg-[#2f6fe0]' },
  { id: 'health', label: 'Gesundheitsdaten', hi: 'bg-[#fadbe2]', dot: 'bg-[#d6385c]' },
  { id: 'iban', label: 'IBAN', hi: 'bg-[#fbe7c8]', dot: 'bg-[#e08a1e]' },
  { id: 'phone', label: 'Telefon', hi: 'bg-[#d6efe8]', dot: 'bg-[#16a07c]' },
]
type Seg = { t: string; c?: Cat }
const TEXT: Seg[][] = [
  [{ t: 'Von: ' }, { t: 'Anna Berger', c: 'name' }, { t: ' <' }, { t: 'anna.berger@beispiel.de', c: 'mail' }, { t: '>' }],
  [{ t: 'Betreff: Krankmeldung und Gehaltsabrechnung' }],
  [
    { t: 'Hallo Herr Schulz, ich bin seit dem 12.03. krankgeschrieben (' },
    { t: 'Diagnose: Bandscheibenvorfall', c: 'health' },
    { t: '). Bitte überweisen Sie das Gehalt weiter auf ' },
    { t: 'IBAN DE89 3704 0044 0532 0130 00', c: 'iban' },
    { t: '. Rückfragen gern unter ' },
    { t: '+49 171 5550142', c: 'phone' },
    { t: '. Viele Grüße, ' },
    { t: 'Anna Berger', c: 'name' },
  ],
]

export function PiiRedaction() {
  const [on, setOn] = useState<Set<Cat>>(new Set(['name', 'mail', 'health', 'iban', 'phone']))
  const [red, setRed] = useState(false)
  const toggle = (id: Cat) =>
    setOn((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const hits = TEXT.flat().filter((s) => s.c && on.has(s.c)).length

  return (
    <Surface tone="dark">
      <AppWindow tab="Entitäten" title="Personenbezogene Daten">
        <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">Erkennung und Schwärzung</h4>
          <span className="text-muted">{hits} Fundstellen in diesem Dokument</span>
          <button
            type="button"
            onClick={() => setRed((v) => !v)}
            aria-pressed={red}
            className={`ml-auto rounded-full px-4 py-1.5 border-0 cursor-pointer font-semibold transition-colors ${red ? 'bg-ink text-white' : 'bg-primary text-white hover:bg-primary-hover'}`}
          >
            {red ? 'Schwärzung aufheben' : 'Schwärzen'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              aria-pressed={on.has(c.id)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 cursor-pointer transition-colors ${on.has(c.id) ? 'bg-white border-ink text-ink' : 'bg-white border-line text-muted'}`}
            >
              <span className={`size-2.5 rounded-full ${on.has(c.id) ? c.dot : 'bg-[#d9d0dd]'}`} />
              {c.label}
            </button>
          ))}
        </div>
        <div className="border-t border-line bg-[#faf8fb] p-5 lg:p-6">
          <div className="rounded-lg bg-white ring-1 ring-black/5 shadow-sm p-5 lg:p-7 text-[0.9375rem] leading-[1.9] text-body">
            {TEXT.map((line, i) => (
              <p key={i} className="m-0 mb-2 last:mb-0">
                {line.map((s, j) => {
                  if (!s.c) return <span key={j}>{s.t}</span>
                  const cat = CATS.find((c) => c.id === s.c)!
                  const active = on.has(s.c)
                  return (
                    <mark
                      key={j}
                      className={`rounded px-0.5 transition-all duration-500 ${active ? (red ? 'bg-ink text-transparent select-none' : `${cat.hi} text-ink`) : 'bg-transparent text-body'}`}
                    >
                      {s.t}
                    </mark>
                  )
                })}
              </p>
            ))}
          </div>
          <p className="m-0 mt-3 text-[0.8125rem] text-muted">
            Die Gesundheitsangabe zählt zu den besonderen Kategorien (Art. 9 DSGVO) und wird gesondert gekennzeichnet.
          </p>
        </div>
      </AppWindow>
    </Surface>
  )
}
