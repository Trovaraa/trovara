// Managed function runtime patches are independent of the build's NODE_VERSION.
export function hasBrotliSecurityFix(version) {
  // Netlify's managed Node 22 patch is verified independently of its Node 24
  // rollout. Both tested LTS lines must include the November 11 security release.
  const match = /^(22|24)\.(\d+)\.(\d+)$/.exec(version)
  if (!match) return false
  const [major, minor, patch] = match.slice(1).map(Number)
  const [minimumMinor, minimumPatch] = major === 22 ? [23, 5] : [22, 3]
  return minor > minimumMinor || (minor === minimumMinor && patch >= minimumPatch)
}

// Temporary support diagnostic: private logs only, for read-only requests on
// this specific preview. Never log request data, headers or environment values.
export function createPreviewRuntimeReporter({ version = process.versions.node, write = console.info } = {}) {
  let reported = false
  return (request) => {
    if (reported || request.method !== 'GET') return
    const url = new URL(request.url)
    if (url.origin !== 'https://deploy-preview-66--trovara.netlify.app') return
    reported = true
    write(JSON.stringify({ event: 'trovara_runtime_diagnostic', node: version, secure: hasBrotliSecurityFix(version) }))
  }
}
