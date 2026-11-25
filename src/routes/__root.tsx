import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { NotFoundPage, notFoundCopy } from '../components/NotFoundPage'
import { languageFromPath } from '../data/servicePages'

import '../styles.css'

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  beforeLoad: ({ location }) => ({
    lang: languageFromPath(location.pathname),
  }),
  head: ({ match }) => ({
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
        title: notFoundCopy[match.context.lang].title,
      },
      {
        name: 'description',
        content: notFoundCopy[match.context.lang].description,
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
    select: (state) => languageFromPath(state.location.pathname) === 'ar',
  })

  return (
    <html lang={isArabic ? 'ar' : 'en'} dir={isArabic ? 'rtl' : 'ltr'}>
      <head>
        {/* Apply privacy controls before loading either Google runtime. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  gtag('policy', 'detect_user_provided_data', function() { return false; });
  gtag('set', {
    allow_enhanced_conversions: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ads_data_redaction: true
  });
  gtag('js', new Date());

  gtag('config', 'AW-18535502279', { send_page_view: false });

  var googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18535502279';
  document.head.appendChild(googleTag);`,
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
