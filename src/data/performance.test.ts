// @vitest-environment node
import { readFileSync, existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { fontPreloads } from './fonts'
import { homeHeroImage, imageUrl, imageSrcSet } from './images'

describe('image delivery', () => {
  it.each(['cleaning-team.png', 'cleaning-detail.png'])(
    'does not advertise pixels beyond the actual %s original',
    (file) => {
      const original = readFileSync(
        new URL(`../../public/img/${file}`, import.meta.url),
      )
      const originalWidth = original.readUInt32BE(16)
      const candidates = imageSrcSet(
        file,
        [360, 600, 640, 800, 1000, 1200, 1400],
      ).split(', ')
      const descriptors = candidates.map((candidate) => {
        const [url, descriptor] = candidate.split(' ')
        const width = Number.parseInt(descriptor)
        expect(width).toBeLessThanOrEqual(originalWidth)
        expect(new URL(url, 'https://example.test').searchParams.get('w')).toBe(
          String(width),
        )
        return width
      })
      expect(new Set(descriptors).size).toBe(descriptors.length)
      expect(descriptors.at(-1)).toBe(originalWidth)
    },
  )

  it('offers an intermediate mobile hero candidate without changing format or quality', () => {
    const candidates = imageSrcSet(
      'cleaning-team.png',
      [360, 480, 600, 640, 800, 928],
    )
    expect(candidates).toContain('w=640&fm=webp&q=78 640w')
    expect(candidates).toContain('w=800&fm=webp&q=78 800w')
  })

  it('uses lighter WebP encoding consistently for the homepage hero only', () => {
    expect(homeHeroImage.src).toContain('fm=webp&q=74')
    for (const candidate of homeHeroImage.srcSet.split(', ')) {
      expect(candidate).toContain('fm=webp&q=74')
    }
    expect(imageUrl('cleaning-team.png', 800)).toContain('fm=webp&q=78')
  })

  it.each(['home.jpg', 'office.jpg', 'villa.jpg'])(
    'caps the %s service photo and removes duplicate candidates',
    (file) => {
      expect(imageUrl(file, 1200)).toContain('w=1000&fm=webp&q=78')
      expect(
        imageSrcSet(file, [400, 650, 1000, 1200]).split(', '),
      ).toHaveLength(3)
    },
  )
})

describe('font discovery', () => {
  it('prioritizes Arabic text and the Latin brand without unused display-font preloads', () => {
    const links = fontPreloads('ar', true)
    expect(links.map((link) => link.href)).toEqual([
      '/fonts/dm-sans-latin.woff2',
      '/fonts/noto-sans-arabic-arabic.woff2',
    ])
    expect(fontPreloads('ar', false)).toEqual(links)
  })

  it('preloads the italic display font only on the English homepage', () => {
    expect(
      fontPreloads('en', true).some((link) => link.href.includes('italic')),
    ).toBe(true)
    expect(
      fontPreloads('en', false).some((link) => link.href.includes('italic')),
    ).toBe(false)
  })

  it('uses existing local fonts and matching anonymous font requests', () => {
    for (const lang of ['en', 'ar'] as const) {
      for (const link of fontPreloads(lang, true)) {
        expect(link.as).toBe('font')
        expect(link.crossOrigin).toBe('anonymous')
        expect(
          existsSync(new URL(`../../public${link.href}`, import.meta.url)),
        ).toBe(true)
      }
    }
  })
})
