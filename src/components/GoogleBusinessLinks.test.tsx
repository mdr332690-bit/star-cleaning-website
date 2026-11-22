import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { copy } from '../data/content'
import { site } from '../data/site'
import { GoogleBusinessLinks } from './GoogleBusinessLinks'

// Reserved test domains exercise exact URL handling without inventing a Google
// business identifier or suggesting these are verified business destinations.
const reviewUrl = 'https://reviews.example.test/submit?source=site&lang=en'
const profileUrl = 'https://maps.example.test/star-cleaning-service'
const originalReviewUrl = site.googleReviewUrl
const originalProfileUrl = site.googleBusinessProfileUrl

afterEach(() => {
  cleanup()
  site.googleReviewUrl = originalReviewUrl
  site.googleBusinessProfileUrl = originalProfileUrl
})

describe('verified Google destinations', () => {
  it('renders nothing while both verified links are missing', () => {
    site.googleReviewUrl = ''
    site.googleBusinessProfileUrl = ''
    const { container } = render(<GoogleBusinessLinks lang="en" />)
    expect(container.innerHTML).toBe('')
  })

  it('never substitutes the profile URL for a missing review destination', () => {
    site.googleReviewUrl = ''
    site.googleBusinessProfileUrl = profileUrl
    render(<GoogleBusinessLinks lang="en" />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(
      screen.queryByRole('link', { name: /Write a Google Review/ }),
    ).toBeNull()
    expect(screen.getByRole('link').getAttribute('href')).toBe(profileUrl)
  })

  it('can enable the review button independently of the profile link', () => {
    site.googleReviewUrl = reviewUrl
    site.googleBusinessProfileUrl = ''
    render(<GoogleBusinessLinks lang="en" />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link').getAttribute('href')).toBe(reviewUrl)
  })

  it.each(['en', 'ar'] as const)(
    'uses exact, separate destinations and accessible %s labels',
    (lang) => {
      site.googleReviewUrl = reviewUrl
      site.googleBusinessProfileUrl = profileUrl
      render(<GoogleBusinessLinks lang={lang} />)
      const t = copy[lang]
      for (const [label, destination] of [
        [t.googleReview, reviewUrl],
        [t.googleBusinessProfile, profileUrl],
      ]) {
        const link = screen.getByRole('link', {
          name: `${label} (${t.opensNewTab})`,
        })
        expect(link.getAttribute('href')).toBe(destination)
        expect(link.getAttribute('target')).toBe('_blank')
        expect(link.getAttribute('rel')).toBe('noopener noreferrer')
      }
      expect(
        screen.getByRole('group', { name: t.googleBusinessLinks }),
      ).toBeTruthy()
    },
  )

  it('keeps the testimonials action focused on writing a review', () => {
    site.googleReviewUrl = reviewUrl
    site.googleBusinessProfileUrl = profileUrl
    render(<GoogleBusinessLinks lang="en" onDark reviewOnly />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe(reviewUrl)
    expect(link.classList.contains('button-cream')).toBe(true)
  })

  it('does not render a testimonials action when only a profile is available', () => {
    site.googleReviewUrl = ''
    site.googleBusinessProfileUrl = profileUrl
    const { container } = render(<GoogleBusinessLinks lang="ar" reviewOnly />)
    expect(container.innerHTML).toBe('')
  })
})
