import { site } from '../data/site'

export const siteOrigin = new URL(site.url).origin

export function getIndexNowProofUrl(key: string | undefined) {
  return key && /^[a-z\d-]{8,128}$/i.test(key)
    ? `${siteOrigin}/${key}.txt`
    : undefined
}

export function indexNowVerificationResponse(
  request: Request,
  key: string | undefined,
) {
  const proofUrl = getIndexNowProofUrl(key)
  if (!proofUrl || request.url !== proofUrl) return

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    })
  }

  return new Response(request.method === 'HEAD' ? null : key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex',
    },
  })
}
