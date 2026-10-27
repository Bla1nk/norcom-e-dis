// Texte aus dem Abschnitt „So funktioniert es“ der Vorlage. Clips aus App-Previews/videos:
// collection = ingest.mp4 3,0–15,333 s mit 2,5-facher Geschwindigkeit, processing = processing-flow.mp4 (dunkles Cockpit-Diagramm, ohne Zoom, 27,7 s),
// review = smartfilter-site.mp4 (mit Herauszoomen auf die ganze App am Ende), analysis = entities.mp4 (NER-Panel „Entitäten“), production = aireport-vertraulich.mp4 (Personenbericht über die 18 Personen auf der Facette „Vertraulich“).

export type Step = { title: string; desc: string; claim: string }

export const STEPS: Step[] = [
  {
    title: 'Collection',
    desc: 'Daten aus Postfächern, Fileshares, Chats und Backups parallel einlesen, egal in welchem Format.',
    claim: 'Millionen Dokumente. Volle Kontrolle.',
  },
  {
    title: 'Processing',
    desc: 'DaSense bereitet Inhalte und Metadaten schon beim Einlesen für die lokale KI auf. So können Suche und Analyse sofort starten.',
    claim: 'Von Rohdaten zu KI-ready.',
  },
  {
    title: 'Review',
    desc: 'Sie wählen, wie Sie arbeiten: klassisch, KI-gestützt oder kombiniert.',
    claim: 'Mensch und KI. Sie entscheiden.',
  },
  {
    title: 'Analysis',
    desc: 'KI-Agenten analysieren Zusammenhänge, erkennen Auffälligkeiten und identifizieren neue Ermittlungsansätze.',
    claim: 'Verborgene Muster und Risiken erkennen.',
  },
  {
    title: 'Production',
    desc: 'Ergebnisse als strukturierte Berichte exportieren und an das Verfahren übergeben.',
    claim: 'Jede Erkenntnis. Mit Quelle.',
  },
]

/** Clip je Schritt in public/videos/<name>.mp4 (+ -poster.jpg), gleiche Reihenfolge wie STEPS. */
export const STEP_VIDEOS = ['collection', 'processing', 'review', 'analysis', 'production']
