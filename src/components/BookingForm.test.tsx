import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { BookingForm } from './BookingForm'
import Booking from './Booking'
import { copy } from '../data/content'
import {
  bookingCopy,
  bookingEndpoint,
  bookingFormName,
  bookingServices,
  kuwaitNow,
} from '../data/booking'

beforeEach(() => {
  vi.stubGlobal('open', vi.fn().mockReturnValue(null))
  vi.stubGlobal('gtag', vi.fn())
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function fillForm(lang: 'en' | 'ar' = 'en') {
  const t = bookingCopy[lang]
  const values = {
    fullName: 'عميل التنظيف',
    mobile: '٥٠٢٥٨٢٦٠',
    whatsappNumber: '+965 50258260',
    service: 'Apartment Cleaning',
    area: 'السالمية',
    preferredDate: kuwaitNow(new Date(Date.now() + 86400000)).date,
    preferredTime: '14:30',
    message:
      'أرغب في الاستفسار عن تنظيف شقة من غرفتين. & ? # +\nPlease call first.',
  }
  for (const [name, value] of Object.entries(values)) {
    fireEvent.change(
      screen.getByLabelText(new RegExp(t[name as keyof typeof values])),
      { target: { value } },
    )
  }
  return values
}

function submit(lang: 'en' | 'ar' = 'en') {
  fireEvent.submit(
    screen.getByRole('form', { name: bookingCopy[lang].formTitle }),
  )
}

describe('Netlify Forms deployment configuration', () => {
  it.each(['en', 'ar'] as const)(
    'registers every submitted field for the %s form and targets static HTML',
    (lang) => {
      const { container } = render(<BookingForm lang={lang} />)
      const registration = new DOMParser().parseFromString(
        readFileSync(resolve(process.cwd(), 'public/__forms.html'), 'utf8'),
        'text/html',
      )
      const skeleton = registration.querySelector('form')!
      const form = container.querySelector('form')!
      const names = (element: Element) =>
        [...element.querySelectorAll('[name]')]
          .map((field) => field.getAttribute('name'))
          .sort()
      expect(names(form)).toEqual(names(skeleton))
      for (const element of [form, skeleton]) {
        expect(element.getAttribute('name')).toBe(bookingFormName)
        expect(element.getAttribute('method')?.toUpperCase()).toBe('POST')
        expect(element.getAttribute('data-netlify')).toBe('true')
        expect(element.getAttribute('netlify-honeypot')).toBe('bot-field')
        expect(
          element
            .querySelector('input[name="form-name"]')
            ?.getAttribute('value'),
        ).toBe(bookingFormName)
      }
      expect(form.getAttribute('action')).toBe(bookingEndpoint)
      expect(
        screen.getByText(bookingCopy[lang].serviceBoundary, { exact: false }),
      ).toBeTruthy()
      expect(
        existsSync(resolve(process.cwd(), '.netlify/features/netlify-forms')),
      ).toBe(true)
    },
  )
})

describe('booking inquiry submission', () => {
  it.each(['en', 'ar'] as const)(
    'validates and focuses missing fields in %s without sending',
    async (lang) => {
      const fetch = vi.fn()
      vi.stubGlobal('fetch', fetch)
      render(<BookingForm lang={lang} />)
      submit(lang)
      expect(fetch).not.toHaveBeenCalled()
      expect(window.open).not.toHaveBeenCalled()
      expect(window.gtag).not.toHaveBeenCalled()
      expect(
        screen.getByText(bookingCopy[lang].validation.fullName),
      ).toBeTruthy()
      expect(document.activeElement).toBe(
        screen.getByLabelText(new RegExp(bookingCopy[lang].fullName)),
      )
      expect(
        screen
          .getByLabelText(new RegExp(bookingCopy[lang].mobile))
          .getAttribute('aria-invalid'),
      ).toBe('true')
    },
  )

  it.each(['en', 'ar'] as const)(
    'opens a complete WhatsApp message, sends URL-encoded data and shows success in %s',
    async (lang) => {
      const fetch = vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response('<html>Thank you for your submission.</html>', {
            status: 200,
          }),
        ),
      )
      vi.stubGlobal('fetch', fetch)
      render(<BookingForm lang={lang} />)
      const values = fillForm(lang)
      submit(lang)
      expect(window.open).toHaveBeenCalledTimes(1)
      const [openedUrl, target, features] = vi.mocked(window.open).mock.calls[0]
      const whatsapp = new URL(String(openedUrl))
      expect(whatsapp.origin + whatsapp.pathname).toBe(
        'https://wa.me/96550258260',
      )
      expect(target).toBe('_blank')
      expect(features).toBe('noopener,noreferrer')
      const t = bookingCopy[lang]
      const message = whatsapp.searchParams.get('text')!
      expect(message).toBe(
        [
          t.whatsappIntro,
          '',
          `${t.fullName}: ${values.fullName}`,
          `${t.mobile}: 50258260`,
          `${t.whatsappNumber}: ${values.whatsappNumber}`,
          `${t.service}: ${bookingServices.find((service) => service.en === values.service)![lang]}`,
          `${t.area}: ${values.area}`,
          `${t.preferredDate}: ${values.preferredDate}`,
          `${t.preferredTime}: ${values.preferredTime}`,
          t.kuwaitTime,
          `${t.message}: ${values.message}`,
        ].join('\n'),
      )
      await screen.findByText(bookingCopy[lang].successTitle)
      expect(vi.mocked(window.gtag!).mock.calls).toEqual([
        [
          'event',
          'conversion',
          { send_to: 'AW-18535502279/KBtqCJDU97wdEMejtYZF' },
        ],
      ])
      const [url, request] = fetch.mock.calls[0]
      expect(url).toBe('/__forms.html')
      expect(request.method).toBe('POST')
      expect(request.keepalive).toBe(true)
      expect(request.headers['Content-Type']).toBe(
        'application/x-www-form-urlencoded',
      )
      const payload = new URLSearchParams(request.body)
      expect(Object.fromEntries(payload)).toEqual({
        ...values,
        mobile: '50258260',
        'form-name': bookingFormName,
        language: lang,
        'bot-field': '',
      })
      expect(screen.getByText(bookingCopy[lang].successNote)).toBeTruthy()
      expect(document.activeElement?.getAttribute('role')).toBe('status')
      expect(
        screen
          .getByRole('link', { name: bookingCopy[lang].openWhatsApp })
          .getAttribute('href'),
      ).toBe(String(openedUrl))
      expect(screen.getByText(t.whatsappInstructions)).toBeTruthy()
      fireEvent.click(
        screen.getByRole('button', { name: bookingCopy[lang].another }),
      )
      expect(
        (
          screen.getByLabelText(
            new RegExp(bookingCopy[lang].fullName),
          ) as HTMLInputElement
        ).value,
      ).toBe('')
      expect(screen.queryByRole('link', { name: t.openWhatsApp })).toBeNull()
      expect(window.gtag).toHaveBeenCalledTimes(1)
      fillForm(lang)
      submit(lang)
      await screen.findByText(t.successTitle)
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(window.gtag).toHaveBeenCalledTimes(2)
    },
  )

  it.each([
    [
      'HTTP error',
      () => Promise.resolve(new Response('Unavailable', { status: 503 })),
    ],
    ['network error', () => Promise.reject(new TypeError('Offline'))],
    [
      'unprocessed development HTML',
      () => Promise.resolve(new Response('<form data-netlify="true"></form>')),
    ],
    [
      'static HTML with processed attributes',
      () =>
        Promise.resolve(
          new Response(
            '<meta name="netlify-form-registration" content="star-cleaning-booking">',
          ),
        ),
    ],
  ])(
    'keeps details for retry and never claims success after %s',
    async (_, response) => {
      const fetch = vi.fn().mockImplementation(response)
      vi.stubGlobal('fetch', fetch)
      render(<BookingForm lang="en" />)
      const values = fillForm()
      submit()
      await screen.findByRole('alert')
      expect(screen.queryByText(bookingCopy.en.successTitle)).toBeNull()
      expect(window.gtag).not.toHaveBeenCalled()
      const whatsapp = screen.getByRole('link', {
        name: bookingCopy.en.openWhatsApp,
      })
      expect(
        new URL(whatsapp.getAttribute('href')!).searchParams.get('text'),
      ).toContain(values.message)
      expect(
        (screen.getByLabelText(/Customer Full Name/) as HTMLInputElement).value,
      ).toBe(values.fullName)
      expect(
        (screen.getByLabelText(/Additional Message/) as HTMLTextAreaElement)
          .value,
      ).toBe(values.message)
      fireEvent.change(screen.getByLabelText(/Area \/ Location/), {
        target: { value: 'Hawalli' },
      })
      expect(screen.queryByRole('alert')).toBeNull()
      expect(
        screen.queryByRole('link', { name: bookingCopy.en.openWhatsApp }),
      ).toBeNull()
      fetch.mockResolvedValue(new Response('Received', { status: 200 }))
      submit()
      await screen.findByText(bookingCopy.en.successTitle)
      expect(window.gtag).toHaveBeenCalledExactlyOnceWith(
        'event',
        'conversion',
        { send_to: 'AW-18535502279/KBtqCJDU97wdEMejtYZF' },
      )
    },
  )

  it('disables fields and prevents duplicate requests while pending', async () => {
    let resolve!: (response: Response) => void
    const fetch = vi.fn().mockReturnValue(
      new Promise<Response>((done) => {
        resolve = done
      }),
    )
    vi.stubGlobal('fetch', fetch)
    render(<BookingForm lang="en" />)
    fillForm()
    submit()
    expect(window.open).toHaveBeenCalledTimes(1)
    expect(
      (
        screen.getByRole('button', {
          name: bookingCopy.en.sending,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true)
    expect(screen.getByRole('form').getAttribute('aria-busy')).toBe('true')
    submit()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(window.open).toHaveBeenCalledTimes(1)
    expect(window.gtag).not.toHaveBeenCalled()
    resolve(new Response('Received'))
    await screen.findByText(bookingCopy.en.successTitle)
    expect(window.gtag).toHaveBeenCalledTimes(1)
  })

  it('still saves the inquiry if the browser refuses to open WhatsApp', async () => {
    vi.mocked(window.open).mockImplementation(() => {
      throw new Error('Opening a new tab is blocked')
    })
    const fetch = vi.fn().mockResolvedValue(new Response('Received'))
    vi.stubGlobal('fetch', fetch)
    render(<BookingForm lang="en" />)
    fillForm()
    submit()
    await screen.findByText(bookingCopy.en.successTitle)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(window.gtag).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole('link', { name: bookingCopy.en.openWhatsApp }),
    ).toBeTruthy()
  })

  it.each(['en', 'ar'] as const)(
    'clarifies the scope and keeps the editable WhatsApp enquiry in the %s booking dialog',
    async (lang) => {
      const t = bookingCopy[lang]
      render(
        <dialog open>
          <Booking lang={lang} initialService="villa" />
        </dialog>,
      )
      const dialog = within(screen.getByRole('dialog'))
      expect(dialog.getByText(t.serviceBoundary, { exact: false })).toBeTruthy()
      expect(
        (dialog.getByLabelText(new RegExp(t.service)) as HTMLSelectElement).value,
      ).toBe('Villa Cleaning')
      fireEvent.click(dialog.getByText(t.alternate))
      const message = dialog.getByLabelText(copy[lang].messageLabel)
      const draft =
        lang === 'ar'
          ? 'أود الاستفسار عن تنظيف الفيلا.'
          : 'Please discuss villa cleaning with me.'
      fireEvent.change(message, { target: { value: draft } })
      await waitFor(() => {
        const link = dialog.getByRole('link', { name: copy[lang].sendWhatsApp })
        expect(link.getAttribute('href')).toBe(
          `https://wa.me/96550258260?text=${encodeURIComponent(draft)}`,
        )
      })
      expect(window.gtag).not.toHaveBeenCalled()
    },
  )

  it.each(['en', 'ar'] as const)(
    'does not count a honeypot submission even if its response is successful in %s',
    async (lang) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(new Response('Received')),
      )
      const { container } = render(<BookingForm lang={lang} />)
      fillForm(lang)
      fireEvent.change(container.querySelector('[name="bot-field"]')!, {
        target: { value: 'spam' },
      })
      submit(lang)
      await screen.findByText(bookingCopy[lang].successTitle)
      expect(window.gtag).not.toHaveBeenCalled()
    },
  )

  it.each(['missing', 'throwing'])(
    'preserves confirmed success when the Google tag is %s',
    async (failure) => {
      vi.stubGlobal(
        'gtag',
        failure === 'missing'
          ? undefined
          : vi.fn(() => {
              throw new Error('Tracking blocked')
            }),
      )
      const fetch = vi.fn().mockResolvedValue(new Response('Received'))
      vi.stubGlobal('fetch', fetch)
      render(<BookingForm lang="en" />)
      fillForm()
      submit()
      await screen.findByText(bookingCopy.en.successTitle)
      expect(screen.queryByRole('alert')).toBeNull()
      expect(fetch).toHaveBeenCalledTimes(1)
    },
  )

  it('does not count a late response after the booking dialog is unmounted', async () => {
    let resolve!: (response: Response) => void
    const fetch = vi.fn().mockReturnValue(
      new Promise<Response>((done) => {
        resolve = done
      }),
    )
    vi.stubGlobal('fetch', fetch)
    const { unmount } = render(<BookingForm lang="en" />)
    fillForm()
    submit()
    const signal = fetch.mock.calls[0][1].signal as AbortSignal
    unmount()
    expect(signal.aborted).toBe(true)
    await act(async () => resolve(new Response('Received')))
    expect(window.gtag).not.toHaveBeenCalled()
  })
})
