import { useEffect, useState } from 'react'
import { useInView } from '../../lib/useInView'
import { SubCard } from './shared'

// Collection im Aufbau wie attio.com: oben ein Produktbild mit schwebender Karte,
// darunter zwei Kleinkarten mit eigener Grafik. Zahlen wie im Ingest-Video
// (App-Previews/src/apps/ediscovery/data.ts): enron-archiv, 500.000 Dateien.

/** Zählt von 0 auf `to` hoch, sobald `run` wahr wird (ease-out). */
function useCount(to: number, run: boolean, ms = 2200, delay = 0) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    // Bei „Bewegung reduzieren“ springt der Zähler im ersten Frame auf den Endwert.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const t0 = performance.now() + (reduce ? 0 : delay)
    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min(1, Math.max(0, (now - t0) / ms))
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, run, ms, delay])
  return v
}

const fmt = (n: number) => n.toLocaleString('de-DE')

export function CollectionVisual() {
  return (
    <>
      {/* Oben: Plattform mit 500.000 Dokumenten, rechts schwebt die Ingest-Karte */}
      <div className="relative border-t border-line bg-[#f7f4f8] px-8 lg:px-14 py-16 overflow-hidden">
        <div className="relative w-[88%]">
          <img
            src="/images/collection-platform.webp"
            alt="DaSense-Suche mit 500.000 Treffern im Ordner enron-archiv"
            width={1700}
            height={992}
            loading="lazy"
            className="block w-full h-auto rounded-xl ring-1 ring-black/5 shadow-[0_24px_60px_-24px_rgba(40,10,50,0.35)]"
          />
          <TreeFlow />
        </div>
        <IngestCard />
      </div>

      {/* Unten: zwei Kleinkarten */}
      <div className="grid md:grid-cols-2 border-t border-line">
        <SubCard
          title="Live befüllt. Jede Datei gezählt."
          text="Der Ingest füllt den Bestand Ordner für Ordner. Jede Datei wird erfasst, geprüft und protokolliert."
        >
          <IngestFill />
        </SubCard>
        <SubCard
          className="md:border-l border-line"
          title="Ein Bestand für alles."
          text="E-Mails, Office, PDFs, Chats und Archive: über 1.400 Formate landen im selben durchsuchbaren Bestand."
        >
          <FormatOrbit />
        </SubCard>
      </div>
    </>
  )
}

// Laufende Linien über dem Ordnerbaum des Standbilds (Koordinaten in Pixeln des Bildes, 3400 × 1984):
// senkrechte Linie bei x 226 ab y 762, Abzweige bis x 252 im Abstand von 64 px, letzter mit Rundung.
const TREE_X = 226
const TREE_X2 = 252
const TREE_TOP = 762
const TREE_FIRST = 803
const TREE_STEP = 64
const TREE_KIDS = 18

function TreeFlow() {
  const last = TREE_FIRST + TREE_STEP * (TREE_KIDS - 1)
  const ticks = Array.from({ length: TREE_KIDS - 1 }, (_, k) => TREE_FIRST + TREE_STEP * k)
  return (
    <svg aria-hidden="true" viewBox="0 0 3400 1984" className="absolute inset-0 w-full h-full pointer-events-none">
      <g fill="none" stroke="#601571" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 9" className="tree-flow">
        <path d={`M${TREE_X} ${TREE_TOP} V${last - 12} Q${TREE_X} ${last} ${TREE_X + 12} ${last} H${TREE_X2}`} />
        {ticks.map((y) => (
          <path key={y} d={`M${TREE_X} ${y} H${TREE_X2}`} />
        ))}
      </g>
    </svg>
  )
}


function IngestCard() {
  const { ref, inView } = useInView<HTMLDivElement>()
  const files = useCount(500_000, inView, 2600, 300)
  const done = files === 500_000
  return (
    <div
      ref={ref}
      className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/3 w-[min(320px,46%)] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_24px_60px_-20px_rgba(20,60,40,0.35)] p-5 flex flex-col gap-3 text-[0.8125rem]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-muted">Ingest</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ${
            done ? 'bg-[#e7f6ec] text-[#1f7a43]' : 'bg-[#e7f6ec] text-[#2f9e5b]'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full bg-[#2fb36b] ${done ? '' : 'animate-pulse'}`} />
          {done ? 'Index vollständig' : 'wird befüllt'}
        </span>
      </div>
      <div className="text-ink font-medium text-[0.9375rem]">enron-archiv</div>
      <div className="text-muted">
        <span className="text-ink tabular-nums">{fmt(files)}</span> / 500.000 Dateien · ≈ 120 GB
      </div>
      <div className="h-1.5 rounded-full bg-[#eef2ef] overflow-hidden">
        <div className="h-full rounded-full bg-[#2fb36b]" style={{ width: `${(files / 500_000) * 100}%` }} />
      </div>
    </div>
  )
}

