# Pegasus Youth Voice — website development

Trilingual static website: English (`/en/`), Macedonian (`/mk/`), Albanian (`/sq/`).

## Status
Development preview only. The Version 5 visual direction has been approved, but content and features still require review. No real blog articles have been published. Do not remove noindex restrictions until final launch approval.

## Hosting
Cloudflare Pages, connected to this GitHub repository. Choose Pages (not Workers), framework preset `None`, production branch `main`, build command blank, output directory `.`.

## Preview links
Cloudflare assigns a `*.pages.dev` URL after deployment. The project name `pegasus-youth-voice` is suggested, but not guaranteed available.

## Domains
The intended final domain is `pegasusyouthvoice.com`. **Do not connect it or modify DNS during development.**

## Updates
Use feature branches and pull requests for unapproved changes. Publish approved changes to `main` only after review.

## Website structure
- `index.html` redirects to `/en/`
- `en/`, `mk/`, `sq/`: 7 sections per language
- `assets/`: style, scripts, original uploaded logo, and vector wing motif
- `robots.txt`: search indexing disabled during development

## Attention
Contact details, translations, privacy/cookies, accessibility, links, and blog publishing functionality need final approval. The blog currently has an empty state, not a content management system.
