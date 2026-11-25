import type { Language } from './content'
import { homePath, servicePath, catalogServicePages } from './servicePages'
import type { ServicePageData } from './servicePages'
import { site } from './site'
import { fontPreloads } from './fonts'
import { imageUrl, serviceSocialImage } from './images'
import { reviewCopy, reviewPath } from './reviews'

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
    title: 'Cleaning Services in Kuwait | Star Cleaning',
    description:
      'Explore home, office, villa, sofa and carpet cleaning in Kuwait. Contact Star Cleaning to discuss availability or request a quote for a deep clean.',
    locale: 'en_KW',
    alternateLocale: 'ar_KW',
    imageAlt:
      'Illustrative image of a cleaning professional caring for a cream sofa',
  },
  ar: {
    title: 'شركة تنظيف في الكويت | ستار كلينينج',
    description:
      'تعرّف على خدمات ستار كلينينج في الكويت لتنظيف المنازل والشقق والمكاتب والفلل والكنب والسجاد. تواصل معنا للاستفسار عن التنظيف العميق وطلب عرض سعر.',
    locale: 'ar_KW',
    alternateLocale: 'en_KW',
    imageAlt: 'صورة توضيحية لعامل تنظيف يعتني بكنبة كريمية',
  },
}

export const socialImage = new URL('img/star-cleaning-kuwait.jpg', site.url)
  .href

const businessId = `${site.url}#business`
const areaServed = { '@type': 'Country', name: 'Kuwait' }

function serviceStructuredData(lang: Language, service: ServicePageData) {
  const url = new URL(servicePath(lang, service.page.slug), site.url).href
  return {
    '@type': 'Service',
    '@id': `${site.url}#${service.anchor}-service`,
    name: service.page.heading[lang],
    alternateName: service.title[lang === 'en' ? 'ar' : 'en'],
    serviceType: service.title[lang],
    description: service.page.intro[lang],
    url,
    areaServed,
    provider: { '@id': businessId },
    mainEntityOfPage: { '@id': `${url}#webpage` },
  }
}

const businessStructuredData = (lang: Language, includeCatalog: boolean) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': businessId,
      name: site.name,
      alternateName: ['Star Cleaning Service', 'ستار كلينينج الكويت'],
      url: site.url,
      telephone: site.phone,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: site.phone,
        contactType: 'customer service',
        availableLanguage: ['en', 'ar'],
        areaServed,
      },
      description: seo[lang].description,
      image: socialImage,
      logo: new URL('apple-touch-icon.png', site.url).href,
      areaServed,
      slogan: lang === 'ar' ? 'عناية بكل تفصيلة.' : 'Care in every detail.',
      knowsLanguage: ['en', 'ar'],
      ...(includeCatalog && {
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name:
            lang === 'ar'
              ? 'خدمات التنظيف في الكويت'
              : 'Cleaning services in Kuwait',
          itemListElement: catalogServicePages.map((service) => ({
            '@type': 'Offer',
            itemOffered: serviceStructuredData(lang, service),
          })),
        },
      }),
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}#website`,
      url: site.url,
      name: site.name,
      inLanguage: ['en', 'ar'],
      publisher: { '@id': businessId },
    },
  ],
})

export function pageSeo(lang: Language, service?: ServicePageData) {
  const preview = service && serviceSocialImage(service.image)
  return {
    ...seo[lang],
    ...(service && {
      title: service.page.title[lang],
      description: service.page.description[lang],
      imageAlt: service.imageAlt[lang],
    }),
    socialImage: preview
      ? {
          url: new URL(preview.path, site.url).href,
          width: preview.width,
          height: preview.height,
        }
      : { url: socialImage, width: 1200, height: 630 },
  }
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
        ...metadata.socialImage,
        caption: metadata.imageAlt,
      }
  const serviceNode = service && serviceStructuredData(lang, service)
  const mainEntity = { '@id': serviceNode?.['@id'] ?? businessId }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...businessStructuredData(lang, !service)['@graph'],
      ...(serviceNode ? [serviceNode] : []),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: metadata.title,
        description: metadata.description,
        inLanguage: lang,
        isPartOf: { '@id': `${site.url}#website` },
        about: mainEntity,
        mainEntity,
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
export function createSeoHead(
  lang: Language,
  service?: ServicePageData,
  page?: 'review',
) {
  const isReview = page === 'review'
  const metadata = {
    ...pageSeo(lang, service),
    ...(isReview
      ? {
          title: reviewCopy[lang].title,
          description: reviewCopy[lang].description,
        }
      : {}),
  }
  const path = (language: Language) =>
    isReview
      ? reviewPath(language)
      : service
        ? servicePath(language, service.page.slug)
        : homePath(language)
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
      { property: 'og:image', content: metadata.socialImage.url },
      { property: 'og:image:type', content: 'image/jpeg' },
      {
        property: 'og:image:width',
        content: String(metadata.socialImage.width),
      },
      {
        property: 'og:image:height',
        content: String(metadata.socialImage.height),
      },
      { property: 'og:image:alt', content: metadata.imageAlt },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metadata.title },
      { name: 'twitter:description', content: metadata.description },
      { name: 'twitter:image', content: metadata.socialImage.url },
      { name: 'twitter:image:alt', content: metadata.imageAlt },
    ],
    scripts: isReview
      ? []
      : [
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
