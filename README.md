# STAR CLEANING Kuwait

A premium, responsive English and Arabic website for STAR CLEANING Kuwait. The design pairs forest green, warm ivory and brass accents with editorial typography and professional cleaning imagery.

The homepage includes five cleaning services with detail dialogs, the company story, experience statistics, reasons to choose STAR CLEANING, a playable cleaning film, a three-step enquiry process, a clearly marked testimonials placeholder, FAQs and contact information.

## Technology

React 19, TypeScript, TanStack Start and TanStack Router, Vite, Tailwind CSS 4 and custom CSS. The site uses Netlify's TanStack adapter and Image CDN. No database, external booking service, authentication or application API is required. Licensed fonts are hosted locally.

## Run locally

Use Node 22.13+ or Node 24, install dependencies with `pnpm install`, then run:

```sh
netlify dev --port 8889
```

Open the local URL printed by the CLI. Use Netlify's development environment so image transformations at `/.netlify/images` work correctly. Netlify handles production builds with the configuration in `netlify.toml`.

## Business details

Edit `src/data/site.ts` to add the verified phone number, email address and WhatsApp number. The WhatsApp number must use the international format with digits only. Once populated, the booking dialog opens WhatsApp with the selected service, optional date and editable message. Until then, visitors see an honest availability note and can copy an enquiry. Preparing or sending an enquiry does not confirm a booking.

English and Arabic homepage content lives in `src/data/content.ts`, and service page copy lives in `src/data/servicePages.ts`. English is served at `/` and Arabic at `/ar`, with five translated service pages under `/services/` and `/ar/services/`. The URL determines the language, including on the server; browser storage never replaces the language of a requested URL. Language links remember a selection when browser storage is available and work when it is blocked. They do not send visitor data anywhere.

Each page has server-rendered metadata, a self-referencing canonical URL, reciprocal English/Arabic and x-default hreflang links, and localized structured data. `src/data/seo.ts` supplies these from the same service catalogue. `public/sitemap.xml` lists all 12 indexable URLs and their language alternates; update it when adding or removing a service page. Keep `site.url`, the sitemap and `public/robots.txt` aligned if the production domain changes. Invalid service slugs return a noindex 404. See `SEO_REPORT.md` for the audit, keyword mapping, metadata and remaining work.

Testimonials are intentionally marked as awaiting verified reviews. Add only genuine, approved customer testimonials. No telephone number, street address, rating, pricing, customer quote or individual customer identity has been invented.

## Media

Static assets are in `public/img` and `public/video`. Images are served through Netlify Image CDN; the video loads only when the film dialog is opened. See `MEDIA.md` for source and license details. Generated photography and stock media are illustrative and do not claim to document the company's actual staff or projects.

## Accessibility and motion

The site includes keyboard focus styling, a skip link, native modal dialogs with focus trapping and Escape support, labeled controls, translated text, native FAQ disclosure elements and reduced-motion support.
