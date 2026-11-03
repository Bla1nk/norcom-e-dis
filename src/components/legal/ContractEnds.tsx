import { useState } from 'react'
import { AppWindow, Surface, useSeen } from './shared'
import { t } from '../../lib/i18n'

// Vertragsenden: Kennzahlen, Verteilung je Monat und die nächsten Enddaten, alles aus den Dokumenten gelesen.
// Beispieldaten (fiktive Vertragspartner), Zahlen illustrativ.

const MONTHS = [
  { m: 'Nov', v: 6 }, { m: t('Dez', 'Dec'), v: 11 }, { m: 'Jan', v: 17 }, { m: 'Feb', v: 8 }, { m: t('Mär', 'Mar'), v: 12 }, { m: 'Apr', v: 9 },
  { m: t('Mai', 'May'), v: 14 }, { m: 'Jun', v: 21 }, { m: 'Jul', v: 10 }, { m: 'Aug', v: 7 }, { m: 'Sep', v: 15 },
]

type Kpi = { id: 'all' | '90' | 'notice' | 'auto'; label: string; value: number; sub: string; months: number[] }
const KPIS: Kpi[] = [
  { id: 'all', label: t('Verträge mit Enddatum', 'Contracts with end date'), value: 138, sub: t('aus 18.760 Fundstellen', 'from 18,760 hits'), months: MONTHS.map((_, i) => i) },
  { id: '90', label: t('Enden in 90 Tagen', 'Ending in 90 days'), value: 34, sub: t('bis 31.01.2027', 'through 01/31/2027'), months: [0, 1, 2] },
  { id: 'notice', label: t('Kündigungsfrist läuft bald ab', 'Notice period expiring soon'), value: 9, sub: t('innerhalb von 30 Tagen', 'within 30 days'), months: [0, 1] },
  { id: 'auto', label: t('Automatische Verlängerung', 'Automatic renewal'), value: 41, sub: t('ohne Kündigung 12 Monate', '12 months unless terminated'), months: [1, 3, 4, 6, 7, 10] },
]

type Row = { partner: string; type: string; end: string; notice: string; flags: Kpi['id'][]; badge: string; tone: 'amber' | 'purple' | 'gray' }
const ROWS: Row[] = [
  { partner: 'Nordlicht Logistik GmbH', type: t('Liefervertrag', 'Supply agreement'), end: t('30.11.2026', '11/30/2026'), notice: t('3 Monate zum Quartalsende', '3 months to quarter end'), flags: ['90', 'notice'], badge: t('Frist läuft', 'Notice running'), tone: 'amber' },
  { partner: 'Brandt & Kollegen Beratung', type: t('Beratungsvertrag', 'Consulting agreement'), end: t('15.12.2026', '12/15/2026'), notice: t('6 Wochen', '6 weeks'), flags: ['90', 'notice'], badge: t('Frist läuft', 'Notice running'), tone: 'amber' },
  { partner: 'Lensa Cloud Services AG', type: t('Rahmenvertrag IT', 'IT framework agreement'), end: t('31.12.2026', '12/31/2026'), notice: t('6 Monate zum Jahresende', '6 months to year end'), flags: ['90', 'auto'], badge: t('verlängert sich', 'auto-renews'), tone: 'purple' },
  { partner: 'Nordic Facility Management', type: t('Dienstleistungsvertrag', 'Service agreement'), end: t('31.01.2027', '01/31/2027'), notice: t('3 Monate', '3 months'), flags: ['90', 'auto'], badge: t('verlängert sich', 'auto-renews'), tone: 'purple' },
  { partner: 'Hartmann Fuhrpark KG', type: t('Leasingvertrag', 'Lease agreement'), end: t('28.02.2027', '02/28/2027'), notice: t('3 Monate', '3 months'), flags: ['auto'], badge: t('verlängert sich', 'auto-renews'), tone: 'purple' },
  { partner: 'Kessler Software GmbH', type: t('Lizenzvertrag', 'License agreement'), end: t('31.03.2027', '03/31/2027'), notice: t('6 Monate zum Jahresende', '6 months to year end'), flags: [], badge: t('läuft aus', 'expiring'), tone: 'gray' },
]
const TONE = {
  amber: 'bg-[#fdebd3] text-[#a3560b]',
  purple: 'bg-primary-tint text-primary',
  gray: 'bg-[#efeaf1] text-muted',
}

