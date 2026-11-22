# Final pre-deployment SEO review

Reviewed on 22 November 2026 for https://star-cleaning-website.netlify.app/.

The source review and available automated, HTTP and Chromium checks passed. No design or functionality regression was observed within the reviewed scope. Deployment readiness remains conditional on a successful production build and the owner's approval. No deployment or publication was performed.

**Outstanding production validation:** A production build was not run because this environment explicitly prohibits manual build commands. Netlify's automatic production build validation must pass before release. Development checks do not establish that the production bundle, adapter output or deployed routing works correctly.

**Security follow-up:** The full dependency audit reported two moderate advisories in existing development tooling. The production-only dependency audit reported no advisories. Details and remediation are recorded below.

## Files reviewed

The complete SEO change comprised 17 files. Every changed file was reviewed against its previous version, including added files. This final review changed documentation only; application code and dependencies were left unchanged.

| File                                | Review outcome                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| .gitignore                          | Dependency directories, generated output and local environment files were excluded; the example-environment exception was retained.                                                        |
| README.md                           | Verified contact details, enquiry behavior and deferred booking documentation matched the implementation.                                                                                  |
| SEO.md                              | Route, metadata, sitemap, language, media and maintenance guidance matched the current source.                                                                                             |
| SEO_REPORT.md                       | The audit, implemented changes, prior performance baseline and remaining external work were reviewed. Its Lighthouse numbers describe the earlier published site, not this source version. |
| netlify.toml                        | The only SEO configuration addition scoped the noindex/nofollow header to the static form helper. Existing build, publish and development settings were preserved.                         |
| src/components/Booking.tsx          | Booking and WhatsApp component bodies matched the former shared-module implementation exactly, apart from the default export.                                                              |
| src/components/BookingForm.test.tsx | The import followed the extracted Booking component; submission assertions were preserved.                                                                                                 |
| src/components/LazyBooking.tsx      | Deferred loading retained translated loading text and an accessible dialog heading.                                                                                                        |
| src/components/MarketingPage.tsx    | Explicit H1 spacing, five visible service links and lazy booking integration preserved the existing sections and controls.                                                                 |
| src/components/ServicePage.tsx      | New translated guidance, valid comparison links and responsive hero sizes retained service scopes, contact controls and booking dialogs.                                                   |
| src/components/SiteUI.tsx           | The booking extraction preserved shared contact actions, branding and native modal behavior.                                                                                               |
| src/data/content.ts                 | New directory/loading labels and floor-care FAQ content had English and Arabic equivalents.                                                                                                |
| src/data/seo.test.ts                | Metadata, schema, sitemap and robots assertions remained consistent with the actual routes and verified business information.                                                              |
| src/data/seo.ts                     | Titles, descriptions, schema relationships and image IDs used the intended localized pages and HTTPS origin.                                                                               |
| src/data/seoRendering.test.tsx      | Server-rendering checks covered all 12 routes, link targets, missing routes and tracking-query canonicals.                                                                                 |
| src/data/servicePages.ts            | All five services had distinct bilingual care guidance and valid contextual comparison destinations.                                                                                       |
| src/styles.css                      | The 26 added lines styled only the new service directory and comparison links. Existing visual rules were not removed or rewritten.                                                        |

The unchanged route definitions, document shell, contact configuration, image helper, booking submission code, static Forms registration, robots.txt and sitemap.xml were also inspected. Package manifests, the dependency lockfile, media files and Google tag installation were unchanged by the SEO changes. The generated route tree was not edited manually.

## All 12 pages

Every row passed both a fresh HTTP check against the current source and browser layout checks at 320, 390, 760, 1024 and 1440 pixels. English pages returned lang=en and dir=ltr; Arabic pages returned lang=ar and dir=rtl.

| Page                              | HTTP | Language | SEO and five viewport checks |
| --------------------------------- | ---- | -------- | ---------------------------- |
| /                                 | 200  | English  | Passed                       |
| /ar                               | 200  | Arabic   | Passed                       |
| /services/house-cleaning          | 200  | English  | Passed                       |
| /ar/services/house-cleaning       | 200  | Arabic   | Passed                       |
| /services/office-cleaning         | 200  | English  | Passed                       |
| /ar/services/office-cleaning      | 200  | Arabic   | Passed                       |
| /services/villa-cleaning          | 200  | English  | Passed                       |
| /ar/services/villa-cleaning       | 200  | Arabic   | Passed                       |
| /services/sofa-carpet-cleaning    | 200  | English  | Passed                       |
| /ar/services/sofa-carpet-cleaning | 200  | Arabic   | Passed                       |
| /services/deep-cleaning           | 200  | English  | Passed                       |
| /ar/services/deep-cleaning        | 200  | Arabic   | Passed                       |

All 12 initial HTML responses contained one H1, one title, one meta description, index/follow directives, an HTTPS self-canonical, reciprocal English/Arabic/x-default alternate links, localized social metadata and parseable JSON-LD. The 12 titles and 12 descriptions were distinct. Tracking queries and representative trailing-slash variants retained clean canonical URLs. Paired service-language navigation updated the document language and canonical after navigation completed.

The crawl resolved 238 internal page/fragment links and 17 distinct image, font and icon resources. Three missing-route cases returned real HTTP 404 responses with noindex and no canonical. No horizontal document overflow, broken eager-loaded hero images or browser page errors appeared in the 60 layout cases.

## Design and working features

Fresh English and Arabic homepage/service screenshots were inspected at mobile and desktop sizes. Forest green, ivory and brass colors, local typography, RTL mirroring, imagery and existing page sections were preserved. The intended visible additions were service-directory links and useful service-care paragraphs with comparison links.

