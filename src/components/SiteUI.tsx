import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { copy } from '../data/content'
import type { Language } from '../data/content'
import { site } from '../data/site'
import { trackPhoneClick } from '../data/googleAds'
import { Icon } from './Icon'

export function ContactActions({
  lang,
  showNumber = false,
  onDark = false,
  className = '',
}: {
  lang: Language
  showNumber?: boolean
  onDark?: boolean
  className?: string
}) {
  const t = copy[lang]
  return (
    <div className={`contact-actions ${className}`}>
      <a
        className={`button contact-action ${onDark ? 'button-cream' : 'button-outline'}`}
        href={`tel:${site.phone}`}
        onClick={trackPhoneClick}
      >
        <Icon name="phone" size={19} />
        <span className="contact-action-label">
          <span>{t.callNow}</span>
          {showNumber && <bdi dir="ltr">{site.phoneDisplay}</bdi>}
        </span>
      </a>
      <a
        className={`button contact-action ${onDark ? 'button-cream' : 'button-primary'}`}
        href={`https://wa.me/${site.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="whatsapp" size={19} />
        {t.whatsapp}
      </a>
    </div>
  )
}

export function ContactNumber() {
  return (
    <a
      className="contact-number"
      href={`tel:${site.phone}`}
      onClick={trackPhoneClick}
    >
      <bdi dir="ltr">{site.phoneDisplay}</bdi>
    </a>
  )
}

export function Brand({
  lang,
  href = '#home',
  showTagline = false,
}: {
  lang: Language
  href?: string
  showTagline?: boolean
}) {
  return (
    <a className="brand" href={href}>
      <img
        className="brand-mark"
        src="/star-cleaning-mark.svg"
        alt=""
        width={64}
        height={64}
        fetchPriority="low"
      />
      <span className="brand-type" lang={lang}>
        <strong>{lang === 'ar' ? 'ستار كلينينج' : 'STAR CLEANING'}</strong>
        <span>
          {lang === 'ar' ? 'خدمات التنظيف · الكويت' : 'SERVICE KUWAIT'}
        </span>
        {showTagline && (
          <span className="brand-tagline">
            {lang === 'ar'
              ? 'الكويت · عناية في كل تفصيلة'
              : 'KUWAIT · CARE IN EVERY DETAIL'}
          </span>
        )}
      </span>
    </a>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-line" />
      {children}
    </p>
  )
}

export function Modal({
  children,
  onClose,
  closeLabel,
  wide = false,
}: {
  children: ReactNode
  onClose: () => void
  closeLabel: string
  wide?: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
    }
  }, [])
  const close = () => {
    dialogRef.current?.close()
    onClose()
  }
  return (
    <dialog
      ref={dialogRef}
      className={`modal ${wide ? 'modal-wide' : ''}`}
      aria-labelledby="dialog-heading"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="modal-panel">
        <button
          className="icon-button modal-close"
          type="button"
          onClick={close}
          aria-label={closeLabel}
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </dialog>
  )
}
