import { useRef, type ReactNode } from 'react'
import { useHeroReveal } from '../lib/useHeroReveal'
import { Eyebrow } from './Eyebrow'
import { RevealWords } from './RevealWords'


type Feature = { icon: ReactNode; label: string }

const iconProps = {
  'aria-hidden': true,
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#601571',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'flex-none',
} as const

const FEATURES: Feature[] = [
  {
    label: '1.400+ Dateiformate',
    icon: (
      <svg {...iconProps}>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
      </svg>
    ),
  },
  {
    label: 'Lokale KI',
    icon: (
      <svg {...iconProps}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <rect x="9.5" y="9.5" width="5" height="5" />
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
      </svg>
    ),
  },
  {
    label: 'On-Premise & Air-Gapped',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
]

// Maske für ein Element, das beim Einstieg von unten hereinfährt.
const MASK = 'overflow-hidden pb-[0.25em] -mb-[0.25em]'

export function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLUListElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  useHeroReveal(headingRef, [
    { ref: eyebrowRef, duration: 1000, delay: 100 },
    { ref: textRef, duration: 1200, delay: 450 },
    { ref: featuresRef, duration: 1200, delay: 550 },
    { ref: videoRef, duration: 1600, delay: 450, from: 30 },
  ])

  return (
    <section className="relative bg-white">
      <div className="box-border max-w-[1440px] mx-auto px-8 pt-[max(7rem,14svh)] flex flex-col items-center text-center gap-6">
        <div className={MASK}>
          <div ref={eyebrowRef}>
            <Eyebrow>DaSense eDiscovery</Eyebrow>
          </div>
        </div>
        <h1
          ref={headingRef}
          className="m-0 max-w-[22ch] text-primary text-[clamp(2.25rem,4vw,4.25rem)] leading-[1.05] tracking-[-0.03em] font-bold text-balance"
        >
          <RevealWords text="Agentic eDiscovery trifft maximale Datensouveränität." />
        </h1>
        <div className={MASK}>
          <p ref={textRef} className="m-0 max-w-[44rem] text-[1.25rem] leading-normal text-body">
            Finden Sie relevante Dokumente, verborgene Zusammenhänge und neue Ermittlungsansätze in
            Millionen Dateien. Mit lokaler KI, weniger manuellem Review und voller Kontrolle über
            Ihre Daten.
          </p>
        </div>
        <div className={MASK}>
          <ul
            ref={featuresRef}
            aria-label="Leistungsmerkmale"
            className="list-none m-0 p-0 flex flex-wrap justify-center gap-x-7 gap-y-3"
          >
            {FEATURES.map((f) => (
              <li key={f.label} className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
                {f.icon}
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ruhiges Arbeitsvideo: ganze Oberfläche sichtbar, ohne Kamera, nahtlose Schleife */}
      <div className="box-border max-w-[1240px] xl:max-w-[1380px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-8 pt-16 pb-24">
        <div ref={videoRef}>
          <video
            className="block w-full aspect-video rounded-xl ring-1 ring-black/10 shadow-[0_40px_100px_-40px_rgba(40,10,50,0.4)] bg-white"
            src="/videos/hero.mp4"
            poster="/videos/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-label="DaSense-Suche: Suche nach Raptor, Filter auf die Facette Vertraulich und den Ordner rac"
          />
        </div>
      </div>
    </section>
  )
}
