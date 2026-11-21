// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  bookingCopy,
  bookingWhatsAppMessage,
  kuwaitNow,
  normalizePhone,
  validateBooking,
} from './booking'

const now = new Date('2026-11-20T21:30:00Z')
const valid = {
  fullName: 'عميل التنظيف',
  mobile: '٥٠٢٥٨٢٦٠',
  whatsappNumber: '',
  service: 'Apartment Cleaning',
  area: 'السالمية',
  preferredDate: '2026-11-21',
  preferredTime: '10:00',
  message: '',
}

function data(overrides: Partial<typeof valid> = {}) {
  const form = new FormData()
  Object.entries({ ...valid, ...overrides }).forEach(([name, value]) =>
    form.set(name, value),
  )
  return form
}

describe('WhatsApp booking message', () => {
  it.each(['en', 'ar'] as const)(
    'handles optional details and localizes the service in %s',
    (lang) => {
      const message = bookingWhatsAppMessage(data(), lang)
      const t = bookingCopy[lang]
      expect(message).toContain(`${t.mobile}: 50258260`)
      expect(message).toContain(
        `${t.service}: ${lang === 'ar' ? 'تنظيف الشقق' : 'Apartment Cleaning'}`,
      )
      expect(message).toContain(`${t.message}: ${t.notProvided}`)
      expect(message).not.toContain(`${t.whatsappNumber}:`)
    },
  )
})

describe('booking validation', () => {
  it('uses Kuwait time across the UTC date boundary', () => {
    expect(kuwaitNow(now)).toEqual({ date: '2026-11-21', time: '00:30' })
    expect(validateBooking(data(), 'ar', now)).toEqual({})
  })

  it('accepts local and international numbers in Latin, Arabic and Persian digits', () => {
    expect(normalizePhone('+٩٦٥ ۵۰۲۵۸۲۶۰')).toBe('+965 50258260')
    expect(
      validateBooking(
        data({ mobile: '+965 50258260', whatsappNumber: '۵۰۲۵۸۲۶۰' }),
        'en',
        now,
      ),
    ).toEqual({})
  })

  it.each([
    { fullName: '  ' },
    { fullName: 'a'.repeat(101) },
    { mobile: '123' },
    { mobile: 'phone50258260' },
    { mobile: '1234567890123456' },
    { whatsappNumber: 'bad number' },
    { service: 'Unknown service' },
    { area: ' ' },
    { area: 'a'.repeat(201) },
    { preferredDate: '2026-11-20' },
    { preferredDate: '2027-02-30' },
    { preferredDate: '' },
    { preferredTime: '00:29' },
    { preferredTime: '00:30' },
    { preferredTime: '24:00' },
    { preferredTime: '' },
    { message: 'a'.repeat(2001) },
  ])('rejects invalid or past values: %o', (overrides) => {
    const field = Object.keys(overrides)[0] as keyof typeof valid
    expect(validateBooking(data(overrides), 'en', now)[field]).toBe(
      bookingCopy.en.validation[field],
    )
    expect(validateBooking(data(overrides), 'ar', now)[field]).toBe(
      bookingCopy.ar.validation[field],
    )
  })
})
