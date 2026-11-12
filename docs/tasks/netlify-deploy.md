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

- Netlify project `doroboty-ai-case` (team "Marcin Świerczek’s team"), production URL https://doroboty-ai-case.netlify.app.
- 2026-11-12: production deploy `6af5b25b50b2b27ef33c41d8` built with `netlify deploy --prod --build` from a clean checkout of commit `9c751a0` (branch `karta-wkladu`, pushed to GitHub).
- New projects in this team had Visitor access "Team login" on all deploys (HTTP 401). With the owner's approval it was changed to protect only non-production deploys; production returns 200 with the `netlify.toml` headers.
- Smoke check in Chrome on the production URL: home page renders; signed in as Anna Kowalska, opened "AI Product Manager", submitted an application (missing-approval validation shown first, then "Aplikacja wysłana", Match Score 84%); signed in as Karolina Wiśniewska, opened Anna's application under Kandydaci with Odpowiedź / CV / Karta wkładu tabs; reload kept the data; no console errors.
- Not done yet: Git-based continuous deployment (Netlify ↔ GitHub link) requires authorizing the Netlify GitHub app; until then deploys are run from the CLI.
- Rollback: Netlify dashboard → Deploys → previous deploy → "Publish deploy".
