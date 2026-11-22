import { copy } from '../data/content'
import type { Language } from '../data/content'
import { site } from '../data/site'
import { Icon } from './Icon'

export function GoogleBusinessLinks({
  lang,
  onDark = false,
  footer = false,
  reviewOnly = false,
}: {
  lang: Language
  onDark?: boolean
  footer?: boolean
  reviewOnly?: boolean
}) {
  const t = copy[lang]
  const reviewUrl = site.googleReviewUrl
  const profileUrl = reviewOnly ? '' : site.googleBusinessProfileUrl

  // Missing destinations never produce inactive controls, placeholder links,
  // or a review button that falls back to a general Maps listing.
  if (!reviewUrl && !profileUrl) return null

  return (
    <div
      className={`google-business-links${footer ? ' google-business-links--footer' : ''}`}
      role="group"
      aria-label={t.googleBusinessLinks}
    >
      {reviewUrl && (
        <a
          className={`button google-review-button ${onDark ? 'button-cream' : 'button-primary'}`}
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.googleReview} (${t.opensNewTab})`}
        >
          <Icon name="review" size={20} />
          <span className="google-review-label">{t.googleReview}</span>
          <Icon name="diagonal" size={16} />
        </a>
      )}
      {profileUrl && (
        <a
          className="google-profile-link"
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.googleBusinessProfile} (${t.opensNewTab})`}
        >
          <Icon name="pin" size={18} />
          <span>{t.googleBusinessProfile}</span>
          <Icon name="diagonal" size={14} />
        </a>
      )}
    </div>
  )
}
