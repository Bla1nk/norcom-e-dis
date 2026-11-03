import { useEffect, useRef, useState } from 'react'
import type { FlowItem } from '../content/cases'
import { t } from '../lib/i18n'
import { smoothScrollTo } from '../lib/lenis'
import { CollectionVisual } from './steps/CollectionVisual'
import { EntityNetwork } from './steps/EntityNetwork'
import { ReviewCards } from './steps/ReviewCards'
import { ClauseFinder } from './legal/ClauseFinder'
import { ContractEnds } from './legal/ContractEnds'
import { PlaybookCheck } from './legal/PlaybookCheck'
import { LegalSmallCards } from './legal/SmallCards'
import { CaseOverview } from './kanzlei/CaseOverview'
import { ContactNetwork } from './kanzlei/ContactNetwork'
import { KanzleiSmallCards } from './kanzlei/SmallCards'
import { PrivilegeCheck } from './kanzlei/PrivilegeCheck'
import { AirGapped } from './common/AirGapped'
import { RedFlags } from './forensik/RedFlags'
import { MoneyFlow } from './forensik/MoneyFlow'
import { DdHeatmap } from './forensik/DdHeatmap'
import { ForensikSmallCards } from './forensik/SmallCards'
import { LiveTracker } from './dienstleister/LiveTracker'
import { IngestCockpit } from './dienstleister/IngestCockpit'
import { SourcesGrid } from './dienstleister/SourcesGrid'
import { ReviewCapacity } from './dienstleister/ReviewCapacity'
import { CostEstimator } from './dienstleister/CostEstimator'
import { DienstleisterSmallCards } from './dienstleister/SmallCards'
import { DataTreemap } from './behoerden/DataTreemap'
import { Prioritizer } from './behoerden/Prioritizer'
import { MediaTranscript } from './behoerden/MediaTranscript'
import { BehoerdenSmallCards } from './behoerden/SmallCards'
import { BreachImpact } from './datenschutz/BreachImpact'
import { PiiRedaction } from './datenschutz/PiiRedaction'
import { DatenschutzSmallCards } from './datenschutz/SmallCards'
import { SubjectRequest } from './datenschutz/SubjectRequest'
import { Reveal } from './TextReveal'

/** Abstand von oben, an dem ein Abschnitt beim Anspringen steht (unter der Navigation). */
const SCROLL_OFFSET = 96
const top = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET

