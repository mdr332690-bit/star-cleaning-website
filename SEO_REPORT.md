# Star Cleaning Kuwait SEO audit and implementation report

Audit date: 22 November 2026. Website: https://star-cleaning-website.netlify.app/. Changes were prepared and tested in source and the local Netlify development environment. **No production build or deployment was initiated.** The published website does not yet include these changes.

## Audit findings

The audit covered all 12 canonical English and Arabic URLs, the five service types, shared document shell, route metadata, structured data, navigation, service disclosures and dialogs, enquiry forms, contact actions, media delivery, typography, responsive styles, crawl files and missing-route handling. Historical audit documents described earlier versions; the current findings below supersede their statements about missing Arabic pages, missing contact details or unpublished service routes.

| Area                     | Published baseline                                                                                                                     | Work completed                                                                                                                                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Titles and descriptions  | All 12 pages already returned unique server-rendered titles and descriptions.                                                          | Refined the English homepage title to use the supplied business name, Star Cleaning Service. Updated both homepage descriptions to explain the service range and include the verified contact number. Preserved the distinct service-page metadata. |
| Canonicals and languages | Correct HTTPS self-canonicals and reciprocal `en`, `ar` and `x-default` alternates already existed.                                    | Preserved and tested all six translated page pairs, including the clean canonical for URLs with advertising parameters.                                                                                                                             |
| Crawl files              | robots.txt and sitemap.xml already returned 200; the sitemap contained all 12 canonical URLs and their alternates.                     | Validated their contents against the actual routes. No unnecessary replacement, fabricated last-modified dates or extra keyword pages were added.                                                                                                   |
| Indexing                 | Important pages were indexable. Unknown pages and invalid service slugs returned real 404 responses with noindex and no canonical.     | Preserved those behaviors. Added an HTTP noindex/nofollow header to the form-registration helper, supplementing its existing meta instruction while allowing crawlers to read it.                                                                   |
| Headings                 | Each valid page already had one H1 and structured H2/H3 sections.                                                                      | Made homepage heading word boundaries explicit in the HTML. Added useful H2 sections for service-specific care guidance.                                                                                                                            |
| Service discovery        | Service pages were linked in footer and disclosure content; some cards required interaction.                                           | Added an always-visible, server-rendered directory of all five service pages beside the service section. Preserved card dialogs, disclosures and expansion.                                                                                         |
| Service content          | Each service already had a unique introduction, scope, planning advice and FAQ.                                                        | Added distinct English and Arabic care guidance to every service, a floor-cleaning homepage FAQ, and contextual comparison links between relevant services.                                                                                         |
| Local structured data    | LocalBusiness, WebSite, five Service entities, WebPage and service breadcrumbs already existed.                                        | Added the supplied business name as an alternate name, explicit page-to-service and service-to-page relationships, stable primary-image IDs and image references consistent with the shared CDN sizing helper.                                      |
| Social sharing           | Open Graph and Twitter metadata already existed on every canonical page.                                                               | Retained and verified the HTTPS URLs, localized titles/descriptions, locale information, descriptive image ALT and 1200 × 630 social preview. Updated homepage social descriptions through the shared metadata source.                              |
| Image loading            | Responsive WebP, dimension attributes, descriptive bilingual ALT, high-priority hero images and lazy secondary images already existed. | Added intermediate service-hero widths and more accurate mobile/desktop sizes. Preserved native-width caps, quality, original imagery and licensing records.                                                                                        |
| JavaScript               | The shared branding/contact module imported booking and WhatsApp-editor code even on service pages with closed dialogs.                | Moved the booking UI into a separate module loaded when requested, with translated loading feedback. Retained the initial homepage enquiry form and all contact behavior.                                                                           |
| HTTPS and mobile         | HTTP redirected to HTTPS; initial live HTML contained no insecure resource references.                                                 | Preserved existing HTTPS configuration, fonts, colors, mobile layouts, RTL behavior, keyboard access and reduced-motion support.                                                                                                                    |

## Pages and keyword coverage

Keywords were used in useful content and descriptive headings, with natural English and Arabic grammar. No hidden keywords or keyword meta tags were added. House, home and apartment intent share the existing home-cleaning page; floor care remains within the verified services rather than becoming an invented sixth service.

