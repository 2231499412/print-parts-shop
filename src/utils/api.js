import staticProducts from '@/static/data/products.json'
import staticConfig from '@/static/data/config.json'

// #ifdef MP-WEIXIN
const IS_MP = true
// #endif
// #ifndef MP-WEIXIN
const API_BASE = ''
const IS_MP = false
// #endif

// #ifndef MP-WEIXIN
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

export function cloudCall() {
  return Promise.reject(new Error('仅支持小程序端'))
}

export function uploadImage() {
  return Promise.reject(new Error('仅支持小程序端'))
}

export function deleteCloudFile() {
  return Promise.resolve()
}
// #endif

// #ifdef MP-WEIXIN
export function cloudCall(action, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'products',
      data: { action, ...data },
      success: res => resolve(res.result),
      fail: err => reject(err)
    })
  })
}

// 云存储图片临时URL缓存
const urlCache = new Map()

async function resolveCloudImage(fileID) {
  if (!fileID || !fileID.startsWith('cloud://')) return fileID
  if (urlCache.has(fileID)) return urlCache.get(fileID)
  try {
    const res = await wx.cloud.getTempFileURL({ fileList: [fileID] })
    const url = res.fileList[0].tempFileURL
    urlCache.set(fileID, url)
    return url
  } catch {
    return fileID
  }
}

export async function uploadImage(filePath) {
  const ext = filePath.split('.').pop() || 'jpg'
  const cloudPath = 'products/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext
  const res = await wx.cloud.uploadFile({ cloudPath, filePath })
  return res.fileID
}

export async function deleteCloudFile(fileID) {
  if (!fileID || !fileID.startsWith('cloud://')) return
  try {
    await wx.cloud.deleteFile({ fileList: [fileID] })
  } catch (e) {
    console.warn('删除云文件失败:', e)
  }
}
// #endif

function normalizeProduct(p) {
  if (!p) return p
  if (p.image_data && p.image_data.startsWith('data:')) {
    p.image = p.image_data
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
    // #ifdef MP-WEIXIN
    const list = await cloudCall('list')
    if (Array.isArray(list) && list.length > 0) {
      const result = await Promise.all(list.map(normalizeProductMp))
      productsCache = result
      productsCacheTime = now
      return result
    }
    // #endif
    // #ifndef MP-WEIXIN
    const data = await request('/products')
    if (Array.isArray(data) && data.length > 0) {
      const result = data.map(normalizeProduct)
      productsCache = result
      productsCacheTime = now
      return result
    }
    // #endif
    return staticProducts
  } catch {
    return staticProducts
  }
}

export function clearProductsCache() {
  productsCache = null
  productsCacheTime = 0
  productDetailCache.clear()
  // #ifdef MP-WEIXIN
  urlCache.clear()
  // #endif
}

// 单品详情缓存
const productDetailCache = new Map()

export async function fetchProduct(id) {
  const cached = productDetailCache.get(id)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }
  try {
    // #ifdef MP-WEIXIN
    const item = await cloudCall('get', { id })
    if (item && item._id) {
      const result = await normalizeProductMp(item)
      productDetailCache.set(id, { data: result, time: Date.now() })
      return result
    }
    // #endif
    // #ifndef MP-WEIXIN
    const data = await request(`/products?id=${id}`)
    if (data && data.id) {
      const result = normalizeProduct(data)
      productDetailCache.set(id, { data: result, time: Date.now() })
      return result
    }
    // #endif
    return staticProducts.find(p => p.id === id) || null
  } catch {
    return staticProducts.find(p => p.id === id) || null
  }
}

// #ifdef MP-WEIXIN
async function normalizeProductMp(p) {
  if (!p) return p
  // 云存储图片解析为临时URL
  if (p.image && p.image.startsWith('cloud://')) {
    p.image = await resolveCloudImage(p.image)
  }
  if (!Array.isArray(p.variants)) p.variants = []
  // 兼容前端：用 _id 作为 id
  p.id = p._id
  return p
}
// #endif

export function getConfig() {
  return staticConfig
}
