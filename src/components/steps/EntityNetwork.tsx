import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NET_EDGES, NET_ENTITIES, NET_TYPES, type NetEntity } from '../../content/entities'

// Netz-Ansicht des Entitäten-Panels für den Fall „Vertraulich“: Spalten je Klasse, Kanten = gemeinsame
// Nennungen. Klick auf eine Entität hebt sie und ihre Verbindungen hervor (wie Hover im echten Panel).

/** Zeichenfläche in px; wird per CSS-Skalierung an die Breite angepasst. */
const W = 1000
const COL_W = 214
const COL_X = [0, 262, 524, 786]
const HEAD = 34
const CARD_H = 36
const ROW = 46

type Pos = { x: number; y: number; col: number }

export function EntityNetwork() {
  const [sel, setSel] = useState('LJM2')
  const [scale, setScale] = useState(1)
  const wrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { pos, rows } = useMemo(() => {
    const pos = new Map<string, Pos>()
    let rows = 0
    NET_TYPES.forEach((t, col) => {
      const list = NET_ENTITIES.filter((e) => e.type === t.id)
      rows = Math.max(rows, list.length)
      list.forEach((e, i) => pos.set(e.name, { x: COL_X[col], y: HEAD + i * ROW, col }))
    })
    return { pos, rows }
  }, [])
  const H = HEAD + rows * ROW

  const links = NET_EDGES.filter(([a, b]) => a === sel || b === sel)
    .map(([a, b, n]) => ({ other: a === sel ? b : a, n }))
    .sort((x, y) => y.n - x.n)
  const linked = new Map(links.map((l) => [l.other, l.n]))
  const cur = NET_ENTITIES.find((e) => e.name === sel) as NetEntity
  const curType = NET_TYPES.find((t) => t.id === cur.type)!

  const path = (a: string, b: string) => {
    let p = pos.get(a)!
    let q = pos.get(b)!
    if (p.col > q.col) [p, q] = [q, p]
    const x1 = p.x + COL_W
    const y1 = p.y + CARD_H / 2
    const x2 = q.x
    const y2 = q.y + CARD_H / 2
    const dx = Math.max(40, (x2 - x1) / 2)
    return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`
  }

  return (
    <div className="w-full box-border rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-20px_rgba(40,10,50,0.25)] p-5 lg:p-6">
      {/* Kopf wie im Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[0.8125rem]">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink text-[0.9375rem]">Entitäten</span>
          <span className="rounded-full bg-[#ecf2fe] text-[#2563eb] px-2 py-0.5 text-[0.75rem] font-medium">Vertraulich · 41.870 Treffer</span>
          <span className="text-muted/80">Erste 200 Treffer analysiert</span>
        </span>
        <span className="inline-flex rounded-lg bg-[#f4f2f6] p-0.5 text-[0.75rem]">
          {['Liste', 'Netz', 'Diagramme'].map((v) => (
            <span key={v} className={`rounded-md px-2.5 py-1 ${v === 'Netz' ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}>
              {v}
            </span>
          ))}
        </span>
      </div>

      {/* Netz */}
      <div ref={wrapRef} className="relative mt-5 w-full" style={{ height: H * scale }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <svg aria-hidden="true" width={W} height={H} className="absolute inset-0 overflow-visible">
            {NET_EDGES.map(([a, b]) => {
              const on = a === sel || b === sel
              return on ? null : <path key={`${a}|${b}`} d={path(a, b)} fill="none" stroke="#ebe7ee" strokeWidth="1" />
            })}
            {links.map(({ other }) => (
              <path key={`on|${other}`} d={path(sel, other)} fill="none" stroke="#601571" strokeWidth="1.6" strokeDasharray="5 4" className="net-flow" />
            ))}
          </svg>
          {NET_TYPES.map((t, col) => (
            <div key={t.id} className="absolute flex items-center gap-1.5 text-[12px] font-medium text-muted" style={{ left: COL_X[col], top: 0 }}>
              <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
              {t.label}
              <span className="text-muted/60">{NET_ENTITIES.filter((e) => e.type === t.id).length}</span>
            </div>
          ))}
          {NET_ENTITIES.map((e) => {
            const p = pos.get(e.name)!
            const isSel = e.name === sel
            const n = linked.get(e.name)
            const dim = !isSel && n === undefined
            return (
              <button
                key={e.name}
                type="button"
                onClick={() => setSel(e.name)}
                aria-pressed={isSel}
                // Karte bleibt deckend (Linien laufen dahinter), nur der Inhalt tritt bei nicht verbundenen zurück.
                className={`group absolute box-border flex items-center gap-2 rounded-lg border-0 bg-white px-2.5 text-left font-[inherit] cursor-pointer outline-none transition-[box-shadow] duration-300 ${
                  dim ? '[&>*]:opacity-40 hover:[&>*]:opacity-80' : ''
                }`}
                style={{
                  left: p.x,
                  top: p.y,
                  width: COL_W,
                  height: CARD_H,
                  boxShadow: isSel
                    ? '0 0 0 1.5px #601571, 0 8px 22px -10px rgba(96,21,113,0.45)'
                    : n !== undefined
                      ? '0 0 0 1px #d9c6e0'
                      : '0 0 0 1px #ebe7ee',
                  background: isSel ? '#f6eff9' : '#fff',
                }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: NET_TYPES[p.col].color }} />
                <span className={`flex-1 min-w-0 truncate text-[13px] ${isSel ? 'font-semibold text-ink' : 'text-ink'}`}>{e.name}</span>
                {n !== undefined ? (
                  <span className="rounded-full bg-[#f3ecf6] px-1.5 text-[11px] font-medium text-[#601571] tabular-nums">{n}</span>
                ) : (
                  <span className="text-[11px] text-muted/70 tabular-nums">{e.count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Erklärung zur Auswahl */}
      <div className="mt-5 border-t border-line pt-4 flex flex-col gap-2.5 text-[0.875rem]">
        <p className="m-0 text-ink">
          <span className="font-semibold">{cur.name}</span>{' '}
          <span className="text-muted">
            · {curType.label} · in {cur.count} von 200 Dokumenten genannt
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-muted/80 mr-1">Gemeinsam genannt mit</span>
          {links.map((l) => (
            <button
              key={l.other}
              type="button"
              onClick={() => setSel(l.other)}
              className="rounded-full border-0 bg-[#f4f2f6] px-2.5 py-1 text-[0.75rem] text-ink font-[inherit] cursor-pointer hover:bg-[#ece6f0] outline-none focus-visible:ring-2 focus-visible:ring-[#d9c6e0]"
            >
              {l.other} <span className="text-muted tabular-nums">{l.n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
