import { createFileRoute } from '@tanstack/react-router'
import { ReviewPage } from '../components/ReviewPage'
import { createSeoHead } from '../data/seo'

export const Route = createFileRoute('/review')({
  head: () => createSeoHead('en', undefined, 'review'),
  headers: () => ({
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
  }),
  component: () => <ReviewPage lang="en" />,
})
