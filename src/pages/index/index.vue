<template>
  <view class="page">
    <!-- Hero 区域 -->
    <view class="hero">
      <view class="hero-grid"></view>
      <view class="hero-crosshair"></view>
      <view class="hero-content">
        <view class="hero-badge">
          <view class="badge-dot"></view>
          <!-- #ifdef MP-WEIXIN -->
          <text>资料 · 图鉴 · 参考</text>
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <text>专业 · 品质 · 信赖</text>
          <!-- #endif -->
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="hero-title">印刷配件资料库</view>
        <view class="hero-title hero-title-accent">海德堡 · 小森 · 罗兰</view>
        <view class="hero-desc">印刷机配件规格参数速查</view>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <view class="hero-title">领航印刷机配件</view>
        <view class="hero-title hero-title-accent">工业一站式采购平台</view>
        <view class="hero-desc">海德堡 · 小森 · 罗兰 全系配件</view>
        <!-- #endif -->
        <view class="hero-search">
          <view class="search-icon">
            <view class="search-icon-circle"></view>
            <view class="search-icon-line"></view>
          </view>
          <input
            class="search-input"
            placeholder="搜索配件名称，如：胶辊、墨刀片"
            v-model="keyword"
            @confirm="goSearch"
          />
          <view class="search-btn" @tap="goSearch">
            <text>搜索</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 品牌分类 -->
    <view class="section brand-section">
      <view class="section-header">
        <view class="section-title-wrap">
          <view class="section-title-line"></view>
          <view class="section-title">品牌分类</view>
        </view>
        <view class="section-more" @tap="goAllCategory">
          <text>查看全部</text>
          <view class="arrow-right">
            <view class="arrow-line"></view>
            <view class="arrow-tip"></view>
          </view>
        </view>
      </view>
      <view class="brand-grid">
        <view
          class="brand-card"
          v-for="(b, i) in brands"
          :key="b.id"
          :style="{ animationDelay: i * 0.12 + 's' }"
          @tap="goCategory(b.name)"
        >
          <view class="brand-card-top" :class="'brand-bg-' + b.id">
            <image
              class="brand-image"
              :src="b.image"
              mode="aspectFill"
              :alt="b.name"
            />
            <view class="brand-card-pattern"></view>
          </view>
          <view class="brand-card-body">
            <view class="brand-name">{{ b.name }}</view>
            <view class="brand-desc">{{ b.desc }}</view>
            <view class="brand-link">
              <text>查看配件</text>
              <view class="arrow-right small">
                <view class="arrow-line"></view>
                <view class="arrow-tip"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门配件 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-wrap">
          <view class="section-title-line"></view>
          <!-- #ifdef MP-WEIXIN -->
          <view class="section-title">热门配件</view>
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <view class="section-title">热门推荐</view>
          <!-- #endif -->
        </view>
        <view class="section-more" @tap="goAllCategory">
          <text>更多配件</text>
          <view class="arrow-right">
            <view class="arrow-line"></view>
            <view class="arrow-tip"></view>
          </view>
        </view>
      </view>
      <view class="product-grid">
        <view
          class="product-card"
          v-for="(p, i) in hotProducts"
          :key="p.id"
          :style="{ animationDelay: i * 0.1 + 's' }"
          @tap="goProduct(p.id)"
        >
          <view class="product-img">
            <image v-if="p.image" class="product-img-real" :src="p.image" mode="aspectFill" lazy-load />
            <view class="product-img-deco" v-if="!p.image">
              <view class="deco-circle"></view>
              <view class="deco-cross"></view>
            </view>
            <text class="product-img-char" v-if="!p.image">{{ p.name[0] }}</text>
            <view class="product-tag">{{ p.category }}</view>
          </view>
          <view class="product-info">
            <view class="product-name">{{ p.name }}</view>
            <view class="product-spec">{{ p.spec }}</view>
            <view class="product-bottom">
              <text class="product-price">{{ p.price }}</text>
              <text class="product-brand-tag">{{ p.brand }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- #ifndef MP-WEIXIN -->
    <!-- 优势区 -->
    <view class="section advantage-section">
      <view class="section-header center">
        <view class="section-title-wrap">
          <view class="section-title">为什么选择我们</view>
        </view>
      </view>
      <view class="advantage-grid">
        <view class="advantage-item" v-for="(item, i) in advantages" :key="item.title">
          <view class="advantage-icon">
            <view v-if="i === 0" class="icon-svg">
              <view class="icon-shield"></view>
            </view>
            <view v-if="i === 1" class="icon-svg">
              <view class="icon-layers"></view>
            </view>
            <view v-if="i === 2" class="icon-svg">
              <view class="icon-bolt"></view>
            </view>
            <view v-if="i === 3" class="icon-svg">
              <view class="icon-headset"></view>
            </view>
          </view>
          <view class="advantage-title">{{ item.title }}</view>
          <view class="advantage-desc">{{ item.desc }}</view>
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import { fetchProducts, getConfig } from '@/utils/api'

const config = getConfig()

export default {
  data() {
    return {
      keyword: '',
      brands: config.brands.filter(b => b.name !== '通用'),
      hotProducts: [],
      advantages: [
        { title: '原厂品质', desc: '全部配件经过严格质检' },
        { title: '品牌齐全', desc: '覆盖主流印刷机品牌' },
        { title: '快速发货', desc: '下单后24小时内发出' },
        { title: '专业服务', desc: '10年行业经验团队' }
      ]
    }
  },
  async onShow() {
    const products = await fetchProducts()
    this.hotProducts = products.filter(p => p.hot)
  },
  methods: {
    goSearch() {
      if (this.keyword.trim()) {
        uni.redirectTo({ url: `/pages/redirect/redirect?keyword=${this.keyword}` })
      }
    },
    goCategory(brand) {
      uni.redirectTo({ url: `/pages/redirect/redirect?brand=${brand}` })
    },
    goAllCategory() {
      uni.switchTab({ url: '/pages/category/category' })
    },
    goProduct(id) {
      uni.navigateTo({ url: `/pages/product/product?id=${id}` })
    }
  }
}
</script>

<style scoped>
.page {
  background: var(--surface);
  min-height: 100vh;
}

/* ========== Hero ========== */
.hero {
  background: var(--slate-900);
  padding: 80rpx 40rpx 110rpx;
  position: relative;
  overflow: hidden;
}

/* Blueprint grid */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(184,115,51,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184,115,51,0.07) 1px, transparent 1px);
  background-size: 60rpx 60rpx;
}

