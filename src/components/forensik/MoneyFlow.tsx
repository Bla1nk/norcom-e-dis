import { useState } from 'react'
import { AppWindow, Surface, useSeen } from '../legal/shared'
import { t } from '../../lib/i18n'

// Geldflüsse: Zahlungswege aus Rechnungen, Mails und Belegen rekonstruiert, samt Rückfluss. Fiktive Firmen, Beträge illustrativ.

type Path = { id: string; label: string; amount: number; d: string; loop?: boolean }
const PATHS: Path[] = [
  { id: 'nova', label: 'Nova Consult Ltd.', amount: 480, d: 'M150 120 C 230 120, 230 62, 310 62 S 390 120, 470 120' },
  { id: 'brisa', label: 'Brisa Trading SA', amount: 310, d: 'M150 120 C 230 120, 230 130, 310 130 S 390 120, 470 120' },
  { id: 'kern', label: 'Kern Services GmbH', amount: 190, d: 'M150 120 C 230 120, 230 200, 310 200 S 390 120, 470 120' },
  { id: 'loop', label: t('Rückfluss', 'Return flow'), amount: 420, d: 'M520 150 C 520 285, 100 285, 100 150', loop: true },
]
const MID = [
  { id: 'nova', x: 310, y: 62, label: 'Nova Consult Ltd.', sub: t('Zypern', 'Cyprus') },
  { id: 'brisa', x: 310, y: 130, label: 'Brisa Trading SA', sub: 'Panama' },
  { id: 'kern', x: 310, y: 200, label: 'Kern Services GmbH', sub: t('Deutschland', 'Germany') },
]

export function MoneyFlow() {
  const [sel, setSel] = useState<string>('all')
  const { ref, seen } = useSeen<HTMLDivElement>()
  const on = (p: Path) => sel === 'all' || sel === p.id
  const total = PATHS.filter((p) => !p.loop && on(p)).reduce((s, p) => s + p.amount, 0)
  const back = PATHS.find((p) => p.loop)!
  const loopOn = on(back)

  return (
    <Surface tone="dark">
      <div ref={ref}>
        <AppWindow tab={t('Geldflüsse', 'Money flows')} title={t('Geldflüsse', 'Money flows')}>
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Geldflüsse', 'Money flows')}</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">{t('Transaktionsfall', 'Transaction case')}</span>
            <span className="text-muted">{t('aus 2.140 Belegen rekonstruiert, Beträge in Tsd. €', 'reconstructed from 2,140 documents, amounts in € thousands')}</span>
          </div>

          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {[{ id: 'all', label: t('Alle Pfade', 'All paths') }, ...PATHS.map((p) => ({ id: p.id, label: p.label }))].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSel(c.id)}
                aria-pressed={sel === c.id}
                className={`rounded-full border px-3.5 py-1.5 cursor-pointer transition-colors ${sel === c.id ? 'bg-ink text-white border-ink' : 'bg-white text-body border-line hover:border-primary/40'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="px-3 sm:px-5 border-t border-line">
            <svg viewBox="0 0 640 300" className="w-full h-auto" role="img" aria-label={t('Zahlungswege von der Halden Holding über drei Zwischenfirmen zur Orion Advisory und ein Rückfluss', 'Payment paths from Halden Holding through three intermediary companies to Orion Advisory, plus a return flow')}>
              {PATHS.map((p) => {
                const live = on(p)
                return (
                  <path
                    key={p.id}
                    d={p.d}
                    fill="none"
                    stroke={p.loop ? '#d6385c' : '#601571'}
                    strokeWidth={Math.max(3, p.amount / 38)}
                    strokeLinecap="round"
                    strokeOpacity={live ? 0.28 : 0.07}
                    style={{ transition: 'stroke-opacity 400ms' }}
                  />
                )
              })}
              {PATHS.map((p) => (
                <path
                  key={p.id + 'f'}
                  d={p.d}
                  fill="none"
                  stroke={p.loop ? '#d6385c' : '#601571'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 6"
                  className={on(p) && seen ? 'flow-12' : ''}
                  style={{ opacity: on(p) ? 1 : 0, transition: 'opacity 400ms' }}
                />
              ))}

              {/* Auftraggeber */}
              <g>
                <rect x="14" y="94" width="136" height="54" rx="10" fill="#fff" stroke="#1a1220" strokeWidth="1.6" />
                <text x="82" y="117" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#1a1220">Halden Holding</text>
                <text x="82" y="134" textAnchor="middle" fontSize="11" fill="#5b5160">{t('Auftraggeber', 'Principal')}</text>
              </g>
              {/* Zwischenfirmen */}
              {MID.map((n) => {
                const p = PATHS.find((x) => x.id === n.id)!
                return (
                  <g key={n.id} style={{ opacity: on(p) ? 1 : 0.3, transition: 'opacity 400ms', cursor: 'pointer' }} onClick={() => setSel(sel === n.id ? 'all' : n.id)}>
                    <rect x={n.x - 62} y={n.y - 22} width="124" height="44" rx="10" fill="#fff" stroke="#1a1220" strokeWidth="1.6" />
                    <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1a1220">{n.label}</text>
                    <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize="10.5" fill="#5b5160">{n.sub}</text>
                  </g>
                )
              })}
              {/* Empfänger */}
              <g>
                <rect x="470" y="94" width="150" height="54" rx="10" fill="#fff" stroke="#d6385c" strokeWidth="2" />
                <text x="545" y="117" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#1a1220">Orion Advisory</text>
                <text x="545" y="134" textAnchor="middle" fontSize="11" fill="#5b5160">{t('Empfänger', 'Recipient')}</text>
              </g>

              {/* Beträge */}
              {[['nova', 310, 38], ['brisa', 310, 106], ['kern', 310, 176]].map(([id, x, y]) => {
                const p = PATHS.find((q) => q.id === id)!
                return (
                  <text key={id as string} x={x as number} y={y as number} textAnchor="middle" fontSize="12" fontWeight="600" fill="#601571" style={{ opacity: on(p) ? 1 : 0, transition: 'opacity 400ms' }}>
                    {p.amount}
                  </text>
                )
              })}
              <text x="300" y="268" textAnchor="middle" fontSize="12" fontWeight="600" fill="#d6385c" style={{ opacity: loopOn ? 1 : 0, transition: 'opacity 400ms' }}>
                {t('Rückfluss', 'Return flow')} {back.amount}
              </text>
            </svg>
          </div>

          <div className="grid sm:grid-cols-[1fr_auto] items-center gap-3 border-t border-line px-5 py-4 bg-[#faf8fb]">
            <div className="flex items-start gap-2.5 rounded-lg bg-[#fff6f8] border border-[#f1b9c6] px-3.5 py-2.5 text-[#8c1f3b]">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none fo-spin-slow">
                <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />
              </svg>
              <span><span className="font-semibold">{t('Kreislauf erkannt:', 'Circular flow detected:')}</span> {t('420 Tsd. € fließen von Orion Advisory zurück an die Halden Holding.', '€420k flows from Orion Advisory back to Halden Holding.')}</span>
            </div>
            <div className="text-right">
              <div className="text-muted text-[0.75rem]">{t('Summe ausgewählter Pfade', 'Total of selected paths')}</div>
              <div className="text-[1.5rem] leading-none font-semibold tabular-nums">{total.toLocaleString(t('de-DE', 'en-US'))} <span className="text-[0.875rem] text-muted font-normal">{t('Tsd. €', '€ thousand')}</span></div>
            </div>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
