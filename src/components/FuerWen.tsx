import { CASES } from '../content/cases'
import { CaseIcon } from './CaseIcons'
import { Eyebrow } from './Eyebrow'
import { linkProps } from '../lib/router'
import { RevealGroup, TextReveal } from './TextReveal'

const pad2 = (n: number) => String(n).padStart(2, '0')

export function FuerWen() {
  return (
    <section id="fuer-wen" aria-labelledby="fuer-wen-h" className="relative bg-white py-20 sm:py-24 lg:py-32">
      <div className="box-border max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1.6fr)] items-start gap-x-8 gap-y-5 pb-10 sm:pb-14">
          <Eyebrow colorClass="text-ink">Für wen</Eyebrow>
          <TextReveal as="h2" id="fuer-wen-h" text="Zielgruppen." className="block m-0 text-ink text-[clamp(2.5rem,6vw,5.25rem)] leading-[1.06] tracking-[-0.04em] font-bold" />
          <p className="m-0 text-body text-[0.9375rem] leading-[1.65]">
            Für alle, die große Datenbestände belastbar auswerten müssen, ob in der Kanzlei, im Konzern oder in der Behörde.
          </p>
        </div>

        <ul className="list-none m-0 p-0 border-t border-ink">
          {CASES.map((a, i) => (
            <RevealGroup as="li" key={a.title} className="relative">
              <span aria-hidden="true" className="line-draw" />
              <a
                {...linkProps(`/${a.slug}`)}
                className="group grid grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[6rem_minmax(0,1fr)_11rem_21rem_2rem] items-start gap-x-3 sm:gap-x-5 lg:gap-x-8 gap-y-4 py-7 sm:py-8 lg:py-9 text-inherit no-underline transition-colors hover:bg-mist/70"
              >
                <span className="rv-c text-[0.8125rem] font-semibold tabular-nums text-ink pt-2 lg:pt-3.5">{pad2(i + 1)}</span>
                <TextReveal
                  as="h3"
                  inherit
                  delay={120}
                  text={a.title}
                  className="block m-0 col-start-2 lg:col-start-auto text-ink text-[clamp(1.75rem,3.1vw,2.75rem)] leading-[1.12] tracking-[-0.03em] font-bold transition-transform duration-300 group-hover:translate-x-1"
                />
                <div className="rv-c col-start-2 lg:col-start-auto justify-self-start lg:justify-self-center lg:mt-1" style={{ transitionDelay: '240ms' }}>
                  <CaseIcon name={a.icon} className="w-[8.5rem] sm:w-[9.5rem] lg:w-[11rem] h-auto" />
                </div>
                <div className="rv-c col-start-2 lg:col-start-auto lg:pt-2" style={{ transitionDelay: '320ms' }}>
                  <p className="m-0 text-body text-[0.9375rem] leading-[1.65]">{a.text}</p>
                  <span className="mt-3 flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <span key={t} className="text-[0.75rem] py-0.5 px-2.5 rounded-full bg-mist text-body">
                        {t}
                      </span>
                    ))}
                  </span>
                </div>
                <span className="rv-c hidden lg:block justify-self-end lg:mt-3" style={{ transitionDelay: '420ms' }}>
                  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" className="block text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <path d="M6 18 18 6M8 6h10v10" />
                  </svg>
                </span>
              </a>
            </RevealGroup>
          ))}
        </ul>
      </div>
    </section>
  )
}
