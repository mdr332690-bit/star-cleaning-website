import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { copy } from '../data/content'
import type { Language } from '../data/content'
import { serviceHeroImage } from '../data/images'
import { homePath, serviceLabels, servicePages } from '../data/servicePages'
import type { ServicePageData } from '../data/servicePages'
import { Brand, Eyebrow, Modal, ContactActions, ContactNumber } from './SiteUI'
import { LazyBooking } from './LazyBooking'
import { Icon } from './Icon'
import { LanguageLink } from './LanguageLink'
import { PromotionBanner } from './PromotionBanner'
import { GoogleBusinessLinks } from './GoogleBusinessLinks'
import { LocalEnquiryGuide } from './LocalEnquiryGuide'

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
  const comparison = servicePages.find(
    (item) => item.id === service.page.compareId,
  )!

  return (
    <div
      className="site service-page"
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
              onClick={() => setBookingOpen(true)}
            >
              <Icon name="whatsapp" size={18} />
              {labels.enquiry}
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
        <PromotionBanner lang={lang} />
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
              <button
                className="button button-primary"
                onClick={() => setBookingOpen(true)}
              >
                <Icon name="whatsapp" />
                {labels.enquiry}
                <Icon name="arrow" size={17} />
              </button>
            </div>
            <figure>
              <img
                {...serviceHeroImage(service.image)}
                width="1000"
                height="850"
                alt={service.imageAlt[lang]}
                fetchPriority="high"
                decoding="async"
              />
              <figcaption>{t.mediaNote}</figcaption>
            </figure>
          </section>
        </div>
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
        <LocalEnquiryGuide lang={lang} service={service} />
        <section className="section service-faq">
          <div className="container service-reading-width">
            <Eyebrow>{t.faqEyebrow}</Eyebrow>
            <h2>{labels.faq}</h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary>
                  {service.page.question[lang]}
                  <Icon name="plus" size={18} />
                </summary>
                <p>{service.page.answer[lang]}</p>
              </details>
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
            <h2>{labels.prepare}</h2>
            <p>{labels.prepareText}</p>
            <div className="service-contact-number">
              <span>{t.phoneLabel}</span>
              <ContactNumber />
            </div>
            <ContactActions lang={lang} />
            <button
              className="button button-primary"
              onClick={() => setBookingOpen(true)}
            >
              <Icon name="whatsapp" />
              {labels.enquiry}
            </button>
            <p className="scope-note">{t.bookingNote}</p>
            <GoogleBusinessLinks lang={lang} />
          </div>
        </section>
        <section className="section related-services">
          <div className="container">
            <h2>{labels.related}</h2>
            <div className="related-service-grid">
              {servicePages
                .filter((item) => item.id !== service.id)
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
          <span>{t.mediaNote}</span>
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
