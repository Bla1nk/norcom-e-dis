import { t } from '../lib/i18n'
import { Eyebrow } from './Eyebrow'
import { Reveal, RevealGroup, TextReveal } from './TextReveal'

const STEPS = [
  { t: t('Zeitnah eine Antwort', 'A prompt reply'), d: t('Wir melden uns per E-Mail oder Telefon und klären kurz, welchen Fall und welche Daten Sie im Blick haben.', 'We get back to you by email or phone and briefly clarify which case and which data you have in mind.') },
  { t: t('Ein Gespräch zu Ihrem Fall', 'A conversation about your case'), d: t('Wir besprechen Anwendungsfall, Datenlage und das passende Betriebsmodell, unverbindlich.', 'We discuss your use case, your data and the right deployment model, with no obligation.') },
  { t: t('Ihre Live-Demo', 'Your live demo'), d: t('Wir zeigen DaSense an einem Beispielbestand oder, wenn Sie möchten, an Ihren eigenen Daten, auch im eigenen Netz.', 'We show DaSense on a sample data set or, if you prefer, on your own data, even inside your own network.') },
]

const NOTES = [
  { q: t('Auf Wunsch vollständig im eigenen Netz.', 'Fully inside your own network, if you wish.'), s: t('DaSense und die lokale KI laufen auch ohne Verbindung nach außen.', 'DaSense and the local AI run without any outside connection.') },
  { q: t('Ihre Angaben nur für Ihre Demo.', 'Your details, only for your demo.'), s: t('Wir verwenden sie ausschließlich, um Ihre Anfrage zu bearbeiten und Sie zu kontaktieren.', 'We use them solely to handle your request and to contact you.') },
]

// „Was als Nächstes passiert“ im Aufbau des Vorbilds: links Eyebrow und große Headline, in der Mitte drei nummerierte
// Schritte zwischen Linien, rechts zwei umrahmte Hinweiskarten. Liegt direkt unter dem Demo-Formular.
export function DemoNext() {
  return (
    <section aria-labelledby="next-h" className="bg-[#ebe3ee] border-t border-ink/10">
      <div className="box-border max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] gap-x-12 gap-y-12 sm:gap-y-14 items-start">
        <div>
          <Reveal>
            <Eyebrow colorClass="text-ink">{t('Nach dem Absenden', 'After you submit')}</Eyebrow>
          </Reveal>
          <h2 id="next-h" className="m-0 mt-6 text-[clamp(2.75rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.04em] font-bold text-ink uppercase">
            <TextReveal text={t('Was dann', 'What happens')} delay={60} stagger={90} className="block" />
            <TextReveal text={t('passiert.', 'next.')} delay={240} className="block font-serif italic font-medium normal-case tracking-[-0.02em]" />
          </h2>
        </div>

        <RevealGroup as="ol" className="list-none m-0 p-0 border-t border-ink">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rv-c grid grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)] gap-x-3 sm:gap-x-4 py-6 sm:py-7 border-b border-ink" style={{ transitionDelay: `${i * 140}ms` }}>
              <span className="pt-1.5 text-[0.8125rem] font-bold tabular-nums text-ink">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="m-0 text-[1.3125rem] sm:text-[1.5rem] leading-[1.15] tracking-[-0.025em] font-bold text-ink">{s.t}</h3>
                <p className="m-0 mt-2.5 text-body text-[0.9375rem] leading-[1.65]">{s.d}</p>
              </div>
            </li>
          ))}
        </RevealGroup>

        <RevealGroup className="flex flex-col gap-4">
          {NOTES.map((n, i) => (
            <figure key={n.q} className="rv-c m-0 border border-ink bg-[#f4eff6] p-5 sm:p-7" style={{ transitionDelay: `${i * 160}ms` }}>
              <p className="m-0 font-serif italic text-[1.5rem] leading-[1.3] text-ink">{n.q}</p>
              <figcaption className="mt-6 text-[0.875rem] text-body leading-[1.6]">{n.s}</figcaption>
            </figure>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
