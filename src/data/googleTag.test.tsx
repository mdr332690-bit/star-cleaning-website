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
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname)
  .filter((path) => !path.endsWith('/review'))

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
      const loaders = scripts.filter((script) => script[2].includes(loader))
      expect(loaders).toHaveLength(1)
      // Inject the async loader after privacy setup: React 19 hoists JSX async
      // scripts ahead of inline scripts, regardless of their source order.
      expect(scripts.some((script) => script[1].includes(loader))).toBe(false)
      expect(
        scripts.filter((script) =>
          script[2].includes(`gtag('config', '${adsId}',`),
        ),
      ).toHaveLength(1)
      expect(html.split(loader)).toHaveLength(2)
      const privacyScript = scripts.find((script) =>
        script[2].includes("gtag('consent', 'default'"),
      )!
      expect(privacyScript).toBeDefined()
      expect(privacyScript[2].indexOf("gtag('consent'")).toBeLessThan(
        privacyScript[2].indexOf(loader),
      )
      expect(html.indexOf(privacyScript[0])).toBeLessThan(
        html.indexOf('(function(w,d,s,l,i)'),
      )
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
      const insertedScripts: Array<{ src?: string; async?: boolean }> = []
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
          head: {
            appendChild(script: { src?: string; async?: boolean }) {
              // Privacy commands must already be queued when the loader is
              // inserted, even if the Google script is served from cache.
              const queue = context.dataLayer as IArguments[]
              expect(Array.from(queue.at(-1)!)).toEqual([
                'config',
                adsId,
                { send_page_view: false },
              ])
              insertedScripts.push(script)
            },
          },
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
        ['config', adsId, { send_page_view: false }],
      ])
      expect(commands[0]).toEqual([
        'consent',
        'default',
        {
          ad_storage: 'denied',
          analytics_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        },
      ])
      const policy = commands.find((command) => command[0] === 'policy')!
      expect(policy.slice(0, 2)).toEqual([
        'policy',
        'detect_user_provided_data',
      ])
      // Deny detection for both verified runtimes and future container IDs.
      const denyDetection = policy[2] as (...args: unknown[]) => boolean
      for (const container of [adsId, 'GTM-PL9T5ZPM', 'GTM-PZQ6WQ9G']) {
        for (const dataSource of ['auto', 'manual', 'code']) {
          expect(
            denyDetection(container, 'detect_user_provided_data', {
              dataSource,
            }),
          ).toBe(false)
        }
      }
      expect(commands.find((command) => command[0] === 'set')).toEqual([
        'set',
        {
          allow_enhanced_conversions: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          ads_data_redaction: true,
        },
      ])
      const configIndex = commands.findIndex(
        (command) => command[0] === 'config',
      )
      for (const command of ['consent', 'policy', 'set']) {
        expect(
          commands.findIndex((entry) => entry[0] === command),
        ).toBeLessThan(configIndex)
      }
      expect(
        commands.some(
          (command) => command[0] === 'consent' && command[1] === 'update',
        ),
      ).toBe(false)
      expect(commands.filter((command) => command[0] === 'js')).toHaveLength(1)
      expect(insertedScripts).toEqual([
        expect.objectContaining({ src: loader, async: true }),
        expect.objectContaining({
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-PL9T5ZPM',
        }),
      ])
    },
  )
})
