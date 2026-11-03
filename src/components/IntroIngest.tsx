import { useEffect, useRef, useState } from 'react'
import { markIntroSeen, releaseIntro } from '../lib/intro'
import { lockScroll, unlockScroll } from '../lib/lenis'
import { t, EN } from '../lib/i18n'

// Intro „Ingest“: Der Graph aus dem Ingest-Cockpit (Platte → Ingest → Ordnerbaum). Während er läuft, bekommt jeder Ordner
// sein „Vektorisiert“. Dann zieht eine Leitung zu einer letzten Station, der Suche in DaSense, und die Kamera fliegt
// durch den Graphen genau dorthin: Die Station landet auf dem Demo-Video. Ein durchgehender Workflow ohne Schnitt.
// Ordner, Zahlen und Namen sind fiktive Beispiele.
const BG = '#0a0a0b'
const CARD = '#141416'
const LINE = '#2c2c33'
const BLUE = '#3b6cf6'
const GREEN = '#4ade80'

const WORLD_W = 2600
const WORLD_H = 900
const COL_X = [770, 1090, 1410]
const COL_W = 250
const COL_TOP = 230
const RAIL = 190
const TRUNK = COL_X.map((x) => x - 30)
const NODE = { x: 340, y: 375, w: 310, h: 150 }
const SEARCH = { x: 1800, y: 270, w: 640, h: 360 }
const DOCS = 48213

type Child = [string, string]
type Folder = { name: string; total: string; kids: Child[] }
const COLS: Folder[][] = [
  [
    { name: t('geschaeftsleitung', 'management'), total: t('6,4 Tsd.', '6.4k'), kids: [[t('inbox', 'inbox'), t('4,3 Tsd.', '4.3k')], [t('gesendet', 'sent'), t('2,1 Tsd.', '2.1k')]] },
    { name: t('einkauf', 'purchasing'), total: t('3,2 Tsd.', '3.2k'), kids: [] },
    { name: t('vertrieb', 'sales'), total: t('4,1 Tsd.', '4.1k'), kids: [] },
    { name: 'controlling', total: t('2,8 Tsd.', '2.8k'), kids: [] },
    { name: t('logistik', 'logistics'), total: t('3,6 Tsd.', '3.6k'), kids: [] },
    { name: t('finanzen', 'finance'), total: t('5,9 Tsd.', '5.9k'), kids: [['q2', t('3,8 Tsd.', '3.8k')], ['q3', t('2,1 Tsd.', '2.1k')]] },
  ],
  [
    { name: t('recht', 'legal'), total: t('5,2 Tsd.', '5.2k'), kids: [[t('entwuerfe', 'drafts'), t('1,4 Tsd.', '1.4k')], [t('korrespondenz', 'correspondence'), t('2,6 Tsd.', '2.6k')], [t('sitzungen', 'meetings'), t('1,2 Tsd.', '1.2k')]] },
    { name: t('personal', 'hr'), total: t('1,9 Tsd.', '1.9k'), kids: [] },
    { name: 'it', total: t('3,3 Tsd.', '3.3k'), kids: [] },
    { name: t('projekte', 'projects'), total: t('6,8 Tsd.', '6.8k'), kids: [['mail', t('4,9 Tsd.', '4.9k')], [t('vertraege', 'contracts'), t('1,9 Tsd.', '1.9k')]] },
  ],
  [
    { name: t('revision', 'audit'), total: t('2,6 Tsd.', '2.6k'), kids: [['mail', t('1,7 Tsd.', '1.7k')], [t('berichte', 'reports'), t('0,9 Tsd.', '0.9k')]] },
    { name: 'compliance', total: t('1,3 Tsd.', '1.3k'), kids: [] },
    { name: t('archiv_alt', 'archive_old'), total: t('1,1 Tsd.', '1.1k'), kids: [] },
  ],
]
const cardH = (f: Folder) => 40 + (f.kids.length ? f.kids.length * 31 + 10 : 0)
type Placed = Folder & { x: number; y: number; h: number; col: number; i: number }
const PLACED: Placed[] = []
const TRUNK_END: number[] = []
{
  let i = 0
  COLS.forEach((col, c) => {
    let y = COL_TOP
    col.forEach((f) => {
      const h = cardH(f)
      PLACED.push({ ...f, x: COL_X[c], y, h, col: c, i: i++ })
      y += h + 12
    })
    const last = PLACED[PLACED.length - 1]
    TRUNK_END[c] = last.y + 20
  })
}
const N = PLACED.length

