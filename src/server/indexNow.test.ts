// @vitest-environment node
import { readFileSync } from 'node:fs'
import type { DeploySucceededEvent } from '@netlify/functions'
import { afterEach, describe, expect, it, vi } from 'vitest'
import onDeploy from '../../netlify/functions/indexnow-deploy.mts'
import { startInstance } from '../start'
import { submitIndexNow } from './indexNowSubmission'
import {
  getIndexNowProofUrl,
  indexNowVerificationResponse,
  siteOrigin,
} from './indexNowVerification'

const testProof = 'synthetic-proof'
const proofUrl = `${siteOrigin}/${testProof}.txt`
const sitemapUrl = `${siteOrigin}/sitemap.xml`
const robotsUrl = `${siteOrigin}/robots.txt`
const endpoint = 'https://api.indexnow.org/indexnow'
const homeUrl = `${siteOrigin}/`
const arabicUrl = `${siteOrigin}/ar`

function text(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain' },
  })
}

function html(head: string, headers?: HeadersInit) {
  const responseHeaders = new Headers(headers)
  responseHeaders.set('Content-Type', 'text/html; charset=utf-8')
  return new Response(`<html><head>${head}</head><body>Page</body></html>`, {
    headers: responseHeaders,
  })
}

function canonical(url: string) {
  return `<link rel="canonical" href="${url}">`
}

function sitemap(urls: string[]) {
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}
  </urlset>`
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('IndexNow proof', () => {
  it('serves the exact proof as plain text on the canonical root URL', async () => {
    const response = indexNowVerificationResponse(
      new Request(proofUrl),
      testProof,
    )
    expect(getIndexNowProofUrl(testProof)).toBe(proofUrl)
    expect(response?.status).toBe(200)
    expect(response?.headers.get('content-type')).toBe(
      'text/plain; charset=utf-8',
    )
    expect(await response?.text()).toBe(testProof)
  })

  it('supports HEAD and rejects other methods', async () => {
    const head = indexNowVerificationResponse(
      new Request(proofUrl, { method: 'HEAD' }),
      testProof,
    )
    expect(head?.status).toBe(200)
    expect(await head?.text()).toBe('')
    const post = indexNowVerificationResponse(
      new Request(proofUrl, { method: 'POST' }),
      testProof,
    )
    expect(post?.status).toBe(405)
    expect(post?.headers.get('allow')).toBe('GET, HEAD')
  })

  it('never intercepts existing routes, preview hosts or unconfigured proof requests', () => {
    expect(
      indexNowVerificationResponse(new Request(proofUrl), undefined),
    ).toBeUndefined()
    expect(getIndexNowProofUrl('../invalid')).toBeUndefined()
    for (const url of [
      homeUrl,
      arabicUrl,
      robotsUrl,
      sitemapUrl,
      `${proofUrl}?other`,
      `https://preview.example/${testProof}.txt`,
      `${siteOrigin}/unrelated.txt`,
    ]) {
      expect(
        indexNowVerificationResponse(new Request(url), testProof),
      ).toBeUndefined()
    }
  })

  it.each([
    { variable: 'INDEXNOW_KEY_V2', status: 200 },
    { variable: 'INDEXNOW_KEY', status: 404 },
  ])('returns $status when only $variable is configured', async ({ variable, status }) => {
    vi.stubEnv('INDEXNOW_KEY', undefined)
    vi.stubEnv('INDEXNOW_KEY_V2', undefined)
    vi.stubEnv(variable, testProof)

    const request = new Request(proofUrl)
    const pathname = new URL(proofUrl).pathname
    const fallback = new Response(null, { status: 404 })
    const { requestMiddleware } = await startInstance.getOptions()
    const result = await requestMiddleware?.[0].options.server?.({
      request,
      pathname,
      context: undefined,
      handlerType: 'router',
      next: vi.fn().mockReturnValue({ request, pathname, response: fallback }),
    })

    const response = result instanceof Response ? result : result?.response
    expect(response?.status).toBe(status)
    expect(await response?.text()).toBe(status === 200 ? testProof : '')
  })
})

