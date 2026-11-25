// @vitest-environment node
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { moderatorIdentity } from './reviewApi'
import { sanitizeReviewImage } from './reviewImages'
import { reviewEnvironment } from './reviewRuntime'
import {
  checkMutation,
  inviteHash,
  makeInvite,
  maxPhotoBytes,
  readBody,
  reviewInput,
} from './reviewValidation'

const origin = 'https://synthetic.example.test'
const validForm = (language = 'en') => {
  const data = new FormData()
  data.set('code', makeInvite())
  data.set('rating', '4')
  data.set(
    'name',
    language === 'ar' ? 'عميل اختبار اصطناعي' : 'Synthetic Test Customer',
  )
  data.set(
    'experience',
    language === 'ar'
      ? 'هذا نص تجريبي غير حقيقي.'
      : 'This is a synthetic review, not customer feedback.',
  )
  data.set('language', language)
  data.set('consent', 'yes')
  return data
}

describe('review request security', () => {
  it.each(['en', 'ar'])('validates a synthetic %s submission', (lang) => {
    const data = validForm(lang)
    const input = reviewInput(data)
    expect(input).toMatchObject({ language: lang, rating: 4, photo: null })
    expect(input.tokenHash).toMatch(/^[a-f0-9]{64}$/)
    expect(input).not.toHaveProperty('code')
  })

  it.each([
    ['name', ''],
    ['experience', 'short'],
    ['rating', '0'],
    ['rating', '6'],
    ['rating', '1.5'],
    ['consent', ''],
    ['website', 'spam'],
    ['code', 'garbage'],
  ])('rejects invalid %s values', (field, value) => {
    const data = validForm()
    data.set(field, value)
    expect(() => reviewInput(data)).toThrow()
  })

  it('rejects missing or duplicate fields and checks cryptographic invite format', () => {
    const first = makeInvite()
    expect(first).not.toBe(makeInvite())
    expect(inviteHash(first)).not.toBe(first)
    const data = validForm()
    data.delete('code')
    expect(() => reviewInput(data)).toThrow('invitation')
    data.set('code', first)
    data.append('rating', '1')
    expect(() => reviewInput(data)).toThrow('invalid')
  })

  it('checks Origin and the CSRF intent header', () => {
    const request = (headers: HeadersInit) =>
      new Request(`${origin}/api/reviews/submit`, { method: 'POST', headers })
    expect(() =>
      checkMutation(request({ origin, 'x-review-intent': '1' }), origin),
    ).not.toThrow()
    expect(() =>
      checkMutation(
        request({
          origin,
          'x-review-intent': '1',
          'sec-fetch-site': 'cross-site',
        }),
        origin,
      ),
    ).toThrow('forbidden')
    expect(() =>
      checkMutation(
        request({
          origin: 'https://third-party.example',
          'x-review-intent': '1',
        }),
        origin,
      ),
    ).toThrow('forbidden')
    expect(() => checkMutation(request({ origin }), origin)).toThrow(
      'forbidden',
    )
    expect(() =>
      checkMutation(request({ 'x-review-intent': '1' }), origin),
    ).toThrow('forbidden')
  })

  it('limits both declared and actual body sizes', async () => {
    await expect(
      readBody(
        new Request(origin, {
          method: 'POST',
          body: '1234',
          headers: { 'content-length': '9999' },
        }),
        6,
      ),
    ).rejects.toThrow('photoSize')
    await expect(
      readBody(
        new Request(origin, {
          method: 'POST',
          body: '1234567',
          headers: { 'content-length': '1' },
        }),
        6,
      ),
    ).rejects.toThrow('photoSize')
    expect(
      await readBody(new Request(origin, { method: 'POST', body: 'abc' }), 3),
    ).toEqual(new Uint8Array([97, 98, 99]))
  })
})

