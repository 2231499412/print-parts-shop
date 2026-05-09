import staticProducts from '@/static/data/products.json'
import staticConfig from '@/static/data/config.json'

// #ifdef MP-WEIXIN
const API_BASE = 'https://177800.xyz'
const IS_MP = true
// #endif
// #ifndef MP-WEIXIN
const API_BASE = ''
const IS_MP = false
// #endif

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: API_BASE + '/api' + url,
      ...options,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail: reject
    })
  })
}

function normalizeProduct(p) {
  if (p.image_data && p.image_data.startsWith('data:')) {
    p.image = p.image_data
  } else if (p.image && p.image.startsWith('/') && IS_MP) {
    p.image = API_BASE + p.image
  }
  delete p.image_data
  if (typeof p.variants === 'string') {
    try { p.variants = JSON.parse(p.variants) } catch { p.variants = [] }
  }
  if (!Array.isArray(p.variants)) p.variants = []
  return p
}

export function getMinPrice(product) {
  const variants = product.variants || []
  if (variants.length > 0) {
    const prices = variants.map(v => parseFloat(v.price)).filter(n => !isNaN(n))
    if (prices.length > 0) return Math.min(...prices) + '元起'
  }
  return formatPrice(product.price)
}

export function formatPrice(price) {
  if (price === undefined || price === null) return '面议'
  const str = String(price).trim()
  if (str === '' || str === '面议') return '面议'
  if (/^\d+(\.\d+)?$/.test(str)) return str + '元'
  return str
}

// 产品列表缓存（5 分钟有效）
let productsCache = null
let productsCacheTime = 0
const CACHE_TTL = 5 * 60 * 1000

export async function fetchProducts() {
  const now = Date.now()
  if (productsCache && now - productsCacheTime < CACHE_TTL) {
    return productsCache
  }
  try {
    const data = await request('/products')
    if (Array.isArray(data) && data.length > 0) {
      const result = data.map(normalizeProduct)
      productsCache = result
      productsCacheTime = now
      return result
    }
    return staticProducts
  } catch {
    return staticProducts
  }
}

export function clearProductsCache() {
  productsCache = null
  productsCacheTime = 0
  productDetailCache.clear()
}

// 单品详情缓存
const productDetailCache = new Map()

export async function fetchProduct(id) {
  const cached = productDetailCache.get(id)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }
  try {
    const data = await request(`/products?id=${id}`)
    if (data && data.id) {
      const result = normalizeProduct(data)
      productDetailCache.set(id, { data: result, time: Date.now() })
      return result
    }
    return staticProducts.find(p => p.id === id) || null
  } catch {
    return staticProducts.find(p => p.id === id) || null
  }
}

export function getConfig() {
  return staticConfig
}
