import { lazy, Suspense } from 'react'
import type { Language } from '../data/content'
import { copy } from '../data/content'

const Booking = lazy(() => import('./Booking'))

// Keep the optional dialog form and WhatsApp editor out of service-page loads.
export function LazyBooking({
  lang,
  initialService,
}: {
  lang: Language
  initialService: string
}) {
  return (
    <Suspense
      fallback={
        <h2 id="dialog-heading" role="status">
          {copy[lang].loadingBooking}
        </h2>
      }
    >
      <Booking lang={lang} initialService={initialService} />
    </Suspense>
  )
}
