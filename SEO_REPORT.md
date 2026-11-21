# Star Cleaning Kuwait: bilingual SEO audit and implementation report

Audit date: 18 November 2026. The published homepage, Arabic URL, robots.txt and sitemap were checked before implementation. Source changes were then checked through the local Netlify development server. No publishing or deployment was initiated.

## Initial audit

| Area                  | Existing behavior                                                                                                           | Improvement completed                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| English homepage      | Server-rendered English title, description, H1 and canonical URL were present.                                              | Retained the relevant H1 and added stronger company/service headings, apartment coverage, staffing information and keyword-focused metadata.                                  |
| Arabic visibility     | Arabic content, typography and RTL existed as a browser-only toggle. `/ar` returned 404.                                    | Added an independently accessible Arabic homepage and Arabic service pages, rendered in Arabic and RTL in the initial HTML.                                                   |
| Service discovery     | Five services had cards, modal details and expandable homepage guides, with fragment links only.                            | Preserved those features and added a translated page for each verified service with a distinct introduction, planning guidance and service FAQ.                               |
| Language targeting    | No hreflang tags or separate Arabic canonical URL existed.                                                                  | Added self-referencing canonicals and reciprocal `en`, `ar` and `x-default` alternates for all six translated page pairs.                                                     |
| Sitemap and robots    | robots.txt correctly allowed crawling and referenced a sitemap containing only `/`.                                         | Expanded the sitemap to all 12 canonical URLs with matching language alternates. Kept the correct robots.txt declaration.                                                     |
| Structured data       | LocalBusiness, WebSite, English WebPage and the five services were already described without invented addresses or reviews. | Localized the business catalogue and WebPage data, linked services to their real page URLs, and added service-page BreadcrumbList data and appropriate page-image references. |
| Image alternatives    | Translated descriptive ALT text was already present.                                                                        | Refined image descriptions in both languages, clarified illustrative images and male-cleaner imagery, and retained empty ALT text for decorative images.                      |
| Business restrictions | Contact details and verified reviews were intentionally missing; male-only staffing was not explicit in the page copy.      | Added the supplied male-only staffing policy in both languages. Kept enquiry and contact placeholders honest and limited services to the existing five.                       |

## Pages and keyword mapping

All paths below use `https://star-cleaning-website.netlify.app`. Arabic uses the same stable service slugs under `/ar`; translated slugs are not required for language targeting.

| English page                     | Arabic page                         | Target keyword intent                                                                         |
| -------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| `/`                              | `/ar`                               | Cleaning Services Kuwait; Cleaning Company Kuwait; شركة تنظيف الكويت; خدمات تنظيف الكويت      |
| `/services/house-cleaning`       | `/ar/services/house-cleaning`       | House Cleaning Kuwait; Apartment Cleaning Kuwait; تنظيف منازل الكويت; تنظيف شقق الكويت        |
| `/services/deep-cleaning`        | `/ar/services/deep-cleaning`        | Deep Cleaning Kuwait; تنظيف عميق الكويت                                                       |
| `/services/sofa-carpet-cleaning` | `/ar/services/sofa-carpet-cleaning` | Sofa Cleaning Kuwait; تنظيف كنب الكويت, while retaining the verified carpet service           |
| `/services/villa-cleaning`       | `/ar/services/villa-cleaning`       | Villa Cleaning Kuwait; تنظيف فلل الكويت                                                       |
| `/services/office-cleaning`      | `/ar/services/office-cleaning`      | Office Cleaning Kuwait; تنظيف مكاتب الكويت                                                    |
| Homepage advice FAQ              | Homepage advice FAQ                 | “How do I choose the best cleaning company in Kuwait?” / “كيف أختار أفضل شركة تنظيف بالكويت؟” |

House and apartment cleaning were grouped within the existing home cleaning service. No sixth service was invented. The “best” phrase was used in a helpful comparison question and answer, without making an unsupported superiority claim. Natural English and Arabic grammar, including “in Kuwait” and “في الكويت”, was used where appropriate instead of repeating exact-match keyword strings.

## Completed content and technical changes

The English homepage retained “Cleaning services in Kuwait” as its H1. The Arabic homepage retained the translated equivalent. Service pages each received one descriptive H1. Homepage H2 headings now identify Kuwait cleaning services and the cleaning company; expandable service-guide H3 headings and related-service H3 links identify the service and Kuwait. New service pages use H2 headings for service scope, planning, enquiries and questions.

