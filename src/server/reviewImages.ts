import sharp from 'sharp'
import { ReviewError, maxPhotoBytes } from './reviewValidation'

const pixelLimit = 16_000_000
const imageFormats: Record<string, string> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function sanitizeReviewImage(photo: File) {
  if (photo.size > maxPhotoBytes) throw new ReviewError('photoSize', 413)
  try {
    const input = Buffer.from(await photo.arrayBuffer())
    const jpeg = input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff
    const png =
      input.length >= 8 &&
      input
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    const webp =
      input.toString('ascii', 0, 4) === 'RIFF' &&
      input.toString('ascii', 8, 12) === 'WEBP'
    if (!(
      (photo.type === 'image/jpeg' && jpeg) ||
      (photo.type === 'image/png' && png) ||
      (photo.type === 'image/webp' && webp)
    ))
      throw new ReviewError('photo', 400)
    const image = sharp(input, {
      limitInputPixels: pixelLimit,
      failOn: 'warning',
    })
    const metadata = await image.metadata()
    const pngAnimation =
      metadata.format === 'png' && hasAnimationChunk(input, 8, 'acTL', false)
    const webpAnimation =
      metadata.format === 'webp' && hasAnimationChunk(input, 12, 'ANIM', true)
    if (
      !imageFormats[photo.type] ||
      metadata.format !== imageFormats[photo.type] ||
      (metadata.pages ?? 1) !== 1 ||
      pngAnimation ||
      webpAnimation ||
      !metadata.width ||
      !metadata.height ||
      metadata.width * metadata.height > pixelLimit
    )
      throw new ReviewError('photo', 400)
    return await image
      .rotate()
      .resize({
        width: 1400,
        height: 1400,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 81 })
      .toBuffer()
  } catch {
    throw new ReviewError('photo', 400)
  }
}

function hasAnimationChunk(
  data: Buffer,
  start: number,
  marker: string,
  webp: boolean,
) {
  for (let offset = start; offset + 8 <= data.length;) {
    const typeOffset = offset + (webp ? 0 : 4)
    if (data.toString('ascii', typeOffset, typeOffset + 4) === marker)
      return true
    const size = webp
      ? data.readUInt32LE(offset + 4)
      : data.readUInt32BE(offset)
    offset += webp ? 8 + size + (size % 2) : 12 + size
  }
  return false
}
