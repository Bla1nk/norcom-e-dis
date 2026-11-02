import { useState } from 'react'
import { AppWindow, Surface, useSeen } from '../legal/shared'

// Auskunftsersuchen (Art. 15 DSGVO): Alle Fundstellen zu einer Person, nach Quelle, mit Fristuhr. Fiktive Personen.

const PEOPLE = [
  { name: 'Anna Berger', role: 'ehemalige Mitarbeiterin', days: 21, src: [214, 57, 31, 12] },
  { name: 'Markus Feld', role: 'Kunde', days: 8, src: [118, 9, 44, 6] },
  { name: 'Lena Okafor', role: 'Bewerberin', days: 27, src: [22, 3, 0, 2] },
]
const SOURCES = ['Postfächer', 'Fileshares', 'Chats', 'Backups']
const CATS = ['Kontaktdaten', 'Gehaltsdaten', 'Beurteilungen', 'Gesundheitsdaten']

export function SubjectRequest() {
  const [sel, setSel] = useState(0)
  const [made, setMade] = useState(false)
  const { ref, seen } = useSeen<HTMLDivElement>()
  const p = PEOPLE[sel]
  const total = p.src.reduce((a, b) => a + b, 0)
  const max = Math.max(...p.src, 1)
  const R = 34
  const C = 2 * Math.PI * R
  const urgent = p.days <= 10

  return (
    <Surface>
      <div ref={ref}>
        <AppWindow tab="Smart Filter" title="Auskunftsersuchen">
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">Auskunftsersuchen</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">Art. 15 DSGVO</span>
          </div>
          <div className="flex flex-wrap gap-2 px-5 pb-4">
            {PEOPLE.map((x, i) => (
              <button
                key={x.name}
                type="button"
                onClick={() => {
                  setSel(i)
                  setMade(false)
                }}
                aria-pressed={i === sel}
                className={`rounded-full border px-3.5 py-1.5 cursor-pointer transition-colors ${i === sel ? 'bg-ink text-white border-ink' : 'bg-white text-body border-line hover:border-primary/40'}`}
              >
                {x.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] border-t border-line">
            <div className="p-5 lg:border-r border-line flex items-center gap-5">
              <div className="relative size-[88px] flex-none">
                <svg viewBox="0 0 88 88" className="size-full -rotate-90">
                  <circle cx="44" cy="44" r={R} fill="none" stroke="#efe8f1" strokeWidth="8" />
                  <circle
                    cx="44" cy="44" r={R} fill="none" strokeWidth="8" strokeLinecap="round"
                    stroke={urgent ? '#e0a21e' : '#601571'}
                    strokeDasharray={C}
                    strokeDashoffset={seen ? C * (1 - p.days / 30) : C}
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1), stroke 400ms' }}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center leading-none">
                  <div>
                    <div className="text-[1.375rem] font-semibold tabular-nums">{p.days}</div>
                    <div className="mt-0.5 text-[0.6875rem] text-muted">Tage</div>
                  </div>
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[0.9375rem] truncate">{p.name}</div>
                <div className="text-muted">{p.role}</div>
                <div className="mt-2 text-body">Frist: 30 Tage, noch <span className={`font-semibold ${urgent ? 'text-[#a3560b]' : 'text-ink'}`}>{p.days}</span></div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Fundstellen nach Quelle</span>
                <span className="text-muted tabular-nums">{total} gesamt</span>
              </div>
              <ul className="list-none m-0 mt-3 p-0 flex flex-col gap-2.5">
                {SOURCES.map((s, i) => (
                  <li key={s} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3">
                    <span className="text-body">{s}</span>
                    <span className="h-2 rounded-full bg-[#efe8f1] overflow-hidden">
                      <span className="block h-full rounded-full bg-primary transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: seen ? `${(p.src[i] / max) * 100}%` : '0%', transitionDelay: `${i * 70}ms` }} />
                    </span>
                    <span className="tabular-nums text-right text-muted">{p.src[i]}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {CATS.slice(0, sel === 2 ? 2 : 4).map((c) => (
                  <span key={c} className={`rounded-full px-2.5 py-0.5 text-[0.75rem] ${c === 'Gesundheitsdaten' ? 'bg-[#fbe0e6] text-[#b02347]' : 'bg-[#f4f1f5] text-body'}`}>{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 bg-[#faf8fb]">
            <span className="text-muted">{made ? `Auskunftspaket mit ${total} Dokumenten erstellt, bereit zum Versand.` : 'Treffer werden geprüft, Dritte geschwärzt, dann als Paket ausgegeben.'}</span>
            <button
              type="button"
              onClick={() => setMade((v) => !v)}
              className={`rounded-full px-4 py-2 border-0 cursor-pointer font-semibold transition-colors ${made ? 'bg-[#e1f4ee] text-[#16795e]' : 'bg-primary text-white hover:bg-primary-hover'}`}
            >
              {made ? '✓ Paket erstellt' : 'Auskunftspaket erstellen'}
            </button>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
