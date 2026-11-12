# Production readiness check before publishing (dev run)

## Intent

Run the `production-readiness` skill on the prototype before the first public deployment (planned: Netlify or Vercel static hosting), fix release blockers found locally and keep the offline report in `docs/production-readiness.html`.

## Acceptance criteria

- `./scripts/verify` passes on this Windows checkout.
- The report covers the version that will be published and lists no open preparation blocker.
- Deployment-stage checks (HTTPS, production smoke test, logs/alerts) remain open for the next quest.

## Changes

- `.gitattributes` forces LF in every checkout. With `core.autocrlf=true` Git wrote CRLF, so Prettier, the design-system hash check and the participant packet verifier failed locally (CI on Linux was not affected).
- `src/app/records.css`: at ≤420px the record tabs use smaller gaps/padding. The third tab "Karta wkładu" (added with the contribution card) overflowed a 320px viewport.
- `tests/e2e/prototype.spec.ts`: the legacy-draft test now expects the answer field plus the five optional contribution-card fields (intended behavior from the contribution-card change).

- `.prettierignore` excludes the generated `docs/production-readiness.html`, which the skill renderer owns and must not be reformatted.

FEATURES.md reviewed: the responsive fix restores existing documented behavior, so no register update is needed.

## Release, smoke check and rollback plan

Context: static teaching prototype for AIPH3 participants/testers, synthetic data only, hosted on Netlify or Vercel. If it is down, testers cannot use the shared link; no data is lost because every scenario lives in the visitor's own browser. Owner of incidents and rollback: the prototype owner (Sk4nda), confirmed 2026-11-12.

1. Release: deploy a committed version from GitHub. Build command `npm run build`, publish directory `dist`, Node 24 (`.nvmrc`). No environment variables or secrets are needed. Record the commit and the deploy ID.
2. Smoke check right after deployment (HTTPS address): home page lists offers; `#/oferty` filters work; sign in as Anna Kowalska, apply to "AI Product Manager", submit; sign in as Karolina Wiśniewska and open the application (Odpowiedź / CV / Karta wkładu); reload keeps data; a direct hash link such as `#/app/settings` opens; browser devtools show no requests to other hosts and no console errors; check one phone-width view.
3. Rollback: if the smoke check fails, use "Publish deploy" (Netlify) or "Instant Rollback / Promote" (Vercel) on the previous working deploy, then fix forward in Git. No database or migration rollback exists; saved scenarios in visitors' browsers stay compatible (`version: 1`).
4. Errors: build and deploy logs in the hosting dashboard plus reports from participants. Runtime browser errors are deliberately not collected (no external requests, no telemetry); accepted by the owner on 2026-11-12.

## Validation

See the report and the final `./scripts/verify` result recorded there.
