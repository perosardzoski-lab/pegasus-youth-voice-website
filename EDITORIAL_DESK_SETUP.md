# Pegasus Youth Voice Editorial Desk — secure setup

Status: **FOUNDATION IMPLEMENTED, NOT ACTIVATED**. Protected review APIs fail closed.
Public website, public blogs, domain/DNS and noindex settings remain unchanged unless separately noted.

## What is now in the repository
- `/editorial/` — Editorial Desk shell. This HTML contains no private submissions. It retrieves private data ONLY through verified API calls.
- `/contribute/` — contributor article form; HTML is multilingual-friendly (language selector EN/MK/SQ) but interface copy currently English. Public intake stays disabled until configured.
- `/api/editorial/session` — valid Cloudflare Access JWT + explicit server-side email allowlist required.
- `/api/editorial/submissions/` — list of private submissions, authentication required.
- `/api/editorial/submissions/:id` — private content and review-status updates, authentication required.
- `/api/editorial/image/:id` — only authorized editors may access private R2 images.
- `/api/article-submission` — article intake: text and up to five privately stored images, with Turnstile.
- `/api/article-submission/config` — public safe configuration check (Turnstile site key; no secrets).
- `editorial/schema.sql` — D1 tables for private submissions, images and audit events.
- Blog landing pages in EN/MK/SQ include both quick story-idea and full-article contributor options.

## Role structure (starting team)
- One administrator/editor-in-chief: may review, approve or decline and manage approval decisions.
- Two invited reviewers: may inspect submissions, mark reviewing, request changes. Cannot approve.
- Contributors: use the public submission page; **individual draft accounts and private contributor history are NOT implemented yet**.

Nobody is an editor by default. **No email accounts have been added**, because the owner has not supplied the email addresses. Do not use the public editorial address as a shared password or as an automatic editor account.

## Cloudflare activation — owner-controlled steps
1. Cloudflare Zero Trust → Access → Applications: create a **self-hosted application** for the Editorial Desk on the applicable deployed hostname and paths:
   - `/editorial/*`
   - `/api/editorial/*`
   Apply policies to **every production/preview/custom hostname actually used**. Do not restrict all public blog pages.
2. Allow exactly one Administrator's email and two reviewer email addresses. Use email one-time PIN or an identity provider with MFA. Never use an Everyone/Bypass policy for editorial URLs.
3. Obtain the Access **team domain** (e.g. `your-team.cloudflareaccess.com`) and **Application Audience (AUD)**. If multiple Access applications are created, the editorial API's JWT audience must correspond to the API's application. Do not assume the values are interchangeable.
4. Workers & Pages → Pegasus Youth Voice Pages project → Settings → Variables and Secrets → Production:
   - `EDITORIAL_ENABLED` = `true`
   - `ACCESS_TEAM_DOMAIN` = actual team domain
   - `ACCESS_AUD` = matching Access app AUD
   - `EDITOR_ADMIN_EMAILS` = exact Administrator email (no default)
   - `EDITOR_REVIEWER_EMAILS` = two exact reviewer email addresses (separated by commas)
   Configure both a Cloudflare Access allow policy and these **server-side** role allowlists. A person must pass BOTH.
5. Create a Cloudflare D1 database and apply `editorial/schema.sql`. Bind it to Pages Functions as `EDITORIAL_DB`.
6. Create a **private** Cloudflare R2 bucket (no public bucket URL); bind it as `EDITORIAL_R2`.
7. Create a Cloudflare Turnstile widget for the actual deployed website hostnames. Add `TURNSTILE_SITE_KEY` (public) and `TURNSTILE_SECRET_KEY` (secret). Keep the secret outside the repository.
8. To enable full-article intake only after steps 5–7 and testing, set `EDITORIAL_INTAKE_ENABLED` = `true`. Until then, intake must remain disabled.
9. Email notifications (optional but recommended): provide `RESEND_API_KEY`, `STORY_FROM_EMAIL` (verified sender), `STORY_TO_EMAIL` = `pegasusyouthvoice@gmail.com`; the article text/images remain in the private database/bucket, and notification email contains a brief summary and reference only.
10. Redeploy production, check `GET /api/editorial/session` as admin, as reviewer, as an unlisted person, and with no Access token. Only listed identities may access data.
11. Submit a **test article with fictional information only**. Check D1 row, image access permissions, review status and event history. Confirm public URLs never reveal private content.
12. Validate live security, mobile layout, accessibility, data-retention policy and safeguarding before requesting submissions from minors.

### Publishing
**Not yet integrated.** Saving status `approved` does NOT create a public webpage. Publishing requires a separate protected pipeline, e.g. a GitHub App with tightly scoped repository permissions, safe HTML generation, editor preview, publication consent, preview deployment, and confirmed Cloudflare Pages deployment before the record becomes `published`. Never store a GitHub token in HTML or public JavaScript. Do not claim that Approve automatically publishes.

### Contributor upload and privacy
- Max 5 images, max 5 MB each, JPEG/PNG/WebP MIME plus file signature checks.
- Images are stored with random object keys in a private bucket, not public URLs.
- Server checks Turnstile, same-origin requests, form fields and consent.
- Uploaded content is not auto-published.
- Consent to share images for review is not automatically publication consent. Review must confirm rights and, where applicable, guardian consent for identifiable minors.
- A transparent retention/deletion policy, privacy notice, and independent testing are required before public activation.
- For production abuse controls, add rate limiting and additional content/image safety screening.

## Verification endpoints
- `GET /api/article-submission` returns `ready:false` until private D1/R2/Turnstile and intake enablement are configured.
- `GET /api/editorial/session` returns HTTP 503 when editorial not configured, and HTTP 403 for missing/invalid/unlisted identity.
- `GET /api/editorial/submissions/` returns no data until verified authenticated editor.
- The public `/editorial/` HTML shell by itself contains **no private content or identity**.

## Operational restrictions
- This account has a GitHub connection, not a connected Cloudflare administrative tool. Cloudflare Access, D1, R2, Turnstile, DNS, and secret variables cannot be configured from the available GitHub connection.
- Do **not** place email allowlists, private user addresses, secret keys or access credentials in the repository.
- Preserve the prelaunch noindex policy and official domain. No production go-live or DNS changes were requested.
