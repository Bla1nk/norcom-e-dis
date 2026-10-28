import { useState } from 'react'
import { SubCard } from './shared'

// Kleinkarten unter dem Review-Clip (Smart Filter): links die Ja/Nein-Prüfung im Stil der
// Review-Ansicht, rechts die „Facetten-Verteilung“ nachgebaut (Farben und Werte wie im Smart-Filter-Video).
// Dokumente wie in der Review-Liste des Videos.

export function ReviewCards() {
  return (
    <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] border-t border-line">
      <SubCard
        title="Ja oder Nein, mit einem Tastendruck."
        text="Prüfer bestätigen oder verwerfen jeden KI-Treffer mit J oder N. Jede Entscheidung landet im Review-Ordner und bleibt nachvollziehbar."
      >
        <JaNeinList />
      </SubCard>
      <SubCard
        className="md:border-l border-line"
        title="Das Ergebnis auf einen Blick."
        text="Die Facetten-Verteilung zeigt, wie viele Dokumente der Smart Filter je Facette gefunden hat: 41.870 davon als vertraulich."
      >
        <FacetChart />
      </SubCard>
    </div>
  )
}

type Verdict = 'ja' | 'nein' | null

const ROWS: { name: string; type: string; verdict: Verdict }[] = [
  { name: 'FW: Raptor valuation (do not forward).eml', type: 'EML', verdict: 'ja' },
  { name: 'RE: Term sheet Q3 hedging.eml', type: 'EML', verdict: 'ja' },
  { name: 'Board prep – confidential.msg', type: 'MSG', verdict: 'nein' },
  { name: 'Draft memo partnerships.docx', type: 'DOCX', verdict: 'ja' },
  { name: 'Notes call outside counsel.eml', type: 'EML', verdict: null },
]

