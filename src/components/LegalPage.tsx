import { Fragment, useEffect } from 'react'
import type { LegalDoc } from '../content/legal'
import { linkProps } from '../lib/router'
import { Eyebrow } from './Eyebrow'
import { RevealFooter } from './RevealFooter'
import { Reveal, TextReveal } from './TextReveal'

const WRAP = 'box-border max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-8 lg:px-12'

// URLs und E-Mail-Adressen im Text als Links darstellen.
function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+|www\.[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g)
  return parts.map((s, i) => {
    if (/^https?:\/\//.test(s)) return <a key={i} href={s} rel="noopener noreferrer" className="text-primary break-all">{s}</a>
    if (/^www\./.test(s)) return <a key={i} href={`https://${s}`} rel="noopener noreferrer" className="text-primary break-all">{s}</a>
    if (/@/.test(s)) return <a key={i} href={`mailto:${s}`} className="text-primary">{s}</a>
    return <Fragment key={i}>{s}</Fragment>
  })
}

// Rechtstext-Seite (Impressum, Datenschutzerklärung) im Rahmen der Unterseiten: gleicher Footer-Reveal.
export function LegalPage({ doc, startDelay = 150 }: { doc: LegalDoc; startDelay?: number }) {
  useEffect(() => {
    const prev = document.title
    document.title = `${doc.title} | DaSense eDiscovery`
    return () => {
      document.title = prev
    }
  }, [doc])

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
              <Eyebrow colorClass="text-primary">{doc.eyebrow}</Eyebrow>
            </Reveal>
            <div>
              <TextReveal as="h1" immediate delay={startDelay + 80} text={doc.title} className="block m-0 text-[clamp(2.5rem,6vw,5.25rem)] leading-[1.06] tracking-[-0.04em] font-bold" />
              <div className="mt-14 max-w-[46rem]">
                {doc.sections.map((s, i) => (
                  <Reveal key={i} className={s.h ? 'mt-12 first:mt-0' : 'mt-5'}>
                    {s.h && <h2 className="m-0 mb-4 text-[1.375rem] leading-[1.25] tracking-[-0.015em] font-semibold">{s.h}</h2>}
                    {s.sub && <h3 className={`m-0 mb-3 text-[1.0625rem] font-semibold ${s.h ? 'mt-0' : 'mt-9'}`}>{s.sub}</h3>}
                    {s.p?.map((t, j) => (
                      <p key={j} className="m-0 mb-4 last:mb-0 text-body text-[1rem] leading-[1.7] whitespace-pre-line">{linkify(t)}</p>
                    ))}
                    {s.ul && (
                      <ul className="m-0 mt-3 pl-5 flex flex-col gap-2 text-body text-[1rem] leading-[1.7]">
                        {s.ul.map((t, j) => (
                          <li key={j}>{linkify(t)}</li>
                        ))}
                      </ul>
                    )}
                  </Reveal>
                ))}
                {doc.stand && <p className="m-0 mt-12 text-[0.875rem] text-muted">{doc.stand}</p>}
              </div>
            </div>
          </div>
        </section>
        <div aria-hidden="true" className="overflow-hidden bg-white rounded-b-[2.5rem] pt-10 lg:pt-16 pb-2 text-center select-none">
          <div className="text-[clamp(4.5rem,17vw,16rem)] leading-[0.9] tracking-[-0.055em] font-bold text-ink">DaSense</div>
        </div>
      </main>
      <RevealFooter />
    </>
  )
}
