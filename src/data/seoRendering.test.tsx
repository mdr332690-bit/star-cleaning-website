// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createMemoryHistory } from '@tanstack/react-router'
import { RouterServer } from '@tanstack/react-router/ssr/server'
import { parse, type DefaultTreeAdapterMap } from 'parse5'
import { renderToString } from 'react-dom/server'
import { beforeAll, describe, expect, it } from 'vitest'
import { getRouter } from '../router'
import { site } from './site'
import { copy } from './content'
import { localEnquiryCopy, localServiceAdvice } from './localSeo'
import { findServicePage } from './servicePages'
import { homeHeroImage, serviceHeroImage } from './images'
import { apartmentCopy, apartmentService } from './apartmentCleaning'
import { notFoundCopy } from '../components/NotFoundPage'

const origin = 'https://star-cleaning-website.netlify.app'
const sitemap = readFileSync(
  new URL('../../public/sitemap.xml', import.meta.url),
  'utf8',
)
const allPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
)
const paths = allPaths.filter((path) => !path.endsWith('/review'))
const pages = new Map<string, string>()

async function render(path: string) {
  const router = getRouter()
  router.update({ history: createMemoryHistory({ initialEntries: [path] }) })
  await router.load()
  return {
    html: renderToString(<RouterServer router={router} />),
  }
}

function* renderedImages(
  node: DefaultTreeAdapterMap['node'],
): Generator<DefaultTreeAdapterMap['element']> {
  if ('tagName' in node && node.tagName === 'img') yield node
  if ('childNodes' in node) {
    for (const child of node.childNodes) yield* renderedImages(child)
  }
}

beforeAll(async () => {
  for (const path of allPaths) pages.set(path, (await render(path)).html)
})

