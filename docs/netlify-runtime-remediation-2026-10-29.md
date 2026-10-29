# Netlify managed runtime remediation, 2026-10-29

The October 29 forced-rebundle preview still ran below the security gate on
Netlify's managed Node 24 line. Its build pin does not control the runtime patch.

A separate read-only preview, after setting `AWS_LAMBDA_JS_RUNTIME=nodejs22.x`
through Netlify's environment-variable API for Deploy Previews, returned actual
Node **22.23.4** with the CVE-2026-111497 patch. The probe deployment was
`6ae3d9f9d2fff9ed0ec6c8b1`; it did not publish production or submit form data.

Use Node 22.23.4 for the build and managed Functions. The runtime guard accepts
only tested Node 22 >=22.23.4 or Node 24 >=24.22.1 releases. It still rejects
vulnerable patches, prereleases and unvalidated major versions before processing
form data. The runtime smoke test remains required for all four handlers.

Before production, persist `AWS_LAMBDA_JS_RUNTIME=nodejs22.x` for the production
context using Netlify UI/CLI/API and verify a fresh Deploy Preview. This setting
must not go in `netlify.toml`; the source build pin alone is insufficient evidence.
Publish only after unit/security/build gates and the deployed runtime check pass.
Run the same read-only four-handler runtime smoke test on the published site.

Keep the existing static site, form endpoints, credentials, rate limits, consent
validation, preview proxy lockdown and upstream redirect protections. No new
hosting service, DNS change or production form submission is needed.

Return to a newer major only after its actual managed patch and application
compatibility are verified. Do not remove the runtime floor to accommodate a
provider rollout.
