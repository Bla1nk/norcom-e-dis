import type { ReactNode } from 'react'
import { Eyebrow, sectionHeadingClass } from './Eyebrow'

const lilacIcon = {
  'aria-hidden': true,
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#E2C3EE',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'flex-none',
} as const

const primaryIcon = { ...lilacIcon, width: 22, height: 22, stroke: '#601571' } as const

type Item = { label: string; icon: ReactNode }

const COMPONENTS: Item[] = [
  {
    label: 'Dokumente & Metadaten',
    icon: (
      <svg {...lilacIcon}>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
      </svg>
    ),
  },
  {
    label: 'Suchindex & Vektoren',
    icon: (
      <svg {...lilacIcon}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    label: 'KI-Modelle & Verarbeitung',
    icon: (
      <svg {...lilacIcon}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <rect x="9.5" y="9.5" width="5" height="5" />
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
      </svg>
    ),
  },
  {
    label: 'Prüfprotokolle & Zugriffsrechte',
    icon: (
      <svg {...lilacIcon}>
        <path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
]

type Model = Item & { text: string }

const MODELS: Model[] = [
  {
    label: 'Deutsche Cloud',
    text: 'Betrieb auf NorCom-Infrastruktur in Deutschland.',
    icon: (
      <svg {...primaryIcon}>
        <path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z" />
      </svg>
    ),
  },
  {
    label: 'On-Premise',
    text: 'Betrieb in der eigenen Infrastruktur.',
    icon: (
      <svg {...primaryIcon}>
        <rect x="3" y="4" width="18" height="7" rx="2" />
        <rect x="3" y="13" width="18" height="7" rx="2" />
        <path d="M7 7.5h.01M7 16.5h.01" />
      </svg>
    ),
  },
  {
    label: 'Air-Gapped',
    text: 'Vollständig isolierter Betrieb ohne externe Verbindung.',
    icon: (
      <svg {...primaryIcon}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        <path d="M2 2l20 20" />
      </svg>
    ),
  },
]

export function Architektur() {
  return (
    <section id="architektur" className="bg-white border-y border-line">
      <div className="max-w-[1200px] mx-auto py-24 px-8 flex flex-col gap-10">
        <div className="flex flex-col gap-4 max-w-[48rem]">
          <Eyebrow colorClass="text-primary">Architektur</Eyebrow>
          <h2 className={sectionHeadingClass}>Ihre Daten. Ihre Infrastruktur. Ihre KI.</h2>
          <p className="m-0 text-[1.125rem] text-body">
            Nicht nur Ihre Dokumente bleiben geschützt. Auch Suchindizes, KI-Modelle, Verarbeitung
            und Prüfprotokolle laufen innerhalb Ihrer kontrollierten Umgebung.
          </p>
        </div>
        <figure
          aria-label="Alle Komponenten von DaSense laufen gemeinsam in einer kontrollierten Umgebung"
          className="m-0 bg-night rounded-2xl p-3 shadow-panel"
        >
          <div className="border-[1.5px] border-dashed border-plum-dash rounded-xl pt-5 px-6 pb-6 flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.08em] text-lilac">
              <svg {...lilacIcon} width={16} height={16}>
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              KONTROLLIERTE UMGEBUNG
            </span>
            <ul className="list-none m-0 p-0 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
              {COMPONENTS.map((c) => (
                <li
                  key={c.label}
                  className="flex items-center gap-3 bg-plum-tile border border-plum-chip rounded-[10px] py-3.5 px-4 min-w-0"
                >
                  <span className="flex-none w-9 h-9 rounded-lg bg-plum-icon flex items-center justify-center">
                    {c.icon}
                  </span>
                  <span className="text-[0.9375rem] font-semibold leading-[1.3] text-white">
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </figure>
        <div className="flex flex-col gap-4">
          <Eyebrow colorClass="text-muted">Drei Betriebsmodelle zur Wahl</Eyebrow>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {MODELS.map((m) => (
              <div
                key={m.label}
                className="bg-white border border-card-line border-t-[3px] border-t-primary rounded-xl p-6 flex flex-col gap-3 min-w-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex-none w-10 h-10 rounded-[10px] bg-primary-tint flex items-center justify-center">
                    {m.icon}
                  </span>
                  <h3 className="m-0 text-primary text-[1.25rem] font-semibold leading-[1.25]">
                    {m.label}
                  </h3>
                </div>
                <p className="m-0 text-body text-[1rem] leading-normal">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
