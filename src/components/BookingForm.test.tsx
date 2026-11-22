import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
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
      const fetch = vi.fn().mockResolvedValue(
        new Response('<html>Thank you for your submission.</html>', {
          status: 200,
        }),
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
    resolve(new Response('Received'))
    await screen.findByText(bookingCopy.en.successTitle)
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
    expect(
      screen.getByRole('link', { name: bookingCopy.en.openWhatsApp }),
    ).toBeTruthy()
  })

  it('keeps the editable WhatsApp enquiry available in the booking dialog', async () => {
    render(<Booking lang="en" initialService="villa" />)
    expect(
      (screen.getByLabelText(/Service Type/) as HTMLSelectElement).value,
    ).toBe('Villa Cleaning')
    fireEvent.click(screen.getByText(bookingCopy.en.alternate))
    const message = screen.getByLabelText(copy.en.messageLabel)
    fireEvent.change(message, {
      target: { value: 'Please discuss villa cleaning with me.' },
    })
    await waitFor(() => {
      const link = screen.getByRole('link', { name: copy.en.sendWhatsApp })
      expect(link.getAttribute('href')).toBe(
        'https://wa.me/96550258260?text=Please%20discuss%20villa%20cleaning%20with%20me.',
      )
    })
  })
})
