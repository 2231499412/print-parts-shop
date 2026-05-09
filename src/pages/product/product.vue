<template>
  <view class="page" v-if="product">
    <!-- 产品图片 -->
    <view class="img-box">
      <image v-if="product.image" class="img-real" :src="product.image" mode="aspectFit" @tap="previewImage" />
      <view class="img-grid" v-if="!product.image"></view>
      <view class="img-deco" v-if="!product.image">
        <view class="deco-crosshair">
          <view class="ch-h"></view>
          <view class="ch-v"></view>
        </view>
      </view>
      <text class="img-text" v-if="!product.image">{{ product.name }}</text>
      <view class="img-badge">{{ product.category }}</view>
    </view>

    <!-- 产品信息 -->
    <view class="info-card">
      <view class="name">{{ product.name }}</view>
      <view class="price-row">
        <text class="price">{{ displayPrice }}</text>
      </view>
      <!-- 型号选择器 -->
      <view class="variant-picker" v-if="hasVariants">
        <text class="variant-label">型号</text>
        <view class="variant-options">
          <view
            class="variant-tag"
            :class="{ active: selectedVariant === v }"
            v-for="v in product.variants"
            :key="v.name"
            @tap="selectVariant(v)"
          >
            <text>{{ v.name }}</text>
            <text class="variant-price">{{ formatPrice(v.price) }}</text>
          </view>
        </view>
      </view>
      <view class="meta">
        <text class="tag tag-brand">{{ product.brand }}</text>
        <text class="tag tag-cat">{{ product.category }}</text>
      </view>
    </view>

    <!-- 规格参数 -->
    <view class="detail-card">
      <view class="card-title">
        <view class="card-title-bar"></view>
        <text>规格参数</text>
      </view>
      <view class="spec-table">
        <view class="spec-row" v-for="(item, i) in specList" :key="i">
          <text class="spec-label">{{ item.label }}</text>
          <view class="spec-divider"></view>
          <text class="spec-value">{{ item.value }}</text>
        </view>
      </view>
    </view>

    <!-- 产品描述 -->
    <view class="detail-card">
      <view class="card-title">
        <view class="card-title-bar"></view>
        <text>产品介绍</text>
      </view>
      <view class="desc">{{ product.desc }}</view>
    </view>

    <!-- 底部占位 -->
    <view style="height: 140rpx;"></view>

    <!-- #ifndef MP-WEIXIN -->
    <!-- 底部联系栏（H5） -->
    <view class="bottom-bar">
      <view class="btn btn-wechat" @tap="copyWechat">
        <view class="btn-icon-wrap">
          <view class="icon-wechat"></view>
        </view>
        <text>复制微信</text>
      </view>
      <view class="btn btn-phone" @tap="callPhone">
        <view class="btn-icon-wrap">
          <view class="icon-phone"></view>
        </view>
        <text>拨打电话</text>
      </view>
      <view class="btn btn-qr" @tap="showQrcode">
        <view class="btn-icon-wrap">
          <view class="icon-qr"></view>
        </view>
        <text>微信二维码</text>
      </view>
    </view>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <!-- 底部联系栏（小程序） -->
    <view class="bottom-bar">
      <view class="bottom-bar-info">
        <text class="bottom-bar-tip">如有数据疑问或意见反馈</text>
      </view>
      <view class="btn btn-phone" @tap="callPhone">
        <view class="btn-icon-wrap">
          <view class="icon-phone"></view>
        </view>
        <text>18938663681</text>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import { fetchProduct, getConfig, formatPrice } from '@/utils/api'

const config = getConfig()