All 12 URLs received unique titles and meta descriptions in the initial server response. Open Graph and Twitter titles, descriptions and image alternatives follow the page language; sharing URLs match each page’s canonical URL. The existing Google site verification tag was preserved.

The language switch became a crawlable link to the equivalent translated page, including when a visitor is reading a service page. The requested URL determines page language consistently on the server and in the browser. Browser storage cannot override it, and switching continues to work when storage is blocked. Arabic responses include `lang="ar"` and `dir="rtl"` on the document itself. Existing Noto Sans Arabic typography, mirrored layouts and reduced-motion rules were retained.

Homepage footer links and links within the existing service guides now lead to the relevant full service page. Each service page links to the homepage, relevant homepage sections and the other four verified services. Visible breadcrumbs and matching BreadcrumbList structured data connect services to their language-specific homepage. Existing homepage fragment links remain valid.

The LocalBusiness graph identifies Star Cleaning Kuwait, its bilingual name, existing logo and image, Kuwait as the country served, supported languages and the five verified services. Every Service points to its provider and a corresponding translated URL. Each WebPage has its own language, URL, title and description. Service pages reference the image shown on that page. No street address, telephone number, opening hours, coordinates, prices, rating, customer review or social profile was fabricated. Kuwait coverage is represented as `areaServed`, not as an invented physical address.

The homepage kept all sections, the five service cards, expandable guides, service dialogs, video, FAQs, testimonials placeholder and enquiry flow. Shared dialog and enquiry components were reused on service pages. The forest green, ivory and brass palette, existing fonts, responsive behavior, SVG icons, lazy video loading and optimized image delivery were preserved. No application backend, database, persistent enquiry storage or new external booking integration was added.

The new page copy adds service-specific planning guidance and questions rather than producing separate near-identical landing pages for every keyword. Existing service details are intentionally retained for continuity, with new supporting content on each service page. Each translated page uses its own canonical URL; Arabic pages are not canonicalized to English. No obsolete meta-keywords tag or hidden keyword lists were introduced.

## Titles and meta descriptions

### `/`

**Title:** Cleaning Services Kuwait | Star Cleaning Company

**Meta description:** Star Cleaning provides cleaning services across Kuwait with male staff only. Explore house, office, villa, sofa, carpet and deep cleaning. 10+ years of experience.

### `/ar`

**Title:** شركة تنظيف الكويت | خدمات ستار كلينينج

**Meta description:** ستار كلينينج شركة تنظيف في الكويت بخبرة تزيد عن 10 سنوات. خدمات تنظيف المنازل والشقق والمكاتب والفلل والكنب والسجاد والتنظيف العميق بطاقم من الرجال فقط.

### `/services/house-cleaning`

**Title:** House & Apartment Cleaning Kuwait | Star Cleaning

**Meta description:** House and apartment cleaning in Kuwait with male cleaning staff. Discuss rooms, kitchen and bathroom surfaces, floor care and your priorities with Star Cleaning.

### `/ar/services/house-cleaning`

**Title:** تنظيف منازل وشقق الكويت | ستار كلينينج

**Meta description:** تنظيف منازل وشقق الكويت مع ستار كلينينج بطاقم من الرجال فقط. ناقش تنظيف الغرف وأسطح المطبخ والحمامات والأرضيات ونطاق العمل المناسب لمنزلك قبل الحجز.

### `/services/office-cleaning`

**Title:** Office Cleaning Kuwait | Star Cleaning

**Meta description:** Office cleaning in Kuwait for workstations, meeting rooms and shared spaces. Discuss your workplace routine and cleaning scope with Star Cleaning’s male staff.

### `/ar/services/office-cleaning`

**Title:** تنظيف مكاتب الكويت | ستار كلينينج

**Meta description:** تنظيف مكاتب الكويت لمحطات العمل وغرف الاجتماعات والمساحات المشتركة. ناقش أوقات العمل ونطاق التنظيف مع ستار كلينينج، بطاقم تنظيف من الرجال فقط.

### `/services/villa-cleaning`

**Title:** Villa Cleaning Kuwait | Star Cleaning

**Meta description:** Villa cleaning in Kuwait with male cleaning staff. Plan care for rooms, stairs and interior surfaces, with the scope agreed for your villa before booking.

### `/ar/services/villa-cleaning`

**Title:** تنظيف فلل الكويت | ستار كلينينج

