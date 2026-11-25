import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Language } from '../data/content'
import {
  bookingCopy,
  bookingEndpoint,
  bookingFields,
  bookingFormName,
  bookingServices,
  bookingWhatsAppMessage,
  kuwaitNow,
  normalizePhone,
  validateBooking,
} from '../data/booking'
import type { BookingErrors, BookingField } from '../data/booking'
import { site } from '../data/site'
import { trackBookingSuccess } from '../data/googleAds'
import { Icon } from './Icon'

export function BookingForm({
  lang,
  initialService = '',
  titleId,
  headingLevel = 2,
}: {
  lang: Language
  initialService?: string
  titleId?: string
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const t = bookingCopy[lang]
  const id = useId()
  const [state, setState] = useState<'idle' | 'pending' | 'success' | 'error'>(
    'idle',
  )
  const [errors, setErrors] = useState<BookingErrors>({})
  const [minDate, setMinDate] = useState('')
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState('')
  const pending = useRef(false)
  const feedback = useRef<HTMLDivElement>(null)
  const controller = useRef<AbortController | null>(null)
  const headingId = titleId ?? `${id}-heading`
  const whatsAppFollowUp = submittedWhatsAppUrl && (
    <div>
      <p className="inquiry-note">{t.whatsappInstructions}</p>
      <a
        className="text-link"
        href={submittedWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="whatsapp" size={19} />
        {t.openWhatsApp}
      </a>
    </div>
  )

  useEffect(() => {
    setMinDate(kuwaitNow().date)
    return () => {
      pending.current = false
      controller.current?.abort()
    }
  }, [])
  useEffect(() => {
    if (state === 'success' || state === 'error') feedback.current?.focus()
  }, [state])

  const fieldId = (name: BookingField) => `${id}-${name}`
  const fieldProps = (name: BookingField) => ({
    id: fieldId(name),
    name,
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': errors[name] ? `${fieldId(name)}-error` : undefined,
  })
  const label = (name: BookingField, optional = false) => (
    <label htmlFor={fieldId(name)}>
      {t[name]}{' '}
      <span className="inquiry-optional">
        {optional ? `(${t.optional})` : <span aria-hidden="true">*</span>}
      </span>
    </label>
  )
  const error = (name: BookingField) =>
    errors[name] && (
      <p className="inquiry-field-error" id={`${fieldId(name)}-error`}>
        {errors[name]}
      </p>
    )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    const nextErrors = validateBooking(data, lang)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setState('idle')
      const first = bookingFields.find((name) => nextErrors[name])!
      const field = form.elements.namedItem(first)
      if (field instanceof HTMLElement) field.focus()
      return
    }
    const body = new URLSearchParams()
    data.forEach((value, key) => {
      const text = String(value).trim()
      body.append(
        key,
        key === 'mobile' || key === 'whatsappNumber'
          ? normalizePhone(text)
          : text,
      )
    })
    pending.current = true
    setState('pending')
    const whatsappUrl = site.whatsappNumber
      ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(bookingWhatsAppMessage(data, lang))}`
      : ''
    setSubmittedWhatsAppUrl(whatsappUrl)
    controller.current = new AbortController()
    const timeout = window.setTimeout(() => controller.current?.abort(), 20000)
    try {
      const submission = fetch(bookingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: controller.current.signal,
        keepalive: true,
      })
      // Open during the submit gesture; waiting for the POST can trigger popup blockers.
      // Keep the POST alive when a mobile browser switches to the WhatsApp app.
      if (whatsappUrl) {
        try {
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
        } catch {
          // The visible message link remains available if opening is blocked.
        }
      }
      const response = await submission
      if (!response.ok) throw new Error('Form submission failed')
      const html = await response.text()
      if (
        /\bdata-netlify\s*=|name=["']netlify-form-registration["']/i.test(html)
      )
        throw new Error('Form processing unavailable')
      setState('success')
      // A honeypot rejection can still return HTTP 200. Do not count it, or a
      // request aborted when the dialog closed, as an accepted enquiry.
      if (!data.get('bot-field') && !controller.current?.signal.aborted)
        trackBookingSuccess()
    } catch {
      if (!controller.current?.signal.aborted || pending.current)
        setState('error')
    } finally {
      window.clearTimeout(timeout)
      pending.current = false
    }
  }

  if (state === 'success') {
    return (
      <div
        className="inquiry-success"
        ref={feedback}
        tabIndex={-1}
        role="status"
        lang={lang}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <span className="inquiry-success-icon">
          <Icon name="check" size={30} />
        </span>
        <Heading className="inquiry-heading" id={headingId}>
          {t.successTitle}
        </Heading>
        <p>{t.successText}</p>
        <p className="inquiry-note">{t.successNote}</p>
        <button
          className="button button-primary"
          type="button"
          onClick={() => {
            setState('idle')
            setSubmittedWhatsAppUrl('')
          }}
        >
          {t.another}
          <Icon name="arrow" size={17} />
        </button>
        {whatsAppFollowUp}
      </div>
    )
  }

  return (
    <div
      className="inquiry-form-content"
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Heading className="inquiry-heading inquiry-form-title" id={headingId}>
        {t.formTitle}
      </Heading>
      <p className="inquiry-form-intro">
        {t.formIntro} {t.serviceBoundary}
      </p>
      <form
        name={bookingFormName}
        method="POST"
        action={bookingEndpoint}
        data-netlify="true"
        netlify-honeypot="bot-field"
        noValidate
        aria-labelledby={headingId}
        aria-busy={state === 'pending'}
        onSubmit={submit}
        onChange={(event) => {
          if (state === 'error') setState('idle')
          setSubmittedWhatsAppUrl('')
          const target = event.target
          if (
            !(target instanceof HTMLInputElement) &&
            !(target instanceof HTMLSelectElement) &&
            !(target instanceof HTMLTextAreaElement)
          )
            return
          const name = target.name as BookingField
          if (errors[name])
            setErrors((previous) => ({ ...previous, [name]: undefined }))
        }}
      >
        <input type="hidden" name="form-name" value={bookingFormName} />
        <input type="hidden" name="language" value={lang} />
        <p hidden>
          <label>
            {t.bot}
            <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <p className="inquiry-required">{t.required}</p>
        {site.whatsappNumber && (
          <p className="inquiry-note">{t.whatsappSubmitHint}</p>
        )}
        <fieldset className="inquiry-fields" disabled={state === 'pending'}>
          <legend className="sr-only">{t.formTitle}</legend>
          <div className="inquiry-field inquiry-full">
            {label('fullName')}
            <input
              {...fieldProps('fullName')}
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              dir="auto"
            />
            {error('fullName')}
          </div>
          <div className="inquiry-field">
            {label('mobile')}
            <input
              {...fieldProps('mobile')}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              maxLength={30}
              dir="ltr"
              aria-describedby={`${fieldId('mobile')}-hint${errors.mobile ? ` ${fieldId('mobile')}-error` : ''}`}
            />
            <p className="inquiry-hint" id={`${fieldId('mobile')}-hint`}>
              {t.phoneHint}
            </p>
            {error('mobile')}
          </div>
          <div className="inquiry-field">
            {label('whatsappNumber', true)}
            <input
              {...fieldProps('whatsappNumber')}
              type="tel"
              inputMode="tel"
              maxLength={30}
              dir="ltr"
            />
            {error('whatsappNumber')}
          </div>
          <div className="inquiry-field inquiry-full">
            {label('service')}
            <select
              {...fieldProps('service')}
              required
              defaultValue={
                bookingServices.find((service) => service.id === initialService)
                  ?.en ?? ''
              }
            >
              <option value="" disabled>
                {t.selectService}
              </option>
              {bookingServices.map((service) => (
                <option key={service.id} value={service.en}>
                  {service[lang]}
                </option>
              ))}
            </select>
            {error('service')}
          </div>
          <div className="inquiry-field inquiry-full">
            {label('area')}
            <input
              {...fieldProps('area')}
              type="text"
              autoComplete="address-level2"
              placeholder={t.areaPlaceholder}
              required
              minLength={2}
              maxLength={200}
              dir="auto"
            />
            {error('area')}
          </div>
          <div className="inquiry-field">
            {label('preferredDate')}
            <input
              {...fieldProps('preferredDate')}
              type="date"
              min={minDate}
              required
              aria-describedby={`${id}-timezone${errors.preferredDate ? ` ${fieldId('preferredDate')}-error` : ''}`}
            />
            {error('preferredDate')}
          </div>
          <div className="inquiry-field">
            {label('preferredTime')}
            <input
              {...fieldProps('preferredTime')}
              type="time"
              required
              aria-describedby={`${id}-timezone${errors.preferredTime ? ` ${fieldId('preferredTime')}-error` : ''}`}
            />
            {error('preferredTime')}
          </div>
          <p className="inquiry-hint inquiry-full" id={`${id}-timezone`}>
            {t.kuwaitTime}
          </p>
          <div className="inquiry-field inquiry-full">
            {label('message', true)}
            <textarea
              {...fieldProps('message')}
              rows={4}
              maxLength={2000}
              placeholder={t.messagePlaceholder}
              dir="auto"
            />
            {error('message')}
          </div>
          <button
            className="button button-primary inquiry-submit inquiry-full"
            type="submit"
            disabled={state === 'pending'}
          >
            <Icon name={state === 'pending' ? 'clock' : 'arrow'} size={19} />
            {state === 'pending' ? t.sending : t.submit}
          </button>
        </fieldset>
        {state === 'pending' && (
          <p className="inquiry-hint" role="status">
            {t.sending}
          </p>
        )}
        {state === 'error' && (
          <div
            className="inquiry-error"
            role="alert"
            tabIndex={-1}
            ref={feedback}
          >
            {t.error}
          </div>
        )}
        {whatsAppFollowUp}
        <p className="inquiry-note">{t.note}</p>
        <p className="inquiry-privacy">{t.privacy}</p>
      </form>
    </div>
  )
}
