import { useEffect, useState } from 'react'
import { Surface, useSeen } from '../legal/shared'
import { Count, Illustrative, Kpi, KpiGrid, Section, Win, motion } from './ui'

// Dashboards der Referenzen. Eckdaten (150.000, 600 Mrd., 90.000 usw.) stammen von norcom.de/referenzen;
// Verläufe, Balken und Beispielinhalte sind illustrativ.

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const Bar = ({ h, on, i, tone = 'bg-primary/80' }: { h: number; on: boolean; i: number; tone?: string }) => (
  <div className="flex-1 flex flex-col justify-end h-full">
    <div className={`w-full rounded-t ${tone} ${motion}`} style={{ height: on ? `${h}%` : '0%', transitionDelay: `${i * 60}ms` }} />
  </div>
)
const Progress = ({ pct, on, delay = 0 }: { pct: number; on: boolean; delay?: number }) => (
  <div className="h-2 rounded-full bg-primary-tint overflow-hidden">
    <div className={`h-full rounded-full bg-primary ${motion} duration-[1600ms]`} style={{ width: on ? `${pct}%` : '0%', transitionDelay: `${delay}ms` }} />
  </div>
)

/** 1 · IT-Großbetrieb */
export function ItBetrieb() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const reports = [72, 78, 84, 80, 88, 92, 86, 90, 95, 91, 97, 100]
  return (
    <Surface>
      <div ref={ref}>
        <Win title="Betriebsübersicht · Bundesbehörde">
          <KpiGrid>
            <Kpi label="Beschäftigte, deren IT wir mitbetreiben"><Count to={150000} seen={seen} /></Kpi>
            <Kpi label="Datensätze im Data Warehouse"><Count to={600} seen={seen} suffix=" Mrd.+" /></Kpi>
            <Kpi label="Reports pro Monat"><Count to={100000} seen={seen} suffix="+" /></Kpi>
            <Kpi label="Nutzer der Reports"><Count to={5000} seen={seen} suffix="+" /></Kpi>
          </KpiGrid>
          <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Section title="Reports pro Monat" aside="letzte 12 Monate">
              <div className="flex items-end gap-1.5 h-36">
                {reports.map((h, i) => <Bar key={i} h={h} on={seen} i={i} tone={i === 11 ? 'bg-primary' : 'bg-primary/25'} />)}
              </div>
              <div className="mt-1.5 flex gap-1.5 text-[0.6875rem] text-muted">{MONTHS.map((m, i) => <span key={i} className="flex-1 text-center">{m}</span>)}</div>
            </Section>
            <Section title="Betrieb nach ITIL">
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {['Infrastruktur', 'Datenbanken', 'Middleware', 'Netze', 'IT-Sicherheit'].map((s, i) => (
                  <li key={s} className={`flex items-center justify-between ${motion}`} style={{ opacity: seen ? 1 : 0, transitionDelay: `${300 + i * 140}ms` }}>
                    <span>{s}</span>
                    <span className="inline-flex items-center gap-1.5 text-muted"><span className="size-2 rounded-full bg-[#28c840]" />im Betrieb</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}

/** 2 · On-Prem-KI-Plattform */
export function KiPlattform() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  return (
    <Surface>
      <div ref={ref}>
        <Win title="KI-Plattform · eigenes Rechenzentrum">
          <KpiGrid>
            <Kpi label="Nutzer der Behörde"><Count to={90000} seen={seen} /></Kpi>
            <Kpi label="Chatbots geplant"><Count to={100} seen={seen} prefix="~" /></Kpi>
            <Kpi label="Betrieb"><span className="text-[1.125rem]">On-Premises</span></Kpi>
            <Kpi label="Internet-Zugriff"><span className="text-[1.125rem]">keiner</span></Kpi>
          </KpiGrid>
          <Section title="Chatbots der Behörde" aside="Rollout">
            <div className="grid grid-cols-20 gap-1.5">
              {Array.from({ length: 100 }, (_, i) => (
                <div key={i} className={`aspect-square rounded-[5px] ${motion} duration-500 ${seen ? (i < 14 ? 'bg-primary' : 'bg-primary/20') : 'bg-transparent ring-1 ring-line'}`} style={{ transitionDelay: `${(i % 20 + Math.floor(i / 20)) * 45}ms` }} />
              ))}
            </div>
            <div className="mt-3 flex gap-5 text-muted">
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-[3px] bg-primary" />in Betrieb</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-[3px] bg-primary/20" />geplant</span>
            </div>
          </Section>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}

/** 3 · KI-Kompetenzzentrum */
export function Kompetenz() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const rows: [string, string, number][] = [
    ['Souveräne KI-Plattform', 'aufgebaut', 100],
    ['LLM-gestützte Use Cases', 'erste in Umsetzung', 38],
    ['Weitere Use Cases', 'folgen', 8],
  ]
  return (
    <Surface>
      <div ref={ref}>
        <Win title="Kompetenzzentrum KI · Landesfinanzverwaltung">
          <div className="px-5 py-5 grid gap-5">
            {rows.map(([l, s, p], i) => (
              <div key={l}>
                <div className="mb-2 flex items-center justify-between"><span className="font-medium text-ink">{l}</span><span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-primary text-[0.75rem]">{s}</span></div>
                <Progress pct={p} on={seen} delay={i * 250} />
              </div>
            ))}
          </div>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}

/** 4 · Dokumente erkennen, extrahieren, anonymisieren */
export function Anonymisieren() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!seen) return
    const t = setTimeout(() => setOn(true), 2200)
    return () => clearTimeout(t)
  }, [seen])
  const redact = (t: string) => <span className={`rounded px-0.5 transition-colors duration-500 ${on ? 'bg-ink text-transparent select-none' : 'bg-primary-tint text-ink'}`}>{t}</span>
  return (
    <Surface>
      <div ref={ref}>
        <Win title="Dokumentenverarbeitung · Managed Service">
          <KpiGrid>
            <Kpi label="Anwender in einem Verfahren"><Count to={6000} seen={seen} /></Kpi>
            <Kpi label="Stellenangebote pro Jahr"><Count to={100000} seen={seen} prefix="> " /></Kpi>
            <Kpi label="Verarbeitung"><span className="text-[1.125rem]">produktiv</span></Kpi>
            <Kpi label="Modelle"><span className="text-[1.125rem]">zentral betrieben</span></Kpi>
          </KpiGrid>
          <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Section title="Stellenangebot" aside={on ? 'anonymisiert' : 'erkannt'}>
              <div className="rounded-lg border border-line bg-[#fbf9fc] p-4 leading-[1.9] text-body">
                Wir suchen zum {redact('01.04.')} eine Sachbearbeitung im Bereich Haushalt. Bewerbungen an {redact('Frau Maria Beispiel')}, Telefon {redact('0911 123456')}, {redact('m.beispiel@behoerde.example')}.
              </div>
            </Section>
            <Section title="Extrahierte Felder">
              <ul className="list-none m-0 p-0 flex flex-col gap-2">
                {[['Beruf', 'Sachbearbeitung'], ['Bereich', 'Haushalt'], ['Beginn', '01.04.'], ['Kontakt', on ? 'entfernt' : 'Person, Telefon, E-Mail']].map(([k, v], i) => (
                  <li key={k} className={`flex justify-between gap-3 ${motion}`} style={{ opacity: seen ? 1 : 0, transitionDelay: `${900 + i * 250}ms` }}><span className="text-muted">{k}</span><span className="text-ink text-right">{v}</span></li>
                ))}
              </ul>
            </Section>
          </div>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}

