import { useEffect, useState } from 'react'
import { Surface } from '../legal/shared'
import { t } from '../../lib/i18n'

// Datenquellen des Ingest-Cockpits: Microsoft 365, Slack, S3, Dateiserver, Entschlüsselung. In der Optik des Cockpits,
// „Verbindung testen“ und „Sammeln“ sind simuliert. Zahlen fiktiv.

type Src = { id: string; name: string; sub: string; fields: string[]; collects: string; icon: string }
const SRC: Src[] = [
  { id: 'm365', name: 'Microsoft 365', sub: t('Exchange, OneDrive, SharePoint, Teams über Microsoft Graph.', 'Exchange, OneDrive, SharePoint, Teams via Microsoft Graph.'), fields: [t('Tenant-ID oder Domain', 'Tenant ID or domain'), t('Anwendungs-ID', 'Application ID'), t('Clientschlüssel', 'Client secret')], collects: t('Mails als .eml, Dateien mit Originalpfad', 'Emails as .eml, files with original path'), icon: 'M4 4h8v8H4zM14 4h6v8h-6zM4 14h8v6H4zM14 14h6v6h-6z' },
  { id: 'slack', name: 'Slack', sub: t('Kanäle, Direktnachrichten, Threads und Dateien über eine Slack-App.', 'Channels, direct messages, threads, and files via a Slack app.'), fields: ['Token'], collects: t('Chats als Chatprotokoll, Dateien', 'Chats as chat transcripts, files'), icon: 'M5 9h14M5 15h14M9 4 8 20M16 4l-1 16' },
  { id: 's3', name: t('S3-Objektspeicher', 'S3 object storage'), sub: t('AWS S3 oder kompatibel (MinIO, Ceph, StorageGRID), samt S3-Metadaten.', 'AWS S3 or compatible (MinIO, Ceph, StorageGRID), including S3 metadata.'), fields: [t('Endpunkt', 'Endpoint'), 'Bucket', 'Access Key'], collects: t('Objekte mit Content-Type, ETag, Tags', 'Objects with content type, ETag, tags'), icon: 'M12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10' },
  { id: 'share', name: t('Dateiserver', 'File server'), sub: t('NFS und SMB werden eingehängt und erscheinen als Ordner, schreibgeschützt.', 'NFS and SMB shares are mounted and appear as read-only folders.'), fields: ['/mnt/FILESTORAGE/fileshare_recht', '/mnt/FILESTORAGE/fileshare_hr'], collects: t('Scanner liest direkt vom Server', 'Scanner reads directly from the server'), icon: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3zM3 14h18v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM7 8.5h.01M7 16.5h.01' },
  { id: 'crypto', name: t('Entschlüsselung', 'Decryption'), sub: t('Passwörter, mit denen verschlüsselte ZIP, PDF und Office-Dateien geöffnet werden.', 'Passwords used to open encrypted ZIP, PDF, and Office files.'), fields: [t('4 Schlüssel hinterlegt', '4 keys stored')], collects: t('Werden nie wieder angezeigt, nur die Anzahl', 'Never shown again, only the count'), icon: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z' },
]

function Card({ s }: { s: Src }) {
  const [phase, setPhase] = useState<'idle' | 'test' | 'ok' | 'collect' | 'done'>('idle')
  const [n, setN] = useState(0)
  useEffect(() => {
    if (phase === 'test') {
      const t = window.setTimeout(() => setPhase('ok'), 900)
      return () => window.clearTimeout(t)
    }
    if (phase === 'collect') {
      const id = window.setInterval(() => {
        setN((v) => {
          if (v >= 100) {
            window.clearInterval(id)
            setPhase('done')
            return 100
          }
          return v + 5
        })
      }, 120)
      return () => window.clearInterval(id)
    }
  }, [phase])
  const action = s.id === 'share' || s.id === 'crypto' ? null : true

  return (
    <div className="rounded-[14px] bg-[#141416] border border-[#26262b] p-4 text-[0.8125rem] text-[#f4f4f5] flex flex-col">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-[9px] bg-[#3b6cf6]/15 text-[#7d9bff]">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
        </span>
        <h4 className="m-0 text-[0.9375rem] font-semibold">{s.name}</h4>
        {phase === 'ok' || phase === 'collect' || phase === 'done' ? <span className="ml-auto rounded-full bg-[#4ade80]/12 px-2 py-0.5 text-[0.75rem] text-[#4ade80]">{t('verbunden', 'connected')}</span> : null}
      </div>
      <p className="m-0 mt-2 text-[#8b8b94] leading-[1.5]">{s.sub}</p>
      <div className="mt-3 flex flex-col gap-1.5">
        {s.fields.map((f) => (
          <div key={f} className="rounded-[9px] border border-[#26262b] bg-[#0a0a0b] px-3 py-1.5 text-[#5d5d66] truncate">{f}</div>
        ))}
      </div>
      <div className="mt-2 text-[0.75rem] text-[#8b8b94]">{s.collects}</div>
      <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
        {action ? (
          <>
            <button type="button" onClick={() => setPhase('test')} className="rounded-[9px] border border-[#26262b] bg-[#1b1b1f] px-3 py-1.5 text-[#f4f4f5] cursor-pointer hover:border-[#3b6cf6]">
              {phase === 'test' ? t('Teste …', 'Testing …') : t('Verbindung testen', 'Test connection')}
            </button>
            <button
              type="button"
              disabled={phase === 'idle' || phase === 'test' || phase === 'collect'}
              onClick={() => {
                setN(0)
                setPhase('collect')
              }}
              className="rounded-[9px] border-0 bg-[#3b6cf6] px-3 py-1.5 font-medium text-white cursor-pointer hover:bg-[#2f5ae0] disabled:opacity-40 disabled:cursor-default"
            >
              {t('Sammeln …', 'Collect …')}
            </button>
          </>
        ) : (
          <span className="text-[0.75rem] text-[#4ade80]">{t('✓ eingebunden', '✓ mounted')}</span>
        )}
        {(phase === 'collect' || phase === 'done') && (
          <span className="flex-1 min-w-[6rem] flex items-center gap-2">
            <span className="flex-1 h-1.5 rounded-full bg-[#1e1e22] overflow-hidden"><span className="block h-full rounded-full bg-[#3b6cf6]" style={{ width: `${n}%` }} /></span>
            <span className="tabular-nums text-[#8b8b94] w-9 text-right">{n} %</span>
          </span>
        )}
      </div>
      {phase === 'done' && <div className="mt-2 text-[0.75rem] text-[#4ade80]">{t('✓ Als neuer Ordner abgelegt, Sammelprotokoll mit SHA-256 je Element', '✓ Saved as a new folder, collection log with SHA-256 per item')}</div>}
    </div>
  )
}

export function SourcesGrid() {
  return (
    <Surface tone="dark">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SRC.map((s) => (
          <Card key={s.id} s={s} />
        ))}
        <div className="rounded-[14px] border border-dashed border-[#26262b] p-4 text-[0.8125rem] text-[#8b8b94] flex items-center justify-center text-center leading-[1.6]">
          {t('Alle Quellen landen als Ordner im Cockpit', 'All sources land as folders in the cockpit')}<br />{t('und lassen sich dort mit einem Klick ingestieren.', 'and can be ingested there with one click.')}
        </div>
      </div>
    </Surface>
  )
}
