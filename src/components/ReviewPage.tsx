import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Language } from '../data/content'
import { reviewCopy, reviewPath } from '../data/reviews'
import { homePath } from '../data/servicePages'
import { site } from '../data/site'
import { Star } from './Icon'
import { Brand, Eyebrow } from './SiteUI'

const photoLimit = 3 * 1024 * 1024
const photoTypes = ['image/jpeg', 'image/png', 'image/webp']

export function ReviewPage({ lang }: { lang: Language }) {
  const text = reviewCopy[lang]
  const other = lang === 'en' ? 'ar' : 'en'
  const [code, setCode] = useState('')
  const [rating, setRating] = useState(0)
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState<keyof typeof text.error | ''>('')
  const photoInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    if (fragment.has('invite')) {
      const invitation = fragment.get('invite') ?? ''
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + window.location.search,
      )
      if (/^[A-Za-z0-9_-]{43}$/.test(invitation)) setCode(invitation)
      else setError('invitation')
    }
    setReady(true)
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !ready) return
    const form = new FormData(event.currentTarget)
    const photo = photoInput.current?.files?.[0]
    if (photo && photo.size > photoLimit) {
      setError('photoSize')
      return
    }
    if (photo?.size && !photoTypes.includes(photo.type)) {
      setError('photo')
      return
    }
    if (photo?.size) form.set('photo', photo)
    else form.delete('photo')
    setError('')
    setBusy(true)
    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        body: form,
        headers: { 'X-Review-Intent': '1' },
        cache: 'no-store',
      })
      const result = await response.json()
      if (response.status === 201 && result.pending === true) {
        setCode('')
        setComplete(true)
      } else {
        setError(
          typeof result.error === 'string' &&
            Object.hasOwn(text.error, result.error)
            ? (result.error as keyof typeof text.error)
            : 'unavailable',
        )
      }
    } catch {
      setError('unavailable')
    } finally {
      setBusy(false)
    }
  }

  const whatsapp = `https://wa.me/${site.whatsappNumber}`
  return (
    <main
      className="review-page"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
    >
      <header className="review-mast container">
        <Brand lang={lang} href={homePath(lang)} />
        <a
          href={reviewPath(other)}
          lang={other}
          onClick={(event) => {
            if (!/^[A-Za-z0-9_-]{43}$/.test(code)) return
            event.preventDefault()
            window.location.assign(`${reviewPath(other)}#invite=${code}`)
          }}
        >
          {text.language}
        </a>
      </header>
      <div className="review-layout container">
        <aside className="review-intro">
          <Eyebrow>{text.eyebrow}</Eyebrow>
          <h1>{text.heading}</h1>
          <p>{text.intro}</p>
          <div className="review-intro-mark" aria-hidden="true">
            <Star />
          </div>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            {text.request}
          </a>
        </aside>
        <div className="review-card">
          {complete ? (
            <div className="review-confirmation" role="status">
              <Star />
              <h2>{text.complete}</h2>
              <p>{text.pending}</p>
              <a href={homePath(lang)}>{text.home}</a>
            </div>
          ) : (
            <form
              method="post"
              encType="multipart/form-data"
              className="review-form"
              onSubmit={submit}
              aria-busy={busy}
            >
              <input type="hidden" name="language" value={lang} />
              <label className="review-trap" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <label>
                {text.invite}
                <input
                  name="code"
                  dir="ltr"
                  type="password"
                  autoComplete="off"
                  maxLength={43}
                  required
                  value={code}
                  onChange={(event) =>
                    setCode(event.currentTarget.value.trim())
                  }
                  aria-describedby="review-invite-hint"
                />
                <small id="review-invite-hint">{text.inviteHint}</small>
              </label>
              <label>
                {text.name}
                <input
                  name="name"
                  autoComplete="nickname"
                  maxLength={70}
                  required
                  dir="auto"
                  aria-describedby="review-name-hint"
                />
                <small id="review-name-hint">{text.nameHint}</small>
              </label>
              <fieldset className="review-rating">
                <legend>{text.rating}</legend>
                <div className="review-rating-options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      key={value}
                      className={value <= rating ? 'is-selected' : ''}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={rating === value}
                        required
                        onChange={() => setRating(value)}
                        aria-label={text.stars(value)}
                      />
                      <Star />
                    </label>
                  ))}
                </div>
              </fieldset>
              <label>
                {text.experience}
                <textarea
                  name="experience"
                  required
                  minLength={10}
                  maxLength={1500}
                  rows={5}
                  dir="auto"
                  aria-describedby="review-experience-hint"
                />
                <small id="review-experience-hint">{text.experienceHint}</small>
              </label>
              <div>
                <label>
                  {text.photo}
                  <input
                    ref={photoInput}
                    type="file"
                    name="photo"
                    accept="image/jpeg,image/png,image/webp"
                    aria-describedby="review-photo-hint"
                  />
                  <small id="review-photo-hint">{text.photoHint}</small>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (photoInput.current) photoInput.current.value = ''
                    if (error === 'photo' || error === 'photoSize') setError('')
                  }}
                >
                  {lang === 'ar' ? 'إزالة الصورة' : 'Remove photo'}
                </button>
              </div>
              <label className="review-consent">
                <input type="checkbox" name="consent" value="yes" required />
                <span>{text.consent}</span>
              </label>
              <p className="review-privacy">
                {text.privacy}{' '}
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  {text.whatsapp}
                </a>
              </p>
              {error && (
                <p className="review-error" role="alert">
                  {text.error[error]}
                </p>
              )}
              <button
                type="submit"
                className="button button-primary"
                disabled={!ready || busy}
              >
                {busy ? text.submitting : text.submit}
              </button>
            </form>
          )}
        </div>
        <ReviewShare lang={lang} />
      </div>
    </main>
  )
}

function ReviewShare({ lang }: { lang: Language }) {
  const text = reviewCopy[lang]
  const [url, setUrl] = useState(new URL(reviewPath(lang), site.url).href)
  const [nativeShare, setNativeShare] = useState(false)
  const [status, setStatus] = useState<'copied' | 'manual' | ''>('')
  useEffect(() => {
    setUrl(new URL(reviewPath(lang), window.location.origin).href)
    setNativeShare(typeof navigator.share === 'function')
  }, [lang])
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      setStatus('manual')
    }
  }
  async function shareLink() {
    try {
      await navigator.share({ title: text.title, url })
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setStatus('manual')
    }
  }
  return (
    <section className="review-share" aria-label={text.share}>
      <h2>{text.share}</h2>
      <p>{text.shareHint}</p>
      <div className="review-actions">
        <button type="button" onClick={copyLink}>
          {text.copy}
        </button>
        {nativeShare && (
          <button type="button" onClick={shareLink}>
            {text.deviceShare}
          </button>
        )}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text.whatsapp}
        </a>
      </div>
      <input
        type="url"
        dir="ltr"
        aria-label={text.share}
        value={url}
        readOnly
        onFocus={(event) => event.currentTarget.select()}
      />
      {status && <p role="status">{text[status]}</p>}
    </section>
  )
}
