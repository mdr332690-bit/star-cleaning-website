// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import robotsParser from 'robots-parser'
import { describe, expect, it } from 'vitest'
import { createSeoHead, pageStructuredData } from './seo'
import { findServicePage, servicePages } from './servicePages'
import type { Language } from './content'

const origin = 'https://starcleaningkw.com'
const pages = (['en', 'ar'] as const).flatMap((lang) => [
  { lang, service: undefined, path: lang === 'en' ? '/' : '/ar' },
  ...servicePages.map((service) => ({
    lang,
    service,
    path: `${lang === 'ar' ? '/ar' : ''}/services/${service.page.slug}`,
  })),
])

describe('bilingual SEO contracts', () => {
  it.each(pages)(
    'publishes one canonical and reciprocal language links for $path',
    ({ lang, service, path }) => {
      const head = createSeoHead(lang, service)
      expect(head.links.filter((link) => link.rel === 'canonical')).toEqual([
        { rel: 'canonical', href: origin + path },
      ])
      const alternates = head.links.filter((link) => link.rel === 'alternate')
      expect(alternates.map((link) => link.hrefLang).sort()).toEqual([
        'ar',
        'en',
        'x-default',
      ])
      const ownLink = alternates.find((link) => link.hrefLang === lang)
      expect(ownLink?.href).toBe(origin + path)
      const defaultLink = alternates.find(
        (link) => link.hrefLang === 'x-default',
      )
      expect(defaultLink?.href).toBe(
        alternates.find((link) => link.hrefLang === 'en')?.href,
      )
      for (const alternate of alternates.filter(
        (link) => link.hrefLang !== 'x-default',
      )) {
        const otherHead = createSeoHead(alternate.hrefLang as Language, service)
        expect(otherHead.links).toContainEqual({
          rel: 'alternate',
          hrefLang: lang,
          href: origin + path,
        })
      }
    },
  )

  it('gives all canonical pages distinct titles and descriptions', () => {
    const heads = pages.map(({ lang, service }) => createSeoHead(lang, service))
    expect(
      new Set(
        heads.map((head) => head.meta.find((tag) => 'title' in tag)?.title),
      ).size,
    ).toBe(pages.length)
    const descriptions = heads.map(
      (head) =>
        head.meta.find((tag) => 'name' in tag && tag.name === 'description')
          ?.content,
    )
    expect(new Set(descriptions).size).toBe(pages.length)
    expect(
      descriptions.every(
        (description) => description && description.length > 70,
      ),
    ).toBe(true)
  })

  it.each(pages)(
    'uses matching titles, descriptions, and social images on $path',
    ({ lang, service }) => {
      const { meta } = createSeoHead(lang, service)
      const title = meta.find((tag) => 'title' in tag)?.title
      const social = (key: string) =>
        meta.find((tag) => tag.property === key || tag.name === key)?.content

      expect(social('og:title')).toBe(title)
      expect(social('twitter:title')).toBe(title)
      expect(social('og:description')).toBe(social('description'))
      expect(social('twitter:description')).toBe(social('description'))
      expect(social('twitter:image')).toBe(social('og:image'))
      expect(social('twitter:image:alt')).toBe(social('og:image:alt'))
      expect(social('og:image:type')).toBe('image/jpeg')

      const image = new URL(social('og:image')!)
      expect(image.origin).toBe(origin)
      const source = image.searchParams.get('url') ?? image.pathname
      expect(
        existsSync(new URL(`../../public${source}`, import.meta.url)),
      ).toBe(true)
      if (service) {
        expect(source).toBe(`/img/${service.image}`)
        expect(image.searchParams.get('fm')).toBe('jpg')
        expect(image.searchParams.get('fit')).toBe('cover')
        expect(social('og:image:width')).toBe(image.searchParams.get('w'))
        expect(social('og:image:height')).toBe(image.searchParams.get('h'))
        expect(social('og:image:alt')).toBe(service.imageAlt[lang])
      } else {
        expect(source).toBe('/img/star-cleaning-kuwait.jpg')
      }
    },
  )

  it.each([
    ['office-cleaning', 'ترتيبات الدخول'],
    ['villa-cleaning', 'الغرف والسلالم والأرضيات'],
    ['sofa-carpet-cleaning', 'نوع القماش وحجم القطع'],
    ['deep-cleaning', 'الحواف والزوايا والأسطح كثيرة الاستخدام'],
  ])('describes the actual cleaning work in Arabic for %s', (slug, scope) => {
    const service = findServicePage(slug)!
    const head = createSeoHead('ar', service)
    const description = head.meta.find(
      (tag) => tag.name === 'description',
    )?.content
    expect(description).toContain(scope)
    expect(description).not.toMatch(/طاقم|الرجال|عاملات|بالساعة/)
  })

  it.each(pages)(
    'keeps verified business and page schema aligned on $path',
    ({ lang, service, path }) => {
      const { meta, scripts } = createSeoHead(lang, service)
      const graph = JSON.parse(scripts[0].children)['@graph']
      const business = graph.find(
        (node: Record<string, unknown>) => node['@type'] === 'Organization',
      )
      expect(business.areaServed).toEqual({
        '@type': 'Country',
        name: 'Kuwait',
      })
      expect(business.telephone).toBe('+96550258260')
      expect(business.contactPoint).toMatchObject({
        '@type': 'ContactPoint',
        telephone: business.telephone,
        availableLanguage: ['en', 'ar'],
        areaServed: business.areaServed,
      })
      expect(business.logo).toBe(`${origin}/apple-touch-icon.png`)
      expect(business.alternateName).toContain('Star Cleaning Service')
      expect(graph).not.toContainEqual(
        expect.objectContaining({ '@type': 'LocalBusiness' }),
      )
      for (const unsupported of [
        'address',
        'email',
        'aggregateRating',
        'review',
        'priceRange',
        'openingHours',
        'geo',
      ]) {
        expect(business).not.toHaveProperty(unsupported)
      }
      const webpage = graph.find(
        (node: Record<string, unknown>) => node['@type'] === 'WebPage',
      )
      expect(webpage.url).toBe(origin + path)
      expect(webpage.inLanguage).toBe(lang)
      expect(webpage.description).toBe(
        meta.find((tag) => tag.name === 'description')?.content,
      )
      expect(webpage.mainEntity).toEqual(webpage.about)
      expect(webpage.primaryImageOfPage['@id']).toBe(
        `${webpage.url}#primaryimage`,
      )
      const serviceNodes = graph.filter(
        (node: Record<string, unknown>) => node['@type'] === 'Service',
      )
      if (service) {
        const breadcrumb = graph.find(
          (node: Record<string, unknown>) => node['@type'] === 'BreadcrumbList',
        )
        expect(breadcrumb.itemListElement.at(-1).item).toBe(webpage.url)
        expect(business).not.toHaveProperty('hasOfferCatalog')
        expect(serviceNodes).toHaveLength(1)
        expect(serviceNodes[0]).toMatchObject({
          '@id': webpage.about['@id'],
          url: webpage.url,
          name: service.page.heading[lang],
          areaServed: business.areaServed,
          provider: { '@id': business['@id'] },
          mainEntityOfPage: { '@id': webpage['@id'] },
        })
      } else {
        expect(serviceNodes).toHaveLength(0)
        expect(webpage.mainEntity).toEqual({ '@id': business['@id'] })
        expect(business.hasOfferCatalog.itemListElement).toHaveLength(5)
        for (const { itemOffered } of business.hasOfferCatalog
          .itemListElement) {
          expect(itemOffered['@type']).toBe('Service')
          expect(itemOffered.provider).toEqual({ '@id': business['@id'] })
          expect(
            pages.some(({ path }) => origin + path === itemOffered.url),
          ).toBe(true)
        }
      }
      expect(pageStructuredData(lang, service)['@graph']).toEqual(graph)
    },
  )

  it('lists exactly the canonical URLs and their alternates in the sitemap', () => {
    const xml = readFileSync(
      new URL('../../public/sitemap.xml', import.meta.url),
      'utf8',
    )
    const sitemapUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (match) => match[1],
    )
    expect(sitemapUrls.sort()).toEqual(
      pages.map(({ path }) => origin + path).sort(),
    )
    expect(new Set(sitemapUrls).size).toBe(pages.length)
    const entries = xml.match(/<url>[\s\S]*?<\/url>/g) ?? []
    for (const entry of entries) {
      const url = entry.match(/<loc>(.*?)<\/loc>/)?.[1]
      const { lang, service } = pages.find(({ path }) => origin + path === url)!
      const alternates = createSeoHead(lang, service).links.filter(
        (link) => link.rel === 'alternate',
      )
      for (const alternate of alternates) {
        expect(entry).toContain(
          `hreflang="${alternate.hrefLang}" href="${alternate.href}"`,
        )
      }
    }
  })

  it('allows crawling and declares the canonical HTTPS sitemap', () => {
    const contents = readFileSync(
      new URL('../../public/robots.txt', import.meta.url),
      'utf8',
    )
    const robots = robotsParser(`${origin}/robots.txt`, contents)
    expect(robots.getSitemaps()).toEqual([`${origin}/sitemap.xml`])
    for (const crawler of [
      'Applebot',
      'Googlebot',
      'bingbot',
      'DuckDuckBot',
      'Slurp',
    ]) {
      for (const path of [
        ...pages.map(({ path }) => path),
        '/sitemap.xml',
        '/apple-touch-icon.png',
        '/__forms.html',
        '/assets/entry.js',
        '/assets/styles.css',
        '/fonts/noto-sans-arabic-arabic.woff2',
        '/.netlify/images?url=/img/cleaning-team.png&w=640&fm=webp',
      ]) {
        expect(
          robots.isAllowed(origin + path, crawler),
          `${crawler}: ${path}`,
        ).toBe(true)
      }
    }
  })
})
