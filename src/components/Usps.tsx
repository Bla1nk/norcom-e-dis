import { useEffect, useState, type ReactNode } from 'react'
import { useInView } from '../lib/useInView'
import { USPS, USP_INTRO } from '../content/usps'

// „Warum DaSense“ im Stil von linear.app: dunkler Abschnitt, je Punkt große Überschrift links, Text rechts,
// darunter eine Komposition aus einem vorderen Panel, das ein abgeblendetes App-Bild überlappt.
// Inhalte des SenseBot-Panels aus dem SenseBot-Video (öffentlicher Enron-Datensatz; nur das Watkins-Schreiben
// ist einer realen Person zugeordnet, Originalwortlaut).

const WRAP = 'box-border max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-8 lg:px-12'

const PANEL = 'rounded-2xl bg-[#16141b] ring-1 ring-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]'

const VISUALS: ReactNode[] = [<SovereigntyScene key="s" />, <SenseBotScene key="b" />, <ReviewScene key="r" />]

export function Usps() {
  return (
    <section aria-labelledby="usp-h" className="relative overflow-hidden bg-[#0b0a0e] text-[#ececf1]">
      {/* Einleitung: gestaffelte Headline über die volle Breite, darunter Text und Inhaltsübersicht */}
      <div className={`${WRAP} pt-36 pb-4`}>
        <span className="text-[0.8125rem] font-medium tracking-[0.12em] uppercase text-[#c39bd3]">{USP_INTRO.eyebrow}</span>
        <h2 id="usp-h" className="mt-6 mb-0 max-w-[18ch] text-[clamp(2.75rem,6vw,5.5rem)] leading-[1] tracking-[-0.04em] font-medium">
          {USP_INTRO.heading.split('. ').map((part, k, arr) => (
            <span
              key={part}
              className={['text-white', 'text-[#6f6a78]', 'bg-gradient-to-r from-[#c39bd3] via-[#a46ad0] to-[#7b3fa0] bg-clip-text text-transparent'][k]}
            >
              {part}
              {k < arr.length - 1 ? '. ' : ''}
            </span>
          ))}
        </h2>
        <p className="mt-8 mb-0 max-w-[40rem] text-[1.1875rem] leading-[1.55] text-[#a19dab]">{USP_INTRO.text}</p>
        <nav aria-label="Warum DaSense: Übersicht" className="mt-16 grid sm:grid-cols-3 gap-6">
          {USPS.map((usp) => (
            <a
              key={usp.num}
              href={`#usp-${usp.num}`}
              className="group border-t border-white/10 pt-4 no-underline text-[#a19dab] hover:border-[#b06fd1] transition-colors"
            >
              <span className="block text-[0.8125rem] tracking-[0.12em] text-[#6f6a78] group-hover:text-[#c39bd3] transition-colors">{usp.num}</span>
              <span className="mt-1.5 block text-[1rem] leading-snug text-[#d6d3dd] group-hover:text-white transition-colors">
                {usp.title.split('. ')[0].replace(/\.$/, '')}
              </span>
            </a>
          ))}
        </nav>
      </div>

      {USPS.map((usp, i) => (
        <div key={usp.num} id={`usp-${usp.num}`} className={`${WRAP} pt-32 pb-8 scroll-mt-16`}>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-24 items-start">
            <div>
              <span className="text-[0.8125rem] font-medium tracking-[0.12em] text-[#6f6a78]">{usp.num}</span>
              <h3 className="mt-3 mb-0 text-[clamp(1.875rem,2.8vw,2.75rem)] leading-[1.08] tracking-[-0.025em] font-medium text-white">
                {usp.title}
              </h3>
            </div>
            <p className="m-0 lg:pt-8 text-[1.1875rem] leading-[1.5] text-[#a19dab] max-w-[34rem]">{usp.text}</p>
          </div>
          <div className={`relative mt-20 ${i === 1 ? 'h-[580px]' : 'h-[540px]'}`}>{VISUALS[i]}</div>
        </div>
      ))}
      <div className="h-40" />
    </section>
  )
}



/* ---------- 01 Datensouveränität ---------- */

type Mode = 'cloud' | 'onprem' | 'airgap'

const MODES: { id: Mode; name: string; sub: string; note: string }[] = [
  { id: 'cloud', name: 'Deutsche Cloud', sub: 'Rechenzentrum in Deutschland', note: 'Verschlüsselte Verbindung, Verarbeitung ausschließlich in Deutschland.' },
  { id: 'onprem', name: 'On-Premise', sub: 'In Ihrem Rechenzentrum', note: 'DaSense und alle KI-Modelle laufen in Ihrem eigenen Netz.' },
  { id: 'airgap', name: 'Air-Gapped', sub: 'Ohne Verbindung nach außen', note: 'Abgeschottetes Netz: keine Verbindung ins Internet.' },
]

