import { t } from '../lib/i18n'
// Beispieldokument und vorbereitete Fragen für die Praxis-Demo. Das Dokument ist frei erfunden
// (keine realen Personen, Unternehmen oder Zitate); Fundstellen verweisen auf Absatz-IDs.

export type Para = { id: string; text: string }

export const DOC = {
  file: t('gespraechsnotiz_branchentreffen.pdf', 'meeting_note_industry_meetup.pdf'),
  title: t('Gesprächsnotiz Branchentreffen Hamburg', 'Meeting note: industry meetup in Hamburg'),
  from: t('Vertrieb Region Nord', 'Sales Region North'),
  initials: t('VN', 'SN'),
  to: t('Geschäftsführung', 'Executive Management'),
  date: t('Mi., 14.03.2001, 16:42', 'Wed, 03/14/2001, 4:42 PM'),
  paras: [
    { id: 'p1', text: t('Kurze Rückmeldung zum Termin vom 12.03. Die wichtigsten Punkte stehen unten, Details auf Nachfrage.', 'Brief feedback on the meeting of 03/12. The key points are below; details on request.') },
    { id: 'p2', text: t('Am Rande der Branchenmesse in Hamburg fand ein Treffen mit Vertretern von drei Wettbewerbern statt. Anlass war ein allgemeiner Austausch zur Marktlage; teilgenommen haben aus unserem Haus zwei Personen aus dem Vertrieb.', 'On the sidelines of the industry trade fair in Hamburg, a meeting took place with representatives of three competitors. The occasion was a general exchange on market conditions; two people from our sales team attended.') },
    { id: 'p3', text: t('Im Gespräch wurde angedeutet, dass alle Beteiligten ihre Listenpreise zum 1. April anheben wollen. Eine feste Absprache wurde nach meiner Einschätzung nicht getroffen.', 'During the conversation it was hinted that all parties intend to raise their list prices on April 1. In my assessment, no firm agreement was made.') },
    { id: 'p4', text: t('Vereinbart wurde, die Entwicklung der Rohstoffkosten gemeinsam zu beobachten und sich nach dem Quartalsabschluss erneut zu treffen.', 'It was agreed to monitor the development of raw material costs together and to meet again after the quarter close.') },
    { id: 'p5', text: t('Unsere interne Kalkulation (Anlage 3) sieht für das zweite Quartal eine Preisanpassung von vier bis sechs Prozent vor.', 'Our internal calculation (Attachment 3) provides for a price adjustment of four to six percent in the second quarter.') },
    { id: 'p6', text: t('Bitte diese Notiz nicht weiterleiten und nicht auf dem gemeinsamen Laufwerk ablegen.', 'Please do not forward this note or save it to the shared drive.') },
    { id: 'p7', text: t('Offen ist, ob die Rechtsabteilung über die Gesprächsinhalte informiert werden soll. Entscheidung bis 20.03.', 'It is still open whether the legal department should be informed about the content of the discussion. Decision by 03/20.') },
    { id: 'p8', text: t('Die Kosten für Messestand und Reise betrugen 18.400 Euro und werden dem Budget Marketing belastet.', 'The costs for the trade fair booth and travel were EUR 18,400 and will be charged to the Marketing budget.') },
    { id: 'p9', text: t('Ein Folgetermin ist voraussichtlich Mitte Juli vorgesehen. Ich melde mich, sobald ein Datum feststeht.', 'A follow-up meeting is expected for mid-July. I will get in touch as soon as a date is set.') },
    { id: 'p10', text: t('Anlagen: (1) Messeprogramm, (2) Teilnehmerliste, (3) Kalkulation Q2.', 'Attachments: (1) trade fair program, (2) attendee list, (3) Q2 calculation.') },
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
    chip: t('Gab es Hinweise auf Preisabsprachen?', 'Was there any sign of price fixing?'),
    question: t('Gab es Hinweise auf Preisabsprachen?', 'Was there any sign of price fixing?'),
    keywords: t(/preisabsprach|absprach|kartell|wettbewerb/i, /price.?fix|agreement|cartel|collu|competitor/i),
    steps: t(['Dokument lesen', 'Aussagen zu Preisen und Wettbewerbern suchen', 'Fundstellen verknüpfen'], ['Read document', 'Search statements on prices and competitors', 'Link passages']),
    answer: [
      t('Es gibt mögliche Hinweise. Beim Treffen mit drei Wettbewerbern wurde angedeutet, dass alle Beteiligten ihre Listenpreise zum 1. April anheben wollen ', 'There are possible indications. At the meeting with three competitors, it was hinted that all parties intend to raise their list prices on April 1 '),
      { src: 1 },
      t('. Eine feste Absprache wird verneint, vereinbart wurden aber eine gemeinsame Beobachtung der Rohstoffkosten und ein Folgetreffen nach dem Quartalsabschluss ', '. A firm agreement is denied, but it was agreed to jointly monitor raw material costs and to meet again after the quarter close '),
      { src: 2 },
      t('. Außerdem soll die Notiz nicht weitergeleitet werden ', '. In addition, the note is not to be forwarded '),
      { src: 3 },
      '.',
    ],
    sources: [
      { n: 1, para: 'p3', label: t('Absatz 3', 'Paragraph 3') },
      { n: 2, para: 'p4', label: t('Absatz 4', 'Paragraph 4') },
      { n: 3, para: 'p6', label: t('Absatz 6', 'Paragraph 6') },
    ],
    note: t('Mögliche Erkenntnis. Bitte an den Fundstellen prüfen.', 'Possible finding. Please verify at the cited passages.'),
  },
  {
    id: 'who',
    chip: t('Wer war beteiligt, und wann?', 'Who was involved, and when?'),
    question: t('Wer war beteiligt, und wann?', 'Who was involved, and when?'),
    keywords: t(/wer |beteilig|wann|teilnehm|treffen/i, /who|involved|when|attend|particip|meeting/i),
    steps: t(['Dokument lesen', 'Termin und Teilnehmer bestimmen'], ['Read document', 'Determine date and participants']),
    answer: [
      t('Das Treffen fand am 12.03. am Rande der Branchenmesse in Hamburg statt. Beteiligt waren Vertreter von drei Wettbewerbern und zwei Personen aus dem Vertrieb ', 'The meeting took place on 03/12 on the sidelines of the industry trade fair in Hamburg. Representatives of three competitors and two people from sales were involved '),
      { src: 1 },
      t('. Die Notiz selbst ist vom 14.03. ', '. The note itself is dated 03/14 '),
      { src: 2 },
      '.',
    ],
    sources: [
      { n: 1, para: 'p2', label: t('Absatz 2', 'Paragraph 2') },
      { n: 2, para: 'p1', label: t('Absatz 1', 'Paragraph 1') },
    ],
  },
  {
    id: 'legal',
    chip: t('Wurde die Rechtsabteilung eingebunden?', 'Was the legal department involved?'),
    question: t('Wurde die Rechtsabteilung eingebunden?', 'Was the legal department involved?'),
    keywords: t(/recht|jurist|legal|compliance/i, /legal|counsel|lawyer|compliance/i),
    steps: t(['Dokument lesen', 'Hinweise auf Rechtsabteilung suchen'], ['Read document', 'Search for references to the legal department']),
    answer: [
      t('Noch nicht. Das Dokument hält offen, ob die Rechtsabteilung informiert werden soll; die Entscheidung steht bis zum 20.03. aus ', 'Not yet. The document leaves open whether the legal department should be informed; the decision is pending until 03/20 '),
      { src: 1 },
      '.',
    ],
    sources: [{ n: 1, para: 'p7', label: t('Absatz 7', 'Paragraph 7') }],
  },
  {
    id: 'calc',
    chip: t('Welche Preisanpassung ist geplant?', 'What price adjustment is planned?'),
    question: t('Welche Preisanpassung ist geplant?', 'What price adjustment is planned?'),
    keywords: t(/kalkul|prozent|anpassung|erhöh|listenpreis/i, /calculat|percent|adjust|increase|list.?price|price/i),
    steps: t(['Dokument lesen', 'Zahlen und Zeitpunkte extrahieren'], ['Read document', 'Extract figures and dates']),
    answer: [
      t('Intern ist für das zweite Quartal eine Anpassung von vier bis sechs Prozent kalkuliert ', 'Internally, an adjustment of four to six percent is calculated for the second quarter '),
      { src: 1 },
      t('. Die Listenpreise sollen zum 1. April steigen ', '. List prices are to rise on April 1 '),
      { src: 2 },
      '.',
    ],
    sources: [
      { n: 1, para: 'p5', label: t('Absatz 5', 'Paragraph 5') },
      { n: 2, para: 'p3', label: t('Absatz 3', 'Paragraph 3') },
    ],
  },
  {
    id: 'cost',
    chip: t('Was hat die Messe gekostet?', 'What did the trade fair cost?'),
    question: t('Was hat die Messe gekostet?', 'What did the trade fair cost?'),
    keywords: t(/kost|messe|reise|budget/i, /cost|fair|trade|travel|budget|price tag|expens/i),
    steps: t(['Dokument lesen', 'Beträge suchen'], ['Read document', 'Search for amounts']),
    answer: [t('Messestand und Reise kosteten 18.400 Euro und gehen zulasten des Budgets Marketing ', 'The trade fair booth and travel cost EUR 18,400 and are charged to the Marketing budget '), { src: 1 }, '.'],
    sources: [{ n: 1, para: 'p8', label: t('Absatz 8', 'Paragraph 8') }],
  },
]

export const NO_MATCH =
  t('Dazu finde ich in diesem Dokument nichts. Über „Alle Treffer“ durchsuche ich den gesamten Bestand.', 'I can\'t find anything on that in this document. Use “All hits” to search the entire repository.')

export function matchQuestion(text: string): QA | null {
  const q = text.trim()
  if (!q) return null
  return QAS.find((qa) => qa.question.toLowerCase() === q.toLowerCase()) ?? QAS.find((qa) => qa.keywords.test(q)) ?? null
}