const FOLDERS: [string, number][] = [
  ['gas_trading', 58_824],
  ['power_trading', 52_941],
  ['accounting', 38_235],
  ['finance', 35_294],
  ['legal', 32_353],
  ['watkins_s', 5_882],
]

function IngestFill() {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="w-full max-w-[380px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-20px_rgba(40,10,50,0.25)] p-4 flex flex-col gap-1">
      {FOLDERS.map(([name, n], i) => (
        <FolderRow key={name} name={name} total={n} run={inView} delay={i * 260} />
      ))}
    </div>
  )
}

function FolderRow({ name, total, run, delay }: { name: string; total: number; run: boolean; delay: number }) {
  const v = useCount(total, run, 1800, delay)
  const filling = run && v > 0 && v < total
  return (
    <div className="flex items-center gap-3 px-2 py-1.5 rounded-md text-[0.8125rem]">
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a7f8f" strokeWidth="1.6">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
      <span className="text-ink w-[110px] truncate">{name}</span>
      <span className="flex-1 h-1 rounded-full bg-[#eef2ef] overflow-hidden">
        <span className="block h-full rounded-full bg-[#2fb36b]" style={{ width: `${(v / total) * 100}%` }} />
      </span>
      <span
        className={`tabular-nums text-right w-[64px] rounded-full px-1.5 ${
          filling ? 'bg-[#e7f6ec] text-[#1f7a43]' : 'text-muted'
        }`}
      >
        {fmt(v)}
      </span>
    </div>
  )
}

const FORMATS: { label: string; ring: 0 | 1; angle: number; tone: string }[] = [
  { label: 'EML', ring: 0, angle: -60, tone: 'bg-[#eaf1fd] text-[#2f5fc4]' },
  { label: 'PDF', ring: 0, angle: 30, tone: 'bg-[#fdecec] text-[#c43a3a]' },
  { label: 'XLSX', ring: 0, angle: 140, tone: 'bg-[#e7f6ec] text-[#1f7a43]' },
  { label: 'DOCX', ring: 0, angle: 215, tone: 'bg-[#eef0ff] text-[#4b4fc9]' },
  { label: 'PST', ring: 1, angle: -20, tone: 'bg-[#f3ecf6] text-[#601571]' },
  { label: 'Teams-Chat', ring: 1, angle: 70, tone: 'bg-[#efeefe] text-[#5b4fd6]' },
  { label: 'MSG', ring: 1, angle: 165, tone: 'bg-[#eaf1fd] text-[#2f5fc4]' },
  { label: 'ZIP', ring: 1, angle: 245, tone: 'bg-[#f4f2ee] text-[#7a6a3c]' },
]

function FormatOrbit() {
  const { ref, inView } = useInView<HTMLDivElement>()
  const radius = [92, 142]
  return (
    <div ref={ref} className="relative w-[320px] h-[320px]">
      {radius.map((r) => (
        <div
          key={r}
          aria-hidden="true"
          className="absolute rounded-full border border-line"
          style={{ width: r * 2, height: r * 2, left: 160 - r, top: 160 - r }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[104px] h-[104px] rounded-full bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-12px_rgba(40,10,50,0.3)] flex items-center justify-center">
        <img src="/images/dasense-logo.png" alt="DaSense" className="w-[58px] h-auto" />
      </div>
      {FORMATS.map((f, i) => {
        const a = (f.angle * Math.PI) / 180
        const r = radius[f.ring]
        return (
          <span
            key={f.label}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[0.75rem] font-medium whitespace-nowrap ring-1 ring-black/5 transition-all duration-700 ${f.tone} ${
              inView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{ left: 160 + Math.cos(a) * r, top: 160 + Math.sin(a) * r, transitionDelay: `${i * 90}ms` }}
          >
            {f.label}
          </span>
        )
      })}
    </div>
  )
}
