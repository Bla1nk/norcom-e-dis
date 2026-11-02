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
    title: 'Kanzleien',
    icon: 'kanzlei',
    text: 'Große Dokumentenbestände in Streitverfahren früh einschätzen und gezielt prüfen.',
    tags: ['Litigation & Schiedsverfahren', 'Kartellverfahren', 'Early Case Assessment'],
    claim: 'Den Fall verstehen, bevor die Prüfung beginnt.',
    lede: 'In Streit- und Kartellverfahren liegen schnell Millionen Dokumente vor. DaSense ordnet den Bestand vor der ersten Sichtung, damit Ihr Team gezielt prüft statt alles zu lesen.',
    app: {
      name: 'Smart Filter',
      tagline: 'Eigene Filter in eigenen Worten.',
      text: 'Sie beschreiben, welche Dokumente Sie suchen. Die lokale KI ordnet den Bestand danach und legt daraus einen Filter an, den das ganze Team nutzt.',
      video: 'review',
      points: [
        { title: 'Frage statt Suchbegriff', text: 'Auch Sachverhalte lassen sich als Filter beschreiben, nicht nur Wörter.' },
        { title: 'Ein Filter für das Team', text: 'Alle prüfen mit derselben Einordnung und sehen dieselben Treffer.' },
        { title: 'Lokal und kombinierbar', text: 'Die KI läuft in Ihrer Umgebung und lässt sich mit der klassischen Suche verbinden.' },
      ],
    },
    steps: [
      { title: 'Bestand einlesen', text: 'Postfächer, Fileshares und Chats werden parallel eingelesen und für die KI aufbereitet.' },
      { title: 'Fragen als Filter anlegen', text: 'Aus den Fragen des Falls entstehen Filter, mit denen sich der Bestand eingrenzen lässt.' },
      { title: 'Gezielt prüfen', text: 'Das Team sichtet die relevanten Treffer und übergibt das Ergebnis an das Verfahren.' },
    ],
    flow: [
      {
        title: 'Fall-Überblick',
        claim: 'Am ersten Tag wissen, worum es geht.',
        desc: 'Themen, Zeiträume und Schlüsseldokumente auf einen Blick. DaSense zeigt, wann welche Themen im Bestand auftauchen, damit Sie den Fall früh einschätzen können.',
        visual: 'kanzlei-overview',
      },
      {
        title: 'Privilegien',
        claim: 'Anwaltspost sicher aussortieren.',
        desc: 'Die KI erkennt Korrespondenz mit Anwälten und markiert sie samt Begründung. Ihr Team bestätigt, alles andere geht direkt in die Prüfung.',
        visual: 'kanzlei-privilege',
      },
      {
        title: 'Außerdem',
        claim: 'Weniger lesen, sauber übergeben.',
        desc: 'Dubletten verschwinden aus der Prüfung, und jede Produktion erhält eine durchgehende Nummerierung.',
        visual: 'kanzlei-small',
      },
      {
        title: 'Kontaktnetz',
        claim: 'Wer sprach wann mit wem?',
        desc: 'Das Kontaktnetz zeigt Kommunikation zwischen Personen und Unternehmen im Zeitverlauf. Mit dem Zeitregler sehen Sie, wann Kontakte zwischen Wettbewerbern entstehen.',
        visual: 'kanzlei-network',
      },
      {
        title: 'Air-gapped',
        claim: 'Vollständig abgeschottet.',
        desc: 'DaSense und die KI laufen in Ihrem eigenen Netz, auch ohne jede Verbindung nach außen. Mandatsgeheimnis und Beweismaterial verlassen die Kanzlei nicht.',
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'compliance',
    title: 'Rechtsabteilungen & Compliance',
    icon: 'analysis',
    text: 'Vertragsfristen, Klauseln und Abweichungen im Griff behalten, interne Untersuchungen vertraulich führen und Behördenanfragen fristgerecht beantworten.',
    tags: ['Vertragsfristen', 'Klauselprüfung', 'Behördenanfragen'],
    claim: 'Jeden Vertrag kennen. Jede Frist im Griff.',
    lede: 'Verträge liegen verstreut in Postfächern und Ablagen. DaSense liest sie aus, erkennt Klauseln und meldet, was wann endet, damit keine Frist mehr unbemerkt verstreicht.',
    app: {
      name: 'AI Report',
      tagline: 'Der Bericht zur Person oder zum Vorgang.',
      text: 'Der AI Report fasst zusammen, was der Bestand zu einer Person oder einem Vorgang enthält, und nennt zu jeder Aussage die Quelle.',
      video: 'production',
      points: [
        { title: 'Bericht per Knopfdruck', text: 'Aus vielen Dokumenten wird ein strukturierter Überblick.' },
        { title: 'Jede Aussage mit Quelle', text: 'Sie springen von der Zusammenfassung direkt ins Originaldokument.' },
        { title: 'Vertraulich getrennt', text: 'Sensible Dokumente lassen sich als eigene Facette abgrenzen.' },
      ],
    },
    steps: [
      { title: 'Hinweis aufnehmen', text: 'Relevante Postfächer und Ablagen werden eingelesen, ohne dass Daten das Haus verlassen.' },
      { title: 'Bestand eingrenzen', text: 'Personen, Zeiträume und Themen grenzen den Fall ein.' },
      { title: 'Bericht erstellen', text: 'Das Ergebnis geht als Bericht mit Quellen an die Geschäftsleitung oder die Behörde.' },
    ],
    flow: [
      {
        title: 'Vertragsenden',
        claim: 'Wissen, wann Verträge enden.',
        desc: 'DaSense liest Laufzeit, Enddatum und Kündigungsfrist aus den Verträgen und zeigt, was in den nächsten Monaten ausläuft, bevor eine Frist verstreicht.',
        visual: 'legal-ends',
      },
      {
        title: 'Klauselerkennung',
        claim: 'Jede Klausel gefunden.',
        desc: 'Die KI markiert im Vertrag Kündigung, Haftung, Kontrollwechsel und mehr, und zeigt, wie oft jede Klausel im ganzen Bestand vorkommt.',
        visual: 'legal-clauses',
      },
      {
        title: 'Außerdem',
        claim: 'Nichts vergessen, nichts doppelt prüfen.',
        desc: 'Zwei Helfer laufen im Hintergrund mit: Erinnerungen vor jeder Frist und die Zuordnung von Nachträgen zum Hauptvertrag.',
        visual: 'legal-small',
      },
      {
        title: 'Abweichungen',
        claim: 'Abweichungen vom Standard sofort sehen.',
        desc: 'Jeder Vertrag wird Klausel für Klausel gegen Ihr Playbook geprüft. Sie sehen auf einen Blick, wo er vom Standard abweicht, und lesen die Fundstelle direkt daneben.',
        visual: 'legal-playbook',
      },
      {
        title: 'Air-gapped',
        claim: 'Vollständig abgeschottet.',
        desc: 'DaSense und die KI laufen in Ihrem eigenen Netz, auch ohne jede Verbindung nach außen. Vertragsdaten und Rechtsrat verlassen das Haus nicht.',
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz & IT-Security',
    icon: 'processing',
    text: 'Personenbezogene Daten systemübergreifend finden, schnell und nachweisbar.',
    tags: ['DSGVO-Auskunftsersuchen', 'Incident Response', 'Betroffene nach Datenpanne ermitteln'],
    claim: 'Personenbezogene Daten finden. Überall.',
    lede: 'Bei einem Auskunftsersuchen oder nach einer Datenpanne müssen Sie schnell wissen, wer betroffen ist und wo die Daten liegen, quer durch alle Systeme.',
    app: {
      name: 'Entitäten',
      tagline: 'Personen, Orte und Kennungen auf einen Blick.',
      text: 'Die App erkennt Personen, Organisationen, Orte und Kennungen in den Dokumenten und macht sie filterbar, auf Deutsch und Englisch.',
      video: 'analysis',
      points: [
        { title: 'Betroffene identifizieren', text: 'Namen und Kennungen werden aus dem Fließtext gezogen.' },
        { title: 'Nach Entität filtern', text: 'Ein Klick zeigt alle Dokumente, in denen eine Person vorkommt.' },
        { title: 'Zwei Sprachen', text: 'Deutsche und englische Dokumente werden gemeinsam ausgewertet.' },
      ],
    },
    steps: [
      { title: 'Betroffene festlegen', text: 'Sie definieren die Person oder den Kreis der Betroffenen.' },
      { title: 'Fundstellen sammeln', text: 'DaSense findet Dokumente in Postfächern, Ablagen und Chats gleichermaßen.' },
      { title: 'Nachweisbar dokumentieren', text: 'Die Fundstellen lassen sich exportieren und für Auskunft oder Meldung belegen.' },
    ],
    flow: [
      {
        title: 'Auskunftsersuchen',
        claim: 'Jede Fundstelle zu einer Person.',
        desc: 'Postfächer, Fileshares, Chats und Backups werden gemeinsam durchsucht. Sie sehen alle Treffer nach Quelle und die laufende Frist, bis das Auskunftspaket bereit ist.',
        visual: 'ds-request',
      },
      {
        title: 'Schwärzung',
        claim: 'Personenbezogene Daten erkannt.',
        desc: 'Namen, Kontaktdaten, IBAN und besondere Kategorien wie Gesundheitsdaten werden im Dokument markiert und auf Wunsch geschwärzt.',
        visual: 'ds-pii',
      },
      {
        title: 'Außerdem',
        claim: 'Fristen halten, Zugriffe belegen.',
        desc: 'Löschfristen laufen automatisch mit, und jeder Zugriff auf Daten wird protokolliert.',
        visual: 'ds-small',
      },
      {
        title: 'Datenpanne',
        claim: 'Betroffene in Stunden, nicht in Wochen.',
        desc: 'Nach einem Abfluss ermittelt DaSense, welche Personen betroffen sind, welche Daten und aus welchen Ländern. Die Uhr zur 72-Stunden-Meldung läuft mit.',
        visual: 'ds-breach',
      },
      {
        title: 'Air-gapped',
        claim: 'Vollständig abgeschottet.',
        desc: 'Gerade bei sensiblen Personendaten zählt, dass nichts nach außen geht. DaSense und die KI laufen in Ihrem eigenen Netz, auch ohne Verbindung zum Internet.',
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'forensik',
    title: 'Forensik & Beratung',
    icon: 'production',
    text: 'Forensik-Teams von Wirtschaftsprüfungen und Beratungen, die Betrugs- und Transaktionsfälle unter Zeitdruck aufklären.',
    tags: ['Fraud Investigations', 'M&A Due Diligence'],
    claim: 'Auffälligkeiten sehen, bevor man sie sucht.',
    lede: 'Unter Zeitdruck hilft ein Überblick über den ganzen Datenraum: Wo häufen sich Verträge, Fristen oder Beteiligte? Von dort geht es direkt zum Beleg.',
    app: {
      name: 'Dashboard',
      tagline: 'Kennzahlen direkt aus den Dokumenten.',
      text: 'Das Dashboard zeigt Kennzahlen und Verteilungen aus dem Bestand, etwa Vertragsenden je Monat, und führt mit einem Klick zu den zugrunde liegenden Dokumenten.',
      video: 'kanzlei',
      points: [
        { title: 'Vom Diagramm zum Beleg', text: 'Jede Zahl lässt sich bis zum Dokument zurückverfolgen.' },
        { title: 'Fristen im Blick', text: 'Enddaten und Kündigungsfristen werden aus den Verträgen gelesen.' },
        { title: 'Für Due Diligence', text: 'Ein Datenraum wird in Minuten zu einer Übersicht, nicht zu einem Stapel.' },
      ],
    },
    steps: [
      { title: 'Datenraum einlesen', text: 'Verträge, Mails und Tabellen werden aufbereitet und durchsuchbar.' },
      { title: 'Auffälligkeiten sichtbar machen', text: 'Das Dashboard zeigt Häufungen, Fristen und Ausreißer.' },
      { title: 'Belege prüfen', text: 'Das Team verfolgt jede Auffälligkeit bis zur Quelle und berichtet.' },
    ],
    flow: [
      {
        title: 'Red Flags',
        claim: 'Warnzeichen finden, bevor man sie sucht.',
        desc: 'Die KI sucht nach typischen Mustern wie Eilüberweisungen, Barzahlungen oder umgangenen Freigaben und zeigt Fundstellen nach Kategorie.',
        visual: 'fo-flags',
      },
      {
        title: 'Geldflüsse',
        claim: 'Dem Geld folgen.',
        desc: 'Aus Rechnungen, Mails und Belegen werden Zahlungswege rekonstruiert. Sie sehen, über welche Stationen Geld läuft und wo ein Kreislauf entsteht.',
        visual: 'fo-money',
      },
      {
        title: 'Außerdem',
        claim: 'Weniger Rauschen, klarere Chronologie.',
        desc: 'Namen in verschiedenen Schreibweisen werden zusammengeführt, und alle Ereignisse eines Vorgangs stehen auf einer Zeitleiste.',
        visual: 'fo-small',
      },
      {
        title: 'Due Diligence',
        claim: 'Vertragsrisiken im Datenraum auf einen Blick.',
        desc: 'Eine Risikomatrix zeigt, wo im Datenraum Change-of-Control-Klauseln, lange Laufzeiten oder unbegrenzte Haftung stecken, und führt direkt zu den Verträgen.',
        visual: 'fo-dd',
      },
      {
        title: 'Air-gapped',
        claim: 'Vollständig abgeschottet.',
        desc: 'Fraud- und Transaktionsdaten sind hochsensibel. DaSense und die KI laufen in Ihrem eigenen Netz, auch ohne Verbindung nach außen. Ermittlungsdaten verlassen den Datenraum nicht.',
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'dienstleister',
    title: 'eDiscovery-Dienstleister',
    icon: 'collection',
    text: 'Litigation-Support-Anbieter, die KI-gestützte Auswertung als eigenen Service für ihre Mandanten anbieten wollen.',
    // INTERN ZU PRÜFEN: Mandantenfähigkeit technisch bestätigen; erst danach als Merkmal ergänzen.
    tags: ['Eigenes Rechenzentrum'],
    claim: 'KI-Auswertung als eigener Service.',
    lede: 'Als Dienstleister betreiben Sie DaSense in Ihrem Rechenzentrum und bieten Ihren Mandanten Auswertung mit lokaler KI an, ohne deren Daten aus der Hand zu geben.',
    app: {
      name: 'Ingest-Cockpit',
      tagline: 'Einlesen im Blick, von der Anlieferung bis zur Suche.',
      text: 'Das Cockpit startet und überwacht das Einlesen und die Vektorisierung in einer Weboberfläche mit Live-Ansicht und Anmeldung per SSO.',
      video: 'collection',
      points: [
        { title: 'Live-Ansicht', text: 'Sie sehen, wie weit das Einlesen ist, und erkennen Engpässe sofort.' },
        { title: 'Anmeldung per SSO', text: 'Zugang über Ihr bestehendes Identitätssystem.' },
        { title: 'Bereit für KI-Suche', text: 'Parallel zum Einlesen können Inhalte für die KI vektorisiert werden.' },
      ],
    },
    steps: [
      { title: 'Daten anliefern', text: 'Mandantendaten kommen aus Postfächern, Fileshares und Backups.' },
      { title: 'Einlesen überwachen', text: 'Das Cockpit zeigt Fortschritt und Fehler laufend an.' },
      { title: 'Auswertung bereitstellen', text: 'Ihre Teams oder Mandanten arbeiten mit Suche, Filtern und KI-Apps.' },
    ],
    flow: [
      {
        title: 'Ingest-Cockpit',
        claim: 'Vom Datenträger bis zur Suche, ohne Skripte.',
        desc: 'Das Ingest-Cockpit startet und überwacht jeden Ablauf in einer Weboberfläche: Ordner mit Status, Live-Pipeline, Fehler-Queue und ein Protokoll, das jeden Start mit Nutzer, Zeit und Begründung festhält.',
        visual: 'dl-cockpit',
      },
      {
        title: 'Datenquellen',
        claim: 'Daten holen, wo sie liegen.',
        desc: 'Microsoft 365, Slack, S3-Speicher und Dateiserver lassen sich direkt anbinden. Verschlüsselte Dateien öffnet das Cockpit mit den hinterlegten Schlüsseln, ohne sie je wieder anzuzeigen.',
        visual: 'dl-sources',
      },
      {
        title: 'Live-Tracker',
        claim: 'Wissen, wie lange es noch dauert.',
        desc: 'Jeder laufende Ablauf zeigt Fortschritt, Durchsatz und die voraussichtliche Restzeit samt Uhrzeit der Fertigstellung, für mehrere Mandate gleichzeitig. So halten Sie Zusagen an Ihre Mandanten.',
        visual: 'dl-tracker',
      },
      {
        title: 'Außerdem',
        claim: 'Berichte und Rechte, ohne Handarbeit.',
        desc: 'Der Statusbericht für Ihren Mandanten entsteht aus den laufenden Zahlen, und Rechte lassen sich je Projekt festlegen.',
        visual: 'dl-small',
      },
      {
        title: 'Review-Steuerung',
        claim: 'Wissen, wann das Team fertig ist.',
        desc: 'DaSense rechnet aus dem Durchsatz Ihrer Prüfer die voraussichtliche Fertigstellung hoch. Mit mehr Prüfern sehen Sie sofort, was sich ändert.',
        visual: 'dl-capacity',
      },
      {
        title: 'Angebot',
        claim: 'Vor dem Angebot rechnen.',
        desc: 'Aus dem Datenvolumen ergibt sich eine Beispielrechnung für Dokumente und Prüfzeit, mit und ohne KI-Priorisierung.',
        visual: 'dl-cost',
      },
      {
        title: 'Air-gapped',
        claim: 'Vollständig abgeschottet.',
        desc: 'Als Dienstleister betreiben Sie DaSense in Ihrem eigenen Rechenzentrum, auf Wunsch abgeschottet ohne Verbindung nach außen. Mandantendaten bleiben bei Ihnen.',
        visual: 'airgap',
      },
    ],
  },
  {
    slug: 'behoerden',
    title: 'Behörden & Ermittler',
    icon: 'hero',
    text: 'Millionen Beweisdateien schneller sichten und priorisieren.',
    tags: ['Sichergestellte Massendaten', 'Aufsichtsverfahren'],
    claim: 'Aus Massendaten wird eine Spur.',
    lede: 'Sichergestellte Datenträger enthalten Millionen Dateien in hunderten Formaten. DaSense schafft zuerst Überblick und führt Ihr Team dann zu dem, was zählt.',
    app: {
      name: 'Suche & Facetten',
      tagline: 'Ein Zugang zu allen Dateien.',
      text: 'Eine Suche über den gesamten Bestand, ergänzt um Facetten nach Dateityp, Ordner und Zeit, mit Ordneransicht für den schnellen Überblick.',
      video: 'hero',
      points: [
        { title: 'Facetten nach Format, Ordner, Zeit', text: 'Der Bestand lässt sich Schritt für Schritt eingrenzen.' },
        { title: 'Ordner-Überblick', text: 'Sie sehen auf einen Blick, wo sich welche Dateien befinden.' },
        { title: 'Für große Bestände', text: 'Gebaut für Datenmengen im Millionenbereich.' },
      ],
    },
    steps: [
      { title: 'Sicherstellung einlesen', text: 'Datenträger und Exporte werden unabhängig vom Format eingelesen.' },
      { title: 'Überblick gewinnen', text: 'Ordneransicht und Facetten zeigen, was der Bestand enthält.' },
      { title: 'Priorisieren und weitergeben', text: 'Relevante Dateien werden markiert und an die Ermittlung übergeben.' },
    ],
    flow: [
      {
        title: 'Überblick',
        claim: 'Aus Massendaten wird eine Landkarte.',
        desc: 'Die Ordnerlandkarte zeigt, wo sich wie viele Dateien befinden und woraus sie bestehen. Ein Klick auf einen Bereich zeigt Formate und Anteile.',
        visual: 'be-tree',
      },
      {
        title: 'Priorisierung',
        claim: 'Das Wichtigste zuerst.',
        desc: 'Sie legen fest, was zählt, etwa Stichworte, Personenbezug oder Auffälligkeit. DaSense sortiert den Bestand sofort danach.',
        visual: 'be-prio',
      },
      {
        title: 'Außerdem',
        claim: 'Jedes Format, jeder Beweis unverändert.',
        desc: 'Über 1.400 Dateiformate werden gelesen, und jede Datei trägt einen Hashwert, der ihre Unversehrtheit belegt.',
        visual: 'be-small',
      },
      {
        title: 'Audio & Video',
        claim: 'Gesprochenes durchsuchbar.',
        desc: 'Aufnahmen werden lokal transkribiert. Sie suchen im Text und springen direkt an die Stelle in der Aufnahme.',
        visual: 'be-media',
      },
      {
        title: 'Air-gapped',
        claim: 'Vollständig abgeschottet.',
        desc: 'Sichergestellte Daten bleiben im geschützten Netz. DaSense und die KI laufen vollständig ohne Verbindung nach außen.',
        visual: 'airgap',
      },
    ],
  },
]
