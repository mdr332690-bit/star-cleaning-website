# Production build readiness report

Reviewed on 22 November 2026 for Star Cleaning Kuwait. Source revision: 3b3567c. No application code, configuration or dependencies were changed. No merge, deployment or publication was performed.

**Result: the existing production artifacts passed the checks below. A fresh official Netlify build was not run or certified.** This environment explicitly prohibits manual build commands, including the configured Netlify build process. Consequently, a fresh build exit status, complete build log and build-time warning list remain unavailable. Passing artifact checks must not be interpreted as a successful fresh official build.

**Configured production process.** The project selected Node 24, the build command was `vite build`, and the publish directory was `dist/client`. Vite used the Netlify TanStack Start adapter to produce the server-rendered application and packaged Netlify function. The review ran under Node v24.22.3 with pnpm 10.30.3.

**Available build evidence.** The workspace contained the generated browser assets, compiled server, generated Netlify configuration, function manifest and packaged server function. Their relevant filesystem timestamps were 22 November 2026 at approximately 01:08 UTC. Timestamps and artifacts are supporting evidence, not an authenticated build-success log. The package archive passed its integrity check, contained 271 entries and loaded successfully in isolation after its packaged symbolic links were preserved. The generated handler used the catch-all path with static-file preference enabled.

The compiled server and generated handler were invoked locally without publishing. The function archive was also extracted outside the repository and its bundled handler was tested independently. Every packaged route rendered successfully. Its static document content and structured data matched the compiled server, and its metadata matched the previously reviewed source. Browser checks used the compiled JavaScript and CSS, including the lazy booking chunk.

## Route verification

This application uses server rendering. Its twelve public URLs are handled by the compiled route tree and Netlify server function; twelve separate prerendered HTML files are not required. Every route below returned HTTP 200 from the packaged handler and passed metadata checks and compiled-browser layout checks at 390 and 1440 pixels.

| Route                             | Language/direction | Packaged response | SEO and browser checks |
| --------------------------------- | ------------------ | ----------------- | ---------------------- |
| /                                 | English / LTR      | 200               | Passed                 |
| /ar                               | Arabic / RTL       | 200               | Passed                 |
| /services/house-cleaning          | English / LTR      | 200               | Passed                 |
| /ar/services/house-cleaning       | Arabic / RTL       | 200               | Passed                 |
| /services/office-cleaning         | English / LTR      | 200               | Passed                 |
| /ar/services/office-cleaning      | Arabic / RTL       | 200               | Passed                 |
| /services/villa-cleaning          | English / LTR      | 200               | Passed                 |
| /ar/services/villa-cleaning       | Arabic / RTL       | 200               | Passed                 |
| /services/sofa-carpet-cleaning    | English / LTR      | 200               | Passed                 |
| /ar/services/sofa-carpet-cleaning | Arabic / RTL       | 200               | Passed                 |
| /services/deep-cleaning           | English / LTR      | 200               | Passed                 |
| /ar/services/deep-cleaning        | Arabic / RTL       | 200               | Passed                 |

Three invalid-route cases returned HTTP 404 with noindex and no inappropriate canonical: an unknown top-level route and invalid English and Arabic service slugs.

## SEO, sitemap and contact checks

All twelve packaged responses contained one title, one meta description, one H1, the expected language/direction, index/follow directives, an HTTPS self-canonical, reciprocal English/Arabic/x-default alternates, Open Graph metadata, a Twitter sharing card and parseable JSON-LD. Titles, descriptions and H1 text matched the reviewed source. Structured data preserved the verified phone, Kuwait coverage and five services without invented addresses, prices, hours, ratings or reviews.

The packaged pages resolved all 238 internal page/fragment links. All referenced initial JavaScript and stylesheet files existed in the production client output; compiled browser checks reported no missing assets. No insecure HTTP resource references were found in the twelve packaged page responses.

The production-output sitemap parsed as valid XML and listed exactly twelve distinct canonical HTTPS URLs with matching English, Arabic and x-default alternates. The production-output robots file allowed crawling and referenced https://star-cleaning-website.netlify.app/sitemap.xml. Both files were byte-identical to their source copies.

The static Forms registration and favicon were also preserved byte-for-byte. The form helper retained its noindex metadata. The noindex/nofollow response-header rule for that helper was present in both the source and generated Netlify configuration. Actual CDN response-header application still requires deployment-specific verification.