/* Crosshair decoration */
.hero-crosshair {
  position: absolute;
  top: 60rpx;
  right: 60rpx;
  width: 120rpx;
  height: 120rpx;
  opacity: 0.15;
}

.hero-crosshair::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1rpx;
  background: var(--copper);
}

.hero-crosshair::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1rpx;
  background: var(--copper);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  font-size: 22rpx;
  color: var(--copper-light);
  letter-spacing: 4rpx;
  margin-bottom: 28rpx;
}

.badge-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: var(--copper);
  box-shadow: 0 0 12rpx var(--copper-glow);
}

.hero-title {
  font-size: 56rpx;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -1rpx;
}

.hero-title-accent {
  color: var(--copper-light);
  margin-top: 4rpx;
}

.hero-desc {
  font-size: 26rpx;
  color: var(--slate-400);
  margin-top: 20rpx;
  letter-spacing: 2rpx;
}

.hero-search {
  display: flex;
  align-items: center;
  margin-top: 44rpx;
  background: var(--slate-800);
  border: 1rpx solid var(--slate-700);
  border-radius: 12rpx;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.hero-search:focus-within {
  border-color: var(--copper);
}

.search-icon {
  width: 44rpx;
  height: 44rpx;
  margin-left: 28rpx;
  position: relative;
  flex-shrink: 0;
}

.search-icon-circle {
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid var(--slate-400);
  border-radius: 50%;
  position: absolute;
  top: 6rpx;
  left: 6rpx;
}

.search-icon-line {
  width: 12rpx;
  height: 2rpx;
  background: var(--slate-400);
  position: absolute;
  bottom: 10rpx;
  right: 6rpx;
  transform: rotate(45deg);
}

.search-input {
  flex: 1;
  padding: 26rpx 20rpx;
  font-size: 28rpx;
  color: #fff;
}

.search-btn {
  background: var(--copper);
  color: #fff;
  padding: 26rpx 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  letter-spacing: 2rpx;
  transition: background 0.2s ease;
}

.search-btn:active {
  background: var(--copper-dark);
}

/* ========== Section ========== */
.section {
  padding: 48rpx 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.section-header.center {
  justify-content: center;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.section-title-line {
  width: 4rpx;
  height: 28rpx;
  background: var(--copper);
  border-radius: 2rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--slate-900);
  letter-spacing: -0.5rpx;
}

.section-more {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: var(--copper);
  font-weight: 500;
}

.arrow-right {
  display: flex;
  align-items: center;
  position: relative;
  width: 28rpx;
  height: 14rpx;
}

.arrow-right.small {
  width: 22rpx;
  height: 12rpx;
}

.arrow-line {
  width: 100%;
  height: 2rpx;
  background: var(--copper);
}

.arrow-tip {
  position: absolute;
  right: 0;
  width: 12rpx;
  height: 12rpx;
  border-top: 2rpx solid var(--copper);
  border-right: 2rpx solid var(--copper);
  transform: rotate(45deg);
}

.arrow-right.small .arrow-tip {
  width: 10rpx;
  height: 10rpx;
}

/* ========== Brand Cards ========== */
.brand-grid {
  display: flex;
  gap: 20rpx;
}

.brand-card {
  flex: 1;
  background: var(--surface-raised);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  cursor: pointer;
}

.brand-card:hover {
  transform: translateY(-6rpx);
  box-shadow: 0 12rpx 40rpx rgba(0,0,0,0.08);
}

.brand-card-top {
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
  z-index: 0;
}

.brand-bg-heidelberg {
  background: linear-gradient(135deg, #B87333, #8B5A2B);
}

.brand-bg-komori {
  background: linear-gradient(135deg, #3D7A5A, #2A5C40);
}

.brand-bg-roland {
  background: linear-gradient(135deg, #4A6FA5, #355080);
}

.brand-card-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%);
  background-size: 24rpx 24rpx;
  z-index: 1;
}

.brand-monogram {
  font-size: 48rpx;
  font-weight: 800;
  color: rgba(255,255,255,0.9);
  z-index: 2;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
}

.brand-card-body {
  padding: 24rpx 20rpx;
}

.brand-name {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--slate-900);
}

.brand-desc {
  font-size: 22rpx;
  color: var(--slate-400);
  margin-top: 6rpx;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 16rpx;
  font-size: 22rpx;
  color: var(--copper);
  font-weight: 500;
  opacity: 0;
  transform: translateY(8rpx);
  transition: all 0.3s ease;
}

.brand-card:hover .brand-link {
  opacity: 1;
  transform: translateY(0);
}

/* ========== Product Cards ========== */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.product-card {
  width: calc(50% - 10rpx);
  background: var(--surface-raised);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-6rpx);
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.1);
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

.deco-cross {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.deco-cross::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 1rpx;
  background: var(--slate-900);
  top: 50%;
}

.deco-cross::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 1rpx;
  background: var(--slate-900);
  left: 50%;
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
}