function SovereigntyScene() {
  const [mode, setMode] = useState<Mode>('cloud')
  const cur = MODES.find((m) => m.id === mode)!
  return (
    <>
      {/* Fläche liegt hinter dem Panel (wie bei Linear); das Schaubild beginnt rechts neben dem Panel */}
      <div
        className="absolute left-[16%] right-[-6%] top-12 bottom-0 overflow-hidden rounded-2xl bg-[#100e14] ring-1 ring-white/[0.06] dot-grid-night"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%), linear-gradient(to bottom, black 75%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskImage: 'linear-gradient(to right, black 80%, transparent 100%), linear-gradient(to bottom, black 75%, transparent 100%)',
          maskComposite: 'intersect',
        }}
      >
        <div className="absolute inset-y-0 right-[6%] left-[min(300px,34%)]">
          <DeploymentDiagram mode={mode} />
        </div>
      </div>
      <div className={`absolute left-0 top-0 w-[min(440px,100%)] ${PANEL}`}>
        <div className="px-6 py-5 border-b border-white/[0.07] flex items-center justify-between">
          <span className="text-[1rem] font-medium text-white">Betrieb</span>
          <span className="text-[0.75rem] text-[#8e8a96]">DaSense eDiscovery</span>
        </div>
        <div role="radiogroup" aria-label="Betriebsmodell" className="p-4 flex flex-col gap-2">
          {MODES.map((m) => {
            const on = m.id === mode
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-3.5 rounded-xl border-0 px-4 py-3.5 text-left font-[inherit] cursor-pointer ring-1 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#b06fd1] ${
                  on ? 'bg-[#2a1d33] ring-[#7b4a92]' : 'bg-transparent ring-white/[0.07] hover:bg-white/[0.03]'
                }`}
              >
                <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ring-1 transition-colors ${on ? 'bg-[#b06fd1] ring-[#b06fd1]' : 'ring-white/25'}`}>
                  {on && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span className="flex flex-col">
                  <span className={`text-[0.9375rem] ${on ? 'text-white font-medium' : 'text-[#d6d3dd]'}`}>{m.name}</span>
                  <span className="text-[0.8125rem] text-[#8e8a96]">{m.sub}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="px-6 pb-5 text-[0.8125rem] text-[#a19dab] min-h-[2.5em]">{cur.note}</div>
      </div>
    </>
  )
}

/* Schaubild je Betriebsmodell. Zeichenfläche 720 × 440, skaliert per viewBox. */
const STACK = ['DaSense', 'Lokale KI', 'Index']

function Node({ x, y, w, h, title, sub, icon }: { x: number; y: number; w: number; h: number; title: string; sub?: string; icon: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="14" fill="#1a1720" stroke="rgba(255,255,255,0.12)" />
      <g transform={`translate(${x + 16} ${y + h / 2 - 11})`} stroke="#c39bd3" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </g>
      <text x={x + 48} y={sub ? y + h / 2 - 3 : y + h / 2 + 5} fill="#ececf1" style={{ font: '500 14px Helvetica, Arial, sans-serif' }}>
        {title}
      </text>
      {sub && (
        <text x={x + 48} y={y + h / 2 + 15} fill="#8e8a96" style={{ font: '400 11.5px Helvetica, Arial, sans-serif' }}>
          {sub}
        </text>
      )}
    </g>
  )
}

