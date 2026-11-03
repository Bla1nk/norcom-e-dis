import { t } from '../lib/i18n'
// Zielgruppen und ihre Unterseiten. Je Zielgruppe eine passende App der Plattform mit Clip aus public/videos.
// TEXTE SIND ENTWURF: Funktionsbeschreibungen der Apps vor Veröffentlichung fachlich prüfen.

/** Abschnitt im Aufbau von „So funktioniert es“ (linke Liste, rechts Claim + Text + Fläche). */
export type FlowItem = {
  title: string
  claim: string
  desc: string
  visual: 'collection' | 'video' | 'review' | 'entities' | 'legal-ends' | 'legal-clauses' | 'legal-playbook' | 'legal-small' | 'kanzlei-overview' | 'kanzlei-privilege' | 'kanzlei-small' | 'kanzlei-network' | 'airgap' | 'ds-request' | 'ds-pii' | 'ds-small' | 'ds-breach' | 'fo-flags' | 'fo-money' | 'fo-small' | 'fo-dd' | 'dl-cockpit' | 'dl-sources' | 'dl-tracker' | 'dl-small' | 'dl-capacity' | 'dl-cost' | 'be-tree' | 'be-prio' | 'be-small' | 'be-media'
  /** Clip in public/videos/<video>.mp4 (bei video und review) */
  video?: string
}

export type Case = {
  slug: string
  /** Name der Zielgruppe */
  title: string
  /** Schlüssel des Strichsymbols (CaseIcons) */
  icon: string
  text: string
  tags: string[]
  claim: string
  lede: string
  app: {
    name: string
    tagline: string
    text: string
    /** Clip in public/videos/<video>.mp4 (+ -poster.jpg) */
    video: string
    points: { title: string; text: string }[]
  }
  steps: { title: string; text: string }[]
  /** Wenn gesetzt, zeigt die Unterseite diesen Ablauf statt App-Block und Schritte. */
  flow?: FlowItem[]
}

