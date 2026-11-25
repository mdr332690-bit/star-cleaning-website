import { createHash, randomBytes } from 'node:crypto'

export const maxPhotoBytes = 3 * 1024 * 1024
export const maxReviewBytes = maxPhotoBytes + 32 * 1024
export const photoTypes = ['image/jpeg', 'image/png', 'image/webp']
const codePattern = /^[A-Za-z0-9_-]{43}$/
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export class ReviewError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code)
  }
}

export const hash = (value: string) =>
  createHash('sha256').update(value).digest('hex')
export const makeInvite = () => randomBytes(32).toString('base64url')
export const inviteHash = (value: unknown) => {
  if (typeof value !== 'string' || !codePattern.test(value.trim()))
    throw new ReviewError('invitation', 400)
  return hash(value.trim())
}

export const boundedText = (
  value: unknown,
  min: number,
  max: number,
  code: string,
) => {
  if (typeof value !== 'string') throw new ReviewError(code, 400)
  const text = value.trim().normalize('NFC')
  if (
    text.length < min ||
    text.length > max ||
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/u.test(
      text,
    )
  )
    throw new ReviewError(code, 400)
  return text
}

export function reviewInput(form: FormData) {
  for (const key of new Set(form.keys())) {
    if (
      ![
        'code',
        'name',
        'experience',
        'rating',
        'language',
        'consent',
        'website',
        'photo',
      ].includes(key) ||
      form.getAll(key).length !== 1
    )
      throw new ReviewError('invalid', 400)
  }
  if (form.get('website')) throw new ReviewError('invalid', 400)
  const tokenHash = inviteHash(form.get('code'))
  const name = boundedText(form.get('name'), 1, 70, 'name')
  const experience = boundedText(form.get('experience'), 10, 1500, 'experience')
  const rating = form.get('rating')
  const language = form.get('language')
  if (typeof rating !== 'string' || !/^[1-5]$/.test(rating))
    throw new ReviewError('rating', 400)
  if (language !== 'en' && language !== 'ar')
    throw new ReviewError('invalid', 400)
  if (form.get('consent') !== 'yes') throw new ReviewError('consent', 400)
  const photo = form.get('photo')
  if (typeof photo === 'string' || (photo && photo.size > maxPhotoBytes))
    throw new ReviewError('photoSize', 413)
  if (photo && photo.size > 0 && !photoTypes.includes(photo.type))
    throw new ReviewError('photo', 400)
  return {
    tokenHash,
    name,
    experience,
    rating: Number(rating),
    language,
    photo: photo?.size ? photo : null,
  }
}

export function checkMutation(request: Request, origin: string) {
  if (
    request.headers.get('origin') !== origin ||
    request.headers.get('sec-fetch-site') === 'cross-site' ||
    request.headers.get('x-review-intent') !== '1'
  )
    throw new ReviewError('forbidden', 403)
}

export async function readBody(request: Request, limit: number) {
  const length = request.headers.get('content-length')
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > limit))
    throw new ReviewError('photoSize', 413)
  if (!request.body) throw new ReviewError('invalid', 400)
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > limit) {
        await reader.cancel().catch(() => undefined)
        throw new ReviewError('photoSize', 413)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return bytes
}
