import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { copy, services } from '../data/content'
import type { Language } from '../data/content'
import { site } from '../data/site'
import {
  catalogServicePages,
  servicePageCopy,
  servicePath,
} from '../data/servicePages'
import { apartmentService } from '../data/apartmentCleaning'
import { LanguageLink } from './LanguageLink'
import { PromotionBanner } from './PromotionBanner'
import { Brand, Eyebrow, Modal, ContactActions, ContactNumber } from './SiteUI'
import { LazyBooking } from './LazyBooking'
import { homeHeroImage, imageUrl as cdn, imageSrcSet } from '../data/images'
import { Icon, Star } from './Icon'
import { BookingForm } from './BookingForm'
import { bookingCopy } from '../data/booking'
import { GoogleBusinessLinks } from './GoogleBusinessLinks'
import { ServiceAreas } from './ServiceAreas'
import { CustomerReviews } from './CustomerReviews'

const navIds = ['home', 'about', 'services', 'why-us', 'contact']
const [houseCleaning, ...otherServices] = catalogServicePages
const homepageServices = [houseCleaning, apartmentService, ...otherServices]
const featuredServiceCount = 3
const heroStats = [
  { label: 'years', value: 10, minimum: true },
  { label: 'clients', value: 20, minimum: true },
  { label: 'specialists', value: 6, minimum: false },
  { label: 'completedJobs', value: 10_000, minimum: true },
] as const
const statFormatters = {
  en: new Intl.NumberFormat('en'),
  ar: new Intl.NumberFormat('ar-KW-u-nu-arab'),
}
type ModalState =
  | { type: 'booking' }
  | { type: 'service'; id: string }
  | { type: 'video' }
  | null

