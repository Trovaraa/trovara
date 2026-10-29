import type { Product } from '../types'

const BASE_URL = 'https://www.trovara.farm'

const isPublished = (product: Product) => product.available && product.id !== 'coming-soon'
const productUrl = (product: Product) => `${BASE_URL}/products/${product.id}`

// The marketing catalogue describes planned supply and enquiries, not priced
// offers. A waitlist is not a preorder. Only add Product/Offer markup when an
// actual purchasable offer, price and terms are also published on the page.
export function buildCataloguePageSchema(products: Product[]) {
  return {
    '@type': 'CollectionPage',
    name: 'Trovara Farm products',
    url: `${BASE_URL}/products`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.filter(isPublished).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `Trovara ${product.name}`,
        url: productUrl(product),
      })),
    },
  }
}

export function buildProductInformationSchema(product?: Product) {
  if (!product || !isPublished(product)) return undefined

  return {
    '@type': 'WebPage',
    name: `Trovara ${product.name}`,
    description: product.description,
    url: productUrl(product),
    about: { '@type': 'Thing', name: product.name },
    ...(product.image ? {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        contentUrl: new URL(product.image, BASE_URL).href,
        caption: product.imageAlt ?? product.name,
      },
    } : {}),
  }
}
