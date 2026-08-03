# Trovara Marketing Site (Vue 3 + TypeScript + Vite)

Marketing site for [Trovara Farm](https://trovara.farm). Brand assets (logo, icons, photography, infographics) live under `public/` - e.g. `public/images/trovara-brand.png` and `public/trovara-github-icon.png`.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

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
`netlify.toml` `[context.production.environment]`.

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

## Local shop / lot API proxy

Production `public/_redirects` sends `/shop-api` and `/lot-api` to
`https://os.trovara.farm`. That is correct for Netlify deploys.

For local testing against Trovara OS on `:3000`:

```bash
# Option A — Vite (shop + contact/waitlist/newsletter functions)
npm run dev
# → http://localhost:5173
#    /shop-api → 127.0.0.1:3000/shop
#    /.netlify/functions/* → local Netlify function handlers

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
npx netlify dev --dir dist --port 8888
```

Without that rewrite step, `netlify dev` will still register shop accounts on
**production**.

## Security headers (CSP / HSTS)

Canonical Netlify security headers live only in `netlify.toml` `[[headers]]`.
Do not add `public/_headers` — that duplicate was removed to avoid dual-source
drift.
