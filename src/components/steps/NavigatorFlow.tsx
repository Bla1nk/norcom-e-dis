import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useInView } from '../../lib/useInView'

// AI Navigator als Ablauf im Stil von attio.com („Speed to lead“): Knoten werden nacheinander aktiv
// (Plakette „Läuft“, blauer Rahmen), dann „Abgeschlossen“, die Kante zum nächsten Knoten zeichnet sich blau.
// Erst wird die hohe, danach die niedrige Priorität vektorisiert; am Ende bleibt das fertige Bild stehen.
// Kriterien und Ordner sind Platzhalter wie im AiNavigator-Video.

type NodeState = 'idle' | 'run' | 'done' | 'wait'
type NodeId = 'ingest' | 'nav' | 'case' | 'prio' | 'now' | 'later'
type EdgeId = 'e1' | 'e2' | 'e3' | 'hoch' | 'niedrig'

/** Zeichenfläche in px; wird per CSS-Skalierung an die Breite der Fläche angepasst. */
const W = 1040
const H = 560

type NodeDef = { id: NodeId; x: number; y: number; h?: number; title: string; sub: string; icon: ReactNode; tone: string }

const ICON = (d: string) => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const NODES: NodeDef[] = [
  { id: 'ingest', x: 110, y: 60, title: 'Ingest abgeschlossen', sub: '500.000 Dokumente in enron-archiv', tone: 'bg-[#eaf1fd] text-[#2f5fc4]', icon: ICON('M4 7h16M4 12h16M4 17h10') },
  { id: 'nav', x: 480, y: 60, title: 'AI Navigator', sub: 'Bewertet jeden Ordner nach Relevanz', tone: 'bg-[#f3ecf6] text-[#601571]', icon: ICON('M12 3l1.8 4.7L18 9l-4.2 1.3L12 15l-1.8-4.7L6 9l4.2-1.3z') },
  { id: 'case', x: 90, y: 280, title: 'Fallbezug prüfen', sub: 'Abgleich mit Facetten und Suchbegriffen', tone: 'bg-[#e7f6ec] text-[#1f7a43]', icon: ICON('M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3') },
  { id: 'prio', x: 380, y: 280, h: 96, title: 'Priorität', sub: 'Nach Relevanz verzweigen', tone: 'bg-[#efeefe] text-[#5b4fd6]', icon: ICON('M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9') },
  { id: 'now', x: 720, y: 280, title: 'Zuerst vektorisieren', sub: 'Hohe Priorität: structured_finance, legal, rac', tone: 'bg-[#fff1e6] text-[#c2571a]', icon: ICON('M13 2 4 14h7l-1 8 9-12h-7z') },
  { id: 'later', x: 720, y: 430, title: 'Danach vektorisieren', sub: 'Niedrige Priorität: hr, it', tone: 'bg-[#f4f2ee] text-[#7a6a3c]', icon: ICON('M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z') },
]
const NODE_W = 230
const NODE_H = 64

const EDGES: Record<EdgeId, string> = {
  e1: `M${110 + NODE_W} 92 H480`,
  e2: `M${480 + NODE_W} 92 H${480 + NODE_W + 30} Q${480 + NODE_W + 40} 92 ${480 + NODE_W + 40} 102 V186 Q${480 + NODE_W + 40} 196 ${480 + NODE_W + 30} 196 H70 Q60 196 60 206 V302 Q60 312 70 312 H90`,
  e3: `M${90 + NODE_W} 312 H380`,
  hoch: `M${380 + NODE_W} 344 H660 Q670 344 670 334 V322 Q670 312 680 312 H720`,
  niedrig: `M${380 + NODE_W} 360 H660 Q670 360 670 370 V452 Q670 462 680 462 H720`,
}

type Frame = { at: number; nodes?: Partial<Record<NodeId, NodeState>>; edges?: EdgeId[] }

/** Zeitplan in ms ab Sichtbarkeit. Jeder Schritt setzt nur die Änderungen. */
const TIMELINE: Frame[] = [
  { at: 300, nodes: { ingest: 'run' } },
  { at: 1100, nodes: { ingest: 'done' }, edges: ['e1'] },
  { at: 1700, nodes: { nav: 'run' } },
  { at: 3100, nodes: { nav: 'done' }, edges: ['e2'] },
  { at: 3900, nodes: { case: 'run' } },
  { at: 5000, nodes: { case: 'done' }, edges: ['e3'] },
  { at: 5600, nodes: { prio: 'run' } },
  { at: 6600, nodes: { prio: 'done', later: 'wait' }, edges: ['hoch'] },
  { at: 7200, nodes: { now: 'run' } },
  { at: 8800, nodes: { now: 'done' }, edges: ['niedrig'] },
  { at: 9500, nodes: { later: 'run' } },
  { at: 11100, nodes: { later: 'done' } },
]
export const NAVIGATOR_FLOW_MS = 11100
/** Dauer, bis eine Kante fertig gezeichnet ist; erst dann erscheint ihre Pfeilspitze. */
const DRAW_MS = 700

const FINAL: { nodes: Record<NodeId, NodeState>; edges: EdgeId[] } = {
  nodes: { ingest: 'done', nav: 'done', case: 'done', prio: 'done', now: 'done', later: 'done' },
  edges: ['e1', 'e2', 'e3', 'hoch', 'niedrig'],
}

