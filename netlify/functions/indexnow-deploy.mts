import type { DeploySucceededEvent } from '@netlify/functions'
import { submitIndexNow } from '../../src/server/indexNowSubmission'

export default {
  async deploySucceeded({ deploy }: DeploySucceededEvent) {
    if (
      deploy.context !== 'production' ||
      deploy.branch !== 'main' ||
      deploy.state !== 'ready' ||
      !deploy.publishedAt
    ) {
      return
    }

    try {
      console.info(
        'IndexNow:',
        await submitIndexNow(Netlify.env.get('INDEXNOW_KEY_V2')),
      )
    } catch {
      console.error('IndexNow: sitemap parsing or network request failed.')
    }
  },
}
