import { useEffect, useRef, useState } from 'react'
import { Surface, useSeen } from '../legal/shared'
import { t, EN } from '../../lib/i18n'

// Nachbau des Ingest-Cockpits (Web-Oberfläche für Ingest und Vektorisierung) in seiner echten dunklen Optik:
// Seitenleiste, Ordnerliste mit Status, Ablauf-Dialog mit Pflichtbegründung, Live-Pipeline, Fehler, Protokoll.
// Ordner, Zahlen und Nutzer sind fiktive Beispiele.

type Tab = 'overview' | 'live' | 'folders' | 'dlq' | 'log'
type St = 'vec' | 'part' | 'idx' | 'new' | 'run'
type Folder = { name: string; st: St; files: number; gb: number; idx: number; vec: number }

const FOLDERS0: Folder[] = [
  { name: t('mandat_nordwind_mail', 'matter_nordwind_mail'), st: 'vec', files: 48213, gb: 61, idx: 48213, vec: 48213 },
  { name: t('sharepoint_export_q3', 'sharepoint_export_q3'), st: 'idx', files: 12840, gb: 22, idx: 12840, vec: 0 },
  { name: t('chat_export_teams', 'chat_export_teams'), st: 'part', files: 9120, gb: 4, idx: 9120, vec: 5400 },
  { name: t('asservat_4_laptop', 'exhibit_4_laptop'), st: 'new', files: 212480, gb: 184, idx: 0, vec: 0 },
]
const ST_LABEL: Record<St, string> = { vec: t('Vektorisiert', 'Vectorized'), part: t('Teilweise', 'Partial'), idx: t('Nur indexiert', 'Indexed only'), new: t('Nicht ingestiert', 'Not ingested'), run: t('Läuft', 'Running') }
const ST_CLS: Record<St, string> = {
  vec: 'bg-[#4ade80]/12 text-[#4ade80]',
  part: 'bg-[#fbbf24]/12 text-[#fbbf24]',
  idx: 'bg-[#3b6cf6]/15 text-[#7d9bff]',
  new: 'bg-white/8 text-[#8b8b94]',
  run: 'bg-[#3b6cf6]/20 text-[#7d9bff]',
}
const FILTERS: { id: 'all' | St; label: string }[] = [
  { id: 'all', label: t('Alle', 'All') },
  { id: 'vec', label: t('Vektorisiert', 'Vectorized') },
  { id: 'idx', label: t('Nur indexiert', 'Indexed only') },
  { id: 'new', label: t('Noch nicht ingestiert', 'Not yet ingested') },
]
const STAGES = ['Scanner', 'NiFi', t('Anreicherung', 'Enrichment'), t('Vektorisierung', 'Vectorization')]
const FEED = t(['RE: Lieferplan Q3.eml', 'Vertrag_Rahmen_final.pdf', 'IMG_2231.heic', 'Telefonat_0412.m4a', 'Kalkulation.xlsx', 'Protokoll_Sitzung.docx', 'scan_0071.tif', 'Anhang_Bericht.pdf'], ['RE: Delivery schedule Q3.eml', 'Master_agreement_final.pdf', 'IMG_2231.heic', 'Phone_call_0412.m4a', 'Calculation.xlsx', 'Meeting_minutes.docx', 'scan_0071.tif', 'Attachment_report.pdf'])
const fmt = (n: number) => n.toLocaleString(EN ? 'en-US' : 'de-DE')

