# Youth Voice Blog — direct story submission setup

The first blog post and its approved header photograph are published in `en/`, `mk/`, and `sq/`.

## How the new form works
- Each Blog homepage now includes a topic, a short idea, an optional reply email, a consent checkbox, and a hidden spam-trap field.
- JavaScript checks `GET /api/story` for readiness. When the email service isn't configured, the Send button is disabled, with a truthful availability notice and a fallback `mailto:` link.
- When configured, the form POSTs privately to `/api/story`; the Cloudflare Pages Function sends an email through Resend to the editorial team. No story is automatically published.
- Server-side validation, length restrictions, same-origin checks, and basic honeypot filtering are present. For public-scale use, add rate limits / Cloudflare Turnstile and review privacy/safeguarding documentation.

## Required one-time Cloudflare configuration (not yet performed)
1. Open the connected **Cloudflare Pages** project, `pegasus-youth-voice-website`. In **Settings → Variables and Secrets**, configure **Production** variables:
   - `RESEND_API_KEY` — **Secret**: the Resend API key. Do not place this in GitHub, HTML, or messages.
   - `STORY_FROM_EMAIL` — a sender verified in Resend, e.g. `Youth Voice <blog@your-verified-domain.example>`. This MUST use a domain or sender accepted by Resend.
   - `STORY_TO_EMAIL` — `pegasusyouthvoice@gmail.com` (optional; the function defaults to this destination).
2. In Resend, verify the sending domain and its DNS records if needed. Do not change the **official website's** DNS or public launch status without owner approval; use a different verified sender domain if appropriate.
3. Redeploy the Cloudflare Pages production deployment to load the new secret.
4. Check `https://pegasus-youth-voice-website.pages.dev/api/story`; it must return JSON `{"ready":true}` before submitting a live test. If it returns `ready:false`, the email integration is not configured.
5. Submit a brief dummy story through `/en/blog/#story-idea`, confirm it arrives in the editorial inbox, and verify privacy text. Do not use real minors' personal details in tests.

## Important limitations
- The form cannot actually deliver until the Resend credential and verified sender are set. The client clearly shows the unavailability, rather than pretending to send.
- A failure of email delivery returns an error. The form does not collect or publish the idea in GitHub or any database.
- The `noindex` prelaunch settings remain unchanged.
- Hero image is AI-generated illustration, not documentary evidence of an actual activity.

## First blog article
`/{en|mk|sq}/blog/your-voice-belongs-here/`
