# Dependency and PR maintenance — 2026-10-28

PR #66 already incorporates the npm updates from #64, the pinned GitHub Actions updates from #65, and the SEO changes from #63. All are mergeable against current main. Existing patched runtime requirements, schema fixes and preview security gates are retained.

## Removing the unpatched deepmerge build dependency

[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) affects deepmerge 4.2.0–4.3.1; the registry has no patched release as of this review. It enters through vite-plugin-pwa → workbox-build → @rollup/plugin-node-resolve 16.0.3. That resolver uses it once to clone its static JSON-compatible defaults: `deepMerge({}, defaults)`.

The override is scoped to **@rollup/plugin-node-resolve@16.0.3 only** and substitutes the published, integrity-pinned `lodash.merge@4.6.2` package. The lockfile records the real name and artifact; no advisory is ignored and no vulnerable code is renamed. This is not a global drop-in replacement: lodash.merge mutates its first argument and merges arrays by index. These differences do not affect cloning the resolver defaults into an empty target. Tests verify the installed resolver's single call, cloned defaults and prototype-poisoning resistance. The production build exercises Workbox service-worker generation. Re-review or remove the override when the resolver changes.

Validation: 61 tests, lint, typecheck and production build pass on Node 24.22.1. Full and production audits report zero findings; 496 registry signatures and 165 attestations verify. The build generates the service worker and prerenders 26 routes.

Marketing's existing production release is not changed by this PR update. A successful build is not proof of a patched Netlify Functions runtime. The runtime smoke check must still pass before production publication; the fail-closed guard remains in place.