export default {
  data() {
    return {
      product: null,
      specList: [],
      selectedVariant: null
    }
  },
  computed: {
    displayPrice() {
      if (this.selectedVariant) {
        return formatPrice(this.selectedVariant.price)
      }
      return this.product ? formatPrice(this.product.price) : '面议'
    },
    hasVariants() {
      return this.product && this.product.variants && this.product.variants.length > 0
    }
  },
  async onLoad(options) {
    const id = parseInt(options.id)
    this.product = await fetchProduct(id)
    if (this.product) {
      if (this.product.variants && this.product.variants.length > 0) {
        this.selectedVariant = this.product.variants[0]
      }
      this.specList = [
        { label: '产品名称', value: this.product.name },
        { label: '规格', value: this.product.spec },
        { label: '适配品牌', value: this.product.brand },
        { label: '产品分类', value: this.product.category }
      ]
    }
  },
  methods: {
    selectVariant(v) {
      this.selectedVariant = v
    },
    previewImage() {
      if (this.product && this.product.image) {
        uni.previewImage({ urls: [this.product.image] })
      }
    },
    formatPrice(price) {
      return formatPrice(price)
    },
    copyWechat() {
      uni.setClipboardData({
        data: config.wechat,
        success() {
          uni.showToast({ title: '微信号已复制', icon: 'success' })
        }
      })
    },
    callPhone() {
      uni.makePhoneCall({ phoneNumber: config.phone })
    },
    showQrcode() {
      uni.previewImage({ urls: [config.qrcode] })
    }
  }
}
</script>

<style scoped>
.page {
  background: var(--surface);
  min-height: 100vh;
}

/* ========== 产品图片 ========== */
.img-box {
  height: 520rpx;
  background: #f5f3ef;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.img-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(184,115,51,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184,115,51,0.06) 1px, transparent 1px);
  background-size: 60rpx 60rpx;
}

.img-deco {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  opacity: 0.08;
}

.deco-crosshair {
  position: relative;
  width: 100%;
  height: 100%;
}

.ch-h {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1rpx;
  background: var(--copper);
}

.ch-v {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1rpx;
  background: var(--copper);
}

.img-text {
  font-size: 100rpx;
  color: var(--copper);
  font-weight: 800;
  opacity: 0.25;
  z-index: 1;
  letter-spacing: -2rpx;
}

.img-real {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 0;
}

.img-badge {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  font-size: 22rpx;
  color: var(--copper-light);
  background: rgba(184,115,51,0.15);
  border: 1rpx solid rgba(184,115,51,0.3);
  padding: 8rpx 22rpx;
  border-radius: 6rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
  backdrop-filter: blur(10px);
}

/* ========== 产品信息卡 ========== */
.info-card {
  background: var(--surface-raised);
  margin: -40rpx 28rpx 0;
  border-radius: 18rpx;
  padding: 36rpx;
  position: relative;
  z-index: 1;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);
  border: 1rpx solid var(--slate-100);
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.name {
  font-size: 38rpx;
  font-weight: 800;
  color: var(--slate-900);
  letter-spacing: -0.5rpx;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-top: 16rpx;
}

.price-label {
  font-size: 22rpx;
  color: var(--slate-400);
  letter-spacing: 1rpx;
}

.price {
  font-size: 34rpx;
  color: var(--copper);
  font-weight: 700;
}

.meta {
  display: flex;
  gap: 14rpx;
  margin-top: 20rpx;
}

.variant-picker {
  margin-top: 20rpx;
}

.variant-label {
  font-size: 22rpx;
  color: var(--slate-400);
  display: block;
  margin-bottom: 12rpx;
}

.variant-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.variant-tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: var(--slate-600);
  background: var(--slate-50);
  border: 2rpx solid var(--slate-100);
  transition: all 0.2s ease;
  cursor: pointer;
}

.variant-tag.active {
  color: var(--copper);
  border-color: var(--copper);
  background: rgba(184,115,51,0.06);
}

.variant-price {
  font-size: 22rpx;
  color: var(--copper);
  font-weight: 600;
}

.tag {
  font-size: 22rpx;
  padding: 8rpx 18rpx;
  border-radius: 6rpx;
  font-weight: 500;
}

.tag-brand {
  color: var(--copper);
  background: rgba(184,115,51,0.08);
  border: 1rpx solid rgba(184,115,51,0.15);
}

