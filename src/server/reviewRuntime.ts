import { getDeployStore, getStore } from '@netlify/blobs'
import type { Context } from '@netlify/functions'
import { createReviewStore, reviewDatabase } from './reviewStore'
import { ReviewError } from './reviewValidation'

export function reviewEnvironment(
  context: Pick<Context, 'deploy'> | undefined,
) {
  const deploy = context?.deploy
  if (deploy?.context === 'production' && deploy.published)
    return { scope: 'production', role: 'review-moderator', preview: false }
  if (deploy?.context === 'deploy-preview' && /^[a-f0-9]{24}$/i.test(deploy.id))
    return {
      scope: `preview-${deploy.id}`,
      role: 'review-preview-moderator',
      preview: true,
    }
  throw new ReviewError('unavailable', 503)
}

export function runtimeReviewStore(
  environment: ReturnType<typeof reviewEnvironment>,
) {
  const options = {
    name: 'customer-review-photos',
    consistency: 'strong' as const,
  }
  const blobs = environment.preview
    ? getDeployStore({ ...options, deployID: environment.scope.slice(8) })
    : getStore(options)
  return createReviewStore(reviewDatabase(), environment.scope, {
    set: (key, bytes) => blobs.set(key, bytes.buffer),
    get: (key) => blobs.get(key, { type: 'arrayBuffer' }),
    delete: (key) => blobs.delete(key),
  })
}
