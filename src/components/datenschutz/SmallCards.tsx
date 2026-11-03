import { useEffect, useState } from 'react'
import { SubCard } from '../steps/shared'
import { useSeen } from '../legal/shared'
import { t } from '../../lib/i18n'

// Zwei kleine Funktionen: Löschfristen und Zugriffsprotokoll. Fiktive Daten.

export function DatenschutzSmallCards() {
  return (
    <div className="grid md:grid-cols-2 border-t border-line">
      <SubCard title={t('Löschen, wenn es fällig ist.', 'Delete when it is due.')} text={t('Für jede Datenart gilt eine Aufbewahrungsfrist. DaSense zeigt, was abgelaufen ist, und löscht nachweisbar.', 'Every data type has a retention period. DaSense shows what has expired and deletes it verifiably.')}>
        <Retention />
      </SubCard>
      <SubCard className="md:border-l border-line" title={t('Jeder Zugriff protokolliert.', 'Every access logged.')} text={t('Wer hat wann gesucht, geöffnet oder exportiert? Das Protokoll belegt, dass nur Berechtigte auf Daten zugegriffen haben.', 'Who searched, opened, or exported what, and when? The log proves that only authorized users accessed data.')}>
        <AuditLog />
      </SubCard>
    </div>
  )
}

const RULES = [
  { label: t('Bewerbungen nach 6 Monaten', 'Applications after 6 months'), n: 214 },
  { label: t('Rechnungen nach 10 Jahren', 'Invoices after 10 years'), n: 1032 },
  { label: t('Gesundheitsdaten Beschäftigte', 'Employee health data'), n: 37 },
]

function Retention() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [done, setDone] = useState(0)
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setDone((v) => (v + 1) % (RULES.length + 2)), 1800)
    return () => window.clearInterval(id)
  }, [seen])

  return (
    <div ref={ref} className="w-full max-w-[400px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.3)] p-4 text-[0.8125rem]">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[0.875rem]">{t('Löschfristen', 'Retention periods')}</span>
        <span className="text-muted">{done >= RULES.length ? t('alles bereinigt', 'all cleaned up') : t('fällig', 'due')}</span>
      </div>
      <ul className="list-none m-0 mt-3 p-0 flex flex-col gap-2.5">
        {RULES.map((r, i) => {
          const gone = i < done
          return (
            <li key={r.label} className="rounded-lg border border-line px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className={`min-w-0 flex-1 truncate font-medium transition-colors duration-500 ${gone ? 'text-muted line-through' : 'text-ink'}`}>{r.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[0.75rem] font-medium tabular-nums transition-colors duration-500 ${gone ? 'bg-[#e1f4ee] text-[#16795e]' : 'bg-[#fcefcf] text-[#8a5e07]'}`}>
                  {gone ? t('✓ gelöscht', '✓ deleted') : `${r.n.toLocaleString(t('de-DE', 'en-US'))} ${t('fällig', 'due')}`}
                </span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-[#efe8f1] overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out" style={{ width: gone ? '100%' : seen ? '34%' : '0%' }} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const LOG = [
  ['08:12', 'M. Schulz', t('Suche „Berger“', 'Search "Berger"'), t('214 Treffer', '214 hits')],
  ['08:14', 'M. Schulz', t('Öffnet Gehaltsabrechnung.pdf', 'Opens Payslip.pdf'), t('gelesen', 'read')],
  ['08:31', 'J. Roth', t('Export Auskunftspaket', 'Export access package'), t('312 Dok.', '312 docs')],
  ['09:02', 'Dr. Lange', t('Filter Gesundheitsdaten', 'Filter health data'), t('37 Treffer', '37 hits')],
  ['09:20', 'M. Schulz', t('Schwärzung angewendet', 'Redaction applied'), t('5 Stellen', '5 passages')],
  ['09:47', 'J. Roth', t('Löschung bestätigt', 'Deletion confirmed'), t('214 Dok.', '214 docs')],
]

function AuditLog() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [n, setN] = useState(3)
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setN((v) => v + 1), 1700)
    return () => window.clearInterval(id)
  }, [seen])
  const rows = Array.from({ length: 4 }, (_, i) => ({ r: LOG[(n - 3 + i) % LOG.length], k: n - 3 + i }))

  return (
    <div ref={ref} className="w-full max-w-[400px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.3)] overflow-hidden text-[0.8125rem]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <span className="font-semibold text-[0.875rem]">{t('Zugriffsprotokoll', 'Access log')}</span>
        <span className="flex items-center gap-1.5 text-[#16795e]"><span className="size-1.5 rounded-full bg-[#16a07c] blink-dot" />live</span>
      </div>
      <ul className="list-none m-0 p-0">
        {rows.map(({ r, k }) => (
          <li key={k} className="grid grid-cols-[2.6rem_5rem_1fr_auto] gap-2 items-center px-4 py-2.5 border-b border-line last:border-b-0 log-in">
            <span className="tabular-nums text-muted">{r[0]}</span>
            <span className="font-medium truncate">{r[1]}</span>
            <span className="truncate text-body">{r[2]}</span>
            <span className="text-[0.75rem] text-muted whitespace-nowrap">{r[3]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
