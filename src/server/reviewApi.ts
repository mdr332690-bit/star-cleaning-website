import { getContext } from '@netlify/functions'
import { getSettings, getUser, login, logout } from '@netlify/identity'
import { sanitizeReviewImage } from './reviewImages'
import { reviewEnvironment, runtimeReviewStore } from './reviewRuntime'
import {
  boundedText,
  checkMutation,
  maxReviewBytes,
  readBody,
  ReviewError,
  reviewInput,
  uuidPattern,
} from './reviewValidation'

export const privateReviewHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'Netlify-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
}

export function moderatorIdentity(
  user: { id: string; roles?: string[]; confirmedAt?: string } | null,
  role: string,
) {
  if (!user) throw new ReviewError('signIn', 401)
  if (!user.confirmedAt || !user.roles?.includes(role))
    throw new ReviewError('forbidden', 403)
  return user.id
}

async function inviteOnly() {
  const settings = await getSettings()
  if (!settings.disableSignup) throw new ReviewError('staffSetup', 503)
}

const json = (value: unknown, status = 200) =>
  Response.json(value, { status, headers: privateReviewHeaders })

async function readJson(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json')
    throw new ReviewError('invalid', 400)
  const bytes = await readBody(request, 8 * 1024)
  try {
    const result: unknown = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    )
    if (result && typeof result === 'object' && !Array.isArray(result))
      return result as Record<string, unknown>
  } catch {
    throw new ReviewError('invalid', 400)
  }
  throw new ReviewError('invalid', 400)
}

function validId(value: unknown) {
  if (typeof value !== 'string' || !uuidPattern.test(value))
    throw new ReviewError('notFound', 404)
  return value
}

function expiryDays(value: unknown) {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 30
  )
    throw new ReviewError('expiry', 400)
  return value
}

export async function reviewApi(request: Request, path: string) {
  try {
    const context = getContext()
    const environment = reviewEnvironment(context)
    if (
      !environment.preview &&
      Netlify.env.get('REVIEW_PRODUCTION_ENABLED') !== '1'
    ) {
      if (request.method === 'GET' && path === 'list')
        return json({ total: 0, average: null, reviews: [] })
      throw new ReviewError('unavailable', 503)
    }
    const admin = path === 'admin' || path.startsWith('admin/')
    const post = request.method === 'POST'
    if (post) checkMutation(request, context.url.origin)
    const store = runtimeReviewStore(environment)
    if (request.method === 'GET' && path === 'list')
      return json(await store.list())
    if (post && path === 'submit') {
      await store.throttle(`submission:${context.ip}`, 12)
      const type = request.headers.get('content-type') ?? ''
      if (!/^multipart\/form-data;\s*boundary=.{1,80}$/i.test(type))
        throw new ReviewError('invalid', 400)
      const bytes = await readBody(request, maxReviewBytes)
      const form = await new Response(bytes, {
        headers: { 'Content-Type': type },
      })
        .formData()
        .catch(() => {
          throw new ReviewError('invalid', 400)
        })
      const input = reviewInput(form)
      await store.checkInvitation(input.tokenHash)
      const image = input.photo
        ? Uint8Array.from(await sanitizeReviewImage(input.photo))
        : null
      await store.submit(input, image)
      context.waitUntil(store.cleanup().catch(() => undefined))
      return json({ pending: true }, 201)
    }
    if (request.method === 'GET' && path.startsWith('photo/')) {
      return photoResponse(await store.photo(validId(path.slice(6))))
    }
    if (!admin) throw new ReviewError('notFound', 404)

    if (post && path === 'admin/sign-in') {
      await store.throttle(`staff-login:${context.ip}`, 10)
      await inviteOnly()
      const data = await readJson(request)
      const email = boundedText(data.email, 3, 254, 'signIn')
      const password = data.password
      if (
        typeof password !== 'string' ||
        password.length < 1 ||
        password.length > 1024
      )
        throw new ReviewError('signIn', 401)
      const user = await login(email, password).catch(() => {
        throw new ReviewError('signIn', 401)
      })
      try {
        moderatorIdentity(user, environment.role)
      } catch (error) {
        await logout()
        throw error
      }
      return json({ ok: true })
    }
    if (post && path === 'admin/sign-out') {
      const actor = moderatorIdentity(await getUser(), environment.role)
      await store.throttle(`staff:${actor}`, 90)
      await logout()
      return json({ ok: true })
    }
    const actor = moderatorIdentity(await getUser(), environment.role)
    await inviteOnly()
    if (request.method === 'GET' && path === 'admin') {
      const query = new URL(request.url).searchParams
      const status = query.get('status') ?? 'pending'
      const page = Number(query.get('page') ?? 0)
      if (
        (status !== 'pending' &&
          status !== 'approved' &&
          status !== 'rejected') ||
        !Number.isInteger(page) ||
        page < 0 ||
        page > 999
      )
        throw new ReviewError('invalid', 400)
      return json(await store.dashboard(status, page))
    }
    if (request.method === 'GET' && path.startsWith('admin/photo/'))
      return photoResponse(await store.photo(validId(path.slice(12)), true))
    if (!post || path !== 'admin') throw new ReviewError('notFound', 404)
    await store.throttle(`staff:${actor}`, 90)
    const data = await readJson(request)
    const action = data.action
    if (action === 'invite')
      return json(
        await store.invite(
          boundedText(data.job, 1, 70, 'job').toUpperCase(),
          expiryDays(data.days),
          actor,
        ),
        201,
      )
    const id = validId(data.id)
    if (action === 'revoke' || action === 'expiry') {
      await store.changeInvitation(
        id,
        actor,
        boundedText(data.reason, 1, 240, 'reason'),
        action === 'expiry' ? expiryDays(data.days) : undefined,
      )
    } else if (
      action === 'approve' ||
      action === 'reject' ||
      action === 'delete'
    ) {
      const reason =
        action === 'approve' && !data.reason
          ? null
          : boundedText(data.reason, 1, 240, 'reason')
      await store.moderate(id, action, actor, reason)
    } else {
      throw new ReviewError('invalid', 400)
    }
    context.waitUntil(store.cleanup().catch(() => undefined))
    return json({ ok: true })
  } catch (error) {
    if (error instanceof ReviewError)
      return json({ error: error.code }, error.status)
    return json({ error: 'unavailable' }, 503)
  }
}

function photoResponse(bytes: ArrayBuffer | null) {
  if (!bytes) throw new ReviewError('notFound', 404)
  return new Response(bytes, {
    headers: {
      ...privateReviewHeaders,
      'Content-Type': 'image/webp',
      'Content-Disposition': 'inline',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  })
}
