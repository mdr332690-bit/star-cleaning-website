import { createFileRoute } from '@tanstack/react-router'
import { ReviewAdmin } from '../components/ReviewAdmin'

export const Route = createFileRoute('/admin/reviews')({
  head: () => ({
    meta: [
      { title: 'Review moderation | Star Cleaning Kuwait' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  headers: () => ({
    'X-Robots-Tag': 'noindex, nofollow',
    'Cache-Control': 'private, no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
  }),
  component: ReviewAdmin,
})
