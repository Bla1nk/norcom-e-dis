import { useState } from 'react'
import { CASES } from '../content/cases'
import { linkProps } from '../lib/router'
import { CaseIcon } from './CaseIcons'
import { TextReveal } from './TextReveal'

const SHORT: Record<string, string> = {
  kanzleien: 'Kanzleien',
  compliance: 'Compliance',
  datenschutz: 'Datenschutz',
  forensik: 'Forensik',
  dienstleister: 'Dienstleister',
  behoerden: 'Behörden',
}

const WRAP = 'box-border w-full max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-8 lg:px-12'

// Fuß im Aufbau wie bei apexcollection.de: links eine fette Aussage mit Button, in der Mitte die Zielgruppen als große
// Wörter (grau, beim Überfahren weiß), rechts eine Kachel mit dem Bild der überfahrenen Zielgruppe, darunter eine
// schmale Leiste. Die Elemente laufen ein, sobald ein übergeordnetes Element die Klasse tr-on trägt.
export function FooterBody() {
  const [hot, setHot] = useState(0)
  const item = CASES[hot]

  return (
    <>
      <div className={`${WRAP} pt-14 lg:pt-16 pb-12 grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.75fr)] items-start`}>
        <div>
          <TextReveal
            as="h2"
            inherit
            delay={80}
            stagger={70}
            text="Sehen Sie es an Ihrem Fall."
            className="block m-0 max-w-[14ch] text-white text-[clamp(1.875rem,3vw,2.75rem)] leading-[1.12] tracking-[-0.025em] font-bold"
          />
          <p className="rv-c m-0 mt-4 max-w-[22rem] text-white/60 leading-[1.6]" style={{ transitionDelay: '260ms' }}>
            Wir zeigen Ihnen DaSense an Ihren Daten und Ihrem Anwendungsfall, auf Wunsch vollständig im eigenen Netz.
          </p>
          <a
            {...linkProps('/#demo')}
            style={{ transitionDelay: '380ms' }}
            className="rv-c group mt-8 inline-flex items-center gap-3 h-12 pl-6 pr-2 rounded-full bg-white !text-ink text-[0.9375rem] font-semibold no-underline transition-colors hover:bg-primary hover:!text-white"
          >
            Demo buchen
            <span className="grid size-8 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:translate-x-0.5">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </a>
        </div>

        <nav aria-label="Zielgruppen" onMouseLeave={() => setHot(hot)}>
          <ul className="list-none m-0 p-0 flex flex-col">
            {CASES.map((c, i) => (
              <li key={c.slug} className="overflow-hidden">
                <a
                  {...linkProps(`/${c.slug}`)}
                  onMouseEnter={() => setHot(i)}
                  onFocus={() => setHot(i)}
                  style={{ transitionDelay: `${120 + i * 70}ms` }}
                  className={`rv-c block no-underline text-[clamp(2.25rem,4.1vw,3.75rem)] leading-[1.14] tracking-[-0.035em] font-bold transition-colors duration-300 ${
                    i === hot ? '!text-white' : '!text-white/35 hover:!text-white'
                  }`}
                >
                  {SHORT[c.slug]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rv-c hidden lg:flex justify-end" style={{ transitionDelay: '300ms' }}>
          <div className="relative w-full max-w-[17rem] aspect-[4/5] rounded-2xl bg-[#f6f2f7] p-6 grid place-items-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
            <CaseIcon key={item.slug} name={item.icon} className="w-full h-auto icon-swap" />
            <span className="absolute left-5 bottom-4 right-5 flex items-center justify-between text-[0.75rem] text-muted">
              <span>{item.title}</span>
              <span className="tabular-nums">{String(hot + 1).padStart(2, '0')} / {String(CASES.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className={`${WRAP} py-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[0.6875rem] tracking-[0.12em] uppercase text-white/45`}>
          <span className="normal-case tracking-normal text-[0.75rem]">© 2026 NorCom Information Technology GmbH &amp; Co. KGaA</span>
          <span className="flex flex-wrap items-center gap-x-3">
            <a {...linkProps('/impressum')} className="!text-white/55 no-underline hover:!text-white">Impressum</a>
            <span aria-hidden="true">·</span>
            <a {...linkProps('/datenschutzerklaerung')} className="!text-white/55 no-underline hover:!text-white">Datenschutz</a>
            <span aria-hidden="true">·</span>
            <a href="https://www.norcom.de" className="!text-white/55 no-underline hover:!text-white">norcom.de</a>
          </span>
        </div>
      </div>
    </>
  )
}
