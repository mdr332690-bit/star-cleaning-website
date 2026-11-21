// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createContext, runInContext } from 'node:vm'
import { createMemoryHistory } from '@tanstack/react-router'
import { RouterServer } from '@tanstack/react-router/ssr/server'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { getRouter } from '../router'

const adsId = 'AW-18535502279'
const loader = `https://www.googletagmanager.com/gtag/js?id=${adsId}`
const sitemap = readFileSync(
  new URL('../../public/sitemap.xml', import.meta.url),
  'utf8',
)
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
)

async function renderPage(path: string) {
  const router = getRouter()
  router.update({ history: createMemoryHistory({ initialEntries: [path] }) })
  await router.load()
  return renderToString(<RouterServer router={router} />)
}

function headScripts(html: string) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? ''
  return [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
}

describe('global Google Ads installation', () => {
  it.each(paths)(
    'server-renders one Ads tag in the head of %s',
    async (path) => {
      const html = await renderPage(path)
      const scripts = headScripts(html)
      const loaders = scripts.filter((script) => script[1].includes(loader))
      expect(loaders).toHaveLength(1)
      expect(loaders[0][1]).toMatch(/\basync(?:=|\s|$)/)
      expect(
        scripts.filter((script) =>
          script[2].includes(`gtag('config', '${adsId}')`),
        ),
      ).toHaveLength(1)
      expect(html.split(loader)).toHaveLength(2)
      const isArabic = /^\/ar(?:\/|$)/.test(path)
      expect(html).toContain(`lang="${isArabic ? 'ar' : 'en'}"`)
      expect(html).toContain(`dir="${isArabic ? 'rtl' : 'ltr'}"`)
      expect(html).toContain('rel="canonical"')
    },
  )

  it.each([false, true])(
    'initializes without script errors and preserves the shared dataLayer (existing queue: %s)',
    async (hasExistingQueue) => {
      const html = await renderPage('/')
      const previousEvent = { event: 'before-tag' }
      const dataLayer: unknown[] = hasExistingQueue ? [previousEvent] : []
      const insertedScripts: Array<{ src?: string }> = []
      const firstScript = {
        parentNode: {
          insertBefore(script: { src?: string }) {
            insertedScripts.push(script)
          },
        },
      }
      const context = createContext({
        ...(hasExistingQueue ? { dataLayer } : {}),
        document: {
          getElementsByTagName: () => [firstScript],
          createElement: () => ({}),
        },
      })
      runInContext('window = globalThis', context)
      for (const script of headScripts(html)) {
        if (!/\bsrc=|application\/ld\+json/.test(script[1]) && script[2]) {
          expect(() => runInContext(script[2], context)).not.toThrow()
        }
      }
      const queue = context.dataLayer as unknown[]
      if (hasExistingQueue) {
        expect(queue).toBe(dataLayer)
        expect(queue[0]).toBe(previousEvent)
      }
      const commands = queue
        .filter(
          (entry) =>
            Object.prototype.toString.call(entry) === '[object Arguments]',
        )
        .map((entry) => Array.from(entry as IArguments))
      expect(commands.filter((command) => command[0] === 'config')).toEqual([
        ['config', adsId],
      ])
      expect(commands.filter((command) => command[0] === 'js')).toHaveLength(1)
      expect(insertedScripts).toEqual([
        expect.objectContaining({
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-PL9T5ZPM',
        }),
      ])
    },
  )
})
