import { useState } from 'react'
import { AppWindow, Surface, useSeen } from '../legal/shared'

// Ordnerlandkarte: sichergestellte Datenträger als Treemap nach Dateizahl, Klick zeigt die Formatverteilung. Fiktive Zahlen.

const FORMATS = ['E-Mail', 'PDF', 'Office', 'Bilder', 'Chats', 'Sonstige']
const COLORS = ['#601571', '#2f6fe0', '#16a07c', '#e08a1e', '#d6385c', '#9a8fa0']

const SOURCES = [
  { id: 'laptop', name: 'Laptop 01', n: 412380, mix: [38, 22, 24, 9, 2, 5] },
  { id: 'nas', name: 'NAS Büro', n: 268940, mix: [6, 31, 41, 14, 0, 8] },
  { id: 'phone', name: 'Mobiltelefon', n: 187210, mix: [4, 3, 2, 52, 36, 3] },
  { id: 'cloud', name: 'Cloud-Export', n: 96420, mix: [57, 18, 14, 4, 3, 4] },
  { id: 'usb', name: 'USB-Stick', n: 38110, mix: [1, 24, 33, 26, 0, 16] },
]
const TOTAL = SOURCES.reduce((s, x) => s + x.n, 0)
const fmt = (n: number) => n.toLocaleString('de-DE')

function Cell({ s, sel, on, i, onClick, className = '' }: { s: (typeof SOURCES)[number]; sel: boolean; on: boolean; i: number; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={sel}
      className={`relative min-w-0 min-h-0 text-left rounded-lg border-0 p-3 cursor-pointer overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        sel ? 'bg-primary text-white ring-2 ring-primary/30' : 'bg-[#e9dcee] text-ink hover:bg-[#dfcde6]'
      } ${className}`}
      style={{ flexGrow: s.n, flexBasis: 0, opacity: on ? 1 : 0, transform: on ? 'none' : 'scale(0.92)', transitionDelay: on ? `${i * 90}ms` : '0ms' }}
    >
      <div className="font-semibold text-[0.875rem] leading-tight">{s.name}</div>
      <div className={`mt-0.5 tabular-nums text-[0.75rem] ${sel ? 'text-white/80' : 'text-muted'}`}>{fmt(s.n)} Dateien</div>
    </button>
  )
}

export function DataTreemap() {
  const [sel, setSel] = useState('laptop')
  const { ref, seen } = useSeen<HTMLDivElement>()
  const s = SOURCES.find((x) => x.id === sel)!
  const pick = (id: string) => setSel(id)
  const [a, b, c, d, e] = SOURCES

  return (
    <Surface>
      <div ref={ref}>
        <AppWindow tab="Landkarte" title="Ordnerlandkarte">
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">Ordnerlandkarte</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">Sichergestellte Daten</span>
            <span className="text-muted">Fläche entspricht der Dateizahl</span>
          </div>
          <div className="grid grid-cols-3 gap-3 px-5 pb-5">
            {[
              ['Dateien gesamt', fmt(TOTAL)],
              ['Dateiformate', '1.184'],
              ['Datenträger', String(SOURCES.length)],
            ].map(([l, v]) => (
              <div key={l} className="min-w-0 rounded-lg border border-line bg-white p-3.5">
                <div className="text-muted">{l}</div>
                <div className="mt-1 text-[1.25rem] leading-tight font-semibold tabular-nums">{v}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] border-t border-line">
            <div className="p-5 flex flex-col gap-2 h-[20rem] lg:border-r border-line">
              <div className="flex gap-2 min-h-0" style={{ flexGrow: a.n + b.n, flexBasis: 0 }}>
                <Cell s={a} i={0} on={seen} sel={sel === a.id} onClick={() => pick(a.id)} />
                <Cell s={b} i={1} on={seen} sel={sel === b.id} onClick={() => pick(b.id)} />
              </div>
              <div className="flex gap-2 min-h-0" style={{ flexGrow: c.n + d.n + e.n, flexBasis: 0 }}>
                <Cell s={c} i={2} on={seen} sel={sel === c.id} onClick={() => pick(c.id)} />
                <Cell s={d} i={3} on={seen} sel={sel === d.id} onClick={() => pick(d.id)} />
                <Cell s={e} i={4} on={seen} sel={sel === e.id} onClick={() => pick(e.id)} />
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{s.name}</span>
                <span className="text-muted tabular-nums">{Math.round((s.n / TOTAL) * 100)} % des Bestands</span>
              </div>
              <ul className="list-none m-0 mt-3 p-0 flex flex-col gap-2.5">
                {FORMATS.map((f, i) => (
                  <li key={f} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3">
                    <span className="flex items-center gap-1.5 text-body">
                      <span className="size-2 rounded-full flex-none" style={{ background: COLORS[i] }} />
                      {f}
                    </span>
                    <span className="h-2 rounded-full bg-[#efe8f1] overflow-hidden">
                      <span className="block h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${s.mix[i]}%`, background: COLORS[i] }} />
                    </span>
                    <span className="tabular-nums text-right text-muted">{fmt(Math.round((s.n * s.mix[i]) / 100))}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
