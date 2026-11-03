import { useState } from 'react'
import { AppWindow, Surface, useSeen } from '../legal/shared'
import { t } from '../../lib/i18n'

// Red Flags (Fraud Investigations): typische Warnmuster mit Fundstellen. Fiktive Belege, Zahlen illustrativ.

type Part = { t: string; m?: boolean }
const FLAGS: { id: string; label: string; count: number; hits: { src: string; meta: string; score: number; text: Part[] }[] }[] = [
  {
    id: 'eil',
    label: t('Eilüberweisung', 'Rush transfer'),
    count: 184,
    hits: [
      { src: t('RE: Zahlung heute noch.eml', 'RE: Payment today.eml'), meta: t('Finanzen → Buchhaltung · 14.03.', 'Finance → Accounting · 03/14'), score: 94, text: t([{ t: 'Bitte ' }, { t: 'noch heute, vor Kassenschluss', m: true }, { t: ' überweisen, die Rechnung muss nicht mehr geprüft werden.' }], [{ t: 'Please transfer ' }, { t: 'today, before close of business', m: true }, { t: '; the invoice no longer needs to be checked.' }]) },
      { src: t('Zahlungsauftrag_0412.pdf', 'Payment_order_0412.pdf'), meta: t('Beleg · 02.04.', 'Receipt · 04/02'), score: 81, text: t([{ t: 'Zahlungsziel: ' }, { t: 'sofort, Express-Freigabe', m: true }, { t: ' durch Geschäftsleitung.' }], [{ t: 'Payment term: ' }, { t: 'immediate, express approval', m: true }, { t: ' by management.' }]) },
      { src: t('FW: Dringend!!.eml', 'FW: Urgent!!.eml'), meta: t('Vertrieb → Finanzen · 19.04.', 'Sales → Finance · 04/19'), score: 72, text: t([{ t: 'Betrag ' }, { t: 'ohne Rückfrage anweisen', m: true }, { t: ', Empfänger drängt.' }], [{ t: 'Wire the amount ' }, { t: 'without further questions', m: true }, { t: '; the recipient is pushing.' }]) },
    ],
  },
  {
    id: 'bar',
    label: t('Barzahlung', 'Cash payment'),
    count: 61,
    hits: [
      { src: t('Notiz_Treffen.docx', 'Meeting_note.docx'), meta: t('Anlage · 08.05.', 'Attachment · 05/08'), score: 91, text: t([{ t: 'Übergabe der ' }, { t: '25.000 € in bar', m: true }, { t: ', keine Quittung nötig.' }], [{ t: 'Handover of ' }, { t: '€25,000 in cash', m: true }, { t: ', no receipt needed.' }]) },
      { src: t('RE: Kasse.eml', 'RE: Cash desk.eml'), meta: t('Einkauf → Kasse · 11.05.', 'Purchasing → Cash desk · 05/11'), score: 77, text: t([{ t: 'Bitte ' }, { t: 'Betrag in bar bereithalten', m: true }, { t: ', läuft nicht über das Konto.' }], [{ t: 'Please ' }, { t: 'have the amount ready in cash', m: true }, { t: '; it does not go through the account.' }]) },
    ],
  },
  {
    id: 'freigabe',
    label: t('Freigabe umgangen', 'Approval bypassed'),
    count: 97,
    hits: [
      { src: t('RE: Vier-Augen.eml', 'RE: Four-eyes.eml'), meta: t('Leitung → Buchhaltung · 22.06.', 'Management → Accounting · 06/22'), score: 96, text: t([{ t: 'Die Freigabe ' }, { t: 'machen wir unter uns, ohne zweite Unterschrift', m: true }, { t: '.' }], [{ t: 'We will ' }, { t: 'handle the approval among ourselves, without a second signature', m: true }, { t: '.' }]) },
      { src: t('Genehmigung_Entwurf.pdf', 'Approval_draft.pdf'), meta: t('Beleg · 30.06.', 'Receipt · 06/30'), score: 83, text: t([{ t: 'Betrag knapp ' }, { t: 'unter der Freigabegrenze von 10.000 €', m: true }, { t: ' gehalten.' }], [{ t: 'Amount kept just ' }, { t: 'below the approval limit of €10,000', m: true }, { t: '.' }]) },
      { src: t('FW: Splitten.eml', 'FW: Splitting.eml'), meta: t('Einkauf → Leitung · 04.07.', 'Purchasing → Management · 07/04'), score: 79, text: t([{ t: 'Rechnung ' }, { t: 'auf drei Teile splitten', m: true }, { t: ', dann braucht niemand zu zeichnen.' }], [{ t: 'Split the invoice ' }, { t: 'into three parts', m: true }, { t: ', then nobody has to sign.' }]) },
    ],
  },
  {
    id: 'geheim',
    label: t('Geheimhaltung', 'Secrecy'),
    count: 143,
    hits: [
      { src: t('Chat_Export_0715.txt', 'Chat_export_0715.txt'), meta: t('Chat · 15.07.', 'Chat · 07/15'), score: 88, text: t([{ t: 'Das bitte ' }, { t: 'nur mündlich besprechen', m: true }, { t: ', nichts per Mail.' }], [{ t: 'Please ' }, { t: 'discuss this verbally only', m: true }, { t: ', nothing by email.' }]) },
      { src: t('RE: Lösch das.eml', 'RE: Delete this.eml'), meta: t('Leitung → Assistenz · 16.07.', 'Management → Assistant · 07/16'), score: 85, text: t([{ t: 'Mail ' }, { t: 'bitte nach dem Lesen löschen', m: true }, { t: ' und nicht weiterleiten.' }], [{ t: 'Please ' }, { t: 'delete this email after reading', m: true }, { t: ' and do not forward it.' }]) },
    ],
  },
]

