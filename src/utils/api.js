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
  return p
}

export async function fetchProducts() {
  try {
    const data = await request('/products')
    if (Array.isArray(data) && data.length > 0) {
      return data.map(normalizeProduct)
    }
    return staticProducts
  } catch {
    return staticProducts
  }
}

export async function fetchProduct(id) {
  try {
    const data = await request(`/products?id=${id}`)
    if (data && data.id) {
      return normalizeProduct(data)
    }
    return staticProducts.find(p => p.id === id) || null
  } catch {
    return staticProducts.find(p => p.id === id) || null
  }
}

export function getConfig() {
  return staticConfig
}
