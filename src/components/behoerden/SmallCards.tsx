import { useEffect, useState } from 'react'
import { SubCard } from '../steps/shared'
import { useSeen } from '../legal/shared'
import { t as tx } from '../../lib/i18n'

// Zwei kleine Funktionen: Formatvielfalt und Beweissicherung per Hashwert. Fiktive Daten.

export function BehoerdenSmallCards() {
  return (
    <div className="grid md:grid-cols-2 border-t border-line">
      <SubCard title={tx('Jedes Format gelesen.', 'Every format, read.')} text={tx('Von E-Mail-Archiven bis zu Datenbanken und Fotos: über 1.400 Dateiformate werden erkannt und durchsuchbar gemacht.', 'From email archives to databases and photos: more than 1,400 file formats are recognized and made searchable.')}>
        <Formats />
      </SubCard>
      <SubCard className="md:border-l border-line" title={tx('Beweise unverändert.', 'Evidence, unaltered.')} text={tx('Jede Datei erhält beim Einlesen einen Hashwert. Spätere Prüfungen zeigen, dass nichts verändert wurde.', 'Every file receives a hash value on ingest. Later checks show that nothing was altered.')}>
        <Seals />
      </SubCard>
    </div>
  )
}

const ROW_A = ['.eml', '.pst', '.docx', '.xlsx', '.pdf', '.msg', '.zip', '.pptx', '.txt', '.rtf']
const ROW_B = ['.dwg', '.heic', '.sqlite', '.mp4', '.m4a', '.json', '.ics', '.vcf', '.psd', '.mbox']
const ROW_C = ['.odt', '.wav', '.7z', '.xml', '.eps', '.dmg', '.log', '.mdb', '.ost', '.tiff']

function Chip({ t }: { t: string }) {
  return <span className="flex-none rounded-lg border border-line bg-white px-3 py-1.5 font-medium tabular-nums text-ink shadow-sm">{t}</span>
}

function Formats() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setN(1400)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 2200)
      setN(Math.round(1400 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen])

  return (
    <div ref={ref} className="w-full max-w-[420px] text-[0.8125rem]">
      <div className="text-center">
        <div className="text-[2.25rem] leading-none font-semibold tabular-nums tracking-[-0.02em]">{n.toLocaleString(tx('de-DE', 'en-US'))}+</div>
        <div className="mt-1 text-muted">{tx('Dateiformate erkannt', 'file formats recognized')}</div>
      </div>
      <div className="mt-5 flex flex-col gap-2.5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        {[ROW_A, ROW_B, ROW_C].map((row, i) => (
          <div key={i} className={`flex gap-2.5 w-max ${i % 2 ? 'be-marquee-rev' : 'be-marquee'}`} style={{ animationDuration: `${26 + i * 5}s` }}>
            {[...row, ...row].map((t, j) => (
              <Chip key={j} t={t} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const FILES = [
  [tx('Chatverlauf_2023.json', 'Chat_history_2023.json'), '9f2c…a41e'],
  [tx('Kontoauszug_Q3.pdf', 'Bank_statement_Q3.pdf'), '3be7…c90d'],
  ['IMG_4412.heic', 'a1d8…57f2'],
  [tx('Preisliste_intern.xlsx', 'Price_list_internal.xlsx'), 'e40b…1c6a'],
]

function Seals() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [k, setK] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setK(FILES.length)
      return
    }
    const id = window.setInterval(() => setK((v) => (v >= FILES.length + 2 ? 0 : v + 1)), 1100)
    return () => window.clearInterval(id)
  }, [seen])
  const all = k >= FILES.length

  return (
    <div ref={ref} className="w-full max-w-[400px] rounded-xl bg-white ring-1 ring-black/5 shadow-[0_16px_40px_-22px_rgba(40,10,50,0.3)] overflow-hidden text-[0.8125rem]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <span className="font-semibold text-[0.875rem]">{tx('Integritätsprüfung', 'Integrity check')}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium transition-colors duration-500 ${all ? 'bg-[#e1f4ee] text-[#16795e]' : 'bg-[#f4f1f5] text-muted'}`}>
          {all ? tx('alles unverändert', 'all unaltered') : tx(`${k} von ${FILES.length} geprüft`, `${k} of ${FILES.length} checked`)}
        </span>
      </div>
      <ul className="list-none m-0 p-0">
        {FILES.map(([name, hash], i) => {
          const ok = i < k
          return (
            <li key={name} className="relative grid grid-cols-[1.75rem_minmax(0,1fr)_auto] gap-3 items-center px-4 py-3 border-b border-line last:border-b-0">
              <span className={`grid size-6 place-items-center rounded-full transition-all duration-500 ${ok ? 'bg-primary text-white scale-100' : 'bg-[#f1ecf3] text-muted scale-90'}`}>
                {ok ? (
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                ) : (
                  <span className="size-1.5 rounded-full bg-current" />
                )}
              </span>
              <div className="min-w-0">
                <div className="truncate font-medium">{name}</div>
                <div className="font-mono text-[0.75rem] text-muted">SHA-256 {hash}</div>
              </div>
              <span className={`text-[0.75rem] font-medium transition-opacity duration-500 ${ok ? 'opacity-100 text-[#16795e]' : 'opacity-0'}`}>{tx('unverändert', 'unaltered')}</span>
              {i === k && !all && <span aria-hidden="true" className="be-scan absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
