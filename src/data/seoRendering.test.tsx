// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createMemoryHistory } from '@tanstack/react-router'
import { RouterServer } from '@tanstack/react-router/ssr/server'
import { renderToString } from 'react-dom/server'
import { beforeAll, describe, expect, it } from 'vitest'
import { getRouter } from '../router'

const origin = 'https://star-cleaning-website.netlify.app'
const sitemap = readFileSync(
  new URL('../../public/sitemap.xml', import.meta.url),
  'utf8',
)
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
)
const pages = new Map<string, string>()

async function render(path: string) {
  const router = getRouter()
  router.update({ history: createMemoryHistory({ initialEntries: [path] }) })
  await router.load()
  return {
    html: renderToString(<RouterServer router={router} />),
  }
}

beforeAll(async () => {
  for (const path of paths) pages.set(path, (await render(path)).html)
})

describe('search-engine-visible route output', () => {
  it.each(paths)('renders indexable, complete SEO on %s', (path) => {
    const html = pages.get(path)!
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? ''
    expect([...head.matchAll(/<title>/g)]).toHaveLength(1)
    expect([...head.matchAll(/name="description"/g)]).toHaveLength(1)
    expect([...head.matchAll(/name="robots"/g)]).toHaveLength(1)
    expect(head).toContain('content="index, follow, max-image-preview:large"')
    expect(head).not.toContain('noindex')
    expect([...head.matchAll(/rel="canonical"/g)]).toHaveLength(1)
    expect(head).toContain(`href="${origin}${path}"`)
    expect(head).toContain(`property="og:url" content="${origin}${path}"`)
    expect(head).toContain('name="twitter:card" content="summary_large_image"')
    expect([...html.matchAll(/<h1\b/g)]).toHaveLength(1)
    expect(html).toContain('href="tel:+96550258260"')
    expect(html).toContain('href="https://wa.me/96550258260"')
    expect(html).not.toContain('<video')
    const schema = head.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1]
    expect(schema).toBeTruthy()
    expect(() => JSON.parse(schema!)).not.toThrow()
  })

  it('keeps every internal page and fragment link resolvable without JavaScript', () => {
    for (const [path, html] of pages) {
      const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(
        (match) => match[1].replace(/&amp;/g, '&'),
      )
      for (const href of hrefs) {
        const url = new URL(href, origin + path)
        if (url.origin !== origin) continue
        const destination = pages.get(url.pathname)
        expect(destination, `Missing page from ${path}: ${href}`).toBeDefined()
        if (url.hash) {
          expect(
            destination,
            `Missing fragment from ${path}: ${href}`,
          ).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`)
        }
      }
    }
  })

  it.each(['/', '/ar'])(
    'exposes all five service-page links near the cards on %s',
    (path) => {
      const html = pages.get(path)!
      const directory = html.match(
        /<nav class="service-directory"[^>]*>([\s\S]*?)<\/nav>/,
      )?.[1]
      expect([...directory!.matchAll(/<a\b/g)]).toHaveLength(5)
      expect(html).toContain(
        path === '/ar' ? 'تنظيف الأرضيات' : 'floor cleaning',
      )
    },
  )

  it.each([
    '/does-not-exist',
    '/services/not-a-service',
    '/ar/services/not-a-service',
  ])('keeps missing routes noindex without a canonical on %s', async (path) => {
    const { html } = await render(path)
    expect(html).toContain('name="robots" content="noindex, follow"')
    expect(html).not.toContain('rel="canonical"')
  })

  it('canonicalizes campaign queries without losing the requested language', async () => {
    const { html } = await render('/ar?utm_source=google&gclid=test-click')
    expect(html).toContain('<html lang="ar" dir="rtl">')
    expect(html).toContain(`rel="canonical" href="${origin}/ar"`)
  })
})
