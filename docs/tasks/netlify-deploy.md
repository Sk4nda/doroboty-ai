# Publish the prototype on Netlify (production)

## Intent

Publish the static prototype under a public Netlify production URL, built from the GitHub repository, following the release plan in `production-readiness.md`.

## Acceptance criteria

- `netlify.toml` defines build command `npm run build`, publish directory `dist` and Node 24.
- The Netlify project is linked to `Sk4nda/doroboty-ai` and its production deploy succeeds.
- The production `*.netlify.app` URL opens without a Netlify login and one end-to-end path (candidate applies, employer opens the application) works there.

## Decisions

- No environment variables, secrets or auth provider callback URLs are needed: the app is static, uses hash routes and keeps all state in the visitor's `localStorage`.
- Hash routing means no SPA `/* → /index.html` redirect is required.
- Basic security headers are set in `netlify.toml`.

FEATURES.md reviewed: hosting configuration does not change product behavior, so no register update is needed.

## Result

(filled after deployment: URL, deploy ID, commit, smoke check evidence)
