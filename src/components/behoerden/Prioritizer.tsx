import { useState } from 'react'
import { AppWindow, Surface } from '../legal/shared'
import { t } from '../../lib/i18n'

// Priorisierung: Gewichte bestimmen die Reihenfolge der Dateien, Zeilen gleiten live an ihre Position. Fiktive Dateien.

const FILES = [
  { name: t('Chatverlauf_Signal_2023.json', 'Chat_history_Signal_2023.json'), kw: 92, pers: 70, aff: 55 },
  { name: t('Kontoauszug_Q3_scan.pdf', 'Bank_statement_Q3_scan.pdf'), kw: 40, pers: 85, aff: 90 },
  { name: t('RE: Lieferung Samstag.eml', 'RE: Delivery Saturday.eml'), kw: 88, pers: 50, aff: 35 },
  { name: t('Fotoarchiv_IMG_4412.heic', 'Photo_archive_IMG_4412.heic'), kw: 15, pers: 90, aff: 45 },
  { name: t('Preisliste_intern.xlsx', 'Price_list_internal.xlsx'), kw: 60, pers: 20, aff: 82 },
  { name: t('Notizen_Treffen.docx', 'Meeting_notes.docx'), kw: 55, pers: 62, aff: 70 },
  { name: t('Sprachmemo_0914.m4a', 'Voice_memo_0914.m4a'), kw: 78, pers: 58, aff: 25 },
]
const SLIDERS: { id: 'kw' | 'pers' | 'aff'; label: string }[] = [
  { id: 'kw', label: t('Stichwort-Treffer', 'Keyword hits') },
  { id: 'pers', label: t('Personenbezug', 'Personal data') },
  { id: 'aff', label: t('Auffälligkeit', 'Anomaly') },
]
const ROW = 56

export function Prioritizer() {
  const [w, setW] = useState({ kw: 70, pers: 40, aff: 40 })
  const sum = w.kw + w.pers + w.aff || 1
  const scored = FILES.map((f) => ({ ...f, score: Math.round((f.kw * w.kw + f.pers * w.pers + f.aff * w.aff) / sum) }))
  const rank = [...scored].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).map((f) => f.name)

  return (
    <Surface tone="dark">
      <AppWindow tab="Smart Filter" title={t('Priorisierung', 'Prioritization')}>
        <div className="px-5 pt-5 pb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Priorisierung', 'Prioritization')}</h4>
          <span className="rounded-full bg-primary-tint text-primary px-2.5 py-0.5 text-[0.75rem]">{t('Live sortiert', 'Sorted live')}</span>
          <span className="text-muted">{t('Regler bewegen, Reihenfolge ändert sich sofort', 'Move the sliders and the order changes instantly')}</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-x-6 gap-y-3 px-5 pb-5">
          {SLIDERS.map((s) => (
            <label key={s.id} className="block">
              <span className="flex items-center justify-between mb-1.5">
                <span className="font-medium">{s.label}</span>
                <span className="tabular-nums text-muted">{w[s.id]}</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={w[s.id]}
                onChange={(e) => setW((v) => ({ ...v, [s.id]: Number(e.target.value) }))}
                aria-label={`${t('Gewicht', 'Weight')} ${s.label}`}
                className="w-full accent-[#601571] cursor-pointer"
              />
            </label>
          ))}
        </div>

        <div className="border-t border-line">
          <div className="hidden sm:grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1.1fr)_3rem] gap-3 px-5 py-2 text-[0.6875rem] uppercase tracking-[0.08em] text-muted border-b border-line bg-[#faf8fb]">
            <span>{t('Rang', 'Rank')}</span><span>{t('Datei', 'File')}</span><span>Score</span><span className="text-right">{t('Wert', 'Value')}</span>
          </div>
          <ul className="list-none m-0 p-0 relative" style={{ height: ROW * FILES.length }}>
            {scored.map((f) => {
              const r = rank.indexOf(f.name)
              const top = r < 3
              return (
                <li
                  key={f.name}
                  className={`absolute inset-x-0 grid grid-cols-[2.5rem_minmax(0,1fr)_3rem] sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1.1fr)_3rem] gap-3 items-center px-5 border-b border-line transition-[transform,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${top ? 'bg-primary-tint/60' : 'bg-white'}`}
                  style={{ height: ROW, transform: `translateY(${r * ROW}px)` }}
                >
                  <span className={`grid size-7 place-items-center rounded-full text-[0.75rem] font-semibold tabular-nums ${top ? 'bg-primary text-white' : 'bg-[#f1ecf3] text-muted'}`}>{r + 1}</span>
                  <span className="truncate font-medium">{f.name}</span>
                  <span className="hidden sm:block h-2 rounded-full bg-[#efe8f1] overflow-hidden">
                    <span className={`block h-full rounded-full transition-[width] duration-700 ${top ? 'bg-primary' : 'bg-[#cdb5d6]'}`} style={{ width: `${f.score}%` }} />
                  </span>
                  <span className="tabular-nums text-right font-semibold">{f.score}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </AppWindow>
    </Surface>
  )
}