const tone = (s: number) => (s >= 90 ? 'bg-[#d6385c]' : s >= 80 ? 'bg-[#e08a1e]' : 'bg-[#e0b53a]')

export function RedFlags() {
  const [sel, setSel] = useState('freigabe')
  const { ref, seen } = useSeen<HTMLDivElement>()
  const cur = FLAGS.find((f) => f.id === sel)!
  const max = Math.max(...FLAGS.map((f) => f.count))

  return (
    <Surface>
      <div ref={ref}>
        <AppWindow tab="Smart Filter" title="Red Flags">
          <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">Red Flags</h4>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">Fraud Investigations</span>
            <span className="text-muted">{t('Muster in 41.600 Dokumenten gesucht', 'Searched 41,600 documents for patterns')}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 pb-5">
            {FLAGS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSel(f.id)}
                aria-pressed={sel === f.id}
                className={`min-w-0 text-left rounded-lg border bg-white p-3.5 cursor-pointer transition-all duration-300 ${
                  sel === f.id ? 'border-primary ring-2 ring-primary/15 -translate-y-0.5' : 'border-line hover:border-primary/40'
                }`}
              >
                <div className="text-muted truncate">{f.label}</div>
                <div className={`mt-1 text-[1.75rem] leading-none font-semibold tabular-nums ${sel === f.id ? 'text-primary' : 'text-ink'}`}>{f.count}</div>
                <div className="mt-3 h-1.5 rounded-full bg-[#efe8f1] overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: seen ? `${(f.count / max) * 100}%` : '0%' }} />
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-line">
            <div className="px-5 py-3 text-muted">
              <span className="font-semibold text-ink">{t('Fundstellen', 'Matches')}: {cur.label}</span> · {t(`${cur.hits.length} von ${cur.count} angezeigt`, `${cur.hits.length} of ${cur.count} shown`)}
            </div>
            <ul key={cur.id} className="list-none m-0 p-0 border-t border-line min-h-[19rem]">
              {cur.hits.map((h, i) => (
                <li key={h.src} className="fo-rise grid sm:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] gap-x-5 gap-y-2 px-5 py-4 border-b border-line last:border-b-0 items-center" style={{ animationDelay: `${i * 90}ms` }}>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="font-medium truncate">{h.src}</span>
                      <span className="text-muted text-[0.75rem] whitespace-nowrap hidden md:inline">{h.meta}</span>
                    </div>
                    <p className="m-0 mt-1 text-body leading-[1.55]">
                      {h.text.map((p, j) =>
                        p.m ? (
                          <mark key={j} className="rounded px-0.5 bg-[#fadbe2] text-ink">{p.t}</mark>
                        ) : (
                          <span key={j}>{p.t}</span>
                        ),
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex-1 h-1.5 rounded-full bg-[#efe8f1] overflow-hidden">
                      <span className={`block h-full rounded-full transition-[width] duration-700 ease-out ${tone(h.score)}`} style={{ width: seen ? `${h.score}%` : '0%', transitionDelay: `${i * 90}ms` }} />
                    </span>
                    <span className="tabular-nums text-muted w-[4.5rem] text-right">{t('Risiko', 'Risk')} {h.score}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </AppWindow>
      </div>
    </Surface>
  )
}
