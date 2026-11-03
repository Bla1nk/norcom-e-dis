import { useState } from 'react'
import { AppWindow, Surface } from '../legal/shared'
import { t, EN } from '../../lib/i18n'

// Beispielrechnung: Aus dem Datenvolumen werden Dokumente und Prüfstunden hochgerechnet, mit und ohne KI-Priorisierung.
// Alle Annahmen sind sichtbar und frei gewählt, es handelt sich nicht um Zusagen.

const DOCS_PER_GB = 4000 // Annahme
const RATE = 50 // Dok. pro Prüfer-Stunde, Annahme

export function CostEstimator() {
  const [tb, setTb] = useState(1.5)
  const [rel, setRel] = useState(8) // Anteil relevanter Dokumente in %

  const docs = Math.round(tb * 1000 * DOCS_PER_GB)
  const hoursAll = docs / RATE
  // Mit Priorisierung wird zuerst der relevante Teil geprüft, dazu ein Puffer für Stichproben des Rests (Annahme: 20 % des Rests)
  const hoursAi = (docs * (rel / 100) + docs * (1 - rel / 100) * 0.2 * 0.1) / RATE + docs * 0.002 / RATE
  const saved = Math.max(0, 1 - hoursAi / hoursAll)
  const fmt = (n: number) => Math.round(n).toLocaleString(EN ? 'en-US' : 'de-DE')

  return (
    <Surface tone="grid">
      <AppWindow tab={t('Kalkulator', 'Calculator')} title={t('Beispielrechnung', 'Sample calculation')}>
        <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Beispielrechnung', 'Sample calculation')}</h4>
          <span className="rounded-full bg-[#fcefcf] text-[#8a5e07] px-2.5 py-0.5 text-[0.75rem]">{t('illustrativ', 'illustrative')}</span>
          <span className="text-muted">{t('Keine Zusage, die Werte hängen vom Bestand ab.', 'Not a commitment; actual values depend on your data.')}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 px-5 pb-5">
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="dl-vol" className="font-medium">{t('Datenvolumen', 'Data volume')}</label>
              <span className="tabular-nums font-semibold">{tb >= 1 ? `${tb.toLocaleString(EN ? 'en-US' : 'de-DE')} TB` : `${Math.round(tb * 1000)} GB`}</span>
            </div>
            <input id="dl-vol" type="range" min={0.1} max={10} step={0.1} value={tb} onChange={(e) => setTb(Number(e.target.value))} className="w-full accent-[#601571] cursor-pointer" />
            <div className="flex justify-between text-[0.6875rem] text-muted"><span>100 GB</span><span>10 TB</span></div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="dl-rel" className="font-medium">{t('Anteil relevanter Dokumente', 'Share of relevant documents')}</label>
              <span className="tabular-nums font-semibold">{rel} %</span>
            </div>
            <input id="dl-rel" type="range" min={1} max={40} step={1} value={rel} onChange={(e) => setRel(Number(e.target.value))} className="w-full accent-[#601571] cursor-pointer" />
            <div className="flex justify-between text-[0.6875rem] text-muted"><span>1 %</span><span>40 %</span></div>
          </div>
        </div>

        <div className="border-t border-line px-5 py-5">
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <span className="font-semibold">{t('Prüfaufwand bei', 'Review effort for')} {fmt(docs)} {t('Dokumenten', 'documents')}</span>
            <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem] font-medium tabular-nums">{t('rund', 'about')} {Math.round(saved * 100)} % {t('weniger', 'less')}</span>
          </div>
          {[
            { label: t('Alles manuell prüfen', 'Review everything manually'), h: hoursAll, cls: 'bg-[#cdbbd3]' },
            { label: t('Mit KI-Priorisierung', 'With AI prioritization'), h: hoursAi, cls: 'bg-primary' },
          ].map((b) => (
            <div key={b.label} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-body">{b.label}</span>
                <span className="tabular-nums font-medium">{fmt(b.h)} {t('Std.', 'hrs')}</span>
              </div>
              <div className="h-3.5 rounded-full bg-[#efe8f1] overflow-hidden">
                <div className={`h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${b.cls}`} style={{ width: `${Math.max(1.5, (b.h / hoursAll) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line bg-[#faf8fb] px-5 py-3.5 text-[0.75rem] leading-[1.6] text-muted">
          <span className="font-semibold text-body">{t('Annahmen:', 'Assumptions:')}</span> {DOCS_PER_GB.toLocaleString(EN ? 'en-US' : 'de-DE')} {t('Dokumente pro GB,', 'documents per GB,')} {RATE} {t('Dokumente pro Prüfer-Stunde. Bei Priorisierung wird zuerst der relevante Anteil geprüft, vom Rest nur eine Stichprobe. Ihre Werte weichen ab.', 'documents per reviewer hour. With prioritization, the relevant share is reviewed first and only a sample of the rest. Your numbers will differ.')}
        </div>
      </AppWindow>
    </Surface>
  )
}
