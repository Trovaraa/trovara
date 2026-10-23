# Search crawl and canonical repair

The serving host is `https://www.trovara.farm`; the apex redirects there with
HTTP 301. Browser metadata, build-time canonical/OG tags, organization/product/
article schema, feed links and the robots sitemap declaration now agree with
that host. No DNS, mailbox, API origin or private-route access change is needed.

Search Console's October 11 report showed zero indexed pages and a 403 on the
homepage's Googlebot smartphone crawl. The October 15 live inspection succeeded,
but that uses Google Inspection Tool, not the normal indexing crawler.
Cloudflare Security Events independently showed a Googlebot homepage GET blocked
on October 15 at 08:17:33 GMT-5 by `Block AI Search bots` (rule
`b9842cc8cb944c02be5da1814b42ed64`). This is a separate operational configuration
issue; a successful live inspection alone does not prove the block is resolved.

Operator sequence:

1. With owner approval, change only Search bot policy from Block to Allow.
   Preserve Agent Block, Training Disallow, Bot Preference Sync and all unrelated
   security settings. This category setting is zone-wide, not a host-only rule.
2. Deploy this branch through the existing workflow_dispatch production workflow.
3. Verify both hosts, generated canonicals, robots and every sitemap URL. Do not
   enable `/cgi-bin/` or private OS pages just to clear Search Console exclusions.
4. Submit `https://www.trovara.farm/sitemap.xml` in the existing domain property.
5. Live-test the canonical homepage and request indexing. This queues a request,
   not a promise of indexing or ranking. Check actual crawler access thereafter.

The deployment audit also found newly published advisories in unchanged main:
source-map-js 1.2.1 and postcss-selector-parser 7.1.5. The lockfile contains only
compatible patches to 1.2.2 and 7.1.6; no audit policy was relaxed.
