const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 现有产品数据（从 D1 seed.sql 导出）
const products = [
  { name: '胶辊', brand: '海德堡', category: '易损件', image: '', price: '面议', spec: '直径80mm，适用SM系列', desc: '耐磨耐高温，原厂品质，适配海德堡全系印刷机', hot: true, variants: [] },
  { name: '墨刀片', brand: '海德堡', category: '耗材', image: '', price: '面议', spec: '原厂规格，适用CD102', desc: '优质钢材，精准刮墨，寿命长', hot: false, variants: [] },
  { name: '橡皮布', brand: '海德堡', category: '耗材', image: '', price: '面议', spec: '全张规格，适用SM74/CD102', desc: '高弹性，耐溶剂，印刷清晰', hot: true, variants: [] },
  { name: '递纸牙', brand: '海德堡', category: '配件', image: '', price: '面议', spec: '适用SM系列', desc: '精密铸造，咬合精准', hot: false, variants: [] },
  { name: '水辊', brand: '小森', category: '易损件', image: '', price: '面议', spec: '直径60mm，适用L系列', desc: '均匀传水，耐腐蚀', hot: false, variants: [] },
  { name: '墨键电机', brand: '海德堡', category: '电气件', image: '', price: '面议', spec: '步进电机，适用CP2000', desc: '精确控制墨量，响应快', hot: false, variants: [] },
  { name: '收纸链条', brand: '罗兰', category: '核心部件', image: '', price: '面议', spec: '适用700系列', desc: '高强度合金，耐磨耐用', hot: false, variants: [] },
  { name: '定位销', brand: '通用', category: '配件', image: '', price: '面议', spec: '标准规格，多品牌通用', desc: '精确定位，保证套准精度', hot: true, variants: [] }
]

exports.main = async () => {
  const col = db.collection('products')

  // 检查是否已有数据
  const { total } = await col.count()
  if (total > 0) {
    return { message: '数据已存在，跳过迁移', count: total }
  }

  // 批量写入
  const now = new Date().toISOString()
  for (const p of products) {
    await col.add({
      data: { ...p, created_at: now, updated_at: now }
    })
  }

  return { message: '迁移完成', count: products.length }
}
