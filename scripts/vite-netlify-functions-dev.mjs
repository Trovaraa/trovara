/**
 * Vite middleware that serves contact / waitlist / newsletter Netlify Functions
 * under `/.netlify/functions/*` during plain `npm run dev`.
 *
 * Defaults lead/newsletter API bases to local Trovara OS when unset.
 */
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HANDLERS = {
  contact: resolve(root, 'netlify/functions/contact.mjs'),
  waitlist: resolve(root, 'netlify/functions/waitlist.mjs'),
  newsletter: resolve(root, 'netlify/functions/newsletter.mjs'),
}

function ensureLocalOsEnv() {
  process.env.MARKETING_LEADS_API_URL ||= 'http://127.0.0.1:3000/public/leads'
  process.env.NEWSLETTER_API_URL ||= 'http://127.0.0.1:3000/public/newsletter'
}

async function loadHandler(name) {
  const path = HANDLERS[name]
  if (!path) return null
  const mod = await import(`${pathToFileURL(path).href}?t=${Date.now()}`)
  return typeof mod.default === 'function' ? mod.default : null
}

export function netlifyFunctionsDevPlugin() {
  return {
    name: 'trovara-netlify-functions-dev',
    configureServer(server) {
      ensureLocalOsEnv()
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        const match = url.match(/^\/\.netlify\/functions\/(contact|waitlist|newsletter)\/?$/)
        if (!match) return next()

        try {
          ensureLocalOsEnv()
          const handler = await loadHandler(match[1])
          if (!handler) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'Function handler missing.' }))
            return
          }

          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = Buffer.concat(chunks)
          const host = req.headers.host || 'localhost:5173'
          const request = new Request(`http://${host}${req.url}`, {
            method: req.method || 'GET',
            headers: req.headers,
            body: ['GET', 'HEAD'].includes(req.method || 'GET') ? undefined : body,
          })

          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            res.setHeader(key, value)
          })
          const text = await response.text()
          res.end(text)
        } catch (error) {
          console.error('[vite-netlify-functions]', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Function failed.' }))
        }
      })
    },
  }
}