export function NavigatorFlow({ onDone }: { onDone?: () => void }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const [nodes, setNodes] = useState<Record<NodeId, NodeState>>({ ingest: 'idle', nav: 'idle', case: 'idle', prio: 'idle', now: 'idle', later: 'idle' })
  const [edges, setEdges] = useState<EdgeId[]>([])
  // Kanten, die fertig gezeichnet sind (Pfeilspitze sichtbar)
  const [arrows, setArrows] = useState<EdgeId[]>([])
  const [scale, setScale] = useState(1)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  })

  // Zeichenfläche auf die Breite der Fläche skalieren.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  useEffect(() => {
    if (!inView) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers = (reduce ? [{ at: 0, ...FINAL }] : TIMELINE).map((f) =>
      window.setTimeout(() => {
        if (f.nodes) setNodes((n) => ({ ...n, ...f.nodes }))
        if (f.edges) setEdges((e) => [...new Set([...e, ...(f.edges ?? [])])])
      }, f.at),
    )
    // Pfeilspitzen erst, wenn die Linie am Ziel angekommen ist.
    for (const f of reduce ? [{ at: 0, ...FINAL }] : TIMELINE) {
      if (!f.edges) continue
      const list = f.edges
      timers.push(window.setTimeout(() => setArrows((a) => [...new Set([...a, ...list])]), f.at + (reduce ? 0 : DRAW_MS)))
    }
    timers.push(window.setTimeout(() => onDoneRef.current?.(), (reduce ? 0 : NAVIGATOR_FLOW_MS) + 2500))
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: H * scale }}>
      <div
        role="img"
        aria-label="Ablauf AI Navigator: Ingest abgeschlossen, AI Navigator bewertet die Ordner, Fallbezug wird geprüft, nach Priorität werden die wichtigen Ordner zuerst und die übrigen danach vektorisiert"
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        <svg aria-hidden="true" width={W} height={H} className="absolute inset-0 overflow-visible">
          <defs>
            <marker id="nav-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M1 1l8 4-8 4" fill="none" stroke="#3b6fe0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {(Object.keys(EDGES) as EdgeId[]).map((id) => (
            <g key={id} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d={EDGES[id]} stroke="#d4d0d8" strokeWidth="1.2" />
              <path
                d={EDGES[id]}
                stroke="#3b6fe0"
                strokeWidth="1.6"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={edges.includes(id) ? 0 : 1}
                markerEnd={arrows.includes(id) ? 'url(#nav-arrow)' : undefined}
                className="transition-[stroke-dashoffset] duration-700 ease-out"
              />
            </g>
          ))}
        </svg>
        {NODES.map((n) => (
          <FlowNode key={n.id} def={n} state={nodes[n.id]} trigger={n.id === 'ingest'} ports={n.id === 'prio'} />
        ))}
      </div>
    </div>
  )
}

const BADGE: Record<Exclude<NodeState, 'idle'>, { text: string; cls: string }> = {
  run: { text: 'Läuft', cls: 'bg-[#f3ecf6] text-[#7b3b8f] ring-[#e4d3ea]' },
  done: { text: 'Abgeschlossen', cls: 'bg-[#ecfdf3] text-[#15803d] ring-[#c9f0d6]' },
  wait: { text: 'Eingeplant', cls: 'bg-[#f4f2ee] text-[#7a6a3c] ring-[#e7e1d4]' },
}

function FlowNode({ def, state, trigger, ports }: { def: NodeDef; state: NodeState; trigger: boolean; ports: boolean }) {
  const active = state === 'run' || state === 'done'
  const badge = state === 'idle' ? null : BADGE[state]
  return (
    <div
      className={`absolute rounded-xl bg-white px-3 py-2.5 transition-[box-shadow] duration-500 ${
        active ? 'shadow-[0_0_0_1.5px_#3b6fe0,0_8px_24px_-12px_rgba(59,111,224,0.35)]' : 'shadow-[0_0_0_1px_#e3dfe6,0_6px_18px_-12px_rgba(40,10,50,0.2)]'
      }`}
      style={{ left: def.x, top: def.y, width: NODE_W, height: def.h ?? NODE_H }}
    >
      {trigger && (
        <span className="absolute -top-[18px] left-0 rounded-t-md bg-[#3b6fe0] px-2 py-0.5 text-[10px] font-medium text-white">▷ Trigger</span>
      )}
      {badge && (
        <span className={`absolute -top-[11px] right-3 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ${badge.cls}`}>
          {state === 'run' ? (
            <span className="h-2 w-2 rounded-full border border-current border-t-transparent animate-spin" />
          ) : state === 'done' ? (
            <span aria-hidden="true">✓</span>
          ) : null}
          {badge.text}
        </span>
      )}
      <div className="flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${def.tone}`}>{def.icon}</span>
        <span className="text-[14px] font-medium text-ink">{def.title}</span>
      </div>
      <div className="mt-1 text-[11.5px] text-muted/80 truncate">{def.sub}</div>
      {ports && (
        <div className="absolute right-3 bottom-2.5 flex flex-col items-end gap-0.5 text-[10.5px] text-muted">
          <span>Hoch</span>
          <span>Niedrig</span>
        </div>
      )}
    </div>
  )
}
