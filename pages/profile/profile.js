const app = getApp()

Page({
  data: {
    userInfo: {
      name: "用户",
      avatar: "👤",
      memberLevel: "普通用户",
      isPremium: false,
      joinDate: "2024-01-01",
      memberExpireDate: null // 会员到期时间
    },
    menuItems: [
      {
        id: "reports",
        title: "我的报告",
        icon: "📊",
        desc: "查看历史命理报告",
        count: 3
      },
      {
        id: "orders", 
        title: "订单管理",
        icon: "📦",
        desc: "查看订单状态",
        count: 2,
        subItems: [
          { key: 'pending', name: '待付款', count: 1 },
          { key: 'paid', name: '待发货', count: 0 },
          { key: 'shipped', name: '待收货', count: 1 },
          { key: 'received', name: '已完成', count: 0 }
        ]
      },
      {
        id: "member",
        title: "会员中心", 
        icon: "👑",
        desc: "会员特权与续费",
        highlight: true
      },
      {
        id: "coupons",
        title: "优惠券",
        icon: "🎫", 
        desc: "我的优惠券",
        count: 1
      },
      {
        id: "addresses",
        title: "收货地址",
        icon: "📍",
        desc: "管理收货地址"
      },
      {
        id: "settings",
        title: "设置",
        icon: "⚙️",
        desc: "个人设置"
      },
      {
        id: "service",
        title: "客服",
        icon: "💬",
        desc: "联系客服"
      }
    ],
    showOrderSubMenu: false // 是否显示订单子菜单
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    // 从全局获取用户信息
    const globalUserInfo = app.globalData.userInfo
    const isPremium = app.globalData.isPremiumUser || false
    
    if (globalUserInfo) {
      // 模拟会员到期时间
      const memberExpireDate = isPremium ? "2026-02-15" : null
      
      this.setData({
        "userInfo.name": globalUserInfo.name,
        "userInfo.isPremium": isPremium,
        "userInfo.memberLevel": isPremium ? "年度会员" : "普通用户",
        "userInfo.memberExpireDate": memberExpireDate
      })
    }
  },

  onMenuTap(e) {
    const itemId = e.currentTarget.dataset.id
    
    switch(itemId) {
      case "reports":
        this.navigateToReports()
        break
      case "orders":
        // 显示/隐藏订单子菜单
        this.toggleOrderSubMenu()
        break
      case "member":
        this.navigateToMember()
        break
      case "coupons":
        this.navigateToCoupons()
        break
      case "addresses":
        this.navigateToAddresses()
        break
      case "settings":
        this.navigateToSettings()
        break
      case "service":
        this.contactService()
        break
    }
  },

  // 切换订单子菜单显示
  toggleOrderSubMenu() {
    this.setData({
      showOrderSubMenu: !this.data.showOrderSubMenu
    })
  },

  // 订单子菜单点击
  onOrderSubMenuTap(e) {
    const status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: `/pages/orders/orders?status=${status}`
    })
  },

  navigateToReports() {
    wx.navigateTo({
      url: "/pages/reports/reports"
    })
  },

  navigateToOrders() {
    wx.navigateTo({
      url: "/pages/orders/orders"
    })
  },

  navigateToMember() {
    wx.navigateTo({
      url: '/pages/member/member'
    })
  },

  upgradeMember() {
    wx.showLoading({ title: "处理中..." })
    
    // 模拟会员升级
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: "升级成功！",
        icon: "success"
      })
      
      app.globalData.isPremiumUser = true
      this.setData({
        "userInfo.isPremium": true,
        "userInfo.memberLevel": "年度会员"
      })
    }, 2000)
  },

  navigateToCoupons() {
    wx.showToast({
      title: "优惠券功能开发中",
      icon: "none"
    })
  },

  navigateToAddresses() {
    wx.navigateTo({
      url: '/pages/addresses/addresses'
    })
  },

  navigateToSettings() {
    wx.showToast({
      title: "设置功能开发中",
      icon: "none" 
    })
  },

  contactService() {
    wx.showModal({
      title: "联系客服",
      content: "客服微信：destiny-ai\n工作时间：9:00-18:00",
      showCancel: false,
      confirmText: "我知道了"
    })
  },

  onBackToHome() {
    wx.navigateBack()
  }
})
