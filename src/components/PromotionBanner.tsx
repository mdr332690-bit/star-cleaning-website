import { promotionCopy } from '../data/content'
import type { Language } from '../data/content'
import { Star } from './Icon'
import { ContactActions, ContactNumber } from './SiteUI'

export function PromotionBanner({ lang }: { lang: Language }) {
  const t = promotionCopy[lang]

  return (
    <section className="promotion" aria-labelledby="promotion-heading">
      <div className="container promotion-inner">
        <div className="promotion-offer">
          <h2 id="promotion-heading" className="promotion-heading">
            <span className="promotion-label">
              <Star className="tiny-star" />
              {t.label}
            </span>
            <span className="promotion-discount">
              {lang === 'ar' && (
                <span className="promotion-word">{t.discountWord}</span>
              )}
              <bdi dir="ltr">{t.discount}</bdi>
              {lang === 'en' && (
                <span className="promotion-word">{t.discountWord}</span>
              )}
            </span>
          </h2>
          <p className="promotion-scope">{t.scope}</p>
        </div>
        <p className="promotion-description">
          {t.headline && <strong>{t.headline}</strong>}
          {t.headline && ' '}
          {t.description}
        </p>
        <div className="promotion-contact">
          <p>{t.contact}</p>
          <ContactNumber />
          <ContactActions lang={lang} onDark className="promotion-actions" />
        </div>
      </div>
    </section>
  )
}
