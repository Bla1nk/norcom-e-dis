import nodemailer from 'nodemailer'

// Vercel-Funktion: nimmt die Demo-Anfrage der Website entgegen und schickt sie per Mail an NorCom.
// Konfiguration über Umgebungsvariablen (Vercel → Project Settings → Environment Variables):
//   SMTP_HOST, SMTP_PORT (587), SMTP_USER, SMTP_PASS, MAIL_FROM
//   MAIL_TO (optional, kommagetrennt; Standard: info@norcom.de, Lisa.Nordbakk@norcom.de)

type Body = {
  name?: unknown
  organisation?: unknown
  email?: unknown
  telefon?: unknown
  nachricht?: unknown
  einwilligung?: unknown
  interessen?: unknown
  betrieb?: unknown
  start?: unknown
}

type Req = { method?: string; body?: unknown }
type Res = { status: (n: number) => Res; json: (b: unknown) => void; setHeader: (k: string, v: string) => void }

const DEFAULT_TO = 'info@norcom.de, Lisa.Nordbakk@norcom.de'
const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const oneLine = (v: string) => v.replace(/[\r\n]+/g, ' ')

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false })
  }
  const b: Body = typeof req.body === 'string' ? safeParse(req.body) : ((req.body as Body) ?? {})

  const name = oneLine(str(b.name, 200))
  const organisation = oneLine(str(b.organisation, 200))
  const email = oneLine(str(b.email, 200))
  if (!name || !organisation || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || b.einwilligung !== true) {
    return res.status(400).json({ ok: false })
  }
  const telefon = oneLine(str(b.telefon, 100))
  const nachricht = str(b.nachricht, 5000)
  const interessen = Array.isArray(b.interessen) ? b.interessen.map((x) => oneLine(str(x, 200))).filter(Boolean).slice(0, 20) : []
  const betrieb = oneLine(str(b.betrieb, 200))
  const start = oneLine(str(b.start, 200))

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = process.env
  if (!SMTP_HOST || !MAIL_FROM) {
    console.error('demo: SMTP_HOST oder MAIL_FROM nicht gesetzt')
    return res.status(500).json({ ok: false })
  }

  const port = Number(SMTP_PORT ?? 587)
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  })

  const text = [
    'Neue Demo-Anfrage über die Website DaSense eDiscovery',
    '',
    `Name:          ${name}`,
    `Organisation:  ${organisation}`,
    `E-Mail:        ${email}`,
    `Telefon:       ${telefon || '–'}`,
    `Interessen:    ${interessen.join(', ') || '–'}`,
    `Betrieb:       ${betrieb || '–'}`,
    `Start:         ${start || '–'}`,
    '',
    'Nachricht:',
    nachricht || '–',
    '',
    'Einwilligung zur Verarbeitung der Angaben: erteilt',
  ].join('\n')

  try {
    await transport.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO || DEFAULT_TO,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `Demo-Anfrage DaSense eDiscovery: ${organisation}`,
      text,
    })
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('demo: Versand fehlgeschlagen', e instanceof Error ? e.message : e)
    return res.status(502).json({ ok: false })
  }
}

function safeParse(s: string): Body {
  try {
    return JSON.parse(s) as Body
  } catch {
    return {}
  }
}
