import { useEffect, useRef, useState } from 'react'
import { REF_HERO, REF_ITEMS, type VisualId } from '../content/referenzen'
import { smoothScrollTo } from '../lib/lenis'
import { linkProps } from '../lib/router'
import { CustomerCarousel } from './CustomerCarousel'
import { Eyebrow } from './Eyebrow'
import { RevealFooter } from './RevealFooter'
import { Reveal, TextReveal } from './TextReveal'
import { Anonymisieren, BehoerdenChat, DueDiligence, Fahrzeugdaten, Finanzkontrolle, ItBetrieb, KiPlattform, Kompetenz, Produktion } from './referenzen/Visuals'

const WRAP = 'box-border max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12'
const SCROLL_OFFSET = 96

const VISUALS: Record<VisualId, () => React.JSX.Element> = {
  ItBetrieb, KiPlattform, Kompetenz, Anonymisieren, Finanzkontrolle, BehoerdenChat, Fahrzeugdaten, Produktion, DueDiligence,
}

// Referenzen im Aufbau von „So funktioniert es“: gerahmtes Raster, links die mitlaufende Liste, rechts je Referenz
// Text und darunter ein Dashboard mit hochzählenden Kennzahlen.
function RefFlow() {
  const [active, setActive] = useState(-1)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(refs.current.indexOf(e.target as HTMLElement))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const goTo = (i: number) => {
    const el = refs.current[i]
    if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET)
  }

  return (
    <section aria-label="Referenzen" className="relative bg-white border-y border-line">
      <div className="box-border max-w-[1100px] xl:max-w-[1280px] 2xl:max-w-[1520px] 3xl:max-w-[1760px] mx-auto border-x border-line grid lg:grid-cols-[272px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)] 3xl:grid-cols-[360px_minmax(0,1fr)]">
        <nav aria-label="Referenzen" className="hidden lg:block">
          <ol className="sticky top-24 list-none m-0 py-24 px-0 flex flex-col gap-2.5">
            {REF_ITEMS.map((it, i) => (
              <li key={it.nav}>
                {REF_ITEMS[i - 1]?.group !== it.group && (
                  <div className={`pl-11 text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-muted ${i ? 'mt-5' : ''} mb-2`}>{it.group}</div>
                )}
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className={`relative block w-full text-left bg-transparent border-0 cursor-pointer pl-11 py-0.5 text-[1.0625rem] transition-colors duration-300 ${i === active ? 'text-ink' : 'text-[#c4bcc8] hover:text-body'}`}
                >
                  <span aria-hidden="true" className={`absolute -left-px top-0 bottom-0 w-0.5 bg-primary transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-0'}`} />
                  {it.nav}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 lg:border-l border-line">
          {REF_ITEMS.map((it, i) => {
            const Visual = VISUALS[it.visual]
            return (
              <article key={it.nav} ref={(el) => { refs.current[i] = el }} aria-labelledby={`ref-${i}`} className={i > 0 ? 'border-t border-line' : undefined}>
                <div className="px-5 sm:px-8 lg:px-12 pt-20 lg:pt-24 pb-12 lg:pb-16">
                  <h3 id={`ref-${i}`} className="sr-only">{it.nav}</h3>
                  <Reveal className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary-tint px-3 py-1 text-[0.75rem] font-semibold text-primary">{it.org}</span>
                    {it.tags.map((t) => (
                      <span key={t} className="rounded-md border border-line bg-mist px-2.5 py-0.5 text-[0.75rem] text-body">{t}</span>
                    ))}
                  </Reveal>
                  <Reveal as="p" className="m-0 max-w-[34rem] text-[1.375rem] leading-[1.3] tracking-[-0.01em] text-muted/70">
                    <span className="text-ink font-medium">{it.claim}</span> {it.desc}
                  </Reveal>
                </div>
                <Visual />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ReferenzenPage({ startDelay = 150 }: { startDelay?: number }) {
  useEffect(() => {
    const prev = document.title
    document.title = 'Referenzen | DaSense eDiscovery'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <>
      <main className="relative z-10 bg-white rounded-b-[2.5rem] pt-16 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]" style={{ marginBottom: 'var(--foot)' }}>
        <section className={`${WRAP} pt-14 pb-16 lg:pt-20 lg:pb-24`}>
          <a {...linkProps('/#top')} className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-body no-underline hover:text-ink">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            Zur Startseite
          </a>
          <div className="mt-12 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-x-10 gap-y-8">
            <Reveal immediate delay={startDelay}>
              <Eyebrow colorClass="text-primary">{REF_HERO.eyebrow}</Eyebrow>
            </Reveal>
            <div>
              <TextReveal as="h1" immediate delay={startDelay + 80} text={REF_HERO.title} className="block m-0 text-[clamp(2.5rem,6vw,5.25rem)] leading-[1.06] tracking-[-0.04em] font-bold" />
              <Reveal immediate delay={startDelay + 400}>
                <p className="m-0 mt-8 max-w-[34rem] text-body text-[1.0625rem] leading-[1.65]">{REF_HERO.lede}</p>
                <a {...linkProps('/#demo')} className="mt-8 inline-flex items-center h-12 px-7 rounded-full bg-primary !text-white text-[0.9375rem] font-semibold no-underline transition-colors hover:bg-primary-hover">
                  Gespräch vereinbaren
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        <CustomerCarousel />
        <RefFlow />

        <div aria-hidden="true" className="overflow-hidden bg-white rounded-b-[2.5rem] pt-10 lg:pt-16 pb-2 text-center select-none">
          <div className="text-[clamp(4.5rem,17vw,16rem)] leading-[0.9] tracking-[-0.055em] font-bold text-ink">DaSense</div>
        </div>
      </main>
      <RevealFooter />
    </>
  )
}
