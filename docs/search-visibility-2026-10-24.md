# Search visibility review — 24 October 2026

## Findings

- The live marketing product-detail pages emit `Product` / `Offer` JSON-LD
  with `PreOrder` and NGN currency but no price or product image. The visible
  pages explicitly describe waitlists, not orders. The catalogue also emits
  incomplete Product entities. This is incorrect rich-result markup, not
  evidence that the whole website has disappeared from Google's index.
- Search Console's Merchant listings and Product snippets reports, last updated
  22 October, currently show zero affected items for the emailed issues. This
  does not establish that the live markup is fixed: the malformed offer was
  independently reproduced on the live coconut page.
- The sole example in the `noindex` exclusion report is
  `https://shop.trovara.farm/`. Shop is the customer Accounts SPA, with email
  verification, password reset and credit-claim routes. Its deliberate
  `noindex, nofollow` stays unchanged. Public marketing pages remain indexable.
- URL Inspection for `https://www.trovara.farm/` reports **URL is on Google**
  and **Page is indexed**. The old 403 examples are homepage host/protocol
  variants, `/?SA` and two `/cgi-bin/` variants. Public HTTP rechecks now end
  in 200 for homepages and 404 for the nonexistent CGI paths. These HTTP
  checks alone do not establish access by every Google crawler.

## Fix

- Describe the marketing catalogue as a `CollectionPage` containing an
  `ItemList` of links to the five published information pages.
- Describe each detail page as a `WebPage`, with its real description,
  canonical URL and existing image as `primaryImageOfPage`.
- Do not invent prices, ratings, reviews, shipping charges, return policies,
  stock or preorder availability. Product/Offer rich-result eligibility should
  be introduced only when real offer details are also published visibly.
- Keep all public routes, waitlist forms, organization schema and intentional
  account/newsletter/private-page indexing exclusions unchanged.

## Verification and release boundary

- 58 tests pass, including five new tests covering every catalogue entry,
  existing image files, hidden entries, absent images, no fabricated commerce
  properties and Vue integration. Lint, TypeScript and production build pass.
- Built-site browser checks confirm WebPage and CollectionPage JSON-LD,
  canonical www URLs and `index, follow`, including client-side navigation.
- No real form submissions, customer records, mail or security settings changed.
- The preview Functions runtime still returns
  `X-Trovara-Runtime-Secure: false` on 24 October. Production must not be
  published from this branch until all four runtime smoke checks pass.
  The runtime guard is unchanged; no claim that this SEO fix is live yet.
- A fresh dependency audit also reports two newly affected build dependencies:
  fast-uri (moderate) and serialize-javascript (low). They are not changed in
  this SEO-only patch and need rechecking/remediation before the release.

## Follow-up after a safe deployment

Verify the rendered live catalogue and all five detail pages, then use Search
Console validation if the product issues have affected examples again. Do not
submit a false fix for Shop's intentional exclusion. Google recrawling and
ranking changes are not immediate or guaranteed.

References:
- https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
