import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { NotFoundPage } from '../components/NotFoundPage'

import '../styles.css'

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  head: () => ({
    links: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#173e32',
      },
      {
        title: 'Page Not Found | Star Cleaning Kuwait',
      },
      {
        name: 'description',
        content:
          'This page could not be found. Return to Star Cleaning Kuwait to explore home, office, villa, sofa and carpet cleaning, and deep cleaning.',
      },
      {
        name: 'robots',
        content: 'noindex, follow',
      },
      {
        name: 'google-site-verification',
        content: 'ALebxPfh8LnFzxTkFWhMoSUsh_kvq1C4bRQ0bve2dqw',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const isArabic = useRouterState({
    select: (state) => /^\/ar(?:\/|$)/.test(state.location.pathname),
  })
  return (
    <html lang={isArabic ? 'ar' : 'en'} dir={isArabic ? 'rtl' : 'ltr'}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
