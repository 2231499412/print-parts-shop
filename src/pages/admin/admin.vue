<template>
  <view class="page">
    <!-- 登录页 -->
    <view class="login-page" v-if="view === 'login'">
      <view class="login-back" @tap="goBack" :style="{ top: statusBarHeight + 'px' }">
        <text>← 返回首页</text>
      </view>
      <view class="login-card">
        <view class="login-icon">
          <view class="lock-body"></view>
          <view class="lock-shackle"></view>
        </view>
        <text class="login-title">管理后台</text>
        <text class="login-sub">请输入管理密码</text>
        <input
          class="login-input"
          type="text"
          password
          v-model="password"
          placeholder="输入密码"
          @confirm="doLogin"
        />
        <view class="login-btn" @tap="doLogin">
          <text>登 录</text>
        </view>
        <text class="login-hint" v-if="loginError">密码错误</text>
      </view>
    </view>

    <!-- 产品列表 -->
    <view class="list-page" v-if="view === 'list'">
      <view class="top-bar" :style="{ paddingTop: statusBarHeight + 'px', paddingRight: capsuleRight + 'px' }">
        <text class="top-title">产品管理</text>
        <view class="top-actions">
          <view class="top-btn add-btn" @tap="goAdd">
            <text>+ 添加</text>
          </view>
          <view class="top-btn logout-btn" @tap="doLogout">
            <text>退出</text>
          </view>
        </view>
      </view>

      <view class="product-list" v-if="products.length > 0">
        <view class="product-item" v-for="p in products" :key="p._id">
          <view class="item-img" v-if="p.image">
            <image :src="p.image" mode="aspectFill" class="item-img-real" />
          </view>
          <view class="item-img item-img-empty" v-else>
            <text class="item-img-char">{{ p.name[0] }}</text>
          </view>
          <view class="item-info">
            <text class="item-name">{{ p.name }}</text>
            <text class="item-meta">{{ p.brand }} · {{ p.category }}</text>
            <text class="item-price">{{ p.price || '面议' }}</text>
          </view>
          <view class="item-actions">
            <view class="action-btn edit-btn" @tap="goEdit(p)">
              <text>编辑</text>
            </view>
            <view class="action-btn del-btn" @tap="doDelete(p)">
              <text>删除</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty" v-else>
        <text class="empty-text">暂无产品，点击上方添加</text>
      </view>
    </view>

    <!-- 编辑表单 -->
    <view class="edit-page" v-if="view === 'edit'">
      <view class="top-bar" :style="{ paddingTop: statusBarHeight + 'px', paddingRight: capsuleRight + 'px' }">
        <view class="back-btn" @tap="goList">
          <text>← 返回</text>
        </view>
        <text class="top-title">{{ form._id ? '编辑产品' : '添加产品' }}</text>
        <view class="top-btn save-btn" @tap="doSave">
          <text>保存</text>
        </view>
      </view>

      <scroll-view scroll-y class="form-scroll">
        <!-- 图片上传 -->
        <view class="form-section">
          <text class="section-label">产品图片</text>
          <view class="img-upload" @tap="chooseImage">
            <image v-if="form.image" :src="form.image" mode="aspectFill" class="upload-preview" />
            <view class="upload-placeholder" v-else>
              <text class="upload-plus">+</text>
              <text class="upload-text">点击上传图片</text>
            </view>
            <view class="upload-remove" v-if="form.image" @tap.stop="removeImage">
              <text>x</text>
            </view>
          </view>
        </view>

        <!-- 基本信息 -->
        <view class="form-section">
          <text class="section-label">基本信息</text>
          <view class="form-group">
            <text class="form-label">产品名称 *</text>
            <input class="form-input" v-model="form.name" placeholder="输入产品名称" />
          </view>
          <view class="form-group">
            <text class="form-label">品牌</text>
            <picker :range="brandOptions" @change="onBrandChange" :value="brandIndex">
              <view class="form-picker">
                <text>{{ form.brand || '选择品牌' }}</text>
                <text class="picker-arrow">></text>
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">分类</text>
            <picker :range="categoryOptions" @change="onCategoryChange" :value="categoryIndex">
              <view class="form-picker">
                <text>{{ form.category || '选择分类' }}</text>
                <text class="picker-arrow">></text>
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">规格</text>
            <input class="form-input" v-model="form.spec" placeholder="如：直径80mm，适用SM系列" />
          </view>
          <view class="form-group">
            <text class="form-label">默认价格</text>
            <input class="form-input" v-model="form.price" placeholder="如：500 或 面议" />
          </view>
          <view class="form-group">
            <text class="form-label">产品描述</text>
            <textarea class="form-textarea" v-model="form.desc" placeholder="产品描述" />
          </view>
          <view class="form-group form-group-row">
            <text class="form-label">热门推荐</text>
            <switch :checked="form.hot" @change="form.hot = $event.detail.value" color="#B87333" />
          </view>
        </view>

        <!-- 型号编辑器 -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-label">型号/价格</text>
            <view class="add-variant-btn" @tap="addVariant">
              <text>+ 添加型号</text>
            </view>
          </view>
          <view class="variant-list" v-if="form.variants.length > 0">
            <view class="variant-row" v-for="(v, i) in form.variants" :key="i">
              <input class="variant-input" v-model="v.name" placeholder="型号名" />
              <input class="variant-input variant-price-input" v-model="v.price" placeholder="价格" />
              <view class="variant-del" @tap="removeVariant(i)">
                <text>x</text>
              </view>
            </view>
          </view>
          <text class="variant-hint" v-else>无型号时使用默认价格</text>
        </view>

        <view style="height: 60rpx;"></view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { cloudCall, clearProductsCache, uploadImage, deleteCloudFile } from '@/utils/api'

