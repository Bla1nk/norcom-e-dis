import { useState } from 'react'
import { AppWindow, Surface } from '../legal/shared'
import { t } from '../../lib/i18n'

// Erkennung und Schwärzung personenbezogener Daten in einer Beispiel-Mail. Fiktiv.

type Cat = 'name' | 'mail' | 'health' | 'iban' | 'phone'
const CATS: { id: Cat; label: string; hi: string; dot: string }[] = [
  { id: 'name', label: t('Name', 'Name'), hi: 'bg-[#e9d9ee]', dot: 'bg-primary' },
  { id: 'mail', label: t('E-Mail', 'Email'), hi: 'bg-[#d9e6fb]', dot: 'bg-[#2f6fe0]' },
  { id: 'health', label: t('Gesundheitsdaten', 'Health data'), hi: 'bg-[#fadbe2]', dot: 'bg-[#d6385c]' },
  { id: 'iban', label: 'IBAN', hi: 'bg-[#fbe7c8]', dot: 'bg-[#e08a1e]' },
  { id: 'phone', label: t('Telefon', 'Phone'), hi: 'bg-[#d6efe8]', dot: 'bg-[#16a07c]' },
]
type Seg = { t: string; c?: Cat }
const TEXT: Seg[][] = [
  [{ t: t('Von: ', 'From: ') }, { t: 'Anna Berger', c: 'name' }, { t: ' <' }, { t: 'anna.berger@beispiel.de', c: 'mail' }, { t: '>' }],
  [{ t: t('Betreff: Krankmeldung und Gehaltsabrechnung', 'Subject: Sick note and payslip') }],
  [
    { t: t('Hallo Herr Schulz, ich bin seit dem 12.03. krankgeschrieben (', 'Hello Mr. Schulz, I have been on sick leave since March 12 (') },
    { t: t('Diagnose: Bandscheibenvorfall', 'Diagnosis: herniated disc'), c: 'health' },
    { t: t('). Bitte überweisen Sie das Gehalt weiter auf ', '). Please continue to transfer my salary to ') },
    { t: 'IBAN DE89 3704 0044 0532 0130 00', c: 'iban' },
    { t: t('. Rückfragen gern unter ', '. Feel free to reach me at ') },
    { t: '+49 171 5550142', c: 'phone' },
    { t: t('. Viele Grüße, ', '. Best regards, ') },
    { t: 'Anna Berger', c: 'name' },
  ],
]

export function PiiRedaction() {
  const [on, setOn] = useState<Set<Cat>>(new Set(['name', 'mail', 'health', 'iban', 'phone']))
  const [red, setRed] = useState(false)
  const toggle = (id: Cat) =>
    setOn((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const hits = TEXT.flat().filter((s) => s.c && on.has(s.c)).length

  return (
    <Surface tone="dark">
      <AppWindow tab="Entitäten" title={t('Personenbezogene Daten', 'Personal data')}>
        <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Erkennung und Schwärzung', 'Detection and redaction')}</h4>
          <span className="text-muted">{hits} {t('Fundstellen in diesem Dokument', 'matches in this document')}</span>
          <button
            type="button"
            onClick={() => setRed((v) => !v)}
            aria-pressed={red}
            className={`ml-auto rounded-full px-4 py-1.5 border-0 cursor-pointer font-semibold transition-colors ${red ? 'bg-ink text-white' : 'bg-primary text-white hover:bg-primary-hover'}`}
          >
            {red ? t('Schwärzung aufheben', 'Remove redaction') : t('Schwärzen', 'Redact')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              aria-pressed={on.has(c.id)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 cursor-pointer transition-colors ${on.has(c.id) ? 'bg-white border-ink text-ink' : 'bg-white border-line text-muted'}`}
            >
              <span className={`size-2.5 rounded-full ${on.has(c.id) ? c.dot : 'bg-[#d9d0dd]'}`} />
              {c.label}
            </button>
          ))}
        </div>
        <div className="border-t border-line bg-[#faf8fb] p-5 lg:p-6">
          <div className="rounded-lg bg-white ring-1 ring-black/5 shadow-sm p-5 lg:p-7 text-[0.9375rem] leading-[1.9] text-body">
            {TEXT.map((line, i) => (
              <p key={i} className="m-0 mb-2 last:mb-0">
                {line.map((s, j) => {
                  if (!s.c) return <span key={j}>{s.t}</span>
                  const cat = CATS.find((c) => c.id === s.c)!
                  const active = on.has(s.c)
                  return (
                    <mark
                      key={j}
                      className={`rounded px-0.5 transition-all duration-500 ${active ? (red ? 'bg-ink text-transparent select-none' : `${cat.hi} text-ink`) : 'bg-transparent text-body'}`}
                    >
                      {s.t}
                    </mark>
                  )
                })}
              </p>
            ))}
          </div>
          <p className="m-0 mt-3 text-[0.8125rem] text-muted">
            {t('Die Gesundheitsangabe zählt zu den besonderen Kategorien (Art. 9 DSGVO) und wird gesondert gekennzeichnet.', 'Health information is a special category of data (Art. 9 GDPR) and is flagged separately.')}
          </p>
        </div>
      </AppWindow>
    </Surface>
  )
}
