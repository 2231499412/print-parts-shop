const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const col = db.collection('products')

const ADMIN_PASSWORD = '194821'

exports.main = async (event) => {
  const { action, id, data } = event

  switch (action) {
    case 'auth': {
      return { ok: event.password === ADMIN_PASSWORD }
    }
    case 'list': {
      const { data: list } = await col.orderBy('created_at', 'desc').limit(100).get()
      return list.map(formatProduct)
    }

    case 'get': {
      const { data: item } = await col.doc(id).get()
      return formatProduct(item)
    }

    case 'add': {
      if (!data.name) return { error: '产品名称不能为空' }
      const now = new Date().toISOString()
      const doc = {
        name: data.name,
        brand: data.brand || '',
        category: data.category || '',
        image: data.image || '',
        price: data.price || '面议',
        spec: data.spec || '',
        desc: data.desc || '',
        hot: !!data.hot,
        variants: data.variants || [],
        created_at: now,
        updated_at: now
      }
      const res = await col.add({ data: doc })
      return { _id: res._id, ...doc }
    }

    case 'update': {
      if (!id) return { error: '缺少产品ID' }
      if (!data.name) return { error: '产品名称不能为空' }
      const update = {
        name: data.name,
        brand: data.brand || '',
        category: data.category || '',
        image: data.image || '',
        price: data.price || '面议',
        spec: data.spec || '',
        desc: data.desc || '',
        hot: !!data.hot,
        variants: data.variants || [],
        updated_at: new Date().toISOString()
      }
      await col.doc(id).update({ data: update })
      return { _id: id, ...update }
    }

    case 'delete': {
      if (!id) return { error: '缺少产品ID' }
      await col.doc(id).remove()
      return { success: true }
    }

    default:
      return { error: '不支持的操作: ' + action }
  }
}

function formatProduct(p) {
  if (!p) return p
  if (!Array.isArray(p.variants)) p.variants = []
  return p
}