const BRANDS = ['海德堡', '小森', '罗兰', '通用']
const CATEGORIES = ['易损件', '耗材', '配件', '电气件', '核心部件']

export default {
  data() {
    return {
      view: 'login',
      password: '',
      loginError: false,
      products: [],
      form: {},
      brandOptions: BRANDS,
      categoryOptions: CATEGORIES,
      brandIndex: 0,
      categoryIndex: 0,
      uploading: false,
      statusBarHeight: 20,
      capsuleRight: 100
    }
  },
  onLoad() {
    try {
      const sysInfo = uni.getSystemInfoSync()
      this.statusBarHeight = sysInfo.statusBarHeight || 20
      // #ifdef MP-WEIXIN
      const capsule = wx.getMenuButtonBoundingClientRect()
      this.capsuleRight = sysInfo.windowWidth - capsule.left + 16
      // #endif
    } catch {}
    const saved = uni.getStorageSync('admin_auth')
    if (saved) {
      this.view = 'list'
      this.loadProducts()
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    async doLogin() {
      if (!this.password) return
      uni.showLoading({ title: '验证中' })
      try {
        const res = await cloudCall('auth', { password: this.password })
        uni.hideLoading()
        if (res && res.ok) {
          uni.setStorageSync('admin_auth', '1')
          this.loginError = false
          this.view = 'list'
          this.loadProducts()
        } else {
          this.loginError = true
        }
      } catch {
        uni.hideLoading()
        this.loginError = true
      }
    },
    doLogout() {
      uni.removeStorageSync('admin_auth')
      this.view = 'login'
      this.password = ''
    },
    async loadProducts() {
      uni.showLoading({ title: '加载中' })
      try {
        const list = await cloudCall('list')
        this.products = Array.isArray(list) ? list : []
        for (const p of this.products) {
          if (p.image && p.image.startsWith('cloud://')) {
            try {
              const res = await wx.cloud.getTempFileURL({ fileList: [p.image] })
              if (res.fileList[0] && res.fileList[0].tempFileURL) {
                p.image = res.fileList[0].tempFileURL
              }
            } catch {}
          }
        }
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
      uni.hideLoading()
    },
    goAdd() {
      this.form = {
        name: '', brand: '', category: '', image: '',
        price: '面议', spec: '', desc: '', hot: false, variants: []
      }
      this.brandIndex = 0
      this.categoryIndex = 0
      this.view = 'edit'
    },
    goEdit(p) {
      this.form = {
        _id: p._id,
        name: p.name || '',
        brand: p.brand || '',
        category: p.category || '',
        image: p.image || '',
        price: p.price || '面议',
        spec: p.spec || '',
        desc: p.desc || '',
        hot: !!p.hot,
        variants: Array.isArray(p.variants) ? p.variants.map(v => ({ ...v })) : []
      }
      this.brandIndex = BRANDS.indexOf(this.form.brand)
      if (this.brandIndex < 0) this.brandIndex = 0
      this.categoryIndex = CATEGORIES.indexOf(this.form.category)
      if (this.categoryIndex < 0) this.categoryIndex = 0
      this.view = 'edit'
    },
    goList() {
      this.view = 'list'
    },
    onBrandChange(e) {
      this.brandIndex = e.detail.value
      this.form.brand = BRANDS[this.brandIndex]
    },
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value
      this.form.category = CATEGORIES[this.categoryIndex]
    },
    addVariant() {
      this.form.variants.push({ name: '', price: '' })
    },
    removeVariant(i) {
      this.form.variants.splice(i, 1)
    },
    async chooseImage() {
      try {
        const res = await new Promise((resolve, reject) => {
          uni.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: resolve,
            fail: reject
          })
        })
        const filePath = res.tempFilePaths[0]
        this.uploading = true
        uni.showLoading({ title: '上传中...' })
        const fileID = await uploadImage(filePath)
        this.form.image = fileID
        uni.hideLoading()
        this.uploading = false
      } catch (e) {
        uni.hideLoading()
        this.uploading = false
      }
    },
    async removeImage() {
      if (this.form.image && this.form.image.startsWith('cloud://')) {
        await deleteCloudFile(this.form.image)
      }
      this.form.image = ''
    },
    async doSave() {
      if (!this.form.name.trim()) {
        uni.showToast({ title: '请输入产品名称', icon: 'none' })
        return
      }
      uni.showLoading({ title: '保存中...' })
      try {
        const data = {
          name: this.form.name.trim(),
          brand: this.form.brand,
          category: this.form.category,
          image: this.form.image,
          price: this.form.price || '面议',
          spec: this.form.spec,
          desc: this.form.desc,
          hot: this.form.hot,
          variants: this.form.variants.filter(v => v.name.trim())
        }
        if (this.form._id) {
          await cloudCall('update', { id: this.form._id, data })
        } else {
          await cloudCall('add', { data })
        }
        clearProductsCache()
        uni.hideLoading()
        uni.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => {
          this.view = 'list'
          this.loadProducts()
        }, 800)
      } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    doDelete(p) {
      uni.showModal({
        title: '确认删除',
        content: `确定删除「${p.name}」？`,
        success: async (res) => {
          if (!res.confirm) return
          uni.showLoading({ title: '删除中...' })
          try {
            if (p.image && p.image.startsWith('cloud://')) {
              await deleteCloudFile(p.image)
            }
            await cloudCall('delete', { id: p._id })
            clearProductsCache()
            uni.hideLoading()
            uni.showToast({ title: '已删除', icon: 'success' })
            this.loadProducts()
          } catch (e) {
            uni.hideLoading()
            uni.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F5F3EF;
}

/* ========== 登录页 ========== */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  position: relative;
}

.login-back {
  position: absolute;
  top: 0;
  left: 0;
  padding: 20rpx 28rpx;
  font-size: 28rpx;
  color: #B87333;
  font-weight: 600;
  z-index: 10;
}

.login-card {
  width: 100%;
  max-width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.08);
}

.login-icon {
  width: 80rpx;
  height: 80rpx;
  position: relative;
  margin-bottom: 32rpx;
}

.lock-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 56rpx;
  height: 42rpx;
  background: #B87333;
  border-radius: 8rpx;
}

.lock-shackle {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 36rpx;
  height: 32rpx;
  border: 4rpx solid #B87333;
  border-bottom: none;
  border-radius: 18rpx 18rpx 0 0;
}

.login-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1A1D23;
}

.login-sub {
  font-size: 24rpx;
  color: #8B90A0;
  margin-top: 8rpx;
  margin-bottom: 40rpx;
}

.login-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #E5E5E5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  margin-bottom: 24rpx;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background: #B87333;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

.login-btn:active {
  opacity: 0.85;
}

.login-hint {
  font-size: 24rpx;
  color: #E74C3C;
  margin-top: 16rpx;
}

/* ========== 顶部栏 ========== */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 28rpx;
  background: #1A1D23;
}

