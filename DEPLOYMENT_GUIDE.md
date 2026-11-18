# Setup checklist — Pegasus Youth Voice

1. Sign in to GitHub (`perosardzoski-lab`) and create a **private** repository named `pegasus-youth-voice-website`; do not initialize with a README.
2. Upload the **contents** of this folder to the repository root, including the `assets`, `en`, `mk`, and `sq` folders; commit to `main`. For many files, GitHub's browser uploader may have limitations; use GitHub Desktop if needed.
3. Sign in to Cloudflare. Go to Workers & Pages > Create application > Pages > Connect to Git. Grant repository-specific access if possible. Select the new repository.
4. Set name `pegasus-youth-voice` (if available); branch `main`; framework `None`; build command blank; output directory `.`. Deploy.
5. Open the assigned `*.pages.dev` address and test `/en/`, `/mk/`, `/sq/` plus About, Our Work, Projects, Blog, Get Involved, Contact. Verify logo displays, mobile navigation works.
6. Do not configure a custom domain; do not change DNS for `pegasusyouthvoice.com`. The `pages.dev` address is public, even though the GitHub repository is private.
7. For future work, commit approved updates to `main`, or use feature branches for review. Cloudflare's Git integration automatically deploys commits.
8. Before public launch, validate translations, contact information, privacy and blog functionality; remove noindex settings only on approval.
