const app = getApp()

Page({
  data: {
    reports: [],
    isLoading: true,
    isEmpty: false
  },

  onLoad() {
    this.loadReports()
  },

  onShow() {
    this.loadReports()
  },

  loadReports() {
    this.setData({ isLoading: true })

    // 模拟加载历史报告数据
    setTimeout(() => {
      const mockReports = [
        {
          id: 'report_001',
          name: '张三',
          birthDate: '1990年3月15日',
          birthTime: '卯时 6:00-7:59',
          createTime: '2024-01-15 14:30',
          dayMaster: '戊土',
          status: 'completed', // completed, generating, failed
          isPremium: true,
          thumbnail: '戊土之人性格沉稳踏实...'
        },
        {
          id: 'report_002', 
          name: '李四',
          birthDate: '1995年8月22日',
          birthTime: '午时 12:00-13:59',
          createTime: '2024-01-10 09:15',
          dayMaster: '甲木',
          status: 'completed',
          isPremium: false,
          thumbnail: '甲木之人充满生机活力...'
        },
        {
          id: 'report_003',
          name: '王五',
          birthDate: '1988年12月05日', 
          birthTime: '亥时 22:00-23:59',
          createTime: '2024-01-08 16:45',
          dayMaster: '壬水',
          status: 'generating',
          isPremium: false,
          thumbnail: '正在生成中...'
        }
      ]

      this.setData({
        reports: mockReports,
        isLoading: false,
        isEmpty: mockReports.length === 0
      })
    }, 1500)
  },

  onReportTap(e) {
    const reportId = e.currentTarget.dataset.id
    const report = this.data.reports.find(r => r.id === reportId)
    
    if (report.status === 'generating') {
      wx.showToast({
        title: '报告生成中，请稍后查看',
        icon: 'none'
      })
      return
    }

    if (report.status === 'failed') {
      wx.showModal({
        title: '报告生成失败',
        content: '是否重新生成此报告？',
        success: (res) => {
          if (res.confirm) {
            this.regenerateReport(reportId)
          }
        }
      })
      return
    }

    // 设置报告数据到全局并跳转
    app.globalData.currentReport = report
    wx.navigateTo({
      url: '/pages/report/report'
    })
  },

  regenerateReport(reportId) {
    wx.showLoading({ title: '重新生成中...' })
    
    // 更新报告状态
    const reports = this.data.reports.map(report => {
      if (report.id === reportId) {
        return { ...report, status: 'generating' }
      }
      return report
    })
    
    this.setData({ reports })
    
    // 模拟重新生成
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '已开始重新生成',
        icon: 'success'
      })
    }, 2000)
  },

  onDeleteReport(e) {
    const reportId = e.currentTarget.dataset.id
    const report = this.data.reports.find(r => r.id === reportId)
    
    wx.showModal({
      title: '删除报告',
      content: `确定要删除"${report.name}"的命理报告吗？`,
      success: (res) => {
        if (res.confirm) {
          const reports = this.data.reports.filter(r => r.id !== reportId)
          this.setData({ 
            reports,
            isEmpty: reports.length === 0
          })
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  onShareReport(e) {
    const reportId = e.currentTarget.dataset.id
    const report = this.data.reports.find(r => r.id === reportId)
    
    wx.showActionSheet({
      itemList: ['分享给朋友', '生成分享图片', '复制分享链接'],
      success: (res) => {
        switch(res.tapIndex) {
          case 0:
            // 分享给朋友
            wx.showToast({
              title: '分享功能开发中',
              icon: 'none'
            })
            break
          case 1:
            // 生成分享图片
            wx.showToast({
              title: '分享图片生成中',
              icon: 'none'
            })
            break
          case 2:
            // 复制分享链接
            wx.setClipboardData({
              data: `https://destiny-ai.com/report/${reportId}`,
              success: () => {
                wx.showToast({
                  title: '链接已复制',
                  icon: 'success'
                })
              }
            })
            break
        }
      }
    })
  },

  onCreateNew() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },

  onBack() {
    wx.navigateBack()
  }
})