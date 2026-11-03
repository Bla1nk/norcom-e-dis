import { useEffect, useRef, useState } from 'react'
import { AppWindow, Surface } from '../legal/shared'
import { t as tr } from '../../lib/i18n'

// Audio/Video: Wellenform, Transkript und Suche. Alles Simulation ohne echtes Audio, fiktives Gespräch.

const DUR = 48
const BARS = 64
const heights = Array.from({ length: BARS }, (_, i) => 22 + Math.round(Math.abs(Math.sin(i * 0.7) * 38 + Math.sin(i * 1.9) * 24 + Math.cos(i * 0.31) * 14)))

const LINES = [
  { t: 0, who: tr('Sprecher A', 'Speaker A'), text: tr('Hast du die Lieferung für Samstag bestätigt?', 'Did you confirm the delivery for Saturday?') },
  { t: 7, who: tr('Sprecher B', 'Speaker B'), text: tr('Ja, aber nicht über die normale Adresse. Das Konto bleibt wie besprochen.', 'Yes, but not through the usual address. The account stays as discussed.') },
  { t: 16, who: tr('Sprecher A', 'Speaker A'), text: tr('Gut. Wir brauchen die Lieferung vor dem Wochenende, sonst wird es eng.', 'Good. We need the delivery before the weekend, otherwise it gets tight.') },
  { t: 26, who: tr('Sprecher B', 'Speaker B'), text: tr('Ich schicke dir die Nummer vom Konto später persönlich, nicht per Mail.', "I'll send you the account number personally later, not by email.") },
  { t: 36, who: tr('Sprecher A', 'Speaker A'), text: tr('Verstanden. Danach löschen wir die Nachrichten.', 'Understood. Then we delete the messages.') },
]
const TERMS = tr(['Lieferung', 'Konto'], ['delivery', 'account'])
const mmss = (s: number) => `0:${String(Math.floor(s)).padStart(2, '0')}`

function mark(text: string, term: string | null) {
  if (!term) return text
  const parts = text.split(new RegExp(`(${term})`, 'gi'))
  return parts.map((p, i) => (p.toLowerCase() === term.toLowerCase() ? <mark key={i} className="rounded bg-[#fbe7c8] px-0.5 text-ink">{p}</mark> : p))
}

export function MediaTranscript() {
  const [t, setT] = useState(0)
  const [play, setPlay] = useState(false)
  const [term, setTerm] = useState<string | null>(TERMS[0])
  const last = useRef(0)

  useEffect(() => {
    if (!play) return
    let raf = 0
    last.current = performance.now()
    const tick = (now: number) => {
      const dt = (now - last.current) / 1000
      last.current = now
      setT((v) => {
        const n = v + dt
        if (n >= DUR) {
          setPlay(false)
          return DUR
        }
        return n
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [play])

  const active = LINES.reduce((a, l, i) => (l.t <= t ? i : a), 0)
  const hitBars = new Set<number>()
  if (term) {
    LINES.forEach((l, i) => {
      if (l.text.toLowerCase().includes(term.toLowerCase())) {
        const end = LINES[i + 1]?.t ?? DUR
        for (let b = Math.floor((l.t / DUR) * BARS); b < Math.floor((end / DUR) * BARS); b++) hitBars.add(b)
      }
    })
  }
  const hits = term ? LINES.filter((l) => l.text.toLowerCase().includes(term.toLowerCase())).length : 0
  const pos = (t / DUR) * 100

  return (
    <Surface tone="grid">
      <AppWindow tab={tr('Entitäten', 'Entities')} title={tr('Audio & Video', 'Audio & video')}>
        <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{tr('Sprachmemo_0914.m4a', 'Voice_memo_0914.m4a')}</h4>
          <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">{tr('lokal transkribiert', 'transcribed locally')}</span>
          <span className="text-muted">{tr('Deutsch', 'English')} · {mmss(DUR)}</span>
        </div>

        <div className="px-5 pb-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (t >= DUR) setT(0)
                setPlay((v) => !v)
              }}
              aria-label={play ? tr('Pause', 'Pause') : tr('Abspielen', 'Play')}
              className="grid size-11 flex-none place-items-center rounded-full bg-primary text-white border-0 cursor-pointer transition-colors hover:bg-primary-hover"
            >
              {play ? (
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1" /><rect x="14" y="4" width="5" height="16" rx="1" /></svg>
              ) : (
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
              )}
            </button>
            <div className="relative flex-1 h-16 flex items-center gap-[2px]">
              {heights.map((h, i) => {
                const passed = (i / BARS) * 100 < pos
                const hit = hitBars.has(i)
                return (
                  <span
                    key={i}
                    className="flex-1 rounded-full transition-colors duration-200"
                    style={{ height: `${h}%`, background: hit ? '#e08a1e' : passed ? '#601571' : '#d9c8de' }}
                  />
                )
              })}
              <span className="absolute top-0 bottom-0 w-0.5 bg-ink rounded-full" style={{ left: `${pos}%` }} />
            </div>
            <span className="w-20 flex-none text-right tabular-nums text-muted">{mmss(t)} / {mmss(DUR)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
          <span className="text-muted mr-1">{tr('Suche im Text:', 'Search in text:')}</span>
          {TERMS.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setTerm(term === x ? null : x)}
              aria-pressed={term === x}
              className={`rounded-full border px-3.5 py-1.5 cursor-pointer transition-colors ${term === x ? 'bg-ink text-white border-ink' : 'bg-white text-body border-line hover:border-primary/40'}`}
            >
              {x}
            </button>
          ))}
          {term && <span className="text-muted">{hits} {hits === 1 ? tr('Treffer', 'hit') : tr('Treffer', 'hits')}{tr(', orange markiert', ', highlighted in orange')}</span>}
        </div>

        <ul className="list-none m-0 p-0 border-t border-line">
          {LINES.map((l, i) => {
            const on = i === active && (play || t > 0)
            return (
              <li key={l.t}>
                <button
                  type="button"
                  onClick={() => setT(l.t)}
                  className={`w-full grid grid-cols-[3rem_5.5rem_minmax(0,1fr)] gap-3 items-start text-left px-5 py-3.5 border-0 border-b border-line cursor-pointer transition-colors duration-300 ${on ? 'bg-primary-tint/70' : 'bg-white hover:bg-[#faf8fb]'}`}
                >
                  <span className="tabular-nums text-muted">{mmss(l.t)}</span>
                  <span className={`font-medium ${on ? 'text-primary' : 'text-ink'}`}>{l.who}</span>
                  <span className="text-body leading-[1.55]">{mark(l.text, term)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </AppWindow>
    </Surface>
  )
}
