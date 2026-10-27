import { useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { Eyebrow, sectionHeadingClass } from './Eyebrow'

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
    },
  }
}

const inputClass =
  'min-h-[44px] px-3 border border-field-line rounded-md [font:inherit] text-[1rem] bg-white'
const labelClass = 'text-[0.875rem] font-medium'
const errorClass = 'text-[0.8125rem] text-danger'

function Required() {
  return (
    <span aria-hidden="true" className="text-primary">
      {' '}
      *
    </span>
  )
}

function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 items-start font-semibold text-ink">
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#601571"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-none mt-[3px]"
      >
        <path d="M5 12l5 5L20 7" />
      </svg>
      <span>{children}</span>
    </li>
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

const MAIL_LINK = 'mailto:info@norcom.de?subject=Demo-Anfrage%20DaSense%20eDiscovery'

function DemoForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

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
    const { errors: found, data } = validate(f)
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
      className="flex-[1_1_420px] min-w-0 bg-white border border-card-line rounded-xl p-8 flex flex-col gap-4"
    >
      <h3 id="demo-form-h" className="m-0 text-primary text-[1.25rem] font-semibold">
        Demo anfragen
      </h3>
      <p className="m-0 text-[0.8125rem] text-muted">Pflichtfelder sind mit * gekennzeichnet.</p>
      <div className="flex flex-wrap gap-4">
        <div className="flex-[1_1_180px] flex flex-col gap-1.5">
          <label htmlFor="d-name" className={labelClass}>
            Name
            <Required />
          </label>
          <input
            id="d-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            maxLength={120}
            aria-invalid={!!errors.name}
            aria-describedby="errName-msg"
            className={inputClass}
          />
          {errors.name && (
            <span id="errName-msg" className={errorClass}>
              Bitte geben Sie Ihren Namen an.
            </span>
          )}
        </div>
        <div className="flex-[1_1_180px] flex flex-col gap-1.5">
          <label htmlFor="d-org" className={labelClass}>
            Unternehmen / Behörde
            <Required />
          </label>
          <input
            id="d-org"
            name="organisation"
            type="text"
            autoComplete="organization"
            required
            aria-required="true"
            maxLength={160}
            aria-invalid={!!errors.org}
            aria-describedby="errOrg-msg"
            className={inputClass}
          />
          {errors.org && (
            <span id="errOrg-msg" className={errorClass}>
              Bitte geben Sie Ihr Unternehmen oder Ihre Behörde an.
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex-[1_1_180px] flex flex-col gap-1.5">
          <label htmlFor="d-mail" className={labelClass}>
            Geschäftliche E-Mail
            <Required />
          </label>
          <input
            id="d-mail"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            maxLength={200}
            aria-invalid={!!errors.mail}
            aria-describedby="errMail-msg"
            className={inputClass}
          />
          {errors.mail && (
            <span id="errMail-msg" className={errorClass}>
              Bitte geben Sie eine gültige E-Mail-Adresse an.
            </span>
          )}
        </div>
        <div className="flex-[1_1_180px] flex flex-col gap-1.5">
          <label htmlFor="d-tel" className={labelClass}>
            Telefon (optional)
          </label>
          <input
            id="d-tel"
            name="telefon"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="d-msg" className={labelClass}>
          Worum geht es? (optional)
        </label>
        <textarea
          id="d-msg"
          name="nachricht"
          rows={4}
          maxLength={2000}
          className="py-2.5 px-3 border border-field-line rounded-md resize-y [font:inherit] text-[1rem] bg-white"
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
            className="flex-none w-[18px] h-[18px] mt-0.5 accent-primary"
          />
          <label htmlFor="d-consent">
            Ich willige ein, dass NorCom meine Angaben zur Bearbeitung meiner Demo-Anfrage
            verarbeitet. Details in der{' '}
            <a href="https://www.norcom.de/datenschutzerklaerung">Datenschutzerklärung</a>. Die
            Einwilligung kann ich jederzeit widerrufen.
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
        className="min-h-[52px] border-0 rounded-full bg-primary-deep text-white [font:inherit] font-semibold cursor-pointer"
      >
        {sending ? 'Wird gesendet …' : 'Demo anfragen'}
        <span aria-hidden="true" className="ml-3">
          ⟶
        </span>
      </button>
      <div role="status" aria-live="polite">
        {status === 'invalid' && <Notice tone="danger">Bitte prüfen Sie die markierten Felder.</Notice>}
        {status === 'unconnected' && (
          <Notice tone="warn">
            Der Online-Versand ist noch nicht freigeschaltet, Ihre Anfrage wurde nicht übermittelt.
            Bitte schreiben Sie uns direkt an <a href={MAIL_LINK}>info@norcom.de</a> oder rufen Sie
            an: <a href="tel:+4989939480">+49 89 939 48-0</a>.
          </Notice>
        )}
        {status === 'failed' && (
          <Notice tone="danger">
            Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben
            Sie an <a href={MAIL_LINK}>info@norcom.de</a>.
          </Notice>
        )}
        {status === 'sent' && (
          <Notice tone="ok">
            Vielen Dank. Ihre Anfrage ist bei uns eingegangen, wir melden uns zeitnah bei Ihnen.
          </Notice>
        )}
      </div>
    </form>
  )
}

export function Demo() {
  return (
    <section id="demo" className="bg-white border-t border-line">
      <div className="max-w-[1200px] mx-auto py-24 px-8 flex flex-wrap gap-14">
        <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-5">
          <Eyebrow>Live-Demo</Eyebrow>
          <h2 className={sectionHeadingClass}>Sehen Sie, was DaSense in Ihren Daten finden kann.</h2>
          <p className="m-0 text-[1.125rem] text-body">
            Erleben Sie, wie DaSense große Datenbestände erschließt, Zusammenhänge erkennt und
            Ergebnisse mit Originalquellen belegt. Gemeinsam besprechen wir Ihren Anwendungsfall und
            das passende Betriebsmodell.
          </p>
          <ul aria-label="Inhalte der Demo" className="list-none m-0 p-0 flex flex-col gap-2.5">
            <Check>Konkreter eDiscovery-Workflow</Check>
            <Check>KI-Analyse mit Quellenbelegen</Check>
            <Check>Betriebsmodell für Ihre Anforderungen</Check>
          </ul>
          <div className="flex flex-col gap-1.5 pt-4 mt-2 border-t border-hairline text-[0.9375rem]">
            <span className="font-semibold">NorCom Information Technology GmbH &amp; Co. KGaA</span>
            <span className="text-body">Gabelsbergerstraße 4 · 80333 München</span>
            <a href="tel:+4989939480">+49 89 939 48-0</a>
            <a href="mailto:info@norcom.de">info@norcom.de</a>
          </div>
        </div>
        <DemoForm />
      </div>
    </section>
  )
}
