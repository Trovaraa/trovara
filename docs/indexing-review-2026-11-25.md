# Google indexing review — 25 November 2026

Search Console property: `sc-domain:trovara.farm`, verified as hello@trovara.farm.
The aggregate report is dated 15 November: 40 indexed, 26 excluded URLs.
Individual inspections can be newer than that report.

## Findings and fixes

- The 19 November notice identifies `/careers/` as an alternate canonical.
  Inspection now reports it indexed following the 24 November crawl. Its
  recorded canonical was the homepage, while the live test identifies careers.
- Netlify redirects the prerendered paths without a trailing slash to the
  equivalent directory URL. The sitemap, initial canonical and client metadata
  disagreed. One shared canonical builder now uses those final slash URLs in
  the sitemap, HTML, client metadata, product schema and journal article/feed URLs.
- Vue Router initially exposes START_LOCATION before resolving a deep link.
  Applying that metadata replaced the prerendered title/canonical with homepage
  metadata. Preserve server metadata until navigation succeeds; failed navigation
  must not change it either.
- `/farm-os` and `/farm-advisory` were missing from generated pages and the
  sitemap, returning actual HTTP 404 despite existing client routes/navigation.
  Include both in the build's static route metadata.

## Other exclusions

| Report category | Examples and disposition |
| --- | --- |
| Page with redirect (10) | Palm oil, three journal articles, moments, wholesale one-pager, products, services, about and farm analyst. Each currently redirects to its trailing-slash URL. Sitemap and canonical now advertise the destination. The old redirect URLs should remain excluded. |
| Crawled, currently not indexed (7) | Plantain without a slash redirects to its slash destination. Six homepage variants with `?ND`, `?NA`, `?SA` or `?MA` are duplicates; keep their canonical pointing to the clean homepage. |
| Discovered, currently not indexed (1) | Project Canopy vacancy without a slash; its final slash URL belongs in the sitemap. Eligibility is not a guarantee Google will index it. |
| Historical 403 (6) | Apex/HTTP homepage variants now redirect to HTTPS www. `?SA` now returns 200. Both CGI directory variants end at a real 404, appropriate for nonexistent pages. Existing validation began 24 October; do not restart an active validation or weaken bot protections. |
| Historical noindex (1) | Shop homepage's stored crawl is 17 October, before the existing fix. Public response now sends `X-Robots-Tag: index, follow`. The 25 November Google live test confirms available/indexable. Private account pages remain noindex. Existing validation began 25 October. |

No invented product prices, reviews, job dates or business content; no changes
to authentication, private-page exclusions, Cloudflare protections or email.

## Validation before release

- 64 automated tests; lint and TypeScript checks pass on Node 22.23.5.
- Full dependency audit reports zero vulnerabilities.
- Production build succeeds. All 30 locally generated sitemap URLs have matching
  canonical HTML, a trailing slash and no public-page noindex; both service pages
  are present. Published feed content can change the count during CI builds.
- Regression tests exercise initial routing, slash/query/hash variants, failed
  navigation, overrides and preservation of private noindex metadata.
- Deployment requires the existing CI/security and Netlify runtime gates.