describe('search-engine-visible route output', () => {
  it('renders a single Bing verification tag in the homepage head', () => {
    const html = pages.get('/')!
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? ''
    const bingTags =
      html.match(/<meta\b[^>]*\bname="msvalidate\.01"[^>]*>/g) ?? []
    expect(bingTags).toHaveLength(1)
    expect(bingTags[0]).toContain('content="744870E5AB6687CD3D3B830B76B6F551"')
    expect(head).toContain(bingTags[0])
    expect(head).toContain('name="google-site-verification"')
  })

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
    const englishPath = path.replace(/^\/ar(?=\/|$)/, '') || '/'
    const alternatePaths = {
      en: englishPath,
      ar: englishPath === '/' ? '/ar' : `/ar${englishPath}`,
      'x-default': englishPath,
    }
    expect([...head.matchAll(/rel="alternate" hrefLang=/g)]).toHaveLength(3)
    for (const [language, alternatePath] of Object.entries(alternatePaths)) {
      expect(head).toContain(
        `rel="alternate" hrefLang="${language}" href="${origin}${alternatePath}"`,
      )
    }
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

  it.each(paths)('renders localized alt text on %s', (path) => {
    const html = parse(pages.get(path)!, { scriptingEnabled: false })
    const images = [...renderedImages(html)]
    const isArabic = path === '/ar' || path.startsWith('/ar/')
    const descriptions = new Set<string>()

    expect(images.length).toBeGreaterThan(0)
    for (const image of images) {
      const src = image.attrs.find(({ name }) => name === 'src')?.value
      const alt = image.attrs.find(({ name }) => name === 'alt')?.value
      const parent = image.parentNode
      const isFilmBackdrop =
        parent &&
        'attrs' in parent &&
        parent.attrs.some(
          ({ name, value }) =>
            name === 'class' && value.split(/\s+/).includes('film-card'),
        )

      if (isFilmBackdrop || src === '/star-cleaning-mark.svg') {
        expect(alt, src).toBe('')
        continue
      }

      expect(alt, src).toBeDefined()
      const description = alt?.trim().toLowerCase() ?? ''
      expect(description, src).toMatch(
        isArabic ? /\p{Script=Arabic}/u : /\p{Script=Latin}/u,
      )
      if (!isArabic) expect(description, src).not.toMatch(/\p{Script=Arabic}/u)
      expect(descriptions, src).not.toContain(description)
      descriptions.add(description)
    }
  })

  it.each(paths)(
    'starts with one main heading and skips no levels on %s',
    (path) => {
      const headings = [...pages.get(path)!.matchAll(/<h([1-6])\b/g)].map(
        ([, level]) => Number(level),
      )
      expect(headings[0]).toBe(1)
      expect(headings.filter((level) => level === 1)).toHaveLength(1)
      for (const [index, level] of headings.slice(1).entries()) {
        expect(level).toBeLessThanOrEqual(headings[index] + 1)
      }
    },
  )

  it.each([
    {
      path: '/',
      expected: [
        ['10+', 'Years of experience'],
        ['20+', 'Clients served'],
        ['6', 'Specialists'],
        ['10,000+', 'Completed cleaning jobs'],
      ],
    },
    {
      path: '/ar',
      expected: [
        ['١٠+', 'سنوات من الخبرة'],
        ['٢٠+', 'عميلاً خدمناهم'],
        ['٦', 'مختصون'],
        ['١٠٬٠٠٠+', 'عمليات تنظيف مكتملة'],
      ],
    },
  ])('renders localized homepage statistics on $path', ({ path, expected }) => {
    const html = pages.get(path)!
    const stats =
      html.match(/class="hero-stats">([\s\S]*?)<\/div><\/div><\/div>/)?.[1] ??
      ''
    const items = stats.matchAll(
      /<strong dir="ltr">([^<]+)(<span>\+<\/span>)?<\/strong><span>([^<]+)<\/span>/g,
    )
    expect(
      Array.from(items, ([, value, plus, label]) => [
        value + (plus ? '+' : ''),
        label,
      ]),
    ).toEqual(expected)
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
    'renders translated Kuwait-wide coverage and booking guidance on %s',
    (path) => {
      const html = pages.get(path)!
      const lang = path.startsWith('/ar') ? 'ar' : 'en'
      const section = html.match(
        /<section\b[^>]*id="location-enquiry"[^>]*>([\s\S]*?)<\/section>/,
      )?.[1]
      expect(section).toContain(localEnquiryCopy[lang].title)
      expect(section).toContain(localEnquiryCopy[lang].intro)
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
      if (service && service.id !== 'apartment')
        expect(section).toContain(localServiceAdvice[service.id][lang])
      expect(section).toContain(`href="${service ? '#contact' : '#booking'}"`)
      const schema = html.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
      )?.[1]
      for (const location of locations) expect(schema).not.toContain(location)
      expect(html).toContain(
        `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`,
      )
    },
  )

  it.each(paths)(
    'renders the PNG once in the localized header on %s',
    (path) => {
      const isArabic = path === '/ar' || path.startsWith('/ar/')
      const home = isArabic ? '/ar' : '/'
      const html = pages.get(path)!
      const header = html.match(
        /<header class="site-header">[\s\S]*?<\/header>/,
      )?.[0]
      const logo = header?.match(
        /<a class="header-brand"[^>]*>[\s\S]*?<\/a>/,
      )?.[0]
      expect(logo).toContain(`href="${path === home ? '#home' : home}"`)
      expect(logo).toContain('src="/star-cleaning-logo.png"')
      expect(logo).toContain('width="1200" height="360"')
      expect(logo).toContain(
        isArabic
          ? 'alt="ستار كلينينج لخدمات التنظيف في الكويت"'
          : 'alt="Star Cleaning Service Kuwait"',
      )
      expect(html.match(/src="\/star-cleaning-logo\.png"/g)).toHaveLength(1)
      expect(header).not.toContain('/star-cleaning-mark.svg')
    },
  )

  it.each(allPaths)(
    'keeps the localized footer or review brand on %s',
    (path) => {
      const isArabic = path === '/ar' || path.startsWith('/ar/')
      const logo = pages
        .get(path)!
        .match(/<a class="brand"[^>]*>[\s\S]*?<\/a>/)?.[0]
      expect(logo).toContain('src="/star-cleaning-mark.svg" alt=""')
      expect(logo).toContain(`lang="${isArabic ? 'ar' : 'en'}"`)
      expect(logo).toContain(
        isArabic
          ? '<strong>ستار كلينينج</strong><span>خدمات التنظيف · الكويت</span>'
          : '<strong>STAR CLEANING</strong><span>SERVICE KUWAIT</span>',
      )
    },
  )

  it('declares the SVG favicon and square PNG touch icon in every localized document', () => {
    const icon = readFileSync(
      new URL('../../public/apple-touch-icon.png', import.meta.url),
    )
    expect(icon.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    )
    expect([icon.readUInt32BE(16), icon.readUInt32BE(20)]).toEqual([180, 180])
    for (const html of pages.values()) {
      expect(html).toContain(
        '<link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg"/>',
      )
      expect(html).toContain(
        '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>',
      )
    }
  })

  it.each(paths)(
    'clarifies the service scope near enquiry actions on %s',
    (path) => {
      const html = pages.get(path)!
      const clarification = path.startsWith('/ar')
        ? 'نقدّم زيارات تنظيف احترافية فقط، ولا نوفر خادمات بالساعة أو عمالة منزلية.'
        : 'Professional cleaning visits only. We don&#x27;t provide hourly maids or household staffing.'
      const hero = html.match(
        /<section\b[^>]*(?:id="home"|class="service-intro")[^>]*>([\s\S]*?)<\/section>/,
      )?.[1]
      const contact = html.match(
        /<section\b[^>]*id="contact"[^>]*>([\s\S]*?)<\/section>/,
      )?.[1]
      expect(hero).toContain(clarification)
      expect(contact).toContain(clarification)
      const staffingLanguage =
        /female cleaning staff|male cleaning staff only|عاملات تنظيف|الرجال فقط/i
      expect(staffingLanguage.test(html)).toBe(false)
      if (path === '/' || path === '/ar') {
        const booking = html.match(
          /<section\b[^>]*id="booking"[^>]*>([\s\S]*?)<\/section>/,
        )?.[1]
        expect(booking).toContain(clarification)
        const formIntro = booking?.match(
          /class="inquiry-form-intro">(.*?)<\/p>/,
        )?.[1]
        expect(formIntro).toContain(clarification)
      }
    },
  )

  it.each([
    [
      '/',
      'What&#x27;s included in a professional cleaning visit?',
      'We don’t provide hourly maids, domestic workers, babysitters or household staffing.',
    ],
    [
      '/ar',
      'ماذا تشمل زيارة التنظيف الاحترافي؟',
      'لا نوفر خادمات بالساعة أو عمالة منزلية أو جليسات أطفال، ولا نقدّم خدمات استقدام العمالة المنزلية.',
    ],
  ])(
    'answers what a professional visit includes on %s',
    (path, question, answer) => {
      const html = pages.get(path)!
      const faq = [...html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)]
        .map(([, detail]) => detail)
        .find((detail) => detail.includes(`<span>${question}</span>`))
      expect(faq).toContain(answer)
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
          expect(testimonials).toContain(
            `href="${lang === 'ar' ? '/ar/review' : '/review'}"`,
          )
          expect(testimonials).not.toContain(`href="${reviewUrl}"`)
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
    'exposes all six service-page links near the cards on %s',
    (path) => {
      const html = pages.get(path)!
      const directory = html.match(
        /<nav class="service-directory"[^>]*>([\s\S]*?)<\/nav>/,
      )?.[1]
      const links = [...directory!.matchAll(/href="([^"]+)"/g)].map(
        (match) => match[1],
      )
      const prefix = path === '/ar' ? '/ar' : ''
      expect(links).toHaveLength(6)
      expect(links.slice(0, 2)).toEqual([
        `${prefix}/services/house-cleaning`,
        `${prefix}/services/apartment-cleaning`,
      ])
      expect(html).toContain(
        path === '/ar' ? 'تنظيف الأرضيات' : 'floor cleaning',
      )
    },
  )

  it.each(['/', '/ar'])('places Apartment Cleaning second on %s', (path) => {
    const html = pages.get(path)!
    const cards = [
      ...html.matchAll(
        /<article class="service-card[^"]*" aria-labelledby="([^"]+)-card-title">([\s\S]*?)<\/article>/g,
      ),
    ]
    expect(cards.map((card) => card[1])).toEqual([
      'home',
      'apartment',
      'office',
      'villa',
      'sofa',
      'deep',
    ])
    expect(cards[1][2]).toContain(
      `href="${path === '/ar' ? '/ar' : ''}/services/apartment-cleaning"`,
    )
  })

  it.each(['en', 'ar'] as const)(
    'renders localized apartment scope, search links and related links in %s',
    (lang) => {
      const prefix = lang === 'ar' ? '/ar' : ''
      const path = `${prefix}/services/apartment-cleaning`
      const alternatePath = `${lang === 'ar' ? '' : '/ar'}/services/apartment-cleaning`
      const html = pages.get(path)!
      const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1]
      const content = apartmentCopy[lang]
      expect(html).toContain(
        `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`,
      )
      expect(html).toContain(
        `<h1 id="service-heading">${apartmentService.page.heading[lang]}</h1>`,
      )
      expect(html).toContain(`alt="${apartmentService.imageAlt[lang]}"`)
      expect(html).toContain(`href="${alternatePath}"`)
      expect(head).toContain(`rel="canonical" href="${origin}${path}"`)
      for (const [language, localePrefix] of [
        ['en', ''],
        ['ar', '/ar'],
        ['x-default', ''],
      ]) {
        expect(head).toContain(
          `rel="alternate" hrefLang="${language}" href="${origin}${localePrefix}/services/apartment-cleaning"`,
        )
      }
      for (const [room] of content.rooms)
        expect(html).toContain(`<dt>${room}</dt>`)
      for (const [step] of content.steps)
        expect(html).toContain(`<h3>${step}</h3>`)
      for (const [question] of content.faqs)
        expect(html).toContain(`<summary>${question}`)
      for (const slug of [
        'house-cleaning',
        'villa-cleaning',
        'deep-cleaning',
      ]) {
        const relatedPath = `${prefix}/services/${slug}`
        expect(html).toContain(`href="${relatedPath}"`)
        expect(pages.get(relatedPath)).toContain(`href="${path}"`)
      }
    },
  )

  it.each([
    { path: '/does-not-exist', lang: 'en', home: '/' },
    { path: '/services/not-a-service', lang: 'en', home: '/' },
    { path: '/ar/does-not-exist', lang: 'ar', home: '/ar' },
    { path: '/ar/services/not-a-service', lang: 'ar', home: '/ar' },
  ] as const)(
    'renders a localized, noindex 404 for $path',
    async ({ path, lang, home }) => {
      const { html } = await render(path)
      const { title, description, heading } = notFoundCopy[lang]
      expect(html).toContain(`<title>${title}</title>`)
      expect(html).toContain(`name="description" content="${description}"`)
      expect(html).toContain(`<h1>${heading}</h1>`)
      expect(html).toContain(`href="${home}"`)
      expect(html).toContain('name="robots" content="noindex, follow"')
      expect(html).not.toContain('rel="canonical"')
      expect(html).not.toContain('type="application/ld+json"')
    },
  )

  it('canonicalizes campaign queries without losing the requested language', async () => {
    const { html } = await render('/ar?utm_source=google&gclid=test-click')
    expect(html).toContain('<html lang="ar" dir="rtl">')
    expect(html).toContain(`rel="canonical" href="${origin}/ar"`)
  })
})
