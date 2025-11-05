const app = getApp()

Page({
  data: {
    memberInfo: null,
    showAnimation: false
  },

  onLoad() {
    this.loadMemberInfo()
    // 延迟显示动画
    setTimeout(() => {
      this.setData({ showAnimation: true })
    }, 500)
  },

  loadMemberInfo() {
    const memberInfo = app.globalData.memberInfo
    if (memberInfo) {
      this.setData({ memberInfo })
    }
  },

  // 开始体验
  onStartExperience() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 查看会员权益
  onViewPrivileges() {
    wx.showModal({
      title: '会员权益',
      content: '✨ 解锁所有深度分析\n🎯 专属喜用神推荐\n💎 个性化水晶方案\n🚀 优先客服支持\n📊 每月免费报告\n🎫 专属优惠券',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 分享给好友
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      success: () => {
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '我刚开通了Destiny Weaver AI会员，快来体验专业命理分析！',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  // 联系客服
  onContactService() {
    wx.showModal({
      title: '联系客服',
      content: '如有任何问题，请联系我们的客服团队。\n\n工作时间：09:00-18:00\n客服微信：destiny-support',
      confirmText: '复制微信',
      cancelText: '稍后联系',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'destiny-support',
            success: () => {
              wx.showToast({
                title: '微信号已复制',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  onBack() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})