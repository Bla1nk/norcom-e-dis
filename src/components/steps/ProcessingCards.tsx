import { SubCard } from './shared'

// Kleinkarten unter dem Processing-Diagramm: links ein ruhiges Bild (Text → Abschnitte → Vektor),
// rechts die beim Einlesen erkannten Metadaten einer Mail.

export function ProcessingCards() {
  return (
    <div className="grid md:grid-cols-2 border-t border-line">
      <SubCard
        title="Bereit für die lokale KI."
        text="Jedes Dokument wird in Abschnitte zerlegt und lokal vektorisiert. So versteht die KI Inhalte statt nur Stichworte."
      >
        <ChunkStill />
      </SubCard>
      <SubCard
        className="md:border-l border-line"
        title="Inhalte und Metadaten erkannt."
        text="Absender, Empfänger, Datum, Anhänge und Sprache werden beim Einlesen erfasst, auch aus gescannten PDFs per OCR."
      >
        <MetadataCard />
      </SubCard>
    </div>
  )
}

// Mail aus dem Smart-Filter-Video („Re: Absicherung über eigene Aktien“, Risk Assessment & Control, 21.06.2001).
const META: [string, string][] = [
  ['Von', 'Risk Assessment & Control'],
  ['An', 'Structured Finance'],
  ['Datum', '21.06.2001'],
  ['Sprache', 'Englisch'],
  ['Thread', '4 Nachrichten'],
  ['Anhang', 'hedge_overview.xlsx'],
]

const DONE = ['Text extrahiert', 'Metadaten', 'Anhang entpackt']

function MetadataCard() {
  return (
    <div className="w-full max-w-[400px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-20px_rgba(40,10,50,0.25)] overflow-hidden text-[0.8125rem]">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-line">
        <span className="rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-[0.04em] bg-[#eaf1fd] text-[#2f5fc4]">EML</span>
        <span className="text-ink font-medium truncate">Re: Absicherung über eigene Aktien</span>
      </div>
      <dl className="m-0 px-4 py-2 grid grid-cols-[84px_1fr] gap-y-2">
        {META.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted/80">{k}</dt>
            <dd className="m-0 text-ink truncate">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-1.5 px-4 pt-2 pb-4">
        {DONE.map((d) => (
          <span key={d} className="inline-flex items-center gap-1 rounded-full bg-[#e7f6ec] text-[#1f7a43] px-2 py-0.5 text-[0.6875rem] font-medium">
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5L20 7" />
            </svg>
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}


// Ein Text in drei Abschnitten; der mittlere ist markiert (pulsierender Rahmen) und rechts als Vektor zu sehen.
const CHUNKS = [
  [92, 100, 74],
  [100, 86, 96, 58],
  [88, 100, 64],
]
const VECTOR = [0.5, 0.9, 0.35, 0.7, 1, 0.45, 0.8, 0.3, 0.65, 0.95, 0.4, 0.75]

function ChunkStill() {
  return (
    <div aria-hidden="true" className="w-full max-w-[420px] grid grid-cols-[1fr_auto_120px] items-center gap-4">
      <div className="rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-20px_rgba(40,10,50,0.25)] p-3 flex flex-col gap-2">
        {CHUNKS.map((lines, c) => (
          <div
            key={c}
            className={`rounded-lg p-2 flex flex-col gap-1.5 ${c === 1 ? 'chunk-pulse bg-[#f3ecf6]' : ''}`}
          >
            {lines.map((w, l) => (
              <span key={l} className="block h-1.5 rounded-full bg-[#e4dde7]" style={{ width: `${w}%` }} />
            ))}
          </div>
        ))}
      </div>
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" stroke="#b9a9c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 7h24M20 2l5 5-5 5" />
      </svg>
      <div className="flex items-end gap-[3px] h-10">
        {VECTOR.map((h, k) => (
          <span key={k} className="w-[5px] rounded-sm bg-primary" style={{ height: `${h * 100}%`, opacity: 0.25 + h * 0.6 }} />
        ))}
      </div>
    </div>
  )
}
