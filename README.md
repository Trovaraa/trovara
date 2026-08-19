# Trovara Marketing Site

Vue 3 + TypeScript + Vite site for [Trovara Farm](https://trovara.farm).

Brand assets live under `public/brand/` (marks, lockups, social cards) and
`public/icons/`. Product photography is under `public/images/products/`; team
and farm photos under `public/images/team/` and related folders.

## Setup

```bash
nvm use   # Node 22
npm ci
npm run dev
```

Use [VS Code](https://code.visualstudio.com/) with
[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
(disable Vetur). Type-check with `vue-tsc` / the Volar TypeScript Vue plugin.

## Journal publishing

Admins write and publish Journal posts from Trovara OS. Marketing builds read the
published-post API configured by `JOURNAL_API_URL`, download public cover images,
and bundle the posts into the static site, RSS feed, and sitemap.

- Production endpoint: `https://os.trovara.farm/public/journal`
- Generated post data: `src/content/generated-posts/` (gitignored)
- Generated cover images: `public/images/journal-generated/` (gitignored)
- Existing Markdown in `src/content/posts/` remains supported during migration.

Set `NETLIFY_JOURNAL_BUILD_HOOK` on the Trovara OS API to the Netlify build hook
for this site. Publishing, unpublishing, or updating a live post then starts a
fresh marketing build. Local builds use repository posts only unless
`JOURNAL_API_URL` is explicitly set.

## Contact and product waitlists

Contact and product-waitlist submissions use the same-origin
`/.netlify/functions/contact` and `/.netlify/functions/waitlist` endpoints.
Those functions validate and rate-limit requests before sending purpose-specific
lead records to Trovara OS through the server-only `MARKETING_LEADS_API_URL`
(required; missing → HTTP 503). Production sets it in
`netlify.toml` `[context.production.environment]`. Configure the same
server-only `FORM_PROXY_SIGNING_SECRET` in Netlify and Trovara OS so forwarded
requests retain a signed per-visitor rate-limit identity.

For local development, plain `npm run dev` serves
`/.netlify/functions/contact|waitlist|newsletter` via Vite middleware (defaults
`MARKETING_LEADS_API_URL` / `NEWSLETTER_API_URL` to local OS `:3000`). Override
those env vars if needed. `npm run dev:netlify` remains available for a full
Netlify-like stack. Do not add a `VITE_` prefix or call Trovara OS directly from
browser code.

## Newsletter

Newsletter subscribe, confirm, and unsubscribe requests go through the
same-origin `/.netlify/functions/newsletter` proxy. The function requires
server-only `NEWSLETTER_API_URL` (no hardcoded production fallback — preview
deploys fail closed with 503 if unset). Production sets it in
`netlify.toml` `[context.production.environment]`.

For local development, `npm run dev` is enough (see Contact section). Do not add
`VITE_` to `NEWSLETTER_API_URL`, and do not configure a Resend API key in the
marketing site: Trovara OS owns subscriber records and email delivery
credentials.

## Local lot / careers / moments proxies

Production `public/_redirects` sends same-origin public API proxies to
`https://os.trovara.farm` (`/lot-api`, `/careers-api`, `/moments-api`,
`/brand-api`, `/journal-api`). Customer accounts live on
`https://shop.trovara.farm` — marketing no longer proxies `/shop-api`.

For local testing against Trovara OS on `:3000`:

```bash
# Option A — Vite (lot + contact/waitlist/newsletter functions)
npm run dev
# → http://127.0.0.1:4173
#    /lot-api → 127.0.0.1:3000/public/lots
#    /.netlify/functions/* → local Netlify function handlers
# If the SPA stays blank with "504 Outdated Optimize Dep" in the console:
#   rm -rf node_modules/.vite && npm run dev

# Option B — netlify dev on :8888 (full Netlify-like stack)
npm run dev:netlify
# builds, rewrites dist/_redirects to 127.0.0.1:3000, then netlify dev
```

If you build manually, rewrite proxies before `netlify dev`:

```bash
JOURNAL_API_URL=http://127.0.0.1:3000/public/journal npm run build
node scripts/point-shop-proxy-local.mjs
NEWSLETTER_API_URL=http://127.0.0.1:3000/public/newsletter \
MARKETING_LEADS_API_URL=http://127.0.0.1:3000/public/leads \
npx --yes netlify-cli@27 dev --dir dist --port 8888
```

Without that rewrite step, `netlify dev` will still send Journal / Moments /
Brand Kit traffic to **production**.

## Security headers (CSP / HSTS)

Canonical Netlify security headers live only in `netlify.toml` `[[headers]]`.
Do not add `public/_headers` — that duplicate was removed to avoid dual-source
drift.
