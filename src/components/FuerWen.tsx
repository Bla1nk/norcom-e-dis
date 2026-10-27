import { Eyebrow, sectionHeadingClass } from './Eyebrow'

type Audience = { title: string; text: string; tags: string[] }

const AUDIENCES: Audience[] = [
  {
    title: 'Kanzleien',
    text: 'Große Dokumentenbestände in Streitverfahren früh einschätzen und gezielt prüfen.',
    tags: ['Litigation & Schiedsverfahren', 'Kartellverfahren', 'Early Case Assessment'],
  },
  {
    title: 'Rechtsabteilungen & Compliance',
    text: 'Interne Untersuchungen vertraulich führen und Behördenanfragen fristgerecht beantworten.',
    tags: ['Hinweisgeberfälle', 'Behördenanfragen', 'Dawn-Raid-Vorbereitung'],
  },
  {
    title: 'Datenschutz & IT-Security',
    text: 'Personenbezogene Daten systemübergreifend finden, schnell und nachweisbar.',
    tags: ['DSGVO-Auskunftsersuchen', 'Incident Response', 'Betroffene nach Datenpanne ermitteln'],
  },
  {
    title: 'Forensik & Beratung',
    text: 'Forensik-Teams von Wirtschaftsprüfungen und Beratungen, die Betrugs- und Transaktionsfälle unter Zeitdruck aufklären.',
    tags: ['Fraud Investigations', 'M&A Due Diligence'],
  },
  {
    title: 'eDiscovery-Dienstleister',
    text: 'Litigation-Support-Anbieter, die KI-gestützte Auswertung als eigenen Service für ihre Mandanten anbieten wollen.',
    // INTERN ZU PRÜFEN: Mandantenfähigkeit technisch bestätigen; erst danach als Merkmal ergänzen.
    tags: ['Eigenes Rechenzentrum'],
  },
  {
    title: 'Behörden & Ermittler',
    text: 'Millionen Beweisdateien schneller sichten und priorisieren.',
    tags: ['Sichergestellte Massendaten', 'Aufsichtsverfahren'],
  },
]

export function FuerWen() {
  return (
    <section id="fuer-wen">
      <div className="max-w-[1200px] mx-auto py-24 px-8 flex flex-wrap gap-12">
        <div className="flex-[1_1_360px] min-w-0 flex flex-col gap-4">
          <Eyebrow>Für wen</Eyebrow>
          <h2 className={sectionHeadingClass}>
            Für alle, die große Datenbestände belastbar auswerten müssen.
          </h2>
        </div>
        <ul className="flex-[1_1_560px] min-w-0 list-none m-0 p-0 border-t border-card-line">
          {AUDIENCES.map((a) => (
            <li key={a.title} className="border-b border-card-line">
              <details className="group">
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 min-h-16 py-3 cursor-pointer text-[1.125rem] font-semibold text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 focus-visible:rounded-[4px]">
                  {a.title}
                  <svg
                    className="flex-none transition-transform duration-200 ease-[ease] group-open:rotate-180"
                    aria-hidden="true"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#601571"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div className="flex flex-col gap-3 pb-5">
                  <span className="text-body">{a.text}</span>
                  <span className="flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[0.8125rem] py-1 px-2.5 rounded-full bg-mist text-body"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