function JaNeinList() {
  return (
    <div className="w-full max-w-[460px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-20px_rgba(40,10,50,0.25)] overflow-hidden text-[0.8125rem]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <span className="flex items-center gap-2">
          <span className="text-ink font-medium">Dokumente</span>
          <span className="rounded-full bg-[#f3ecf6] text-[#601571] px-2 py-0.5 text-[0.6875rem]">Prüfset Vertraulich</span>
        </span>
        <span className="text-muted/80 tabular-nums">4 von 50 bewertet</span>
      </div>
      <ul className="list-none m-0 p-0">
        {ROWS.map((r, i) => (
          <li
            key={r.name}
            className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-[#f1edf3]' : ''} ${
              r.verdict === null ? 'bg-[#faf7fb]' : ''
            }`}
          >
            <span className="w-[38px] shrink-0 rounded bg-[#f4f2f6] text-center text-[0.625rem] font-semibold text-muted py-0.5">{r.type}</span>
            <span className="flex-1 min-w-0 truncate text-[#601571]">{r.name}</span>
            <Btn label="Ja" on={r.verdict === 'ja'} tone="ja" />
            <Btn label="Nein" on={r.verdict === 'nein'} tone="nein" />
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-line text-[0.6875rem] text-muted/80">
        <Key>J</Key> Ja <Key>N</Key> Nein <Key>↓</Key> nächstes Dokument
      </div>
    </div>
  )
}

function Btn({ label, on, tone }: { label: string; on: boolean; tone: 'ja' | 'nein' }) {
  const active = tone === 'ja' ? 'bg-[#e7f6ec] text-[#1f7a43] ring-[#bfe8cd]' : 'bg-[#fdecec] text-[#b42318] ring-[#f6c9c5]'
  return (
    <span
      className={`shrink-0 rounded-md px-2.5 py-1 text-[0.75rem] font-medium ring-1 ${
        on ? active : 'bg-white text-ink ring-[#e3dfe6]'
      }`}
    >
      {on && (tone === 'ja' ? '✓ ' : '✕ ')}
      {label}
    </span>
  )
}

function Key({ children }: { children: string }) {
  return <kbd className="rounded border border-line bg-white px-1.5 py-px font-sans text-[0.625rem] text-ink">{children}</kbd>
}

// Werte und Farben wie im Smart-Filter-Video (src/apps/smartfilter/data.ts).
// soft = Ruhefarbe, strong = Farbe der gewählten Facette (popt beim Klick).
const FACETS = [
  { name: 'Bilanzrisiken', n: 18_420, soft: '#c5b0cf', strong: '#8e44ad', tint: '#f4ebf8' },
  { name: 'Interessenkonflikt', n: 6_315, soft: '#a9cfc8', strong: '#0f9b8e', tint: '#e6f6f3' },
  { name: 'Vertraulich', n: 41_870, soft: '#93b4f5', strong: '#2563eb', tint: '#ecf2fe' },
]
const TOTAL = FACETS.reduce((a, f) => a + f.n, 0)
const de = (n: number) => n.toLocaleString('de-DE')
const pct = (n: number) => `${((n / TOTAL) * 100).toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} %`

// Interaktiv: Klick auf eine Facette (Liste oder Ring) hebt sie dezent hervor; Farben bleiben voll.
function FacetChart() {
  const [sel, setSel] = useState(2)
  const r = 70
  const c = 2 * Math.PI * r
  // Startposition jedes Ringsegments = Summe der vorherigen Segmente.
  const starts = FACETS.map((_, i) => FACETS.slice(0, i).reduce((a, f) => a + (f.n / TOTAL) * c, 0))
  const cur = FACETS[sel]
  return (
    <div className="w-full box-border rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-20px_rgba(40,10,50,0.25)] p-5 text-left">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.875rem]">
          <span className="font-semibold text-ink">Facetten-Verteilung</span>{' '}
          <span className="text-muted/80">Compliance-Prüfung 2001</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full ring-1 ring-[#d9c6e0] px-2 py-0.5 text-[0.75rem] text-ink">
          <span className="relative h-3 w-5 rounded-full bg-primary">
            <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white" />
          </span>
          Nur facettierte
        </span>
      </div>
      <div className="mt-4 grid grid-cols-[160px_minmax(0,1fr)] items-center gap-6">
        <svg viewBox="0 0 180 180" className="w-[160px] h-[160px]" role="group" aria-label="Ring der Facetten-Verteilung">
          <g className="-rotate-90 origin-center">
            {FACETS.map((f, i) => (
              <circle
                key={f.name}
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke={i === sel ? f.strong : f.soft}
                strokeWidth={i === sel ? 25 : 22}
                strokeDasharray={`${(f.n / TOTAL) * c - 2} ${c}`}
                strokeDashoffset={-starts[i]}
                onClick={() => setSel(i)}
                className="cursor-pointer transition-[stroke-width,stroke] duration-300"
              />
            ))}
          </g>
          <text x="90" y="94" textAnchor="middle" className="fill-ink" style={{ font: '700 26px Helvetica, Arial, sans-serif' }}>
            {de(cur.n)}
          </text>
          <text
            x="90"
            y="113"
            textAnchor="middle"
            className="fill-muted"
            // Lange Namen (Interessenkonflikt) kleiner, damit sie nicht an den Ring stoßen.
            style={{ font: `600 ${cur.name.length > 12 ? 7 : 9}px Helvetica, Arial, sans-serif`, letterSpacing: cur.name.length > 12 ? '0.06em' : '0.12em' }}
          >
            {cur.name.toUpperCase()}
          </text>
        </svg>
        <ul className="min-w-0 list-none m-0 p-0 flex flex-col gap-1.5 text-[0.875rem]">
          {FACETS.map((f, i) => {
            const on = i === sel
            return (
              <li key={f.name}>
                <button
                  type="button"
                  onClick={() => setSel(i)}
                  aria-pressed={on}
                  className={`w-full box-border cursor-pointer rounded-lg border-0 px-2.5 py-1.5 text-left font-[inherit] text-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-[#d9c6e0] transition-colors duration-300 ${
                    on ? '' : 'bg-transparent hover:bg-[#faf7fb]'
                  }`}
                  style={on ? { background: f.tint } : undefined}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={`flex items-center gap-2 ${on ? 'text-ink font-semibold' : 'text-muted'}`}>
                      <span className="h-2.5 w-2.5 rounded-sm transition-colors duration-300" style={{ background: on ? f.strong : f.soft }} />
                      {f.name}
                    </span>
                    <span className="tabular-nums">
                      <span className={on ? 'text-ink font-semibold' : 'text-muted'}>{de(f.n)}</span>{' '}
                      <span className="text-muted/60 text-[0.75rem]">{pct(f.n)}</span>
                    </span>
                  </span>
                  <span className="mt-1.5 block h-1.5 rounded-full bg-[#f1eef3] overflow-hidden">
                    <span
                      className="block h-full rounded-full transition-colors duration-300"
                      style={{ width: `${(f.n / FACETS[2].n) * 100}%`, background: on ? f.strong : f.soft }}
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