const NOW = t('Jetzt', 'Now')
const NAV: { id: Tab; label: string; d: string }[] = [
  { id: 'overview', label: t('Übersicht', 'Overview'), d: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z' },
  { id: 'live', label: 'Live', d: 'M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4' },
  { id: 'folders', label: t('Ordner', 'Folders'), d: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'dlq', label: t('Fehler', 'Errors'), d: 'M12 3 2 20h20zM12 10v4M12 17h.01' },
  { id: 'log', label: t('Protokoll', 'Log'), d: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7' },
]

export function IngestCockpit() {
  const [tab, setTab] = useState<Tab>('folders')
  const [folders, setFolders] = useState(FOLDERS0)
  const [filter, setFilter] = useState<'all' | St>('all')
  const [dialog, setDialog] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [ner, setNer] = useState(true)
  const [job, setJob] = useState<{ name: string; pct: number } | null>(null)
  const [feed, setFeed] = useState<string[]>([])
  const [log, setLog] = useState([
    { t: t('Heute 08:12', 'Today 08:12'), u: 'j.roth', a: t('Ingest mandat_nordwind_mail', 'Ingest matter_nordwind_mail'), r: t('Neues Mandat Nordwind, Postfächer der Geschäftsleitung', 'New Nordwind matter, executive management mailboxes') },
    { t: t('Gestern 16:40', 'Yesterday 16:40'), u: 'm.schulz', a: t('Metadaten setzen sharepoint_export_q3', 'Set metadata sharepoint_export_q3'), r: t('Zusatzfelder für Projektakte', 'Additional fields for the project file') },
  ])
  const [dlq, setDlq] = useState([
    { f: t('angebot_2019_geschuetzt.zip', 'offer_2019_protected.zip'), q: 'eagle.ingest.failed', t: t('vor 12 Min.', '12 min ago') },
    { f: 'backup_mail_0044.pst', q: 'eagle.ingest.failed', t: t('vor 31 Min.', '31 min ago') },
    { f: t('scan_defekt_0071.tif', 'scan_corrupt_0071.tif'), q: 'eagle.ingest.failed', t: t('vor 2 Std.', '2 hrs ago') },
  ])
  const { ref } = useSeen<HTMLDivElement>()
  const target = useRef<string>('')

  // Simulierter Ablauf: Fortschritt läuft, Aktivität füllt sich, am Ende ist der Ordner vektorisiert.
  useEffect(() => {
    if (!job) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = window.setInterval(() => {
      setJob((j) => (j ? { ...j, pct: Math.min(100, j.pct + (reduce ? 100 : 2.5)) } : j))
      setFeed((f) => [FEED[Math.floor(Math.random() * FEED.length)], ...f].slice(0, 6))
    }, 450)
    return () => window.clearInterval(id)
  }, [job?.name])

  useEffect(() => {
    if (job && job.pct >= 100) {
      const n = job.name
      setFolders((fs) => fs.map((f) => (f.name === n ? { ...f, st: 'vec', idx: f.files, vec: f.files } : f)))
      setJob(null)
    }
  }, [job])

  const start = () => {
    const name = dialog!
    target.current = name
    setFolders((fs) => fs.map((f) => (f.name === name ? { ...f, st: 'run' } : f)))
    setLog((l) => [{ t: NOW, u: t('Sie', 'You'), a: `Ingest ${name}`, r: reason.trim() }, ...l])
    setJob({ name, pct: 0 })
    setFeed([])
    setDialog(null)
    setReason('')
  }

  const shown = folders.filter((f) => filter === 'all' || f.st === filter)
  const stage = job ? (job.pct < 40 ? 0 : job.pct < 60 ? 2 : 3) : -1
  const totalIdx = folders.reduce((s, f) => s + f.idx, 0)
  const totalVec = folders.reduce((s, f) => s + f.vec, 0)

  return (
    <Surface>
      <div ref={ref}>
        <div className="relative rounded-xl overflow-hidden ring-1 ring-black/20 shadow-[0_30px_80px_-30px_rgba(10,10,20,0.7)] bg-[#0a0a0b] text-[#f4f4f5] text-[0.8125rem] grid md:grid-cols-[11.5rem_minmax(0,1fr)] min-h-[40rem]">
          {/* Seitenleiste */}
          <aside className="bg-[#0f0f11] md:border-r border-b md:border-b-0 border-[#26262b] p-3 md:p-4 flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
            <div className="hidden md:block">
              <span className="inline-flex border-[1.5px] border-[#e4e4e7] rounded-[6px] overflow-hidden text-[1.0625rem] font-extrabold leading-none">
                <span className="px-[3px] pl-1.5 py-1">Nor</span>
                <b className="px-1.5 pl-1 py-1 bg-[#6d28d9] text-white font-extrabold">Com</b>
              </span>
              <div className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#8b8b94]">{t('Ingest-Cockpit', 'Ingest Cockpit')}</div>
              <div className="mt-0.5 mb-4 text-[0.75rem] text-[#5d5d66]">{t('dasense.beispiel.de', 'dasense.example.com')}</div>
            </div>
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setTab(n.id)}
                aria-current={tab === n.id}
                className={`flex items-center gap-2.5 whitespace-nowrap text-left border-0 rounded-[9px] px-2.5 py-2 cursor-pointer transition-colors ${tab === n.id ? 'bg-[#3b6cf6] text-white' : 'bg-transparent text-[#a1a1aa] hover:bg-white/5'}`}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="flex-none"><path d={n.d} /></svg>
                {n.label}
                {n.id === 'dlq' && <span className={`ml-auto rounded-full px-1.5 text-[0.6875rem] ${tab === 'dlq' ? 'bg-white/20' : 'bg-white/8 text-[#8b8b94]'}`}>{dlq.length}</span>}
                {n.id === 'live' && job && <span className="ml-auto size-1.5 rounded-full bg-[#4ade80] blink-dot" />}
              </button>
            ))}
          </aside>

          {/* Inhalt */}
          <div className="min-w-0 p-4 md:p-6">
            {tab === 'overview' && (
              <>
                <h4 className="m-0 text-[1.125rem] font-semibold">{t('Übersicht', 'Overview')}</h4>
                <p className="m-0 mt-0.5 text-[#8b8b94]">{t('Ingest, Index und Vektorisierung auf einen Blick', 'Ingest, index, and vectorization at a glance')}</p>
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    [t('Suchindex', 'Search index'), fmt(totalIdx), t('Dokumente', 'Documents')],
                    [t('Vektorindex', 'Vector index'), fmt(totalVec), t('Chunks (Beispiel)', 'Chunks (sample)')],
                    ['NiFi', job ? fmt(Math.round(job.pct * 38)) : '0', t('wartende FlowFiles', 'queued FlowFiles')],
                    [t('Abläufe', 'Jobs'), job ? t('1 aktiv', '1 active') : t('Leerlauf', 'Idle'), job ? job.name : t('bereit', 'ready')],
                  ].map(([l, v, s]) => (
                    <div key={l} className="rounded-[14px] bg-[#141416] border border-[#26262b] p-3.5 min-w-0">
                      <div className="text-[#8b8b94]">{l}</div>
                      <div className="mt-1 text-[1.5rem] leading-tight font-semibold tabular-nums">{v}</div>
                      <div className="text-[0.75rem] text-[#8b8b94] truncate">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid lg:grid-cols-2 gap-3">
                  <div className="rounded-[14px] bg-[#141416] border border-[#26262b] p-4">
                    <div className="font-semibold mb-2">{t('Dienste', 'Services')}</div>
                    {[t('Suchindex', 'Search index'), 'NiFi', 'RabbitMQ', t('Vektorisierung', 'Vectorization'), t('lokale KI', 'local AI')].map((s) => (
                      <div key={s} className="flex items-center gap-2 py-1.5 border-t border-[#1e1e22] first:border-t-0">
                        <span className="size-2 rounded-full bg-[#4ade80]" />
                        <span className="flex-1">{s}</span>
                        <span className="text-[#4ade80] text-[0.75rem]">online</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[14px] bg-[#141416] border border-[#26262b] p-4">
                    <div className="font-semibold mb-2">{t('Größte Ordner im Index', 'Largest folders in the index')}</div>
                    {[...folders].sort((a, b) => b.idx - a.idx).slice(0, 4).map((f) => (
                      <div key={f.name} className="py-1.5">
                        <div className="flex justify-between"><span className="truncate">{f.name}</span><span className="tabular-nums text-[#8b8b94]">{fmt(f.idx)}</span></div>
                        <div className="mt-1 h-1.5 rounded-full bg-[#1e1e22] overflow-hidden"><div className="h-full rounded-full bg-[#3b6cf6] transition-[width] duration-700" style={{ width: `${(f.idx / 48213) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === 'folders' && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="m-0 text-[1.125rem] font-semibold">{t('Ordner', 'Folders')}</h4>
                  <span className="text-[#8b8b94]">{t('in', 'in')} /mnt/FILESTORAGE</span>
                  <span className="ml-auto rounded-[9px] bg-[#3b6cf6] px-3 py-1.5 text-white font-medium">{t('Daten hochladen …', 'Upload data …')}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={`rounded-[9px] border px-3 py-1 cursor-pointer transition-colors ${filter === f.id ? 'bg-white/10 border-[#3b6cf6] text-white' : 'bg-[#141416] border-[#26262b] text-[#a1a1aa] hover:text-white'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 overflow-x-auto no-scrollbar rounded-[14px] border border-[#26262b]">
                  <table className="w-full border-collapse min-w-[40rem]">
                    <thead>
                      <tr className="text-left text-[0.6875rem] uppercase tracking-[0.08em] text-[#8b8b94] bg-[#141416]">
                        <th className="px-3.5 py-2.5 font-medium">{t('Ordner', 'Folder')}</th><th className="px-2 font-medium">Status</th>
                        <th className="px-2 font-medium text-right">{t('Dateien', 'Files')}</th><th className="px-2 font-medium text-right">{t('Größe', 'Size')}</th>
                        <th className="px-2 font-medium text-right">{t('Im Index', 'In index')}</th><th className="px-2 font-medium text-right">{t('Vektorisiert', 'Vectorized')}</th><th />
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((f) => {
                        const running = job?.name === f.name
                        return (
                          <tr key={f.name} className="border-t border-[#1e1e22]">
                            <td className="px-3.5 py-3 font-medium">{f.name}</td>
                            <td className="px-2"><span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${ST_CLS[f.st]}`}>{running ? `${t('Läuft', 'Running')} ${Math.round(job.pct)} %` : ST_LABEL[f.st]}</span></td>
                            <td className="px-2 text-right tabular-nums">{fmt(f.files)}</td>
                            <td className="px-2 text-right tabular-nums text-[#a1a1aa]">{f.gb} GB</td>
                            <td className="px-2 text-right tabular-nums">{fmt(f.idx)}</td>
                            <td className="px-2 text-right tabular-nums text-[#a1a1aa]">{fmt(f.vec)}</td>
                            <td className="px-3 text-right">
                              <button
                                type="button"
                                disabled={!!job || f.st === 'run'}
                                onClick={() => setDialog(f.name)}
                                className="rounded-[9px] border border-[#26262b] bg-[#1b1b1f] px-3 py-1 text-[#f4f4f5] cursor-pointer hover:border-[#3b6cf6] disabled:opacity-40 disabled:cursor-default"
                              >
                                Ingest …
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="m-0 mt-3 text-[0.75rem] text-[#8b8b94]">{t('Ein Ingest läuft in zwei Stufen: Erst liest der Scanner den Ordner, dann verarbeitet NiFi die Dateien. Klicken Sie bei „asservat_4_laptop“ auf', 'An ingest runs in two stages: first the scanner reads the folder, then NiFi processes the files. Click')} <b className="text-[#f4f4f5]">Ingest …</b>{t('.', ' next to “exhibit_4_laptop”.')}</p>
              </>
            )}

            {tab === 'live' && (
              <>
                <h4 className="m-0 text-[1.125rem] font-semibold">{t('Live', 'Live')}</h4>
                <p className="m-0 mt-0.5 text-[#8b8b94]">{job ? `${t('Ingest läuft', 'Ingest running')}: ${job.name}` : t('Gerade läuft kein Ingest', 'No ingest is running right now')}</p>
                <div className="mt-4 rounded-[14px] bg-[#141416] border border-[#26262b] p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {STAGES.map((s, i) => {
                      const on = stage === i || (job && i < stage)
                      return (
                        <div key={s} className={`relative rounded-[10px] border px-2 py-3 text-center transition-colors duration-500 ${stage === i ? 'border-[#3b6cf6] bg-[#3b6cf6]/10' : on ? 'border-[#4ade80]/40 bg-[#4ade80]/5' : 'border-[#26262b]'}`}>
                          <div className="font-medium">{s}</div>
                          <div className="mt-0.5 text-[0.75rem] text-[#8b8b94] tabular-nums">{job ? (stage === i ? `${Math.round(40 + (job.pct % 20) * 3)} / s` : on ? t('fertig', 'done') : t('wartet', 'waiting')) : '–'}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-[#1e1e22] overflow-hidden"><div className="h-full rounded-full bg-[#3b6cf6] transition-[width] duration-500" style={{ width: `${job ? job.pct : 0}%` }} /></div>
                </div>
                <div className="mt-3 rounded-[14px] bg-[#141416] border border-[#26262b] p-4 min-h-[11rem]">
                  <div className="font-semibold flex items-center gap-2">{t('Aktivität', 'Activity')} {job && <span className="size-1.5 rounded-full bg-[#4ade80] blink-dot" />}</div>
                  {feed.length === 0 ? (
                    <p className="m-0 mt-3 text-[#8b8b94]">{job ? t('Warte auf neue Dokumente …', 'Waiting for new documents …') : t('Starten Sie im Reiter „Ordner“ einen Ingest, dann erscheinen hier die neuen Dokumente.', 'Start an ingest in the “Folders” tab and the new documents will appear here.')}</p>
                  ) : (
                    <ul className="list-none m-0 mt-2 p-0">
                      {feed.map((f, i) => (
                        <li key={f + i} className="log-in flex items-center gap-2 py-1.5 border-t border-[#1e1e22] first:border-t-0">
                          <span className="size-1.5 rounded-full bg-[#4ade80]" />
                          <span className="truncate">{f}</span>
                          <span className="ml-auto text-[0.75rem] text-[#8b8b94]">{t('indexiert', 'indexed')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            {tab === 'dlq' && (
              <>
                <h4 className="m-0 text-[1.125rem] font-semibold">{t('Fehler', 'Errors')}</h4>
                <p className="m-0 mt-0.5 text-[#8b8b94]">{t('Dateien, die der Ingest nicht verarbeiten konnte', 'Files the ingest could not process')}</p>
                <ul className="list-none m-0 mt-4 p-0 rounded-[14px] border border-[#26262b] overflow-hidden">
                  {dlq.length === 0 && <li className="px-4 py-8 text-center text-[#4ade80]">{t('✓ Keine Fehler in der Warteschlange', '✓ No errors in the queue')}</li>}
                  {dlq.map((d) => (
                    <li key={d.f} className="flex items-center gap-3 px-4 py-3 border-t border-[#1e1e22] first:border-t-0 bg-[#141416]">
                      <span className="size-2 rounded-full bg-[#f87171] flex-none" />
                      <span className="min-w-0 flex-1 truncate font-medium">{d.f}</span>
                      <span className="hidden sm:block text-[#8b8b94]">{d.q}</span>
                      <span className="text-[0.75rem] text-[#8b8b94] whitespace-nowrap">{d.t}</span>
                      <button type="button" onClick={() => setDlq((l) => l.filter((x) => x.f !== d.f))} className="rounded-[9px] border border-[#26262b] bg-[#1b1b1f] px-3 py-1 text-[#f4f4f5] cursor-pointer hover:border-[#3b6cf6]">{t('Erneut senden', 'Resend')}</button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {tab === 'log' && (
              <>
                <h4 className="m-0 text-[1.125rem] font-semibold">{t('Protokoll', 'Log')}</h4>
                <p className="m-0 mt-0.5 text-[#8b8b94]">{t('Wer hat wann was gestartet, und warum', 'Who started what, when, and why')}</p>
                <ul className="list-none m-0 mt-4 p-0 flex flex-col gap-2">
                  {log.map((l, i) => (
                    <li key={i} className={`rounded-[14px] bg-[#141416] border p-3.5 ${i === 0 && l.t === NOW ? 'border-[#3b6cf6]' : 'border-[#26262b]'} ${l.t === NOW ? 'log-in' : ''}`}>
                      <div className="flex flex-wrap items-center gap-x-3 text-[#8b8b94]"><span className="tabular-nums">{l.t}</span><span>{l.u}</span></div>
                      <div className="mt-1 font-medium">{l.a}</div>
                      <div className="mt-0.5 text-[#a1a1aa]">„{l.r}“</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Ablauf-Dialog */}
          {dialog && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-black/60 p-3 md:p-6 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label={t('Ablauf starten', 'Start job')}>
              <div className="w-full max-w-[34rem] rounded-[16px] bg-[#141416] border border-[#26262b] p-5 shadow-2xl max-h-full overflow-auto">
                <h4 className="m-0 text-[1.0625rem] font-semibold">Ingest: {dialog}</h4>
                <p className="m-0 mt-1 text-[#8b8b94]">{t('Voreinstellung für neue Ordner: Ingestieren und Vektorisieren.', 'Default for new folders: ingest and vectorize.')}</p>
                <div className="mt-4 flex items-center gap-2 text-[0.75rem]">
                  {[t('Ingestieren', 'Ingest'), t('Anreichern', 'Enrich'), t('Vektorisieren', 'Vectorize')].map((s, i) => (
                    <span key={s} className="flex items-center gap-2">
                      {i > 0 && <span className="text-[#5d5d66]">→</span>}
                      <span className="rounded-full bg-[#3b6cf6]/15 text-[#7d9bff] px-2.5 py-1 font-medium">{s}</span>
                    </span>
                  ))}
                </div>
                <p className="m-0 mt-2 text-[0.75rem] text-[#8b8b94]">{t('Anreichern: OCR, Transkription, Mail-Datum, Sprache, Kennungen.', 'Enrich: OCR, transcription, email date, language, identifiers.')}</p>
                <label className="mt-3 flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={ner} onChange={(e) => setNer(e.target.checked)} className="mt-0.5 accent-[#3b6cf6]" />
                  <span>{t('Entitäten erkennen (NER)', 'Detect entities (NER)')}<span className="block text-[0.75rem] text-[#8b8b94]">{t('Personen, Organisationen, Orte und Projekte, Deutsch und Englisch.', 'People, organizations, places, and projects, in German and English.')}</span></span>
                </label>
                <label className="mt-4 block">
                  <span className="font-medium">{t('Begründung', 'Reason')} <b className="text-[#f87171]">*</b></span>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder={t('Warum wird der Ordner aufbereitet?', 'Why is this folder being processed?')}
                    className="mt-1.5 w-full resize-none rounded-[10px] border border-[#26262b] bg-[#0a0a0b] px-3 py-2 text-[#f4f4f5] outline-none focus:border-[#3b6cf6]"
                  />
                  <span className="flex flex-wrap items-center gap-x-2 text-[0.75rem] text-[#8b8b94]">
                    {t('Pflicht, wird mit Nutzer und Zeit im Protokoll gespeichert.', 'Required; saved to the log with user and time.')}
                    <button type="button" onClick={() => setReason(t('Neuer Datenträger Asservat 4 aus Durchsuchung', 'New data carrier, exhibit 4 from search'))} className="bg-transparent border-0 p-0 text-[#7d9bff] cursor-pointer hover:underline">{t('Beispiel einfügen', 'Insert example')}</button>
                  </span>
                </label>
                <div className="mt-5 flex justify-end gap-2">
                  <button type="button" onClick={() => { setDialog(null); setReason('') }} className="rounded-[9px] border border-[#26262b] bg-[#1b1b1f] px-4 py-2 text-[#f4f4f5] cursor-pointer">{t('Abbrechen', 'Cancel')}</button>
                  <button type="button" disabled={reason.trim().length < 4} onClick={start} className="rounded-[9px] border-0 bg-[#3b6cf6] px-4 py-2 font-semibold text-white cursor-pointer hover:bg-[#2f5ae0] disabled:opacity-40 disabled:cursor-default">{t('Starten', 'Start')}</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <p className="m-0 mt-3 text-[0.75rem] text-muted">{t('Das echte Ingest-Cockpit, nachgestellt mit Beispieldaten.', 'The real Ingest Cockpit, recreated with sample data.')}</p>
      </div>
    </Surface>
  )
}
