import { linkProps } from '../lib/router'
import { useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'
import { Reveal, TextReveal } from './TextReveal'

/**
 * OFFENER INTEGRATIONSPUNKT: URL des Formular-Backends (POST, JSON).
 * Solange leer, wird nichts übermittelt (Status „unconnected“).
 */
const FORM_ENDPOINT: string = import.meta.env.VITE_DEMO_ENDPOINT ?? ''

type ErrorKey = 'name' | 'org' | 'mail' | 'consent'
type Errors = Partial<Record<ErrorKey, true>>
type Status = 'idle' | 'sending' | 'invalid' | 'unconnected' | 'failed' | 'sent'

type DemoRequest = {
  name: string
  organisation: string
  email: string
  telefon: string
  nachricht: string
  einwilligung: boolean
  interessen: string[]
  betrieb: string
  start: string
}

const FIELD_TO_ERROR: Partial<Record<string, ErrorKey>> = {
  name: 'name',
  organisation: 'org',
  email: 'mail',
  einwilligung: 'consent',
}

const FOCUS_ORDER: [ErrorKey, string][] = [
  ['name', 'd-name'],
  ['org', 'd-org'],
  ['mail', 'd-mail'],
  ['consent', 'd-consent'],
]

function fieldValue(f: HTMLFormElement, name: string): string {
  const el = f.elements.namedItem(name)
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value.trim() : ''
}

function isChecked(f: HTMLFormElement, name: string): boolean {
  const el = f.elements.namedItem(name)
  return el instanceof HTMLInputElement && el.checked
}

function validate(f: HTMLFormElement): { errors: Errors; data: DemoRequest } {
  const errors: Errors = {}
  if (!fieldValue(f, 'name')) errors.name = true
  if (!fieldValue(f, 'organisation')) errors.org = true
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fieldValue(f, 'email'))) errors.mail = true
  if (!isChecked(f, 'einwilligung')) errors.consent = true
  return {
    errors,
    data: {
      name: fieldValue(f, 'name'),
      organisation: fieldValue(f, 'organisation'),
      email: fieldValue(f, 'email'),
      telefon: fieldValue(f, 'telefon'),
      nachricht: fieldValue(f, 'nachricht'),
      einwilligung: isChecked(f, 'einwilligung'),
      interessen: [],
      betrieb: '',
      start: '',
    },
  }
}

const inputClass =
  'min-h-[48px] px-3.5 border border-ink/45 rounded-none [font:inherit] text-[1rem] bg-[#faf8fb] outline-none transition-colors focus:border-ink focus:bg-white'
const labelClass = 'text-[0.875rem] font-medium text-ink'
const errorClass = 'text-[0.8125rem] text-danger'

function Required() {
  return (
    <span aria-hidden="true" className="text-primary">
      {' '}
      *
    </span>
  )
}

type NoticeTone = 'danger' | 'warn' | 'ok'

const NOTICE_TONE: Record<NoticeTone, string> = {
  danger: 'bg-danger-bg border-danger-line text-danger',
  warn: 'bg-warn-bg border-warn-line text-warn-text',
  ok: 'bg-ok-bg border-ok-line text-ok-text',
}

function Notice({ tone, children }: { tone: NoticeTone; children: ReactNode }) {
  return (
    <p className={`m-0 py-3.5 px-4 rounded-lg border text-[0.9375rem] ${NOTICE_TONE[tone]}`}>
      {children}
    </p>
  )
}

const INTERESTS = ['Early Case Assessment', 'Vertragsfristen und Klauseln', 'Auskunftsersuchen und Datenschutz', 'Ermittlungen und Forensik', 'Ingest und Betrieb', 'Massendaten von Behörden']
const OPERATION = ['Im eigenen Rechenzentrum', 'Air-gapped, ohne Verbindung nach außen', 'Noch offen']
const START = ['So bald wie möglich', 'Innerhalb eines Monats', 'In den nächsten drei Monaten', 'Ich informiere mich nur']

