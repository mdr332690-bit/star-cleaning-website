// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reviewApi } from './reviewApi'

const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  settings: vi.fn(),
  dashboard: vi.fn(),
  photo: vi.fn(),
  invite: vi.fn(),
  moderate: vi.fn(),
  changeInvitation: vi.fn(),
  throttle: vi.fn(),
  cleanup: vi.fn(),
  checkInvitation: vi.fn(),
  submit: vi.fn(),
  list: vi.fn(),
  waitUntil: vi.fn(),
}))
const origin = 'https://synthetic.example.test'
const reviewId = '11111111-1111-4111-8111-111111111111'
vi.mock('@netlify/functions', () => ({
  getContext: () => ({
    url: new URL(origin),
    ip: '192.0.2.1',
    waitUntil: mocks.waitUntil,
    deploy: { context: 'deploy-preview', id: '1234567890abcdef12345678' },
  }),
}))
vi.mock('@netlify/identity', () => ({
  getSettings: mocks.settings,
  getUser: mocks.user,
  login: vi.fn(),
  logout: vi.fn(),
}))
vi.mock('./reviewRuntime', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./reviewRuntime')>()),
  runtimeReviewStore: () => mocks,
}))

const authorized = {
  id: 'synthetic-staff',
  roles: ['review-preview-moderator'],
  confirmedAt: '2026-11-25',
}
const get = (path: string) =>
  reviewApi(new Request(`${origin}/api/reviews/${path}`), path)
const post = (path: string, body: unknown, sender = origin) =>
  reviewApi(
    new Request(`${origin}/api/reviews/${path}`, {
      method: 'POST',
      headers: {
        'X-Review-Intent': '1',
        'Content-Type': 'application/json',
        Origin: sender,
      },
      body: JSON.stringify(body),
    }),
    path,
  )

beforeEach(() => {
  vi.resetAllMocks()
  mocks.user.mockResolvedValue(authorized)
  mocks.settings.mockResolvedValue({ disableSignup: true })
  mocks.cleanup.mockResolvedValue(undefined)
})

describe('admin API enforcement', () => {
  it('checks authorization on every read and mutation, including photo previews', async () => {
    mocks.user.mockResolvedValue(null)
    expect((await get('admin')).status).toBe(401)
    expect((await get(`admin/photo/${reviewId}`)).status).toBe(401)
    expect(
      (await post('admin', { action: 'approve', id: reviewId })).status,
    ).toBe(401)
    expect(mocks.dashboard).not.toHaveBeenCalled()
    expect(mocks.photo).not.toHaveBeenCalled()
    expect(mocks.moderate).not.toHaveBeenCalled()
    mocks.user.mockResolvedValue({ ...authorized, roles: ['review-moderator'] })
    expect((await get('admin')).status).toBe(403)
    expect(
      (await post('admin', { action: 'invite', job: 'SYNTHETIC-JOB', days: 3 }))
        .status,
    ).toBe(403)
  })

  it('fails closed if self-signup is enabled or an action is cross-origin', async () => {
    mocks.settings.mockResolvedValue({ disableSignup: false })
    expect((await get('admin')).status).toBe(503)
    expect(
      (
        await post(
          'admin',
          { action: 'reject', id: reviewId },
          'https://cross-origin.example',
        )
      ).status,
    ).toBe(403)
    expect(mocks.moderate).not.toHaveBeenCalled()
  })

  it('routes approved staff operations and prevents shared caching and indexing', async () => {
    mocks.dashboard.mockResolvedValue({
      items: [],
      links: [],
      history: [],
      hasMore: false,
    })
    const dashboard = await get('admin')
    expect(dashboard.status).toBe(200)
    expect(dashboard.headers.get('cache-control')).toContain('no-store')
    expect(dashboard.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(
      (await post('admin', { action: 'reject', id: reviewId })).status,
    ).toBe(400)
    expect(
      (await post('admin', { action: 'approve', id: reviewId })).status,
    ).toBe(200)
    expect(
      (
        await post('admin', {
          action: 'reject',
          id: reviewId,
          reason: 'Synthetic reason',
        })
      ).status,
    ).toBe(200)
    expect(
      (
        await post('admin', {
          action: 'delete',
          id: reviewId,
          reason: 'Synthetic deletion',
        })
      ).status,
    ).toBe(200)
    expect(mocks.moderate.mock.calls.map((args) => args[1])).toEqual([
      'approve',
      'reject',
      'delete',
    ])
    mocks.invite.mockResolvedValue({
      expiresAt: '2026-12-01',
      code: 'S'.repeat(43),
    })
    expect(
      (await post('admin', { action: 'invite', job: 'synthetic-001', days: 3 }))
        .status,
    ).toBe(201)
    expect(mocks.invite).toHaveBeenCalledWith('SYNTHETIC-001', 3, authorized.id)
    expect(
      (
        await post('admin', {
          action: 'revoke',
          id: reviewId,
          reason: 'Synthetic revocation',
        })
      ).status,
    ).toBe(200)
    expect(mocks.changeInvitation).toHaveBeenCalledWith(
      reviewId,
      authorized.id,
      'Synthetic revocation',
      undefined,
    )
  })
})

describe('public API boundaries', () => {
  it('uses approved-only photo reads and never caches images', async () => {
    mocks.photo
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new ArrayBuffer(2))
    expect((await get(`photo/${reviewId}`)).status).toBe(404)
    const visible = await get(`photo/${reviewId}`)
    expect(visible.status).toBe(200)
    expect(visible.headers.get('content-type')).toBe('image/webp')
    expect(visible.headers.get('netlify-cdn-cache-control')).toBe('no-store')
    expect(mocks.photo).toHaveBeenCalledWith(reviewId)
  })

  it('accepts verified multipart submissions as pending and never returns their private data', async () => {
    const data = new FormData()
    const code = 'S'.repeat(43)
    data.set('code', code)
    data.set('name', 'Synthetic Review Author')
    data.set('experience', 'Synthetic automated test review.')
    data.set('rating', '4')
    data.set('language', 'en')
    data.set('consent', 'yes')
    const request = new Request(`${origin}/api/reviews/submit`, {
      method: 'POST',
      body: data,
      headers: { Origin: origin, 'X-Review-Intent': '1' },
    })
    const response = await reviewApi(request, 'submit')
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ pending: true })
    expect(mocks.checkInvitation).toHaveBeenCalledWith(
      expect.stringMatching(/^[a-f0-9]{64}$/),
    )
    expect(mocks.submit.mock.calls[0][0].tokenHash).not.toBe(code)
  })
})
