import type { ReactNode } from 'react'

// Animierte Strichsymbole (Keyframes in index.css, Klasse .ico), Akzente in der Markenfarbe
const S = { fill: 'none', stroke: '#1a1220', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const T = '#e3cfe9'
const P = '#601571'

export const ICONS: Record<string, ReactNode> = {
  // Kanzleien: Waage, Akten gegen ein markiertes Dokument
  kanzlei: (
    <>
      <path {...S} d="M80 26v76M56 102h48M68 102l12-14 12 14" />
      <g className="rock">
        <path {...S} d="M34 26h92" />
        <circle cx="80" cy="26" r="3.5" fill={P} />
        <g className="rock-rev rock-l">
          <path {...S} d="M34 26 20 62M34 26l14 36" />
          <path {...S} d="M16 62h36c0 10-8 16-18 16s-18-6-18-16z" fill={T} />
          <rect {...S} x="22" y="48" width="22" height="14" rx="1.5" fill="#fff" />
          <rect {...S} x="25" y="40" width="22" height="8" rx="1.5" fill="#fff" />
        </g>
        <g className="rock-rev rock-r">
          <path {...S} d="M126 26l-14 36M126 26l14 36" />
          <path {...S} d="M108 62h36c0 10-8 16-18 16s-18-6-18-16z" fill={T} />
          <rect {...S} x="118" y="40" width="16" height="22" rx="1.5" fill="#fff" />
          <path d="M122 47h8M122 52h8" stroke={P} strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </>
  ),
  // Rechtsabteilungen & Compliance: Dokument wird von der Lupe geprüft, Treffer leuchten
  analysis: (
    <>
      <rect {...S} x="34" y="12" width="76" height="98" rx="4" fill="#fff" />
      <path {...S} d="M46 30h36M46 46h52M46 62h44M46 78h52M46 94h30" />
      <path className="hit" d="M46 46h52" stroke={P} strokeWidth="4" strokeLinecap="round" />
      <path className="hit" style={{ animationDelay: '1.9s' }} d="M46 78h52" stroke={P} strokeWidth="4" strokeLinecap="round" />
      <g className="scan">
        <circle cx="104" cy="34" r="15" fill="rgba(227,207,233,.55)" stroke="#1a1220" strokeWidth="1.8" />
        <path {...S} strokeWidth={3} d="m115 45 14 14" />
      </g>
    </>
  ),
  // Datenschutz & IT-Security: Personenkarte, sensible Felder werden geschwärzt, Schloss
  processing: (
    <>
      <rect {...S} x="22" y="18" width="116" height="84" rx="6" fill="#fff" />
      <circle {...S} cx="50" cy="48" r="11" fill={T} />
      <path {...S} d="M34 82c2-12 30-12 32 0" />
      <path {...S} d="M80 36h42M80 54h42M80 72h30M80 88h42" />
      <rect className="redact" x="78" y="31" width="46" height="9" rx="2" fill="#1a1220" />
      <rect className="redact d2" x="78" y="49" width="46" height="9" rx="2" fill="#1a1220" />
      <rect className="redact d3" x="78" y="83" width="46" height="9" rx="2" fill={P} />
      <g className="pulse">
        <rect x="120" y="92" width="24" height="20" rx="4" fill={P} />
        <path d="M126 92v-5a6 6 0 0 1 12 0v5" fill="none" stroke="#1a1220" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="132" cy="102" r="2.5" fill="#fff" />
      </g>
    </>
  ),
  // Forensik & Beratung: Transaktionsnetz, Geldflüsse laufen, ein Knoten schlägt aus
  production: (
    <>
      <path {...S} d="M26 90 56 40 100 62 134 24M56 40 70 98M100 62 70 98M100 62 134 94" strokeDasharray="0" strokeOpacity=".35" />
      <path className="flow" d="M26 90 56 40 100 62 134 24" fill="none" stroke={P} strokeWidth="2.2" strokeLinecap="round" />
      <path className="flow" style={{ animationDuration: '2s' }} d="M70 98 100 62 134 94" fill="none" stroke="#1a1220" strokeWidth="1.6" strokeLinecap="round" />
      {[[26, 90], [56, 40], [70, 98], [134, 24], [134, 94]].map(([x, y]) => (
        <circle key={`${x}${y}`} {...S} cx={x} cy={y} r="8" fill="#fff" />
      ))}
      <circle className="pulse" cx="100" cy="62" r="11" fill={P} />
      <circle cx="100" cy="62" r="4" fill="#fff" />
    </>
  ),
  // eDiscovery-Dienstleister: Serverschrank, Daten gehen an drei Mandanten
  collection: (
    <>
      {[16, 48, 80].map((y, i) => (
        <g key={y}>
          <rect {...S} x="16" y={y} width="56" height="26" rx="4" fill={i === 1 ? T : '#fff'} />
          <path {...S} d={`M24 ${y + 13}h22`} />
          <circle className={`blink ${i === 1 ? 'd2' : i === 2 ? 'd3' : ''}`} cx="62" cy={y + 13} r="3" fill={P} />
          <rect className={`packet ${i === 1 ? 'd2' : i === 2 ? 'd3' : ''}`} x="80" y={y + 9} width="9" height="8" rx="1.5" fill={P} />
          <rect {...S} x="128" y={y + 3} width="18" height="20" rx="2.5" fill="#fff" />
          <path {...S} d={`M132 ${y + 10}h10M132 ${y + 16}h7`} />
        </g>
      ))}
    </>
  ),
  // Behörden & Ermittler: Dienstgebäude, Beweisdatei wird einsortiert und priorisiert
  hero: (
    <>
      <path {...S} d="M12 104h96M18 40l40-24 40 24zM24 40v0" fill={T} />
      <path {...S} d="M26 48v50M42 48v50M74 48v50M90 48v50M20 104V98h76v6" />
      <path {...S} d="M54 104V76a4 4 0 0 1 8 0v28" fill="#fff" />
      <circle cx="58" cy="30" r="3.5" fill={P} />
      <rect {...S} x="122" y="78" width="26" height="26" rx="3" fill="#fff" />
      <path {...S} d="M127 88h16M127 96h10" />
      <g className="carry">
        <rect {...S} x="112" y="86" width="18" height="22" rx="2" fill="#fff" />
        <path d="M116 94h10M116 99h7" stroke={P} strokeWidth="2" strokeLinecap="round" />
        <g className="flag">
          <path d="M112 86V70l12 5-12 5" fill={P} />
        </g>
      </g>
    </>
  ),
}

export function CaseIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 120" className={`ico ${className}`}>
      {ICONS[name]}
    </svg>
  )
}