| English URL                      | Arabic URL                          | Search intent                                                                                                  |
| -------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `/`                              | `/ar`                               | Cleaning Services Kuwait; cleaning company enquiries and service selection                                     |
| `/services/house-cleaning`       | `/ar/services/house-cleaning`       | House Cleaning Kuwait; Home Cleaning Kuwait; Apartment Cleaning Kuwait; Floor Cleaning Kuwait within home care |
| `/services/office-cleaning`      | `/ar/services/office-cleaning`      | Office Cleaning Kuwait; workstations, reception, shared routes and floor care                                  |
| `/services/deep-cleaning`        | `/ar/services/deep-cleaning`        | Deep Cleaning Kuwait; accessible edges, corners, detailed checklists and floor-care priorities                 |
| `/services/villa-cleaning`       | `/ar/services/villa-cleaning`       | Villa Cleaning Kuwait; rooms, levels, stairs and interior floor-care planning                                  |
| `/services/sofa-carpet-cleaning` | `/ar/services/sofa-carpet-cleaning` | Sofa Cleaning Kuwait; carpet and rug care, fabric condition and drying questions                               |

The English homepage title is **Cleaning Services Kuwait | Star Cleaning Service**. Service titles remain **House & Apartment Cleaning Kuwait | Star Cleaning**, **Office Cleaning Kuwait | Star Cleaning**, **Villa Cleaning Kuwait | Star Cleaning**, **Sofa & Carpet Cleaning Kuwait | Star Cleaning**, and **Deep Cleaning Kuwait | Star Cleaning**, with distinct Arabic equivalents. Each page has its own description, canonical and localized social metadata.

New service content explains floor materials and access in homes, equipment and documents around office cleaning, room and floor priorities in villas, preparation for upholstery and carpet care, and how to agree a useful deep-cleaning checklist. These sections help customers describe real requirements without promising unverified methods, results, availability or prices.

## Verified business information and media

The existing STAR CLEANING Kuwait branding was preserved. The supplied business name, Star Cleaning Service, was included in the homepage title and business alternate names. The verified telephone number remains **+96550258260**, displayed as **+965 50258260**; WhatsApp uses **96550258260**. Kuwait remains the service country, not a fabricated street address.

No addresses, coordinates, opening hours, ratings, reviews, prices, certifications or customer identities were invented. Existing experience claims and explicitly labeled testimonial placeholders were preserved. LocalBusiness was retained as a valid schema.org type; a fictional CleaningService type was not introduced. Service and breadcrumb markup describes visible page content. FAQ markup was not added merely to suggest eligibility for Google FAQ rich results, which is generally restricted to authoritative government and health sites.

All meaningful images retained descriptive English and Arabic ALT text. The decorative film image correctly retained empty ALT. Existing descriptive asset filenames and source/license records were retained to preserve image URLs and avoid unnecessary asset churn. Images continue through Netlify Image CDN as responsive WebP; original generated PNGs are not loaded directly in the initial page. The local video is requested only when its dialog opens. No new imagery or media claims were introduced.

## Performance evidence

A mobile Lighthouse run on the **published production homepage before these source changes** returned:

| Lab measurement          | Baseline |
| ------------------------ | -------- |
| Performance              | 87/100   |
| SEO automated checks     | 100/100  |
| First Contentful Paint   | 1.0 s    |
| Largest Contentful Paint | 1.0 s    |
| Cumulative Layout Shift  | 0.003    |
| Total Blocking Time      | 500 ms   |
| Speed Index              | 1.4 s    |

This was one simulated mobile lab measurement, not field Core Web Vitals or a score for the changed source. Total Blocking Time is not INP. The audit estimated 285 KiB of unused JavaScript; roughly 250 KiB was attributed to Google scripts and 35 KiB to the application entry. Existing Ads and Tag Manager integrations were preserved. Their configuration and loading cost remain a separate review item.