function StackBox({ x, y, w, h, label, tone }: { x: number; y: number; w: number; h: number; label: string; tone: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="18" fill="rgba(255,255,255,0.02)" stroke={tone} strokeDasharray="6 5" />
      <text x={x + 18} y={y + 26} fill={tone} style={{ font: '600 11px Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>
        {label}
      </text>
      {STACK.map((s, i) => (
        <g key={s}>
          <rect x={x + 18} y={y + 44 + i * 46} width={w - 36} height="36" rx="10" fill="#1a1720" stroke="rgba(255,255,255,0.1)" />
          <circle cx={x + 34} cy={y + 62 + i * 46} r="3.5" fill="#4ade80" />
          <text x={x + 48} y={y + 66 + i * 46} fill="#e2e0e8" style={{ font: '500 13px Helvetica, Arial, sans-serif' }}>
            {s}
          </text>
        </g>
      ))}
    </g>
  )
}

const USERS = (
  <>
    <circle cx="8" cy="7" r="3.5" />
    <path d="M1.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
    <circle cx="17" cy="8" r="2.8" />
    <path d="M16 13.6c3.3-.3 6 2.3 6 6" />
  </>
)
const GLOBE = (
  <>
    <circle cx="11" cy="11" r="9" />
    <path d="M2 11h18M11 2c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S8.5 4.5 11 2z" />
  </>
)

function DeploymentDiagram({ mode }: { mode: Mode }) {
  const show = (m: Mode) => ({ opacity: mode === m ? 1 : 0, transition: 'opacity 450ms ease' })
  return (
    <svg viewBox="0 0 720 440" className="absolute inset-0 h-full w-full" role="img" aria-label={`Schaubild Betrieb: ${MODES.find((m) => m.id === mode)!.name}`}>
      {/* Deutsche Cloud: Team -> verschlüsselte Verbindung -> Rechenzentrum in Deutschland */}
      <g style={show('cloud')}>
        <Node x={40} y={180} w={190} h={64} title="Ihr Team" sub="Browser" icon={USERS} />
        <path d="M230 212 C 300 212 330 212 404 212" fill="none" stroke="#b06fd1" strokeWidth="1.8" strokeDasharray="6 6" className="flow-12" />
        <rect x="273" y="196" width="88" height="22" rx="11" fill="#1f1726" stroke="rgba(176,111,209,0.5)" />
        <text x="317" y="211" textAnchor="middle" fill="#c39bd3" style={{ font: '500 10.5px Helvetica, Arial, sans-serif' }}>verschlüsselt</text>
        <path d="M455 66 a40 40 0 0 1 76 -10 a32 32 0 0 1 54 26 a26 26 0 0 1 -6 52 h-120 a34 34 0 0 1 -4 -68z" fill="none" stroke="#c39bd3" strokeWidth="1.6" transform="translate(-14 0)" />
        <text x="512" y="106" textAnchor="middle" fill="#c39bd3" style={{ font: '600 11px Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>CLOUD</text>
        <StackBox x={404} y={150} w={276} h={190} label="RECHENZENTRUM IN DEUTSCHLAND" tone="#c39bd3" />
      </g>

      {/* On-Premise: alles im eigenen Netz */}
      <g style={show('onprem')}>
        <rect x="24" y="40" width="672" height="360" rx="22" fill="none" stroke="rgba(176,111,209,0.55)" strokeDasharray="7 6" />
        <text x="46" y="70" fill="#c39bd3" style={{ font: '600 11px Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>IHR NETZ</text>
        <Node x={60} y={180} w={190} h={64} title="Ihr Team" sub="Browser" icon={USERS} />
        <path d="M250 212 C 330 212 350 212 420 212" fill="none" stroke="#b06fd1" strokeWidth="1.8" strokeDasharray="6 6" className="flow-12" />
        <StackBox x={420} y={110} w={240} h={190} label="IHR RECHENZENTRUM" tone="#c39bd3" />
      </g>

      {/* Air-Gapped: abgeschottetes Netz, Internet getrennt */}
      <g style={show('airgap')}>
        <rect x="24" y="40" width="520" height="360" rx="22" fill="none" stroke="#b06fd1" strokeWidth="1.6" />
        <g transform="translate(510 28)">
          <rect x="0" y="0" width="28" height="28" rx="8" fill="#2a1d33" stroke="#b06fd1" />
          <g transform="translate(7 6)" stroke="#e8d5f1" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <rect x="0" y="6" width="14" height="10" rx="2" />
            <path d="M3 6V4a4 4 0 0 1 8 0v2" />
          </g>
        </g>
        <text x="46" y="70" fill="#c39bd3" style={{ font: '600 11px Helvetica, Arial, sans-serif', letterSpacing: '0.08em' }}>ABGESCHOTTETES NETZ</text>
        <Node x={50} y={180} w={170} h={64} title="Ihr Team" sub="Browser" icon={USERS} />
        <path d="M220 212 C 270 212 290 212 320 212" fill="none" stroke="#b06fd1" strokeWidth="1.8" strokeDasharray="6 6" className="flow-12" />
        <StackBox x={320} y={110} w={200} h={190} label="IHRE SERVER" tone="#c39bd3" />
        {/* Unterbrochene Verbindung: Lücke in der Mitte, X auf dunklem Kreis */}
        <path d="M544 212 H 558 M 586 212 H 600" fill="none" stroke="rgba(248,113,113,0.6)" strokeWidth="1.6" strokeDasharray="4 4" />
        <circle cx="572" cy="212" r="11" fill="#1e1316" stroke="rgba(248,113,113,0.55)" />
        <path d="M567 207l10 10M577 207l-10 10" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
        <g transform="translate(600 178)">
          <rect x="0" y="0" width="100" height="68" rx="14" fill="#1a1720" stroke="rgba(255,255,255,0.08)" />
          <g transform="translate(39 10)" stroke="#6f6a78" strokeWidth="1.6" fill="none">{GLOBE}</g>
          <text x="50" y="54" textAnchor="middle" fill="#6f6a78" style={{ font: '500 11.5px Helvetica, Arial, sans-serif' }}>Internet</text>
        </g>
      </g>
    </svg>
  )
}

/* ---------- 02 SenseBot ---------- */
// Reihe von SenseBot-Fenstern wie Linears „AI and automations“: mittleres Fenster im Fokus, äußere laufen aus.
// Inhalte aus dem SenseBot-Video (Fragen, Antwort, Quellentitel). Einer realen Person zugeordnet ist nur das
// Watkins-Schreiben (Originalwortlaut); die übrigen Fenster nennen nur Dokumente.

type Chat = { q: string; worked: string; passages: string; intro: string; items: { b: string; t: string; n: number }[]; foot?: string }

const CHATS: Chat[] = [
  {
    q: 'Kalifornien Energiekrise 2001',
    worked: 'Gearbeitet 5 s · 9 Textstellen in 8 Dokumenten',
    passages: '9 passende Textstellen',
    intro: 'Die Dokumente zur Energiekrise betreffen vor allem:',
    items: [
      { b: 'Großhandelspreise', t: 'in Kalifornien', n: 1 },
      { b: 'Kommunikation', t: 'mit Regulierern', n: 2 },
    ],
    foot: 'Quellen 8',
  },
  {
    q: 'Fasse die wichtigsten Risiken zusammen',
    worked: 'Gearbeitet 9 s · 12 Textstellen in 11 Dokumenten',
    passages: '12 passende Textstellen',
    intro: 'Drei Risikothemen tauchen wiederholt auf:',
    items: [
      { b: 'Absicherungen', t: 'über eigene Aktien', n: 1 },
      { b: 'Bewertungen', t: 'im Merchant-Portfolio', n: 4 },
      { b: 'Interessenkonflikte', t: 'bei Partnerschaften', n: 5 },
    ],
    foot: 'Quellen 11',
  },
  {
    q: 'Wer hat intern vor dem Zusammenbruch gewarnt?',
    worked: 'Gearbeitet 6 s · 15 Textstellen in 14 Dokumenten',
    passages: '15 passende Textstellen',
    intro: 'In den 500.000 Dokumenten finden sich mehrere interne Warnungen aus dem Jahr 2001:',
    items: [
      { b: 'Raptor-Absicherungen', t: 'hingen am Kurs der eigenen Aktie', n: 1 },
      { b: 'Risk Assessment & Control', t: 'empfahl, vor dem Quartalsende zu eskalieren', n: 2 },
      { b: 'Sherron Watkins', t: 'fürchtete, Enron werde „in einer Welle von Bilanzskandalen implodieren“', n: 3 },
    ],
    foot: 'Quellen 14',
  },
  {
    q: 'Welche Fristen werden erwähnt?',
    worked: 'Gearbeitet 4 s · 7 Textstellen in 6 Dokumenten',
    passages: '7 passende Textstellen',
    intro: 'Genannt werden vor allem diese Termine:',
    items: [
      { b: 'Quartalsende Q3 2001', t: 'für die Eskalation', n: 2 },
      { b: '22.08.2001', t: 'Termin mit der Geschäftsleitung', n: 6 },
    ],
    foot: 'Quellen 6',
  },
  {
    q: 'Raptor-Strukturen erklärt',
    worked: 'Gearbeitet 7 s · 10 Textstellen in 8 Dokumenten',
    passages: '10 passende Textstellen',
    intro: 'Die Dokumente beschreiben die Strukturen so:',
    items: [
      { b: 'Absicherungskapazität', t: 'hängt am Aktienkurs', n: 1 },
      { b: 'Statusbericht', t: 'vom 03.08.2001', n: 1 },
    ],
    foot: 'Quellen 8',
  },
]

// Look des SenseBot aus UI 2.0 (Styles aus App-Previews/src/apps/sensebot/styles.ts, Port von theme.scss .d2-sb*).
const SB = { text: '#0d0d0d', text2: '#5d5d5d', text3: '#8f8f8f', line: '#e5e5e5', user: '#e9f0fb', blue: '#2f6fec' }
const TYPE_DOT: Record<string, [string, string]> = {
  P: ['#fde8e8', '#b91c1c'],
  E: ['#e8f0fe', '#1d4ed8'],
  D: ['#e8eefc', '#1e40af'],
  X: ['#e6f4ea', '#15803d'],
}

/** Ablauf einer Antwort wie im SenseBot: Frage → Live-Schritte → „Gearbeitet …“ → Antwortpunkte → Quellen. */
type Phase = { q: boolean; steps: number; collapsed: boolean; items: number; foot: boolean }
const DONE_PHASE: Phase = { q: true, steps: 3, collapsed: true, items: 99, foot: true }
/** Noch nicht gefragt: nur die Frage ist zu sehen, keine Antwort. */
const ASK_PHASE: Phase = { q: true, steps: -1, collapsed: false, items: 0, foot: false }

function useAnswerPhase(run: number, active: boolean, seen: boolean): Phase {
  const [ph, setPh] = useState<Phase>(DONE_PHASE)
  useEffect(() => {
    if (!active) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const plan: [number, Partial<Phase>][] = reduce
      ? [[0, DONE_PHASE]]
      : [
          [0, { q: false, steps: 0, collapsed: false, items: 0, foot: false }],
          [250, { q: true }],
          [700, { steps: 1 }],
          [1500, { steps: 2 }],
          [2700, { steps: 3 }],
          [3300, { collapsed: true }],
          [3600, { items: 1 }],
          [4000, { items: 2 }],
          [4400, { items: 3 }],
          [4900, { foot: true }],
        ]
    const t = plan.map(([at, patch]) => window.setTimeout(() => setPh((p) => ({ ...p, ...patch })), at))
    return () => t.forEach(clearTimeout)
  }, [run, active])
  return active ? ph : seen ? DONE_PHASE : ASK_PHASE
}

function Spinner() {
  return <span className="inline-block h-3 w-3 shrink-0 rounded-full border-2 border-[#e5e5e5] border-t-[#5d5d5d] animate-spin" />
}

function ChatWindow({ chat, focus, phase }: { chat: Chat; focus: boolean; phase: Phase }) {
  const steps: [string, string][] = [
    ['Dokumente eingegrenzt', 'Alle Treffer · 500.000'],
    ['500.000 Dokumente mit Deep Fusion durchsucht', chat.passages],
    ['Antwort formuliert', 'mit Quellenangaben'],
  ]
  const reveal = (on: boolean) => `transition-all duration-500 ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'}`
  return (
    <div
      className={`w-[420px] shrink-0 h-[520px] flex flex-col rounded-2xl bg-white overflow-hidden ${
        focus ? 'shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]' : ''
      }`}
      style={{ color: SB.text, fontSize: 14 }}
    >
      {/* Kopf wie im Panel: Titel links, Dokumentauswahl rechts */}
      <div className="flex items-center gap-2 px-4 h-[52px] border-b" style={{ borderColor: SB.line }}>
        <span className="font-semibold text-[14px]">SenseBot</span>
        <span className="ml-auto inline-flex rounded-full bg-[#f4f4f4] p-[3px] text-[12px] whitespace-nowrap">
          <span className="rounded-full bg-white px-2.5 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            Alle Treffer <i className="not-italic" style={{ color: SB.text3 }}>500.000</i>
          </span>
          <span className="px-2.5 py-1" style={{ color: SB.text2 }}>Nur Ja</span>
        </span>
      </div>

      <div className="flex-1 min-h-0 px-4 pt-4 flex flex-col">
        <div className={`self-end max-w-[85%] rounded-[18px] px-4 py-2.5 text-[14px] leading-[1.5] ${reveal(phase.q)}`} style={{ background: SB.user }}>
          {chat.q}
        </div>
        <div className={`self-end mt-1 mr-1.5 text-[11px] ${reveal(phase.q)}`} style={{ color: SB.text3 }}>
          Alle Treffer · 500.000 Dokumente
        </div>
        {phase.collapsed ? (
          <div className="mt-3 flex items-center gap-2 text-[13px] min-w-0" style={{ color: SB.text3 }}>
            <span aria-hidden="true">✧</span>
            <span className="shrink-0" style={{ color: SB.text2 }}>{chat.worked.split(' · ')[0]}</span>
            <span className="truncate">{chat.worked.split(' · ')[1]}</span>
            <span aria-hidden="true">›</span>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-1 text-[13px]">
            {steps.slice(0, phase.steps < 0 ? 0 : Math.min(3, phase.steps + 1)).map(([t, d], k) => (
              <div key={t} className="flex items-center gap-2 min-w-0 animate-[fadeIn_.3s_ease]">
                {k < phase.steps ? (
                  <span className="grid h-3 w-3 shrink-0 place-items-center text-[11px] text-[#067647]">✓</span>
                ) : (
                  <Spinner />
                )}
                <span className="truncate" style={{ color: SB.text2 }}>{t}</span>
                <span className="shrink-0" style={{ color: SB.text3 }}>{d}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2.5 text-[14px] leading-[1.6]">
          <p className={`m-0 mb-2 ${reveal(phase.items > 0)}`}>{chat.intro}</p>
          <ul className="m-0 pl-5 list-disc flex flex-col gap-1">
            {chat.items.map((it, k) => (
              <li key={it.b} className={reveal(phase.items > k)}>
                <strong className="font-semibold">{it.b}</strong> {it.t}
                <span
                  className="ml-1 inline-grid place-items-center min-w-[20px] h-[18px] px-1.5 rounded-full text-[11px] font-semibold align-[2px]"
                  style={{ background: '#f0f0f0', color: SB.text2 }}
                >
                  {it.n}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {chat.foot && (
          <div className={`mt-3 flex items-center gap-1.5 ${reveal(phase.foot)}`}>
            <span className="inline-flex items-center gap-1.5 h-[28px] pl-1.5 pr-3 rounded-full border text-[12.5px]" style={{ borderColor: SB.line, color: SB.text2 }}>
              <span className="inline-flex">
                {['P', 'E', 'D'].map((t, k) => (
                  <span
                    key={t}
                    className="grid place-items-center h-5 w-5 rounded-full border-2 border-white text-[9px] font-bold"
                    style={{ marginLeft: k ? -6 : 0, background: TYPE_DOT[t][0], color: TYPE_DOT[t][1] }}
                  >
                    {t}
                  </span>
                ))}
              </span>
              {chat.foot.replace(/ \d+$/, '')}
              <span style={{ color: SB.text3 }}>{chat.foot.match(/\d+$/)?.[0]}</span>
            </span>
          </div>
        )}
      </div>

      {/* Eingabe wie im Panel */}
      <div className="px-3 pb-2.5">
        <div className="flex items-center gap-2 rounded-[28px] border bg-white p-1.5 pl-2 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" style={{ borderColor: SB.line }}>
          <span className="inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-[12.5px]" style={{ color: SB.blue, background: '#eef3fe' }}>
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <path d="M14 3v6h6" />
            </svg>
            Quellen
          </span>
          <span className="flex-1 text-[14px]" style={{ color: SB.text3 }}>SenseBot fragen</span>
          <span className="grid place-items-center h-8 w-8 rounded-full" style={{ background: '#d7d7d7' }}>
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </div>
        <div className="mt-1.5 text-center text-[10.5px]" style={{ color: SB.text3 }}>
          SenseBot kann Fehler machen. Prüfe wichtige Aussagen an den Quellen.
        </div>
      </div>
    </div>
  )
}

const WIN_W = 420
const GAP = 16
const DIM = [1, 0.5, 0.18]

// Karussell: Anfangs zeigen die Fenster nur ihre Frage. Klick auf ein Fenster oder einen Punkt holt es in die Mitte;
// dort wird die Antwort gesucht und aufgebaut. Einmal beantwortete Fenster behalten ihre Antwort.
function SenseBotScene() {
  const [sel, setSel] = useState(2)
  const [run, setRun] = useState(0)
  // Fenster, deren Antwort schon gesucht wurde; die anderen zeigen nur ihre Frage.
  const [seen, setSeen] = useState<number[]>([])
  const { ref, inView } = useInView<HTMLDivElement>()
  const pick = (i: number) => {
    if (i === sel) return
    setSeen((v) => (v.includes(sel) ? v : [...v, sel]))
    setSel(i)
    setRun((r) => r + 1)
  }
  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className="absolute top-0 left-1/2 flex items-start gap-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${-(sel * (WIN_W + GAP) + WIN_W / 2)}px)` }}
      >
        {CHATS.map((c, i) => {
          const d = Math.abs(i - sel)
          const focus = d === 0
          return (
            <div
              key={c.q}
              role={focus ? undefined : 'button'}
              tabIndex={focus ? undefined : 0}
              aria-label={focus ? undefined : `Frage anzeigen: ${c.q}`}
              onClick={() => pick(i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(i)}
              className={`transition-opacity duration-700 outline-none ${focus ? '' : 'cursor-pointer hover:!opacity-80'}`}
              style={{ opacity: DIM[Math.min(d, 2)] }}
            >
              <ChatWindowAnimated chat={c} focus={focus} run={run} active={focus && inView} seen={seen.includes(i)} />
            </div>
          )
        })}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center gap-2">
        {CHATS.map((c, i) => (
          <button
            key={c.q}
            type="button"
            aria-label={`Frage ${i + 1}: ${c.q}`}
            aria-current={i === sel}
            onClick={() => pick(i)}
            className={`h-2 rounded-full border-0 p-0 cursor-pointer transition-all duration-300 ${i === sel ? 'w-6 bg-white' : 'w-2 bg-white/25 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

function ChatWindowAnimated({ chat, focus, run, active, seen }: { chat: Chat; focus: boolean; run: number; active: boolean; seen: boolean }) {
  // Bereits beantwortete Fenster zeigen ihre Antwort sofort, statt erneut zu suchen.
  const phase = useAnswerPhase(seen ? -1 : run, active && !seen, seen)
  return <ChatWindow chat={chat} focus={focus} phase={phase} />
}

/* ---------- 03 Weniger Review ---------- */
// Interaktive Prüfansicht im Look der Smart-Filter-Review-Ansicht (UI 2.0): Ja/Nein per Klick oder Taste J/N,
// dahinter das Prüfprotokoll, das jede Entscheidung mit Zeit, Prüfer und Integritätsstatus festhält.
// Dokumente wie in der Review-Liste des Smart-Filter-Videos; Textauszüge generisch (keine realen Personen).

type ReviewDoc = { type: string; name: string; from: string; to: string; date: string; before: string; mark: string; after: string }

const REVIEW_DOCS: ReviewDoc[] = [
  { type: 'EML', name: 'Notes call outside counsel.eml', from: 'Rechtsabteilung', to: 'Structured Finance', date: '23.08.2001',
    before: 'Summary of today’s call attached. ', mark: 'Privileged and confidential – please do not circulate beyond this list.', after: ' Next call scheduled for Monday.' },
  { type: 'EML', name: 'Q3 close – sensitive items.eml', from: 'Accounting', to: 'Risk Assessment & Control', date: '30.09.2001',
    before: 'Please find the open items for the Q3 close below. ', mark: 'Keep this within the close team until the numbers are final.', after: ' We will review on Thursday.' },
  { type: 'EML', name: 'Partnership update.eml', from: 'Treasury', to: 'Structured Finance', date: '18.06.2001',
    before: 'Short update on the partnership transactions. ', mark: 'This is confidential and should not be forwarded.', after: ' Details in the attached deck.' },
  { type: 'XLSX', name: 'Hedge capacity overview.xlsx', from: 'Risk Assessment & Control', to: 'Treasury', date: '01.08.2001',
    before: 'Sheet „Summary“, note in cell B2: ', mark: 'Internal use only – do not distribute.', after: ' Figures as of month end.' },
  { type: 'EML', name: 'Re: valuation review.eml', from: 'Structured Finance', to: 'Accounting', date: '14.08.2001',
    before: 'Thanks for the comments on the valuation. ', mark: 'Please handle this discreetly until we have aligned internally.', after: ' I will send the revised version tomorrow.' },
]

type Decision = 'ja' | 'nein'
type LogEntry = { time: string; doc: string; d: Decision; hash: string }

/** Bisherige Entscheidungen; Zeitstempel relativ zum Aufruf (Sekunden davor), damit neue Einträge danach liegen. */
const SEED: { ago: number; doc: string; d: Decision; hash: string }[] = [
  { ago: 41, doc: 'Draft memo partnerships.docx', d: 'ja', hash: '7c1e…a90f' },
  { ago: 62, doc: 'Board prep – confidential.msg', d: 'nein', hash: 'c71d…f413' },
  { ago: 86, doc: 'RE: Term sheet Q3 hedging.eml', d: 'ja', hash: '5b2e…4a36' },
  { ago: 117, doc: 'FW: Raptor valuation (do not forward).eml', d: 'ja', hash: '8af3…4b6d' },
]
const clock = (d: Date) => d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const seedLog = (): LogEntry[] => SEED.map(({ ago, ...e }) => ({ ...e, time: clock(new Date(Date.now() - ago * 1000)) }))
/** Prüfset: aus den 41.870 vertraulichen Treffern auf die relevanten Dokumente eingegrenzt. */
const TOTAL_HITS = 50

const pseudoHash = (s: string) => {
  let h = 0
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const hex = h.toString(16).padStart(8, '0')
  return `${hex.slice(0, 4)}…${hex.slice(4, 8)}`
}

function ReviewScene() {
  const [idx, setIdx] = useState(0)
  const [log, setLog] = useState<LogEntry[]>(seedLog)
  const [flash, setFlash] = useState<Decision | null>(null)
  const doc = REVIEW_DOCS[idx % REVIEW_DOCS.length]
  // Zähler über alle Entscheidungen; das Protokoll zeigt nur die letzten.
  const [counts, setCounts] = useState({ ja: SEED.filter((e) => e.d === 'ja').length, nein: SEED.filter((e) => e.d === 'nein').length })
  const { ja, nein } = counts
  const done = ja + nein

  const decide = (d: Decision) => {
    const time = clock(new Date())
    setLog((l) => [{ time, doc: doc.name, d, hash: pseudoHash(doc.name) }, ...l].slice(0, 8))
    setCounts((c) => ({ ...c, [d]: c[d] + 1 }))
    setFlash(d)
    window.setTimeout(() => setFlash(null), 350)
    setIdx((i) => i + 1)
  }

  return (
    <>
      {/* Dahinter: Prüfprotokoll */}
      <div
        className="absolute left-[16%] right-[-6%] top-12 bottom-0 overflow-hidden rounded-2xl bg-[#100e14] ring-1 ring-white/[0.06] dot-grid-night"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%), linear-gradient(to bottom, black 75%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskImage: 'linear-gradient(to right, black 80%, transparent 100%), linear-gradient(to bottom, black 75%, transparent 100%)',
          maskComposite: 'intersect',
        }}
      >
        <div className="absolute inset-y-0 right-[6%] left-[min(560px,46%)] pt-8 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: 'Ja', n: ja, c: '#4ade80' },
              { l: 'Nein', n: nein, c: '#f87171' },
              { l: 'Nicht bewertet', n: Math.max(0, TOTAL_HITS - done), c: '#8e8a96' },
            ].map((k) => (
              <div key={k.l} className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.07] px-4 py-3">
                <div className="flex items-center gap-2 text-[0.8125rem] text-[#a19dab]">
                  <span className="h-2 w-2 rounded-full" style={{ background: k.c }} />
                  {k.l}
                </div>
                <div className="mt-1 text-[1.375rem] font-medium text-white tabular-nums">{k.n.toLocaleString('de-DE')}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-[0.8125rem] text-[#8e8a96]">
              <span>Prüfprotokoll · Review-Ordner /Review</span>
              <span>jede Entscheidung protokolliert</span>
            </div>
            <div className="rounded-xl ring-1 ring-white/[0.07] divide-y divide-white/[0.06] overflow-hidden">
              {log.slice(0, 6).map((e, k) => (
                <div
                  key={`${e.time}-${e.doc}-${k}`}
                  className={`grid grid-cols-[72px_64px_1fr_auto] items-center gap-3 px-4 py-2.5 text-[0.8125rem] ${k === 0 && log.length > SEED.length ? 'animate-[fadeIn_.4s_ease] bg-white/[0.03]' : ''}`}
                >
                  <span className="text-[#6f6a78] tabular-nums">{e.time}</span>
                  <span className={e.d === 'ja' ? 'text-[#86efac]' : 'text-[#fca5a5]'}>{e.d === 'ja' ? '✓ Ja' : '✕ Nein'}</span>
                  <span className="truncate text-[#d6d3dd]">
                    {e.doc} <span className="text-[#6f6a78]">· fadmin</span>
                  </span>
                  <span className="text-[0.75rem] text-[#6f6a78]">
                    SHA {e.hash} <span className="text-[#86efac]">✓</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vorne: Prüfansicht im hellen Look der Review-Ansicht */}
      <div
        tabIndex={0}
        role="group"
        aria-label="Prüfansicht: Dokument mit Ja oder Nein bewerten (Tasten J und N)"
        onKeyDown={(e) => {
          if (e.key === 'j' || e.key === 'J') decide('ja')
          if (e.key === 'n' || e.key === 'N') decide('nein')
        }}
        className={`absolute left-0 top-0 w-[min(540px,100%)] rounded-2xl bg-white text-[#0d0d0d] outline-none ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-[#b06fd1] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] overflow-hidden transition-shadow duration-300 ${
          flash === 'ja' ? 'shadow-[0_0_0_3px_rgba(74,222,128,0.5)]' : flash === 'nein' ? 'shadow-[0_0_0_3px_rgba(248,113,113,0.5)]' : ''
        }`}
      >
        <div className="flex items-center gap-2 px-5 h-[52px] border-b border-[#e5e5e5] text-[0.8125rem]">
          <span className="font-semibold text-[0.875rem]">Dokumente</span>
          <span className="rounded-full bg-[#f3ecf6] text-[#601571] px-2 py-0.5 text-[0.75rem]">Prüfset · aus 41.870 eingegrenzt</span>
          <span className="ml-auto text-[#8f8f8f] tabular-nums">
            {Math.min(done, TOTAL_HITS)} von {TOTAL_HITS} bewertet
          </span>
        </div>
        <div className="h-1 bg-[#f1eef3]">
          <div className="h-full bg-[#601571] transition-all duration-500" style={{ width: `${Math.min(100, (done / TOTAL_HITS) * 100)}%` }} />
        </div>
        <div key={idx} className="px-5 pt-4 pb-5 animate-[fadeIn_.35s_ease]">
          <div className="flex items-center gap-2 text-[0.75rem] text-[#8f8f8f]">
            <span className="rounded bg-[#eef0f3] px-1.5 py-0.5 text-[0.625rem] font-bold text-[#5d5d5d]">{doc.type}</span>
            <span className="tabular-nums">{Math.min(done + 1, TOTAL_HITS)} / {TOTAL_HITS}</span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2 py-0.5 font-medium text-[#067647]">✓ Unverändert seit Ingest</span>
          </div>
          <div className="mt-3 text-[1.0625rem] font-semibold">{doc.name.replace(/\.(eml|xlsx|msg|docx)$/, '')}</div>
          <div className="mt-1 text-[0.8125rem] text-[#5d5d5d]">
            {doc.from} → {doc.to} · {doc.date}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[0.75rem]">
            <span className="text-[#8f8f8f] tracking-[0.06em]">KI-FACETTEN</span>
            <span className="inline-flex items-center gap-1.5 rounded-full ring-1 ring-[#c7d7fb] bg-[#eef3fe] px-2 py-0.5 text-[#1d4ed8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
              Vertraulich · 1 Stelle
            </span>
          </div>
          <p className="mt-3 mb-0 text-[0.875rem] leading-[1.65] text-[#3a3a3a]">
            {doc.before}
            <mark className="rounded bg-[#e3ebfd] px-0.5 text-[#0d0d0d] underline decoration-[#2563eb] decoration-2 underline-offset-2">{doc.mark}</mark>
            {doc.after}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => decide('ja')}
              className="flex-1 cursor-pointer rounded-xl border border-[#e3dfe6] bg-white px-4 py-2.5 text-[0.875rem] font-medium text-[#0d0d0d] hover:bg-[#e7f6ec] hover:border-[#bfe8cd] hover:text-[#1f7a43] transition-colors"
            >
              ✓ Ja <kbd className="ml-1 rounded border border-[#e3dfe6] bg-white px-1 font-sans text-[0.6875rem]">J</kbd>
            </button>
            <button
              type="button"
              onClick={() => decide('nein')}
              className="flex-1 cursor-pointer rounded-xl border border-[#e3dfe6] bg-white px-4 py-2.5 text-[0.875rem] font-medium text-[#0d0d0d] hover:bg-[#fdecec] hover:border-[#f6c9c5] hover:text-[#b42318] transition-colors"
            >
              ✕ Nein <kbd className="ml-1 rounded border border-[#e3dfe6] bg-white px-1 font-sans text-[0.6875rem]">N</kbd>
            </button>
          </div>
          <div className="mt-3 text-center text-[0.75rem] text-[#8f8f8f]">Probieren Sie es aus: klicken oder J / N drücken</div>
        </div>
      </div>
    </>
  )
}
