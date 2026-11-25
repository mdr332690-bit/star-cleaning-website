// @vitest-environment node
import { createMemoryHistory } from '@tanstack/react-router'
import { RouterServer } from '@tanstack/react-router/ssr/server'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { getRouter } from '../router'
import { reviewCopy, reviewPath } from './reviews'
import { site } from './site'

async function render(path: string) {
  const router = getRouter()
  router.update({ history: createMemoryHistory({ initialEntries: [path] }) })
  await router.load()
  return renderToString(<RouterServer router={router} />)
}

describe('review SEO and tracking isolation', () => {
  it.each(['en', 'ar'] as const)(
    'renders localized review metadata in %s',
    async (lang) => {
      const path = reviewPath(lang)
      const html = await render(path)
      const url = new URL(path, site.url).href
      expect(html).toContain(
        `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`,
      )
      expect(html).toContain(`<title>${reviewCopy[lang].title}</title>`)
      expect(html).toContain(`rel="canonical" href="${url}"`)
      expect(html).toContain(`property="og:url" content="${url}"`)
      expect(html).toContain(`hrefLang="x-default" href="${site.url}review"`)
      expect(html).toContain(`hrefLang="ar" href="${site.url}ar/review"`)
      expect(html).not.toMatch(
        /aggregateRating|application\/ld\+json|googletagmanager\.com/,
      )
    },
  )

  it('does not index the admin shell or load third-party tags', async () => {
    const html = await render('/admin/reviews')
    expect(html).toContain('name="robots" content="noindex, nofollow"')
    expect(html).not.toContain('googletagmanager.com')
  })
})