For the house-cleaning service at a 390px viewport and 2× device density, the published page selected a 1000px-wide hero for a 348px display. The changed local page selected 800px for the same display width. The published 1000px WebP response measured 84,410 bytes; the same production CDN delivered the 800px version in 56,750 bytes, approximately 33% less. The local 800px response measured 56,162 bytes. These checks demonstrate more appropriate image selection; overall production performance after publication still requires verification.

Browser network checks also confirmed that service-page booking form code was not requested until the enquiry dialog opened. The homepage form remained available in the initial page, and the video remained deferred. No unverified JavaScript savings, new production score, or field performance improvement was claimed. Existing route splitting, local fonts, responsive styles and normal production CSS/JavaScript optimization were retained; stylesheet rules were not removed without evidence that they were unused.

## Validation completed

- **103 automated tests passed** across six files, including 20 added SEO checks. They covered metadata and language contracts, schema relationships, sitemap consistency, robots rules, server-rendered route output, link targets, missing-page metadata, enquiry validation/submission behavior and the existing global Google tag installation.
- **TypeScript passed** with `pnpm typecheck`. Formatting checks on changed files and `git diff --check` passed.
- **12 local canonical pages returned HTTP 200**. All **238 internal links and fragment targets** resolved, and **17 distinct image, font and icon resources** returned successfully. Image transformations returned WebP.
- Three deliberately missing routes returned **HTTP 404**, noindex and no inappropriate canonical. Trailing-slash and advertising-query variants remained accessible and pointed to clean canonical URLs; no broad redirects or redirect loops were introduced.
- The static form-registration helper retained its fields and processing target, and returned the additional noindex/nofollow response header. The existing local Forms activation configuration required by the booking tests was restored.
- **60 Chromium layout cases passed**: all 12 pages at 320, 390, 760, 1024 and 1440 pixels. Each had one H1, the expected document language/direction, a loaded hero image and no horizontal document overflow.
- English and Arabic browser interaction checks passed for deferred booking dialogs, editable WhatsApp messages, verified phone links, Escape, close buttons, backdrop closing, service links, service expansion/details, video loading on demand, floor-care FAQ disclosure and language switching. Blocked browser storage and reduced-motion navigation also worked. **No browser page errors were observed.**

No real enquiry was submitted, phone call initiated or WhatsApp message sent. Booking submission outcomes were tested with mocked responses. Third-party Google scripts were blocked during local interaction tests to avoid sending development traffic; the separate live Lighthouse baseline included the published page's scripts.

## Remaining work and limits

1. **Publication requires permission.** No production build or deployment was started. Netlify performs production build validation after these source changes are accepted. Recheck all production URLs, metadata, headers, sitemap and interactions after an approved publication.
2. **Search Console:** ownership, submitted sitemap status and actual index coverage were not accessible in this run. After publication, submit or resubmit `https://star-cleaning-website.netlify.app/sitemap.xml`, inspect representative English and Arabic pages, and monitor indexing/canonical reports. Indexable HTML does not guarantee Google indexing or rankings.
3. **Google Business Profile:** verify or maintain the real business profile, use the same business name and phone, accurate service-area settings, and genuine approved photos and customer reviews. No profile or directory listing was created or changed. A private service-area business should not publish an invented customer-facing address.
4. **Local rich results:** the schema remains honest and useful, but Google's LocalBusiness rich-result requirements include business details such as a verified physical address that have not been supplied. No missing details were fabricated to satisfy a validator. Validate published markup with Google's Rich Results Test and the Schema.org validator.
5. **Performance:** repeat production mobile measurements after publication and review 28-day field LCP, INP and CLS in Search Console/PageSpeed Insights when sufficient traffic exists. The mobile baseline's 500 ms Total Blocking Time and Google script cost remain follow-up opportunities; rankings and Core Web Vitals improvements cannot be promised from local checks.
6. **Google Ads conversions:** organic SEO work does not complete the earlier conversion-tracking recommendation. Existing Google tags were not changed and no conversion action, label or reporting status was assumed. Conversion measurement remains separate from this SEO implementation.

## Maintenance

Use [SEO.md](SEO.md) for the current route, metadata, content and media maintenance rules. Earlier `TECHNICAL_SEO_AUDIT.md` and `TECHNICAL_SEO_REPORT.md` describe historical observations, not the current publication state.
