const app = getApp()

Page({
  data: {
    userInfo: null,
    baziReport: null,
    isLoading: true,
    isPremiumUser: false, // 是否为付费用户
    showPaywall: false, // 是否显示付费墙
    scaleAnimated: false, // 天平动画是否已播放
    paywallTriggered: false, // 付费引导是否已触发
    paywallHighlight: false, // 付费按钮高亮状态
    elementDetailModal: null // 五行详情弹窗数据
  },

  onLoad() {
    // 获取用户信息和报告数据
    const userInfo = app.globalData.userInfo
    const baziReport = app.globalData.baziReport
    
    if (!userInfo) {
      wx.showToast({
        title: '请先填写出生信息',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }

    this.setData({
      userInfo,
      baziReport,
      isLoading: false
    })
    
    // 设置页面滚动监听
    this.setupScrollMonitor()
    
    // 延迟触发天平动画
    setTimeout(() => {
      this.setData({ scaleAnimated: true })
    }, 1000)
  },

  // 设置滚动监听
  setupScrollMonitor() {
    const query = wx.createSelectorQuery()
    query.select('.paywall-section').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      if (res[0]) {
        // 监听页面滚动
        this.paywallElementTop = res[0].top
      }
    })
  },

  // 页面滚动事件
  onPageScroll(e) {
    const scrollTop = e.scrollTop
    const windowHeight = wx.getSystemInfoSync().windowHeight
    
    // 检查是否滚动到付费墙区域
    if (this.paywallElementTop && scrollTop + windowHeight >= this.paywallElementTop - 100) {
      if (!this.data.paywallTriggered && !this.data.isPremiumUser) {
        this.triggerPaywallHighlight()
      }
    }
  },

  // 触发付费按钮高亮抖动
  triggerPaywallHighlight() {
    this.setData({ 
      paywallTriggered: true,
      paywallHighlight: true 
    })
    
    // 抖动两次后停止
    setTimeout(() => {
      this.setData({ paywallHighlight: false })
    }, 3000)
  },

  // 天平砝码点击事件
  onScaleElementTap(e) {
    const elementType = e.currentTarget.dataset.element
    const elementData = this.getElementDetail(elementType)
    
    wx.showModal({
      title: `${elementType}元素详情`,
      content: elementData.description,
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 获取五行元素详细信息
  getElementDetail(element) {
    const elementDetails = {
      '木': {
        description: '木元素代表生长、创造、灵活性。木旺的人通常具有创新精神，善于规划未来，但有时可能过于理想化。',
        characteristics: ['创新', '成长', '灵活', '仁慈']
      },
      '火': {
        description: '火元素代表热情、活力、表达力。火旺的人通常充满激情，善于表达，但有时可能过于冲动。',
        characteristics: ['热情', '活力', '表达', '礼仪']
      },
      '土': {
        description: '土元素代表稳定、包容、踏实。土旺的人通常可靠稳重，善于协调，但有时可能过于保守。',
        characteristics: ['稳定', '包容', '诚信', '谨慎']
      },
      '金': {
        description: '金元素代表坚毅、理性、决断。金旺的人通常意志坚强，做事果断，但有时可能过于严厉。',
        characteristics: ['坚毅', '理性', '果断', '正义']
      },
      '水': {
        description: '水元素代表智慧、灵性、适应性。水旺的人通常聪明机智，适应能力强，但有时可能过于变化。',
        characteristics: ['智慧', '灵性', '适应', '包容']
      }
    }
    
    return elementDetails[element] || { description: '元素信息加载中...', characteristics: [] }
  },

  onAddToCart(e) {
    const crystal = e.currentTarget.dataset.crystal
    
    // 添加到购物车
    let cartItems = app.globalData.cartItems || []
    const existingItem = cartItems.find(item => item.name === crystal.name)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        id: Date.now(),
        name: crystal.name,
        price: crystal.price,
        description: crystal.description,
        quantity: 1
      })
    }
    
    app.globalData.cartItems = cartItems
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  onViewCart() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  },

  // 页面滚动监听，触发付费引导
  onPageScroll(e) {
    if (this.data.paywallTriggered || this.data.isPremiumUser) return
    
    // 滚动到一定位置时触发付费引导
    if (e.scrollTop > 1000) {
      this.setData({ 
        paywallTriggered: true,
        showPaywall: true 
      })
      // 触发按钮抖动动画
      this.triggerPaywallAnimation()
    }
  },

  triggerPaywallAnimation() {
    // 抖动动画逻辑
    setTimeout(() => {
      this.setData({ paywallHighlight: true })
      setTimeout(() => {
        this.setData({ paywallHighlight: false })
      }, 1000)
    }, 500)
  },

  // 付费解锁
  onUnlockPremium(e) {
    const type = e.currentTarget.dataset.type // 'single' 或 'annual'
    
    wx.showModal({
      title: '解锁深度分析',
      content: type === 'single' ? 
        '单模块解锁 ¥9.9\n解锁当前深度分析内容' : 
        '年度会员 ¥99.9\n解锁所有深度分析功能',
      confirmText: '立即解锁',
      confirmColor: '#f59e0b',
      success: (res) => {
        if (res.confirm) {
          this.processPremiumPayment(type)
        }
      }
    })
  },

  processPremiumPayment(type) {
    wx.showLoading({ title: '处理中...' })
    
    // 模拟支付处理
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '解锁成功！',
        icon: 'success'
      })
      
      // 更新为付费用户状态
      this.setData({ 
        isPremiumUser: true,
        showPaywall: false 
      })
      
      // 保存付费状态到全局
      app.globalData.isPremiumUser = true
      
    }, 2000)
  },

  // API接口占位 - 后端开发完成后替换
  async callAnalysisAPI(userInfo) {
    // TODO: 调用后端分析API
    // const response = await wx.request({
    //   url: 'https://api.example.com/bazi/analyze',
    //   method: 'POST',
    //   data: userInfo
    // })
    // return response.data
    
    // 当前使用mock数据
    return this.data.baziReport
  },

  // 探索更多水晶
  onExploreCrystals() {
    wx.navigateTo({
      url: '/pages/crystals/crystals'
    })
  },

  // 立即购买单个水晶
  onBuyNow(e) {
    const crystal = e.currentTarget.dataset.crystal
    
    // 设置单品购买
    app.globalData.singlePurchase = {
      id: crystal.name,
      name: crystal.name,
      price: crystal.price,
      element: crystal.element,
      image: crystal.image,
      quantity: 1
    }
    
    wx.navigateTo({
      url: '/pages/payment/payment?type=single'
    })
  },

  // 查看购物车
  onViewCart() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  },

  onBack() {
    wx.navigateBack()
  }
})
