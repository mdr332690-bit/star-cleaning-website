# Google Business Profile and review links

The owner confirmed the business name is **Star Cleaning Service** and asked
that the previously supplied Maps link remain unused until the business name
and location have been checked. Both Google destinations in `src/data/site.ts`
are deliberately empty. Customers see no Google buttons or links until the
corresponding verified destination is supplied.

## Activate the links after verification

1. Obtain the owner's verified Google Business Profile link and confirm the
   displayed business name and Kuwait location with the owner.
2. Obtain the separate review link copied from that profile's **Ask for reviews**
   or **Get more reviews** option. Check that it opens the review composer for
   Star Cleaning Service, including after Google sign-in if required. A normal
   Maps listing or a list of existing reviews is not a direct review link.
3. Set `googleBusinessProfileUrl` and `googleReviewUrl` in `src/data/site.ts` to
   those exact verified URLs. Never derive a review link from an unverified
   business identifier or substitute the profile link for the review link.
   Each destination can be enabled independently; leaving either blank hides
   only that action.
4. Run `pnpm test` and `pnpm typecheck`. Check a preview on Android and iPhone,
   both English and Arabic, and confirm each live Google destination. Local
   development uses `netlify dev --port 8889`.
5. Obtain the owner's explicit permission before publishing to production.

The shared component prepares a review button in the homepage testimonials
area and both Google links in the contact areas and footers of all twelve
English and Arabic homepage/service routes. Links open in a new tab to preserve
any in-progress inquiry. The accessible labels announce this in each language.

This is a link-based integration. It needs no Google API key, account access,
application backend, or database. It does not import or display reviews, invent
ratings, offer incentives, or filter which customers may leave a review. Existing
testimonial placeholders remain explicitly marked as awaiting verified reviews.

Automated rendering checks use reserved `.test` URLs as test data only; these
are not business destinations and are never configured in the website.