**Meta description:** تنظيف فلل الكويت بطاقم من الرجال فقط. خطط لتنظيف الغرف والسلالم والأسطح الداخلية مع ستار كلينينج، وناقش مساحة الفيلا والأولويات ونطاق العمل قبل الحجز.

### `/services/sofa-carpet-cleaning`

**Title:** Sofa & Carpet Cleaning Kuwait | Star Cleaning

**Meta description:** Sofa and carpet cleaning in Kuwait with male cleaning staff. Discuss fabric, size, condition and expected drying time with Star Cleaning before your visit.

### `/ar/services/sofa-carpet-cleaning`

**Title:** تنظيف كنب وسجاد الكويت | ستار كلينينج

**Meta description:** تنظيف كنب وسجاد الكويت مع ستار كلينينج بطاقم من الرجال فقط. شاركنا نوع القماش والحجم والحالة لمناقشة طريقة العناية ووقت الجفاف المتوقع قبل الزيارة.

### `/services/deep-cleaning`

**Title:** Deep Cleaning Kuwait | Star Cleaning

**Meta description:** Deep cleaning in Kuwait for high-use areas, edges, corners and accessible surfaces. Discuss a detailed cleaning scope with Star Cleaning’s male cleaning staff.

### `/ar/services/deep-cleaning`

**Title:** تنظيف عميق الكويت | ستار كلينينج

**Meta description:** تنظيف عميق الكويت للمناطق كثيرة الاستخدام والحواف والزوايا والأسطح المتاحة. ناقش أولويات منزلك أو مكتبك مع ستار كلينينج بطاقم تنظيف من الرجال فقط.

## Validation completed

- TypeScript: `pnpm run typecheck` passed after the development server generated the route tree. The generated file was not edited manually.
- Regression tests: `pnpm test` passed all 26 tests for canonical URLs, reciprocal hreflang, unique metadata, translated schema, verified-business restrictions and sitemap consistency.
- Formatting: Prettier checks passed for all changed source and documentation files. `git diff --check` passed.
- Local HTTP crawl: all 12 sitemap URLs returned 200 and contained the expected initial HTML language/direction, one H1, one description, self-canonical, matching hreflang, valid JSON-LD and the preserved verification tag. All 218 internal links, including fragment targets, were checked.
- Error handling: an unknown page and invalid English and Arabic service slugs returned 404 with `noindex, follow` and no inappropriate canonical URL.
- Browser checks: all 12 pages passed at 1440px and 390px viewport widths, with no horizontal overflow, broken loaded images or browser runtime errors. English and Arabic homepage/service screenshots were visually reviewed.
- Interactive checks: paired language navigation, dynamic metadata updates, mobile menu, service dialogs, native modal focus trapping, Escape and close-button behavior, related-service navigation, FAQ disclosure and existing deep links passed. Editable enquiry drafts, selected-service defaults, clipboard success and clipboard-denied manual-copy fallback passed. Browser-storage blocking did not prevent language switching. The video did not load until its dialog opened and was removed when closed.
- No production build command, commit, publish action or deployment was run. Production build validation remains outstanding.

## Remaining issues and follow-up

1. **Publishing approval:** These are source changes. Publishing requires the owner’s approval. The live public URLs were not updated by this work.
2. **Verified contact details:** Official telephone, WhatsApp and email values are still absent. The website continues to explain that direct WhatsApp booking is not connected and offers an editable enquiry with copying instead. It does not claim to send or confirm a booking.
3. **LocalBusiness rich-result eligibility:** A verified physical address, opening hours and other unavailable business details were not added. The existing schema remains truthful, but Google LocalBusiness rich-result eligibility cannot be confirmed without the required verified information and post-publication validation. Additional business details require accurate, approved information.
4. **Testimonials:** Approved customer reviews remain unavailable. The visible placeholder stays explicit, and no Review or AggregateRating markup was added.
5. **Search Console after approval:** Once published, inspect representative English and Arabic URLs, check rendered language/canonicals, submit the expanded sitemap and monitor indexing. Search Console submission and Google rich-result testing against the new public URLs were not performed because the changes are not published.
6. **Production checks:** The production build and deployed routing, status codes and image transformations still need validation after approval. Local development checks do not replace production verification. No production Core Web Vitals measurement or ranking result is claimed.
7. **Ongoing SEO:** Rankings and search snippets depend on search-engine decisions. This work did not include external keyword-volume research, backlink work, Business Profile changes or third-party account changes. Future domain changes require updating the canonical origin, sitemap and robots.txt together; future service additions require updating both languages and the sitemap.
