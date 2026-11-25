import type { Config, Context } from '@netlify/functions'
import {
  reviewEnvironment,
  runtimeReviewStore,
} from '../../src/server/reviewRuntime'

export const config: Config = { schedule: '17 */6 * * *' }

export default async function cleanupReviews(
  _request: Request,
  context: Context,
) {
  if (
    context.deploy.context !== 'production' ||
    !context.deploy.published ||
    Netlify.env.get('REVIEW_PRODUCTION_ENABLED') !== '1'
  )
    return new Response(null, { status: 204 })
  try {
    await runtimeReviewStore(reviewEnvironment(context)).cleanup()
    return new Response(null, { status: 204 })
  } catch {
    console.error('Customer review cleanup could not complete.')
    return new Response(null, { status: 503 })
  }
}
