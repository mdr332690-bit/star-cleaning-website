# SEO maintenance

The current audit, changes, keyword mapping, validation and remaining external work are documented in [BILINGUAL_SEO_REPORT.md](BILINGUAL_SEO_REPORT.md). Earlier SEO reports describe historical versions.

The site has 12 indexable pages: the English homepage at `/`, Arabic homepage at `/ar`, and five services in each language under `/services/` and `/ar/services/`. Each uses server-rendered metadata, one H1, a clean HTTPS self-canonical, reciprocal `en`/`ar`/`x-default` alternates, localized Open Graph/Twitter metadata and truthful structured data. Missing routes and invalid service slugs return noindex 404 responses. The form-registration helper remains noindex and crawlable so that instruction can be read.

Maintain business details in `src/data/site.ts`, homepage copy in `src/data/content.ts`, service copy and stable slugs in `src/data/servicePages.ts`, local enquiry guidance in `src/data/localSeo.ts`, and metadata/schema in `src/data/seo.ts`. The verified phone is +96550258260 and the WhatsApp destination is 96550258260. Keep both languages complete. Do not invent service claims, business addresses, hours, prices, ratings or reviews. Keep floor care within the existing service scope and testimonials clearly marked until genuine approved content is available.

The seven named Kuwait locations are enquiry examples with explicit availability confirmation, not verified service areas or branches. Keep them out of schema coverage until confirmed. Female-cleaner search terms are addressed only through an explicit male-staff-only clarification; do not advertise female staff or an unsupported “best company” claim.

When adding or removing a real service page, update `public/sitemap.xml` with both language URLs and reciprocal alternates. Keep the production origin in `site.url`, `public/robots.txt`, sitemap entries and social URLs aligned. Do not list fragment identifiers, tracking-query variants, form helpers or missing routes in the sitemap. Do not block a noindex document in robots.txt, because crawlers must retrieve it to see that instruction.

## IndexNow

Configure `INDEXNOW_KEY` as a secret available only to Functions in the production deploy context. Use a randomly generated 64-character hexadecimal value and keep it out of the repository, build environment, and client code. The server serves the ownership proof at `/<key>.txt` on the production hostname.

The Netlify deploy event checks the live proof before submitting the current public sitemap after a published production `main` deploy. It rechecks each listed URL against `robots.txt`, the direct HTML response, its robots directives and its self-canonical. A production deploy sends the eligible set as a batch, including unchanged pages; previews and failed deploys do not send anything. The function logs the submitted URLs and HTTP status without logging the ownership proof. HTTP `200` means IndexNow accepted the batch; `202` means the URLs were received but key validation is pending. Neither guarantees search indexing. After a production deployment, confirm the root proof returns HTTP `200` with the expected plain-text body and check the `indexnow-deploy` function log for the live POST result. Do not report the integration as verified based on tests or a reachable endpoint alone.

## Performance and validation

Use local images through `src/data/images.ts` and Netlify Image CDN. Keep shared hero definitions aligned with their layouts. React 19 already preloads the high-priority responsive hero; avoid adding duplicate preload tags. Keep responsive width descriptors within the original dimensions, use sizes matching the actual layout, retain image dimensions and descriptive translated ALT, and leave decorative ALT empty. Keep media source/license notes in `MEDIA.md`. Booking dialogs are deferred through `LazyBooking`; the homepage enquiry form remains immediately available. The video loads only after its dialog opens.

Validate changes with `pnpm test`, `pnpm typecheck` and `git diff --check`. Use `netlify dev --port 8889` for local browser and HTTP checks so Image CDN is emulated. Netlify handles production build validation; publication requires the owner's permission. After publication, inspect live English/Arabic URLs, submit the sitemap in Search Console, validate structured data and measure production performance. Local tests cannot establish Google indexing, ranking, rich-result eligibility or field Core Web Vitals.
