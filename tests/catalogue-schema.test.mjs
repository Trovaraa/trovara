import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'
import { createPinia, setActivePinia } from 'pinia'
import { useProductsStore } from '../src/stores/products.ts'
import { buildCataloguePageSchema, buildProductInformationSchema } from '../src/lib/catalogue-schema.ts'

setActivePinia(createPinia())
const products = useProductsStore().allProducts
const published = products.filter((product) => product.available && product.id !== 'coming-soon')
const root = new URL('../', import.meta.url)

test('catalogue describes the five published information pages, not incomplete products', () => {
  const schema = buildCataloguePageSchema(products)
  assert.equal(schema['@type'], 'CollectionPage')
  assert.equal(schema.url, 'https://www.trovara.farm/products')
  assert.equal(schema.mainEntity['@type'], 'ItemList')
  assert.equal(schema.mainEntity.itemListElement.length, 5)
  assert.deepEqual(schema.mainEntity.itemListElement.map((item) => item.position), [1, 2, 3, 4, 5])
  assert.deepEqual(schema.mainEntity.itemListElement.map((item) => item.url),
    published.map((product) => `https://www.trovara.farm/products/${product.id}`))
})

test('every information page has its real description, canonical URL and existing image', async () => {
  for (const product of published) {
    const schema = buildProductInformationSchema(product)
    assert.equal(schema['@type'], 'WebPage')
    assert.equal(schema.name, `Trovara ${product.name}`)
    assert.equal(schema.description, product.description)
    assert.equal(schema.url, `https://www.trovara.farm/products/${product.id}`)
    assert.equal(schema.primaryImageOfPage.contentUrl, `https://www.trovara.farm${product.image}`)
    await access(new URL(`public${product.image}`, root))
  }
})

test('waitlists and enquiries never invent offers, prices, availability, reviews or terms', () => {
  const schemas = [buildCataloguePageSchema(products),
    ...published.flatMap((product) => [buildProductInformationSchema(product),
      buildProductInformationSchema({ ...product, waitlist: false })])]
  const serialized = JSON.stringify(schemas)
  assert.doesNotMatch(serialized, /"@type":"(?:Product|Offer|AggregateOffer|Review|AggregateRating)"/)
  assert.doesNotMatch(serialized, /"(?:offers|price|priceCurrency|availability|review|aggregateRating|shippingDetails|hasMerchantReturnPolicy)":/)
})

test('unpublished and unknown products do not emit structured data', () => {
  assert.equal(buildProductInformationSchema(), undefined)
  assert.equal(buildProductInformationSchema(products.find((p) => p.id === 'coming-soon')), undefined)
  assert.equal(buildProductInformationSchema({ ...published[0], available: false }), undefined)
  const schema = buildProductInformationSchema({ ...published[0], image: undefined })
  assert.ok(!('primaryImageOfPage' in schema))
})

test('both Vue views use the tested schema builders without inline Product or Offer markup', async () => {
  for (const [file, builder] of [['ProductsView.vue', 'buildCataloguePageSchema'],
    ['ProductDetailView.vue', 'buildProductInformationSchema']]) {
    const source = await readFile(new URL(`src/views/${file}`, root), 'utf8')
    assert.ok(source.includes(`computed(() => ${builder}(`))
    assert.doesNotMatch(source, /'@type':\s*'(?:Product|Offer)'/)
  }
})
