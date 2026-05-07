<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/* ========== Design Tokens ========== */
page {
  --copper: #B87333;
  --copper-light: #D4956B;
  --copper-dark: #8B5A2B;
  --copper-glow: rgba(184, 115, 51, 0.15);
  --slate-900: #1A1D23;
  --slate-800: #2D3039;
  --slate-700: #3D4150;
  --slate-600: #555A6B;
  --slate-400: #8B90A0;
  --slate-300: #A8ACB8;
  --slate-200: #C8CBD4;
  --slate-100: #E8E9ED;
  --slate-50: #F4F5F7;
  --steel: #E8E6E1;
  --surface: #F5F3EF;
  --surface-raised: #FFFFFF;
  --danger: #C44B4B;
  --success: #4A8B6B;
  --wechat: #07C160;

  background: var(--surface);
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
  color: var(--slate-900);
  font-size: 28rpx;
  line-height: 1.6;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

view, text {
  box-sizing: border-box;
}

/* ========== Industrial Texture Mixin ========== */
/* Blueprint grid background - used via pseudo-elements */
/* Diagonal hatching pattern */

/* ========== Typography ========== */
.heading-xl {
  font-size: 56rpx;
  font-weight: 800;
  letter-spacing: -1rpx;
  line-height: 1.15;
}

.heading-lg {
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: -0.5rpx;
  line-height: 1.2;
}

.heading-md {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.3;
}

.body-lg {
  font-size: 30rpx;
  line-height: 1.7;
}

.body-md {
  font-size: 28rpx;
  line-height: 1.6;
}

.body-sm {
  font-size: 24rpx;
  line-height: 1.5;
}

.caption {
  font-size: 22rpx;
  letter-spacing: 1rpx;
  text-transform: uppercase;
}

/* ========== Interactive States ========== */
.clickable {
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.clickable:active {
  opacity: 0.85;
  transform: scale(0.97);
}

/* ========== Scrollbar ========== */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--slate-300);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--copper);
}
</style>
