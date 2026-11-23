# Pegasus Youth Voice — handover to Deyan

Prepared: 23 November 2026
Status: **Content cleanup committed; NOT approved for official public launch.**

## Preview and source
- Preview: https://pegasus-youth-voice-website.pages.dev/en/
- English: /en/ ; Macedonian: /mk/ ; Albanian: /sq/
- GitHub: https://github.com/perosardzoski-lab/pegasus-youth-voice-website
- Official domain to configure at launch: **https://www.pegasusyouthvoice.com**
- Do not modify DNS or Cloudflare Pages custom-domain settings without the owner's launch approval.

## Completed content cleanup
- Confirmed contact information appears on all three Contact pages:
  - pegasusyouthvoice@gmail.com
  - +389 70 329 979
  - +389 70 755 007
  - www.pegasusyouthvoice.com
  - Tetovo, RN Macedonia (localised in each language)
- Replaced obsolete under-development footer notices with contact calls-to-action.
- Removed pre-launch disclaimer sections from the three Contact pages.
- Replaced Blog empty-state holding messages with an invitation to suggest story ideas by email. **No published posts are claimed.**
- Replaced deferred-public-documents notices in About pages with a contact route.
- Updated homepage Blog teasers to point toward ideas and contributions.
- Corrected home-page 'OUR FOCUS' section label in Macedonian and Albanian.
- Retained approved branding, images, ESCAPERO photo story, and multilingual membership-interest form.
- Responsive mobile CSS improvements remain in place.

## Mandatory launch gates — Deyan + organisation owner
1. **Authorisation:** Owner approves final English, Macedonian and Albanian wording; governance/association details; partnership/photo consent statements; and confirmed organisational name.
2. **Custom domain & TLS:** Attach www.pegasusyouthvoice.com to the correct Cloudflare Pages project. Verify HTTPS certificate; configure apex pegasusyouthvoice.com to redirect permanently to www. Confirm both hostnames, redirects and paths /en/, /mk/, /sq/ before marking it live.
3. **Canonical and hreflang:** Current static HTML canonical/hreflang URLs use https://pegasusyouthvoice.com (without www). Once the www hostname is final and serves live traffic, update all 21 pages' canonical and hreflang URLs to the correct www URLs and validate reciprocal language links. Do not leave inconsistent primary hostnames.
4. **Indexing:** The 21 HTML pages currently contain meta robots noindex,nofollow and robots.txt contains Disallow: /. Remove these restrictions **only at official launch approval**, then review indexing, sitemap.xml (create and publish if appropriate), and Google Search Console.
5. **Membership form:** Test the Google Form in all three page versions and on mobile, submit a dummy test record with permission, verify owner receives it, confirm privacy notice, data-access permissions, deletion/retention and parental consent approach for ages 14–17. Form URL used: https://docs.google.com/forms/d/e/1FAIpQLScVYY9KUY8ArdN22pIfynkbxsXi3kvPKtIOuFrUpWZ2nJnXjg/viewform
6. **Legal and youth-safeguarding review:** Confirm registration details and public-document disclosure obligations with the organisation. Approve any required privacy and cookie disclosures, safeguarding protocol and photographic permissions. Do not publish names or identifiable information about minors without appropriate permissions.
7. **Content review:** There is one documented completed ESCAPERO activity (30 October 2026) in Projects. Confirm attribution and media permissions. The Blog currently has no posts and deliberately states this; either approve a first authored article or retain the transparent invitation. Do not invent activities, partners or statistics.
8. **Functional QA:** Click through navigation, language switching, email and tel links; inspect responsive layouts (320px, 375px, 390px, 768px and desktop), images and alt text; flip cards; external form; keyboard access; check broken assets and console errors.
9. **Public release:** Publish from intended production branch after signed-off review. Check the final deployment and cache, verify links after domain cutover and monitor errors.

## Confirmed contact details
- Email: pegasusyouthvoice@gmail.com
- Phones: +389 70 329 979 / +389 70 755 007
- Official planned domain: https://www.pegasusyouthvoice.com
- Location: Tetovo, RN Macedonia

## Deliberately not changed
- Cloudflare Pages/DNS/hosting
- robots.txt or noindex/nofollow HTML meta tags
- Blog engine/CMS (none exists currently)
- Any unapproved legal claims or governance documents
- Existing images, logos, and photos

**Status for handover:** Website content is substantially cleaned up for review, but the domain, indexing, compliance, testing and owner sign-off remain launch blockers.


## Approved and locked Get Involved imagery — 23 November 2026
The organisation approved the final youth-centred image direction. Use the **same four shared binary assets** for English, Macedonian and Albanian; the three HTML variants already point to the same paths:
- `assets/get-involved-hero.png` — 1600 × 800, approved two students working at a laptop
- `assets/get-involved-participation.png` — 1200 × 984; exact 2×2 card sprite (classroom dialogue, environmental action, city photography, podcast)
- `assets/get-involved-steps.png` — 1800 × 600; three-photo strip (city, park, classroom)
- `assets/get-involved-form-support.png` — 1536 × 1024; café conversation before membership form

Final PNG binaries were prepared as a downloadable ZIP package in the associated ChatGPT conversation. **They have not yet been written to GitHub by the available connector and therefore are NOT deployed until those binaries are uploaded.** Do not mark deployment complete on the basis of this note.

The shared stylesheet `assets/get-involved.css` already has an aspect-ratio-safe override (`height:auto;aspect-ratio:auto;object-fit:contain`) for desktop and mobile. Verify all four images after uploading at 320px, 390px, 768px and desktop widths. Keep the real approved Pegasus emblem unchanged; avoid reproducing a logo on the photos. Image set is locked pending binary deployment and live verification.
