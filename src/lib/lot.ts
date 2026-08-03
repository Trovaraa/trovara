/**
 * Public lot API base.
 * Default is same-origin `/lot-api` (Vite/Netlify proxy → Trovara OS `/public/lots`).
 * Override with VITE_LOT_API_URL only for direct cross-origin calls (also needs CORS).
 */
const LOT_API_BASE = (import.meta.env.VITE_LOT_API_URL || '/lot-api').replace(/\/+$/, '')

/** Absolute OS origin for certificate HTML (stays on OS). */
const OS_ORIGIN = (
  import.meta.env.VITE_PUBLIC_OS_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:5173' : 'https://os.trovara.farm')
).replace(/\/+$/, '')

export type PublicLot = {
  lotCode: string
  productName: string
  quantityKg: number
  unit?: string
  harvestedAt: string
  plotName?: string | null
  cropType?: string | null
  publicNotes?: string | null
  preparedFor?: string | null
  orderReference?: string | null
  farm: { slug?: string | null; name: string; location?: string | null }
}

export type PublicLotResponse = {
  lot: PublicLot
  verified: boolean
}

export type PublicLotError = {
  message: string
  code?: string
  pendingVerification: boolean
}

export async function fetchPublicLot(
  farmSlug: string,
  lotCode: string,
): Promise<{ ok: true; data: PublicLotResponse } | { ok: false; error: PublicLotError }> {
  const path = `/${encodeURIComponent(farmSlug)}/${encodeURIComponent(lotCode)}`
  try {
    const response = await fetch(`${LOT_API_BASE}${path}`)
    const body = (await response.json().catch(() => ({}))) as PublicLotResponse & {
      error?: string
      code?: string
    }
    if (!response.ok) {
      const message = body.error || 'Lot not found'
      const code = body.code
      const pendingVerification =
        code === 'pending_verification' ||
        /being prepared|pending verification|once the farm confirms/i.test(message)
      return {
        ok: false,
        error: { message, code, pendingVerification },
      }
    }
    return { ok: true, data: { lot: body.lot, verified: body.verified } }
  } catch {
    return {
      ok: false,
      error: {
        message: 'Could not reach the farm verification service. Please try again shortly.',
        pendingVerification: false,
      },
    }
  }
}

export function publicLotCertificateUrl(farmSlug: string, lotCode: string): string {
  return `${OS_ORIGIN}/public/lots/${encodeURIComponent(farmSlug)}/${encodeURIComponent(lotCode)}/certificate.html`
}

export function celebrationSymbolsForProduct(productName: string): string[] {
  const product = productName.toLowerCase()

  if (product.includes('plantain') || product.includes('banana')) {
    return ['🍌', '🌿', '🍌', '🌱', '🍌', '🌿', '🍌', '🌱', '🍌', '🌿']
  }
  if (product.includes('coconut')) {
    return ['🥥', '🌴', '🥥', '🌿', '🥥', '🌴', '🥥', '🌱', '🥥', '🌴']
  }
  if (product.includes('egg')) {
    return ['🥚', '🐣', '🥚', '🌿', '🥚', '🐣', '🥚', '🌱', '🥚', '🐣']
  }
  if (product.includes('chicken') || product.includes('poultry') || product.includes('broiler')) {
    return ['🐔', '🌿', '🐔', '🌱', '🐔', '🌿', '🐔', '🌱', '🐔', '🌿']
  }
  if (product.includes('palm') || product.includes('oil')) {
    return ['🌴', '🟠', '🌴', '🌿', '🟠', '🌴', '🟠', '🌱', '🌴', '🟠']
  }

  return ['🌱', '🌿', '✨', '🌾', '🌱', '🌿', '✨', '🌾', '🌱', '🌿']
}
