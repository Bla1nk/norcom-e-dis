import { useState } from 'react'
import { Surface } from '../legal/shared'
import { t } from '../../lib/i18n'

// Air-gapped: DaSense und die lokale KI laufen in einem abgeschotteten Netz ohne Verbindung nach außen.
// Der Schalter zeigt zum Vergleich, was eine Cloud-Anbindung bedeuten würde.

const FACTS = [
  [t('Keine Verbindung nach außen', 'No outbound connection'), t('Der Betrieb braucht kein Internet.', 'Operation needs no internet access.')],
  [t('KI läuft lokal', 'AI runs locally'), t('Modelle laufen auf Ihrer eigenen Hardware.', 'Models run on your own hardware.')],
  [t('Daten bleiben im Netz', 'Data stays in your network'), t('Nichts wird an Cloud-Dienste gesendet.', 'Nothing is sent to cloud services.')],
]

const NODES = [
  { id: 'q', x: 240, y: 90, label: t('Postfächer & Shares', 'Mailboxes & shares') },
  { id: 'd', x: 450, y: 90, label: 'DaSense' },
  { id: 'k', x: 450, y: 210, label: t('Lokale KI', 'Local AI') },
  { id: 'p', x: 240, y: 210, label: t('Prüfer-Arbeitsplätze', 'Reviewer workstations') },
]

export function AirGapped() {
  const [online, setOnline] = useState(false)

  return (
    <Surface tone="dark">
      <div className="rounded-xl bg-white ring-1 ring-black/5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] overflow-hidden text-[0.8125rem]">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-line">
          <h4 className="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{t('Betrieb im eigenen Netz', 'Operation in your own network')}</h4>
          <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium transition-colors duration-500 ${online ? 'bg-[#fbe0e6] text-[#b02347]' : 'bg-[#e1f4ee] text-[#16795e]'}`}>
            {online ? t('Cloud-Anbindung aktiv', 'Cloud connection active') : 'Air-gapped'}
          </span>
          <button
            type="button"
            onClick={() => setOnline((v) => !v)}
            aria-pressed={online}
            className="ml-auto flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 text-body"
          >
            {t('Zum Vergleich: Cloud-Anbindung', 'For comparison: cloud connection')}
            <span className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${online ? 'bg-[#d6385c]' : 'bg-[#d9d0dd]'}`}>
              <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all duration-300 ${online ? 'left-[18px]' : 'left-0.5'}`} />
            </span>
          </button>
        </div>

        <div className="px-3 sm:px-6 pt-4">
          <svg viewBox="0 0 640 330" className="w-full h-auto" role="img" aria-label={t('Schema: DaSense und lokale KI in einem abgeschotteten Netz, der Zugang nach außen ist gesperrt', 'Diagram: DaSense and local AI in an isolated network, outbound access blocked')}>
            {/* Netz */}
            <rect x="200" y="18" width="428" height="296" rx="20" fill="#f3eaf6" fillOpacity=".55" stroke="#601571" strokeWidth="2" strokeDasharray="8 7" />
            <g transform="translate(222 42)">
              <rect x="0" y="0" width="16" height="12" rx="2.5" fill="#601571" transform="translate(0 6)" />
              <path d="M3 6V4a5 5 0 0 1 10 0v2" fill="none" stroke="#601571" strokeWidth="2" strokeLinecap="round" />
              <text x="26" y="15" fontSize="12.5" fontWeight="600" fill="#601571">{t('Ihr Netz · abgeschottet', 'Your network · isolated')}</text>
            </g>

            {/* Verbindungen im Netz */}
            {[
              'M370 116H450',
              'M515 142V210',
              'M450 236H370',
            ].map((d) => (
              <path key={d} d={d} fill="none" stroke="#601571" strokeWidth="2" className="flow-12" strokeDasharray="6 6" />
            ))}
            <path d="M240 142V210" fill="none" stroke="#601571" strokeWidth="2" className="flow-12" strokeDasharray="6 6" />

            {/* Knoten */}
            {NODES.map((n) => (
              <g key={n.id}>
                <rect x={n.x - 8} y={n.y - 4} width="150" height="52" rx="10" fill="#fff" stroke="#1a1220" strokeWidth="1.6" />
                <text x={n.x + 67} y={n.y + 27} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#1a1220">{n.label}</text>
              </g>
            ))}

            {/* Internet */}
            <g transform="translate(24 36)" opacity={online ? 1 : 0.55} style={{ transition: 'opacity 500ms' }}>
              <path d="M40 78a26 26 0 0 1 4-51 34 34 0 0 1 64 8 22 22 0 0 1 2 43z" fill="#fff" stroke="#1a1220" strokeWidth="1.8" strokeLinejoin="round" />
              <text x="76" y="62" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1a1220">{t('Internet', 'Internet')}</text>
              <text x="76" y="104" textAnchor="middle" fontSize="11.5" fill="#5b5160">{t('Cloud-KI · Dienste', 'Cloud AI · services')}</text>
            </g>

            {/* Weg nach außen */}
            <path d="M232 116H134" fill="none" stroke={online ? '#d6385c' : '#9a8fa0'} strokeWidth="2" strokeDasharray={online ? '6 6' : '3 6'} className={online ? 'flow-12' : ''} style={{ transition: 'stroke 400ms' }} />
            {online ? (
              <circle r="5" fill="#d6385c">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M232 116H134" />
              </circle>
            ) : (
              <>
                <circle r="4.5" fill="#9a8fa0">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path="M134 116H196" />
                  <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.85;1" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <g transform="translate(200 116)">
                  <circle r="13" fill="#d6385c" />
                  <path d="m-5 -5 10 10m0 -10-10 10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
                </g>
              </>
            )}
          </svg>
          <div className={`mb-4 rounded-lg px-4 py-3 text-[0.875rem] leading-[1.5] transition-colors duration-500 ${online ? 'bg-[#fff6f8] text-[#8c1f3b]' : 'bg-[#f1faf6] text-[#126b52]'}`}>
            {online
              ? t('Mit Cloud-Anbindung könnten Inhalte an externe Dienste gehen. Genau das schließt der Betrieb im eigenen Netz aus.', 'With a cloud connection, content could reach external services. Running in your own network rules that out.')
              : t('Auch ohne jede Verbindung nach außen arbeiten Suche, Filter und KI-Auswertung wie gewohnt.', 'Search, filters, and AI analysis work as usual, even with no outbound connection at all.')}
          </div>
        </div>

        <ul className="list-none m-0 p-0 grid sm:grid-cols-3 border-t border-line">
          {FACTS.map(([h, d], i) => (
            <li key={h} className={`px-5 py-4 ${i > 0 ? 'sm:border-l border-t sm:border-t-0 border-line' : ''}`}>
              <div className="font-semibold text-[0.9375rem]">{h}</div>
              <div className="mt-0.5 text-muted">{d}</div>
            </li>
          ))}
        </ul>
      </div>
    </Surface>
  )
}
