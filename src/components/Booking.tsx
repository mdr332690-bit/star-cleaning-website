import { useRef, useState } from 'react'
import { copy, services } from '../data/content'
import type { Language } from '../data/content'
import { site } from '../data/site'
import { bookingCopy } from '../data/booking'
import { BookingForm } from './BookingForm'
import { Icon } from './Icon'
import { Eyebrow } from './SiteUI'

export default function Booking({
  lang,
  initialService,
}: {
  lang: Language
  initialService: string
}) {
  return (
    <div className="booking-content booking-form-dialog">
      <span className="modal-symbol">
        <Icon name="home" size={26} />
      </span>
      <Eyebrow>{bookingCopy[lang].eyebrow}</Eyebrow>
      <BookingForm
        lang={lang}
        initialService={initialService}
        titleId="dialog-heading"
      />
      <details className="whatsapp-draft">
        <summary>{bookingCopy[lang].alternate}</summary>
        <WhatsAppEnquiry lang={lang} initialService={initialService} />
      </details>
    </div>
  )
}

function WhatsAppEnquiry({
  lang,
  initialService,
}: {
  lang: Language
  initialService: string
}) {
  const t = copy[lang]
  const [serviceId, setServiceId] = useState(initialService)
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const service = services.find((item) => item.id === serviceId) ?? services[0]
  const makeMessage = (id: string, selectedDate: string) => {
    const chosen = services.find((item) => item.id === id) ?? services[0]
    return `${t.draftIntro} ${chosen.title[lang]}.\n${selectedDate ? `${t.datePhrase} ${selectedDate}\n` : ''}${t.draftEnd}`
  }
  const [message, setMessage] = useState(() => makeMessage(initialService, ''))
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const today = new Date()
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const number = site.whatsappNumber.replace(/\D/g, '')
  async function copyEnquiry() {
    try {
      await navigator.clipboard.writeText(message)
      setStatus('copied')
    } catch {
      textareaRef.current?.focus()
      textareaRef.current?.select()
      setStatus('failed')
    }
  }
  return (
    <div className="booking-content">
      <span className="modal-symbol">
        <Icon name="whatsapp" size={28} />
      </span>
      <Eyebrow>{t.contactEyebrow}</Eyebrow>
      <h3>{t.bookingTitle}</h3>
      <p className="muted">{t.bookingText}</p>
      <label className="field-label" htmlFor="booking-service">
        {t.selectLabel}
      </label>
      <select
        id="booking-service"
        value={service.id}
        onChange={(event) => {
          setServiceId(event.target.value)
          setMessage(makeMessage(event.target.value, date))
          setStatus('idle')
        }}
      >
        {services.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title[lang]}
          </option>
        ))}
      </select>
      <label className="field-label" htmlFor="booking-date">
        {t.dateLabel}
      </label>
      <input
        id="booking-date"
        type="date"
        min={minDate}
        value={date}
        onChange={(event) => {
          setDate(event.target.value)
          setMessage(makeMessage(serviceId, event.target.value))
          setStatus('idle')
        }}
      />
      <label className="field-label" htmlFor="booking-message">
        {t.messageLabel}
      </label>
      <textarea
        ref={textareaRef}
        id="booking-message"
        rows={5}
        value={message}
        onChange={(event) => {
          setMessage(event.target.value)
          setStatus('idle')
        }}
      />
      {!number && (
        <p className="booking-notice">
          <Icon name="clock" size={18} />
          {t.unavailable}
        </p>
      )}
      {number ? (
        <a
          className="button button-primary booking-action"
          href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="whatsapp" />
          {t.sendWhatsApp}
          <Icon name="diagonal" size={17} />
        </a>
      ) : (
        <button
          className="button button-primary booking-action"
          onClick={copyEnquiry}
          disabled={!message.trim()}
        >
          <Icon name={status === 'copied' ? 'check' : 'copy'} />
          {status === 'copied' ? t.copied : t.copyMessage}
        </button>
      )}
      <p className="booking-status" role="status">
        {status === 'failed'
          ? t.copyFailed
          : status === 'copied'
            ? t.copied
            : t.bookingNote}
      </p>
    </div>
  )
}