export function ContractEnds() {
  const [sel, setSel] = useState<Kpi['id']>('90')
  const { ref, seen } = useSeen<HTMLDivElement>()
  const kpi = KPIS.find((k) => k.id === sel)!
  const rows = sel === 'all' ? ROWS : ROWS.filter((r) => r.flags.includes(sel))

  return (
    <Surface>
      <div ref={ref}>
        <AppWindow tab={t('Fristen', 'Deadlines')} title={t('Vertragsenden', 'Contract expiries')}>
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Vertragsenden', 'Contract expiries')}</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">{t('Verträge', 'Contracts')}</span>
            <span className="text-muted">{t('aus 18.760 Fundstellen · 138 Verträge mit erkanntem Enddatum', 'from 18,760 hits · 138 contracts with a detected end date')}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 pb-5">
            {KPIS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setSel(k.id)}
                aria-pressed={sel === k.id}
                className={`min-w-0 text-left rounded-lg border bg-white p-3.5 cursor-pointer transition-all duration-300 ${
                  sel === k.id ? 'border-primary ring-2 ring-primary/15 -translate-y-0.5' : 'border-line hover:border-primary/40'
                }`}
              >
                <div className="text-muted">{k.label}</div>
                <div className={`mt-1 text-[1.75rem] leading-none font-semibold tabular-nums ${sel === k.id ? 'text-primary' : 'text-ink'}`}>{k.value}</div>
                <div className="mt-1.5 text-[0.75rem] text-muted">{k.sub}</div>
              </button>
            ))}
          </div>

          <div className="border-t border-line px-5 pt-4 pb-5">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{t('Vertragsenden je Monat', 'Contract expiries per month')}</span>
              <span className="text-muted">{t('Anzahl Verträge', 'Number of contracts')}</span>
            </div>
            <div className="mt-4 flex items-end gap-1.5 sm:gap-3 h-44">
              {MONTHS.map((b, i) => {
                const on = kpi.months.includes(i)
                return (
                  <div key={b.m} className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-1">
                    <span className={`text-[0.75rem] tabular-nums transition-colors ${on ? 'text-ink font-semibold' : 'text-muted/60'}`}>{b.v}</span>
                    <div
                      className={`w-full rounded-t-md transition-[height,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'bg-primary' : 'bg-[#e1d4e6]'}`}
                      style={{ height: seen ? `${(b.v / 24) * 78}%` : '0%', transitionDelay: seen ? `${i * 45}ms` : '0ms' }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="mt-2 flex gap-1.5 sm:gap-3 text-center text-[0.75rem] text-muted">
              {MONTHS.map((b) => (
                <span key={b.m} className="flex-1 min-w-0">{b.m}</span>
              ))}
            </div>
          </div>

          <div className="border-t border-line">
            <div className="px-5 py-3 text-muted">
              <span className="font-semibold text-ink">{t('Nächste Vertragsenden', 'Next contract expiries')}</span> {t('nach Enddatum', 'by end date')} · {rows.length} {rows.length === 1 ? t('Vertrag', 'contract') : t('Verträge', 'contracts')}
            </div>
            <div className="hidden sm:grid grid-cols-[1.6fr_1.2fr_0.8fr_1.3fr_0.9fr] gap-3 px-5 py-2 text-[0.6875rem] uppercase tracking-[0.08em] text-muted border-y border-line bg-[#faf8fb]">
              <span>{t('Vertragspartner', 'Counterparty')}</span><span>{t('Art', 'Type')}</span><span>{t('Enddatum', 'End date')}</span><span>{t('Kündigungsfrist', 'Notice period')}</span><span />
            </div>
            <ul className="list-none m-0 p-0 min-h-[17.5rem]">
              {rows.map((r) => (
                <li key={r.partner} className="grid sm:grid-cols-[1.6fr_1.2fr_0.8fr_1.3fr_0.9fr] gap-x-3 gap-y-0.5 px-5 py-3 border-b border-line last:border-b-0 items-center">
                  <span className="font-medium">{r.partner}</span>
                  <span className="text-body">{r.type}</span>
                  <span className="tabular-nums">{r.end}</span>
                  <span className="text-body">{r.notice}</span>
                  <span className={`justify-self-start sm:justify-self-end rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${TONE[r.tone]}`}>{r.badge}</span>
                </li>
              ))}
            </ul>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
