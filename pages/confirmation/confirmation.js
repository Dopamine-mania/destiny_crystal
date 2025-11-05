const app = getApp()

Page({
  data: {
    orderInfo: null,
    showSuccess: false
  },

  onLoad() {
    // 模拟订单信息
    const orderInfo = {
      orderNo: 'ORD' + Date.now(),
      amount: app.globalData.lastOrderAmount || 0,
      paymentMethod: '模拟支付',
      orderTime: new Date().toLocaleString('zh-CN'),
      status: 'success'
    }
    
    this.setData({ orderInfo })
    
    // 延迟显示成功动画
    setTimeout(() => {
      this.setData({ showSuccess: true })
    }, 500)
  },

  onBackToHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  onViewOrder() {
    wx.showToast({
      title: '查看订单功能开发中',
      icon: 'none'
    })
  },

  onShareResult() {
    wx.showShareMenu({
      withShareTicket: true,
      success: () => {
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        })
      }
    })
  }
})
