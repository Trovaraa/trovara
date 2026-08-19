import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { injectPageMetadata } from './seo-utils.mjs'

const DIST_DIR = path.resolve(process.cwd(), 'dist')

async function writeRoute(html, page) {
  const output = page.path === '/' ? path.join(DIST_DIR, 'index.html') : path.join(DIST_DIR, page.path.slice(1), 'index.html')
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, injectPageMetadata(html, page), 'utf8')
}

async function main() {
  const [html, pagesRaw] = await Promise.all([
    fs.readFile(path.join(DIST_DIR, 'index.html'), 'utf8'),
    fs.readFile(path.join(DIST_DIR, 'seo-pages.json'), 'utf8'),
  ])
  const pages = JSON.parse(pagesRaw)

  await Promise.all(pages.map((page) => writeRoute(html, page)))

  const noindexShells = [
    {
      file: 'brand-shell.html',
      path: '/brand',
      title: 'Brand pack - Trovara Farm',
      description: 'Shared Trovara Farm brand assets.',
      robots: 'noindex, nofollow',
    },
  ]
  await Promise.all(
    noindexShells.map(({ file, ...page }) =>
      fs.writeFile(path.join(DIST_DIR, file), injectPageMetadata(html, page), 'utf8'),
    ),
  )

  await fs.writeFile(
    path.join(DIST_DIR, 'lot-shell.html'),
    injectPageMetadata(html, {
      path: '/lot',
      title: 'Harvest verification - Trovara Farm',
      description: 'Verify a Trovara Farm harvest lot from its QR code or share link.',
    }),
    'utf8',
  )

  const notFound = injectPageMetadata(html, {
    path: '/404',
    title: '404 - Trovara Farm',
    description: 'The requested page could not be found on Trovara Farm.',
    robots: 'noindex, nofollow',
  })
  await fs.writeFile(path.join(DIST_DIR, '404.html'), notFound, 'utf8')
  console.log(`Prerendered ${pages.length} crawlable routes and 404 metadata.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
