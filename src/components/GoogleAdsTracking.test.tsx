import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { StrictMode } from 'react'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getRouter } from '../router'
import { bookingCopy, kuwaitNow } from '../data/booking'
import { copy } from '../data/content'
import { site } from '../data/site'
import { ContactActions, ContactNumber } from './SiteUI'

const phoneConversion = [
  'event',
  'conversion',
  {
    send_to: 'AW-18535502279/jZEvCP7fqLwdEMejtYZF',
    value: 1,
    currency: 'USD',
  },
]
const bookingConversion = [
  'event',
  'conversion',
  { send_to: 'AW-18535502279/KBtqCJDU97wdEMejtYZF' },
]
const sitemap = readFileSync(
  resolve(process.cwd(), 'public/sitemap.xml'),
  'utf8',
)
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
)
const cases = paths.flatMap((path) =>
  [390, 1440].map((width) => ({ path, width })),
)

beforeEach(() => {
  vi.stubGlobal('gtag', vi.fn())
  vi.stubGlobal('open', vi.fn().mockReturnValue(null))
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(() => Promise.resolve(new Response('Received'))),
  )
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  // jsdom lacks the native dialog methods; emulate opening/closing only.
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function () {
    this.open = false
  }
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function clickWithoutNavigation(link: Element) {
  link.addEventListener('click', (event) => event.preventDefault(), {
    once: true,
  })
  fireEvent.click(link.querySelector('svg, bdi') ?? link)
}

function fillAndSubmit(form: HTMLFormElement) {
  for (const [name, value] of Object.entries({
    fullName: 'Private Test Customer',
    mobile: '00000000',
    whatsappNumber: '11111111',
    service: 'Office Cleaning',
    area: 'Test Area',
    preferredDate: kuwaitNow(new Date(Date.now() + 86400000)).date,
    preferredTime: '14:30',
    message:
      'Private message and private@example.test must never reach Google.',
  })) {
    fireEvent.change(form.querySelector(`[name="${name}"]`)!, {
      target: { value },
    })
  }
  fireEvent.submit(form)
}

async function renderPage(path: string) {
  const router = getRouter()
  router.update({
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  await router.load()
  const view = render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
  await screen.findByRole('heading', { level: 1 })
  return view
}

describe('Homepage contact actions', () => {
  it.each([
    { path: '/', lang: 'en', quoteLabel: 'Request a Quote' },
    { path: '/ar', lang: 'ar', quoteLabel: 'اطلب عرض سعر' },
  ] as const)('separates calls, chats and quote requests on $path', async ({
    path,
    lang,
    quoteLabel,
  }) => {
    const { container } = await renderPage(path)
    const labels = copy[lang]
    const header = within(container.querySelector<HTMLElement>('.site-header')!)
    const hero = within(container.querySelector<HTMLElement>('.hero')!)
    const floating = within(
      container.querySelector<HTMLElement>('.floating-contact')!,
    )

    async function expectQuoteDialog(trigger: HTMLElement) {
      expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
      fireEvent.click(trigger)
      const dialog = within(await screen.findByRole('dialog'))
      await dialog.findByRole('form')
      fireEvent.click(dialog.getByRole('button', { name: labels.close }))
      expect(screen.queryByRole('dialog')).toBeNull()
    }

    function expectDirectChat(link: HTMLElement) {
      expect(link.getAttribute('href')).toBe('https://wa.me/96550258260')
      expect(link.getAttribute('target')).toBe('_blank')
      clickWithoutNavigation(link)
      expect(screen.queryByRole('dialog')).toBeNull()
    }

    for (const scope of [header, hero, floating]) {
      await expectQuoteDialog(scope.getByRole('button', { name: quoteLabel }))
    }
    expectDirectChat(header.getByRole('link', { name: labels.whatsapp }))
    expectDirectChat(hero.getByRole('link', { name: labels.whatsapp }))
    expectDirectChat(
      floating.getByRole('link', { name: bookingCopy[lang].whatsapp }),
    )

    const openMenu = () => {
      fireEvent.click(header.getByRole('button', { name: labels.menu }))
      return within(header.getByRole('navigation', { name: labels.menu }))
    }
    expectDirectChat(openMenu().getByRole('link', { name: labels.whatsapp }))
    expect(header.queryByRole('navigation', { name: labels.menu })).toBeNull()
    await expectQuoteDialog(openMenu().getByRole('button', { name: quoteLabel }))
    expect(header.queryByRole('navigation', { name: labels.menu })).toBeNull()

    for (const number of screen.getAllByText(site.phoneDisplay)) {
      expect(number.closest('a')?.getAttribute('href')).toBe('tel:+96550258260')
    }
    for (const call of screen.getAllByRole('link', { name: labels.callNow })) {
      expect(call.getAttribute('href')).toBe('tel:+96550258260')
    }
    expect(screen.queryByRole('button', { name: /WhatsApp|واتساب/i })).toBeNull()
    expect(window.gtag).not.toHaveBeenCalled()
  })
})

describe('Google Ads lead conversions with mocked browser services', () => {
  it.each(cases)(
    'tracks telephone links and confirmed forms once on $path at $width px',
    async ({ path, width }) => {
      vi.stubGlobal('innerWidth', width)
      const lang = path.startsWith('/ar') ? 'ar' : 'en'
      const { container } = await renderPage(path)
      const inline = container.querySelector<HTMLFormElement>('form')
      expect(window.gtag).not.toHaveBeenCalled()
      expect(container.querySelector('.site')?.getAttribute('lang')).toBe(lang)
      expect(container.querySelector('.site')?.getAttribute('dir')).toBe(
        lang === 'ar' ? 'rtl' : 'ltr',
      )

      const phones = container.querySelectorAll('a[href^="tel:"]')
      expect(phones).toHaveLength(inline ? 6 : 5)
      for (const link of phones) {
        expect(link.getAttribute('href')).toBe('tel:+96550258260')
        clickWithoutNavigation(link)
      }
      expect(vi.mocked(window.gtag!).mock.calls).toEqual(
        Array.from(phones, () => phoneConversion),
      )
      vi.mocked(window.gtag!).mockClear()
      const whatsAppLinks = container.querySelectorAll(
        'a[href^="https://wa.me/"]',
      )
      expect(whatsAppLinks.length).toBeGreaterThan(0)
      for (const link of whatsAppLinks) clickWithoutNavigation(link)
      expect(window.gtag).not.toHaveBeenCalled()

      // Homepages have an inline form as well as the shared booking dialog.
      let bookingTrigger = container.querySelector('.header-book')!
      if (inline) {
        const floaters =
          container.querySelectorAll<HTMLElement>('.floating-contact')
        expect(floaters).toHaveLength(1)
        const actions = within(floaters[0])
        const booking = actions.getByRole('button', {
          name: copy[lang].requestQuote,
        })
        const whatsapp = actions.getByRole('link', {
          name: bookingCopy[lang].whatsapp,
        })
        const email = actions.getByRole('link', { name: copy[lang].emailLabel })
        expect([...floaters[0].children]).toEqual([booking, whatsapp, email])
        expect(booking.getAttribute('aria-haspopup')).toBe('dialog')
        expect(whatsapp.getAttribute('href')).toBe(
          `https://wa.me/${site.whatsappNumber}`,
        )
        expect(whatsapp.getAttribute('target')).toBe('_blank')
        const footerEmail = within(screen.getByRole('contentinfo')).getByRole(
          'link',
          { name: 'mdr332690@gmail.com' },
        )
        expect(footerEmail.querySelector('bdi')?.dir).toBe('ltr')
        for (const link of [email, footerEmail]) {
          expect(link.getAttribute('href')).toBe('mailto:mdr332690@gmail.com')
          clickWithoutNavigation(link)
        }
        expect(window.gtag).not.toHaveBeenCalled()
        bookingTrigger = booking

        fillAndSubmit(inline)
        await screen.findByText(bookingCopy[lang].successTitle)
        expect(vi.mocked(window.gtag!).mock.calls).toEqual([bookingConversion])
        vi.mocked(window.gtag!).mockClear()
      }

      fireEvent.click(bookingTrigger)
      const dialog = await screen.findByRole('dialog')
      const form = (await within(dialog).findByRole('form')) as HTMLFormElement
      expect(window.gtag).not.toHaveBeenCalled()
      fillAndSubmit(form)
      await within(dialog).findByText(bookingCopy[lang].successTitle)
      expect(vi.mocked(window.gtag!).mock.calls).toEqual([bookingConversion])

      // Explicit follow-up links and UI rerenders must not create another lead.
      const followUp = dialog.querySelector('a[href^="https://wa.me/"]')!
      clickWithoutNavigation(followUp)
      fireEvent.click(
        within(dialog).getByRole('button', { name: bookingCopy[lang].another }),
      )
      expect(vi.mocked(window.gtag!).mock.calls).toEqual([bookingConversion])
    },
  )

  it.each(['missing', 'throwing'])(
    'keeps telephone links usable when the Google tag is %s',
    (failure) => {
      vi.stubGlobal(
        'gtag',
        failure === 'missing'
          ? undefined
          : vi.fn(() => {
              throw new Error('Tracking blocked')
            }),
      )
      const { container } = render(
        <>
          <ContactActions lang="ar" />
          <ContactNumber />
        </>,
      )
      for (const link of container.querySelectorAll('a[href^="tel:"]')) {
        expect(link.getAttribute('href')).toBe('tel:+96550258260')
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
        // Observe cancellation before preventing jsdom's unsupported navigation.
        let cancelled = true
        const observe = (click: MouseEvent) => {
          cancelled = click.defaultPrevented
          click.preventDefault()
        }
        document.addEventListener('click', observe, { once: true })
        expect(() => link.dispatchEvent(event)).not.toThrow()
        expect(cancelled).toBe(false)
      }
    },
  )
})
