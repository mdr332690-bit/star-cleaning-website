import { useEffect, useState, type FormEvent } from 'react'
import {
  reviewCopy,
  reviewDate,
  reviewPath,
  type DisplayReview,
} from '../data/reviews'
import { ReviewStars } from './CustomerReviews'
import { Brand, Eyebrow } from './SiteUI'

const api = '/api/reviews/admin'
const queues = ['pending', 'approved', 'rejected'] as const
type Queue = (typeof queues)[number]
type Invitation = {
  id: string
  job: string
  expiresAt: string
  revokedAt: string | null
  redeemedAt: string | null
}
type Dashboard = {
  items: (DisplayReview & { status: Queue; job: string })[]
  links: Invitation[]
  history: {
    id: string
    targetId: string
    actor: string
    action: string
    reason: string | null
    createdAt: string
  }[]
  hasMore: boolean
}
type Credentials = { kind: 'invite' | 'recovery'; code: string }

const post = (url: string, data: unknown) =>
  fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-Review-Intent': '1' },
    body: JSON.stringify(data),
  })
const messages: Record<string, string> = {
  jobConflict:
    'There is already an active or redeemed invitation for this job.',
  reason: 'Enter a reason of 1–240 characters without personal information.',
  expiry: 'Choose a lifetime from 1 to 30 days.',
  rate: 'Too many requests. Try again later.',
  forbidden: 'This account cannot moderate reviews in this environment.',
  staffSetup:
    'Staff sign-in is unavailable until Identity is configured as invite-only.',
  signIn:
    'Unable to sign in. Check your credentials or ask the site owner for access.',
  transition: 'This review has already been moderated. Refresh the queue.',
  job: 'Enter an internal completed-job reference of 1–70 characters.',
  notFound: 'This item is no longer available. Refresh the dashboard.',
}
const stamp = (value: string) =>
  new Intl.DateTimeFormat('en-KW', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kuwait',
  }).format(new Date(value))
const message = (code: unknown) =>
  typeof code === 'string' && Object.hasOwn(messages, code)
    ? messages[code]
    : 'The operation could not be confirmed. Try again.'

