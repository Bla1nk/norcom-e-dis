import { t } from '../lib/i18n'
// Texte aus dem Abschnitt „So funktioniert es“ der Vorlage. Clips aus App-Previews/videos:
// collection = ingest.mp4 3,0–15,333 s mit 2,5-facher Geschwindigkeit, processing = processing-flow.mp4 (dunkles Cockpit-Diagramm, ohne Zoom, 27,7 s),
// review = smartfilter-site.mp4 (mit Herauszoomen auf die ganze App am Ende), analysis = entities.mp4 (NER-Panel „Entitäten“), production = aireport-vertraulich.mp4 (Personenbericht über die 18 Personen auf der Facette „Vertraulich“).

export type Step = { title: string; desc: string; claim: string }

export const STEPS: Step[] = [
  {
    title: 'Collection',
    desc: t('Daten aus Postfächern, Fileshares, Chats und Backups parallel einlesen, egal in welchem Format.', 'Ingest data from mailboxes, file shares, chats and backups in parallel, whatever the format.'),
    claim: t('Millionen Dokumente. Volle Kontrolle.', 'Millions of documents. Full control.'),
  },
  {
    title: 'Processing',
    desc: t('DaSense bereitet Inhalte und Metadaten schon beim Einlesen für die lokale KI auf. So können Suche und Analyse sofort starten.', 'DaSense prepares content and metadata for local AI as it is ingested, so search and analysis can start right away.'),
    claim: t('Von Rohdaten zu KI-ready.', 'From raw data to AI-ready.'),
  },
  {
    title: 'Review',
    desc: t('Sie wählen, wie Sie arbeiten: klassisch, KI-gestützt oder kombiniert.', 'You choose how you work: classic, AI-assisted or combined.'),
    claim: t('Mensch und KI. Sie entscheiden.', 'Human and AI. You decide.'),
  },
  {
    title: 'Analysis',
    desc: t('KI-Agenten analysieren Zusammenhänge, erkennen Auffälligkeiten und identifizieren neue Ermittlungsansätze.', 'AI agents analyze connections, flag anomalies and identify new investigative leads.'),
    claim: t('Verborgene Muster und Risiken erkennen.', 'Uncover hidden patterns and risks.'),
  },
  {
    title: 'Production',
    desc: t('Ergebnisse als strukturierte Berichte exportieren und an das Verfahren übergeben.', 'Export results as structured reports and hand them over to the proceeding.'),
    claim: t('Jede Erkenntnis. Mit Quelle.', 'Every insight. With its source.'),
  },
]

/** Clip je Schritt in public/videos/<name>.mp4 (+ -poster.jpg), gleiche Reihenfolge wie STEPS. */
export const STEP_VIDEOS = ['collection', 'processing', 'review', 'analysis', 'production']
