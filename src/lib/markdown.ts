import MarkdownIt from 'markdown-it'

const SITE_HOSTS = new Set(['trovara.farm', 'www.trovara.farm'])

function isExternalHttpLink(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false
  try {
    return !SITE_HOSTS.has(new URL(href).hostname.toLowerCase())
  } catch {
    return false
  }
}

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const defaultLinkOpen =
  markdown.renderer.rules.link_open ??
  ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options))

markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const href = tokens[index].attrGet('href')
  if (href && isExternalHttpLink(href)) {
    tokens[index].attrSet('target', '_blank')
    tokens[index].attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, index, options, env, self)
}

export function renderSafeMarkdown(source: string): string {
  return markdown.render(source)
}
