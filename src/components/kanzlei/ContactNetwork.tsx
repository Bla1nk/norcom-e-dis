import { useState } from 'react'
import { AppWindow, Surface } from '../legal/shared'

// Kontaktnetz (Kartellverfahren): Kommunikation zwischen Personen und Unternehmen im Zeitverlauf. Fiktiv.

const FIRMS = [
  { id: 'n', name: 'Nordstahl AG', color: '#601571' },
  { id: 'r', name: 'Ruhrwerk GmbH', color: '#2f6fe0' },
  { id: 'b', name: 'Bergmann Stahl', color: '#e08a1e' },
  { id: 'a', name: 'Alpha Metall', color: '#16a07c' },
]
const NODES = [
  { id: 'jw', label: 'J. Weber', f: 'n', x: 110, y: 70 },
  { id: 'mk', label: 'M. Keller', f: 'n', x: 70, y: 190 },
  { id: 'th', label: 'T. Hansen', f: 'r', x: 330, y: 50 },
  { id: 'sa', label: 'S. Albrecht', f: 'r', x: 470, y: 130 },
  { id: 'pl', label: 'P. Lorenz', f: 'b', x: 360, y: 250 },
  { id: 'kv', label: 'K. Vogel', f: 'a', x: 230, y: 160 },
]
// Kanten: von, nach, ab Quartal (1-8), Anzahl Mails
const EDGES: [string, string, number, number][] = [
  ['jw', 'mk', 1, 120],
  ['th', 'sa', 1, 90],
  ['jw', 'th', 2, 18],
  ['jw', 'kv', 4, 11],
  ['th', 'kv', 4, 9],
  ['mk', 'pl', 5, 14],
  ['kv', 'pl', 5, 23],
  ['sa', 'pl', 6, 17],
  ['jw', 'sa', 6, 31],
  ['th', 'pl', 7, 26],
]
const QUARTERS = ['Q1 2019', 'Q2 2019', 'Q3 2019', 'Q4 2019', 'Q1 2020', 'Q2 2020', 'Q3 2020', 'Q4 2020']
const firm = (id: string) => NODES.find((n) => n.id === id)!.f
const pos = (id: string) => NODES.find((n) => n.id === id)!

export function ContactNetwork() {
  const [q, setQ] = useState(5)
  const vis = EDGES.filter((e) => e[2] <= q)
  const cross = vis.filter((e) => firm(e[0]) !== firm(e[1]))
  const mails = cross.reduce((s, e) => s + e[3], 0)
  const seenNodes = new Set(vis.flatMap((e) => [e[0], e[1]]))

  return (
    <Surface tone="grid">
      <AppWindow tab="Kontaktnetz" title="Kontaktnetz">
        <div className="px-5 pt-5 pb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">Kontaktnetz</h4>
          <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">Kartellverfahren</span>
          <span className="text-muted">Kommunikation zwischen Wettbewerbern bis {QUARTERS[q - 1]}</span>
        </div>

        <div className="px-3 sm:px-5">
          <svg viewBox="0 0 560 300" className="w-full h-auto" role="img" aria-label="Kontaktnetz zwischen sechs Personen aus vier Unternehmen">
            {EDGES.map(([a, b, from, n]) => {
              const on = from <= q
              const isCross = firm(a) !== firm(b)
              const A = pos(a)
              const B = pos(b)
              return (
                <line
                  key={a + b}
                  x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke={isCross ? '#d6385c' : '#cdbbd3'}
                  strokeWidth={Math.max(1.5, Math.min(7, n / 8))}
                  strokeLinecap="round"
                  className={isCross && on ? 'net-flow' : ''}
                  strokeDasharray={isCross ? '6 5' : undefined}
                  style={{ opacity: on ? 1 : 0, transition: 'opacity 600ms' }}
                />
              )
            })}
            {NODES.map((n) => {
              const f = FIRMS.find((x) => x.id === n.f)!
              const on = seenNodes.has(n.id)
              return (
                <g key={n.id} style={{ opacity: on ? 1 : 0.28, transition: 'opacity 500ms' }}>
                  <circle cx={n.x} cy={n.y} r="17" fill="#fff" stroke={f.color} strokeWidth="2.5" />
                  <circle cx={n.x} cy={n.y} r="6" fill={f.color} />
                  <text x={n.x} y={n.y + 34} textAnchor="middle" fontSize="12" fontWeight="500" fill="#1a1220">{n.label}</text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="px-5 pb-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem] text-body">
          {FIRMS.map((f) => (
            <span key={f.id} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: f.color }} />
              {f.name}
            </span>
          ))}
          <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-[#d6385c]" />Kontakt zwischen Unternehmen</span>
        </div>

        <div className="border-t border-line px-5 py-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <label htmlFor="q-range" className="font-medium">Zeitregler</label>
            <span className="tabular-nums text-muted">{QUARTERS[q - 1]}</span>
          </div>
          <input
            id="q-range"
            type="range"
            min={1}
            max={8}
            step={1}
            value={q}
            onChange={(e) => setQ(Number(e.target.value))}
            className="w-full accent-[#601571] cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-[0.6875rem] text-muted">
            <span>Q1 2019</span>
            <span>Q4 2020</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ['Personen im Netz', String(seenNodes.size)],
              ['Kontakte zwischen Unternehmen', String(cross.length)],
              ['Mails dazu', String(mails)],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg border border-line bg-white p-3">
                <div className="text-muted text-[0.75rem]">{l}</div>
                <div className="mt-1 text-[1.375rem] leading-none font-semibold tabular-nums">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </AppWindow>
    </Surface>
  )
}
