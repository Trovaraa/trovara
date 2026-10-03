# Pipeline security repair — 2026-10-03

## Findings

The latest Marketing main pipeline (`91d2558`) passed on September 28, before the
current dependency advisories. A fresh audit on October 3 found seven affected
package entries (six high, one moderate). The deployment job only audited runtime
dependencies, leaving the build-tool dependency graph out of that check.

The red OS and Shop Dependabot runs fail dependency audits, not application
compilation. Their consolidated fixes are already green in
[OS #67](https://github.com/Trovaraa/trovara-os/pull/67) at `9e184ba` and
[Shop #22](https://github.com/Trovaraa/trovara-shop/pull/22) at `c851d37`.
Older failed runs remain in history; neither those PRs nor the original bot PRs
have been merged or closed by this repair.

## Marketing changes

- Upgrade Tailwind 3.4.19 to 4.3.3 and use its PostCSS integration, eliminating the
  `braces` / `micromatch` / `fast-glob` build chain. The
  [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) has no patched
  release, so an override is not an adequate remediation.
- Update nested `brace-expansion` and `fast-uri` resolutions to patched releases.
- Add an all-dependency high-severity audit alongside the existing production
  audit. Security checks are not disabled, filtered or made non-blocking.
- Add lockfile regression tests for the removed vulnerable chain and patched
  transitive dependency floors.
- Migrate the existing theme and utility names, retain brand colors and dark
  mode, explicitly scope content scanning to application sources, and add Vue
  stylesheet references for Journal components. Preserve border, placeholder,
  button-cursor and dialog defaults; adapt dark gradients/shadows to v4 variables.

The [Tailwind v4 browser baseline](https://tailwindcss.com/docs/upgrade-guide) is
Safari 16.4+, Chrome 111+ and Firefox 128+, matching the OS/Shop migration.

## Verification

- Clean `npm ci --ignore-scripts`: passed.
- `npm test`: 38 passed, including three dependency regression tests.
- Lint, typecheck and production build: passed.
- All-dependency and production npm audits: zero known vulnerabilities.
- Registry verification: 499 verified signatures, 164 verified attestations.
- Local Chromium before/after checks: six routes (home, products, career detail,
  Journal index/article and contact), 390px/1440px, light/dark — 48 passing cases,
  no page errors or horizontal overflow. Journal input interaction checked;
  representative screenshots reviewed. Small typography/spacing differences
  follow v4 line-height and spacing behavior; no claim of pixel-identical output.
- Browser requests used synthetic API fixtures; no forms submitted, records
  changed, emails sent or production application data accessed. Local builds
  used repository Journal content; generated SEO differences were not committed.

This is a dependency/pipeline repair, not a new full malware or host audit.
No main merge or production deployment is included. The standard PR workflow
may publish its normal isolated Netlify preview.