export function MarketingPage({ lang }: { lang: Language }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const [modal, setModal] = useState<ModalState>(null)
  const [bookingService, setBookingService] = useState('home')
  const [showAllServices, setShowAllServices] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const t = copy[lang]
  const visibleServiceCount = showAllServices
    ? homepageServices.length
    : featuredServiceCount
  const emailHref = site.email ? `mailto:${site.email}` : undefined
  const whatsappHref = site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}`
    : undefined
  const selectedService =
    modal?.type === 'service'
      ? services.find((item) => item.id === modal.id)
      : undefined
  const openQuote = (serviceId = 'home') => {
    setBookingService(serviceId)
    setMenuOpen(false)
    setModal({ type: 'booking' })
  }

  useEffect(() => {
    const revealLinkedService = () => {
      const anchor = window.location.hash.slice(1)
      if (!services.some((service) => service.anchor === anchor)) return
      const guide = document.getElementById(anchor)
      if (guide instanceof HTMLDetailsElement) guide.open = true
    }
    revealLinkedService()
    window.addEventListener('hashchange', revealLinkedService)
    return () => window.removeEventListener('hashchange', revealLinkedService)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -60% 0px' },
    )
    navIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])
  const revealService = (anchor: string) => {
    const guide = document.getElementById(anchor)
    if (guide instanceof HTMLDetailsElement) guide.open = true
  }

  return (
    <div className="site" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="announcement">
        <div className="container announcement-inner">
          <p>
            <Star className="tiny-star" />
            {t.announcement}
          </p>
          <span>
            <Icon name="pin" size={13} />
            {t.location}
          </span>
        </div>
      </div>
      <header
        className="site-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape') setMenuOpen(false)
        }}
      >
        <div className="container header-inner">
          <Brand lang={lang} />
          <nav
            className="desktop-nav"
            aria-label={lang === 'en' ? 'Main navigation' : 'القائمة الرئيسية'}
          >
            {t.nav.map((label, index) => (
              <a
                key={navIds[index]}
                href={`#${navIds[index]}`}
                className={activeNav === navIds[index] ? 'active' : ''}
                onClick={() => setActiveNav(navIds[index])}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <LanguageLink lang={lang} />
            <button
              className="button button-primary header-book"
              onClick={() => openQuote()}
              aria-haspopup="dialog"
            >
              <Icon name="calendar-check" size={18} />
              {t.requestQuote}
            </button>
            <button
              className="icon-button mobile-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? t.close : t.menu}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
        <ContactActions
          lang={lang}
          showNumber
          className="container header-contact"
        />
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label={t.menu}
          >
            {t.nav.map((label, index) => (
              <a
                href={`#${navIds[index]}`}
                key={label}
                onClick={() => {
                  setMenuOpen(false)
                  setActiveNav(navIds[index])
                }}
              >
                {label}
                <Icon name="arrow" size={17} />
              </a>
            ))}
            {whatsappHref && (
              <a
                className="whatsapp-link"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                {t.whatsapp}
                <Icon name="whatsapp" size={18} />
              </a>
            )}
            <button
              className="button button-primary"
              onClick={() => openQuote()}
              aria-haspopup="dialog"
            >
              <Icon name="calendar-check" />
              {t.requestQuote}
            </button>
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1}>
        <PromotionBanner lang={lang} />
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1>
                {t.heroLine1} <br />
                {t.heroLine2} <br className="hero-break" /> <em>{t.heroEm}</em>
              </h1>
              <p className="hero-description">{t.heroDescription}</p>
              <p className="enquiry-scope">
                {bookingCopy[lang].serviceBoundary}
              </p>
              <div className="hero-actions">
                <button
                  className="button button-primary"
                  onClick={() => openQuote()}
                  aria-haspopup="dialog"
                >
                  <Icon name="calendar-check" />
                  {t.requestQuote}
                </button>
                {whatsappHref && (
                  <a
                    className="text-link whatsapp-link"
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="whatsapp" size={18} />
                    {t.whatsapp}
                  </a>
                )}
                <a className="text-link" href="#services">
                  {t.explore}
                  <Icon name="arrow" size={18} />
                </a>
              </div>
              <p className="hero-trust">
                <span className="check-disc">
                  <Icon name="check" size={11} />
                </span>
                {t.heroTrust}
              </p>
              <div className="hero-stats">
                {heroStats.map(({ label, value, minimum }) => (
                  <div key={label}>
                    <strong dir="ltr">
                      {statFormatters[lang].format(value)}
                      {minimum && <span>+</span>}
                    </strong>
                    <span>{t[label]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              <img
                className="hero-photo"
                {...homeHeroImage}
                alt={t.imageAlt}
                width="928"
                height="1152"
                fetchPriority="high"
                decoding="async"
              />
              <span className="location-pill">
                <span />
                {t.country}
              </span>
              <div className="image-card">
                <span className="image-card-icon">
                  <Icon name="shield" size={27} />
                </span>
                <div>
                  <span>{t.imageLabel}</span>
                  <strong>{t.imageText}</strong>
                </div>
              </div>
              <Star className="hero-star" />
            </div>
          </div>
        </section>
        <div className="values-strip">
          <div className="container values-inner">
            {t.benefitStrip.map((value, index) => (
              <div key={value}>
                <Icon
                  name={['shield', 'sparkles', 'home', 'heart'][index]}
                  size={20}
                />
                <span>{value}</span>
                <Star className="strip-star" />
              </div>
            ))}
          </div>
        </div>

        <section className="section services-section" id="services">
          <div className="container">
            <div className="section-heading">
              <div>
                <Eyebrow>{t.servicesEyebrow}</Eyebrow>
                <h2>
                  {t.servicesTitle}
                  <br />
                  <em>{t.servicesEm}</em>
                </h2>
              </div>
              <p>{t.servicesDescription}</p>
            </div>
            <nav className="service-directory" aria-label={t.serviceDirectory}>
              {homepageServices.map((service) => (
                <Link
                  key={service.id}
                  to={
                    lang === 'ar'
                      ? '/ar/services/$service'
                      : '/services/$service'
                  }
                  params={{ service: service.page.slug }}
                >
                  {service.title[lang]}
                  <Icon name="arrow" size={15} />
                </Link>
              ))}
            </nav>
            <div
              className={`services-grid ${showAllServices ? 'expanded' : ''}`}
              id="service-list"
            >
              {homepageServices.map((service, index) => {
                const pageHref =
                  service.id === apartmentService.id
                    ? servicePath(lang, service.page.slug)
                    : undefined
                const ExploreService = pageHref ? 'a' : 'button'
                const exploreProps = pageHref
                  ? { href: pageHref }
                  : {
                      onClick: () =>
                        setModal({ type: 'service', id: service.id }),
                    }

                return (
                  <article
                    className={`service-card ${!showAllServices && index >= featuredServiceCount ? 'extra-service' : ''}`}
                    key={service.id}
                    aria-labelledby={`${service.id}-card-title`}
                  >
                    <ExploreService
                      className="service-image-button"
                      {...exploreProps}
                      aria-label={`${t.serviceExplore}: 0${index + 1} · ${service.title[lang]}`}
                    >
                      <img
                        src={cdn(service.image, 650)}
                        srcSet={imageSrcSet(
                          service.image,
                          [240, 400, 650, 900],
                        )}
                        sizes="(max-width: 760px) 43vw, (max-width: 1352px) 28vw, 400px"
                        alt={service.imageAlt[lang]}
                        width="650"
                        height="470"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="service-number">0{index + 1}</span>
                      <span className="service-image-arrow">
                        <Icon name="diagonal" size={20} />
                      </span>
                    </ExploreService>
                    <div className="service-copy">
                      <div className="service-card-heading">
                        <h3 id={`${service.id}-card-title`}>
                          <a
                            href={pageHref ?? `#${service.anchor}`}
                            onClick={
                              pageHref
                                ? undefined
                                : () => revealService(service.anchor)
                            }
                          >
                            {service.title[lang]}
                          </a>
                        </h3>
                        <Icon name={service.icon} size={24} />
                      </div>
                      <p>{service.description[lang]}</p>
                      <ExploreService
                        className="service-link"
                        {...exploreProps}
                      >
                        {t.serviceExplore}
                        <Icon name="arrow" size={17} />
                      </ExploreService>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="services-bottom">
              <span className="services-count" dir="ltr">
                0{visibleServiceCount} <span>/ 0{homepageServices.length}</span>
              </span>
              <button
                className="button button-outline"
                aria-expanded={showAllServices}
                aria-controls="service-list"
                onClick={() => setShowAllServices(!showAllServices)}
              >
                {showAllServices ? t.lessServices : t.allServices}
                <Icon name={showAllServices ? 'close' : 'plus'} size={17} />
              </button>
              <span className="services-bottom-line" />
            </div>
            <div className="service-guide">
              <p className="service-guide-intro">{t.serviceGuideIntro}</p>
              <p className="service-guide-intro">{t.homeCleaningNote}</p>
              {services.map((service) => (
                <details
                  key={service.id}
                  id={service.anchor}
                  className="service-guide-item"
                >
                  <summary>
                    <h3>
                      {servicePageCopy[service.id].heading[lang]}
                      <Icon name="plus" size={20} />
                    </h3>
                  </summary>
                  <div className="service-guide-content">
                    <p>{service.detail[lang]}</p>
                    <p className="service-guide-label">{t.includes}</p>
                    <ul>
                      {service.includes[lang].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="scope-note">{t.scopeNote}</p>
                    <Link
                      className="text-link service-page-link"
                      to={
                        lang === 'ar'
                          ? '/ar/services/$service'
                          : '/services/$service'
                      }
                      params={{ service: servicePageCopy[service.id].slug }}
                    >
                      {t.servicePageLink}:{' '}
                      {servicePageCopy[service.id].heading[lang]}
                      <Icon name="arrow" size={18} />
                    </Link>
                    <a className="text-link" href="#contact">
                      {t.enquireAbout} {service.title[lang]}
                      <Icon name="arrow" size={18} />
                    </a>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="container about-grid">
            <div className="about-visual">
              <img
                src={cdn('cleaning-detail.png', 900)}
                srcSet={imageSrcSet(
                  'cleaning-detail.png',
                  [400, 650, 900, 1200],
                )}
                sizes="(max-width: 760px) calc(100vw - 68px), (max-width: 1352px) 42vw, 540px"
                width="900"
                height="980"
                alt={t.aboutImageAlt}
                loading="lazy"
                decoding="async"
              />
              <div className="experience-card">
                <strong dir="ltr">
                  10<span>+</span>
                </strong>
                <div>
                  <span>{t.years}</span>
                  <p>
                    {t.experienceLabel}
                    <br />
                    {t.experienceSub}
                  </p>
                </div>
                <Star className="experience-star" />
              </div>
              <span className="about-caption">
                STAR CLEANING <span>—</span> KUWAIT
              </span>
            </div>
            <div className="about-copy">
              <Eyebrow>{t.aboutEyebrow}</Eyebrow>
              <h2>
                {t.aboutTitle}
                <br />
                <em>{t.aboutEm}</em>
              </h2>
              <p>{t.aboutText}</p>
              <p>{t.aboutText2}</p>
              <ul className="check-list">
                {t.aboutPoints.map((point) => (
                  <li key={point}>
                    <span className="check-disc">
                      <Icon name="check" size={12} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <button className="text-link" onClick={() => openQuote()}>
                {t.aboutLink}
                <Icon name="arrow" size={18} />
              </button>
            </div>
          </div>
        </section>

        <section
          className="film-section container"
          aria-labelledby="film-heading"
        >
          <div className="film-card">
            <img
              src={cdn('cleaning-detail.png', 1400)}
              srcSet={imageSrcSet('cleaning-detail.png', [600, 1000, 1400])}
              sizes="(max-width: 1352px) 92vw, 1240px"
              alt=""
              width="1400"
              height="650"
              loading="lazy"
              decoding="async"
            />
            <div className="film-shade" />
            <div className="film-content">
              <Eyebrow>{t.videoEyebrow}</Eyebrow>
              <h2 id="film-heading">
                {t.videoTitle}
                <br />
                <em>{t.videoEm}</em>
              </h2>
              <p>{t.videoDescription}</p>
            </div>
            <button
              className="play-button"
              aria-label={t.watch}
              onClick={() => {
                setVideoError(false)
                setModal({ type: 'video' })
              }}
            >
              <span className="play-disc">
                <Icon name="play" size={30} />
              </span>
              <span>
                {t.watch}
                <Icon name="arrow" size={16} />
              </span>
            </button>
            <span className="film-note">{t.videoNote}</span>
          </div>
        </section>

        <section className="section why-section" id="why-us">
          <div className="container">
            <div className="section-heading">
              <div>
                <Eyebrow>{t.whyEyebrow}</Eyebrow>
                <h2>
                  {t.whyTitle}
                  <br />
                  <em>{t.whyEm}</em>
                </h2>
              </div>
              <p>{t.whyDescription}</p>
            </div>
            <div className="why-grid">
              {t.whyItems.map((item, index) => (
                <article key={item.title} className="why-item">
                  <span className="why-icon">
                    <Icon
                      name={['shield', 'sparkles', 'clock', 'heart'][index]}
                      size={27}
                    />
                  </span>
                  <span className="why-number" dir="ltr">
                    0{index + 1}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="container">
            <div className="process-heading">
              <Eyebrow>{t.processEyebrow}</Eyebrow>
              <h2>
                {t.processTitle} <em>{t.processEm}</em>
              </h2>
            </div>
            <div className="process-grid">
              {t.steps.map((step, index) => (
                <div className="process-step" key={step.title}>
                  <div className="step-top">
                    <span dir="ltr">0{index + 1}</span>
                    <span className="step-line" />
                    <Icon name={index === 2 ? 'check' : 'arrow'} size={19} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CustomerReviews lang={lang} />

        <ServiceAreas lang={lang} />

        <section className="section faq-section" id="faq">
          <div className="container faq-grid">
            <div>
              <Eyebrow>{t.faqEyebrow}</Eyebrow>
              <h2>
                {t.faqTitle}
                <br />
                <em>{t.faqEm}</em>
              </h2>
              <a className="text-link" href="#contact">
                {t.nav[4]}
                <Icon name="arrow" size={18} />
              </a>
            </div>
            <div className="faq-list">
              {t.faqs.map((faq, index) => (
                <details
                  key={`${lang}-${index}`}
                  name="cleaning-faq"
                  className="faq-item"
                >
                  <summary>
                    <span className="faq-number" dir="ltr">
                      0{index + 1}
                    </span>
                    <span>{faq.question}</span>
                    <Icon name="plus" size={20} />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section inquiry-section"
          id="booking"
          aria-labelledby="booking-heading"
          tabIndex={-1}
        >
          <div className="container inquiry-layout">
            <div className="inquiry-intro">
              <Eyebrow>{bookingCopy[lang].eyebrow}</Eyebrow>
              <h2 id="booking-heading">
                {bookingCopy[lang].title}
                <br />
                <em>{bookingCopy[lang].titleEm}</em>
              </h2>
              <p>{bookingCopy[lang].intro}</p>
              <ol className="inquiry-steps">
                {bookingCopy[lang].steps.map((step, index) => (
                  <li key={step}>
                    <span dir="ltr">0{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
              <p className="enquiry-scope">
                {bookingCopy[lang].serviceBoundary}
              </p>
              {whatsappHref && (
                <a
                  className="button button-outline"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="whatsapp" size={20} />
                  {bookingCopy[lang].whatsapp}
                </a>
              )}
              {site.phone && (
                <p className="inquiry-phone">
                  <ContactNumber />
                </p>
              )}
            </div>
            <div className="inquiry-card">
              <BookingForm lang={lang} headingLevel={3} />
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container">
            <div className="contact-card">
              <div className="contact-main">
                <Eyebrow>{t.contactEyebrow}</Eyebrow>
                <h2>
                  {t.contactTitle}
                  <br />
                  <em>{t.contactEm}</em>
                </h2>
                <p>{t.contactText}</p>
                <p>{bookingCopy[lang].serviceBoundary}</p>
                <ContactActions lang={lang} onDark />
                <button
                  className="button button-cream"
                  onClick={() => openQuote()}
                  aria-haspopup="dialog"
                >
                  <Icon name="calendar-check" />
                  {t.requestQuote}
                </button>
                <GoogleBusinessLinks lang={lang} onDark />
              </div>
              <div className="contact-details">
                <div>
                  <span className="contact-icon">
                    <Icon name="pin" size={23} />
                  </span>
                  <div>
                    <span>{t.contactLocation}</span>
                    <strong>{t.country}</strong>
                  </div>
                </div>
                <div>
                  <span className="contact-icon">
                    <Icon name="phone" size={22} />
                  </span>
                  <div>
                    <span>{t.phoneLabel}</span>
                    {site.phone ? (
                      <ContactNumber />
                    ) : (
                      <p className="contact-placeholder">
                        {t.phonePlaceholder}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <span className="contact-icon">
                    <Icon name="mail" size={23} />
                  </span>
                  <div>
                    <span>{t.emailLabel}</span>
                    {emailHref ? (
                      <a href={emailHref}>
                        <bdi dir="ltr">{site.email}</bdi>
                      </a>
                    ) : (
                      <p className="contact-placeholder">
                        {t.emailPlaceholder}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Star className="contact-star" />
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Brand lang={lang} />
              <p>{t.footerTagline}</p>
              <GoogleBusinessLinks lang={lang} footer />
            </div>
            <div>
              <h2 className="footer-heading">{t.footerServices}</h2>
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={
                    lang === 'ar'
                      ? '/ar/services/$service'
                      : '/services/$service'
                  }
                  params={{ service: servicePageCopy[service.id].slug }}
                >
                  {servicePageCopy[service.id].heading[lang]}
                </Link>
              ))}
            </div>
            <div>
              <h2 className="footer-heading">{t.footerExplore}</h2>
              {[1, 2, 3, 4].map((index) => (
                <a key={index} href={`#${navIds[index]}`}>
                  {t.nav[index]}
                </a>
              ))}
              <a href="#testimonials">
                {t.reviewsEyebrow.toLocaleLowerCase(lang)}
              </a>
              <a href="#faq">
                {lang === 'en' ? 'Cleaning FAQs' : 'أسئلة شائعة عن التنظيف'}
              </a>
            </div>
            <div className="footer-local">
              <h2 className="footer-heading">{t.footerLocation}</h2>
              <p>{t.footerLocal}</p>
              <span>
                <Icon name="pin" size={16} />
                {t.country}
              </span>
              {emailHref && (
                <a className="footer-email" href={emailHref}>
                  <Icon name="mail" size={16} />
                  <bdi dir="ltr">{site.email}</bdi>
                </a>
              )}
              <LanguageLink lang={lang} />
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {t.copyright}
            </span>
            <span>{t.mediaNote}</span>
            <a href="#home">
              {t.backTop}
              <Icon name="arrow" size={15} />
            </a>
          </div>
        </div>
      </footer>
      <div className="floating-contact">
        <button
          className="floating-contact-action floating-booking"
          type="button"
          onClick={() => openQuote()}
          aria-label={t.requestQuote}
          aria-haspopup="dialog"
        >
          <Icon name="calendar-check" size={26} />
        </button>
        {whatsappHref && (
          <a
            className="floating-contact-action floating-whatsapp"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={bookingCopy[lang].whatsapp}
          >
            <Icon name="whatsapp" size={28} />
          </a>
        )}
        {emailHref && (
          <a
            className="floating-contact-action floating-email"
            href={emailHref}
            aria-label={t.emailLabel}
          >
            <Icon name="mail" size={26} />
          </a>
        )}
      </div>

      {modal && (
        <Modal
          onClose={() => setModal(null)}
          closeLabel={t.close}
          wide={modal.type === 'video'}
        >
          {modal.type === 'booking' ? (
            <LazyBooking lang={lang} initialService={bookingService} />
          ) : modal.type === 'video' ? (
            <div className="video-modal-content">
              <Eyebrow>{t.videoLabel}</Eyebrow>
              <h2 id="dialog-heading">
                {t.videoTitle} <em>{t.videoEm}</em>
              </h2>
              <video
                controls
                autoPlay
                playsInline
                preload="metadata"
                onError={() => setVideoError(true)}
                aria-label={t.watch}
              >
                <source src="/video/carpet-care.mp4" type="video/mp4" />
                {t.videoFallback}
              </video>
              <p>{t.videoNote}</p>
              {videoError && (
                <p role="alert">
                  {t.videoFallback}{' '}
                  <a
                    href="/video/carpet-care.mp4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.downloadFilm}
                  </a>
                </p>
              )}
            </div>
          ) : selectedService ? (
            <div className="service-modal-content">
              <img
                src={cdn(selectedService.image, 850)}
                srcSet={imageSrcSet(selectedService.image, [400, 650, 850])}
                sizes="(max-width: 620px) 95vw, 560px"
                alt={selectedService.imageAlt[lang]}
                width="850"
                height="450"
                decoding="async"
              />
              <div className="service-modal-copy">
                <Eyebrow>{t.serviceLabel}</Eyebrow>
                <h2 id="dialog-heading">{selectedService.title[lang]}</h2>
                <p className="muted">{selectedService.detail[lang]}</p>
                <h3>{t.includes}</h3>
                <ul className="check-list">
                  {selectedService.includes[lang].map((item) => (
                    <li key={item}>
                      <span className="check-disc">
                        <Icon name="check" size={12} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="button button-primary"
                  onClick={() => openQuote(selectedService.id)}
                >
                  <Icon name="calendar-check" />
                  {t.discuss}
                  <Icon name="arrow" size={17} />
                </button>
                <p className="scope-note">{t.scopeNote}</p>
              </div>
            </div>
          ) : null}
        </Modal>
      )}
    </div>
  )
}
