# Pegasus Youth Voice — website development

Trilingual static website: English (`/en/`), Macedonian (`/mk/`), Albanian (`/sq/`).

## Status
Content and responsive presentation cleaned up for owner review. There are no published blog articles yet; the Blog invites story ideas. The official launch still requires domain setup, legal/safeguarding review, form and media checks, and final sign-off. Do not remove noindex restrictions until final launch approval. See [HANDOVER-TO-DEYAN.md](HANDOVER-TO-DEYAN.md).

## Hosting
Cloudflare Pages, connected to this GitHub repository. Choose Pages (not Workers), framework preset `None`, production branch `main`, build command blank, output directory `.`.

## Preview links
Cloudflare assigns a `*.pages.dev` URL after deployment. Current development preview: https://pegasus-youth-voice-website.pages.dev/en/ (verify live deployment separately).

## Domains
The approved intended public hostname is `www.pegasusyouthvoice.com`. **Do not connect it or modify DNS until the owner authorises the official launch.**

## Updates
Use feature branches and pull requests for unapproved changes. Publish approved changes to `main` only after review.

## Website structure
- `index.html` redirects to `/en/`
- `en/`, `mk/`, `sq/`: 7 sections per language
- `assets/`: style, scripts, original uploaded logo, and vector wing motif
- `robots.txt`: search indexing disabled during development

## Attention
Contact details are present in all three languages. Translation QA, privacy/cookies, safeguarding, accessibility, links, membership form processing and any future blog-publishing functionality still require final review. The Blog has no published posts or content management system; it has a public story-idea invitation. See the handover checklist.
