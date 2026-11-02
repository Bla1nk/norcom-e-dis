import { useEffect, useState } from 'react'
import { SubCard } from '../steps/shared'
import { useSeen } from './shared'

// Zwei kleine Funktionen: Fristen-Erinnerung und Nachträge zum Hauptvertrag. Beispieldaten fiktiv.

export function LegalSmallCards() {
  return (
    <div className="grid md:grid-cols-2 border-t border-line">
      <SubCard
        title="Erinnert, bevor es zu spät ist."
        text="Zu jeder Kündigungsfrist legt DaSense eine Erinnerung an, per Mail oder im Kalender Ihres Teams."
      >
        <Reminders />
      </SubCard>
      <SubCard
        className="md:border-l border-line"
        title="Hauptvertrag und Nachträge verknüpft."
        text="Änderungsvereinbarungen werden erkannt und zugeordnet. Sie sehen sofort, welcher Stand heute gilt."
      >
        <Amendments />
      </SubCard>
    </div>
  )
}

const REMINDERS = [
  { partner: 'Nordlicht Logistik GmbH', what: 'Kündigungsfrist endet', days: 28, date: '30.11.2026' },
  { partner: 'Brandt & Kollegen Beratung', what: 'Kündigungsfrist endet', days: 42, date: '15.12.2026' },
  { partner: 'Lensa Cloud Services AG', what: 'Verlängerung ohne Kündigung', days: 58, date: '31.12.2026' },
]

function Reminders() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [on, setOn] = useState(0)
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setOn((v) => (v + 1) % REMINDERS.length), 2600)
    return () => window.clearInterval(id)
  }, [seen])

  return (
    <div ref={ref} className="w-full max-w-[400px] flex flex-col gap-3">
      {REMINDERS.map((r, i) => {
        const active = i === on
        return (
          <div
            key={r.partner}
            className={`rounded-xl bg-white ring-1 p-4 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.3)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              active ? 'ring-primary/40 scale-100' : 'ring-black/5 scale-[0.97] opacity-70'
            }`}
            style={{ opacity: seen ? undefined : 0, transform: seen ? undefined : 'translateY(24px)', transitionDelay: seen ? `${i * 120}ms` : '0ms' }}
          >
            <div className="flex items-center gap-3">
              <span className={`grid size-8 place-items-center rounded-full flex-none transition-colors duration-500 ${active ? 'bg-primary text-white' : 'bg-primary-tint text-primary'}`}>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? 'bell-ring' : ''}>
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[0.875rem] font-medium text-ink">{r.partner}</div>
                <div className="text-[0.8125rem] text-muted">{r.what} am {r.date}</div>
              </div>
              <span className="text-[0.8125rem] font-semibold tabular-nums text-primary whitespace-nowrap">in {r.days} Tagen</span>
            </div>
            <div className="mt-3 h-1 rounded-full bg-[#efe8f1] overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out" style={{ width: seen ? `${100 - r.days}%` : '0%' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const CHAIN = [
  { title: 'Hauptvertrag', date: '01.12.2023', change: 'Laufzeit bis 30.11.2026' },
  { title: 'Nachtrag 1', date: '15.03.2025', change: 'Preisanpassung ab 01.04.2025' },
  { title: 'Nachtrag 2', date: '02.09.2026', change: 'Laufzeit verlängert bis 31.05.2027', current: true },
]

function Amendments() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  return (
    <div ref={ref} className="w-full max-w-[400px] relative pl-8">
      <span aria-hidden="true" className="absolute left-[11px] top-3 bottom-3 w-px bg-[#d9c8de] origin-top transition-transform duration-[1400ms] ease-out" style={{ transform: seen ? 'scaleY(1)' : 'scaleY(0)' }} />
      <ul className="list-none m-0 p-0 flex flex-col gap-3">
        {CHAIN.map((c, i) => (
          <li
            key={c.title}
            className="relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateX(-14px)', transitionDelay: seen ? `${250 + i * 350}ms` : '0ms' }}
          >
            <span className={`absolute -left-8 top-4 size-[23px] rounded-full grid place-items-center ring-4 ring-[#f7f6f8] ${c.current ? 'bg-primary' : 'bg-white border border-[#cdbbd3]'}`}>
              {c.current && (
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
              )}
            </span>
            <div className={`rounded-xl bg-white p-3.5 text-[0.8125rem] shadow-[0_16px_40px_-22px_rgba(40,10,50,0.3)] ring-1 ${c.current ? 'ring-primary/40' : 'ring-black/5'}`}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink text-[0.875rem]">{c.title}</span>
                <span className="text-muted tabular-nums">{c.date}</span>
                {c.current && <span className="ml-auto rounded-full bg-primary-tint px-2.5 py-0.5 text-[0.75rem] font-medium text-primary">gilt aktuell</span>}
              </div>
              <div className="mt-1 text-body">{c.change}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
