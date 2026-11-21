import type { Language } from './content'

// The Latin brand uses DM Sans in both languages. Arabic headings use Noto,
// while the italic display font appears only on the English homepage.
export function fontPreloads(lang: Language, isHomepage: boolean) {
  const files =
    lang === 'ar'
      ? ['dm-sans-latin.woff2', 'noto-sans-arabic-arabic.woff2']
      : [
          'dm-sans-latin.woff2',
          'cormorant-garamond-normal-latin.woff2',
          ...(isHomepage ? ['cormorant-garamond-italic-latin.woff2'] : []),
        ]

  return files.map((file) => ({
    rel: 'preload',
    href: `/fonts/${file}`,
    as: 'font' as const,
    type: 'font/woff2',
    crossOrigin: 'anonymous' as const,
  }))
}
