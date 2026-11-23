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

describe('Google Ads lead conversions with mocked browser services', () => {
  it.each(cases)(
    'tracks telephone links and confirmed forms once on $path at $width px',
    async ({ path, width }) => {
      vi.stubGlobal('innerWidth', width)
      const lang = path.startsWith('/ar') ? 'ar' : 'en'
      const router = getRouter()
      router.update({
        history: createMemoryHistory({ initialEntries: [path] }),
      })
      await router.load()
      const { container } = render(
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>,
      )
      await screen.findByRole('heading', { level: 1 })
      expect(window.gtag).not.toHaveBeenCalled()
      expect(container.querySelector('.site')?.getAttribute('lang')).toBe(lang)
      expect(container.querySelector('.site')?.getAttribute('dir')).toBe(
        lang === 'ar' ? 'rtl' : 'ltr',
      )

      const phones = container.querySelectorAll('a[href^="tel:"]')
      expect(phones).toHaveLength(5)
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
      const inline = container.querySelector<HTMLFormElement>('form')
      let bookingTrigger = container.querySelector('.header-book')!
      if (inline) {
        const floaters =
          container.querySelectorAll<HTMLElement>('.floating-contact')
        expect(floaters).toHaveLength(1)
        const actions = within(floaters[0])
        const booking = actions.getByRole('button', {
          name: lang === 'ar' ? 'احجز خدمة تنظيف' : 'Book a cleaning',
        })
        const whatsapp = actions.getByRole('link', {
          name: bookingCopy[lang].whatsapp,
        })
        expect([...floaters[0].children]).toEqual([booking, whatsapp])
        expect(booking.getAttribute('aria-haspopup')).toBe('dialog')
        expect(whatsapp.getAttribute('href')).toBe(
          `https://wa.me/${site.whatsappNumber}`,
        )
        expect(whatsapp.getAttribute('target')).toBe('_blank')
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