.product-info {
  padding: 24rpx;
}

.product-name {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--slate-900);
}

.product-spec {
  font-size: 22rpx;
  color: var(--slate-400);
  margin-top: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
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
  padding: 4rpx 14rpx;
  border-radius: 6rpx;
  border: 1rpx solid var(--slate-100);
}

/* ========== Advantage ========== */
.advantage-section {
  background: var(--surface-raised);
  margin-top: 16rpx;
  border-top: 1rpx solid var(--slate-100);
}

.advantage-grid {
  display: flex;
  gap: 16rpx;
}

.advantage-item {
  flex: 1;
  text-align: center;
  padding: 28rpx 12rpx;
  transition: transform 0.3s ease;
}

.advantage-item:hover {
  transform: translateY(-4rpx);
}

.advantage-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, var(--copper), var(--copper-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18rpx;
  box-shadow: 0 4rpx 16rpx var(--copper-glow);
}

.icon-svg {
  width: 36rpx;
  height: 36rpx;
  position: relative;
}

/* Shield icon */
.icon-shield {
  width: 28rpx;
  height: 32rpx;
  border: 3rpx solid #fff;
  border-radius: 4rpx 4rpx 16rpx 16rpx;
  position: absolute;
  top: 2rpx;
  left: 4rpx;
}

/* Layers icon */
.icon-layers {
  position: absolute;
  inset: 0;
}

.icon-layers::before {
  content: '';
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  right: 4rpx;
  height: 10rpx;
  border: 2rpx solid #fff;
  border-radius: 3rpx;
}

.icon-layers::after {
  content: '';
  position: absolute;
  top: 12rpx;
  left: 2rpx;
  right: 2rpx;
  height: 10rpx;
  border: 2rpx solid #fff;
  border-radius: 3rpx;
}

/* Bolt icon */
.icon-bolt {
  width: 16rpx;
  height: 28rpx;
  position: absolute;
  top: 4rpx;
  left: 10rpx;
  background: #fff;
  clip-path: polygon(50% 0%, 100% 45%, 60% 45%, 70% 100%, 0% 50%, 40% 50%, 30% 0%);
}

/* Headset icon */
.icon-headset {
  width: 30rpx;
  height: 24rpx;
  border: 3rpx solid #fff;
  border-bottom: none;
  border-radius: 16rpx 16rpx 0 0;
  position: absolute;
  top: 2rpx;
  left: 3rpx;
}

.advantage-title {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--slate-900);
}

.advantage-desc {
  font-size: 20rpx;
  color: var(--slate-400);
  margin-top: 6rpx;
}

/* ========== Animations ========== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== Responsive ========== */
@media screen and (min-width: 768px) {
  .hero {
    padding: 120rpx 80rpx 150rpx;
  }

  .hero-title {
    font-size: 80rpx;
  }

  .section {
    padding: 64rpx 80rpx;
    max-width: 1200px;
    margin: 0 auto;
  }

  .product-card {
    width: calc(25% - 15rpx);
  }

  .product-img {
    height: 320rpx;
  }

  .advantage-grid {
    gap: 32rpx;
  }
}
</style>
