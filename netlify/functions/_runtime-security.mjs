// Managed function runtime patches are independent of the build's NODE_VERSION.
export function hasBrotliSecurityFix(version) {
  // This release is validated only on Node 24; a patched different major is
  // not sufficient to verify that the requested runtime migration happened.
  if (!/^24\.\d+\.\d+$/.test(version)) return false
  const [, minor, patch] = version.split('.').map(Number)
  return minor > 22 || (minor === 22 && patch >= 1)
}
