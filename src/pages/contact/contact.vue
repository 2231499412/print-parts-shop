<template>
  <view class="page">
    <!-- #ifdef MP-WEIXIN -->
    <!-- 关于页面（小程序版） -->
    <view class="header">
      <view class="header-grid"></view>
      <view class="header-deco"></view>
      <view class="header-content">
        <view class="header-title">印刷配件资料库</view>
        <view class="header-slogan">印刷机配件规格参数速查</view>
      </view>
    </view>

    <view class="cards">
      <view class="card">
        <view class="card-body">
          <view class="card-label">应用简介</view>
          <view class="card-desc">本应用收录海德堡、小森、罗兰等主流印刷机品牌配件的规格参数，方便印刷行业从业者日常查阅参考。</view>
        </view>
      </view>
      <view class="card">
        <view class="card-body">
          <view class="card-label">数据来源</view>
          <view class="card-desc">配件数据来自行业公开资料整理，仅供参考。</view>
        </view>
      </view>
      <view class="card">
        <view class="card-body">
          <view class="card-label">版本信息</view>
          <view class="card-desc">当前版本：v1.0.0</view>
        </view>
      </view>
    </view>

    <view class="qr-section">
      <view class="qr-title">意见反馈</view>
      <view class="qr-desc">如有数据纠错或使用问题，欢迎反馈</view>
      <view class="feedback-phone" @tap="callFeedback">
        <view class="card-icon-wrap phone-bg">
          <view class="card-icon-phone"></view>
        </view>
        <text class="phone-text">18938663681</text>
      </view>
    </view>

    <view class="footer">
      <view class="footer-divider">
        <view class="divider-line"></view>
        <view class="divider-dot"></view>
        <view class="divider-line"></view>
      </view>
      <view class="footer-text">感谢您的使用与支持</view>
    </view>
    <!-- #endif -->

    <!-- #ifndef MP-WEIXIN -->
    <!-- 联系页面（H5版） -->
    <view class="header">
      <view class="header-grid"></view>
      <view class="header-deco"></view>
      <view class="header-content">
        <view class="header-title">{{ config.shopName }}</view>
        <view class="header-slogan">{{ config.slogan }}</view>
        <view class="header-contact" v-if="config.contactName">
          <text class="contact-label">联系人：</text>
          <text class="contact-name">{{ config.contactName }}</text>
        </view>
      </view>
    </view>

    <view class="cards">
      <view class="card" @tap="copyWechat">
        <view class="card-icon-wrap wechat-bg">
          <view class="card-icon-wechat"></view>
        </view>
        <view class="card-body">
          <view class="card-label">微信号</view>
          <view class="card-value">{{ config.wechat }}</view>
        </view>
        <view class="card-action">
          <text class="action-text">复制</text>
          <view class="arrow-right">
            <view class="arrow-line"></view>
            <view class="arrow-tip"></view>
          </view>
        </view>
      </view>

      <view class="card" @tap="callPhone">
        <view class="card-icon-wrap phone-bg">
          <view class="card-icon-phone"></view>
        </view>
        <view class="card-body">
          <view class="card-label">联系电话</view>
          <view class="card-value">{{ config.phone }}</view>
        </view>
        <view class="card-action">
          <text class="action-text">拨打</text>
          <view class="arrow-right">
            <view class="arrow-line"></view>
            <view class="arrow-tip"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="qr-section">
      <view class="qr-title">微信扫码添加</view>
      <view class="qr-box" @tap="previewQrcode">
        <image
          class="qr-image"
          :src="config.qrcode"
          mode="aspectFit"
          @longpress="previewQrcode"
        />
      </view>
      <view class="qr-tip">点击可放大查看</view>
    </view>

    <view class="footer">
      <view class="footer-divider">
        <view class="divider-line"></view>
        <view class="divider-dot"></view>
        <view class="divider-line"></view>
      </view>
      <view class="footer-text">如有疑问，欢迎随时联系我们</view>
      <view class="footer-hours">工作时间：周一至周六 8:00-18:00</view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import config from '@/static/data/config.json'

export default {
  data() {
    return { config }
  },
  methods: {
    copyWechat() {
      uni.setClipboardData({
        data: this.config.wechat,
        success() {
          uni.showToast({ title: '微信号已复制', icon: 'success' })
        }
      })
    },
    callPhone() {
      uni.makePhoneCall({ phoneNumber: this.config.phone })
    },
    callFeedback() {
      uni.makePhoneCall({ phoneNumber: '18938663681' })
    },
    previewQrcode() {
      uni.previewImage({ urls: [this.config.qrcode] })
    }
  }
}
</script>

<style scoped>
.page {
  background: var(--surface);
  min-height: 100vh;
}

/* ========== 顶部 ========== */
.header {
  background: var(--slate-900);
  padding: 80rpx 40rpx 100rpx;
  position: relative;
  overflow: hidden;
}

.header-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(184,115,51,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184,115,51,0.05) 1px, transparent 1px);
  background-size: 60rpx 60rpx;
}

