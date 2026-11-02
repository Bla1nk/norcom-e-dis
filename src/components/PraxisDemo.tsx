import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { DOC, NO_MATCH, QAS, matchQuestion, type QA } from '../content/praxisDemo'
import { useInView } from '../lib/useInView'

// Interaktive Praxis-Demo im Look der UI 2.0: links das Dokument, rechts SenseBot. Eine Frage an das Dokument
// zeigt die Arbeitsschritte, die Antwort mit Quellen und markiert die Fundstellen im Original.

type Msg = {
  id: number
  question: string
  qa: QA | null
  /** Anzahl sichtbarer Arbeitsschritte (fertig, wenn >= steps.length) */
  stepsShown: number
  /** Anzahl sichtbarer Zeichen der Antwort */
  chars: number
  done: boolean
}

const STEP_MS = 650
const TYPE_MS = 16

const answerText = (qa: QA | null) =>
  qa ? qa.answer.map((p) => (typeof p === 'string' ? p : `[${p.src}]`)).join('') : NO_MATCH

export function PraxisDemo() {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [hover, setHover] = useState<number | null>(null)
  const [focus, setFocus] = useState<number | null>(null)
  const timers = useRef<number[]>([])
  const nextId = useRef(1)
  const docRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const autoRan = useRef(false)
  const [scan, setScan] = useState<number | null>(null)

  const last = msgs[msgs.length - 1]
  const shown = last?.qa && last.done ? last.qa.sources : []
  const reading = !!last && !last.done && last.chars === 0

  // Während SenseBot „liest“, läuft ein Lichtstreif Absatz für Absatz durch das Dokument.
  useEffect(() => {
    if (!reading) {
      setScan(null)
      return
    }
    let i = 0
    setScan(0)
    const iv = window.setInterval(() => {
      i = (i + 1) % DOC.paras.length
      setScan(i)
    }, 230)
    return () => clearInterval(iv)
  }, [reading])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const patch = useCallback((id: number, p: Partial<Msg>) => {
    setMsgs((m) => m.map((x) => (x.id === id ? { ...x, ...p } : x)))
  }, [])

  const scrollDocTo = useCallback((paraId: string) => {
    const box = docRef.current
    const el = box?.querySelector<HTMLElement>(`[data-para="${paraId}"]`)
    if (!box || !el) return
    const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2
    box.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }, [])

  const ask = useCallback(
    (question: string, qa: QA | null = matchQuestion(question)) => {
      if (!question.trim()) return
      // Eine laufende Antwort wird sofort fertiggestellt, damit man jederzeit weiterfragen kann.
      timers.current.forEach(clearTimeout)
      timers.current = []
      const id = nextId.current++
      setMsgs((m) => [
        ...m.map((x) => (x.done ? x : { ...x, done: true, chars: answerText(x.qa).length, stepsShown: 99 })),
        { id, question, qa, stepsShown: 0, chars: 0, done: false },
      ])
      setInput('')
      setHover(null)
      const steps = qa ? qa.steps.length : 2
      for (let i = 1; i <= steps; i++) later(() => patch(id, { stepsShown: i }), i * STEP_MS)
      const total = answerText(qa).length
      const start = (steps + 1) * STEP_MS
      const tick = (c: number) => {
        patch(id, { chars: c })
        if (c < total) {
          later(() => tick(Math.min(total, c + 2)), TYPE_MS)
        } else {
          later(() => {
            patch(id, { done: true })
            if (qa) scrollDocTo(qa.sources[0].para)
          }, 250)
        }
      }
      later(() => tick(0), start)
    },
    [patch, scrollDocTo],
  )

  // Beim ersten Sichtkontakt stellt die Demo selbst die erste Frage.
  useEffect(() => {
    if (inView && !autoRan.current) {
      autoRan.current = true
      later(() => ask(QAS[0].question, QAS[0]), 700)
    }
  }, [inView, ask])

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    ask(input)
  }

  const paraSource = (id: string) => shown.find((s) => s.para === id)
  const open = QAS.filter((q) => !msgs.some((m) => m.qa?.id === q.id))
  const answered = shown.length > 0

  return (
    <div ref={viewRef} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[12%] -inset-y-20"
        style={{ background: 'radial-gradient(52% 42% at 50% 74%, rgba(180,170,205,0.30), rgba(96,21,113,0.14) 50%, transparent 72%)' }}
      />
      <div className="relative box-border flex overflow-hidden rounded-xl bg-white text-ink ring-1 ring-white/10 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)] lg:h-[min(720px,84svh)]">
        {/* App-Leiste */}
        <div aria-hidden="true" className="hidden w-14 flex-none flex-col items-center bg-[#17151b] py-3 lg:flex">
          <span className="grid size-10 place-items-center rounded-xl bg-white">
            <img src="/images/dasense-logo.png" alt="" className="h-[18px] w-auto" />
          </span>
          <div className="mt-6 flex flex-col gap-2">
            <RailIcon d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
            <RailIcon active d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4" />
          </div>
          <span className="mt-5 text-[0.5rem] font-semibold tracking-[0.04em] text-white/35">VERWALTUNG</span>
          <div className="mt-3 flex flex-col gap-2">
            <RailIcon d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <RailIcon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0" />
            <RailIcon d="M3 12V4h8l10 10-8 8zM7.5 8.5h.01" />
          </div>
          <div className="mt-auto grid size-9 place-items-center rounded-full bg-[#e3d6f3] text-[0.6875rem] font-bold text-primary">DD</div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Suchleiste */}
          <div aria-hidden="true" className="relative hidden h-[52px] flex-none items-center border-b border-hairline lg:flex">
            <div className="mx-auto flex w-[min(420px,50%)] items-center justify-between border-b border-line pb-1 text-[0.875rem] text-muted">
              Suchbegriff eingeben
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1220" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </div>
            <span className="absolute right-4 grid size-8 place-items-center rounded-full bg-[#e3d6f3] text-[0.6875rem] font-bold text-primary">DD</span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            {/* Ordner und Dokumente */}
            <div aria-hidden="true" className="hidden w-[250px] flex-none flex-col border-r border-hairline xl:flex">
              <div className="flex items-center justify-between px-3.5 py-3 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted">
                <span>▾ ORDNER</span>
                <span className="font-normal tracking-normal">Klick sendet an SenseBot</span>
              </div>
              <div className="flex-none px-1.5 text-[0.8125rem]">
                {FOLDERS.map((f) => (
                  <div key={f} className="flex items-center gap-2 rounded-md px-2 py-[5px]">
                    <span className="w-3 text-center text-[0.625rem] text-muted">›</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b5160" strokeWidth="1.8" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-hairline px-3.5 py-2.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted">
                <span>DOKUMENTE</span>
                <span className="font-normal tracking-normal">1–25 / 254.371</span>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden px-1.5 text-[0.75rem]">
                {FILES.map((f, i) => {
                  const sel = i === 13
                  return (
                    <div key={f} className={`relative flex items-center gap-2.5 rounded-md px-2 py-[5px] ${sel ? 'bg-[#ece6f5] font-semibold text-primary' : ''}`}>
                      {sel && <span className="absolute inset-y-0 left-0 w-[3px] rounded bg-primary" />}
                      <span className="w-4 text-right text-[0.625rem] text-muted">{i + 1}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m3 7 9 6 9-6" /></svg>
                      <span className="truncate">{sel ? DOC.file : f}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dokument */}
            <div className="flex min-h-[460px] min-w-0 flex-1 flex-col lg:min-h-0">
              <div className="box-border flex h-12 flex-none items-center gap-3 border-b border-hairline px-5 text-[0.8125rem]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1220" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden="true">
                  <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <path d="M14 3v6h6" />
                </svg>
                <span className="truncate text-[0.9375rem] font-semibold">{DOC.file}</span>
                <span className="hidden flex-none items-center gap-1.5 rounded-full bg-ok-bg px-2.5 py-1 text-[0.75rem] font-medium text-ok-text ring-1 ring-ok-line sm:inline-flex">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Unverändert seit Ingest
                </span>
                <span className="ml-auto hidden flex-none items-center gap-2 rounded-full bg-mist px-3 py-1 tabular-nums text-muted md:inline-flex">
                  ‹ <b className="font-semibold text-ink">14</b> / 254.371 ›
                </span>
              </div>
              <div ref={docRef} data-lenis-prevent className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto px-[clamp(1.25rem,3vw,2.5rem)] py-7">
                <h3 className="m-0 text-[1.5rem] font-semibold leading-tight tracking-[-0.01em]">{DOC.title}</h3>
                <div className="mt-5 flex items-center gap-3 border-b border-hairline pb-5">
                  <span className="grid size-10 flex-none place-items-center rounded-full bg-primary text-[0.8125rem] font-semibold text-white">{DOC.initials}</span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="text-[0.9375rem] font-semibold">{DOC.from}</div>
                    <div className="mt-1 text-[0.8125rem] text-muted">An {DOC.to}</div>
                  </div>
                  <div className="flex-none text-[0.8125rem] text-muted">{DOC.date}</div>
                </div>
                <div className="mt-6 flex flex-col gap-4 text-[0.9688rem] leading-[1.65]">
                  {DOC.paras.map((p, idx) => {
                    const src = paraSource(p.id)
                    const on = !!src
                    const strong = src && (hover === src.n || focus === src.n)
                    const scanning = scan === idx
                    return (
                      <p
                        key={p.id}
                        data-para={p.id}
                        className="relative m-0 box-border -mx-3 rounded-md px-3 py-1.5 transition-[background-color,box-shadow,opacity] duration-500"
                        style={{
                          opacity: answered && !on ? 0.32 : 1,
                          background: on ? (strong ? 'rgba(96,21,113,0.22)' : 'rgba(96,21,113,0.11)') : scanning ? 'rgba(96,21,113,0.07)' : 'transparent',
                          boxShadow: on
                            ? `inset 3px 0 0 #601571, 0 0 0 1px rgba(96,21,113,${strong ? 0.5 : 0.25}), 0 6px ${strong ? 32 : 20}px rgba(96,21,113,${strong ? 0.3 : 0.18})`
                            : scanning
                              ? 'inset 2px 0 0 rgba(96,21,113,0.45)'
                              : 'none',
                        }}
                      >
                        {on && (
                          <span className="absolute -left-1 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[0.6875rem] font-bold leading-none text-white">
                            {src.n}
                          </span>
                        )}
                        {p.text}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* SenseBot */}
            <aside aria-label="SenseBot" className="box-border flex h-[560px] flex-none flex-col border-t border-hairline bg-white lg:h-auto lg:w-[340px] lg:border-l lg:border-t-0">
              <div className="flex h-12 flex-none items-center justify-between px-4">
                <span className="text-[0.9375rem] font-semibold">SenseBot</span>
                <span aria-hidden="true" className="text-muted">✕</span>
              </div>
              <div className="mx-3 flex flex-none rounded-lg bg-mist p-1 text-[0.8125rem] font-medium">
                <span className="flex-1 rounded-md bg-white py-1.5 text-center shadow-sm">Dokument</span>
                <span className="flex-1 py-1.5 text-center text-muted">Alle Treffer</span>
              </div>
              <div className="truncate px-4 pb-3 pt-2.5 text-[0.75rem] text-muted">{DOC.file}</div>

              <div ref={chatRef} data-lenis-prevent className="no-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-hairline px-4 pb-4 pt-4">
                {msgs.length === 0 ? (
                  <div className="grid h-full place-items-center text-center">
                    <p className="m-0 font-serif text-[1.5rem]">Was möchtest du wissen?</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {msgs.map((m) => {
                      const steps = m.qa ? m.qa.steps : ['Dokument lesen', 'Fundstellen suchen']
                      const text = answerText(m.qa).slice(0, m.chars)
                      return (
                        <div key={m.id} className="flex flex-col gap-3">
                          <div className="max-w-[88%] self-end rounded-2xl rounded-br-md bg-mist px-3.5 py-2.5 text-[0.9063rem] leading-snug">{m.question}</div>
                          <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[0.8125rem] text-muted">
                            {steps.slice(0, m.stepsShown + (m.done || m.chars > 0 ? 0 : 1)).map((s, i) => {
                              const ok = i < m.stepsShown
                              return (
                                <li key={s} className="flex items-center gap-2">
                                  {ok ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#085d3a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="m5 12 5 5 9-10" />
                                    </svg>
                                  ) : (
                                    <span className="box-border size-3.5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
                                  )}
                                  {s}
                                </li>
                              )
                            })}
                          </ul>
                          {m.chars > 0 && (
                            <p className="m-0 text-[0.9375rem] leading-[1.6]">
                              {m.done && m.qa
                                ? m.qa.answer.map((part, i) =>
                                    typeof part === 'string' ? (
                                      <span key={i}>{part}</span>
                                    ) : (
                                      <button
                                        key={i}
                                        type="button"
                                        onMouseEnter={() => setHover(part.src)}
                                        onMouseLeave={() => setHover(null)}
                                        onClick={() => {
                                          setFocus(part.src)
                                          const s = m.qa!.sources.find((x) => x.n === part.src)
                                          if (s) scrollDocTo(s.para)
                                        }}
                                        className="mx-0.5 inline-grid size-[18px] cursor-pointer place-items-center rounded-full border-0 bg-primary p-0 align-text-top text-[0.6875rem] font-bold leading-none text-white hover:bg-primary-hover"
                                        aria-label={`Quelle ${part.src}`}
                                      >
                                        {part.src}
                                      </button>
                                    ),
                                  )
                                : text}
                            </p>
                          )}
                          {m.done && m.qa && (
                            <>
                              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                                {m.qa.sources.map((s) => (
                                  <li key={s.n}>
                                    <button
                                      type="button"
                                      onMouseEnter={() => setHover(s.n)}
                                      onMouseLeave={() => setHover(null)}
                                      onClick={() => {
                                        setFocus(s.n)
                                        scrollDocTo(s.para)
                                      }}
                                      className={`box-border inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.75rem] font-semibold transition-colors ${
                                        focus === s.n || hover === s.n ? 'border-primary bg-primary-tint text-primary' : 'border-card-line bg-white text-body'
                                      }`}
                                    >
                                      <span className="grid size-4 place-items-center rounded-full bg-primary text-[0.625rem] text-white">{s.n}</span>
                                      {s.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                              {m.qa.note && <p className="m-0 text-[0.75rem] text-muted">{m.qa.note}</p>}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex-none px-3 pb-3">
                {open.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {open.slice(0, msgs.length === 0 ? 4 : 3).map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => ask(q.question, q)}
                        className="box-border cursor-pointer rounded-full border border-card-line bg-white px-3 py-1.5 text-left text-[0.8125rem] text-body transition-colors hover:border-primary hover:bg-primary-tint hover:text-primary"
                      >
                        {q.chip}
                      </button>
                    ))}
                  </div>
                )}
                <form onSubmit={onSubmit} className="box-border rounded-xl border border-card-line bg-white px-3.5 pb-2 pt-3 focus-within:border-primary">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Schreib eine Nachricht …"
                    aria-label="Frage zu diesem Dokument"
                    className="mb-3 block w-full border-0 bg-transparent p-0 text-[0.9063rem] text-ink outline-none placeholder:text-muted"
                  />
                  <div className="flex items-center gap-3 text-muted">
                    <span aria-hidden="true" className="text-[1.125rem] leading-none">+</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b6fd8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <path d="M14 3v6h6" />
                    </svg>
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      aria-label="Senden"
                      className="ml-auto grid size-7 cursor-pointer place-items-center rounded-full border-0 bg-primary text-white disabled:cursor-default disabled:bg-mist disabled:text-muted"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
                <p className="mx-0 mb-0 mt-2 text-center text-[0.6875rem] leading-snug text-muted">
                  SenseBot ist eine KI und kann Fehler machen. Bitte überprüfe die Antworten an den Quellen.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

const FOLDERS = ['App Results', 'Berichte', 'cockpit-selbsttest', 'DaSense', 'Dasense Documentation', 'edrm_test_data', 'enron_case_documents_2000', 'enron_case_project_ikeja', 'enron_full_unique']
const FILES = [
  'enron_ce0daa8edd17a065a9ab.eml', 'enron_448ebe13c5b20ff1ef78.eml', 'enron_08d80ba013d0e4bde70b.eml', 'enron_a84eb25d5c280af8d2db.eml',
  'enron_da295496e26c65ec22da.eml', 'enron_c5e8cce372f13cc6bb3a.eml', 'enron_a8388098cf87c5e99a6f.eml', 'enron_42b82175dc9d7ed5472c.eml',
  'enron_e90edf338d06c7664a28.eml', 'enron_537734260c934e8590b9.eml', 'enron_980038eb73dc9303e150.eml', 'enron_67816c0f16f886ed6a38.eml',
  'enron_cd495f4e910c7d3123cb.eml', '', 'enron_70ceec19aa512ed3f9fe.eml', 'enron_1a72fcedd43b19c57e97.eml', 'enron_25eca7f7e3b2e9f79210.eml',
  'enron_a70aa3b2e9eba4c56e99.eml',
]

function RailIcon({ d, active = false }: { d: string; active?: boolean }) {
  return (
    <span className={`grid size-10 place-items-center rounded-xl ${active ? 'bg-white/10' : ''}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d9d5e0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    </span>
  )
}
