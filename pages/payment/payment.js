const app = getApp()

Page({
  data: {
    cartItems: [],
    totalAmount: 0,
    isLoading: false,
    selectedAddress: null,
    paymentMethods: [
      { id: 'wechat', name: '微信支付', icon: '💚', enabled: false, tip: '企业版后开通' },
      { id: 'alipay', name: '支付宝', icon: '🔵', enabled: false, tip: '企业版后开通' },
      { id: 'mock', name: '模拟支付', icon: '🎭', enabled: true, tip: '仅供演示' }
    ],
    selectedPayment: 'mock'
  },

  onLoad() {
    // 从全局数据获取购物车信息
    const cartItems = app.globalData.cartItems || []
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    this.setData({
      cartItems,
      totalAmount
    })
    
    this.loadDefaultAddress()
  },

  loadDefaultAddress() {
    const addresses = app.globalData.addresses || []
    const defaultAddress = addresses.find(addr => addr.isDefault)
    
    if (defaultAddress) {
      this.setData({ selectedAddress: defaultAddress })
    }
  },

  // 选择收货地址
  onSelectAddress() {
    wx.navigateTo({
      url: '/pages/addresses/addresses?select=true'
    })
  },

  onShow() {
    // 从地址页面返回时，检查是否有选中的地址
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    
    if (currentPage.data.selectedAddress) {
      // 地址页面已经设置了selectedAddress
      this.loadDefaultAddress()
    }
  },

  onPaymentMethodTap(e) {
    const methodId = e.currentTarget.dataset.id
    const method = this.data.paymentMethods.find(m => m.id === methodId)
    
    if (!method.enabled) {
      wx.showToast({
        title: method.tip,
        icon: 'none'
      })
      return
    }
    
    this.setData({
      selectedPayment: methodId
    })
  },

  async onConfirmPayment() {
    if (this.data.isLoading) return
    
    // 验证收货地址
    if (!this.data.selectedAddress) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    
    const selectedMethod = this.data.paymentMethods.find(m => m.id === this.data.selectedPayment)
    
    if (!selectedMethod || !selectedMethod.enabled) {
      wx.showToast({
        title: '请选择可用的支付方式',
        icon: 'none'
      })
      return
    }
    
    this.setData({ isLoading: true })
    
    if (this.data.selectedPayment === 'mock') {
      // 模拟支付流程
      wx.showModal({
        title: '模拟支付确认',
        content: `支付金额: ¥${this.data.totalAmount}\n支付方式: ${selectedMethod.name}\n\n⚠️ 这是演示支付，不会产生实际费用\n企业版小程序可接入真实支付`,
        confirmText: '确认支付',
        confirmColor: '#f59e0b',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.processPayment()
          } else {
            this.setData({ isLoading: false })
          }
        }
      })
    } else {
      // 真实支付 - 个人开发者暂不可用
      const paymentName = selectedMethod.name
      wx.showModal({
        title: '支付暂不可用',
        content: `${paymentName}需要企业版小程序才能开通\n\n当前为个人开发者账号，建议：\n1. 升级为企业版小程序\n2. 或使用模拟支付体验功能`,
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#f59e0b'
      })
      this.setData({ isLoading: false })
    }
  },

  processPayment() {
    // 模拟支付处理时间
    setTimeout(() => {
      // 模拟支付成功
      wx.showToast({
        title: '支付成功！',
        icon: 'success'
      })
      
      // 保存订单金额
      app.globalData.lastOrderAmount = this.data.totalAmount
      
      // 清空购物车
      app.globalData.cartItems = []
      
      // 跳转到确认页面
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/confirmation/confirmation'
        })
      }, 1500)
    }, 2000)
  },

  onBack() {
    wx.navigateBack()
  }
})
