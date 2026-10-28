import { useEffect, useRef, useState } from 'react'
import { STEPS, STEP_VIDEOS } from '../content/steps'
import { smoothScrollTo } from '../lib/lenis'
import { CollectionVisual } from './steps/CollectionVisual'
import { EntityNetwork } from './steps/EntityNetwork'
import { NavigatorFlow } from './steps/NavigatorFlow'
import { ProcessingCards } from './steps/ProcessingCards'
import { ReviewCards } from './steps/ReviewCards'

/** Schritte, deren Clip randlos auf einer dunklen, gepunkteten Fläche liegt (Diagramm im Attio-Stil, ohne Fenster). */
const FLUSH = new Set<number>([1])

/** Abstand von oben, an dem ein Schritt beim Anspringen steht (unter der Sticky-Navigation). */
const SCROLL_OFFSET = 96

const stepTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET

// „So funktioniert es“ im Aufbau wie attio.com: gerahmtes Raster (wächst auf breiten Bildschirmen mit), links eine mitlaufende Liste
// der Schritte, rechts je Schritt Text (Claim fett, Beschreibung grau) und darunter eine Fläche
// mit dem Clip. Der Clip startet, sobald sein Schritt aktiv ist.
export function Steps() {
  // -1: noch kein Schritt im Bild, dann läuft auch kein Clip (sonst startet Collection schon im Hero).
  const [active, setActive] = useState(-1)
  const stepRefs = useRef<(HTMLElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Aktiver Schritt = der, dessen Fläche die Bildschirmmitte schneidet.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(stepRefs.current.indexOf(e.target as HTMLElement))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    stepRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  // Clip des aktiven Schritts abspielen, alle anderen anhalten. Jeder Clip läuft nur einmal:
  // beim Zurückscrollen geht ein angefangener Clip an derselben Stelle weiter, ein fertiger
  // bleibt auf dem Endbild stehen (und löst kein weiteres Auto-Scrollen aus).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active && !reduce && !video.ended) {
        void video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [active])

  const goTo = (i: number) => {
    const el = stepRefs.current[i]
    if (el) smoothScrollTo(stepTop(el))
  }

  return (
    // Liegt über „Warum DaSense“ und zieht sich am Ende wie ein Vorhang nach oben weg.
    <section id="funktionen" aria-label="So funktioniert es" className="relative z-10 bg-white border-y border-line">
      <div className="box-border max-w-[1100px] xl:max-w-[1280px] 2xl:max-w-[1520px] 3xl:max-w-[1760px] mx-auto border-x border-line grid lg:grid-cols-[272px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)] 3xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* Linke Spalte: Liste der Schritte, bleibt beim Scrollen stehen */}
        <nav aria-label="Schritte" className="hidden lg:block">
          <ol className="sticky top-24 list-none m-0 py-24 px-0 flex flex-col gap-2.5">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className={`relative block w-full text-left bg-transparent border-0 cursor-pointer pl-11 py-0.5 text-[1.0625rem] transition-colors duration-300 ${
                    i === active ? 'text-ink' : 'text-[#c4bcc8] hover:text-body'
                  }`}
                >
                  {/* Markierung auf der linken Rahmenlinie */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-px top-0 bottom-0 w-0.5 bg-primary transition-opacity duration-300 ${
                      i === active ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {step.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Rechte Spalte: je Schritt Text und Clip */}
        <div className="min-w-0 lg:border-l border-line">
          {STEPS.map((step, i) => (
            <article
              key={step.title}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              aria-labelledby={`step-${i}`}
              className={i > 0 ? 'border-t border-line' : undefined}
            >
              <div className="px-8 lg:px-12 pt-24 pb-16">
                <h3 id={`step-${i}`} className="sr-only">
                  {step.title}
                </h3>
                <p className="m-0 max-w-[24rem] text-[1.375rem] leading-[1.3] tracking-[-0.01em] text-muted/70">
                  <span className="text-ink font-medium">{step.claim}</span> {step.desc}
                </p>
              </div>
              {i === 0 ? (
                <CollectionVisual />
              ) : (
                <div
                  className={`border-t border-line ${
                    FLUSH.has(i) ? 'dot-grid-dark' : 'bg-[#f7f4f8] px-8 lg:px-14 py-16'
                  }`}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el
                    }}
                    className={
                      FLUSH.has(i)
                        ? 'block w-full aspect-video'
                        : 'block w-full aspect-video rounded-xl bg-[#141413] shadow-[0_24px_60px_-24px_rgba(40,10,50,0.35)] ring-1 ring-black/5'
                    }
                    src={`/videos/${STEP_VIDEOS[i]}.mp4`}
                    poster={`/videos/${STEP_VIDEOS[i]}-poster.jpg`}
                    muted
                    playsInline
                    preload={i < 2 ? 'auto' : 'metadata'}
                    aria-label={`Clip: ${step.title}`}
                  />
                </div>
              )}
              {i === 2 && <ReviewCards />}
              {i === 3 && (
                <div className="border-t border-line">
                  <div className="px-8 lg:px-12 pt-24 pb-16">
                    <p className="m-0 max-w-[30rem] text-[1.375rem] leading-[1.3] tracking-[-0.01em] text-muted/70">
                      <span className="text-ink font-medium">Der Fall „Vertraulich“: Verbindungen sichtbar machen.</span>{' '}
                      Die Entitätenerkennung zieht Personen, Organisationen, Orte und Projekte aus den vertraulichen
                      Dokumenten. Klicken Sie auf eine Entität und sehen Sie, mit wem sie gemeinsam genannt wird.
                    </p>
                  </div>
                  <div className="dot-grid-light border-t border-line px-6 lg:px-10 py-14">
                    <EntityNetwork />
                  </div>
                </div>
              )}
              {i === 1 && (
                <>
                  <ProcessingCards />
                  {/* AI Navigator: eigener Block wie Attios „Speed to lead“ */}
                  <div id="ai-navigator" className="border-t border-line">
                    <div className="px-8 lg:px-12 pt-24 pb-16">
                      <p className="m-0 max-w-[24rem] text-[1.375rem] leading-[1.3] tracking-[-0.01em] text-muted/70">
                        <span className="text-ink font-medium">AI Navigator: das Wichtigste zuerst.</span> Der AI
                        Navigator erkennt per Logik, welche Dokumente zuerst vektorisiert werden, damit die Analyse
                        sofort mit den relevanten Daten startet.
                      </p>
                    </div>
                    <div className="dot-grid-light border-t border-line px-6 lg:px-10 py-14">
                      <NavigatorFlow />
                    </div>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
