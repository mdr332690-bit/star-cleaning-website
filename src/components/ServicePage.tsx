import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { apartmentCopy } from '../data/apartmentCleaning'
import { copy } from '../data/content'
import type { Language } from '../data/content'
import { serviceHeroImage } from '../data/images'
import { homePath, serviceLabels, servicePages } from '../data/servicePages'
import type { ServicePageData } from '../data/servicePages'
import { site } from '../data/site'
import { Brand, Eyebrow, Modal, ContactActions, ContactNumber } from './SiteUI'
import { LazyBooking } from './LazyBooking'
import { Icon } from './Icon'
import { LanguageLink } from './LanguageLink'
import { PromotionBanner } from './PromotionBanner'
import { GoogleBusinessLinks } from './GoogleBusinessLinks'
import { LocalEnquiryGuide } from './LocalEnquiryGuide'
import { ApartmentCleaningDetails } from './ApartmentCleaningDetails'

const apartmentRelatedServices = ['home', 'villa', 'deep']

export function ServicePage({
  lang,
  service,
}: {
  lang: Language
  service: ServicePageData
}) {
  const [bookingOpen, setBookingOpen] = useState(false)
  const t = copy[lang]
  const labels = serviceLabels[lang]
  const home = homePath(lang)
  const isApartment = service.id === 'apartment'
  const apartment = apartmentCopy[lang]
  const comparisonId = isApartment ? 'home' : service.page.compareId
  const comparison = servicePages.find((item) => item.id === comparisonId)!
  const ctaLabel = isApartment ? t.requestQuote : labels.enquiry
  const ctaIcon = isApartment ? 'calendar-check' : 'whatsapp'
  const whatsappHref = site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(apartment.whatsappMessage)}`
    : undefined
  const openBooking = () => setBookingOpen(true)
  const apartmentActions = (
    <div className="apartment-actions">
      <button
        className="button button-primary"
        aria-haspopup="dialog"
        onClick={openBooking}
      >
        <Icon name="calendar-check" />
        {t.requestQuote}
        <Icon name="arrow" size={17} className="apartment-action-arrow" />
      </button>
      {whatsappHref && (
        <a
          className="button button-outline"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="whatsapp" />
          {t.whatsapp}
        </a>
      )}
    </div>
  )

  return (
    <div
      className={
        isApartment ? 'site service-page apartment-page' : 'site service-page'
      }
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="announcement">
        <div className="container announcement-inner">
          <p>{t.announcement}</p>
          <span>
            <Icon name="pin" size={13} />
            {t.location}
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand lang={lang} href={home} />
          <div className="header-actions">
            <LanguageLink lang={lang} slug={service.page.slug} />
            <button
              className="button button-primary header-book"
              aria-haspopup={isApartment ? 'dialog' : undefined}
              onClick={openBooking}
            >
              <Icon name={ctaIcon} size={18} />
              {ctaLabel}
            </button>
          </div>
        </div>
        <ContactActions
          lang={lang}
          showNumber
          className="container header-contact"
        />
      </header>
      <main id="main" tabIndex={-1}>
        {!isApartment && <PromotionBanner lang={lang} />}
        <div className="container">
          <nav className="breadcrumbs" aria-label={labels.breadcrumb}>
            <ol>
              <li>
                <Link to={lang === 'ar' ? '/ar' : '/'}>{t.nav[0]}</Link>
              </li>
              <li aria-current="page">{service.page.heading[lang]}</li>
            </ol>
          </nav>
          <section className="service-intro" aria-labelledby="service-heading">
            <div>
              <Eyebrow>{t.servicesEyebrow}</Eyebrow>
              <h1 id="service-heading">{service.page.heading[lang]}</h1>
              <p className="service-lead">{service.page.intro[lang]}</p>
              <p className="staff-note">{t.staffNote}</p>
              {isApartment ? (
                apartmentActions
              ) : (
                <button className="button button-primary" onClick={openBooking}>
                  <Icon name="whatsapp" />
                  {labels.enquiry}
                  <Icon name="arrow" size={17} />
                </button>
              )}
            </div>
            <figure>
              <img
                {...serviceHeroImage(service.image)}
                width="1000"
                height={isApartment ? 750 : 850}
                alt={service.imageAlt[lang]}
                fetchPriority="high"
                decoding="async"
              />
              <figcaption>
                {isApartment ? apartment.imageNote : t.mediaNote}
              </figcaption>
            </figure>
          </section>
        </div>
        {isApartment ? (
          <ApartmentCleaningDetails lang={lang} />
        ) : (
          <section className="section service-body">
            <div className="container service-body-grid">
              <div>
                <h2>{labels.overview}</h2>
                <p>{service.detail[lang]}</p>
                <h2>{service.page.planningTitle[lang]}</h2>
                <p>{service.page.planning[lang]}</p>
                <h2>{service.page.careTitle[lang]}</h2>
                <p>{service.page.care[lang]}</p>
                <p className="service-comparison">
                  {service.page.compareIntro[lang]}{' '}
                  <Link
                    to={
                      lang === 'ar'
                        ? '/ar/services/$service'
                        : '/services/$service'
                    }
                    params={{ service: comparison.page.slug }}
                  >
                    {comparison.page.heading[lang]}
                  </Link>
                  .
                </p>
              </div>
              <aside className="service-scope" aria-labelledby="scope-heading">
                <Icon name={service.icon} size={28} />
                <h2 id="scope-heading">{labels.scope}</h2>
                <ul className="check-list">
                  {service.includes[lang].map((item) => (
                    <li key={item}>
                      <span className="check-disc">
                        <Icon name="check" size={12} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="scope-note">{t.scopeNote}</p>
              </aside>
            </div>
          </section>
        )}
        {!isApartment && <LocalEnquiryGuide lang={lang} service={service} />}
        <section className="section service-faq">
          <div className="container service-reading-width">
            <Eyebrow>{t.faqEyebrow}</Eyebrow>
            <h2>{isApartment ? apartment.faqTitle : labels.faq}</h2>
            <div className="faq-list">
              {(isApartment
                ? apartment.faqs
                : [[service.page.question[lang], service.page.answer[lang]]]
              ).map(([question, answer]) => (
                <details className="faq-item" key={question}>
                  <summary>
                    {question}
                    <Icon name="plus" size={18} />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
              <details className="faq-item">
                <summary>
                  {labels.maleQuestion}
                  <Icon name="plus" size={18} />
                </summary>
                <p>{labels.maleAnswer}</p>
              </details>
            </div>
          </div>
        </section>
        <section className="section service-enquiry" id="contact">
          <div className="container service-reading-width">
            <Eyebrow>{t.contactEyebrow}</Eyebrow>
            <h2>{isApartment ? apartment.contactTitle : labels.prepare}</h2>
            <p>{isApartment ? apartment.contactIntro : labels.prepareText}</p>
            <div className="service-contact-number">
              <span>{t.phoneLabel}</span>
              <ContactNumber />
            </div>
            {isApartment ? (
              apartmentActions
            ) : (
              <>
                <ContactActions lang={lang} />
                <button className="button button-primary" onClick={openBooking}>
                  <Icon name="whatsapp" />
                  {labels.enquiry}
                </button>
              </>
            )}
            <p className="scope-note">{t.bookingNote}</p>
            <GoogleBusinessLinks lang={lang} />
          </div>
        </section>
        <section className="section related-services">
          <div className="container">
            <h2>{labels.related}</h2>
            <div className="related-service-grid">
              {servicePages
                .filter((item) =>
                  isApartment
                    ? apartmentRelatedServices.includes(item.id)
                    : item.id !== service.id &&
                      (item.id !== 'apartment' ||
                        apartmentRelatedServices.includes(service.id)),
                )
                .map((item) => (
                  <article key={item.id}>
                    <Icon name={item.icon} size={25} />
                    <h3>
                      <Link
                        to={
                          lang === 'ar'
                            ? '/ar/services/$service'
                            : '/services/$service'
                        }
                        params={{ service: item.page.slug }}
                      >
                        {item.page.heading[lang]}
                      </Link>
                    </h3>
                    <p>{item.description[lang]}</p>
                  </article>
                ))}
            </div>
            <Link
              className="text-link"
              to={lang === 'ar' ? '/ar' : '/'}
              hash="services"
            >
              {labels.home}
              <Icon name="arrow" size={17} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container service-footer">
          <Brand lang={lang} href={home} />
          <nav aria-label={t.footerExplore}>
            <Link to={lang === 'ar' ? '/ar' : '/'}>{t.nav[0]}</Link>
            <Link to={lang === 'ar' ? '/ar' : '/'} hash="about">
              {t.nav[1]}
            </Link>
            <Link to={lang === 'ar' ? '/ar' : '/'} hash="contact">
              {t.nav[4]}
            </Link>
          </nav>
          <LanguageLink lang={lang} slug={service.page.slug} />
        </div>
        <div className="container service-google-links">
          <GoogleBusinessLinks lang={lang} footer />
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {t.copyright}
          </span>
          <span>{isApartment ? apartment.imageNote : t.mediaNote}</span>
        </div>
      </footer>
      {bookingOpen && (
        <Modal onClose={() => setBookingOpen(false)} closeLabel={t.close}>
          <LazyBooking lang={lang} initialService={service.id} />
        </Modal>
      )}
    </div>
  )
}
