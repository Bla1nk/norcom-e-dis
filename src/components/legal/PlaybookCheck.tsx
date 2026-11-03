import { useState } from 'react'
import { AppWindow, Surface } from './shared'
import { t } from '../../lib/i18n'

// Abweichungsprüfung: Jeder Vertrag wird Klausel für Klausel gegen den hinterlegten Standard (Playbook) der
// Rechtsabteilung geprüft. Beispielverträge und Fundstellen sind fiktiv.

type Status = 'ok' | 'warn' | 'bad'
type Part = { t: string; mark?: boolean }
type Check = { status: Status; found: Part[] }

const STANDARD: Record<string, string> = {
  haftung: t('Haftung auf den vertragstypischen Schaden begrenzt, höchstens eine Jahresvergütung.', 'Liability limited to damage typical for the contract type, at most one year\'s fees.'),
  kuendigung: t('Ordentliche Kündigung mit drei Monaten zum Quartalsende.', 'Ordinary termination with three months\' notice to the end of a quarter.'),
  verlaengerung: t('Keine automatische Verlängerung, höchstens um sechs Monate.', 'No automatic renewal, six months at most.'),
  gericht: t('Gerichtsstand am Sitz des eigenen Unternehmens, deutsches Recht.', 'Jurisdiction at our own company\'s registered seat, German law.'),
  avv: t('Auftragsverarbeitung nach Art. 28 DSGVO ist als Anlage vereinbart.', 'Data processing under Art. 28 GDPR is agreed as an annex.'),
}
const LABELS: Record<string, string> = {
  haftung: t('Haftungsbegrenzung', 'Limitation of liability'),
  kuendigung: t('Kündigungsfrist', 'Notice period'),
  verlaengerung: t('Verlängerung', 'Renewal'),
  gericht: t('Gerichtsstand', 'Jurisdiction'),
  avv: t('Auftragsverarbeitung', 'Data processing'),
}
const KEYS = Object.keys(LABELS)

const CONTRACTS: { name: string; type: string; checks: Record<string, Check> }[] = [
  {
    name: 'Nordlicht Logistik GmbH',
    type: t('Liefervertrag', 'Supply agreement'),
    checks: {
      haftung: { status: 'ok', found: [{ t: t('Haftung auf vorhersehbaren Schaden, höchstens ', 'Liability for foreseeable damage, at most ') }, { t: t('500.000 Euro', 'EUR 500,000'), mark: true }, { t: t(' je Schadensfall.', ' per claim.') }] },
      kuendigung: { status: 'ok', found: [{ t: t('Kündigung mit ', 'Termination with ') }, { t: t('drei Monaten zum Quartalsende', 'three months\' notice to quarter end'), mark: true }, { t: '.' }] },
      verlaengerung: { status: 'bad', found: [{ t: t('Verlängerung jeweils um ', 'Renewal by ') }, { t: t('12 Monate', '12 months'), mark: true }, { t: t(' ohne Kündigung.', ' unless terminated.') }] },
      gericht: { status: 'ok', found: [{ t: t('Gerichtsstand Hamburg, deutsches Recht.', 'Jurisdiction Hamburg, German law.') }] },
      avv: { status: 'ok', found: [{ t: t('Anlage 3: Auftragsverarbeitung nach Art. 28 DSGVO.', 'Annex 3: Data processing under Art. 28 GDPR.') }] },
    },
  },
  {
    name: 'Lensa Cloud Services AG',
    type: t('Rahmenvertrag IT', 'IT framework agreement'),
    checks: {
      haftung: { status: 'bad', found: [{ t: t('Die Haftung des Anbieters ist ', 'The provider\'s liability is ') }, { t: t('auf 10 % der Jahresvergütung', 'to 10% of annual fees'), mark: true }, { t: t(' beschränkt.', ' capped.') }] },
      kuendigung: { status: 'warn', found: [{ t: t('Kündigung mit ', 'Termination with ') }, { t: t('sechs Monaten zum Jahresende', 'six months\' notice to year end'), mark: true }, { t: '.' }] },
      verlaengerung: { status: 'warn', found: [{ t: t('Verlängerung um ', 'Renewal by ') }, { t: t('12 Monate', '12 months'), mark: true }, { t: t(', Hinweis des Anbieters 90 Tage vorher.', ', provider notice 90 days in advance.') }] },
      gericht: { status: 'bad', found: [{ t: t('Gerichtsstand ', 'Jurisdiction ') }, { t: t('Dublin, irisches Recht', 'Dublin, Irish law'), mark: true }, { t: '.' }] },
      avv: { status: 'ok', found: [{ t: t('Anlage 2: Auftragsverarbeitung nach Art. 28 DSGVO.', 'Annex 2: Data processing under Art. 28 GDPR.') }] },
    },
  },
  {
    name: 'Brandt & Kollegen Beratung',
    type: t('Beratungsvertrag', 'Consulting agreement'),
    checks: {
      haftung: { status: 'warn', found: [{ t: t('Haftung begrenzt auf ', 'Liability capped at ') }, { t: t('50.000 Euro', 'EUR 50,000'), mark: true }, { t: t(' je Auftrag.', ' per engagement.') }] },
      kuendigung: { status: 'ok', found: [{ t: t('Kündigung mit sechs Wochen, jederzeit zulässig.', 'Termination with six weeks\' notice, permitted at any time.') }] },
      verlaengerung: { status: 'ok', found: [{ t: t('Keine automatische Verlängerung.', 'No automatic renewal.') }] },
      gericht: { status: 'ok', found: [{ t: t('Gerichtsstand Hamburg, deutsches Recht.', 'Jurisdiction Hamburg, German law.') }] },
      avv: { status: 'bad', found: [{ t: t('Keine Regelung gefunden.', 'No provision found.'), mark: true }] },
    },
  },
]