describe('photo sanitization', () => {
  const syntheticPixel = sharp({
    create: { width: 2, height: 2, channels: 3, background: '#abc' },
  })
  it.each([
    ['jpeg', 'image/jpeg'],
    ['png', 'image/png'],
    ['webp', 'image/webp'],
  ] as const)('decodes and re-encodes a synthetic %s', async (format, mime) => {
    const source = await syntheticPixel
      .clone()
      .toFormat(format)
      .withMetadata({
        orientation: 3,
        exif: { IFD0: { Artist: 'Synthetic Metadata' } },
      })
      .toBuffer()
    const data = validForm()
    data.set(
      'photo',
      new File([Uint8Array.from(source)], 'test-image', { type: mime }),
    )
    const result = await sanitizeReviewImage(reviewInput(data).photo!)
    expect(await sharp(result).metadata()).toMatchObject({
      width: 2,
      height: 2,
      format: 'webp',
    })
    expect((await sharp(result).metadata()).exif).toBeUndefined()
  })

  it('rejects spoofed MIME, SVG, malformed, oversized and over-pixel-limit uploads', async () => {
    const fakeSvg = new File(
      ['<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"/>'],
      'synthetic.jpeg',
      { type: 'image/jpeg' },
    )
    await expect(sanitizeReviewImage(fakeSvg)).rejects.toThrow('photo')
    await expect(
      sanitizeReviewImage(
        new File(['broken'], 'broken.webp', { type: 'image/webp' }),
      ),
    ).rejects.toThrow('photo')
    await expect(
      sanitizeReviewImage(
        new File([new Uint8Array(maxPhotoBytes + 1)], 'big.png', {
          type: 'image/png',
        }),
      ),
    ).rejects.toThrow('photoSize')
    const oversized = await sharp({
      create: { width: 4500, height: 4000, channels: 3, background: '#fff' },
    })
      .png()
      .toBuffer()
    await expect(
      sanitizeReviewImage(
        new File([Uint8Array.from(oversized)], 'pixel-limit.png', {
          type: 'image/png',
        }),
      ),
    ).rejects.toThrow('photo')
  })

  it('rejects animated WebP', async () => {
    const pixels = Buffer.from([1, 2, 3, 4, 5, 6, 150, 151, 152, 153, 154, 155])
    const source = await sharp(pixels, {
      raw: { width: 2, height: 2, channels: 3, pageHeight: 1 },
    })
      .webp({ delay: [100, 100] })
      .toBuffer()
    expect((await sharp(source).metadata()).pages).toBe(2)
    await expect(
      sanitizeReviewImage(
        new File([Uint8Array.from(source)], 'animation.webp', {
          type: 'image/webp',
        }),
      ),
    ).rejects.toThrow('photo')
  })
})

describe('moderator isolation', () => {
  const preview = reviewEnvironment({
    deploy: {
      context: 'deploy-preview',
      id: '1234567890abcdef12345678',
      published: false,
    },
  })
  const production = reviewEnvironment({
    deploy: {
      context: 'production',
      id: '1234567890abcdef12345678',
      published: true,
    },
  })
  it('requires a verified user with the role for this deploy context', () => {
    const previewUser = {
      id: 'synthetic-staff',
      confirmedAt: '2026-01-01',
      roles: [preview.role],
    }
    expect(() => moderatorIdentity(null, preview.role)).toThrow('signIn')
    expect(() =>
      moderatorIdentity({ ...previewUser, roles: [] }, preview.role),
    ).toThrow('forbidden')
    expect(() =>
      moderatorIdentity(
        { ...previewUser, confirmedAt: undefined },
        preview.role,
      ),
    ).toThrow('forbidden')
    expect(() => moderatorIdentity(previewUser, production.role)).toThrow(
      'forbidden',
    )
    expect(moderatorIdentity(previewUser, preview.role)).toBe('synthetic-staff')
    expect(preview.scope).not.toBe(production.scope)
  })

  it('fails closed for unknown or unpublished production deploys', () => {
    expect(() => reviewEnvironment(undefined)).toThrow('unavailable')
    expect(() =>
      reviewEnvironment({
        deploy: { context: 'production', id: 'draft', published: false },
      }),
    ).toThrow('unavailable')
  })
})
