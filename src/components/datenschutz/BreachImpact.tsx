import { useEffect, useRef, useState } from 'react'
import { AppWindow, Surface, useSeen } from '../legal/shared'
import { t } from '../../lib/i18n'

// Datenpanne: Wer ist betroffen, und wie viel Zeit bleibt für die Meldung (Art. 33 DSGVO, 72 Stunden)? Fiktiv.

const OTHER = t('Sonst.', 'Other')
const SETS = [
  { name: t('Export Kundendatenbank', 'Customer database export'), n: 18420, left: 61, cats: t(['Name', 'E-Mail', 'Anschrift'], ['Name', 'Email', 'Address']), ctr: [['DE', 71], ['AT', 14], ['FR', 9], [OTHER, 6]] },
  { name: t('Mailbox Vertrieb', 'Sales mailbox'), n: 2310, left: 38, cats: t(['Name', 'E-Mail', 'Vertragsdaten'], ['Name', 'Email', 'Contract data']), ctr: [['DE', 58], ['AT', 20], ['CH', 15], [OTHER, 7]] },
  { name: t('Backup Personal', 'HR backup'), n: 640, left: 12, cats: t(['Name', 'IBAN', 'Gesundheitsdaten'], ['Name', 'IBAN', 'Health data']), ctr: [['DE', 88], ['PL', 7], ['TR', 3], [OTHER, 2]] },
] as const
const HEALTH = t('Gesundheitsdaten', 'Health data')
const COLORS = ['#601571', '#2f6fe0', '#e08a1e', '#9a8fa0']

function useTween(to: number) {
  const [v, setV] = useState(to)
  const from = useRef(to)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const a = from.current
    if (reduce || a === to) {
      setV(to)
      from.current = to
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 800)
      const val = Math.round(a + (to - a) * (1 - Math.pow(1 - p, 3)))
      setV(val)
      from.current = val
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return v
}

export function BreachImpact() {
  const [sel, setSel] = useState(0)
  const [rep, setRep] = useState(false)
  const { ref, seen } = useSeen<HTMLDivElement>()
  const s = SETS[sel]
  const n = useTween(seen ? s.n : 0)
  const R = 38
  const C = 2 * Math.PI * R
  const urgent = s.left <= 24

  return (
    <Surface tone="grid">
      <div ref={ref}>
        <AppWindow tab="Incident Response" title={t('Datenpanne', 'Data breach')}>
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Datenpanne', 'Data breach')}</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">Incident Response</span>
            <span className="text-muted">{t('Betroffene aus abgeflossenen Daten ermitteln', 'Identify affected individuals from leaked data')}</span>
          </div>
          <div className="flex flex-wrap gap-2 px-5 pb-4">
            {SETS.map((x, i) => (
              <button
                key={x.name}
                type="button"
                onClick={() => {
                  setSel(i)
                  setRep(false)
                }}
                aria-pressed={i === sel}
                className={`rounded-full border px-3.5 py-1.5 cursor-pointer transition-colors ${i === sel ? 'bg-ink text-white border-ink' : 'bg-white text-body border-line hover:border-primary/40'}`}
              >
                {x.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] border-t border-line">
            <div className="p-5 lg:border-r border-line flex items-center gap-5">
              <div className="relative size-[96px] flex-none">
                <svg viewBox="0 0 96 96" className="size-full -rotate-90">
                  <circle cx="48" cy="48" r={R} fill="none" stroke="#efe8f1" strokeWidth="9" />
                  <circle
                    cx="48" cy="48" r={R} fill="none" strokeWidth="9" strokeLinecap="round"
                    stroke={urgent ? '#d6385c' : '#601571'}
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - s.left / 72)}
                    style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1), stroke 400ms' }}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center leading-none">
                  <div>
                    <div className="text-[1.5rem] font-semibold tabular-nums">{s.left}</div>
                    <div className="mt-0.5 text-[0.6875rem] text-muted">{t('Std. übrig', 'hrs left')}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-[0.9375rem]">{t('Meldefrist', 'Reporting deadline')}</div>
                <div className="text-muted">{t('72 Stunden, Art. 33 DSGVO', '72 hours, Art. 33 GDPR')}</div>
                {urgent && <div className="mt-1.5 inline-block rounded-full bg-[#fbe0e6] px-2.5 py-0.5 text-[0.75rem] font-medium text-[#b02347]">{t('Dringend', 'Urgent')}</div>}
              </div>
            </div>

            <div className="p-5">
              <div className="text-muted">{t('Betroffene Personen', 'Affected individuals')}</div>
              <div className="text-[2.25rem] leading-tight font-semibold tabular-nums tracking-[-0.02em]">{n.toLocaleString(t('de-DE', 'en-US'))}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.cats.map((c) => (
                  <span key={c} className={`rounded-full px-2.5 py-0.5 text-[0.75rem] ${c === HEALTH || c === 'IBAN' ? 'bg-[#fbe0e6] text-[#b02347]' : 'bg-[#f4f1f5] text-body'}`}>{c}</span>
                ))}
              </div>
              <div className="mt-4 flex h-2.5 rounded-full overflow-hidden bg-[#efe8f1]">
                {s.ctr.map(([c, v], i) => (
                  <span key={c} className="h-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: seen ? `${v}%` : '0%', background: COLORS[i] }} />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem] text-body">
                {s.ctr.map(([c, v], i) => (
                  <span key={c} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ background: COLORS[i] }} />
                    {c} {v}{t(' %', '%')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 bg-[#faf8fb]">
            <span className="text-muted">{rep ? t('Meldung an die Aufsichtsbehörde vorbereitet, Betroffenenliste angehängt.', 'Notification to the supervisory authority prepared, list of affected individuals attached.') : t('Betroffene, Datenkategorien und Länder fließen in die Meldung.', 'Affected individuals, data categories, and countries feed into the notification.')}</span>
            <button
              type="button"
              onClick={() => setRep((v) => !v)}
              className={`rounded-full px-4 py-2 border-0 cursor-pointer font-semibold transition-colors ${rep ? 'bg-[#e1f4ee] text-[#16795e]' : 'bg-primary text-white hover:bg-primary-hover'}`}
            >
              {rep ? t('✓ Meldung vorbereitet', '✓ Notification prepared') : t('Meldung vorbereiten', 'Prepare notification')}
            </button>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
