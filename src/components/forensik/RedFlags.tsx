import { useState } from 'react'
import { AppWindow, Surface, useSeen } from '../legal/shared'

// Red Flags (Fraud Investigations): typische Warnmuster mit Fundstellen. Fiktive Belege, Zahlen illustrativ.

type Part = { t: string; m?: boolean }
const FLAGS: { id: string; label: string; count: number; hits: { src: string; meta: string; score: number; text: Part[] }[] }[] = [
  {
    id: 'eil',
    label: 'Eilüberweisung',
    count: 184,
    hits: [
      { src: 'RE: Zahlung heute noch.eml', meta: 'Finanzen → Buchhaltung · 14.03.', score: 94, text: [{ t: 'Bitte ' }, { t: 'noch heute, vor Kassenschluss', m: true }, { t: ' überweisen, die Rechnung muss nicht mehr geprüft werden.' }] },
      { src: 'Zahlungsauftrag_0412.pdf', meta: 'Beleg · 02.04.', score: 81, text: [{ t: 'Zahlungsziel: ' }, { t: 'sofort, Express-Freigabe', m: true }, { t: ' durch Geschäftsleitung.' }] },
      { src: 'FW: Dringend!!.eml', meta: 'Vertrieb → Finanzen · 19.04.', score: 72, text: [{ t: 'Betrag ' }, { t: 'ohne Rückfrage anweisen', m: true }, { t: ', Empfänger drängt.' }] },
    ],
  },
  {
    id: 'bar',
    label: 'Barzahlung',
    count: 61,
    hits: [
      { src: 'Notiz_Treffen.docx', meta: 'Anlage · 08.05.', score: 91, text: [{ t: 'Übergabe der ' }, { t: '25.000 € in bar', m: true }, { t: ', keine Quittung nötig.' }] },
      { src: 'RE: Kasse.eml', meta: 'Einkauf → Kasse · 11.05.', score: 77, text: [{ t: 'Bitte ' }, { t: 'Betrag in bar bereithalten', m: true }, { t: ', läuft nicht über das Konto.' }] },
    ],
  },
  {
    id: 'freigabe',
    label: 'Freigabe umgangen',
    count: 97,
    hits: [
      { src: 'RE: Vier-Augen.eml', meta: 'Leitung → Buchhaltung · 22.06.', score: 96, text: [{ t: 'Die Freigabe ' }, { t: 'machen wir unter uns, ohne zweite Unterschrift', m: true }, { t: '.' }] },
      { src: 'Genehmigung_Entwurf.pdf', meta: 'Beleg · 30.06.', score: 83, text: [{ t: 'Betrag knapp ' }, { t: 'unter der Freigabegrenze von 10.000 €', m: true }, { t: ' gehalten.' }] },
      { src: 'FW: Splitten.eml', meta: 'Einkauf → Leitung · 04.07.', score: 79, text: [{ t: 'Rechnung ' }, { t: 'auf drei Teile splitten', m: true }, { t: ', dann braucht niemand zu zeichnen.' }] },
    ],
  },
  {
    id: 'geheim',
    label: 'Geheimhaltung',
    count: 143,
    hits: [
      { src: 'Chat_Export_0715.txt', meta: 'Chat · 15.07.', score: 88, text: [{ t: 'Das bitte ' }, { t: 'nur mündlich besprechen', m: true }, { t: ', nichts per Mail.' }] },
      { src: 'RE: Lösch das.eml', meta: 'Leitung → Assistenz · 16.07.', score: 85, text: [{ t: 'Mail ' }, { t: 'bitte nach dem Lesen löschen', m: true }, { t: ' und nicht weiterleiten.' }] },
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
            <span className="text-muted">Muster in 41.600 Dokumenten gesucht</span>
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
              <span className="font-semibold text-ink">Fundstellen: {cur.label}</span> · {cur.hits.length} von {cur.count} angezeigt
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
                    <span className="tabular-nums text-muted w-[4.5rem] text-right">Risiko {h.score}</span>
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
