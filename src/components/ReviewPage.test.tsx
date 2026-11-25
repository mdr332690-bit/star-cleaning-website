import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ReviewPage } from './ReviewPage'
import { CustomerReviews } from './CustomerReviews'
import { reviewCopy } from '../data/reviews'

const syntheticCode = 'S'.repeat(43)
const send = vi.fn()
beforeEach(() => {
  send.mockReset()
  vi.stubGlobal('fetch', send)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
})

describe('bilingual customer review form', () => {
  it.each(['en', 'ar'] as const)(
    'submits %s and shows a pending, not published, confirmation',
    async (lang) => {
      const user = userEvent.setup()
      const copy = reviewCopy[lang]
      window.history.replaceState(
        null,
        '',
        `${lang === 'ar' ? '/ar' : ''}/review#invite=${syntheticCode}`,
      )
      send.mockResolvedValue(Response.json({ pending: true }, { status: 201 }))
      render(<ReviewPage lang={lang} />)
      expect(screen.getByRole('main').dir).toBe(lang === 'ar' ? 'rtl' : 'ltr')
      expect(window.location.hash).toBe('')
      expect(
        screen.getByRole('textbox', { name: copy.share }).getAttribute('value'),
      ).not.toContain('#')
      const name = screen.getByLabelText(copy.name, {
        exact: false,
        selector: 'input[name="name"]',
      })
      const experience = screen.getByLabelText(copy.experience, {
        exact: false,
      })
      await user.type(
        name,
        lang === 'ar' ? 'عميل اصطناعي' : 'Synthetic Test Customer',
      )
      const star = screen.getByRole('radio', {
        name: copy.stars(4),
      }) as HTMLInputElement
      star.focus()
      await user.keyboard('[Space]')
      expect(star.checked).toBe(true)
      await user.type(
        experience,
        lang === 'ar'
          ? 'هذا تقييم اصطناعي لأغراض الاختبار فقط.'
          : 'Synthetic review for automated testing only.',
      )
      await user.click(screen.getByRole('checkbox', { name: copy.consent }))
      await user.click(screen.getByRole('button', { name: copy.submit }))
      expect(await screen.findByText(copy.pending)).toBeTruthy()
      const [url, options] = send.mock.calls[0]
      expect(url).toBe('/api/reviews/submit')
      expect(options.body.get('code')).toBe(syntheticCode)
      expect(options.body.get('language')).toBe(lang)
      expect(options.body.get('rating')).toBe('4')
    },
  )

  it('requires a code, comment, star rating and explicit consent before network activity', async () => {
    const user = userEvent.setup()
    render(<ReviewPage lang="en" />)
    await user.click(screen.getByRole('button', { name: 'Submit review' }))
    expect(send).not.toHaveBeenCalled()
    expect((screen.getByRole('checkbox') as HTMLInputElement).required).toBe(
      true,
    )
    expect((screen.getAllByRole('radio')[0] as HTMLInputElement).required).toBe(
      true,
    )
    expect(
      screen
        .getByRole('link', { name: 'Request an invitation on WhatsApp' })
        .getAttribute('href'),
    ).toBe('https://wa.me/96550258260')
  })

  it('preserves customer details after a rejected photo and allows retry without it', async () => {
    const user = userEvent.setup()
    const text = reviewCopy.en
    window.history.replaceState(null, '', `/review#invite=${syntheticCode}`)
    send
      .mockResolvedValueOnce(Response.json({ error: 'photo' }, { status: 400 }))
      .mockResolvedValueOnce(Response.json({ pending: true }, { status: 201 }))
    render(<ReviewPage lang="en" />)
    const experience = screen.getByLabelText(text.experience, {
      exact: false,
    }) as HTMLTextAreaElement
    const upload = screen.getByLabelText(text.photo, {
      exact: false,
    }) as HTMLInputElement
    await user.type(
      screen.getByLabelText(text.name, {
        exact: false,
        selector: 'input[name="name"]',
      }),
      'Synthetic Name',
    )
    await user.type(experience, 'Synthetic test review, not public feedback.')
    await user.click(screen.getByRole('radio', { name: text.stars(2) }))
    await user.click(screen.getByRole('checkbox'))
    await user.upload(
      upload,
      new File(['synthetic'], 'test.png', { type: 'image/png' }),
    )
    await user.click(screen.getByRole('button', { name: text.submit }))
    expect((await screen.findByRole('alert')).textContent).toBe(
      text.error.photo,
    )
    expect(experience.value).toBe('Synthetic test review, not public feedback.')
    expect(upload.files?.length).toBe(1)
    expect(send.mock.calls[0][1].body.get('photo').name).toBe('test.png')
    await user.click(screen.getByRole('button', { name: 'Remove photo' }))
    await user.click(screen.getByRole('button', { name: text.submit }))
    expect(await screen.findByText(text.pending)).toBeTruthy()
  })
})

describe('homepage first-party reviews', () => {
  it('shows a localized empty state with no invented rating', async () => {
    send.mockResolvedValue(
      Response.json({ average: null, total: 0, reviews: [] }),
    )
    render(<CustomerReviews lang="ar" />)
    expect(await screen.findByText(reviewCopy.ar.empty)).toBeTruthy()
    expect(screen.queryByRole('img')).toBeNull()
    expect(
      screen
        .getByRole('link', { name: reviewCopy.ar.write })
        .getAttribute('href'),
    ).toBe('/ar/review')
  })

  it('renders photo/numbers from the approved feed and escapes review text', async () => {
    send.mockResolvedValue(
      Response.json({
        average: 3.4,
        total: 17,
        reviews: [
          {
            id: 'synthetic-test',
            name: 'Synthetic Test',
            rating: 2,
            experience: '<script>synthetic text</script>',
            language: 'ar',
            submittedAt: '2026-01-01T22:30:00Z',
            hasPhoto: true,
          },
        ],
      }),
    )
    const { container } = render(<CustomerReviews lang="en" />)
    expect(
      await screen.findByText('3.4 out of 5 · 17 approved reviews'),
    ).toBeTruthy()
    expect(screen.getByText('<script>synthetic text</script>')).toBeTruthy()
    expect(container.querySelector('script')).toBeNull()
    expect(
      screen.getByAltText(reviewCopy.en.photoAlt).getAttribute('src'),
    ).toBe('/api/reviews/photo/synthetic-test')
    await waitFor(() =>
      expect(container.querySelector('time')?.textContent).toContain('2'),
    )
  })
})