export const CASES: Case[] = [
  {
    slug: 'kanzleien',
    title: t('Kanzleien', 'Law firms'),
    icon: 'kanzlei',
    text: t('Große Dokumentenbestände in Streitverfahren früh einschätzen und gezielt prüfen.', 'Assess large document collections in disputes early and review them with focus.'),
    tags: [t('Litigation & Schiedsverfahren', 'Litigation & arbitration'), t('Kartellverfahren', 'Antitrust proceedings'), 'Early Case Assessment'],
    claim: t('Den Fall verstehen, bevor die Prüfung beginnt.', 'Understand the case before review begins.'),
    lede: t('In Streit- und Kartellverfahren liegen schnell Millionen Dokumente vor. DaSense ordnet den Bestand vor der ersten Sichtung, damit Ihr Team gezielt prüft statt alles zu lesen.', 'Disputes and antitrust proceedings quickly involve millions of documents. DaSense organizes the collection before the first review, so your team reviews with focus instead of reading everything.'),
    app: {
      name: 'Smart Filter',
      tagline: t('Eigene Filter in eigenen Worten.', 'Your own filters, in your own words.'),
      text: t('Sie beschreiben, welche Dokumente Sie suchen. Die lokale KI ordnet den Bestand danach und legt daraus einen Filter an, den das ganze Team nutzt.', 'You describe which documents you are looking for. The local AI sorts the collection accordingly and creates a filter the whole team can use.'),
      video: 'review',
      points: [
        { title: t('Frage statt Suchbegriff', 'A question instead of a keyword'), text: t('Auch Sachverhalte lassen sich als Filter beschreiben, nicht nur Wörter.', 'Describe facts and circumstances as a filter, not just words.') },
        { title: t('Ein Filter für das Team', 'One filter for the team'), text: t('Alle prüfen mit derselben Einordnung und sehen dieselben Treffer.', 'Everyone reviews with the same classification and sees the same hits.') },
        { title: t('Lokal und kombinierbar', 'Local and combinable'), text: t('Die KI läuft in Ihrer Umgebung und lässt sich mit der klassischen Suche verbinden.', 'The AI runs in your environment and can be combined with classic search.') },
      ],
    },
    steps: [
      { title: t('Bestand einlesen', 'Ingest the collection'), text: t('Postfächer, Fileshares und Chats werden parallel eingelesen und für die KI aufbereitet.', 'Mailboxes, file shares and chats are ingested in parallel and prepared for the AI.') },
      { title: t('Fragen als Filter anlegen', 'Turn questions into filters'), text: t('Aus den Fragen des Falls entstehen Filter, mit denen sich der Bestand eingrenzen lässt.', 'The questions of the case become filters that narrow down the collection.') },
      { title: t('Gezielt prüfen', 'Review with focus'), text: t('Das Team sichtet die relevanten Treffer und übergibt das Ergebnis an das Verfahren.', 'The team reviews the relevant hits and hands the result over to the proceedings.') },
    ],
    flow: [
      {
        title: t('Fall-Überblick', 'Case overview'),
        claim: t('Am ersten Tag wissen, worum es geht.', 'Know what it is about on day one.'),
        desc: t('Themen, Zeiträume und Schlüsseldokumente auf einen Blick. DaSense zeigt, wann welche Themen im Bestand auftauchen, damit Sie den Fall früh einschätzen können.', 'Topics, time periods and key documents at a glance. DaSense shows when which topics appear in the collection, so you can assess the case early.'),
        visual: 'kanzlei-overview',
      },
      {
        title: t('Privilegien', 'Privilege'),
        claim: t('Anwaltspost sicher aussortieren.', 'Reliably set aside attorney correspondence.'),
        desc: t('Die KI erkennt Korrespondenz mit Anwälten und markiert sie samt Begründung. Ihr Team bestätigt, alles andere geht direkt in die Prüfung.', 'The AI detects correspondence with attorneys and flags it with a rationale. Your team confirms, everything else goes straight into review.'),
        visual: 'kanzlei-privilege',
      },
      {
        title: t('Außerdem', 'Also'),
        claim: t('Weniger lesen, sauber übergeben.', 'Read less, hand over cleanly.'),
        desc: t('Dubletten verschwinden aus der Prüfung, und jede Produktion erhält eine durchgehende Nummerierung.', 'Duplicates drop out of review, and every production gets continuous numbering.'),
        visual: 'kanzlei-small',
      },
      {
        title: t('Kontaktnetz', 'Contact network'),
        claim: t('Wer sprach wann mit wem?', 'Who spoke to whom, and when?'),
        desc: t('Das Kontaktnetz zeigt Kommunikation zwischen Personen und Unternehmen im Zeitverlauf. Mit dem Zeitregler sehen Sie, wann Kontakte zwischen Wettbewerbern entstehen.', 'The contact network shows communication between people and companies over time. With the time slider you see when contacts between competitors arise.'),
        visual: 'kanzlei-network',
      },
      {
        title: t('Air-gapped', 'Air-gapped'),
        claim: t('Vollständig abgeschottet.', 'Fully isolated.'),
        desc: t('DaSense und die KI laufen in Ihrem eigenen Netz, auch ohne jede Verbindung nach außen. Mandatsgeheimnis und Beweismaterial verlassen die Kanzlei nicht.', 'DaSense and the AI run in your own network, even with no outside connection at all. Attorney-client privilege and evidence never leave the law firm.'),
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'compliance',
    title: t('Rechtsabteilungen & Compliance', 'Legal departments & compliance'),
    icon: 'analysis',
    text: t('Vertragsfristen, Klauseln und Abweichungen im Griff behalten, interne Untersuchungen vertraulich führen und Behördenanfragen fristgerecht beantworten.', 'Stay on top of contract deadlines, clauses and deviations, run internal investigations confidentially and answer regulatory requests on time.'),
    tags: [t('Vertragsfristen', 'Contract deadlines'), t('Klauselprüfung', 'Clause review'), t('Behördenanfragen', 'Regulatory requests')],
    claim: t('Jeden Vertrag kennen. Jede Frist im Griff.', 'Know every contract. Control every deadline.'),
    lede: t('Verträge liegen verstreut in Postfächern und Ablagen. DaSense liest sie aus, erkennt Klauseln und meldet, was wann endet, damit keine Frist mehr unbemerkt verstreicht.', 'Contracts are scattered across mailboxes and repositories. DaSense extracts them, detects clauses and reports what ends when, so no deadline passes unnoticed again.'),
    app: {
      name: 'AI Report',
      tagline: t('Der Bericht zur Person oder zum Vorgang.', 'The report on a person or a matter.'),
      text: t('Der AI Report fasst zusammen, was der Bestand zu einer Person oder einem Vorgang enthält, und nennt zu jeder Aussage die Quelle.', 'The AI Report summarizes what the collection contains about a person or a matter, and cites the source for every statement.'),
      video: 'production',
      points: [
        { title: t('Bericht per Knopfdruck', 'Report at the push of a button'), text: t('Aus vielen Dokumenten wird ein strukturierter Überblick.', 'Many documents become one structured overview.') },
        { title: t('Jede Aussage mit Quelle', 'Every statement with its source'), text: t('Sie springen von der Zusammenfassung direkt ins Originaldokument.', 'Jump from the summary straight into the original document.') },
        { title: t('Vertraulich getrennt', 'Kept confidential and separate'), text: t('Sensible Dokumente lassen sich als eigene Facette abgrenzen.', 'Sensitive documents can be set apart as their own facet.') },
      ],
    },
    steps: [
      { title: t('Hinweis aufnehmen', 'Take in the tip-off'), text: t('Relevante Postfächer und Ablagen werden eingelesen, ohne dass Daten das Haus verlassen.', 'Relevant mailboxes and repositories are ingested without any data leaving your premises.') },
      { title: t('Bestand eingrenzen', 'Narrow down the collection'), text: t('Personen, Zeiträume und Themen grenzen den Fall ein.', 'People, time periods and topics narrow down the case.') },
      { title: t('Bericht erstellen', 'Create the report'), text: t('Das Ergebnis geht als Bericht mit Quellen an die Geschäftsleitung oder die Behörde.', 'The result goes to management or the authority as a report with sources.') },
    ],
    flow: [
      {
        title: t('Vertragsenden', 'Contract expiries'),
        claim: t('Wissen, wann Verträge enden.', 'Know when contracts end.'),
        desc: t('DaSense liest Laufzeit, Enddatum und Kündigungsfrist aus den Verträgen und zeigt, was in den nächsten Monaten ausläuft, bevor eine Frist verstreicht.', 'DaSense extracts term, end date and notice period from the contracts and shows what expires in the coming months, before a deadline passes.'),
        visual: 'legal-ends',
      },
      {
        title: t('Klauselerkennung', 'Clause detection'),
        claim: t('Jede Klausel gefunden.', 'Every clause found.'),
        desc: t('Die KI markiert im Vertrag Kündigung, Haftung, Kontrollwechsel und mehr, und zeigt, wie oft jede Klausel im ganzen Bestand vorkommt.', 'The AI flags termination, liability, change of control and more in the contract, and shows how often each clause occurs across the entire collection.'),
        visual: 'legal-clauses',
      },
      {
        title: t('Außerdem', 'Also'),
        claim: t('Nichts vergessen, nichts doppelt prüfen.', 'Forget nothing, review nothing twice.'),
        desc: t('Zwei Helfer laufen im Hintergrund mit: Erinnerungen vor jeder Frist und die Zuordnung von Nachträgen zum Hauptvertrag.', 'Two helpers run in the background: reminders before every deadline and the assignment of amendments to the master agreement.'),
        visual: 'legal-small',
      },
      {
        title: t('Abweichungen', 'Deviations'),
        claim: t('Abweichungen vom Standard sofort sehen.', 'See deviations from the standard instantly.'),
        desc: t('Jeder Vertrag wird Klausel für Klausel gegen Ihr Playbook geprüft. Sie sehen auf einen Blick, wo er vom Standard abweicht, und lesen die Fundstelle direkt daneben.', 'Every contract is checked clause by clause against your playbook. You see at a glance where it deviates from the standard and read the passage right next to it.'),
        visual: 'legal-playbook',
      },
      {
        title: t('Air-gapped', 'Air-gapped'),
        claim: t('Vollständig abgeschottet.', 'Fully isolated.'),
        desc: t('DaSense und die KI laufen in Ihrem eigenen Netz, auch ohne jede Verbindung nach außen. Vertragsdaten und Rechtsrat verlassen das Haus nicht.', 'DaSense and the AI run in your own network, even with no outside connection at all. Contract data and legal advice never leave your premises.'),
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'datenschutz',
    title: t('Datenschutz & IT-Security', 'Data protection & IT security'),
    icon: 'processing',
    text: t('Personenbezogene Daten systemübergreifend finden, schnell und nachweisbar.', 'Find personal data across all systems, fast and verifiably.'),
    tags: [t('DSGVO-Auskunftsersuchen', 'GDPR access requests'), 'Incident Response', t('Betroffene nach Datenpanne ermitteln', 'Identify data subjects after a breach')],
    claim: t('Personenbezogene Daten finden. Überall.', 'Find personal data. Everywhere.'),
    lede: t('Bei einem Auskunftsersuchen oder nach einer Datenpanne müssen Sie schnell wissen, wer betroffen ist und wo die Daten liegen, quer durch alle Systeme.', 'With an access request or after a data breach, you need to know quickly who is affected and where the data resides, across all systems.'),
    app: {
      name: t('Entitäten', 'Entities'),
      tagline: t('Personen, Orte und Kennungen auf einen Blick.', 'People, places and identifiers at a glance.'),
      text: t('Die App erkennt Personen, Organisationen, Orte und Kennungen in den Dokumenten und macht sie filterbar, auf Deutsch und Englisch.', 'The app detects people, organizations, places and identifiers in the documents and makes them filterable, in German and English.'),
      video: 'analysis',
      points: [
        { title: t('Betroffene identifizieren', 'Identify data subjects'), text: t('Namen und Kennungen werden aus dem Fließtext gezogen.', 'Names and identifiers are pulled from running text.') },
        { title: t('Nach Entität filtern', 'Filter by entity'), text: t('Ein Klick zeigt alle Dokumente, in denen eine Person vorkommt.', 'One click shows all documents in which a person appears.') },
        { title: t('Zwei Sprachen', 'Two languages'), text: t('Deutsche und englische Dokumente werden gemeinsam ausgewertet.', 'German and English documents are analyzed together.') },
      ],
    },
    steps: [
      { title: t('Betroffene festlegen', 'Define data subjects'), text: t('Sie definieren die Person oder den Kreis der Betroffenen.', 'You define the person or the group of data subjects.') },
      { title: t('Fundstellen sammeln', 'Collect findings'), text: t('DaSense findet Dokumente in Postfächern, Ablagen und Chats gleichermaßen.', 'DaSense finds documents in mailboxes, repositories and chats alike.') },
      { title: t('Nachweisbar dokumentieren', 'Document verifiably'), text: t('Die Fundstellen lassen sich exportieren und für Auskunft oder Meldung belegen.', 'Findings can be exported and used as evidence for disclosure or notification.') },
    ],
    flow: [
      {
        title: t('Auskunftsersuchen', 'Access request'),
        claim: t('Jede Fundstelle zu einer Person.', 'Every finding for a person.'),
        desc: t('Postfächer, Fileshares, Chats und Backups werden gemeinsam durchsucht. Sie sehen alle Treffer nach Quelle und die laufende Frist, bis das Auskunftspaket bereit ist.', 'Mailboxes, file shares, chats and backups are searched together. You see all hits by source and the running deadline until the disclosure package is ready.'),
        visual: 'ds-request',
      },
      {
        title: t('Schwärzung', 'Redaction'),
        claim: t('Personenbezogene Daten erkannt.', 'Personal data detected.'),
        desc: t('Namen, Kontaktdaten, IBAN und besondere Kategorien wie Gesundheitsdaten werden im Dokument markiert und auf Wunsch geschwärzt.', 'Names, contact details, IBANs and special categories such as health data are flagged in the document and redacted on request.'),
        visual: 'ds-pii',
      },
      {
        title: t('Außerdem', 'Also'),
        claim: t('Fristen halten, Zugriffe belegen.', 'Meet deadlines, prove access.'),
        desc: t('Löschfristen laufen automatisch mit, und jeder Zugriff auf Daten wird protokolliert.', 'Retention and deletion periods run automatically, and every access to data is logged.'),
        visual: 'ds-small',
      },
      {
        title: t('Datenpanne', 'Data breach'),
        claim: t('Betroffene in Stunden, nicht in Wochen.', 'Affected individuals in hours, not weeks.'),
        desc: t('Nach einem Abfluss ermittelt DaSense, welche Personen betroffen sind, welche Daten und aus welchen Ländern. Die Uhr zur 72-Stunden-Meldung läuft mit.', 'After a leak, DaSense determines which people are affected, which data and from which countries. The clock for the 72-hour notification runs alongside.'),
        visual: 'ds-breach',
      },
      {
        title: t('Air-gapped', 'Air-gapped'),
        claim: t('Vollständig abgeschottet.', 'Fully isolated.'),
        desc: t('Gerade bei sensiblen Personendaten zählt, dass nichts nach außen geht. DaSense und die KI laufen in Ihrem eigenen Netz, auch ohne Verbindung zum Internet.', 'With sensitive personal data, what matters most is that nothing leaves. DaSense and the AI run in your own network, even without an internet connection.'),
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'forensik',
    title: t('Forensik & Beratung', 'Forensics & advisory'),
    icon: 'production',
    text: t('Forensik-Teams von Wirtschaftsprüfungen und Beratungen, die Betrugs- und Transaktionsfälle unter Zeitdruck aufklären.', 'Forensic teams at audit and advisory firms who resolve fraud and transaction cases under time pressure.'),
    tags: ['Fraud Investigations', t('M&A Due Diligence', 'M&A due diligence')],
    claim: t('Auffälligkeiten sehen, bevor man sie sucht.', 'See anomalies before you look for them.'),
    lede: t('Unter Zeitdruck hilft ein Überblick über den ganzen Datenraum: Wo häufen sich Verträge, Fristen oder Beteiligte? Von dort geht es direkt zum Beleg.', 'Under time pressure, an overview of the entire data room helps: where do contracts, deadlines or parties cluster? From there it goes straight to the evidence.'),
    app: {
      name: 'Dashboard',
      tagline: t('Kennzahlen direkt aus den Dokumenten.', 'Metrics straight from the documents.'),
      text: t('Das Dashboard zeigt Kennzahlen und Verteilungen aus dem Bestand, etwa Vertragsenden je Monat, und führt mit einem Klick zu den zugrunde liegenden Dokumenten.', 'The dashboard shows metrics and distributions from the collection, such as contract expiries per month, and leads with one click to the underlying documents.'),
      video: 'kanzlei',
      points: [
        { title: t('Vom Diagramm zum Beleg', 'From chart to evidence'), text: t('Jede Zahl lässt sich bis zum Dokument zurückverfolgen.', 'Every number can be traced back to the document.') },
        { title: t('Fristen im Blick', 'Deadlines in view'), text: t('Enddaten und Kündigungsfristen werden aus den Verträgen gelesen.', 'End dates and notice periods are extracted from the contracts.') },
        { title: t('Für Due Diligence', 'Built for due diligence'), text: t('Ein Datenraum wird in Minuten zu einer Übersicht, nicht zu einem Stapel.', 'A data room becomes an overview in minutes, not a pile.') },
      ],
    },
    steps: [
      { title: t('Datenraum einlesen', 'Ingest the data room'), text: t('Verträge, Mails und Tabellen werden aufbereitet und durchsuchbar.', 'Contracts, emails and spreadsheets are processed and become searchable.') },
      { title: t('Auffälligkeiten sichtbar machen', 'Surface anomalies'), text: t('Das Dashboard zeigt Häufungen, Fristen und Ausreißer.', 'The dashboard shows clusters, deadlines and outliers.') },
      { title: t('Belege prüfen', 'Verify the evidence'), text: t('Das Team verfolgt jede Auffälligkeit bis zur Quelle und berichtet.', 'The team traces every anomaly to its source and reports.') },
    ],
    flow: [
      {
        title: 'Red Flags',
        claim: t('Warnzeichen finden, bevor man sie sucht.', 'Find warning signs before you look for them.'),
        desc: t('Die KI sucht nach typischen Mustern wie Eilüberweisungen, Barzahlungen oder umgangenen Freigaben und zeigt Fundstellen nach Kategorie.', 'The AI looks for typical patterns such as rush transfers, cash payments or bypassed approvals and shows findings by category.'),
        visual: 'fo-flags',
      },
      {
        title: t('Geldflüsse', 'Money flows'),
        claim: t('Dem Geld folgen.', 'Follow the money.'),
        desc: t('Aus Rechnungen, Mails und Belegen werden Zahlungswege rekonstruiert. Sie sehen, über welche Stationen Geld läuft und wo ein Kreislauf entsteht.', 'Payment paths are reconstructed from invoices, emails and receipts. You see which stops the money passes through and where a circular flow emerges.'),
        visual: 'fo-money',
      },
      {
        title: t('Außerdem', 'Also'),
        claim: t('Weniger Rauschen, klarere Chronologie.', 'Less noise, clearer chronology.'),
        desc: t('Namen in verschiedenen Schreibweisen werden zusammengeführt, und alle Ereignisse eines Vorgangs stehen auf einer Zeitleiste.', 'Names in different spellings are merged, and all events of a matter appear on one timeline.'),
        visual: 'fo-small',
      },
      {
        title: t('Due Diligence', 'Due diligence'),
        claim: t('Vertragsrisiken im Datenraum auf einen Blick.', 'Contract risks in the data room at a glance.'),
        desc: t('Eine Risikomatrix zeigt, wo im Datenraum Change-of-Control-Klauseln, lange Laufzeiten oder unbegrenzte Haftung stecken, und führt direkt zu den Verträgen.', 'A risk matrix shows where the data room contains change-of-control clauses, long terms or unlimited liability, and leads directly to the contracts.'),
        visual: 'fo-dd',
      },
      {
        title: t('Air-gapped', 'Air-gapped'),
        claim: t('Vollständig abgeschottet.', 'Fully isolated.'),
        desc: t('Fraud- und Transaktionsdaten sind hochsensibel. DaSense und die KI laufen in Ihrem eigenen Netz, auch ohne Verbindung nach außen. Ermittlungsdaten verlassen den Datenraum nicht.', 'Fraud and transaction data are highly sensitive. DaSense and the AI run in your own network, even with no outside connection. Investigation data never leaves the data room.'),
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'dienstleister',
    title: t('eDiscovery-Dienstleister', 'eDiscovery service providers'),
    icon: 'collection',
    text: t('Litigation-Support-Anbieter, die KI-gestützte Auswertung als eigenen Service für ihre Mandanten anbieten wollen.', 'Litigation support providers who want to offer AI-assisted analysis as their own service to their clients.'),
    // INTERN ZU PRÜFEN: Mandantenfähigkeit technisch bestätigen; erst danach als Merkmal ergänzen.
    tags: [t('Eigenes Rechenzentrum', 'Own data center')],
    claim: t('KI-Auswertung als eigener Service.', 'AI analysis as your own service.'),
    lede: t('Als Dienstleister betreiben Sie DaSense in Ihrem Rechenzentrum und bieten Ihren Mandanten Auswertung mit lokaler KI an, ohne deren Daten aus der Hand zu geben.', 'As a service provider you run DaSense in your data center and offer your clients analysis with local AI, without giving up control of their data.'),
    app: {
      name: 'Ingest-Cockpit',
      tagline: t('Einlesen im Blick, von der Anlieferung bis zur Suche.', 'Ingestion in view, from delivery to search.'),
      text: t('Das Cockpit startet und überwacht das Einlesen und die Vektorisierung in einer Weboberfläche mit Live-Ansicht und Anmeldung per SSO.', 'The cockpit starts and monitors ingestion and vectorization in a web interface with a live view and SSO sign-in.'),
      video: 'collection',
      points: [
        { title: t('Live-Ansicht', 'Live view'), text: t('Sie sehen, wie weit das Einlesen ist, und erkennen Engpässe sofort.', 'You see how far ingestion has progressed and spot bottlenecks immediately.') },
        { title: t('Anmeldung per SSO', 'SSO sign-in'), text: t('Zugang über Ihr bestehendes Identitätssystem.', 'Access through your existing identity system.') },
        { title: t('Bereit für KI-Suche', 'Ready for AI search'), text: t('Parallel zum Einlesen können Inhalte für die KI vektorisiert werden.', 'Content can be vectorized for the AI in parallel with ingestion.') },
      ],
    },
    steps: [
      { title: t('Daten anliefern', 'Deliver data'), text: t('Mandantendaten kommen aus Postfächern, Fileshares und Backups.', 'Client data comes from mailboxes, file shares and backups.') },
      { title: t('Einlesen überwachen', 'Monitor ingestion'), text: t('Das Cockpit zeigt Fortschritt und Fehler laufend an.', 'The cockpit continuously shows progress and errors.') },
      { title: t('Auswertung bereitstellen', 'Provide the analysis'), text: t('Ihre Teams oder Mandanten arbeiten mit Suche, Filtern und KI-Apps.', 'Your teams or clients work with search, filters and AI apps.') },
    ],
    flow: [
      {
        title: 'Ingest-Cockpit',
        claim: t('Vom Datenträger bis zur Suche, ohne Skripte.', 'From storage media to search, without scripts.'),
        desc: t('Das Ingest-Cockpit startet und überwacht jeden Ablauf in einer Weboberfläche: Ordner mit Status, Live-Pipeline, Fehler-Queue und ein Protokoll, das jeden Start mit Nutzer, Zeit und Begründung festhält.', 'The Ingest Cockpit starts and monitors every run in a web interface: folders with status, live pipeline, error queue and a log that records every start with user, time and reason.'),
        visual: 'dl-cockpit',
      },
      {
        title: t('Datenquellen', 'Data sources'),
        claim: t('Daten holen, wo sie liegen.', 'Fetch data where it lives.'),
        desc: t('Microsoft 365, Slack, S3-Speicher und Dateiserver lassen sich direkt anbinden. Verschlüsselte Dateien öffnet das Cockpit mit den hinterlegten Schlüsseln, ohne sie je wieder anzuzeigen.', 'Microsoft 365, Slack, S3 storage and file servers connect directly. The cockpit opens encrypted files with the stored keys, without ever displaying them again.'),
        visual: 'dl-sources',
      },
      {
        title: t('Live-Tracker', 'Live tracker'),
        claim: t('Wissen, wie lange es noch dauert.', 'Know how much longer it takes.'),
        desc: t('Jeder laufende Ablauf zeigt Fortschritt, Durchsatz und die voraussichtliche Restzeit samt Uhrzeit der Fertigstellung, für mehrere Mandate gleichzeitig. So halten Sie Zusagen an Ihre Mandanten.', 'Every running job shows progress, throughput and the estimated remaining time including the completion time, for several matters at once. That way you keep your commitments to your clients.'),
        visual: 'dl-tracker',
      },
      {
        title: t('Außerdem', 'Also'),
        claim: t('Berichte und Rechte, ohne Handarbeit.', 'Reports and permissions, without manual work.'),
        desc: t('Der Statusbericht für Ihren Mandanten entsteht aus den laufenden Zahlen, und Rechte lassen sich je Projekt festlegen.', 'The status report for your client is generated from the live numbers, and permissions can be set per project.'),
        visual: 'dl-small',
      },
      {
        title: t('Review-Steuerung', 'Review management'),
        claim: t('Wissen, wann das Team fertig ist.', 'Know when the team will be done.'),
        desc: t('DaSense rechnet aus dem Durchsatz Ihrer Prüfer die voraussichtliche Fertigstellung hoch. Mit mehr Prüfern sehen Sie sofort, was sich ändert.', 'DaSense projects the estimated completion from your reviewers\' throughput. With more reviewers you immediately see what changes.'),
        visual: 'dl-capacity',
      },
      {
        title: t('Angebot', 'Quote'),
        claim: t('Vor dem Angebot rechnen.', 'Run the numbers before you quote.'),
        desc: t('Aus dem Datenvolumen ergibt sich eine Beispielrechnung für Dokumente und Prüfzeit, mit und ohne KI-Priorisierung.', 'The data volume yields a sample calculation for documents and review time, with and without AI prioritization.'),
        visual: 'dl-cost',
      },
      {
        title: t('Air-gapped', 'Air-gapped'),
        claim: t('Vollständig abgeschottet.', 'Fully isolated.'),
        desc: t('Als Dienstleister betreiben Sie DaSense in Ihrem eigenen Rechenzentrum, auf Wunsch abgeschottet ohne Verbindung nach außen. Mandantendaten bleiben bei Ihnen.', 'As a service provider you run DaSense in your own data center, isolated from the outside on request. Client data stays with you.'),
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'behoerden',
    title: t('Behörden & Ermittler', 'Government agencies & investigators'),
    icon: 'hero',
    text: t('Millionen Beweisdateien schneller sichten und priorisieren.', 'Review and prioritize millions of evidence files faster.'),
    tags: [t('Sichergestellte Massendaten', 'Seized bulk data'), t('Aufsichtsverfahren', 'Supervisory proceedings')],
    claim: t('Aus Massendaten wird eine Spur.', 'Bulk data becomes a lead.'),
    lede: t('Sichergestellte Datenträger enthalten Millionen Dateien in hunderten Formaten. DaSense schafft zuerst Überblick und führt Ihr Team dann zu dem, was zählt.', 'Seized storage media contain millions of files in hundreds of formats. DaSense first gives you an overview, then guides your team to what matters.'),
    app: {
      name: t('Suche & Facetten', 'Search & facets'),
      tagline: t('Ein Zugang zu allen Dateien.', 'One gateway to all files.'),
      text: t('Eine Suche über den gesamten Bestand, ergänzt um Facetten nach Dateityp, Ordner und Zeit, mit Ordneransicht für den schnellen Überblick.', 'One search across the entire collection, complemented by facets for file type, folder and time, with a folder view for a quick overview.'),
      video: 'hero',
      points: [
        { title: t('Facetten nach Format, Ordner, Zeit', 'Facets by format, folder, time'), text: t('Der Bestand lässt sich Schritt für Schritt eingrenzen.', 'Narrow down the collection step by step.') },
        { title: t('Ordner-Überblick', 'Folder overview'), text: t('Sie sehen auf einen Blick, wo sich welche Dateien befinden.', 'See at a glance where which files are located.') },
        { title: t('Für große Bestände', 'Built for large collections'), text: t('Gebaut für Datenmengen im Millionenbereich.', 'Built for data volumes in the millions.') },
      ],
    },
    steps: [
      { title: t('Sicherstellung einlesen', 'Ingest the seized data'), text: t('Datenträger und Exporte werden unabhängig vom Format eingelesen.', 'Storage media and exports are ingested regardless of format.') },
      { title: t('Überblick gewinnen', 'Get an overview'), text: t('Ordneransicht und Facetten zeigen, was der Bestand enthält.', 'Folder view and facets show what the collection contains.') },
      { title: t('Priorisieren und weitergeben', 'Prioritize and hand over'), text: t('Relevante Dateien werden markiert und an die Ermittlung übergeben.', 'Relevant files are flagged and handed over to the investigation.') },
    ],
    flow: [
      {
        title: t('Überblick', 'Overview'),
        claim: t('Aus Massendaten wird eine Landkarte.', 'Bulk data becomes a map.'),
        desc: t('Die Ordnerlandkarte zeigt, wo sich wie viele Dateien befinden und woraus sie bestehen. Ein Klick auf einen Bereich zeigt Formate und Anteile.', 'The folder map shows how many files are where and what they consist of. A click on an area shows formats and shares.'),
        visual: 'be-tree',
      },
      {
        title: t('Priorisierung', 'Prioritization'),
        claim: t('Das Wichtigste zuerst.', 'The most important first.'),
        desc: t('Sie legen fest, was zählt, etwa Stichworte, Personenbezug oder Auffälligkeit. DaSense sortiert den Bestand sofort danach.', 'You define what matters, such as keywords, personal data or anomalies. DaSense sorts the collection accordingly right away.'),
        visual: 'be-prio',
      },
      {
        title: t('Außerdem', 'Also'),
        claim: t('Jedes Format, jeder Beweis unverändert.', 'Every format, every piece of evidence unaltered.'),
        desc: t('Über 1.400 Dateiformate werden gelesen, und jede Datei trägt einen Hashwert, der ihre Unversehrtheit belegt.', 'Over 1,400 file formats are read, and every file carries a hash value that proves its integrity.'),
        visual: 'be-small',
      },
      {
        title: t('Audio & Video', 'Audio & video'),
        claim: t('Gesprochenes durchsuchbar.', 'Spoken words, searchable.'),
        desc: t('Aufnahmen werden lokal transkribiert. Sie suchen im Text und springen direkt an die Stelle in der Aufnahme.', 'Recordings are transcribed locally. You search the text and jump straight to the spot in the recording.'),
        visual: 'be-media',
      },
      {
        title: t('Air-gapped', 'Air-gapped'),
        claim: t('Vollständig abgeschottet.', 'Fully isolated.'),
        desc: t('Sichergestellte Daten bleiben im geschützten Netz. DaSense und die KI laufen vollständig ohne Verbindung nach außen.', 'Seized data stays in the protected network. DaSense and the AI run entirely without an outside connection.'),
        visual: 'airgap',
      },
    ],
  },
]
