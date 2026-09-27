# Security review and Dependabot consolidation — 2026-09-27

Repository: Trovaraa/trovara. Fresh branch from origin/main b4bac2c.

## Open PRs covered

- [#56](https://github.com/Trovaraa/trovara/pull/56)
- [#57](https://github.com/Trovaraa/trovara/pull/57)

Both Dependabot heads are ancestors of this branch. Their dependency and SHA-pinned CodeQL updates are consolidated without dropping existing main changes. These routine updates are not presented as fixes for unreported CVEs. Original PRs remain open pending review/merge of the consolidated change.

## Code hardening

The Netlify lead/survey proxy used fetch's default redirect-following behavior. A redirecting or misconfigured trusted upstream could cause personal form data and custom proxy-signing headers to be replayed to another destination. Set redirect: 'error' and retain the existing generic 502 response. This is fail-closed hardening; no redirect abuse or data disclosure was observed.

## Security evidence

- GitHub returned zero open Dependabot alerts and zero open code-scanning alerts for this repository at review time.
- Native GitHub secret scanning is disabled. The repository's independent Gitleaks workflow remains enabled; no repository security setting was changed.
- Lockfile-only install with lifecycle scripts disabled: npm reported zero known vulnerabilities, including development dependencies.
- Registry signature verification: 540 installed packages verified; 159 provenance attestations verified. Lockfile packages use HTTPS registry.npmjs.org origins and integrity hashes; no unexpected source origin was found. Installed lifecycle hooks were esbuild's Node installer.
- Checksum-verified Gitleaks 8.30.1 found no secrets in history reachable from the combined branch. Scanner canary tests passed without widening exclusions or weakening rules.
- Targeted static review covered form proxying, checkout destinations, authentication/CSRF boundaries, Talent farm scoping and document downloads, and common downloader/encoded-execution/TLS-disable indicators across the three repos. No additional confirmed exploit or common malware indicator was found in the reviewed paths.

## Verification and limits

35 application/function tests, 2 scanner safeguard tests, lint, typecheck and production build passed. The local build used repository content when remote SEO fetches were unavailable; generated SEO changes were excluded from this PR.

The new regression checks failed against the old redirect policy and pass with the fix. Repository checks cannot establish that every vulnerability or malware payload is absent. No fresh antivirus scan, runtime host/container audit or penetration test was performed. Production dependencies can differ from Git main; zero repository alerts does not certify the deployed server.

No production deployment, main merge, manual alert dismissal, original PR closure, applicant-data access, financial changes or email actions are included. Marketing PR automation may create its normal isolated preview; production release still requires separate approval and reconciliation with deployed overlays.

