// Managed function runtime patches are independent of the build's NODE_VERSION.
export function hasBrotliSecurityFix(version) {
  // This release is validated only on Node 24; a patched different major is
  // not sufficient to verify that the requested runtime migration happened.
  if (!/^24\.\d+\.\d+$/.test(version)) return false
  const [, minor, patch] = version.split('.').map(Number)
  return minor > 22 || (minor === 22 && patch >= 1)
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
