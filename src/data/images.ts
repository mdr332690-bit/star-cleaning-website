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