// Zeitplan (s)
const T_NODE = 0.3
const T_SCAN = 0.7
const T_VEC = 1.9
const T_DONE = 3.35
const T_LINK = 3.4
const T_FLIGHT = 4.0
const FLIGHT = 1.5
const END_AFTER = 0.8 // s nach Flugende

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (v: number) => v * v * (3 - 2 * v)
const fmt = (n: number) => Math.round(n).toLocaleString(EN ? 'en-US' : 'de-DE')

const Pill = ({ children, tone }: { children: React.ReactNode; tone: 'green' | 'blue' }) => (
  <span
    className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full border px-2 py-px text-[0.6875rem] font-medium"
    style={
      tone === 'green'
        ? { background: '#10231a', borderColor: '#1f5a38', color: GREEN }
        : { background: '#101a33', borderColor: '#2a4aa8', color: '#7d9bff' }
    }
  >
    {tone === 'green' ? (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" opacity="0.25" /><path d="m7.5 12.5 3 3 6-6.5" /></svg>
    ) : (
      <span className="size-1.5 rounded-full bg-[#7d9bff] blink-dot" />
    )}
    {children}
  </span>
)

export function IntroIngest({ onDone }: { onDone: () => void }) {
  const bg = useRef<HTMLDivElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const others = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const chip = useRef<HTMLSpanElement>(null)
  const [tm, setT] = useState(0)

  useEffect(() => {
    let cancelled = false
    let raf = 0
    let frame = 0
    const timers: number[] = []
    const prevOverflow = document.documentElement.style.overflow
    // Scrollleistenbreite reservieren: Sonst rückt das Layout am Ende um die Breite der Leiste und das Video passt nicht mehr zur Station
    document.documentElement.style.scrollbarGutter = 'stable'
    document.documentElement.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    const lockRaf = requestAnimationFrame(() => lockScroll())

    const W = window.innerWidth
    const H = window.innerHeight
    const sc0 = Math.min((W * 0.94) / 1700, (H * 0.9) / WORLD_H)
    const mat = (cx: number, cy: number, sc: number) => `translate(${W / 2 - cx * sc}px, ${H / 2 - cy * sc}px) scale(${sc})`

    const vid = document.querySelector('video.m1-hero-video') as HTMLVideoElement | null
    const box = vid?.parentElement as HTMLElement | null
    if (box) box.style.opacity = '0'
    const r = vid?.getBoundingClientRect()
    const sF = r ? r.width / SEARCH.w : 1.6
    const vcx = r ? r.left + r.width / 2 : W / 2
    const vcy = r ? r.top + r.height / 2 : H * 0.7
    const cardCx = SEARCH.x + SEARCH.w / 2
    const cardCy = SEARCH.y + SEARCH.h / 2
    const final = `translate(${vcx - cardCx * sF}px, ${vcy - cardCy * sF}px) scale(${sF})`

    // Kamera: ruhig, ab der Leitung ein Stück nach rechts, dann der Flug zur Suche
    const total = T_FLIGHT + FLIGHT
    const w = world.current!
    w.animate(
      [
        { transform: mat(850, 450, sc0), offset: 0, easing: 'linear' },
        { transform: mat(850, 450, sc0), offset: T_LINK / total, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
        { transform: mat(1010, 450, sc0), offset: T_FLIGHT / total, easing: 'cubic-bezier(0.8, 0, 0.2, 1)' },
        { transform: final, offset: 1 },
      ],
      { duration: total * 1000, fill: 'forwards' },
    )

    const t0 = performance.now()
    const tick = (now: number) => {
      if (cancelled) return
      const s = (now - t0) / 1000
      if (frame++ % 2 === 0) setT(Math.min(s, T_FLIGHT))
      if (s < T_FLIGHT) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const at = (sec: number, fn: () => void) => timers.push(window.setTimeout(() => !cancelled && fn(), sec * 1000))
    // Flug: Rest des Graphen blendet aus, Vorhang (Hintergrund) wird transparent, der Hero läuft ein
    at(T_FLIGHT + 0.2, () => {
      others.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, easing: 'ease-in', fill: 'forwards' })
    })
    at(T_FLIGHT + 0.05, () => {
      chip.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' })
    })
    at(T_FLIGHT + 0.65, () => releaseIntro())
    at(T_FLIGHT + 0.6, () => {
      bg.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 750, easing: 'ease-in-out', fill: 'forwards' })
    })
    // Zuletzt geht die Station in das echte Video über, das von vorn startet
    at(T_FLIGHT + FLIGHT - 0.25, () => {
      if (vid) {
        vid.currentTime = 0
        void vid.play().catch(() => {})
      }
      box?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'linear', fill: 'forwards' }).finished.then(() => {
        if (box) box.style.opacity = ''
      })
      card.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'linear', fill: 'forwards' })
    })
    at(T_FLIGHT + FLIGHT, () => {
      document.documentElement.style.overflow = prevOverflow
      unlockScroll()
    })
    at(T_FLIGHT + FLIGHT + END_AFTER, () => {
      document.documentElement.style.scrollbarGutter = ''
      markIntroSeen()
      onDone()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(lockRaf)
      timers.forEach(clearTimeout)
      if (box) box.style.opacity = ''
      document.documentElement.style.overflow = prevOverflow
      document.documentElement.style.scrollbarGutter = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const p1 = clamp((tm - T_SCAN) / (T_VEC + 0.4 - T_SCAN))
  const p2 = clamp((tm - T_VEC) / (T_DONE - T_VEC))
  const running = tm > T_SCAN && tm < T_DONE
  const nodeIn = smooth(clamp((tm - T_NODE) / 0.45))
  const platteIn = smooth(clamp((tm - 0.1) / 0.45))
  const linkP = smooth(clamp((tm - T_LINK) / 0.5))
  const cardIn = smooth(clamp((tm - (T_LINK + 0.15)) / 0.45))
  const vecPhase = tm >= T_VEC
  const doneAll = tm >= T_DONE

  const draw = (appear: number) => ({ strokeDasharray: 1, strokeDashoffset: 1 - appear })
  const flow = running ? 0.9 : 0

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[80] pointer-events-none select-none overflow-hidden text-[#f4f4f5]">
      <div
        ref={bg}
        className="absolute inset-0 pointer-events-auto"
        style={{ background: BG, backgroundImage: 'radial-gradient(#23232a 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />
      <div ref={world} className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ width: WORLD_W, height: WORLD_H }}>
        <div ref={others} className="absolute inset-0">
          {/* Leitungen */}
          <svg className="absolute inset-0 overflow-visible" width={WORLD_W} height={WORLD_H} fill="none">
            <path d="M270,450 L340,450" pathLength={1} stroke={LINE} strokeWidth="1.6" {...draw(nodeIn)} />
            {/* Ausgang des Ingest-Knotens zur Schiene */}
            <path d="M650,450 C705,450 690,190 740,190 L1380,190" pathLength={1} stroke={LINE} strokeWidth="1.6" {...draw(smooth(clamp((tm - T_SCAN) / 0.9)))} />
            <path d="M650,450 C705,450 690,190 740,190 L1380,190" stroke={BLUE} strokeWidth="1.8" strokeDasharray="4 10" className="ing-dash" style={{ opacity: flow * smooth(clamp((tm - T_SCAN) / 0.9)) }} />
            {PLACED.map((f) => {
              const a = smooth(clamp((tm - (0.95 + f.i * 0.1)) / 0.4))
              const cy = f.y + 20
              return (
                <g key={f.name} style={{ opacity: a }}>
                  <path d={`M${TRUNK[f.col]},${cy} L${f.x},${cy}`} stroke={LINE} strokeWidth="1.6" />
                  <circle cx={f.x} cy={cy} r="3.2" fill={BG} stroke="#4a4a54" strokeWidth="1.4" />
                </g>
              )
            })}
            {TRUNK.map((x, c) => (
              <path key={x} d={`M${x},${RAIL} L${x},${TRUNK_END[c]}`} stroke={LINE} strokeWidth="1.6" style={{ opacity: smooth(clamp((tm - 1.0 - c * 0.35) / 0.5)) }} />
            ))}
            {/* Leitung zur Suche */}
            <path d="M1380,190 L1740,190 C1790,190 1780,450 1800,450" pathLength={1} stroke={LINE} strokeWidth="1.6" {...draw(linkP)} />
            <path d="M1380,190 L1740,190 C1790,190 1780,450 1800,450" stroke={BLUE} strokeWidth="1.8" strokeDasharray="4 10" className="ing-dash" style={{ opacity: linkP > 0 ? 0.9 : 0 }} />
          </svg>

          {/* Platte */}
          <div
            className="absolute flex items-center gap-3 rounded-[14px] border px-4"
            style={{ left: 40, top: 410, width: 230, height: 80, background: CARD, borderColor: '#26262b', opacity: platteIn, translate: `${(1 - platteIn) * -16}px 0` }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>
            <div>
              <div className="text-[1.0625rem] font-semibold leading-tight">{t('Platte', 'Disk')}</div>
              <div className="text-[0.75rem] text-[#8b8b94]">/mnt/FILESTORAGE</div>
            </div>
          </div>

          {/* Ingest-Knoten */}
          <div className="absolute" style={{ left: NODE.x, top: NODE.y, width: NODE.w, height: NODE.h, opacity: nodeIn, translate: `0 ${(1 - nodeIn) * 14}px` }}>
            <span
              className="absolute -top-8 left-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.8125rem] font-semibold"
              style={doneAll ? { background: '#10231a', borderColor: '#1f5a38', color: GREEN } : { background: '#101a33', borderColor: '#2a4aa8', color: '#7d9bff' }}
            >
              {doneAll ? t('✓ Ingest abgeschlossen', '✓ Ingest complete') : (<><span className="size-1.5 rounded-full bg-[#7d9bff] blink-dot" />{vecPhase ? `${t('Vektorisierung', 'Vectorization')} ${Math.round(p2 * 100)} %` : `Ingest ${Math.round(p1 * 100)} %`}</>)}
            </span>
            <div
              className="size-full rounded-[14px] border-[1.5px] p-4 transition-[border-color,box-shadow] duration-500"
              style={{
                background: CARD,
                borderColor: doneAll ? '#2f7a4d' : BLUE,
                boxShadow: doneAll ? '0 0 36px -8px rgba(74,222,128,0.35)' : '0 0 38px -6px rgba(59,108,246,0.55)',
              }}
            >
              <div className="text-[1.125rem] font-semibold leading-tight">{t('mandat_nordwind', 'matter_nordwind')}</div>
              <div className="mt-0.5 text-[0.8125rem] text-[#8b8b94]">{t('Ingest und Vektorisierung über Deep Fusion', 'Ingest and vectorization via Deep Fusion')}</div>
              <div className="mt-3 text-[0.8125rem] text-[#a1a1aa] tabular-nums">{fmt(DOCS * p1)} / {fmt(DOCS)} {t('Dateien', 'files')} · ≈ 61 GB</div>
              <div className="mt-1.5 h-[3px] rounded-full bg-[#26262b] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${p1 * 100}%`, background: GREEN }} /></div>
              <div className="mt-2 text-[0.8125rem] text-[#7d9bff] tabular-nums">{Math.round(p2 * 100)} % {t('vektorisiert', 'vectorized')} · {fmt(p2 * 184520)} Chunks</div>
              <div className="mt-1 h-[3px] rounded-full bg-[#26262b] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${p2 * 100}%`, background: BLUE }} /></div>
            </div>
            <span className="absolute -left-[5px] top-1/2 -mt-[5px] size-[10px] rounded-full" style={{ background: BLUE, boxShadow: `0 0 0 3px ${BG}` }} />
            <span className="absolute -right-[5px] top-1/2 -mt-[5px] size-[10px] rounded-full" style={{ background: BLUE, boxShadow: `0 0 0 3px ${BG}` }} />
          </div>

          {/* Ordnerbaum */}
          {PLACED.map((f) => {
            const a = smooth(clamp((tm - (0.95 + f.i * 0.1)) / 0.4))
            const ct = T_VEC + 0.25 + (f.i / (N - 1)) * (T_DONE - T_VEC - 0.45)
            const state = tm >= ct ? 'done' : tm >= ct - 0.55 ? 'run' : 'wait'
            const pct = Math.round(clamp((tm - (ct - 0.55)) / 0.55) * 100)
            return (
              <div
                key={f.name}
                className="absolute rounded-xl border transition-colors duration-300"
                style={{
                  left: f.x,
                  top: f.y,
                  width: COL_W,
                  height: f.h,
                  background: CARD,
                  borderColor: state === 'run' ? BLUE : '#26262b',
                  boxShadow: state === 'run' ? '0 0 24px -6px rgba(59,108,246,0.6)' : 'none',
                  opacity: a,
                  translate: `${(1 - a) * 14}px 0`,
                }}
              >
                {state === 'done' && <Pill tone="green">{t('Vektorisiert', 'Vectorized')}</Pill>}
                {state === 'run' && <Pill tone="blue">{t('Vektorisiert', 'Vectorized')} {pct} %</Pill>}
                <div className="flex items-baseline justify-between px-3.5 pt-2.5 text-[0.9375rem]">
                  <span className="font-medium">{f.name}</span>
                  <span className="text-[0.8125rem] text-[#8b8b94] tabular-nums">{f.total}</span>
                </div>
                {f.kids.length > 0 && (
                  <div className="mt-2.5 px-2.5 flex flex-col gap-1">
                    {f.kids.map(([n, c]) => (
                      <div key={n} className="flex justify-between rounded-lg bg-[#1b1b1f] px-3 py-[5px] text-[0.8125rem]">
                        <span>{n}</span>
                        <span className="text-[#8b8b94] tabular-nums">{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Letzte Station: die Suche in DaSense (liegt am Ende auf dem Demo-Video) */}
        <div ref={card} className="absolute" style={{ left: SEARCH.x, top: SEARCH.y, width: SEARCH.w, height: SEARCH.h, opacity: cardIn, translate: `${(1 - cardIn) * 24}px 0` }}>
          <span
            ref={chip}
            className="absolute -top-8 left-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.8125rem] font-semibold"
            style={{ background: '#10231a', borderColor: '#1f5a38', color: GREEN }}
          >
            <span className="size-1.5 rounded-full bg-[#4ade80] blink-dot" />
            {t('DaSense · Suche bereit', 'DaSense · Search ready')}
          </span>
          <div className="size-full rounded-xl overflow-hidden ring-1 ring-white/15 bg-white" style={{ boxShadow: '0 0 60px -10px rgba(59,108,246,0.45)' }}>
            <img src="/videos/hero-poster.jpg" alt="" className="block size-full object-cover" />
          </div>
          <span className="absolute -left-[5px] top-1/2 -mt-[5px] size-[10px] rounded-full" style={{ background: BLUE, boxShadow: `0 0 0 3px ${BG}` }} />
        </div>
      </div>
    </div>
  )
}
