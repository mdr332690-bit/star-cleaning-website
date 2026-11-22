// Image CDN does not upscale these originals. Keep requested widths and srcset
// descriptors aligned with the pixels actually returned by the CDN.
const nativeWidths: Record<string, number> = {
  'cleaning-team.png': 928,
  'cleaning-detail.png': 1200,
  'home.jpg': 1000,
  'office.jpg': 1000,
  'villa.jpg': 1000,
  'star-cleaning-kuwait.jpg': 1200,
}

const imageWidth = (file: string, width: number) =>
  Math.min(width, nativeWidths[file] ?? width)

export const imageUrl = (file: string, width: number) =>
  `/.netlify/images?url=/img/${file}&w=${imageWidth(file, width)}&fm=webp&q=78`

export const imageSrcSet = (file: string, widths: number[]) =>
  [...new Set(widths.map((width) => imageWidth(file, width)))]
    .map((width) => `${imageUrl(file, width)} ${width}w`)
    .join(', ')

// Share the exact responsive candidates between HTML images and head preloads.
// A mismatch can download a second, unused hero image on mobile devices.
export const homeHeroImage = {
  src: imageUrl('cleaning-team.png', 1000),
  srcSet: imageSrcSet('cleaning-team.png', [360, 480, 600, 640, 800, 928]),
  sizes:
    '(max-width: 760px) calc(100vw - 48px), (max-width: 1352px) 46vw, 585px',
}

export const serviceHeroImage = (file: string) => ({
  src: imageUrl(file, 1000),
  srcSet: imageSrcSet(file, [320, 400, 480, 640, 800, 1000, 1200]),
  sizes:
    '(max-width: 380px) calc(100vw - 34px), (max-width: 760px) calc(100vw - 42px), (max-width: 1352px) 43vw, 570px',
})
