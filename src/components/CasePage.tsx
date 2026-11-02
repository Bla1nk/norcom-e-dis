import { useEffect } from 'react'
import type { Case } from '../content/cases'
import { linkProps } from '../lib/router'
import { CaseFlow } from './CaseFlow'
import { CaseIcon } from './CaseIcons'
import { Eyebrow } from './Eyebrow'
import { RevealFooter } from './RevealFooter'
import { Reveal, TextReveal } from './TextReveal'

const WRAP = 'box-border max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-8 lg:px-12'
const pad2 = (n: number) => String(n).padStart(2, '0')

// Unterseite je Zielgruppe: Einstieg mit Claim, die passende App mit Clip, Ablauf im Fall, Abschluss mit Demo-Link.
export function CasePage({ item, startDelay = 150 }: { item: Case; startDelay?: number }) {
  // Beim Seitenwechsel startet der Text, sobald der schwarze Vorhang wegzieht.
  const t0 = startDelay
  useEffect(() => {
    const prev = document.title
    document.title = `${item.title} | DaSense eDiscovery`
    return () => {
      document.title = prev
    }
  }, [item])

  return (
    <>
    <main className="relative z-10 bg-white rounded-b-[2.5rem] pt-16 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]" style={{ marginBottom: 'var(--foot)' }}>
      <section className={`${WRAP} pt-14 pb-20 lg:pt-20 lg:pb-28`}>
        <a
          {...linkProps('/#fuer-wen')}
          className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-body no-underline hover:text-ink"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Alle Zielgruppen
        </a>
        <div className="mt-12 grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center gap-12">
          <div>
            <Reveal immediate delay={t0}>
              <Eyebrow colorClass="text-primary">Für {item.title}</Eyebrow>
            </Reveal>
            <TextReveal as="h1" immediate delay={t0 + 80} text={item.claim} className="block m-0 mt-5 text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.06] tracking-[-0.04em] font-bold" />
            <Reveal as="p" immediate delay={t0 + 420} className="m-0 mt-7 max-w-[34rem] text-body text-[1.125rem] leading-[1.6]">
              {item.lede}
            </Reveal>
            <Reveal immediate delay={t0 + 540} className="mt-9 flex flex-wrap items-center gap-3">
              <a {...linkProps('/#demo')} className="inline-flex items-center h-12 px-7 rounded-full bg-primary !text-white text-[0.9375rem] font-semibold no-underline transition-colors hover:bg-primary-hover">
                Demo buchen
              </a>
              {!item.flow && (
                <a href="#app" className="inline-flex items-center h-12 px-5 text-[0.9375rem] font-medium text-ink no-underline hover:text-primary">
                  Die App ansehen ↓
                </a>
              )}
            </Reveal>
          </div>
          <Reveal immediate delay={t0 + 200} className="hidden lg:grid place-items-center aspect-[4/3] rounded-3xl bg-mist">
            <CaseIcon name={item.icon} className="w-[78%] h-auto" />
          </Reveal>
        </div>
      </section>

      {item.flow ? (
        <CaseFlow id="ablauf" items={item.flow} label={`So hilft DaSense: ${item.title}`} />
      ) : (
        <>
      <section id="app" className="border-t border-ink bg-mist/60 py-20 lg:py-28 scroll-mt-16">
        <div className={WRAP}>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-x-8 gap-y-5">
            <Eyebrow colorClass="text-ink">Die App zum Fall</Eyebrow>
            <div>
              <TextReveal as="h2" text={item.app.name} className="block m-0 text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.08] tracking-[-0.035em] font-bold" />
              <Reveal as="p" delay={150} className="m-0 mt-3 text-primary text-[1.25rem] font-medium tracking-[-0.01em]">{item.app.tagline}</Reveal>
              <Reveal as="p" delay={250} className="m-0 mt-5 max-w-[40rem] text-body text-[1.0625rem] leading-[1.65]">{item.app.text}</Reveal>
            </div>
          </div>
          <Reveal className="mt-12">
          <video
            className="block w-full aspect-video rounded-2xl bg-[#141413] shadow-[0_40px_100px_-36px_rgba(40,10,50,0.55)] ring-1 ring-black/5"
            src={`/videos/${item.app.video}.mp4`}
            poster={`/videos/${item.app.video}-poster.jpg`}
            autoPlay
            muted
            loop
            playsInline
            aria-label={`Clip: ${item.app.name}`}
          />
          </Reveal>
          <ul className="list-none m-0 mt-12 p-0 grid md:grid-cols-3 gap-x-10 gap-y-8">
            {item.app.points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 120} className="border-t border-ink pt-5">
                <h3 className="m-0 text-[1.1875rem] tracking-[-0.01em] font-semibold">{p.title}</h3>
                <p className="m-0 mt-2 text-body text-[0.9375rem] leading-[1.65]">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className={WRAP}>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-x-8 gap-y-5 pb-12">
            <Eyebrow colorClass="text-ink">Im Fall</Eyebrow>
            <TextReveal as="h2" text="So läuft es ab." className="block m-0 text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-[-0.035em] font-bold" />
          </div>
          <ol className="list-none m-0 p-0 border-t border-ink">
            {item.steps.map((s, i) => (
              <li key={s.title} className="grid lg:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-2 py-8 border-b border-ink">
                <span className="text-[0.8125rem] font-semibold tabular-nums pt-2">{pad2(i + 1)}</span>
                <TextReveal as="h3" text={s.title} className="block m-0 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.15] tracking-[-0.03em] font-bold" />
                <Reveal as="p" delay={200} className="m-0 text-body text-[0.9375rem] leading-[1.65] lg:pt-2">{s.text}</Reveal>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span key={t} className="text-[0.8125rem] py-1 px-3 rounded-full bg-mist text-body">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

        </>
      )}

      {/* Weißer Abschluss mit Rundung: darunter zieht sich der Footer frei */}
      <div aria-hidden="true" className="overflow-hidden bg-white rounded-b-[2.5rem] pt-16 lg:pt-24 pb-2 text-center select-none">
        <div className="text-[clamp(4.5rem,17vw,16rem)] leading-[0.9] tracking-[-0.055em] font-bold text-ink">DaSense</div>
      </div>
    </main>
    <RevealFooter />
    </>
  )
}