.top-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.top-actions {
  display: flex;
  gap: 16rpx;
}

.top-btn {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.add-btn {
  background: #B87333;
  color: #fff;
}

.logout-btn {
  background: rgba(255,255,255,0.15);
  color: #fff;
}

.back-btn {
  color: #fff;
  font-size: 26rpx;
}

.save-btn {
  background: #27AE60;
  color: #fff;
}

/* ========== 产品列表 ========== */
.product-list {
  padding: 20rpx 28rpx;
}

.product-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 14rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.item-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.item-img-real {
  width: 100%;
  height: 100%;
}

.item-img-empty {
  background: #F0EDE8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-img-char {
  font-size: 40rpx;
  font-weight: 700;
  color: #B87333;
  opacity: 0.6;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D23;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  font-size: 22rpx;
  color: #8B90A0;
  margin-top: 6rpx;
  display: block;
}

.item-price {
  font-size: 24rpx;
  color: #B87333;
  font-weight: 600;
  margin-top: 4rpx;
  display: block;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
}

.action-btn {
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 600;
  text-align: center;
}

.edit-btn {
  background: rgba(184,115,51,0.1);
  color: #B87333;
}

.del-btn {
  background: rgba(231,76,60,0.1);
  color: #E74C3C;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #8B90A0;
}

/* ========== 编辑表单 ========== */
.form-scroll {
  height: calc(100vh - 120rpx);
}

.form-section {
  margin: 20rpx 28rpx 0;
  background: #fff;
  border-radius: 14rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.section-label {
  font-size: 26rpx;
  font-weight: 700;
  color: #1A1D23;
  margin-bottom: 20rpx;
  display: block;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.form-group {
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 24rpx;
  color: #8B90A0;
  margin-bottom: 10rpx;
  display: block;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #E5E5E5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  border: 2rpx solid #E5E5E5;
  border-radius: 10rpx;
  padding: 16rpx 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-picker {
  height: 80rpx;
  border: 2rpx solid #E5E5E5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  color: #8B90A0;
  font-size: 24rpx;
}

.form-group-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-group-row .form-label {
  margin-bottom: 0;
}

/* ========== 图片上传 ========== */
.img-upload {
  width: 240rpx;
  height: 240rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
  border: 2rpx dashed #D0D0D0;
}

.upload-preview {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F8F8F8;
}

.upload-plus {
  font-size: 56rpx;
  color: #B87333;
  line-height: 1;
}

.upload-text {
  font-size: 22rpx;
  color: #8B90A0;
  margin-top: 8rpx;
}

.upload-remove {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24rpx;
}

/* ========== 型号编辑器 ========== */
.variant-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.variant-row {
  display: flex;
  gap: 12rpx;
  align-items: center;
}

.variant-input {
  flex: 1;
  height: 72rpx;
  border: 2rpx solid #E5E5E5;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 26rpx;
}

.variant-price-input {
  flex: 0.6;
}

.variant-del {
  width: 56rpx;
  height: 56rpx;
  background: rgba(231,76,60,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E74C3C;
  font-size: 28rpx;
  flex-shrink: 0;
}

.add-variant-btn {
  padding: 8rpx 20rpx;
  background: rgba(184,115,51,0.1);
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #B87333;
  font-weight: 600;
}

.variant-hint {
  font-size: 24rpx;
  color: #8B90A0;
}
</style>
