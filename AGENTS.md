# STAR CLEANING Kuwait

## Architecture

A single-page bilingual cleaning-company marketing website using React 19, TypeScript, TanStack Start, TanStack Router, Vite and the Netlify adapter. The main route is `/`. This project does not need an application backend or a database. Do not introduce either unless a requested feature requires them.

## Key files

- `src/routes/__root.tsx`: document shell, title and social metadata, favicon and stylesheet import.
- `src/routes/index.tsx`: homepage route.
- `src/components/MarketingPage.tsx`: page sections, language state, navigation, service details, booking form and media dialogs.
- `src/components/BookingForm.tsx`: bilingual Netlify Forms booking inquiries and submission feedback.
- `src/data/booking.ts`: booking copy, service choices and Kuwait date/time validation.
- `public/__forms.html`: static Netlify Forms registration; keep its field names aligned with the rendered booking form.
- `src/components/Icon.tsx`: local SVG icon and star mark components.
- `src/components/NotFoundPage.tsx`: missing-route fallback.
- `src/data/site.ts`: brand description and verified contact configuration.
- `src/data/content.ts`: complete English and Arabic copy, services and their suggested scope.
- `src/styles.css`: visual tokens, layouts, responsive rules, Arabic typography and motion preferences.
- `public/img`: generated cleaning photography and royalty-free stock interiors.
- `public/video`: the locally hosted, commercially licensed cleaning clip.
- `MEDIA.md`: media source records, licenses and image-generation prompts.
- `netlify.toml`: production and local development settings.

The framework generates `src/routeTree.gen.ts`. Do not edit it manually.

## Content and conventions

Keep the forest green, ivory and muted brass design, with Cormorant Garamond display typography, DM Sans body text and Noto Sans Arabic for Arabic. Use CSS logical properties for layouts that mirror in RTL. Maintain mobile and reduced-motion behavior. Icons are local SVGs, not emoji.

Every customer-facing string needs English and Arabic content. Browser APIs belong in effects and handlers to preserve server rendering. Native dialog elements provide modal focus trapping; preserve Escape, backdrop and close-button behavior. FAQ items use native disclosure elements.

Only the supplied business claims are verified: Kuwait, over 10 years of experience, more than 20 clients served and the five listed services. Do not invent prices, certifications, customer identities, reviews, ratings, phone numbers or addresses. Testimonials must remain explicitly marked as placeholders until real approved content is supplied.

## Enquiry behavior

The homepage and booking dialogs submit inquiries through Netlify Forms, using the `star-cleaning-booking` form and URL-encoded POSTs to `/__forms.html`. The static registration includes every submitted field, the hidden form name, the language and a honeypot. Show success only after a successful response from form processing; reject unprocessed registration HTML. Preserve details on failure and prevent duplicate pending submissions. A received inquiry does not confirm a booking: availability, scope and pricing must be agreed with the team.

The booking dialog also retains an editable WhatsApp message under a disclosure. The verified business number is +965 50258260; `site.whatsappNumber` contains international digits only. WhatsApp opens `wa.me` with an encoded enquiry. If the number is removed, keep the clipboard action and manual-copy fallback. There is no custom backend or application database for inquiries.

Language preference is a browser-only UI setting. The active language changes document `lang` and `dir` and the page copy; it can be remembered using localStorage. The interface also works if browser storage is blocked.

## Assets and development

Serve local images with `/.netlify/images?url=/img/<filename>&w=<width>&fm=webp`. Keep original generated assets out of the initial page payload. Load the video only when its dialog is opened. Retain source and licensing notes when changing media. The cleaning images are illustrative, not photographs of the company's actual team.

Use Node 22.13+ or Node 24 and pnpm. For local work, install with `pnpm install` and run `netlify dev --port 8889` so image transformations are emulated. Netlify handles the production build. Do not expose credentials in source, logs or client code.
