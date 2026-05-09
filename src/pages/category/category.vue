<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="back-btn" @tap="goHome">
        <view class="back-arrow"></view>
      </view>
      <view class="search-wrap">
        <view class="search-icon">
          <view class="search-icon-circle"></view>
          <view class="search-icon-line"></view>
        </view>
        <input
          class="search-input"
          placeholder="搜索产品名称"
          v-model="keyword"
          @confirm="doSearch"
        />
        <view class="search-clear" v-if="keyword" @tap="keyword = ''">
          <view class="clear-x">
            <view class="clear-line-1"></view>
            <view class="clear-line-2"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="main">
      <!-- 左侧品牌列表 -->
      <scroll-view class="brand-list" scroll-y>
        <view
          class="brand-item"
          :class="{ active: activeBrand === '全部' }"
          @tap="selectBrand('全部')"
        >
          <view class="brand-indicator all"></view>
          <text>全部</text>
        </view>
        <view
          class="brand-item"
          :class="{ active: activeBrand === b.name }"
          v-for="b in brands"
          :key="b.id"
          @tap="selectBrand(b.name)"
        >
          <view class="brand-indicator" :class="b.id"></view>
          <text>{{ b.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧产品列表 -->
      <scroll-view class="product-list" scroll-y>
        <view class="list-header">
          <text class="list-count">共 {{ filteredProducts.length }} 件产品</text>
        </view>

        <view v-if="loading && allProducts.length === 0" class="empty">
          <text class="empty-text">加载中...</text>
        </view>

        <view v-else-if="filteredProducts.length === 0" class="empty">
          <view class="empty-icon">
            <view class="empty-box">
              <view class="empty-box-lid"></view>
            </view>
          </view>
          <text class="empty-text">暂无相关产品</text>
          <text class="empty-hint">尝试更换关键词或品牌筛选</text>
        </view>

        <view
          class="product-item"
          v-for="p in filteredProducts"
          :key="p.id"
          @tap="goProduct(p.id)"
        >
          <view class="product-img">
            <image v-if="p.image" class="product-img-real" :src="p.image" mode="aspectFill" />
            <view class="product-img-deco" v-if="!p.image">
              <view class="deco-circle"></view>
            </view>
            <text class="product-img-char" v-if="!p.image">{{ p.name[0] }}</text>
          </view>
          <view class="product-info">
            <view class="product-top">
              <view class="product-name">{{ p.name }}</view>
              <view class="product-tags">
                <text class="tag-brand">{{ p.brand }}</text>
                <text class="tag-cat">{{ p.category }}</text>
              </view>
            </view>
            <view class="product-spec">{{ p.spec }}</view>
            <view class="product-bottom">
              <text class="product-price">{{ formatPrice(p.price) }}</text>
              <view class="product-detail-btn">
                <text>查看详情</text>
                <view class="arrow-right small">
                  <view class="arrow-line"></view>
                  <view class="arrow-tip"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { fetchProducts, getConfig } from '@/utils/api'

const config = getConfig()

export default {
  data() {
    return {
      keyword: '',
      activeBrand: '全部',
      brands: config.brands,
      allProducts: [],
      loading: true
    }
  },
  computed: {
    filteredProducts() {
      let list = this.allProducts
      if (this.activeBrand !== '全部') {
        list = list.filter(p => p.brand === this.activeBrand)
      }
      if (this.keyword.trim()) {
        const kw = this.keyword.trim().toLowerCase()
        list = list.filter(p =>
          p.name.toLowerCase().includes(kw) ||
          p.spec.toLowerCase().includes(kw) ||
          p.category.toLowerCase().includes(kw)
        )
      }
      return list
    }
  },
  async onLoad(options) {
    if (options.brand) this.activeBrand = options.brand
    if (options.keyword) this.keyword = options.keyword
  },
  async onShow() {
    const app = getApp()
    if (app.globalData) {
      if (app.globalData.redirectBrand) {
        this.activeBrand = app.globalData.redirectBrand
        this.keyword = ''
        app.globalData.redirectBrand = null
      }
      if (app.globalData.redirectKeyword) {
        this.keyword = app.globalData.redirectKeyword
        this.activeBrand = '全部'
        app.globalData.redirectKeyword = null
      }
    }
    this.loading = true
    this.allProducts = await fetchProducts()
    this.loading = false
  },
  methods: {
    selectBrand(name) {
      this.activeBrand = name
    },
    doSearch() {},
    formatPrice(price) {
      if (price === undefined || price === null) return '面议'
      const str = String(price).trim()
      if (str === '' || str === '面议') return '面议'
      if (/^\d+(\.\d+)?$/.test(str)) return str + '元'
      return str
    },
    goProduct(id) {
      uni.navigateTo({ url: `/pages/product/product?id=${id}` })
    },
    goHome() {
      uni.switchTab({ url: '/pages/index/index' })
    }
  }
}
</script>

<style scoped>
.page {
  background: var(--surface);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ========== 搜索栏 ========== */
.search-bar {
  padding: 20rpx 28rpx;
  background: var(--slate-900);
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}

.back-arrow {
  width: 20rpx;
  height: 20rpx;
  border-left: 3rpx solid #fff;
  border-bottom: 3rpx solid #fff;
  transform: rotate(45deg);
  margin-left: 6rpx;
}

.search-wrap {
  display: flex;
  align-items: center;
  background: var(--slate-800);
  border: 1rpx solid var(--slate-700);
  border-radius: 10rpx;
  padding: 0 20rpx;
  position: relative;
  transition: border-color 0.3s ease;
}

.search-wrap:focus-within {
  border-color: var(--copper);
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  position: relative;
  flex-shrink: 0;
}

.search-icon-circle {
  width: 16rpx;
  height: 16rpx;
  border: 2rpx solid var(--slate-400);
  border-radius: 50%;
  position: absolute;
  top: 4rpx;
  left: 4rpx;
}

.search-icon-line {
  width: 10rpx;
  height: 2rpx;
  background: var(--slate-400);
  position: absolute;
  bottom: 8rpx;
  right: 4rpx;
  transform: rotate(45deg);
}

.search-input {
  flex: 1;
  padding: 22rpx 16rpx;
  font-size: 28rpx;
  color: #fff;
}

.search-clear {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-x {
  width: 20rpx;
  height: 20rpx;
  position: relative;
}

.clear-line-1,
.clear-line-2 {
  position: absolute;
  width: 100%;
  height: 2rpx;
  background: var(--slate-400);
  top: 50%;
}

.clear-line-1 { transform: rotate(45deg); }
.clear-line-2 { transform: rotate(-45deg); }

/* ========== 主体 ========== */
.main {
  flex: 1;
  display: flex;
  height: 0;
}

/* ========== 左侧品牌 ========== */
.brand-list {
  width: 180rpx;
  background: var(--surface-raised);
  flex-shrink: 0;
  border-right: 1rpx solid var(--slate-100);
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 30rpx 22rpx;
  font-size: 26rpx;
  color: var(--slate-600);
  border-left: 4rpx solid transparent;
  transition: all 0.25s ease;
}

.brand-item.active {
  color: var(--copper);
  font-weight: 700;
  background: var(--surface);
  border-left-color: var(--copper);
}

.brand-indicator {
  width: 14rpx;
  height: 14rpx;
  border-radius: 3rpx;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.brand-item.active .brand-indicator {
  transform: rotate(45deg);
}

.brand-indicator.all { background: var(--copper); }
.brand-indicator.heidelberg { background: var(--copper); }
.brand-indicator.komori { background: #3D7A5A; }
.brand-indicator.roland { background: #4A6FA5; }
.brand-indicator.universal { background: #8B90A0; }

/* ========== 右侧产品 ========== */
.product-list {
  flex: 1;
  padding: 20rpx;
}

.list-header {
  margin-bottom: 16rpx;
}

.list-count {
  font-size: 22rpx;
  color: var(--slate-400);
  letter-spacing: 1rpx;
}

.empty {
  text-align: center;
  padding: 120rpx 0;
}

.empty-icon {
  margin: 0 auto 24rpx;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-box {
  width: 48rpx;
  height: 40rpx;
  border: 3rpx solid var(--slate-300);
  border-radius: 4rpx;
  position: relative;
}

.empty-box-lid {
  position: absolute;
  top: -12rpx;
  left: -4rpx;
  right: -4rpx;
  height: 10rpx;
  border: 3rpx solid var(--slate-300);
  border-radius: 3rpx;
}

.empty-text {
  font-size: 28rpx;
  color: var(--slate-600);
  display: block;
}

.empty-hint {
  font-size: 22rpx;
  color: var(--slate-400);
  margin-top: 8rpx;
  display: block;
}

.product-item {
  display: flex;
  align-items: center;
  background: var(--surface-raised);
  border-radius: 14rpx;
  overflow: hidden;
  margin-bottom: 18rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
  border: 1rpx solid var(--slate-100);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.product-item:hover {
  transform: translateX(6rpx);
  box-shadow: 0 8rpx 28rpx rgba(0,0,0,0.06);
  border-color: var(--copper-glow);
}

.product-img {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(145deg, var(--slate-100), var(--steel));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.product-img-deco {
  position: absolute;
  width: 120rpx;
  height: 120rpx;
  opacity: 0.05;
}

.deco-circle {
  position: absolute;
  inset: 0;
  border: 3rpx solid var(--slate-900);
  border-radius: 50%;
}

.product-img-char {
  font-size: 56rpx;
  color: var(--copper);
  font-weight: 800;
  opacity: 0.35;
  z-index: 1;
}

.product-img-real {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 0;
}

.product-info {
  flex: 1;
  padding: 22rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14rpx;
  min-width: 0;
}

.product-top {
  display: none;
}

.product-name {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--slate-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-tags {
  display: none;
}

.product-spec {
  display: none;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 28rpx;
  color: var(--copper);
  font-weight: 700;
}

.product-detail-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 22rpx;
  color: var(--copper);
  font-weight: 500;
  opacity: 0;
  transform: translateX(-10rpx);
  transition: all 0.3s ease;
}

.product-item:hover .product-detail-btn {
  opacity: 1;
  transform: translateX(0);
}

.arrow-right {
  display: flex;
  align-items: center;
  position: relative;
  width: 28rpx;
  height: 14rpx;
}

.arrow-right.small {
  width: 20rpx;
  height: 10rpx;
}

.arrow-line {
  width: 100%;
  height: 2rpx;
  background: var(--copper);
}

.arrow-tip {
  position: absolute;
  right: 0;
  width: 10rpx;
  height: 10rpx;
  border-top: 2rpx solid var(--copper);
  border-right: 2rpx solid var(--copper);
  transform: rotate(45deg);
}

/* ========== 响应式 ========== */
@media screen and (min-width: 768px) {
  .brand-list {
    width: 240rpx;
  }

  .product-list {
    padding: 28rpx;
  }

  .product-item {
    border-radius: 18rpx;
  }

  .product-info {
    justify-content: space-between;
  }

  .product-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .product-name {
    white-space: normal;
    font-size: 30rpx;
  }

  .product-tags {
    display: flex;
    gap: 8rpx;
  }

  .product-spec {
    display: block;
    font-size: 22rpx;
    color: var(--slate-400);
    margin-top: 10rpx;
  }

  .tag-brand {
    font-size: 18rpx;
    color: var(--copper);
    background: rgba(184,115,51,0.08);
    border: 1rpx solid rgba(184,115,51,0.15);
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
  }

  .tag-cat {
    font-size: 18rpx;
    color: var(--slate-400);
    background: var(--slate-50);
    border: 1rpx solid var(--slate-100);
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
  }
}
</style>
