import { PraxisDemo } from './PraxisDemo'
import { Eyebrow, sectionHeadingClass } from './Eyebrow'

export function Praxis() {
  return (
    // Teil des dunklen Abschnitts „Warum DaSense“ (kein eigener Hintergrund, damit keine Naht entsteht)
    <div id="praxis" role="region" aria-labelledby="praxis-h" className="relative border-t border-white/[0.08]">
      <div className="max-w-[1240px] mx-auto py-28 px-8 lg:px-12 flex flex-col gap-8">
        <div className="flex flex-col gap-4 max-w-[48rem]">
          <Eyebrow colorClass="text-[#c39bd3]">DaSense in der Praxis</Eyebrow>
          <h2 id="praxis-h" className={`${sectionHeadingClass} !text-white`}>
            Eine Frage. Neue Zusammenhänge. Belegte Antworten.
          </h2>
          <p className="m-0 text-[1.125rem] text-[#a19dab]">
            Stellen Sie einem Dokument eine Frage. SenseBot antwortet, nennt die Quellen und markiert die Fundstellen im
            Original.
          </p>
        </div>
        <PraxisDemo />
        <div className="flex flex-col items-center gap-2.5 text-center">
          <svg
            aria-hidden="true"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c39bd3"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-none"
          >
            <circle cx="9" cy="7" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5 1.6 0 3 .5 4.1 1.4" />
            <path d="m15 18 2 2 4.5-4.5" />
          </svg>
          <div className="flex flex-col items-center gap-1">
            <h3 className="m-0 text-white text-[1.25rem] font-semibold leading-[1.3]">
              Die KI untersucht. Der Mensch entscheidet.
            </h3>
            <p className="m-0 text-[#d6d2e0]">Jeder Hinweis lässt sich anhand der Originalquellen überprüfen.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