.tag-cat {
  color: var(--slate-600);
  background: var(--slate-50);
  border: 1rpx solid var(--slate-100);
}

/* ========== 详情卡片 ========== */
.detail-card {
  background: var(--surface-raised);
  margin: 20rpx 28rpx 0;
  border-radius: 18rpx;
  padding: 36rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
  border: 1rpx solid var(--slate-100);
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 14rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: var(--slate-900);
  margin-bottom: 28rpx;
}

.card-title-bar {
  width: 4rpx;
  height: 28rpx;
  background: var(--copper);
  border-radius: 2rpx;
}

.spec-table {
  border: 1rpx solid var(--slate-100);
  border-radius: 10rpx;
  overflow: hidden;
}

.spec-row {
  display: flex;
  align-items: center;
  transition: background 0.2s ease;
}

.spec-row:not(:last-child) {
  border-bottom: 1rpx solid var(--slate-100);
}

.spec-row:hover {
  background: var(--slate-50);
}

.spec-label {
  width: 180rpx;
  font-size: 26rpx;
  color: var(--slate-400);
  padding: 22rpx 24rpx;
  flex-shrink: 0;
  background: var(--slate-50);
}

.spec-divider {
  width: 1rpx;
  align-self: stretch;
  background: var(--slate-100);
}

.spec-value {
  flex: 1;
  font-size: 26rpx;
  color: var(--slate-900);
  padding: 22rpx 24rpx;
  font-weight: 500;
}

.desc {
  font-size: 28rpx;
  color: var(--slate-600);
  line-height: 1.8;
}


/* ========== 底部栏 ========== */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: var(--slate-900);
  padding: 18rpx 20rpx;
  padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
  gap: 14rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.15);
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 22rpx 0;
  border-radius: 10rpx;
  font-size: 24rpx;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn:active {
  transform: scale(0.96);
}

.btn-icon-wrap {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* WeChat icon */
.icon-wechat {
  width: 22rpx;
  height: 18rpx;
  border: 2rpx solid #fff;
  border-radius: 10rpx;
  position: relative;
}

.icon-wechat::after {
  content: '';
  position: absolute;
  bottom: -6rpx;
  left: 2rpx;
  width: 10rpx;
  height: 6rpx;
  border: 2rpx solid #fff;
  border-top: none;
  border-radius: 0 0 6rpx 6rpx;
}

/* Phone icon */
.icon-phone {
  width: 16rpx;
  height: 24rpx;
  border: 2rpx solid #fff;
  border-radius: 4rpx;
  position: relative;
}

.icon-phone::after {
  content: '';
  position: absolute;
  bottom: 3rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 6rpx;
  height: 2rpx;
  background: #fff;
  border-radius: 1rpx;
}

/* QR icon */
.icon-qr {
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid #fff;
  border-radius: 2rpx;
  position: relative;
}

.icon-qr::before {
  content: '';
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  width: 6rpx;
  height: 6rpx;
  background: #fff;
}

.icon-qr::after {
  content: '';
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 6rpx;
  height: 6rpx;
  background: #fff;
}

.btn-wechat {
  background: var(--wechat);
  color: #fff;
}

.btn-phone {
  background: var(--copper);
  color: #fff;
}

.bottom-bar-info {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 8rpx;
}

.bottom-bar-tip {
  font-size: 24rpx;
  color: var(--slate-400);
}

.btn-qr {
  background: var(--slate-800);
  color: #fff;
  border: 1rpx solid var(--slate-700);
}

/* ========== 动画 ========== */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 响应式 ========== */
@media screen and (min-width: 768px) {
  .page {
    max-width: 900px;
    margin: 0 auto;
  }

  .img-box {
    height: 560rpx;
    border-radius: 0 0 32rpx 32rpx;
  }

  .info-card {
    margin-top: -56rpx;
    padding: 48rpx;
  }

  .detail-card {
    padding: 48rpx;
  }
}
</style>
