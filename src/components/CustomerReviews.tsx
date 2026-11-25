import { useEffect, useRef, useState } from 'react'
import type { Language } from '../data/content'
import {
  reviewCopy,
  reviewDate,
  reviewPath,
  type ReviewFeed,
} from '../data/reviews'
import { Icon, Star } from './Icon'
import { Eyebrow } from './SiteUI'

export function ReviewStars({
  rating,
  label,
}: {
  rating: number
  label: string
}) {
  return (
    <span className="review-stars" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star key={value} className={value <= rating ? 'is-filled' : ''} />
      ))}
    </span>
  )
}

export function CustomerReviews({ lang }: { lang: Language }) {
  const text = reviewCopy[lang]
  const [feed, setFeed] = useState<ReviewFeed | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [visible, setVisible] = useState(false)
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!section.current || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '320px 0px' },
    )
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!visible) return
    const controller = new AbortController()
    setFailed(false)
    fetch('/api/reviews/list', { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Reviews unavailable')
        const result: ReviewFeed = await response.json()
        if (!controller.signal.aborted) setFeed(result)
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true)
      })
    return () => controller.abort()
  }, [attempt, visible])

  const number = new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-KW')
  return (
    <section
      ref={section}
      className="section reviews-section"
      id="testimonials"
      aria-labelledby="reviews-heading"
    >
      <div className="container reviews-grid">
        <div>
          <Eyebrow>{text.eyebrow}</Eyebrow>
          <h2 id="reviews-heading">{text.reviews}</h2>
          <p className="reviews-description">{text.reviewsIntro}</p>
          <a href={reviewPath(lang)} className="button button-cream">
            {text.write}
          </a>
        </div>
        <div className="review-feed">
          {!feed && !failed && (
            <p className="review-feed-state" role="status">
              {text.loading}
            </p>
          )}
          {failed && (
            <p className="review-feed-state" role="status">
              {text.loadError}{' '}
              <button type="button" onClick={() => setAttempt(attempt + 1)}>
                {text.retry}
              </button>
            </p>
          )}
          {feed?.total === 0 && (
            <div className="review-feed-state">
              <Icon name="quote" size={34} />
              <h3>{text.empty}</h3>
              <p>{text.emptyHint}</p>
            </div>
          )}
          {feed && feed.total > 0 && feed.average !== null && (
            <>
              <p className="review-summary">
                {text.average(
                  number.format(feed.average),
                  number.format(feed.total),
                )}
              </p>
              <ul className="review-feed-list">
                {feed.reviews.map((review) => (
                  <li key={review.id}>
                    <ReviewStars
                      rating={review.rating}
                      label={text.stars(review.rating)}
                    />
                    <blockquote dir="auto" lang={review.language}>
                      {review.experience}
                    </blockquote>
                    <p className="review-byline">
                      <strong>
                        <bdi>{review.name}</bdi>
                      </strong>
                      <time dateTime={review.submittedAt}>
                        {reviewDate(lang, review.submittedAt)}
                      </time>
                    </p>
                    {review.hasPhoto && (
                      <img
                        loading="lazy"
                        src={`/api/reviews/photo/${review.id}`}
                        alt={text.photoAlt}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