Browser checks passed for service-card expansion, service detail dialogs, homepage and service booking dialogs, editable WhatsApp drafts, FAQ disclosure, mobile-menu opening/closing, language navigation with available or blocked storage, and reduced-motion behavior. Escape, close-button and backdrop dismissal worked. All ten localized service pages opened the enquiry dialog with the matching service selected. Keyboard traversal stayed within the native modal or browser chrome and did not reach the underlying page controls.

Network checks confirmed that service-page booking code loaded when its dialog opened. The homepage enquiry form remained present initially. The local video loaded only after its dialog opened. The booking extraction preserved the prior component bodies exactly.

Form tests passed for bilingual field registration, validation, successful processing, error handling, rejection of unprocessed registration HTML, retained details on failure, duplicate-pending prevention and WhatsApp fallback behavior. The static registration retained matching field names, language, form name and honeypot. Live enquiry receipt and notification delivery were not tested; no real submission was sent.

## Phone and WhatsApp

All 60 telephone anchors in the 12 initial page responses used tel:+96550258260. All 38 initial WhatsApp anchors used https://wa.me/96550258260. The displayed phone number remained +965 50258260, including readable left-to-right presentation in Arabic content.

English and Arabic editable dialog messages produced the correct WhatsApp recipient and URL-encoded text. New-window links retained noopener/noreferrer protections. No telephone call was initiated and no WhatsApp message was sent.

## Sitemap, robots and indexing

The XML sitemap returned HTTP 200, parsed successfully and contained exactly the 12 canonical HTTPS URLs. Each entry had the matching English, Arabic and x-default alternate URLs. Helpers, missing routes, fragments and tracking-query variants were absent.

The robots file returned HTTP 200, allowed crawling and declared https://star-cleaning-website.netlify.app/sitemap.xml. The form helper remained accessible for form processing and returned both its existing noindex metadata and the added X-Robots-Tag: noindex, nofollow header. That header did not affect the 12 marketing pages.

The published HTTP homepage redirected successfully to HTTPS. No insecure HTTP resource references were found in the 12 current-source page responses. Search Console ownership, sitemap submission, actual Google index coverage and rich-result eligibility were not verified through account access.

## Tests and checks

| Check                                                                           | Result                                                         |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| pnpm test                                                                       | Passed: 103 tests across six files                             |
| pnpm typecheck                                                                  | Passed                                                         |
| Changed source/document formatting with repository quote and semicolon settings | Passed                                                         |
| git diff --check                                                                | Passed                                                         |
| Current-source HTTP route, resource and fragment checks                         | Passed: 12 pages, 238 internal links, 17 resources             |
| Metadata, contact, social and structured-data HTTP checks                       | Passed on all 12 pages                                         |
| Chromium responsive layout checks                                               | Passed: 60 cases, zero page errors                             |
| English/Arabic interaction checks                                               | Passed within the scope described above                        |
| All ten service-dialog defaults and keyboard checks                             | Passed                                                         |
| Full dependency audit                                                           | Two moderate, zero high or critical advisories                 |
| Production-only dependency audit                                                | Zero reported advisories                                       |
| Production build                                                                | Pending automatic platform validation; no manual build was run |

Third-party Google scripts were blocked during local browser checks to avoid development tracking traffic. The unchanged Google installation was covered by source regression tests. Real ad conversions, Google account settings, live form receipt and production Core Web Vitals were outside these checks. Earlier production Lighthouse scores were not reused as results for this review.

The first browser attempt encountered stale generated server output that referenced unavailable assets. Those generated local artifacts were isolated and the development server was restarted. The reported HTTP and browser results came from subsequent runs against the current source; no application change was required to resolve that local environment issue.

## Security and configuration findings

The audit identified these existing transitive development dependencies, both reached through the Netlify TanStack development adapter and its packaging tools:

| Dependency | Installed affected version | Advisory                                                                           | Impact and recommended action                                                                                                                                                                                                     |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| glob       | 13.0.7                     | [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), moderate | Canceled traversals can continue filesystem work. Update compatible upstream tooling to a dependency tree containing glob 14.0.2 or later.                                                                                        |
| minimatch  | 10.2.6                     | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), moderate | Attacker-influenced glob patterns can amplify CPU/memory work. Update compatible upstream tooling to a dependency tree containing minimatch 11.0.1 or later. The separately installed 11.0.9 copy was outside the affected range. |

These packages and the lockfile were unchanged by the SEO work. The application source exposed no identified customer-request path for supplying glob patterns or filesystem trees. The production-only audit was clean; the final generated bundle was not inspected because production build validation remained pending. Updating the adapter/tooling and rerunning validation was recommended. No untested major-version overrides or dependency updates were applied during this review.

The source/configuration review found no newly introduced credential patterns, browser-exposed secrets, unsafe user-generated HTML insertion, insecure media URLs, broad redirects, invented review/rating schema or fabricated business addresses. This was a scoped source and dependency review, not a penetration test. JSON-LD serialization escaped less-than characters. New-window contact links used safe relationship attributes. The form helper's narrowly scoped indexing header preserved the existing processing endpoint.

Existing build settings and the Node 24 production selection were preserved. No backend, database, new environment variable or external service was introduced. Local business schema retained the verified Kuwait coverage, phone and five services; unavailable address, hours, prices and ratings were not fabricated.

## Approval and remaining gates

The review found no SEO-source defect requiring an application-code change. The owner still needed to review this report and approve any publication. No deployment or publication action was performed or scheduled by this review.

A successful automatic production build remained required before release. The two development-tooling advisories remained recorded follow-up work. After an approved release, the production URLs, assets, response headers, language navigation and genuine form processing still needed deployment-specific verification; Search Console and field performance checks required the published version and account access.
