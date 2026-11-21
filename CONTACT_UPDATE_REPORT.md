# Verified business phone update

Completed on 19 November 2026 in the unpublished source. No deployment or publication was initiated.

The owner-supplied business number **+965 50258260** was added to the shared contact configuration. The phone link used `tel:+96550258260`, the direct WhatsApp link used `https://wa.me/96550258260`, and LocalBusiness structured data used the international telephone value `+96550258260`.

## Completed changes

| Requirement           | Result                                                                                                                                                                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Call Now button       | Added a direct telephone link labeled **Call Now** in English and **اتصل الآن** in Arabic.                                                                                                                                                     |
| WhatsApp button       | Added the requested direct WhatsApp link labeled **WhatsApp** in English and **واتساب** in Arabic, with safe new-tab attributes.                                                                                                               |
| Visible number        | Displayed **+965 50258260** in the header call button and the contact section on every page. The number remained left-to-right within Arabic layouts.                                                                                          |
| All 12 pages          | Added shared contact actions to both homepage and service-page templates, covering all six English pages and six Arabic pages. Both buttons appeared in each page's header and contact section.                                                |
| LocalBusiness schema  | Added the verified telephone property to the existing localized schema on all 12 pages. Existing business, service, website, webpage and breadcrumb data was retained.                                                                         |
| Mobile usability      | Used visible text, existing phone/WhatsApp SVG icons, wrapping button groups and touch targets of at least 44px in tested layouts. The sticky header kept both actions available while scrolling.                                              |
| Existing enquiry flow | Connected the existing editable enquiry dialog to the verified WhatsApp number. Continuing opened a WhatsApp URL with the edited message; the website did not send the message or confirm a booking.                                           |
| Outdated copy         | Updated the English/Arabic quotation FAQ and service enquiry guidance that previously said the business number was unavailable. Existing fallback copy and behavior remained available if contact configuration were later removed.            |
| Design and SEO        | Retained the palette, fonts, imagery, page content, navigation, service dialogs and video behavior. Added a compact header contact row without replacing the existing header controls. Adjusted anchor scroll clearance for the taller header. |

No email, address, opening hours, prices, reviews, ratings or additional business facts were invented. Kuwait-wide targeting and the male-only staffing statements were retained.

## Page coverage

All routes below belonged to the existing source. Each returned HTTP 200 in the local Netlify preview and contained the verified call/WhatsApp links, visible number and telephone schema.

| English                          | Arabic                              |
| -------------------------------- | ----------------------------------- |
| `/`                              | `/ar`                               |
| `/services/house-cleaning`       | `/ar/services/house-cleaning`       |
| `/services/office-cleaning`      | `/ar/services/office-cleaning`      |
| `/services/villa-cleaning`       | `/ar/services/villa-cleaning`       |
| `/services/sofa-carpet-cleaning` | `/ar/services/sofa-carpet-cleaning` |
| `/services/deep-cleaning`        | `/ar/services/deep-cleaning`        |

## Validation

- TypeScript and all **35 regression tests** passed. Existing schema checks were updated to require the newly verified telephone while continuing to reject unsupported business information.
- All 12 pages passed browser checks at **320, 390, 768 and 1440px**, giving **48 responsive cases** without horizontal overflow or browser runtime errors. Every new contact button met a minimum 44px width and height in these cases.
- Initial server HTML contained the correct telephone and WhatsApp links. Browser checks confirmed the number and both actions appeared in every header and contact section, with appropriate translated labels.
- All 12 titles and descriptions remained unique. Each page retained its expected HTTPS canonical, three hreflang alternates, indexable robots metadata and one H1. Arabic pages retained document-level Arabic language and RTL direction.
- English/Arabic homepage and office-service enquiry dialogs preserved the selected service and editable message, generated correctly encoded WhatsApp message links and closed with Escape. The previous number-unavailable notice was absent with the verified number configured.
- Equivalent service-language navigation continued to work. English and Arabic mobile/desktop screenshots were captured and visually reviewed.
- Formatting and `git diff --check` passed. No new project dependency, backend, database or contact-submission endpoint was added.

The sitemap, robots.txt, canonical URLs, keyword-targeted titles/descriptions and image/font optimizations were retained. The phone-number limitation noted in the earlier SEO reports was resolved by this update; those reports remained historical records of their original audits.

## Publication status and limits

All checks described here used unpublished source and a local preview. No calls were placed and no WhatsApp messages were sent. Native dialer behavior and delivery to the business WhatsApp account were not independently tested. Production build, deployed routing, assets and live schema still require validation after an approved deployment. No updated production performance, indexing or ranking result was claimed.

**Publishing remained on hold pending explicit owner approval.**