const DOT: Record<Status, string> = { ok: 'bg-[#16a07c]', warn: 'bg-[#e0a21e]', bad: 'bg-[#d6385c]' }
const TXT: Record<Status, string> = { ok: t('Entspricht', 'Compliant'), warn: t('Prüfen', 'Review'), bad: t('Abweichung', 'Deviation') }
const PILL: Record<Status, string> = { ok: 'bg-[#e1f4ee] text-[#16795e]', warn: 'bg-[#fcefcf] text-[#8a5e07]', bad: 'bg-[#fbe0e6] text-[#b02347]' }

export function PlaybookCheck() {
  const [ci, setCi] = useState(1)
  const [open, setOpen] = useState<string>('haftung')
  const c = CONTRACTS[ci]
  const counts = { ok: 0, warn: 0, bad: 0 }
  KEYS.forEach((k) => counts[c.checks[k].status]++)

  return (
    <Surface tone="grid">
      <AppWindow tab="AI Report" title={t('Abweichungsprüfung', 'Deviation check')}>
        <div className="flex flex-wrap gap-2 px-5 pt-4">
          {CONTRACTS.map((x, i) => (
            <button
              key={x.name}
              type="button"
              onClick={() => setCi(i)}
              aria-pressed={i === ci}
              className={`rounded-full border px-3.5 py-1.5 cursor-pointer transition-colors ${i === ci ? 'bg-ink text-white border-ink' : 'bg-white text-body border-line hover:border-primary/40'}`}
            >
              {x.name}
            </button>
          ))}
        </div>
        <div className="px-5 pt-4 pb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[1.0625rem] font-semibold">{c.type}</span>
          <span className="text-muted">{t('gegen Playbook „Einkauf Standard“', 'against playbook “Procurement Standard”')}</span>
          <span className="ml-auto flex gap-1.5">
            {(['bad', 'warn', 'ok'] as Status[]).map((s) => (
              <span key={s} className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${PILL[s]}`}>
                {counts[s]} {TXT[s]}
              </span>
            ))}
          </span>
        </div>

        <ul className="list-none m-0 p-0 border-t border-line">
          {KEYS.map((k) => {
            const ch = c.checks[k]
            const isOpen = open === k
            return (
              <li key={k} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? '' : k)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center gap-3 text-left px-5 py-3.5 bg-transparent border-0 cursor-pointer transition-colors ${isOpen ? 'bg-[#faf8fb]' : 'hover:bg-[#faf8fb]'}`}
                >
                  <span className={`size-2.5 rounded-full flex-none ${DOT[ch.status]}`} />
                  <span className="font-medium w-44 flex-none">{LABELS[k]}</span>
                  <span className="hidden md:block flex-1 min-w-0 truncate text-body">
                    {ch.found.map((p) => p.t).join('')}
                  </span>
                  <span className={`ml-auto flex-none rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${PILL[ch.status]}`}>{TXT[ch.status]}</span>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`flex-none text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-3 px-5 pb-5">
                      <div className="rounded-lg border border-line bg-white p-3.5">
                        <div className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted mb-1.5">{t('Standard', 'Standard')}</div>
                        <p className="m-0 leading-[1.55]">{STANDARD[k]}</p>
                      </div>
                      <div className={`rounded-lg border p-3.5 ${ch.status === 'ok' ? 'border-line bg-white' : ch.status === 'warn' ? 'border-[#f0d9a0] bg-[#fffaf0]' : 'border-[#f1b9c6] bg-[#fff6f8]'}`}>
                        <div className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted mb-1.5">{t('Im Vertrag', 'In the contract')}</div>
                        <p className="m-0 leading-[1.55]">
                          {ch.found.map((p, i) =>
                            p.mark ? (
                              <mark key={i} className={`rounded px-0.5 ${ch.status === 'warn' ? 'bg-[#f7e0a6]' : ch.status === 'bad' ? 'bg-[#f6c3cf]' : 'bg-[#dff1ea]'}`}>
                                {p.t}
                              </mark>
                            ) : (
                              <span key={i}>{p.t}</span>
                            ),
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </AppWindow>
    </Surface>
  )
}
