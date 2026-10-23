// Managed function runtime patches are independent of the build's NODE_VERSION.
export function hasBrotliSecurityFix(version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) return false
  const [major, minor, patch] = version.split('.').map(Number)
  const floor = { 22: [23, 4], 24: [22, 1], 26: [12, 1] }[major]
  return !!floor && (minor > floor[0] || (minor === floor[0] && patch >= floor[1]))
}
