import { useState } from 'react'
import { CUSTOMERS } from '../content/referenzen'
import { Reveal } from './TextReveal'

const BASE = '/images/kunden'
// Manche SVGs haben viel Leerraum in der Zeichenfläche und brauchen mehr Höhe.
const SIZE: Record<string, string> = { 'mercedes-benz': 'h-16 max-w-[12rem]', 'mercedes-amg': 'h-24 max-w-[14rem]' }

function Logo({ name, file }: { name: string; file: string }) {
  const [missing, setMissing] = useState(false)
  if (missing) {
    return <span className="whitespace-nowrap text-[1.375rem] font-semibold tracking-[-0.02em] text-[#a79eac] transition-colors hover:text-ink">{name}</span>
  }
  return (
    <img
      src={`${BASE}/${file}.svg`}
      alt={name}
      loading="lazy"
      draggable={false}
      onError={() => setMissing(true)}
      className={`${SIZE[file] ?? 'h-9 max-w-[9rem]'} w-auto object-contain transition duration-300`}
    />
  )
}

// Laufband „Auswahl unserer Kunden“: eigene Komponente, Logos als SVG aus public/images/kunden.
export function CustomerCarousel() {
  const row = [...CUSTOMERS, ...CUSTOMERS]
  return (
    <section aria-label="Auswahl unserer Kunden" className="bg-white border-t border-line py-12 lg:py-14">
      <div className="box-border max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal className="mb-8 text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-muted">Auswahl unserer Kunden</Reveal>
      </div>
      <div className="cust-mask relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none] motion-reduce:px-5">
        <ul className="cust-track list-none m-0 p-0">
          {row.map((c, i) => (
            <li key={`${c.file}-${i}`} aria-hidden={i >= CUSTOMERS.length || undefined} className="shrink-0 px-8 lg:px-12 flex items-center">
              <Logo name={c.name} file={c.file} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
