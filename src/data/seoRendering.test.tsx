// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createMemoryHistory } from '@tanstack/react-router'
import { RouterServer } from '@tanstack/react-router/ssr/server'
import { renderToString } from 'react-dom/server'
import { beforeAll, describe, expect, it } from 'vitest'
import { getRouter } from '../router'
import { site } from './site'
import { copy } from './content'
import { localEnquiryCopy, localServiceAdvice } from './localSeo'
import { findServicePage } from './servicePages'
import { homeHeroImage, serviceHeroImage } from './images'

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

  it.each(paths)('renders a matching responsive hero preload on %s', (path) => {
    const html = pages.get(path)!
    const service = findServicePage(path.split('/').at(-1)!)
    const hero = service ? serviceHeroImage(service.image) : homeHeroImage
    const preload = html.match(/<link\b[^>]*as="image"[^>]*>/g) ?? []
    expect(preload).toHaveLength(1)
    const escaped = (value: string) => value.replace(/&/g, '&amp;')
    // React 19 already emits the responsive preload for the high-priority
    // image. An extra head preload can fetch a redundant mobile resource.
    expect(preload[0]).toContain(`imageSrcSet="${escaped(hero.srcSet)}"`)
    expect(preload[0]).toContain(`imageSizes="${hero.sizes}"`)
    expect(preload[0]).toContain('fetchPriority="high"')
    const image = html.match(/<img\b[^>]*fetchPriority="high"[^>]*>/g) ?? []
    expect(image).toHaveLength(1)
    expect(image[0]).toContain(`srcSet="${escaped(hero.srcSet)}"`)
    expect(image[0]).toContain(`sizes="${hero.sizes}"`)
    expect(image[0]).not.toContain('loading="lazy"')
  })

  it.each(paths)(
    'keeps local enquiry content translated and conditional on %s',
    (path) => {
      const html = pages.get(path)!
      const lang = path.startsWith('/ar') ? 'ar' : 'en'
      const section = html.match(
        /<section\b[^>]*id="location-enquiry"[^>]*>([\s\S]*?)<\/section>/,
      )?.[1]
      expect(section).toContain(localEnquiryCopy[lang].title)
      expect(section).toContain(localEnquiryCopy[lang].note)
      const locations =
        lang === 'en'
          ? [
              'Kuwait City',
              'Hawally',
              'Salmiya',
              'Farwaniya',
              'Jahra',
              'Ahmadi',
              'Mubarak Al-Kabeer',
            ]
          : [
              'مدينة الكويت',
              'حولي',
              'السالمية',
              'الفروانية',
              'الجهراء',
              'الأحمدي',
              'مبارك الكبير',
            ]
      for (const location of locations) expect(section).toContain(location)
      const service = findServicePage(path.split('/').at(-1)!)
      if (service)
        expect(section).toContain(localServiceAdvice[service.id][lang])
      expect(section).toContain(`href="${service ? '#contact' : '#booking'}"`)
      // Unconfirmed neighbourhoods must not become schema service areas/branches.
      const schema = html.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
      )?.[1]
      for (const location of locations) expect(schema).not.toContain(location)
      expect(html).toContain(
        `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`,
      )
    },
  )

  it.each(['/', '/ar'])(
    'answers female-cleaner searches truthfully on %s',
    (path) => {
      const html = pages.get(path)!
      const question =
        path === '/ar'
          ? 'هل توفرون عاملات تنظيف في الكويت؟'
          : 'Do you provide female cleaning staff in Kuwait?'
      const answer =
        path === '/ar'
          ? 'لا، توفر ستار كلينينج طاقم تنظيف من الرجال فقط.'
          : 'No. Star Cleaning provides male cleaning staff only.'
      expect(html).toContain(question)
      expect(html).toContain(answer)
    },
  )

  it.each(paths)(
    'keeps Google links hidden when verified destinations are unset on %s',
    async (path) => {
      const originalReviewUrl = site.googleReviewUrl
      const originalProfileUrl = site.googleBusinessProfileUrl
      site.googleReviewUrl = ''
      site.googleBusinessProfileUrl = ''
      try {
        const { html } = await render(path)
        expect(html).not.toContain('google-business-links')
        expect(html).not.toContain('3nkpHdm3U7cpacnU8')
      } finally {
        site.googleReviewUrl = originalReviewUrl
        site.googleBusinessProfileUrl = originalProfileUrl
      }
    },
  )

  it.each(paths)(
    'prepares localized Google links in the contact area and footer on %s',
    async (path) => {
      // These reserved test URLs are never used as real business destinations.
      const reviewUrl = 'https://reviews.example.test/submit'
      const profileUrl = 'https://maps.example.test/star-cleaning-service'
      const originalReviewUrl = site.googleReviewUrl
      const originalProfileUrl = site.googleBusinessProfileUrl
      site.googleReviewUrl = reviewUrl
      site.googleBusinessProfileUrl = profileUrl
      try {
        const { html } = await render(path)
        const lang = path.startsWith('/ar') ? 'ar' : 'en'
        const t = copy[lang]
        expect(html).toContain(
          `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`,
        )
        const contact = html.match(
          /<section\b[^>]*id="contact"[^>]*>([\s\S]*?)<\/section>/,
        )?.[1]
        const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1]
        for (const area of [contact, footer]) {
          expect(area).toContain(`href="${reviewUrl}"`)
          expect(area).toContain(`href="${profileUrl}"`)
          expect(area).toContain(t.googleReview)
          expect(area).toContain(t.googleBusinessProfile)
          expect(area).toContain(t.opensNewTab)
        }
        if (path === '/' || path === '/ar') {
          const testimonials = html.match(
            /<section\b[^>]*id="testimonials"[^>]*>([\s\S]*?)<\/section>/,
          )?.[1]
          expect(testimonials).toContain(`href="${reviewUrl}"`)
          expect(testimonials).toContain(t.reviewsBadge)
          expect(html).toContain(
            'name="form-name" value="star-cleaning-booking"',
          )
        }
        expect(html).toContain('href="tel:+96550258260"')
        expect(html).toContain('href="https://wa.me/96550258260"')
        expect(html).not.toContain('"aggregateRating"')
        expect(html).not.toContain('3nkpHdm3U7cpacnU8')
      } finally {
        site.googleReviewUrl = originalReviewUrl
        site.googleBusinessProfileUrl = originalProfileUrl
      }
    },
  )

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
