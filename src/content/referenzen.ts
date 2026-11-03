// Referenzseite, übernommen von norcom.de/referenzen (Stand 03.11.2026). Zahlen und Aussagen vor Veröffentlichung von NorCom freigeben lassen.

export type VisualId = 'ItBetrieb' | 'KiPlattform' | 'Kompetenz' | 'Anonymisieren' | 'Finanzkontrolle' | 'BehoerdenChat' | 'Fahrzeugdaten' | 'Produktion' | 'DueDiligence'

export type RefItem = {
  group: string
  /** Kurzname in der Liste links */
  nav: string
  org: string
  claim: string
  desc: string
  tags: string[]
  visual: VisualId
}

export const REF_HERO = {
  eyebrow: 'Referenzen',
  title: 'Im Einsatz, wo Daten kritisch sind.',
  lede: 'Ausgewählte Projekte aus öffentlicher Verwaltung, Automotive, Industrie, Recht und Compliance – viele davon laufen seit Jahren.',
}

export const REF_ITEMS: RefItem[] = [
  {
    group: 'Bund & Länder',
    nav: 'IT-Großbetrieb',
    org: 'Bundesbehörde',
    claim: 'IT-Großbetrieb für eine Bundesbehörde.',
    desc: 'Als Rahmenvertragshalter in mehreren Losen unterstützen wir den Betrieb von Infrastruktur, Datenbanken, Middleware, Netzen und IT-Sicherheit nach ITIL. Dazu gehören ein Data Warehouse mit mehr als 600 Milliarden Datensätzen und über 100.000 Reports pro Monat für mehr als 5.000 Nutzer.',
    tags: ['Data & Managed Services'],
    visual: 'ItBetrieb',
  },
  {
    group: 'Bund & Länder',
    nav: 'On-Prem-KI-Plattform',
    org: 'Bundesbehörde',
    claim: 'On-Prem-KI-Plattform für eine ganze Behörde.',
    desc: 'Aufbau einer KI-Plattform im eigenen Rechenzentrum, inklusive Infrastruktur für rechenintensive Prozesse. Rund 100 Chatbots sind geplant.',
    tags: ['Individuelle KI-Entwicklung', 'Data & Managed Services'],
    visual: 'KiPlattform',
  },
  {
    group: 'Bund & Länder',
    nav: 'KI-Kompetenzzentrum',
    org: 'Landesfinanzverwaltung',
    claim: 'KI-Kompetenzzentrum für eine Finanzverwaltung.',
    desc: 'Aufbau einer souveränen KI-Plattform und Entwicklung LLM-gestützter Use Cases. Die ersten Use Cases sind bereits in der Umsetzung.',
    tags: ['Individuelle KI-Entwicklung'],
    visual: 'Kompetenz',
  },
  {
    group: 'Bund & Länder',
    nav: 'Dokumente anonymisieren',
    org: 'Bundesbehörde',
    claim: 'KI erkennt, extrahiert und anonymisiert Dokumente.',
    desc: 'Eine zentrale ML- und KI-Plattform als Managed Service. Die Modelle laufen produktiv und verarbeiten allein in einem Verfahren mehrere 100.000 Stellenangebote pro Jahr.',
    tags: ['Individuelle KI-Entwicklung', 'Data & Managed Services'],
    visual: 'Anonymisieren',
  },
  {
    group: 'Bund & Länder',
    nav: 'Finanzkontrolle',
    org: 'Oberste Bundesbehörde',
    claim: 'Datenanalyse und KI für die Finanzkontrolle.',
    desc: 'Datenanalysen für Prüfungsvorhaben, ein LLM-gestützter Text-Checker und ein Vorgehensmodell zur Prüfung von KI-Verfahren. DaSense lief zuerst in der Cloud, dann auf der eigenen Infrastruktur der Behörde.',
    tags: ['Individuelle KI-Entwicklung', 'DaSense'],
    visual: 'Finanzkontrolle',
  },
  {
    group: 'Bund & Länder',
    nav: 'Behörden-Chatbots',
    org: 'Bundesbehörde',
    claim: 'KI-Chatbots im abgeschotteten Behördennetz.',
    desc: 'Chatbots unterstützen Mitarbeitende fachlich – auf Basis heterogener Datenbestände mit unterschiedlichen Vertraulichkeitsstufen. Wir verantworteten Data Engineering, MLOps auf Kubernetes und die laufende Verbesserung der Antwortqualität.',
    tags: ['Individuelle KI-Entwicklung', 'Data & Managed Services'],
    visual: 'BehoerdenChat',
  },
  {
    group: 'Industrie',
    nav: 'Autonomes Fahren',
    org: 'Premium-Automobilhersteller',
    claim: 'Big-Data- und KI-Plattform für autonomes Fahren.',
    desc: 'Wir betreiben DaSense als Managed Service für weltweit verteilte Entwicklerteams. Fahrzeugübergreifende Suchen in vorhandenen Daten sparen Testfahrten, Ereignisse wie Fahrzeug-Ruckler werden automatisch gefunden.',
    tags: ['DaSense', 'Data & Managed Services', 'Individuelle KI-Entwicklung'],
    visual: 'Fahrzeugdaten',
  },
  {
    group: 'Industrie',
    nav: 'IIoT-Produktion',
    org: 'Internationaler Industriehersteller',
    claim: 'IIoT-Plattform für die Produktion.',
    desc: 'Eine hybride Datenplattform mit Streaming aus der Fertigung, Predictive Maintenance und Condition Monitoring. Wir verantworten Datenladestrecken und Reports.',
    tags: ['Data & Managed Services', 'Individuelle KI-Entwicklung'],
    visual: 'Produktion',
  },
  {
    group: 'Recht & Compliance',
    nav: 'eDiscovery & Due Diligence',
    org: 'Großkanzlei',
    claim: 'KI-Plattform für eDiscovery und Due Diligence.',
    desc: 'Dokumente aus Word, PDF, Excel und E-Mail-Archiven werden indexiert und in ihre Bestandteile zerlegt. Eine trainierbare KI findet relevante Passagen, etwa nachteilige Vertragsklauseln, und am Ende entsteht automatisch ein Bericht.',
    tags: ['Individuelle KI-Entwicklung', 'DaSense'],
    visual: 'DueDiligence',
  },
]

/** „Auswahl unserer Kunden“ (norcom.de/referenzen). Logo je Kunde als SVG unter public/images/kunden/<file>.svg; fehlt die Datei, steht der Name als Schriftzug. */
export const CUSTOMERS: { name: string; file: string }[] = [
  { name: 'Bundesrechnungshof', file: 'bundesrechnungshof' },
  { name: 'Bundesagentur für Arbeit', file: 'bundesagentur-fuer-arbeit' },
  { name: 'Mercedes-Benz', file: 'mercedes-benz' },
  { name: 'Audi', file: 'audi' },
  { name: 'BMW', file: 'bmw' },
  { name: 'Mercedes-AMG', file: 'mercedes-amg' },
  { name: 'STIHL', file: 'stihl' },
  { name: 'RTL', file: 'rtl' },
]
