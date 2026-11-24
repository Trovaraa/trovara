# Dependency and runtime maintenance 2026-11-24

This branch starts at current main `1565395` and retains the deployed PR 66
baseline `ebdb0a2`, including SEO, redirect trust, preview proxy lockdown and
fail-closed managed Functions checks. It merges Dependabot PR 69. PR 65's Actions
updates and PR 63's SEO changes are already ancestors of the deployed baseline.

The grouped update alone still contains vulnerable Glob 13 and Minimatch 10.
The direct Glob pin and existing transitive override now use `14.0.6`, which
contains the cancellation fix in `14.0.2` and resolves Minimatch `11.0.9`.
The updated TypeScript ESLint dependency also resolves Minimatch 11. Regression
checks reject all Glob copies below `14.0.2` and affected Minimatch 7-10 copies.
The real PWA/Workbox production build remains part of validation because the
Glob override crosses a major version in that build chain.

The reviewed Rollup resolver-only `lodash.merge` alias remains unchanged. Its
call-pattern, clone-semantics and prototype-safety regressions still apply; see
the October 28 maintenance note. No advisory or scanner exclusions were added.
The old bot scan's Picomatch finding, GHSA-fc5q-39xc-vjpf, was withdrawn by the
GitHub Advisory Database on November 18 as not a security issue.

Builds now pin Node `22.23.5`. Managed Functions accept only stable Node
22 >=22.23.5 or Node 24 >=24.22.3, covering the November 11 security releases as
well as the earlier Brotli fix. Previous stable patches, prereleases and other
majors remain rejected. The `nodejs22.x` managed selector is preserved; build
success does not establish the managed Functions patch. A fresh read-only GET
to all four preview handlers must return HTTP 405 with
`X-Trovara-Runtime-Secure: true` before production deployment.

Local validation passed after a clean script-disabled install: 62 tests on each
of Node 22.23.5 and 24.22.3, lint, typecheck, the production Vite/Workbox/prerender
build, and full plus production npm audits with zero known findings. npm verified
510 registry signatures and 178 attestations. The build-generated journal index
change was reviewed and restored because it is unrelated source content.

References:

- https://github.com/advisories/GHSA-3g3m-2fjr-6pw4
- https://github.com/advisories/GHSA-g3hv-75wg-m249
- https://github.com/advisories/GHSA-fc5q-39xc-vjpf
- https://nodejs.org/en/blog/release/v22.23.5
- https://nodejs.org/en/blog/release/v24.22.3
