const app = getApp()

Page({
  data: {
    userInfo: null,
    selectedPlan: 'annual', // annual, quarterly, monthly
    memberPlans: [
      {
        id: 'annual',
        name: '年度会员',
        price: 99.9,
        originalPrice: 199.9,
        discount: '限时5折',
        duration: '12个月',
        description: '最受欢迎，性价比最高',
        features: [
          '解锁所有深度分析功能',
          '专属喜用神推荐',
          '个性化水晶方案',
          '优先客服支持',
          '每月免费报告生成',
          '会员专属优惠券'
        ],
        badge: '推荐',
        savings: '省¥100'
      },
      {
        id: 'quarterly',
        name: '季度会员',
        price: 39.9,
        originalPrice: 59.9,
        discount: '限时优惠',
        duration: '3个月',
        description: '体验完整功能',
        features: [
          '解锁所有深度分析功能',
          '专属喜用神推荐',
          '个性化水晶方案',
          '优先客服支持'
        ],
        savings: '省¥20'
      },
      {
        id: 'monthly',
        name: '月度会员',
        price: 19.9,
        originalPrice: 29.9,
        discount: '首月特惠',
        duration: '1个月',
        description: '先试用再决定',
        features: [
          '解锁所有深度分析功能',
          '专属喜用神推荐',
          '个性化水晶方案'
        ],
        savings: '省¥10'
      }
    ],
    paymentMethods: [
      {
        id: 'wechat',
        name: '微信支付',
        icon: '💚',
        desc: '推荐使用',
        selected: true
      },
      {
        id: 'alipay',
        name: '支付宝',
        icon: '🔵',
        desc: '安全便捷',
        selected: false
      }
    ],
    agreeAgreement: false,
    isProcessing: false,
    currentPlanPrice: 99.9
  },

  onLoad() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    const globalUserInfo = app.globalData.userInfo
    if (globalUserInfo) {
      this.setData({ userInfo: globalUserInfo })
    }
  },

  // 选择套餐
  onPlanSelect(e) {
    const planId = e.currentTarget.dataset.plan
    const selectedPlan = this.data.memberPlans.find(plan => plan.id === planId)
    this.setData({ 
      selectedPlan: planId,
      currentPlanPrice: selectedPlan ? selectedPlan.price : 99.9
    })
  },

  // 选择支付方式
  onPaymentMethodSelect(e) {
    const methodId = e.currentTarget.dataset.method
    const paymentMethods = this.data.paymentMethods.map(method => ({
      ...method,
      selected: method.id === methodId
    }))
    this.setData({ paymentMethods })
  },

  // 同意协议
  onAgreeToggle() {
    this.setData({
      agreeAgreement: !this.data.agreeAgreement
    })
  },

  // 查看协议
  onViewAgreement() {
    wx.showModal({
      title: '会员服务协议',
      content: '1. 会员权益说明\n2. 自动续费条款\n3. 退款政策\n4. 服务条款\n\n详细协议请访问官网查看',
      showCancel: false,
      confirmText: '我已阅读'
    })
  },

  // 立即开通
  onPurchase() {
    if (!this.data.agreeAgreement) {
      wx.showToast({
        title: '请先同意服务协议',
        icon: 'none'
      })
      return
    }

    if (this.data.isProcessing) return

    const selectedPlan = this.data.memberPlans.find(plan => plan.id === this.data.selectedPlan)
    const selectedPayment = this.data.paymentMethods.find(method => method.selected)

    wx.showModal({
      title: '确认购买',
      content: `套餐：${selectedPlan.name}\n价格：¥${selectedPlan.price}\n支付方式：${selectedPayment.name}`,
      success: (res) => {
        if (res.confirm) {
          this.processPurchase(selectedPlan, selectedPayment)
        }
      }
    })
  },

  // 处理购买
  processPurchase(plan, payment) {
    this.setData({ isProcessing: true })
    
    wx.showLoading({ title: '支付处理中...' })

    // 模拟支付流程
    setTimeout(() => {
      wx.hideLoading()
      
      // 随机决定支付结果
      const success = Math.random() > 0.1 // 90% 成功率

      if (success) {
        this.handlePaymentSuccess(plan)
      } else {
        this.handlePaymentFailed()
      }
      
      this.setData({ isProcessing: false })
    }, 3000)
  },

  // 支付成功处理
  handlePaymentSuccess(plan) {
    wx.showToast({
      title: '开通成功！',
      icon: 'success',
      duration: 2000
    })

    // 更新全局会员状态
    app.globalData.isPremiumUser = true
    
    // 计算到期时间
    const now = new Date()
    let expireDate = new Date(now)
    
    switch(plan.id) {
      case 'annual':
        expireDate.setFullYear(now.getFullYear() + 1)
        break
      case 'quarterly':
        expireDate.setMonth(now.getMonth() + 3)
        break
      case 'monthly':
        expireDate.setMonth(now.getMonth() + 1)
        break
    }

    // 保存会员信息
    app.globalData.memberInfo = {
      plan: plan.id,
      planName: plan.name,
      purchaseTime: now.toLocaleString(),
      expireTime: expireDate.toLocaleDateString()
    }

    // 延迟跳转
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/member-success/member-success'
      })
    }, 2000)
  },

  // 支付失败处理
  handlePaymentFailed() {
    wx.showModal({
      title: '支付失败',
      content: '支付过程中出现问题，请稍后重试',
      confirmText: '重试',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 重新尝试支付
          this.onPurchase()
        }
      }
    })
  },

  // 查看当前会员状态
  onViewCurrentMember() {
    const isPremium = app.globalData.isPremiumUser
    const memberInfo = app.globalData.memberInfo

    if (isPremium && memberInfo) {
      wx.showModal({
        title: '当前会员信息',
        content: `套餐：${memberInfo.planName}\n开通时间：${memberInfo.purchaseTime}\n到期时间：${memberInfo.expireTime}`,
        showCancel: false,
        confirmText: '我知道了'
      })
    } else {
      wx.showToast({
        title: '您还不是会员',
        icon: 'none'
      })
    }
  },

  onBack() {
    wx.navigateBack()
  }
})