export function ReviewAdmin() {
  const [auth, setAuth] = useState<'loading' | 'required' | 'verified'>(
    'loading',
  )
  const [data, setData] = useState<Dashboard | null>(null)
  const [queue, setQueue] = useState<Queue>('pending')
  const [page, setPage] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [invitation, setInvitation] = useState<{
    code: string
    expiresAt: string
  } | null>(null)
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [recover, setRecover] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const invite = fragment.get('invite_token')
    const recovery = fragment.get('recovery_token')
    if (invite || recovery) {
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname,
      )
      setCredentials(
        invite
          ? { kind: 'invite', code: invite }
          : { kind: 'recovery', code: recovery! },
      )
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${api}?status=${queue}&page=${page}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json()
        if (controller.signal.aborted) return
        if (!response.ok) {
          setAuth('required')
          setData(null)
          setInvitation(null)
          if (response.status !== 401) setError(message(body.error))
        } else {
          setAuth('verified')
          setData(body)
          setError('')
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(message('unavailable'))
          setAuth('required')
          setData(null)
          setInvitation(null)
        }
      })
    return () => controller.abort()
  }, [queue, page, refresh])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const form = new FormData(event.currentTarget)
    setError('')
    setNotice('')
    setBusy(true)
    try {
      const email = String(form.get('email') ?? '')
      const password = String(form.get('password') ?? '')
      if (credentials) {
        const { acceptInvite, recoverPassword } =
          await import('@netlify/identity')
        if (credentials.kind === 'invite')
          await acceptInvite(credentials.code, password)
        else await recoverPassword(credentials.code, password)
        setCredentials(null)
        setRefresh((value) => value + 1)
      } else if (recover) {
        const { requestPasswordRecovery } = await import('@netlify/identity')
        await requestPasswordRecovery(email)
        setNotice(
          'If the account can be recovered, an email will arrive shortly.',
        )
        setRecover(false)
      } else {
        const response = await post(`${api}/sign-in`, { email, password })
        if (!response.ok) {
          setError(message((await response.json()).error))
          return
        }
        setRefresh((value) => value + 1)
      }
    } catch {
      setError(message('signIn'))
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    try {
      if (!(await post(`${api}/sign-out`, {})).ok)
        throw new Error('Sign out failed')
      const { logout } = await import('@netlify/identity')
      await logout().catch(() => undefined)
      setData(null)
      setInvitation(null)
      setAuth('required')
      setError('')
      setRefresh((value) => value + 1)
    } catch {
      setError('Sign out could not be confirmed.')
    } finally {
      setBusy(false)
    }
  }

  async function change(
    event: FormEvent<HTMLFormElement>,
    fields: Record<string, unknown> = {},
  ) {
    event.preventDefault()
    if (busy) return
    const element = event.currentTarget
    const form = new FormData(element)
    const action = fields.action ?? form.get('action')
    if (
      action === 'delete' &&
      !window.confirm('Delete the review content and remove its photo?')
    )
      return
    setError('')
    setNotice('')
    setBusy(true)
    try {
      const response = await post(api, {
        action,
        job: form.get('job'),
        reason: form.get('reason'),
        days: Number(form.get('days')),
        ...fields,
      })
      const result = await response.json()
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setData(null)
          setInvitation(null)
          setAuth('required')
        }
        setError(message(result.error))
        return
      }
      if (action === 'invite')
        setInvitation({ code: result.code, expiresAt: result.expiresAt })
      if (action === 'revoke' || action === 'expiry') setInvitation(null)
      element.reset()
      setNotice('Saved.')
      setRefresh((value) => value + 1)
    } catch {
      setError(message('unavailable'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="review-page">
      <header className="container review-mast">
        <Brand lang="en" href="/" />
        {auth === 'verified' && (
          <button type="button" onClick={signOut} disabled={busy}>
            Sign out
          </button>
        )}
      </header>
      <div className="container review-admin">
        <Eyebrow>Private workspace</Eyebrow>
        <h1>Review moderation</h1>
        {error && (
          <p className="review-error" role="alert">
            {error}
          </p>
        )}
        {notice && <p role="status">{notice}</p>}
        {auth === 'loading' && !credentials && (
          <p role="status">Checking staff access…</p>
        )}
        {(auth === 'required' || credentials) && (
          <form
            method="post"
            className="review-card review-form review-login"
            onSubmit={signIn}
          >
            <h2>
              {credentials
                ? 'Set your staff password'
                : recover
                  ? 'Recover staff access'
                  : 'Staff sign-in'}
            </h2>
            {!credentials && (
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  maxLength={254}
                />
              </label>
            )}
            {!recover && (
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    credentials ? 'new-password' : 'current-password'
                  }
                  minLength={credentials ? 12 : undefined}
                  required
                  maxLength={1024}
                />
              </label>
            )}
            <button
              type="submit"
              className="button button-primary"
              disabled={busy}
            >
              {credentials
                ? 'Set password'
                : recover
                  ? 'Request email'
                  : 'Sign in'}
            </button>
            {!credentials && (
              <button type="button" onClick={() => setRecover(!recover)}>
                {recover ? 'Back to sign-in' : 'Forgot password?'}
              </button>
            )}
          </form>
        )}
        {auth === 'verified' && data && !credentials && (
          <>
            <div className="review-admin-grid">
              <section className="review-card">
                <h2>Review queue</h2>
                <div className="review-actions" aria-label="Review queue">
                  {queues.map((status) => (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={queue === status}
                      onClick={() => {
                        setData(null)
                        setPage(0)
                        setQueue(status)
                        setRefresh((value) => value + 1)
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                {data.items.length === 0 && (
                  <p>No {queue} reviews on this page.</p>
                )}
                {data.items.map((review) => (
                  <article key={review.id} className="review-admin-record">
                    <h3>
                      <bdi>{review.name ?? 'Removed content'}</bdi>
                    </h3>
                    <ReviewStars
                      rating={review.rating}
                      label={reviewCopy.en.stars(review.rating)}
                    />
                    <p>
                      <bdi>{review.job}</bdi> ·{' '}
                      {reviewDate('en', review.submittedAt)}
                    </p>
                    <blockquote lang={review.language} dir="auto">
                      {review.experience}
                    </blockquote>
                    {review.hasPhoto && (
                      <img
                        src={`${api}/photo/${review.id}`}
                        alt="Sanitized customer upload"
                        loading="lazy"
                      />
                    )}
                    {review.status === 'pending' && (
                      <form
                        method="post"
                        onSubmit={(event) =>
                          change(event, { action: 'approve', id: review.id })
                        }
                      >
                        <button
                          type="submit"
                          className="button button-primary"
                          disabled={busy}
                        >
                          Approve
                        </button>
                      </form>
                    )}
                    <form
                      method="post"
                      className="review-form"
                      onSubmit={(event) => change(event, { id: review.id })}
                    >
                      <label>
                        Action
                        <select
                          name="action"
                          defaultValue={
                            review.status === 'rejected' ? 'delete' : 'reject'
                          }
                        >
                          {review.status !== 'rejected' && (
                            <option value="reject">Reject</option>
                          )}
                          <option value="delete">Delete</option>
                        </select>
                      </label>
                      <label>
                        Reason
                        <input
                          name="reason"
                          placeholder="Do not include personal information"
                          required
                          maxLength={240}
                        />
                      </label>
                      <button type="submit" disabled={busy}>
                        Apply action
                      </button>
                    </form>
                  </article>
                ))}
              </section>
              <section className="review-card">
                <h2>Job invitations</h2>
                <form
                  method="post"
                  className="review-form"
                  onSubmit={(event) => change(event, { action: 'invite' })}
                >
                  <label>
                    Completed job reference
                    <input
                      name="job"
                      required
                      maxLength={70}
                      placeholder="Use an internal reference, not a name"
                    />
                  </label>
                  <label>
                    Valid for days
                    <input
                      name="days"
                      type="number"
                      min={1}
                      max={30}
                      defaultValue={14}
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={busy}
                  >
                    Create private invitation
                  </button>
                </form>
                {invitation && (
                  <div className="review-invitation">
                    <h3>Private invitation</h3>
                    <p>
                      Expires {stamp(invitation.expiresAt)} Kuwait time. Share
                      only with the customer for this job. The code is shown
                      once.
                    </p>
                    {(['en', 'ar'] as const).map((lang) => (
                      <InviteMessage
                        key={lang}
                        lang={lang}
                        code={invitation.code}
                      />
                    ))}
                    <button type="button" onClick={() => setInvitation(null)}>
                      Hide private invitation
                    </button>
                  </div>
                )}
                {data.links.map((link) => (
                  <details key={link.id} className="review-admin-record">
                    <summary>
                      <bdi>{link.job}</bdi> ·{' '}
                      {link.redeemedAt
                        ? 'Redeemed'
                        : link.revokedAt
                          ? 'Revoked'
                          : new Date(link.expiresAt) <= new Date()
                            ? 'Expired'
                            : 'Active'}
                    </summary>
                    <p>Expires {stamp(link.expiresAt)} Kuwait time</p>
                    {!link.redeemedAt && !link.revokedAt && (
                      <form
                        method="post"
                        className="review-form"
                        onSubmit={(event) => change(event, { id: link.id })}
                      >
                        <label>
                          Action
                          <select name="action">
                            <option value="expiry">Update expiration</option>
                            <option value="revoke">Revoke</option>
                          </select>
                        </label>
                        <label>
                          Days from now (for expiration)
                          <input
                            name="days"
                            type="number"
                            min={1}
                            max={30}
                            defaultValue={14}
                            required
                          />
                        </label>
                        <label>
                          Reason
                          <input name="reason" required maxLength={240} />
                        </label>
                        <button type="submit" disabled={busy}>
                          Update invitation
                        </button>
                      </form>
                    )}
                  </details>
                ))}
              </section>
            </div>
            <section className="review-card review-history">
              <h2>Moderation history</h2>
              {data.history.length ? (
                <ul>
                  {data.history.map((entry) => (
                    <li key={entry.id}>
                      <strong>{entry.action}</strong> · {stamp(entry.createdAt)}
                      <p>
                        Staff {entry.actor} · record {entry.targetId}
                      </p>
                      {entry.reason && <p dir="auto">{entry.reason}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No actions on this page.</p>
              )}
            </section>
            <div className="review-actions">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>Page {page + 1}</span>
              <button
                type="button"
                disabled={!data.hasMore}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function InviteMessage({ lang, code }: { lang: 'en' | 'ar'; code: string }) {
  const text = reviewCopy[lang]
  const url = new URL(reviewPath(lang), window.location.origin)
  url.hash = `invite=${code}`
  const template = text.template(url.href)
  const [feedback, setFeedback] = useState('')
  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <label>
        {lang === 'ar' ? 'رسالة الدعوة بالعربية' : 'English invitation message'}
        <textarea
          readOnly
          value={template}
          rows={4}
          onFocus={(event) => event.currentTarget.select()}
        />
      </label>
      <div className="review-actions">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(template)
              setFeedback(text.copied)
            } catch {
              setFeedback(text.manual)
            }
          }}
        >
          {text.copy}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(template)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text.whatsapp}
        </a>
      </div>
      {feedback && <small role="status">{feedback}</small>}
    </div>
  )
}
