import { apartmentCopy } from '../data/apartmentCleaning'
import type { Language } from '../data/content'
import { Icon } from './Icon'

export function ApartmentCleaningDetails({ lang }: { lang: Language }) {
  const content = apartmentCopy[lang]

  return (
    <section className="section service-body" aria-labelledby="scope-heading">
      <div className="container apartment-details">
        <div>
          <h2 id="scope-heading">{content.scopeTitle}</h2>
          <p>{content.scopeIntro}</p>
          <dl className="apartment-rooms">
            {content.rooms.map(([room, detail]) => (
              <div key={room}>
                <dt>{room}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <section
          className="apartment-process"
          aria-labelledby="process-heading"
        >
          <Icon name="calendar-check" size={27} />
          <h2 id="process-heading">{content.processTitle}</h2>
          <ol>
            {content.steps.map(([step, detail]) => (
              <li key={step}>
                <h3>{step}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  )
}
