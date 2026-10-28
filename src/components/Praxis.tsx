import type { ReactNode } from 'react'
import { Eyebrow, sectionHeadingClass } from './Eyebrow'

const lilacIcon = {
  'aria-hidden': true,
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#E2C3EE',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'flex-none',
} as const

type AgentAction = { text: string; icon: ReactNode }

const ACTIONS: AgentAction[] = [
  {
    text: 'Relevante E-Mails und Chats untersuchen',
    icon: (
      <svg {...lilacIcon}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    text: 'Personen, Zeitpunkte und Aussagen verknüpfen',
    icon: (
      <svg {...lilacIcon}>
        <circle cx="6" cy="5" r="2" />
        <circle cx="18" cy="7" r="2" />
        <circle cx="6" cy="19" r="2" />
        <path d="M6 7v10M18 9c0 5-6 4-12 8" />
      </svg>
    ),
  },
  {
    text: 'Neue Hinweise erkennen und weiterverfolgen',
    icon: (
      <svg {...lilacIcon}>
        <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
        <path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" />
      </svg>
    ),
  },
]

const SOURCES = ['Chat [1]', 'E-Mail [2]', 'Kalkulation [3]']

export function Praxis() {
  return (
    <section
      id="praxis"
      aria-labelledby="praxis-h"
      // Gleitet über den stehenbleibenden dunklen Abschnitt „Warum DaSense“.
      className="relative bg-white"
    >
      <div className="max-w-[1200px] mx-auto py-24 px-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4 max-w-[48rem]">
          <Eyebrow colorClass="text-primary">DaSense in der Praxis</Eyebrow>
          <h2 id="praxis-h" className={sectionHeadingClass}>
            Eine Frage. Neue Zusammenhänge. Belegte Antworten.
          </h2>
          <p className="m-0 text-[1.125rem] text-body">
            Erleben Sie, wie KI-Agenten einer Fragestellung nachgehen und relevante Hinweise
            zusammenführen.
          </p>
        </div>
        <figure
          aria-label="Beispiel: KI-Agenten gehen der Frage nach, ob es Hinweise auf Preisabsprachen gab"
          className="m-0 bg-night rounded-2xl p-[clamp(1.5rem,3vw,2.25rem)] text-snow flex flex-col gap-6 shadow-panel"
        >
          <div className="flex flex-col gap-2 pb-6 border-b border-plum-line">
            <span className="text-[0.75rem] tracking-[0.08em] uppercase text-plum-label font-semibold">
              Ihre Frage
            </span>
            <p className="m-0 text-[clamp(1.25rem,2vw,1.5rem)] font-bold leading-[1.3] text-white">
              „Gab es Hinweise auf Preisabsprachen?“
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[0.875rem]">
                <span className="inline-flex items-center gap-2 text-snow">
                  <svg {...lilacIcon} width={18} height={18}>
                    <ellipse cx="12" cy="5" rx="8" ry="3" />
                    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
                    <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
                  </svg>
                  <span>
                    <strong className="text-white">5 TB</strong> Datenbestand · E-Mails, Chats,
                    Dokumente
                  </span>
                </span>
                <span className="grid font-mono text-[0.75rem]">
                  <span className="px-l0 [grid-area:1/1] justify-self-end text-lilac">
                    wird durchsucht …
                  </span>
                  <span className="px-l1 [grid-area:1/1] justify-self-end text-mint">
                    durchsucht ✓
                  </span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-plum-line overflow-hidden">
                <div className="px-bar h-full w-full rounded-full bg-[linear-gradient(90deg,#8A4A9C,#D9A6EC)] origin-left" />
              </div>
            </div>
          </div>
          <ul aria-label="Vorgehen der KI-Agenten" className="list-none m-0 p-0 flex flex-col gap-4">
            {ACTIONS.map((a, i) => (
              <li
                key={a.text}
                className={`px-s px-s${i} flex items-center gap-3 text-[1.0625rem] text-snow`}
              >
                {a.icon}
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
          <div className="px-card bg-plum-card rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
              <span className="text-[0.8125rem] tracking-[0.08em] uppercase text-lilac font-bold">
                Mögliche Erkenntnis
              </span>
              <svg {...lilacIcon}>
                <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M14 3v6h6" />
                <path d="m9 15 2 2 4-4" />
              </svg>
            </div>
            <p className="m-0 text-[clamp(1.0625rem,1.6vw,1.25rem)] font-bold leading-[1.45] text-white">
              Ein Treffen mit Wettbewerbern steht möglicherweise im Zusammenhang mit einer späteren
              Preisanpassung.
            </p>
            <ul aria-label="Quellen" className="list-none m-0 p-0 flex flex-wrap gap-2">
              {SOURCES.map((s, i) => (
                <li
                  key={s}
                  className={`px-c px-c${i} py-1 px-2.5 rounded-md bg-plum-chip text-snow text-[0.8125rem] font-semibold`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </figure>
        <div className="flex flex-col items-center gap-2.5 text-center">
          <svg
            aria-hidden="true"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#601571"
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
            <h3 className="m-0 text-primary text-[1.25rem] font-semibold leading-[1.3]">
              Die KI untersucht. Der Mensch entscheidet.
            </h3>
            <p className="m-0 text-body">Jeder Hinweis lässt sich anhand der Originalquellen überprüfen.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
