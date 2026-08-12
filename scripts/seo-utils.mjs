export const BASE_URL = 'https://trovara.farm'

export function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemapXml(paths) {
  const uniquePaths = [...new Set(paths)]
  const body = uniquePaths
    .map((route) => {
      const url = `${BASE_URL}${route === '/' ? '' : route}`
      return `  <url>\n    <loc>${xmlEscape(url)}</loc>\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function injectPageMetadata(html, page) {
  const canonical = `${BASE_URL}${page.path === '/' ? '' : page.path}`
  const title = htmlEscape(page.title)
  const description = htmlEscape(page.description)
  const robots = page.robots || 'index, follow'
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${description}" />`,
    )
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`)
    .replace('</head>', `    <meta name="robots" content="${robots}" />\n    <link rel="canonical" href="${canonical}" />\n  </head>`)
}
