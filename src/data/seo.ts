import type { Language } from './content'
import { homePath, servicePath, catalogServicePages } from './servicePages'
import type { ServicePageData } from './servicePages'
import { site } from './site'
import { fontPreloads } from './fonts'
import { imageUrl } from './images'

type PageLink = {
  rel: string
  href: string
  hrefLang?: string
  as?: 'font'
  type?: string
  crossOrigin?: 'anonymous'
}

export const seo = {
  en: {
    title: 'Cleaning Services Kuwait | Star Cleaning Service',
    description:
      'Home, apartment, office, villa, sofa, carpet and deep cleaning in Kuwait. Call Star Cleaning on +965 50258260 to discuss your space, availability and a quote.',
    locale: 'en_KW',
    alternateLocale: 'ar_KW',
    imageAlt:
      'Illustrative image of a cleaning professional caring for a cream sofa',
  },
  ar: {
    title: 'شركة تنظيف في الكويت | ستار كلينينج',
    description:
      'خدمات تنظيف المنازل والشقق والمكاتب والفلل والكنب والسجاد والتنظيف العميق في الكويت. اتصل بستار كلينينج على +96550258260 لمناقشة الخدمة وعرض السعر.',
    locale: 'ar_KW',
    alternateLocale: 'en_KW',
    imageAlt: 'صورة توضيحية لعامل تنظيف يعتني بكنبة كريمية',
  },
}

export const socialImage = new URL('img/star-cleaning-kuwait.jpg', site.url)
  .href

// Only verified business information belongs in this graph. A service country
// describes coverage; it is deliberately not presented as a street address.
export const businessStructuredData = (lang: Language) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${site.url}#business`,
      name: site.name,
      alternateName: ['Star Cleaning Service', 'ستار كلينينج الكويت'],
      url: site.url,
      telephone: site.phone,
      description: seo[lang].description,
      image: socialImage,
      logo: new URL('favicon.svg', site.url).href,
      areaServed: { '@type': 'Country', name: 'Kuwait' },
      slogan: lang === 'ar' ? 'عناية بكل تفصيلة.' : 'Care in every detail.',
      knowsLanguage: ['en', 'ar'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name:
          lang === 'ar'
            ? 'خدمات التنظيف في الكويت'
            : 'Cleaning services in Kuwait',
        itemListElement: catalogServicePages.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': `${site.url}#${service.anchor}-service`,
            name: service.page.heading[lang],
            alternateName: service.title[lang === 'en' ? 'ar' : 'en'],
            serviceType: service.title[lang],
            description: service.page.intro[lang],
            url: new URL(servicePath(lang, service.page.slug), site.url).href,
            areaServed: { '@type': 'Country', name: 'Kuwait' },
            provider: { '@id': `${site.url}#business` },
            mainEntityOfPage: {
              '@id': `${new URL(servicePath(lang, service.page.slug), site.url).href}#webpage`,
            },
          },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}#website`,
      url: site.url,
      name: site.name,
      inLanguage: ['en', 'ar'],
      publisher: { '@id': `${site.url}#business` },
    },
  ],
})

export function pageSeo(lang: Language, service?: ServicePageData) {
  return service
    ? {
        ...seo[lang],
        title: service.page.title[lang],
        description: service.page.description[lang],
      }
    : seo[lang]
}

export function pageStructuredData(lang: Language, service?: ServicePageData) {
  const metadata = pageSeo(lang, service)
  const path = service ? servicePath(lang, service.page.slug) : homePath(lang)
  const url = new URL(path, site.url).href
  const pageImage = service
    ? {
        '@type': 'ImageObject',
        '@id': `${url}#primaryimage`,
        url: new URL(imageUrl(service.image, 1000), site.url).href,
        caption: service.imageAlt[lang],
      }
    : {
        '@type': 'ImageObject',
        '@id': `${url}#primaryimage`,
        url: socialImage,
        width: 1200,
        height: 630,
        caption: metadata.imageAlt,
      }
  const serviceUrl = service
    ? `${site.url}#${service.anchor}-service`
    : undefined
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...businessStructuredData(lang)['@graph'],
      ...(service?.id === 'apartment'
        ? [
            {
              '@type': 'Service',
              '@id': serviceUrl,
              name: service.page.heading[lang],
              serviceType: service.title[lang],
              description: service.page.intro[lang],
              url,
              areaServed: { '@type': 'Country', name: 'Kuwait' },
              provider: { '@id': `${site.url}#business` },
              mainEntityOfPage: { '@id': `${url}#webpage` },
            },
          ]
        : []),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: metadata.title,
        description: metadata.description,
        inLanguage: lang,
        isPartOf: { '@id': `${site.url}#website` },
        about: { '@id': serviceUrl ?? `${site.url}#business` },
        mainEntity: { '@id': serviceUrl ?? `${site.url}#business` },
        ...(service && { breadcrumb: { '@id': `${url}#breadcrumb` } }),
        primaryImageOfPage: pageImage,
      },
      ...(service
        ? [
            {
              '@type': 'BreadcrumbList',
              '@id': `${url}#breadcrumb`,
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: lang === 'ar' ? 'الرئيسية' : 'Home',
                  item: new URL(homePath(lang), site.url).href,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: service.page.heading[lang],
                  item: url,
                },
              ],
            },
          ]
        : []),
    ],
  }
}

// Generate metadata on the server for each URL; no browser-only SEO mutations.
export function createSeoHead(lang: Language, service?: ServicePageData) {
  const metadata = pageSeo(lang, service)
  const path = (language: Language) =>
    service ? servicePath(language, service.page.slug) : homePath(language)
  const url = new URL(path(lang), site.url).href
  const links: PageLink[] = [
    { rel: 'canonical', href: url },
    {
      rel: 'alternate',
      hrefLang: 'en',
      href: new URL(path('en'), site.url).href,
    },
    {
      rel: 'alternate',
      hrefLang: 'ar',
      href: new URL(path('ar'), site.url).href,
    },
    {
      rel: 'alternate',
      hrefLang: 'x-default',
      href: new URL(path('en'), site.url).href,
    },
    ...fontPreloads(lang, !service),
  ]
  return {
    links,
    meta: [
      { title: metadata.title },
      { name: 'description', content: metadata.description },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: metadata.locale },
      { property: 'og:locale:alternate', content: metadata.alternateLocale },
      { property: 'og:image', content: socialImage },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: metadata.imageAlt },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metadata.title },
      { name: 'twitter:description', content: metadata.description },
      { name: 'twitter:image', content: socialImage },
      { name: 'twitter:image:alt', content: metadata.imageAlt },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(pageStructuredData(lang, service)).replace(
          /</g,
          '\\u003c',
        ),
      },
    ],
  }
}