All 60 telephone anchors in the twelve initial responses used `tel:+96550258260`. All 38 initial WhatsApp anchors used `https://wa.me/96550258260`. English and Arabic dialog checks confirmed that editable messages retained the correct recipient and encoded message text. The verified phone number remained unchanged. No real call, WhatsApp message or enquiry submission was sent.

## Functionality, tests and warnings

The full automated suite passed: 103 tests across six files. TypeScript and `git diff --check` also passed. Tests covered server-rendered SEO, sitemap/robots consistency, verified schema restrictions, Google tag installation, enquiry validation, form registration alignment, processing success/failure, duplicate-pending prevention and existing WhatsApp behavior.

Compiled-browser checks passed against both the generated handler and the independently extracted packaged handler. The packaged-handler run covered 24 route/viewport cases plus ten service-page interaction cases and two homepage interaction cases. No horizontal document overflow, missing eager-loaded images, page runtime errors, console warnings, console errors or missing compiled assets were observed in that run.

All ten localized service pages opened the lazy enquiry form with a selected service, retained editable WhatsApp drafts and supported Escape dismissal. English and Arabic homepage checks covered mobile menus, the five service links, card expansion, service dialogs, enquiry dialogs, video dialogs, FAQ disclosure and language switching with updated canonical metadata. Existing Google scripts and integrations were preserved; no code change was needed.

| Check                                                    | Outcome                                               |
| -------------------------------------------------------- | ----------------------------------------------------- |
| Fresh official Netlify build                             | Not run; prohibited by this session's execution rules |
| Fresh official build exit status                         | Unavailable                                           |
| Complete official build errors/warnings                  | Unavailable; no claim of a warning-free build         |
| Existing production archive integrity and handler import | Passed                                                |
| Twelve packaged route responses and SEO                  | Passed                                                |
| Compiled assets referenced by initial HTML               | Present                                               |
| Packaged browser layouts                                 | 24 passed                                             |
| Packaged browser interaction cases                       | 12 passed                                             |
| Packaged browser errors/warnings                         | None observed                                         |
| Automated tests                                          | 103 passed across six files                           |
| TypeScript                                               | Passed                                                |
| Whitespace/error check                                   | Passed                                                |
| Full dependency audit                                    | Two moderate advisories; zero high or critical        |
| Production-only dependency audit                         | Zero reported advisories                              |

The browser harness served existing compiled assets through request interception; it did not start a deployment or rebuild the project. Image-CDN URLs were fulfilled with the corresponding local source images, so actual CDN transformations, production image delivery and caching were not revalidated. Video-dialog loading was checked; complete playback and codec support across browsers were not certified. Third-party Google requests were blocked to avoid development tracking traffic. Real Google reporting, live form receipt/notifications and platform routing under deployed traffic were not tested. These limits apply to the functionality results above.

## Security advisories and configuration

The refreshed dependency audit reported the same two moderate development-tooling advisories:

| Dependency | Affected installed version | Advisory                                                                                                                           | Recommended remediation                                                                       |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| glob       | 13.0.7                     | [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): cancellation may leave filesystem traversals running     | Update compatible upstream tooling to a dependency tree containing glob 14.0.2 or later.      |
| minimatch  | 10.2.6                     | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): attacker-influenced patterns may amplify CPU/memory work | Update compatible upstream tooling to a dependency tree containing minimatch 11.0.1 or later. |

Both were transitive dependencies of the existing Netlify development/build tooling. A separately installed minimatch 11.0.9 copy was outside the affected range. The production-only audit reported no advisories, and no glob or minimatch module paths were present in the packaged function archive. No customer-request path for supplying glob patterns was identified in the application. These findings do not certify the absence of all vulnerabilities.

The published-client credential-pattern scan reported no matches. No local environment files were present in the function archive, and no client source-map files were present in the publish output. Existing safe contact-link behavior and the narrowly scoped form indexing header were preserved. No new configuration error requiring a source change was identified. No dependency upgrade or application change was made without approval.

## Remaining readiness requirements

A successful fresh official Netlify production build, together with review of its complete errors and warnings, remains required for unconditional production-build sign-off. That step could not be performed under this session's rules. The available artifact and runtime checks passed, but they do not replace it.

The two moderate tooling advisories remained unresolved and were recorded for an approved dependency-maintenance change. Live form processing, deployed headers/routing, actual Image CDN behavior and production performance still require deployment-specific verification after any separately approved release. No merge, deployment or publication was performed, and the application source remained unchanged.