describe('IndexNow submissions', () => {
  it('tests all 14 sitemap pages and posts both languages in a single batch', async () => {
    const actualSitemap = readFileSync(
      new URL('../../public/sitemap.xml', import.meta.url),
      'utf8',
    )
    const sitemapUrls = [...actualSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    )
    expect(sitemapUrls).toHaveLength(14)
    expect(
      sitemapUrls.filter((url) => new URL(url).pathname.match(/^\/ar(?:\/|$)/)),
    ).toHaveLength(7)

    const request = vi.fn<typeof fetch>(async (url) => {
      if (url === proofUrl) return text(testProof)
      if (url === sitemapUrl) return text(actualSitemap)
      if (url === robotsUrl) return text('User-agent: *\nAllow: /')
      if (url === endpoint) return new Response(null, { status: 200 })
      return html(canonical(String(url)))
    })

    expect(await submitIndexNow(testProof, request)).toEqual({
      outcome: 'submission-attempted',
      batches: [{ status: 200, result: 'accepted', urls: sitemapUrls }],
    })
    const [, submission] = request.mock.calls.at(-1) ?? []
    expect(request).toHaveBeenLastCalledWith(
      endpoint,
      expect.objectContaining({
        method: 'POST',
        redirect: 'manual',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }),
    )
    expect(JSON.parse(String(submission?.body))).toEqual({
      host: new URL(siteOrigin).host,
      key: testProof,
      keyLocation: proofUrl,
      urlList: sitemapUrls,
    })
  })

  it('excludes duplicates, private, missing, redirected, noindex and noncanonical pages', async () => {
    const paths = [
      '/private',
      '/missing',
      '/moved',
      '/canonical-elsewhere',
      '/header-noindex',
      '/meta-noindex',
      '/commented-canonical',
      '/robots-blocked',
      '/bing-blocked',
      '/not-html',
    ]
    const urls = paths.map((path) => `${siteOrigin}${path}`)
    const request = vi.fn<typeof fetch>(async (url) => {
      if (url === proofUrl) return text(testProof)
      if (url === sitemapUrl)
        return text(
          sitemap([
            homeUrl,
            arabicUrl,
            homeUrl,
            ...urls,
            'https://other.example/',
            `${arabicUrl}?source=ads`,
            `${homeUrl}#contact`,
            `${siteOrigin}/__forms.html`,
          ]),
        )
      if (url === robotsUrl)
        return text(
          'User-agent: *\nDisallow: /robots-blocked\n\nUser-agent: bingbot\nDisallow: /bing-blocked',
        )
      if (url === endpoint) return new Response(null, { status: 202 })
      switch (new URL(String(url)).pathname) {
        case '/private':
          return text('Forbidden', 403)
        case '/missing':
          return text('Not found', 404)
        case '/moved':
          return Response.redirect(`${siteOrigin}/not-in-sitemap`, 301)
        case '/canonical-elsewhere':
          return html(canonical(homeUrl))
        case '/header-noindex':
          return html(canonical(String(url)), {
            'X-Robots-Tag': 'bingbot: noindex',
          })
        case '/meta-noindex':
          return html(
            `${canonical(String(url))}<meta name="robots" content="none">`,
          )
        case '/commented-canonical':
          return html(`<!-- ${canonical(String(url))} -->`)
        case '/not-html':
          return text(canonical(String(url)))
        default:
          return html(canonical(String(url)))
      }
    })

    expect(await submitIndexNow(testProof, request)).toEqual({
      outcome: 'submission-attempted',
      batches: [
        {
          status: 202,
          result: 'pending-verification',
          urls: [homeUrl, arabicUrl],
        },
      ],
    })
    const visited = request.mock.calls.map(([url]) => url)
    expect(visited).not.toContain(`${siteOrigin}/not-in-sitemap`)
    expect(visited).not.toContain('https://other.example/')
    expect(visited).not.toContain(`${siteOrigin}/robots-blocked`)
    expect(visited).not.toContain(`${siteOrigin}/bing-blocked`)
    expect(visited).not.toContain(`${siteOrigin}/__forms.html`)
  })

  it('does not send anything when configuration is absent', async () => {
    const request = vi.fn<typeof fetch>()
    expect(await submitIndexNow(undefined, request)).toEqual({
      outcome: 'key-not-configured',
    })
    expect(request).not.toHaveBeenCalled()
  })

  it.each([
    [404, 'the proof is missing', () => text('Not found', 404)],
    [
      200,
      'the proof body does not match',
      () => text('Not the expected proof'),
    ],
    [
      200,
      'the proof is returned as HTML',
      () => html(`<title>${testProof}</title>`),
    ],
    [302, 'the proof URL redirects', () => Response.redirect(homeUrl, 302)],
  ] as const)(
    'does not submit for HTTP %i when %s',
    async (status, _case, proof) => {
      const request = vi.fn<typeof fetch>().mockResolvedValueOnce(proof())
      expect(await submitIndexNow(testProof, request)).toEqual({
        outcome: 'key-not-verified',
        status,
      })
      expect(request).toHaveBeenCalledTimes(1)
    },
  )

  it('does not submit when no URL is indexable', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(text(testProof))
      .mockResolvedValueOnce(text(sitemap([homeUrl])))
      .mockResolvedValueOnce(text('User-agent: *\nDisallow: /'))

    expect(await submitIndexNow(testProof, request)).toEqual({
      outcome: 'no-indexable-urls',
    })
    expect(request).toHaveBeenCalledTimes(3)
  })

  it('fails closed when discovery data is unavailable', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(text(testProof))
      .mockResolvedValueOnce(text(sitemap([homeUrl])))
      .mockResolvedValueOnce(Response.redirect(homeUrl, 307))
    expect(await submitIndexNow(testProof, request)).toEqual({
      outcome: 'discovery-unavailable',
      sitemap: 200,
      robots: 307,
    })
    expect(request).toHaveBeenCalledTimes(3)
  })
})

