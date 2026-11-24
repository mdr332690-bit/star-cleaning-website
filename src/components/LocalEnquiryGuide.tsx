import type { Language } from '../data/content'
import { localEnquiryCopy, localServiceAdvice } from '../data/localSeo'
import type { CatalogServicePageData } from '../data/servicePages'
import { Icon } from './Icon'
import { Eyebrow } from './SiteUI'

export function LocalEnquiryGuide({
  lang,
  service,
}: {
  lang: Language
  service?: CatalogServicePageData
}) {
  const t = localEnquiryCopy[lang]
  return (
    <section
      className="section location-section"
      id="location-enquiry"
      aria-labelledby="location-heading"
    >
      <div className="container location-grid">
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 id="location-heading">{t.title}</h2>
          <a className="text-link" href={service ? '#contact' : '#booking'}>
            {t.action}
            <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="location-copy">
          <p>{t.intro}</p>
          {service && <p>{localServiceAdvice[service.id][lang]}</p>}
          <p className="scope-note">{t.note}</p>
        </div>
      </div>
    </section>
  )
}
