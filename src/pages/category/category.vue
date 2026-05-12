<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="back-btn" @tap="goHome">
        <view class="back-arrow"></view>
      </view>
      <view class="search-wrap search-wrap-mobile">
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
        <view class="search-btn" @tap="doSearch">
          <text>搜索</text>
        </view>
      </view>
      <view class="search-wrap search-wrap-pc">
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

    <!-- 手机端：顶部品牌标签 -->
    <scroll-view class="brand-tabs" scroll-x :show-scrollbar="false">
      <view
        class="brand-tab"
        :class="{ active: activeBrand === '全部' }"
        @tap="selectBrand('全部')"
      >全部</view>
      <view
        class="brand-tab"
        :class="{ active: activeBrand === b.name }"
        v-for="b in brands"
        :key="b.id"
        @tap="selectBrand(b.name)"
      >{{ b.name }}</view>
    </scroll-view>

    <view class="main">
      <!-- PC 端：左侧品牌列表 -->
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

      <!-- 产品区域 -->
      <scroll-view class="product-area" scroll-y>
        <view class="list-header">
          <text class="list-count">共 {{ filteredProducts.length }} 件产品</text>
        </view>

        <!-- 加载中 -->
        <view v-if="loading && allProducts.length === 0" class="empty">
          <text class="empty-text">加载中...</text>
        </view>

        <!-- 空状态 -->
        <view v-if="!loading && filteredProducts.length === 0" class="empty">
          <view class="empty-icon">
            <view class="empty-box">
              <view class="empty-box-lid"></view>
            </view>
          </view>
          <text class="empty-text">暂无相关产品</text>
          <text class="empty-hint">尝试更换关键词或品牌筛选</text>
        </view>

        <!-- 手机端：网格卡片 -->
        <view class="product-grid" v-if="filteredProducts.length > 0">
          <view
            class="product-card"
            v-for="p in filteredProducts"
            :key="p.id"
          >
            <view class="product-card-inner" @tap="goProduct(p.id)">
              <view class="product-img">
                <image v-if="p.image" class="product-img-real" :src="p.image" mode="aspectFill" lazy-load />
                <view class="product-img-deco" v-if="!p.image">
                  <view class="deco-circle"></view>
                </view>
                <text class="product-img-char" v-if="!p.image">{{ p.name[0] }}</text>
                <view class="product-tag">{{ p.category }}</view>
              </view>
              <view class="product-info">
                <view class="product-name">{{ p.name }}</view>
                <view class="product-spec">{{ p.spec || ' ' }}</view>
                <view class="product-bottom">
                  <text class="product-price">{{ getMinPrice(p) }}</text>
                  <text class="product-brand-tag">{{ p.brand }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- PC 端：列表卡片 -->
        <view class="product-list" v-if="filteredProducts.length > 0">
          <view
            class="product-item"
            v-for="p in filteredProducts"
            :key="'pc-' + p.id"
            @tap="goProduct(p.id)"
          >
            <view class="product-item-img">
              <image v-if="p.image" class="product-item-img-real" :src="p.image" mode="aspectFill" lazy-load />
              <view class="product-item-img-deco" v-if="!p.image">
                <view class="deco-circle"></view>
              </view>
              <text class="product-item-img-char" v-if="!p.image">{{ p.name[0] }}</text>
            </view>
            <view class="product-item-info">
              <view class="product-item-top">
                <view class="product-item-name">{{ p.name }}</view>
                <view class="product-item-tags">
                  <text class="tag-brand">{{ p.brand }}</text>
                  <text class="tag-cat">{{ p.category }}</text>
                </view>
              </view>
              <view class="product-item-spec">{{ p.spec }}</view>
              <view class="product-item-bottom">
                <text class="product-item-price">{{ getMinPrice(p) }}</text>
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
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { fetchProducts, getConfig, getMinPrice } from '@/utils/api'

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
  onShareAppMessage() {
    return {
      title: '印刷配件分类 - 海德堡·小森·罗兰配件速查',
      path: '/pages/category/category'
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
    getMinPrice(product) {
      return getMinPrice(product)
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
  border-radius: 12rpx;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.search-wrap:focus-within {
  border-color: var(--copper);
}

.search-wrap-mobile {
  flex: 1;
}

.search-wrap-pc {
  display: none;
}

.search-icon {
  width: 44rpx;
  height: 44rpx;
  margin-left: 20rpx;
  position: relative;
  flex-shrink: 0;
}

.search-icon-circle {
  width: 18rpx;
  height: 18rpx;
  border: 2rpx solid var(--slate-400);
  border-radius: 50%;
  position: absolute;
  top: 5rpx;
  left: 5rpx;
}

.search-icon-line {
  width: 10rpx;
  height: 2rpx;
  background: var(--slate-400);
  position: absolute;
  bottom: 9rpx;
  right: 5rpx;
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
  flex-shrink: 0;
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

.search-btn {
  background: var(--copper);
  color: #fff;
  padding: 22rpx 32rpx;
  font-size: 28rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.search-btn:active {
  background: var(--copper-dark);
}

/* ========== 手机端品牌标签 ========== */
.brand-tabs {
  white-space: nowrap;
  padding: 20rpx 28rpx 0;
}

.brand-tab {
  display: inline-block;
  padding: 12rpx 28rpx;
  margin-right: 16rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  color: var(--slate-600);
  background: var(--surface-raised);
  border: 1rpx solid var(--slate-100);
  border-radius: 32rpx;
  transition: all 0.25s ease;
}

.brand-tab.active {
  color: #fff;
  background: var(--copper);
  border-color: var(--copper);
  font-weight: 700;
}

/* ========== 主体 ========== */
.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ========== PC 端左侧品牌 ========== */
.brand-list {
  display: none;
}

/* ========== 产品区域 ========== */
.product-area {
  flex: 1;
  padding-bottom: 40rpx;
}

.list-header {
  padding: 0 28rpx;
  margin-bottom: 16rpx;
}

.list-count {
  font-size: 22rpx;
  color: var(--slate-400);
  letter-spacing: 1rpx;
}

/* ========== 手机端网格卡片 ========== */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 12rpx;
}

.product-card {
  width: 50%;
  padding: 0 8rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}

.product-card-inner {
  background: var(--surface-raised);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
  border: 1rpx solid var(--slate-100);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.product-card-inner:hover {
  transform: translateY(-6rpx);
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.1);
  border-color: var(--copper-glow);
}

.product-img {
  height: 280rpx;
  background: linear-gradient(145deg, var(--slate-100), var(--steel));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-img-deco {
  position: absolute;
  width: 160rpx;
  height: 160rpx;
  opacity: 0.06;
}

.deco-circle {
  position: absolute;
  inset: 0;
  border: 3rpx solid var(--slate-900);
  border-radius: 50%;
}

.product-img-char {
  font-size: 72rpx;
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

.product-tag {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  font-size: 20rpx;
  color: var(--copper);
  background: rgba(184,115,51,0.1);
  border: 1rpx solid rgba(184,115,51,0.2);
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  font-weight: 500;
  z-index: 2;
}

.product-info {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--slate-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-spec {
  font-size: 22rpx;
  color: var(--slate-400);
  margin-top: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-height: 30rpx;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16rpx;
}

.product-price {
  font-size: 28rpx;
  color: var(--copper);
  font-weight: 700;
}

.product-brand-tag {
  font-size: 20rpx;
  color: var(--slate-400);
  background: var(--slate-50);
  border: 1rpx solid var(--slate-100);
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

/* ========== PC 端列表卡片（默认隐藏） ========== */
.product-list {
  display: none;
}

/* ========== 空状态 ========== */
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

/* ========== PC 端响应式 ========== */
@media screen and (min-width: 768px) {
  .search-wrap-mobile {
    display: none;
  }

  .search-wrap-pc {
    display: flex;
    flex: 1;
  }

  .brand-tabs {
    display: none;
  }

  .brand-list {
    display: block;
    width: 240rpx;
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

  .product-area {
    overflow-y: auto;
    padding: 20rpx 28rpx;
  }

  .product-grid {
    display: none;
  }

  .product-list {
    display: block;
  }

  .product-item {
    display: flex;
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

  .product-item-img {
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

  .product-item-img-deco {
    position: absolute;
    width: 120rpx;
    height: 120rpx;
    opacity: 0.05;
  }

  .product-item-img-char {
    font-size: 56rpx;
    color: var(--copper);
    font-weight: 800;
    opacity: 0.35;
    z-index: 1;
  }

  .product-item-img-real {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .product-item-info {
    flex: 1;
    padding: 22rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .product-item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .product-item-name {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--slate-900);
  }

  .product-item-tags {
    display: flex;
    gap: 8rpx;
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

  .product-item-spec {
    font-size: 22rpx;
    color: var(--slate-400);
    margin-top: 10rpx;
  }

  .product-item-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14rpx;
  }

  .product-item-price {
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
}
</style>
