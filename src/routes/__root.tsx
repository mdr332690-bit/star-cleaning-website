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
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18535502279"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-18535502279');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PL9T5ZPM');`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PL9T5ZPM"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
