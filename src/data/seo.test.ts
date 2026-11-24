// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createSeoHead, pageStructuredData } from './seo'
import { servicePages } from './servicePages'
import type { Language } from './content'

const origin = 'https://star-cleaning-website.netlify.app'
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
    'keeps verified business and page schema aligned on $path',
    ({ lang, service, path }) => {
      const graph = JSON.parse(
        createSeoHead(lang, service).scripts[0].children,
      )['@graph']
      const business = graph.find(
        (node: Record<string, unknown>) => node['@type'] === 'LocalBusiness',
      )
      expect(business.areaServed).toEqual({
        '@type': 'Country',
        name: 'Kuwait',
      })
      expect(business.hasOfferCatalog.itemListElement).toHaveLength(5)
      expect(business.telephone).toBe('+96550258260')
      expect(business.alternateName).toContain('Star Cleaning Service')
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
      expect(webpage.mainEntity).toEqual(webpage.about)
      expect(webpage.primaryImageOfPage['@id']).toBe(
        `${webpage.url}#primaryimage`,
      )
      if (service) {
        const breadcrumb = graph.find(
          (node: Record<string, unknown>) => node['@type'] === 'BreadcrumbList',
        )
        expect(breadcrumb.itemListElement.at(-1).item).toBe(webpage.url)
        const offered = business.hasOfferCatalog.itemListElement.map(
          (offer: { itemOffered: Record<string, unknown> }) =>
            offer.itemOffered,
        )
        const serviceNodes = graph.filter(
          (node: Record<string, unknown>) => node['@type'] === 'Service',
        )
        expect(serviceNodes).toHaveLength(service.id === 'apartment' ? 1 : 0)
        expect(
          service.id === 'apartment' ? serviceNodes : offered,
        ).toContainEqual(
          expect.objectContaining({
            '@id': webpage.about['@id'],
            url: webpage.url,
            name: service.page.heading[lang],
            mainEntityOfPage: { '@id': webpage['@id'] },
          }),
        )
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
      const page = pages.find(({ path }) => origin + path === url)!
      for (const alternate of createSeoHead(
        page.lang,
        page.service,
      ).links.filter((link) => link.rel === 'alternate')) {
        expect(entry).toContain(
          `hreflang="${alternate.hrefLang}" href="${alternate.href}"`,
        )
      }
    }
  })

  it('allows crawling and declares the canonical HTTPS sitemap', () => {
    const robots = readFileSync(
      new URL('../../public/robots.txt', import.meta.url),
      'utf8',
    )
    expect(robots).toMatch(/^User-agent: \*$/m)
    expect(robots).toMatch(/^Allow: \/$/m)
    expect(robots).not.toMatch(/^Disallow:\s*\//m)
    expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`)
  })
})