/** 5 · Datenanalyse und KI für die Finanzkontrolle */
export function Finanzkontrolle() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const lanes: [string, number, number][] = [
    ['Datenanalysen für Prüfungsvorhaben', 0, 100],
    ['DaSense in der Cloud', 0, 55],
    ['DaSense auf eigener Infrastruktur', 55, 45],
    ['LLM-gestützter Text-Checker', 40, 60],
    ['Vorgehensmodell zur Prüfung von KI-Verfahren', 60, 40],
  ]
  return (
    <Surface>
      <div ref={ref}>
        <Win title="Projektverlauf · Oberste Bundesbehörde">
          <KpiGrid>
            <Kpi label="Beratung in Datenanalyse und KI"><Count to={5} seen={seen} suffix=" Jahre" /></Kpi>
            <Kpi label="Start in der"><span className="text-[1.125rem]">Cloud</span></Kpi>
            <Kpi label="Heute"><span className="text-[1.125rem]">eigene Infrastruktur</span></Kpi>
            <Kpi label="Einsatz"><span className="text-[1.125rem]">Finanzkontrolle</span></Kpi>
          </KpiGrid>
          <Section title="Bausteine über fünf Jahre">
            <div className="grid grid-cols-5 text-[0.6875rem] text-muted mb-2">{[1, 2, 3, 4, 5].map((y) => <span key={y} className="border-l border-line pl-1.5">Jahr {y}</span>)}</div>
            <div className="flex flex-col gap-2.5">
              {lanes.map(([l, s, w], i) => (
                <div key={l} className="relative h-8 rounded bg-[#f7f4f8]">
                  <div className={`absolute inset-y-0 box-border flex items-center rounded bg-primary/85 px-2.5 text-white whitespace-nowrap overflow-hidden ${motion} duration-[1400ms]`} style={{ left: `${s}%`, width: seen ? `${w}%` : '0%', transitionDelay: `${i * 220}ms` }}>
                    <span className="truncate">{l}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}

/** 6 · KI-Chatbots im Behördennetz */
export function BehoerdenChat() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const step = (i: number) => ({ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(10px)', transitionDelay: `${i * 900}ms` })
  return (
    <Surface>
      <div ref={ref}>
        <Win title="Fachchat · Behördennetz">
          <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="px-5 py-5 flex flex-col gap-3">
              <div className={`self-end max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-white ${motion}`} style={step(0)}>Welche Regelung gilt für Dienstreisen ins Ausland?</div>
              <div className={`max-w-[92%] rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3 text-body ${motion}`} style={step(1)}>
                Auslandsdienstreisen sind vorab zu genehmigen. Die Erstattung richtet sich nach dem Zielland. Grundlage sind die interne Dienstreiseregelung und das Rundschreiben des Hauses.
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {['Dienstreiseregelung · Stufe 1', 'Rundschreiben 14/2 · Stufe 2'].map((q) => <span key={q} className="rounded-md bg-primary-tint px-2 py-0.5 text-[0.75rem] text-primary">{q}</span>)}
                </div>
              </div>
              <div className={`text-[0.75rem] text-muted ${motion}`} style={step(2)}>Antwort nur aus Quellen, auf die der Fragende Zugriff hat.</div>
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-line px-5 py-5">
              <div className="rounded-lg border-2 border-dashed border-primary/40 p-4">
                <div className="flex items-center gap-2 font-medium text-ink"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>Behördennetz</div>
                <ul className="list-none m-0 mt-3 p-0 flex flex-col gap-2 text-muted">
                  {['Daten mit Vertraulichkeitsstufen', 'Chatbots und Modelle', 'MLOps auf Kubernetes'].map((s, i) => <li key={s} className={motion} style={{ opacity: seen ? 1 : 0, transitionDelay: `${600 + i * 200}ms` }}>{s}</li>)}
                </ul>
              </div>
              <div className="mt-3 flex items-center gap-2 text-muted"><span className="size-2 rounded-full bg-danger" />Verbindung zum öffentlichen Internet: getrennt</div>
            </div>
          </div>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}

/** 7 · Autonomes Fahren */
export function Fahrzeugdaten() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const tracks = [[12, 47, 81], [22, 64], [9, 38, 70, 91], [30, 55], [18, 76], [41, 88]]
  const total = tracks.flat().length
  return (
    <Surface>
      <div ref={ref}>
        <Win title="Fahrzeugdaten · weltweit verteilte Entwicklerteams">
          <KpiGrid>
            <Kpi label="Testdaten aus der Entwicklung"><span className="text-[1.125rem]">Petabyte</span></Kpi>
            <Kpi label="Treffer für „Ruckler“"><Count to={total} seen={seen} /></Kpi>
            <Kpi label="Zusätzliche Testfahrten"><span className="text-[1.125rem]">nicht nötig</span></Kpi>
            <Kpi label="Betrieb"><span className="text-[1.125rem]">Managed Service</span></Kpi>
          </KpiGrid>
          <Section title="Suche über alle Fahrzeuge" aside="Ereignis: Fahrzeug-Ruckler">
            <div className="flex flex-col gap-2">
              {tracks.map((ev, r) => (
                <div key={r} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-muted">Fzg. {r + 1}</span>
                  <div className="relative h-5 flex-1 rounded bg-[#f7f4f8]">
                    {ev.map((x, i) => (
                      <span key={i} className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/20 ${motion} duration-500`} style={{ left: `${x}%`, opacity: seen ? 1 : 0, transform: `translate(-50%,-50%) scale(${seen ? 1 : 0.2})`, transitionDelay: `${700 + (r * 3 + i) * 140}ms` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}

/** 8 · IIoT-Plattform */
export function Produktion() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const [pts, setPts] = useState<number[]>(() => Array.from({ length: 40 }, (_, i) => 50 + Math.sin(i / 3) * 12))
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setPts((p) => [...p.slice(1), Math.max(18, Math.min(82, p[p.length - 1] + (Math.random() - 0.5) * 16))]), 600)
    return () => clearInterval(id)
  }, [seen])
  const path = pts.map((y, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * 400},${100 - y}`).join(' ')
  const last = pts[pts.length - 1]
  return (
    <Surface>
      <div ref={ref}>
        <Win title="IIoT-Plattform · Produktion">
          <KpiGrid>
            <Kpi label="Vibration"><Count to={last / 10} seen={seen} decimals={1} suffix=" mm/s" dur={400} /></Kpi>
            <Kpi label="Temperatur"><Count to={60 + last / 6} seen={seen} decimals={1} suffix=" °C" dur={400} /></Kpi>
            <Kpi label="Zustand"><span className="inline-flex items-center gap-2 text-[1.125rem]"><span className="size-2.5 rounded-full bg-[#28c840]" />unauffällig</span></Kpi>
            <Kpi label="Dashboards"><span className="text-[1.125rem]">jeden Morgen aktuell</span></Kpi>
          </KpiGrid>
          <Section title="Streaming aus der Fertigung" aside="Condition Monitoring">
            <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="block w-full h-32 overflow-visible" aria-hidden="true">
              <path d={`${path} L400,100 L0,100 Z`} fill="var(--color-primary)" opacity="0.08" />
              <path d={path} fill="none" stroke="var(--color-primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
          </Section>
          <div className="grid grid-cols-4 border-t border-line text-center">
            {['Fertigung', 'Datenlade-strecke', 'Predictive Maintenance', 'Report'].map((s, i) => (
              <div key={s} className={`py-3 px-2 ${i ? 'border-l border-line' : ''}`}><div className="text-ink">{s.replace('-', '')}</div><div className="mt-0.5 inline-flex items-center gap-1.5 text-muted"><span className="size-1.5 rounded-full bg-[#28c840]" />aktiv</div></div>
            ))}
          </div>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}

/** 9 · eDiscovery und Due Diligence in der Großkanzlei */
export function DueDiligence() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const formats: [string, number][] = [['E-Mail-Archive', 92], ['PDF', 74], ['Word', 51], ['Excel', 33]]
  return (
    <Surface>
      <div ref={ref}>
        <Win title="Due Diligence · Großkanzlei">
          <KpiGrid>
            <Kpi label="Daten analysiert"><Count to={40} seen={seen} suffix="+ TB" /></Kpi>
            <Kpi label="Dokumente"><span className="text-[1.125rem]">Millionen</span></Kpi>
            <Kpi label="Quellen"><span className="text-[1.125rem]">Word · PDF · Excel · Mail</span></Kpi>
            <Kpi label="Ergebnis"><span className="text-[1.125rem]">automatischer Bericht</span></Kpi>
          </KpiGrid>
          <div className="grid lg:grid-cols-2">
            <Section title="Indexiert nach Format">
              <div className="flex flex-col gap-3">
                {formats.map(([l, p], i) => (
                  <div key={l}><div className="mb-1 flex justify-between"><span>{l}</span></div><Progress pct={p} on={seen} delay={i * 200} /></div>
                ))}
              </div>
            </Section>
            <Section title="Gefundene Passage" aside="trainierbare KI">
              <div className="rounded-lg border border-line bg-[#fbf9fc] p-4 leading-[1.7] text-body">
                … die Gegenpartei ist berechtigt, den Vertrag bei einem <mark className={`rounded px-0.5 text-ink transition-colors duration-700 ${seen ? 'bg-[#fde9a8]' : 'bg-transparent'}`} style={{ transitionDelay: '1200ms' }}>Kontrollwechsel ohne Frist zu kündigen</mark> und bereits gezahlte Entgelte zurückzufordern …
              </div>
              <div className="mt-3 flex items-center gap-2 text-primary"><span className="rounded-full bg-primary-tint px-2.5 py-0.5">nachteilige Vertragsklausel</span><span className="text-muted">→ in den Bericht übernommen</span></div>
            </Section>
          </div>
        </Win>
        <Illustrative />
      </div>
    </Surface>
  )
}