function Chips({ label, options, value, onToggle }: { label: string; options: string[]; value: string[]; onToggle: (o: string) => void }) {
  return (
    <fieldset className="m-0 p-0 border-0 min-w-0">
      <legend className="p-0 mb-2.5 text-[0.8125rem] text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o)
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o)}
              className={`max-w-full min-h-[40px] text-left px-3.5 py-2 border text-[0.875rem] [font:inherit] cursor-pointer transition-colors duration-200 ${
                on ? 'bg-ink border-ink text-white' : 'bg-[#faf8fb] border-ink/45 text-ink hover:border-ink'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

const MAIL_LINK = 'mailto:info@norcom.de?subject=Demo-Anfrage%20DaSense%20eDiscovery'

function DemoForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [interests, setInterests] = useState<string[]>([])
  const [operation, setOperation] = useState<string[]>([])
  const [start, setStart] = useState<string[]>([])
  const toggle = (set: (f: (v: string[]) => string[]) => void, multi: boolean) => (o: string) =>
    set((v) => (v.includes(o) ? v.filter((x) => x !== o) : multi ? [...v, o] : [o]))

  const onInput = (e: ChangeEvent<HTMLFormElement>) => {
    const target = e.target as EventTarget & { name?: unknown }
    const k = typeof target.name === 'string' ? FIELD_TO_ERROR[target.name] : undefined
    if (k && errors[k]) {
      const next: Errors = { ...errors }
      delete next[k]
      setErrors(next)
      if (!Object.keys(next).length) setStatus('idle')
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.currentTarget
    if (status === 'sending') return
    // Honeypot gegen Bots
    if (fieldValue(f, 'website')) return
    const { errors: found, data: base } = validate(f)
    const data: DemoRequest = { ...base, interessen: interests, betrieb: operation[0] ?? '', start: start[0] ?? '' }
    if (Object.keys(found).length) {
      setErrors(found)
      setStatus('invalid')
      const first = FOCUS_ORDER.find(([key]) => found[key])
      if (first) f.querySelector<HTMLElement>('#' + first[1])?.focus()
      return
    }
    if (!FORM_ENDPOINT) {
      setErrors({})
      setStatus('unconnected')
      return
    }
    setErrors({})
    setStatus('sending')
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        f.reset()
        setInterests([])
        setOperation([])
        setStart([])
        setStatus('sent')
      })
      .catch(() => setStatus('failed'))
  }

  const sending = status === 'sending'

  return (
    <form
      aria-labelledby="demo-form-h"
      noValidate
      onSubmit={onSubmit}
      onChange={onInput}
      className="relative min-w-0 border border-ink bg-[#e8dcee] p-3 sm:p-6 flex flex-col gap-5"
    >
      <h3 id="demo-form-h" className="sr-only">
        Demo anfragen
      </h3>
      <div className="border border-ink p-3.5 sm:p-5 flex flex-col gap-5">
        <div className="flex items-baseline gap-3">
          <span className="text-[0.9375rem] font-bold">Beginnen Sie mit ein paar Klicks</span>
          <span className="text-[0.75rem] text-muted">Optional</span>
        </div>
        <Chips label="Was möchten Sie sehen?" options={INTERESTS} value={interests} onToggle={toggle(setInterests, true)} />
        <Chips label="Wie soll DaSense betrieben werden?" options={OPERATION} value={operation} onToggle={toggle(setOperation, false)} />
        <Chips label="Wann möchten Sie starten?" options={START} value={start} onToggle={toggle(setStart, false)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="d-name" className={labelClass}>
            Name
            <Required />
          </label>
          <input id="d-name" name="name" type="text" autoComplete="name" required aria-required="true" maxLength={120} aria-invalid={!!errors.name} aria-describedby="errName-msg" className={inputClass} />
          {errors.name && (
            <span id="errName-msg" className={errorClass}>
              Bitte geben Sie Ihren Namen an.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="d-mail" className={labelClass}>
            Geschäftliche E-Mail
            <Required />
          </label>
          <input id="d-mail" name="email" type="email" autoComplete="email" required aria-required="true" maxLength={200} aria-invalid={!!errors.mail} aria-describedby="errMail-msg" className={inputClass} />
          {errors.mail && (
            <span id="errMail-msg" className={errorClass}>
              Bitte geben Sie eine gültige E-Mail-Adresse an.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="d-org" className={labelClass}>
            Unternehmen / Behörde
            <Required />
          </label>
          <input id="d-org" name="organisation" type="text" autoComplete="organization" required aria-required="true" maxLength={160} aria-invalid={!!errors.org} aria-describedby="errOrg-msg" className={inputClass} />
          {errors.org && (
            <span id="errOrg-msg" className={errorClass}>
              Bitte geben Sie Ihr Unternehmen oder Ihre Behörde an.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="d-tel" className={labelClass}>
            Telefon (optional)
          </label>
          <input id="d-tel" name="telefon" type="tel" autoComplete="tel" maxLength={40} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="d-msg" className={labelClass}>
          Worum geht es? (optional)
        </label>
        <textarea
          id="d-msg"
          name="nachricht"
          rows={5}
          maxLength={2000}
          placeholder="Schildern Sie kurz Ihren Fall, die Art und Menge der Daten und was Sie herausfinden möchten."
          className="py-3 px-3.5 border border-ink/45 rounded-none resize-y [font:inherit] text-[1rem] bg-[#faf8fb] outline-none transition-colors focus:border-ink focus:bg-white placeholder:text-muted/70"
        />
      </div>
      <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
        <label htmlFor="d-website">Website</label>
        <input id="d-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2.5 items-start text-[0.8125rem] text-body">
          <input
            id="d-consent"
            name="einwilligung"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={!!errors.consent}
            aria-describedby="errConsent-msg"
            className="flex-none w-[18px] h-[18px] mt-0.5 accent-ink"
          />
          <label htmlFor="d-consent">
            Ich willige ein, dass NorCom meine Angaben zur Bearbeitung meiner Demo-Anfrage verarbeitet. Details in der{' '}
            <a {...linkProps('/datenschutzerklaerung')}>Datenschutzerklärung</a>. Die Einwilligung kann ich jederzeit widerrufen.
            <Required />
          </label>
        </div>
        {errors.consent && (
          <span id="errConsent-msg" className={errorClass}>
            Bitte bestätigen Sie die Einwilligung zur Datenverarbeitung.
          </span>
        )}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="group min-h-[56px] px-6 border-0 rounded-none bg-ink text-white [font:inherit] font-medium cursor-pointer flex items-center justify-between transition-colors hover:bg-primary-deep disabled:opacity-70"
      >
        <span>{sending ? 'Wird gesendet …' : 'Anfrage senden'}</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <path d="M6 18 18 6M8 6h10v10" />
        </svg>
      </button>
      <div role="status" aria-live="polite">
        {status === 'invalid' && <Notice tone="danger">Bitte prüfen Sie die markierten Felder.</Notice>}
        {status === 'unconnected' && (
          <Notice tone="warn">
            Der Online-Versand ist noch nicht freigeschaltet, Ihre Anfrage wurde nicht übermittelt. Bitte schreiben Sie uns direkt an{' '}
            <a href={MAIL_LINK}>info@norcom.de</a> oder rufen Sie an: <a href="tel:+4989939480">+49 89 939 48-0</a>.
          </Notice>
        )}
        {status === 'failed' && (
          <Notice tone="danger">
            Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie an <a href={MAIL_LINK}>info@norcom.de</a>.
          </Notice>
        )}
        {status === 'sent' && (
          <Notice tone="ok">Vielen Dank. Ihre Anfrage ist bei uns eingegangen, wir melden uns zeitnah bei Ihnen.</Notice>
        )}
      </div>
    </form>
  )
}

export function Demo() {
  return (
    <section id="demo" className="bg-mist border-t border-line scroll-mt-0">
      <div className="box-border max-w-[1240px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-x-16 gap-y-12 sm:gap-y-14 items-start">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <Eyebrow colorClass="text-ink">Live-Demo</Eyebrow>
          </Reveal>
          <TextReveal
            as="h2"
            text="Erzählen Sie uns von Ihrem Fall."
            delay={60}
            stagger={70}
            className="block m-0 mt-6 max-w-[11ch] text-[clamp(2.75rem,6.2vw,5.75rem)] leading-[1.06] tracking-[-0.045em] font-bold text-ink"
          />
          <Reveal as="p" delay={200} className="m-0 mt-8 max-w-[26rem] text-body text-[1.0625rem] leading-[1.7]">
            Sie möchten sehen, was DaSense in Ihren Daten findet? Schildern Sie uns Ihren Anwendungsfall. Wir besprechen mit Ihnen den Workflow und das passende Betriebsmodell.
          </Reveal>
          <Reveal delay={280} className="mt-9">
            <a
              href="mailto:info@norcom.de"
              className="group inline-flex items-center gap-4 pb-2 border-b border-ink text-ink text-[1.125rem] no-underline"
            >
              info@norcom.de
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M6 18 18 6M8 6h10v10" />
              </svg>
            </a>
          </Reveal>
          <Reveal as="p" delay={340} className="m-0 mt-5 text-body text-[1.0625rem]">
            Oder rufen Sie an: <a href="tel:+4989939480" className="text-body underline underline-offset-2">+49 89 939 48-0</a>
          </Reveal>
          <Reveal as="p" delay={400} className="m-0 mt-8 max-w-[26rem] text-body text-[1.0625rem] leading-[1.7]">
            Wir melden uns zeitnah. Ihre Angaben nutzen wir nur, um Ihre Anfrage zu bearbeiten und Sie zu kontaktieren.
          </Reveal>
          <Reveal as="p" delay={460} className="m-0 mt-10 pt-5 border-t border-ink/15 text-[0.875rem] text-muted leading-[1.7]">
            NorCom Information Technology GmbH &amp; Co. KGaA<br />Gabelsbergerstraße 4 · 80333 München
          </Reveal>
        </div>
        <Reveal delay={120}>
          <DemoForm />
        </Reveal>
      </div>
    </section>
  )
}