// Aufbau wie „So funktioniert es“ auf der Hauptseite: gerahmtes Raster, links die mitlaufende Liste der Abschnitte,
// rechts je Abschnitt Text (Claim fett, Beschreibung grau) und darunter die Fläche mit Clip bzw. Grafik.
export function CaseFlow({ items, label, id }: { items: FlowItem[]; label: string; id?: string }) {
  const [active, setActive] = useState(-1)
  const refs = useRef<(HTMLElement | null)[]>([])
  const videos = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(refs.current.indexOf(e.target as HTMLElement))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [items])

  // Clip des aktiven Abschnitts läuft, die anderen pausieren; ein fertiger bleibt auf dem Endbild stehen.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    videos.current.forEach((v, i) => {
      if (!v) return
      if (i === active && !reduce && !v.ended) void v.play().catch(() => {})
      else v.pause()
    })
  }, [active])

  const goTo = (i: number) => {
    const el = refs.current[i]
    if (el) smoothScrollTo(top(el))
  }

  const clip = (i: number, name: string, title: string) => (
    <div className="border-t border-line bg-[#f7f4f8] px-8 lg:px-14 py-16">
      <video
        ref={(el) => {
          videos.current[i] = el
        }}
        className="block w-full aspect-video rounded-xl bg-[#141413] shadow-[0_24px_60px_-24px_rgba(40,10,50,0.35)] ring-1 ring-black/5"
        src={`/videos/${name}.mp4`}
        poster={`/videos/${name}-poster.jpg`}
        muted
        playsInline
        preload="metadata"
        aria-label={`${t('Clip', 'Clip')}: ${title}`}
      />
    </div>
  )

  return (
    <section id={id} aria-label={label} className="relative scroll-mt-16 bg-white border-y border-line">
      <div className="box-border max-w-[1100px] xl:max-w-[1280px] 2xl:max-w-[1520px] 3xl:max-w-[1760px] mx-auto border-x border-line grid lg:grid-cols-[272px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)] 3xl:grid-cols-[360px_minmax(0,1fr)]">
        <nav aria-label={t('Abschnitte', 'Sections')} className="hidden lg:block">
          <ol className="sticky top-24 list-none m-0 py-24 px-0 flex flex-col gap-2.5">
            {items.map((it, i) => (
              <li key={it.title}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className={`relative block w-full text-left bg-transparent border-0 cursor-pointer pl-11 py-0.5 text-[1.0625rem] transition-colors duration-300 ${
                    i === active ? 'text-ink' : 'text-[#c4bcc8] hover:text-body'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-px top-0 bottom-0 w-0.5 bg-primary transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {it.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 lg:border-l border-line">
          {items.map((it, i) => (
            <article
              key={it.title}
              ref={(el) => {
                refs.current[i] = el
              }}
              aria-labelledby={`flow-${i}`}
              className={i > 0 ? 'border-t border-line' : undefined}
            >
              <div className="px-8 lg:px-12 pt-24 pb-16">
                <h3 id={`flow-${i}`} className="sr-only">
                  {it.title}
                </h3>
                <Reveal as="p" className="m-0 max-w-[26rem] text-[1.375rem] leading-[1.3] tracking-[-0.01em] text-muted/70">
                  <span className="text-ink font-medium">{it.claim}</span> {it.desc}
                </Reveal>
              </div>

              {it.visual === 'collection' && <CollectionVisual />}
              {(it.visual === 'video' || it.visual === 'review') && clip(i, it.video ?? '', it.title)}
              {it.visual === 'review' && <ReviewCards />}
              {it.visual === 'legal-ends' && <ContractEnds />}
              {it.visual === 'legal-clauses' && <ClauseFinder />}
              {it.visual === 'legal-playbook' && <PlaybookCheck />}
              {it.visual === 'legal-small' && <LegalSmallCards />}
              {it.visual === 'kanzlei-overview' && <CaseOverview />}
              {it.visual === 'kanzlei-privilege' && <PrivilegeCheck />}
              {it.visual === 'kanzlei-small' && <KanzleiSmallCards />}
              {it.visual === 'kanzlei-network' && <ContactNetwork />}
              {it.visual === 'airgap' && <AirGapped />}
              {it.visual === 'fo-flags' && <RedFlags />}
              {it.visual === 'fo-money' && <MoneyFlow />}
              {it.visual === 'fo-small' && <ForensikSmallCards />}
              {it.visual === 'fo-dd' && <DdHeatmap />}
              {it.visual === 'dl-cockpit' && <IngestCockpit />}
              {it.visual === 'dl-sources' && <SourcesGrid />}
              {it.visual === 'dl-tracker' && <LiveTracker />}
              {it.visual === 'dl-small' && <DienstleisterSmallCards />}
              {it.visual === 'dl-capacity' && <ReviewCapacity />}
              {it.visual === 'dl-cost' && <CostEstimator />}
              {it.visual === 'be-tree' && <DataTreemap />}
              {it.visual === 'be-prio' && <Prioritizer />}
              {it.visual === 'be-small' && <BehoerdenSmallCards />}
              {it.visual === 'be-media' && <MediaTranscript />}
              {it.visual === 'ds-request' && <SubjectRequest />}
              {it.visual === 'ds-pii' && <PiiRedaction />}
              {it.visual === 'ds-small' && <DatenschutzSmallCards />}
              {it.visual === 'ds-breach' && <BreachImpact />}
              {it.visual === 'entities' && (
                <div className="dot-grid-light border-t border-line px-6 lg:px-10 py-14">
                  <EntityNetwork />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