describe('Netlify deploy trigger', () => {
  const publishedDeploy = {
    context: 'production',
    branch: 'main',
    state: 'ready',
    publishedAt: '2026-11-22T23:00:00Z',
  } satisfies Partial<DeploySucceededEvent['deploy']>

  function deployEvent(
    overrides: Partial<DeploySucceededEvent['deploy']> = {},
  ) {
    return {
      deploy: { ...publishedDeploy, ...overrides },
    } as DeploySucceededEvent
  }

  function mockNetlifyEnv(values: Record<string, string | undefined>) {
    const get = vi.fn((name: string) => values[name])
    vi.stubGlobal('Netlify', { env: { get } })
    return get
  }

  it.each([
    { context: 'deploy-preview' },
    { branch: 'feature' },
    { state: 'error' },
    { publishedAt: null },
  ])(
    'ignores events outside the published production flow: %o',
    async (overrides) => {
      const request = vi.fn<typeof fetch>()
      vi.stubGlobal('fetch', request)
      const get = mockNetlifyEnv({ INDEXNOW_KEY_V2: testProof })

      await onDeploy.deploySucceeded(deployEvent(overrides))

      expect(get).not.toHaveBeenCalled()
      expect(request).not.toHaveBeenCalled()
    },
  )

  it('does not send anything when only the legacy variable is configured', async () => {
    const request = vi.fn<typeof fetch>()
    const log = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubGlobal('fetch', request)
    mockNetlifyEnv({ INDEXNOW_KEY: testProof })

    await onDeploy.deploySucceeded(deployEvent())

    expect(request).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('IndexNow:', {
      outcome: 'key-not-configured',
    })
  })

  it('runs after the production branch is published and reports the HTTP result', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(text(testProof))
      .mockResolvedValueOnce(text(sitemap([homeUrl])))
      .mockResolvedValueOnce(text('User-agent: *\nAllow: /'))
      .mockResolvedValueOnce(html(canonical(homeUrl)))
      .mockResolvedValueOnce(new Response(null, { status: 429 }))
    const log = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubGlobal('fetch', request)
    mockNetlifyEnv({ INDEXNOW_KEY_V2: testProof })

    await onDeploy.deploySucceeded(deployEvent())

    expect(log).toHaveBeenCalledWith('IndexNow:', {
      outcome: 'submission-attempted',
      batches: [{ status: 429, result: 'rejected', urls: [homeUrl] }],
    })
    expect(JSON.stringify(log.mock.calls)).not.toContain(testProof)
  })
})
