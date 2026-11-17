// src/lib/shopify.ts
// Shopify Storefront API client

const SHOPIFY_DOMAIN = import.meta.env.PUBLIC_SHOPIFY_DOMAIN
const SHOPIFY_TOKEN  = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION    = '2024-10'

const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`)
  const { data, errors } = await res.json()
  if (errors) throw new Error(errors[0].message)
  return data
}

// ── Products ──────────────────────────────────────────────

export async function getProducts(first = 12) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              edges { node { url altText width height } }
            }
            variants(first: 1) {
              edges { node { id availableForSale } }
            }
          }
        }
      }
    }
  `
  const data = await shopifyFetch<any>(query, { first })
  return data.products.edges.map((e: any) => e.node)
}

export async function getProduct(handle: string) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id title handle description
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 10) {
          edges { node { url altText width height } }
        }
        variants(first: 20) {
          edges { node { id title availableForSale selectedOptions { name value } } }
        }
      }
    }
  `
  const data = await shopifyFetch<any>(query, { handle })
  return data.product
}

// ── Cart ──────────────────────────────────────────────────

export async function createCart() {
  const query = `
    mutation { cartCreate { cart { id checkoutUrl } } }
  `
  const data = await shopifyFetch<any>(query)
  return data.cartCreate.cart
}

export async function addToCart(cartId: string, variantId: string, quantity = 1) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          totalQuantity
          cost { totalAmount { amount currencyCode } }
          lines(first: 20) {
            edges { node { id quantity merchandise { ... on ProductVariant { id title product { title } } } } }
          }
        }
      }
    }
  `
  const data = await shopifyFetch<any>(query, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  })
  return data.cartLinesAdd.cart
}
