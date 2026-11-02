// Beispieldokument und vorbereitete Fragen für die Praxis-Demo. Das Dokument ist frei erfunden
// (keine realen Personen, Unternehmen oder Zitate); Fundstellen verweisen auf Absatz-IDs.

export type Para = { id: string; text: string }

export const DOC = {
  file: 'gespraechsnotiz_branchentreffen.pdf',
  title: 'Gesprächsnotiz Branchentreffen Hamburg',
  from: 'Vertrieb Region Nord',
  initials: 'VN',
  to: 'Geschäftsführung',
  date: 'Mi., 14.03.2001, 16:42',
  paras: [
    { id: 'p1', text: 'Kurze Rückmeldung zum Termin vom 12.03. Die wichtigsten Punkte stehen unten, Details auf Nachfrage.' },
    { id: 'p2', text: 'Am Rande der Branchenmesse in Hamburg fand ein Treffen mit Vertretern von drei Wettbewerbern statt. Anlass war ein allgemeiner Austausch zur Marktlage; teilgenommen haben aus unserem Haus zwei Personen aus dem Vertrieb.' },
    { id: 'p3', text: 'Im Gespräch wurde angedeutet, dass alle Beteiligten ihre Listenpreise zum 1. April anheben wollen. Eine feste Absprache wurde nach meiner Einschätzung nicht getroffen.' },
    { id: 'p4', text: 'Vereinbart wurde, die Entwicklung der Rohstoffkosten gemeinsam zu beobachten und sich nach dem Quartalsabschluss erneut zu treffen.' },
    { id: 'p5', text: 'Unsere interne Kalkulation (Anlage 3) sieht für das zweite Quartal eine Preisanpassung von vier bis sechs Prozent vor.' },
    { id: 'p6', text: 'Bitte diese Notiz nicht weiterleiten und nicht auf dem gemeinsamen Laufwerk ablegen.' },
    { id: 'p7', text: 'Offen ist, ob die Rechtsabteilung über die Gesprächsinhalte informiert werden soll. Entscheidung bis 20.03.' },
    { id: 'p8', text: 'Die Kosten für Messestand und Reise betrugen 18.400 Euro und werden dem Budget Marketing belastet.' },
    { id: 'p9', text: 'Ein Folgetermin ist voraussichtlich Mitte Juli vorgesehen. Ich melde mich, sobald ein Datum feststeht.' },
    { id: 'p10', text: 'Anlagen: (1) Messeprogramm, (2) Teilnehmerliste, (3) Kalkulation Q2.' },
  ] satisfies Para[],
}

export type Part = string | { src: number }
export type Source = { n: number; para: string; label: string }
export type QA = {
  id: string
  /** Vorschlag-Chip */
  chip: string
  question: string
  keywords: RegExp
  steps: string[]
  answer: Part[]
  sources: Source[]
  note?: string
}

export const QAS: QA[] = [
  {
    id: 'price',
    chip: 'Gab es Hinweise auf Preisabsprachen?',
    question: 'Gab es Hinweise auf Preisabsprachen?',
    keywords: /preisabsprach|absprach|kartell|wettbewerb/i,
    steps: ['Dokument lesen', 'Aussagen zu Preisen und Wettbewerbern suchen', 'Fundstellen verknüpfen'],
    answer: [
      'Es gibt mögliche Hinweise. Beim Treffen mit drei Wettbewerbern wurde angedeutet, dass alle Beteiligten ihre Listenpreise zum 1. April anheben wollen ',
      { src: 1 },
      '. Eine feste Absprache wird verneint, vereinbart wurden aber eine gemeinsame Beobachtung der Rohstoffkosten und ein Folgetreffen nach dem Quartalsabschluss ',
      { src: 2 },
      '. Außerdem soll die Notiz nicht weitergeleitet werden ',
      { src: 3 },
      '.',
    ],
    sources: [
      { n: 1, para: 'p3', label: 'Absatz 3' },
      { n: 2, para: 'p4', label: 'Absatz 4' },
      { n: 3, para: 'p6', label: 'Absatz 6' },
    ],
    note: 'Mögliche Erkenntnis. Bitte an den Fundstellen prüfen.',
  },
  {
    id: 'who',
    chip: 'Wer war beteiligt, und wann?',
    question: 'Wer war beteiligt, und wann?',
    keywords: /wer |beteilig|wann|teilnehm|treffen/i,
    steps: ['Dokument lesen', 'Termin und Teilnehmer bestimmen'],
    answer: [
      'Das Treffen fand am 12.03. am Rande der Branchenmesse in Hamburg statt. Beteiligt waren Vertreter von drei Wettbewerbern und zwei Personen aus dem Vertrieb ',
      { src: 1 },
      '. Die Notiz selbst ist vom 14.03. ',
      { src: 2 },
      '.',
    ],
    sources: [
      { n: 1, para: 'p2', label: 'Absatz 2' },
      { n: 2, para: 'p1', label: 'Absatz 1' },
    ],
  },
  {
    id: 'legal',
    chip: 'Wurde die Rechtsabteilung eingebunden?',
    question: 'Wurde die Rechtsabteilung eingebunden?',
    keywords: /recht|jurist|legal|compliance/i,
    steps: ['Dokument lesen', 'Hinweise auf Rechtsabteilung suchen'],
    answer: [
      'Noch nicht. Das Dokument hält offen, ob die Rechtsabteilung informiert werden soll; die Entscheidung steht bis zum 20.03. aus ',
      { src: 1 },
      '.',
    ],
    sources: [{ n: 1, para: 'p7', label: 'Absatz 7' }],
  },
  {
    id: 'calc',
    chip: 'Welche Preisanpassung ist geplant?',
    question: 'Welche Preisanpassung ist geplant?',
    keywords: /kalkul|prozent|anpassung|erhöh|listenpreis/i,
    steps: ['Dokument lesen', 'Zahlen und Zeitpunkte extrahieren'],
    answer: [
      'Intern ist für das zweite Quartal eine Anpassung von vier bis sechs Prozent kalkuliert ',
      { src: 1 },
      '. Die Listenpreise sollen zum 1. April steigen ',
      { src: 2 },
      '.',
    ],
    sources: [
      { n: 1, para: 'p5', label: 'Absatz 5' },
      { n: 2, para: 'p3', label: 'Absatz 3' },
    ],
  },
  {
    id: 'cost',
    chip: 'Was hat die Messe gekostet?',
    question: 'Was hat die Messe gekostet?',
    keywords: /kost|messe|reise|budget/i,
    steps: ['Dokument lesen', 'Beträge suchen'],
    answer: ['Messestand und Reise kosteten 18.400 Euro und gehen zulasten des Budgets Marketing ', { src: 1 }, '.'],
    sources: [{ n: 1, para: 'p8', label: 'Absatz 8' }],
  },
]

export const NO_MATCH =
  'Dazu finde ich in diesem Dokument nichts. Über „Alle Treffer“ durchsuche ich den gesamten Bestand.'

export function matchQuestion(text: string): QA | null {
  const t = text.trim()
  if (!t) return null
  return QAS.find((qa) => qa.question.toLowerCase() === t.toLowerCase()) ?? QAS.find((qa) => qa.keywords.test(t)) ?? null
}