.header-deco {
  position: absolute;
  top: -60rpx;
  right: -60rpx;
  width: 280rpx;
  height: 280rpx;
  border: 1rpx solid rgba(184,115,51,0.1);
  border-radius: 50%;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.header-title {
  font-size: 44rpx;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5rpx;
}

.header-slogan {
  font-size: 26rpx;
  color: var(--slate-400);
  margin-top: 12rpx;
  letter-spacing: 2rpx;
}

.header-contact {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.contact-label {
  font-size: 24rpx;
  color: var(--slate-400);
}

.contact-name {
  font-size: 28rpx;
  color: var(--copper-light);
  font-weight: 600;
}

/* ========== 联系卡片 ========== */
.cards {
  padding: 0 28rpx;
  margin-top: -44rpx;
  position: relative;
  z-index: 1;
}

.card {
  display: flex;
  align-items: center;
  background: var(--surface-raised);
  border-radius: 18rpx;
  padding: 32rpx;
  margin-bottom: 18rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  border: 1rpx solid var(--slate-100);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.card:nth-child(2) {
  animation-delay: 0.1s;
}

.card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
}

.card-icon-wrap {
  width: 84rpx;
  height: 84rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wechat-bg {
  background: var(--wechat);
}

.phone-bg {
  background: var(--copper);
}

.card-icon-wechat {
  width: 32rpx;
  height: 26rpx;
  border: 3rpx solid #fff;
  border-radius: 14rpx;
  position: relative;
}

.card-icon-wechat::after {
  content: '';
  position: absolute;
  bottom: -8rpx;
  left: 3rpx;
  width: 14rpx;
  height: 8rpx;
  border: 3rpx solid #fff;
  border-top: none;
  border-radius: 0 0 10rpx 10rpx;
}

.card-icon-phone {
  width: 20rpx;
  height: 32rpx;
  border: 3rpx solid #fff;
  border-radius: 4rpx;
  position: relative;
}

.card-icon-phone::after {
  content: '';
  position: absolute;
  bottom: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 8rpx;
  height: 2rpx;
  background: #fff;
  border-radius: 1rpx;
}

.card-body {
  flex: 1;
  margin-left: 24rpx;
}

.card-label {
  font-size: 22rpx;
  color: var(--slate-400);
  letter-spacing: 1rpx;
}

.card-value {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--slate-900);
  margin-top: 6rpx;
  letter-spacing: 2rpx;
}

.card-desc {
  font-size: 26rpx;
  color: var(--slate-600);
  margin-top: 8rpx;
  line-height: 1.6;
}

.card-action {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-text {
  font-size: 24rpx;
  color: var(--copper);
  font-weight: 600;
}

.arrow-right {
  display: flex;
  align-items: center;
  position: relative;
  width: 24rpx;
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
  width: 10rpx;
  height: 10rpx;
  border-top: 2rpx solid var(--copper);
  border-right: 2rpx solid var(--copper);
  transform: rotate(45deg);
}

/* ========== 二维码 ========== */
.qr-section {
  background: var(--surface-raised);
  margin: 36rpx 28rpx;
  border-radius: 18rpx;
  padding: 48rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
  border: 1rpx solid var(--slate-100);
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.qr-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--slate-900);
  margin-bottom: 32rpx;
}

.qr-box {
  width: 340rpx;
  height: 340rpx;
  margin: 0 auto;
  background: linear-gradient(145deg, var(--slate-100), var(--steel));
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.qr-box:hover {
  transform: scale(1.03);
}

.qr-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.qr-frame {
  position: relative;
  width: 280rpx;
  height: 280rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-corner {
  position: absolute;
  width: 24rpx;
  height: 24rpx;
  border-color: var(--copper);
  border-style: solid;
  border-width: 0;
}

.qr-tl {
  top: 0;
  left: 0;
  border-top-width: 3rpx;
  border-left-width: 3rpx;
}

.qr-tr {
  top: 0;
  right: 0;
  border-top-width: 3rpx;
  border-right-width: 3rpx;
}

.qr-bl {
  bottom: 0;
  left: 0;
  border-bottom-width: 3rpx;
  border-left-width: 3rpx;
}

.qr-br {
  bottom: 0;
  right: 0;
  border-bottom-width: 3rpx;
  border-right-width: 3rpx;
}

.qr-placeholder {
  font-size: 26rpx;
  color: var(--slate-400);
}

.qr-tip {
  font-size: 22rpx;
  color: var(--slate-300);
  margin-top: 24rpx;
}

.qr-desc {
  font-size: 26rpx;
  color: var(--slate-400);
  margin-bottom: 32rpx;
}

.feedback-phone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  cursor: pointer;
}

.phone-text {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--slate-900);
  letter-spacing: 2rpx;
}

/* ========== 底部 ========== */
.footer {
  text-align: center;
  padding: 48rpx 28rpx 40rpx;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

.footer-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.divider-line {
  width: 60rpx;
  height: 1rpx;
  background: var(--slate-200);
}

.divider-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: var(--copper);
}

.footer-text {
  font-size: 26rpx;
  color: var(--slate-600);
}

.footer-hours {
  font-size: 22rpx;
  color: var(--slate-400);
  margin-top: 10rpx;
  letter-spacing: 1rpx;
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
  .cards {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    margin-top: -56rpx;
  }

  .qr-section {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
