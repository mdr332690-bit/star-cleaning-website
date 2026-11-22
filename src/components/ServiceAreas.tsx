import { useId, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { copy } from '../data/content'
import type { Language } from '../data/content'
import { kuwaitBoundaries } from '../data/kuwaitBoundaries'
import { localEnquiryCopy } from '../data/localSeo'
import { atlasCopy, governorates } from '../data/serviceAreas'
import { Icon } from './Icon'
import { Eyebrow, Modal } from './SiteUI'

const mapWidth = 640
const mapHeight = 486
const markerNumber = (index: number) => String(index + 1).padStart(2, '0')

export function ServiceAreas({ lang }: { lang: Language }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const popup = useRef<HTMLDivElement>(null)
  const land = useId()
  const t = atlasCopy[lang]
  const enquiry = localEnquiryCopy[lang]
  const secondary = lang === 'ar' ? 'en' : 'ar'
  const active = activeIndex === null ? null : governorates[activeIndex]

  function openDetails(event: MouseEvent<HTMLButtonElement>, index: number) {
    event.currentTarget.focus({ preventScroll: true })
    setActiveIndex(index)
    setDialogOpen(true)
  }

  function closeDetails() {
    popup.current?.closest('dialog')?.close()
    setDialogOpen(false)
  }

  function goToBooking(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    closeDetails()
  }

  return (
    <section
      className="section atlas"
      id="location-enquiry"
      aria-labelledby="location-heading"
    >
      <div className="container">
        <div className="atlas-intro">
          <div>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 id="location-heading">
              {t.title} <em>{t.titleEm}</em>
            </h2>
          </div>
          <p>
            <strong>{enquiry.title}</strong> {enquiry.intro}
          </p>
        </div>

        <div className="atlas-frame">
          <figure className="atlas-figure" aria-label={t.map}>
            <div className="atlas-map" dir="ltr">
              <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} aria-hidden="true">
                <defs>
                  <linearGradient id={land} x2=".9" y2="1">
                    <stop stopColor="#fffdf6" />
                    <stop offset="1" stopColor="#e6d9bd" />
                  </linearGradient>
                </defs>

                <g className="atlas-compass" transform="translate(563 73)">
                  <circle r="20" />
                  <path d="M0-14 6 8 0 4-6 8Z" />
                  <text y="-29" textAnchor="middle">
                    {t.north}
                  </text>
                </g>
                <text
                  className="atlas-gulf"
                  x="546"
                  y="426"
                  textAnchor="middle"
                >
                  {t.gulf}
                </text>

                <g className="atlas-land" fill={`url(#${land})`}>
                  {governorates.map(({ id }, index) => (
                    <path
                      key={id}
                      className={
                        index === activeIndex ? 'is-active' : undefined
                      }
                      d={kuwaitBoundaries[id]}
                    />
                  ))}
                </g>

                {governorates.map(({ id, pin, point, leader }, index) => (
                  <g
                    className={`atlas-leader${index === activeIndex ? ' is-active' : ''}`}
                    key={id}
                  >
                    <polyline points={`${point} ${leader} ${pin}`} />
                    {index === activeIndex && (
                      <circle
                        className="atlas-ring"
                        cx={point[0]}
                        cy={point[1]}
                        r="13"
                      />
                    )}
                    <circle cx={point[0]} cy={point[1]} r="4.5" />
                  </g>
                ))}
              </svg>

              {governorates.map((area, index) => (
                <button
                  type="button"
                  key={area.id}
                  className={`atlas-pin${index === activeIndex ? ' is-active' : ''}`}
                  style={{
                    left: `${(area.pin[0] / mapWidth) * 100}%`,
                    top: `${(area.pin[1] / mapHeight) * 100}%`,
                  }}
                  aria-label={area[lang]}
                  aria-haspopup="dialog"
                  aria-current={index === activeIndex ? 'location' : undefined}
                  onClick={(event) => openDetails(event, index)}
                >
                  <span aria-hidden="true">{markerNumber(index)}</span>
                </button>
              ))}
            </div>

            <figcaption className="atlas-caption">
              <span>{t.reference}</span>
              <a
                href="https://www.openstreetmap.org/copyright"
                lang="en"
                dir="ltr"
                aria-label={`${t.attribution}: © OpenStreetMap contributors`}
              >
                © OpenStreetMap contributors
              </a>
            </figcaption>
          </figure>

          <div className="atlas-index">
            <header className="atlas-index-head">
              <div>
                <p>{t.index}</p>
                <h3>{t.governorates}</h3>
              </div>
              <span dir="ltr" aria-hidden="true">
                06
              </span>
            </header>
            <ol className="atlas-list" role="list">
              {governorates.map((area, index) => (
                <li key={area.id}>
                  <button
                    type="button"
                    className={`atlas-row${index === activeIndex ? ' is-active' : ''}`}
                    aria-haspopup="dialog"
                    aria-current={
                      index === activeIndex ? 'location' : undefined
                    }
                    onClick={(event) => openDetails(event, index)}
                  >
                    <span
                      className="atlas-row-number"
                      dir="ltr"
                      aria-hidden="true"
                    >
                      {markerNumber(index)}
                    </span>
                    <span className="atlas-row-names">
                      <strong>{area[lang]}</strong>
                      <bdi lang={secondary}>{area[secondary]}</bdi>
                    </span>
                    <Icon name="arrow" size={17} />
                  </button>
                </li>
              ))}
            </ol>
            <p className="atlas-index-guide">{t.guide}</p>
          </div>
        </div>

        <div className="atlas-footer">
          <p>
            <Icon name="pin" size={18} />
            {enquiry.note}
          </p>
          <a className="text-link" href="#booking">
            {enquiry.action}
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>

      {dialogOpen && active && activeIndex !== null && (
        <Modal closeLabel={copy[lang].close} onClose={closeDetails}>
          <div className="atlas-popup" ref={popup}>
            <div className="atlas-popup-heading">
              <Eyebrow>
                {t.governorate} <bdi>{markerNumber(activeIndex)}</bdi>
              </Eyebrow>
              <h2 id="dialog-heading">
                {active[lang]} <bdi lang={secondary}>{active[secondary]}</bdi>
              </h2>
            </div>
            <div className="atlas-popup-body">
              <p>{t.detail}</p>
              <a
                className="button atlas-book"
                href="#booking"
                onClick={goToBooking}
              >
                {t.book}
                <Icon name="arrow" size={18} />
              </a>
              <p className="atlas-popup-note">{copy[lang].scopeNote}</p>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
