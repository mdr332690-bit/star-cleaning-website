import { parse, type DefaultTreeAdapterMap } from 'parse5'
import robotsParser from 'robots-parser'
import { SaxesParser } from 'saxes'
import { getIndexNowProofUrl, siteOrigin } from './indexNowVerification'

const endpoint = 'https://api.indexnow.org/indexnow'
const sitemapNamespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
const sitemapUrl = `${siteOrigin}/sitemap.xml`
const robotsUrl = `${siteOrigin}/robots.txt`
const batchLimit = 10_000
const excludesIndex = /(?:^|[\s,:])(?:noindex|none)(?=$|[\s,;])/i

function parseSitemap(xml: string) {
  const urls = new Set<string>()
  const parser = new SaxesParser({ xmlns: true })
  const elements: string[] = []
  let location: string | undefined

  parser.on('opentag', (element) => {
    elements.push(element.uri === sitemapNamespace ? element.local : '')
    if (elements.join('/') === 'urlset/url/loc') location = ''
  })
  const capture = (text: string) => {
    if (location !== undefined && elements.length === 3) location += text
  }
  parser.on('text', capture)
  parser.on('cdata', capture)
  parser.on('closetag', () => {
    if (location !== undefined && elements.length === 3) {
      const value = location.trim()
      const url = URL.parse(value)
      if (
        url?.origin === siteOrigin &&
        url.href === value &&
        !url.search &&
        !url.hash &&
        !url.username &&
        !url.password &&
        !/^\/(?:[_.]|\/)/.test(url.pathname)
      ) {
        urls.add(url.href)
      }
      location = undefined
    }
    elements.pop()
  })
  parser.write(xml).close()
  return Array.from(urls)
}

function isIndexable(html: string, url: string) {
  type Element = DefaultTreeAdapterMap['element']
  const elementWithTag = (
    parent: DefaultTreeAdapterMap['parentNode'],
    tag: string,
  ) =>
    parent.childNodes.find(
      (node): node is Element => 'tagName' in node && node.tagName === tag,
    )
  const htmlElement = elementWithTag(
    parse(html, { scriptingEnabled: true }),
    'html',
  )
  const head = htmlElement && elementWithTag(htmlElement, 'head')
  if (!head) return false

  const canonicals: (string | undefined)[] = []
  for (const node of head.childNodes) {
    if (!('tagName' in node)) continue
    const attr = (name: string) =>
      node.attrs.find((item) => item.name === name)?.value
    if (
      node.tagName === 'link' &&
      attr('rel')?.toLowerCase().split(/\s+/).includes('canonical')
    ) {
      canonicals.push(attr('href'))
    }
    if (
      node.tagName === 'meta' &&
      /^(robots|bingbot|yandex|yandexbot|seznambot|naverbot|yeti)$/i.test(
        attr('name') ?? '',
      ) &&
      excludesIndex.test(attr('content') ?? '')
    ) {
      return false
    }
  }
  return canonicals.length === 1 && canonicals[0] === url
}

function isContentType(response: Response, type: string) {
  return (
    response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() ===
    type
  )
}

export async function submitIndexNow(
  key: string | undefined,
  fetchUrl: typeof fetch = fetch,
) {
  const keyLocation = getIndexNowProofUrl(key)
  if (!key || !keyLocation) return { outcome: 'key-not-configured' } as const

  const request = (url: string, options?: RequestInit) =>
    fetchUrl(url, {
      redirect: 'manual',
      credentials: 'omit',
      signal: AbortSignal.timeout(5_000),
      ...options,
    })

  const proof = await request(keyLocation)
  if (
    proof.status !== 200 ||
    !isContentType(proof, 'text/plain') ||
    (await proof.text()) !== key
  ) {
    return { outcome: 'key-not-verified', status: proof.status } as const
  }

  const [sitemap, robots] = await Promise.all([
    request(sitemapUrl),
    request(robotsUrl),
  ])
  if (
    sitemap.status !== 200 ||
    robots.status !== 200 ||
    !isContentType(robots, 'text/plain')
  ) {
    return {
      outcome: 'discovery-unavailable',
      sitemap: sitemap.status,
      robots: robots.status,
    } as const
  }

  const rules = robotsParser(robotsUrl, await robots.text())
  const candidates = parseSitemap(await sitemap.text()).filter((url) =>
    ['*', 'bingbot', 'yandex', 'seznambot', 'yeti'].every((agent) =>
      rules.isAllowed(url, agent),
    ),
  )
  const urlList: string[] = []
  for (let offset = 0; offset < candidates.length; offset += 6) {
    const checked = await Promise.all(
      candidates.slice(offset, offset + 6).map(async (url) => {
        try {
          const page = await request(url)
          return page.status === 200 &&
            isContentType(page, 'text/html') &&
            !excludesIndex.test(page.headers.get('x-robots-tag') ?? '') &&
            isIndexable(await page.text(), url)
            ? url
            : undefined
        } catch {
          return undefined
        }
      }),
    )
    urlList.push(...checked.filter((url) => url !== undefined))
  }

  if (!urlList.length) return { outcome: 'no-indexable-urls' } as const

  const batches: {
    status: number
    result: 'accepted' | 'pending-verification' | 'rejected'
    urls: string[]
  }[] = []
  for (let offset = 0; offset < urlList.length; offset += batchLimit) {
    const urls = urlList.slice(offset, offset + batchLimit)
    const response = await request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(siteOrigin).host,
        key,
        keyLocation,
        urlList: urls,
      }),
    })
    const { status } = response
    const result =
      status === 200
        ? 'accepted'
        : status === 202
          ? 'pending-verification'
          : 'rejected'
    batches.push({ status, result, urls })
  }
  return { outcome: 'submission-attempted', batches } as const
}
