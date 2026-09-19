# Marketing security review — 2026-09-19

Repository: Trovaraa/trovara. Base: 5fc5fd6cbf767b43e7a54b2df9081bf0e9be4d1f.

## Findings addressed

1. **Markdown parser denial of service:** upgrade markdown-it 14.3.1 to 14.3.2. The upstream patch bounds mismatched smartquote opener processing; exposure depends on use of smartquotes and attacker-controlled Markdown. See the [14.3.2 changelog](https://raw.githubusercontent.com/markdown-it/markdown-it/14.3.2/CHANGELOG.md) and [15.0.2 backported fix](https://raw.githubusercontent.com/markdown-it/markdown-it/15.0.2/CHANGELOG.md).
2. **Preview-to-production proxy isolation:** existing lockdown ran only in the explicit GitHub preview deployment path. Add automatic npm postbuild enforcement for Netlify deploy-preview/branch-deploy and GitHub pull_request builds. Deny careers application submission and policy endpoints before the public careers wildcard; retain job listing reads. Production/local builds remain unchanged. Explicit invocation remains idempotent.

## Shared security hardening

- Verify the Gitleaks Linux release archive against a pinned official SHA-256 before extracting or executing it.
- Remove whole-directory secret-scan exclusions for documentation, tests and source. Keep only exact non-secret identifiers (and, in OS, a path-bound deterministic test fixture).
- Add executable scanner regression tests with disposable random canaries in formerly excluded paths.
- Update SHA-pinned CodeQL to 4.38.0 and OSV Scanner Action to 2.6.0. OSV 2.6.0 includes fail-closed behavior for incomplete scans; see its [release notes](https://github.com/google/osv-scanner-action/releases/tag/v2.6.0).

## Scan evidence and limits

GitHub reported **zero open Dependabot vulnerability alerts and zero open code-scanning alerts** for each of Trovaraa/trovara, trovara-os and trovara-shop on 2026-09-19. Native GitHub secret scanning was disabled; the repositories do run custom Gitleaks CI.

Gitleaks 8.30.1 scanned all history reachable from origin/main with the tightened configuration: no confirmed leaked credentials. OS initially flagged non-secret advisory identifiers and a deterministic encryption fixture, now covered by narrow allowlists. Canary regression checks pass in all three repositories.

Dependencies were installed with lifecycle scripts disabled. Lockfile review found registry.npmjs.org HTTPS origins and integrity hashes, with no unexpected external origins. npm registry signature verification passed for 540 marketing, 792 OS and 292 shop packages (1,624 total), with 159, 229 and 84 provenance attestations respectively. Installed lifecycle hooks were limited to esbuild's Node installer. Signatures establish package provenance/integrity, not absence of malicious behavior.

Static indicator review found no common downloader-and-shell, encoded execution, miner, reverse-shell or TLS-disable patterns in the reviewed tracked source/configuration. This is not an exhaustive security audit or a guarantee that all malware/vulnerabilities are absent. Production hosts, container images, databases and private runtime configuration were not audited or changed.

## Change boundaries

ClamAV 1.5.3 ran in a disposable, unprivileged container with read-only mounts of the three review worktrees. Freshclam updated the daily database from 28080 to 28128 before scanning. Aggregate result: 1,042 files scanned, **zero infected files**, 3,628,071 known signatures. Dependency and build-output subdirectories were excluded; dependencies received the separate audit/signature checks above. No files were uploaded to an external malware-analysis service.

Prepared on a new branch from the latest origin/main observed at review start. No production deployment, merge, alert dismissal, original Dependabot PR closure, applicant-data access or email action is part of this change. Re-run GitHub checks before merging.

## Existing Dependabot PRs

- [#52](https://github.com/Trovaraa/trovara/pull/52): grouped npm update. This change covers the markdown-it security patch, not the unrelated autoprefixer update.
- [#53](https://github.com/Trovaraa/trovara/pull/53): CodeQL update, included here.

## Validation

- 33 application/function/preview tests and 2 scanner safeguard tests passed.
- Lint, typecheck and production build passed.
- Explicit deploy-preview postbuild verified application denials precede the wildcard proxy.
- npm audit: zero known vulnerabilities after update.

## Deployment warning

The live marketing careers form is on unmerged feat/enable-talent-intake-20260914 (fe8b5d5), not main. Reconcile that feature before a later production deployment; deploying this main-based branch alone could remove the live form. This PR does not deploy it.
