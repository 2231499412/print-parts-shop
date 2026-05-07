<template>
  <view></view>
</template>

<script>
export default {
  onLoad(options) {
    // 将参数存储到全局
    const app = getApp()
    if (options.brand) {
      app.globalData = app.globalData || {}
      app.globalData.redirectBrand = options.brand
    }
    if (options.keyword) {
      app.globalData = app.globalData || {}
      app.globalData.redirectKeyword = options.keyword
    }
    // 跳转到分类页面
    uni.switchTab({ url: '/pages/category/category' })
  }
}
</script>
