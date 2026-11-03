import { useState } from 'react'
import { AppWindow, Surface } from '../legal/shared'
import { t } from '../../lib/i18n'

// Privilegienprüfung: Die KI erkennt Anwaltskorrespondenz, das Team bestätigt. Fiktive Mails.

type St = 'priv' | 'check' | 'biz'
const ROWS: { id: number; subject: string; who: string; reason: string; st: St; conf: number }[] = [
  { id: 1, subject: t('RE: Einschätzung Kartellrisiko', 'RE: Assessment of antitrust risk'), who: t('dr.weiss@kanzlei-weiss.de → J. Weber', 'dr.weiss@weiss-law.com → J. Weber'), reason: t('Anwalt erkannt, Rechtsrat', 'Attorney detected, legal advice'), st: 'priv', conf: 98 },
  { id: 2, subject: t('Entwurf Stellungnahme BKartA', 'Draft statement to Federal Cartel Office'), who: t('M. Keller → dr.weiss@kanzlei-weiss.de', 'M. Keller → dr.weiss@weiss-law.com'), reason: t('Anwalt erkannt, Entwurf', 'Attorney detected, draft'), st: 'priv', conf: 96 },
  { id: 3, subject: t('FW: Rückfrage zur Preisliste', 'FW: Question about price list'), who: t('T. Hansen → Vertrieb, cc Rechtsabteilung', 'T. Hansen → Sales, cc Legal Department'), reason: t('Rechtsabteilung nur in Kopie', 'Legal department only in cc'), st: 'check', conf: 61 },
  { id: 4, subject: t('Lieferplan September', 'Delivery plan September'), who: t('S. Albrecht → Logistik', 'S. Albrecht → Logistics'), reason: t('Kein Anwalt beteiligt', 'No attorney involved'), st: 'biz', conf: 93 },
  { id: 5, subject: t('Vertraulich: Gesprächsnotiz Anwalt', 'Confidential: Attorney call note'), who: t('P. Lorenz → Notizen', 'P. Lorenz → Notes'), reason: t('Nennt Anwaltsgespräch', 'Mentions attorney conversation'), st: 'check', conf: 67 },
  { id: 6, subject: t('RE: Termin Rheinhotel', 'RE: Rheinhotel appointment'), who: 'K. Vogel → J. Weber', reason: t('Kein Anwalt beteiligt', 'No attorney involved'), st: 'biz', conf: 90 },
]
const TABS: { id: St | 'all'; label: string }[] = [
  { id: 'all', label: t('Alle', 'All') },
  { id: 'priv', label: t('Privilegiert', 'Privileged') },
  { id: 'check', label: t('Prüfen', 'Review') },
  { id: 'biz', label: t('Geschäftlich', 'Business') },
]
const PILL: Record<St, string> = { priv: 'bg-[#e9d9ee] text-primary', check: 'bg-[#fcefcf] text-[#8a5e07]', biz: 'bg-[#efeaf1] text-muted' }
const NAME: Record<St, string> = { priv: t('Privilegiert', 'Privileged'), check: t('Prüfen', 'Review'), biz: t('Geschäftlich', 'Business') }

export function PrivilegeCheck() {
  const [tab, setTab] = useState<St | 'all'>('all')
  const [done, setDone] = useState<Set<number>>(new Set([1]))
  const rows = tab === 'all' ? ROWS : ROWS.filter((r) => r.st === tab)
  const toggle = (id: number) =>
    setDone((d) => {
      const n = new Set(d)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  return (
    <Surface tone="dark">
      <AppWindow tab="Smart Filter" title={t('Privilegienprüfung', 'Privilege review')}>
        <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Privilegienprüfung', 'Privilege review')}</h4>
          <span className="text-muted">{t('148 privilegiert · 23 zu prüfen · 1.069 geschäftlich', '148 privileged · 23 to review · 1,069 business')}</span>
          <span className="ml-auto rounded-full border border-line px-3 py-1 text-[0.75rem] text-body">{t('Privilegien-Log exportieren', 'Export privilege log')}</span>
        </div>
        <div className="flex gap-1.5 px-5 pb-3 overflow-x-auto no-scrollbar">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              type="button"
              onClick={() => setTab(tb.id)}
              aria-pressed={tab === tb.id}
              className={`rounded-full px-3.5 py-1.5 border-0 cursor-pointer whitespace-nowrap transition-colors ${tab === tb.id ? 'bg-ink text-white' : 'bg-[#f4f1f5] text-body hover:bg-[#ebe5ee]'}`}
            >
              {tb.label}
            </button>
          ))}
        </div>
        <ul className="list-none m-0 p-0 border-t border-line min-h-[21rem]">
          {rows.map((r) => {
            const ok = done.has(r.id)
            return (
              <li key={r.id} className="grid sm:grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_auto_auto] gap-x-4 gap-y-1 items-center px-5 py-3.5 border-b border-line last:border-b-0">
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.subject}</div>
                  <div className="text-muted truncate">{r.who}</div>
                </div>
                <div className="text-body text-[0.8125rem]">
                  {r.reason}
                  <span className="ml-2 tabular-nums text-muted">{r.conf}%</span>
                </div>
                <span className={`justify-self-start rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${PILL[r.st]}`}>{NAME[r.st]}</span>
                <button
                  type="button"
                  onClick={() => toggle(r.id)}
                  aria-pressed={ok}
                  className={`justify-self-start sm:justify-self-end flex items-center gap-1.5 rounded-full border px-3 py-1 cursor-pointer transition-colors ${ok ? 'bg-primary border-primary text-white' : 'bg-white border-line text-body hover:border-primary/50'}`}
                >
                  {ok ? t('Bestätigt', 'Confirmed') : t('Bestätigen', 'Confirm')}
                </button>
              </li>
            )
          })}
        </ul>
      </AppWindow>
    </Surface>
  )
}
