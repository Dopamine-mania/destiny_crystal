const app = getApp()

Page({
  data: {
    name: '',
    gender: null,
    year: '2000',
    month: '1', 
    day: '1',
    hour: '0',
    selectedHourText: '',
    isLoading: false,
    isFormValid: false,
    years: [],
    months: [],
    days: [],
    hourOptions: [
      { value: '0', text: '早子时 0:00-1:59' },
      { value: '2', text: '丑时 2:00-3:59' },
      { value: '4', text: '寅时 4:00-5:59' },
      { value: '6', text: '卯时 6:00-7:59' },
      { value: '8', text: '辰时 8:00-9:59' },
      { value: '10', text: '巳时 10:00-11:59' },
      { value: '12', text: '午时 12:00-13:59' },
      { value: '14', text: '未时 14:00-15:59' },
      { value: '16', text: '申时 16:00-17:59' },
      { value: '18', text: '酉时 18:00-19:59' },
      { value: '20', text: '戌时 20:00-21:59' },
      { value: '22', text: '亥时 22:00-23:59' }
    ]
  },

  onLoad() {
    this.initializeOptions()
    this.checkFormValid()
  },

  initializeOptions() {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 126 }, (_, i) => ({
      value: (currentYear - i).toString(),
      text: `${currentYear - i}年`
    }))
    const months = Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      text: `${i + 1}月`
    }))
    const days = Array.from({ length: 31 }, (_, i) => ({
      value: (i + 1).toString(), 
      text: `${i + 1}日`
    }))
    
    this.setData({ years, months, days })
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value }, () => {
      this.checkFormValid()
    })
  },

  onGenderTap(e) {
    const gender = e.currentTarget.dataset.gender
    this.setData({ gender }, () => {
      this.checkFormValid()
    })
  },

  onYearChange(e) {
    this.setData({ year: this.data.years[e.detail.value].value }, () => {
      this.checkFormValid()
    })
  },

  onMonthChange(e) {
    this.setData({ month: this.data.months[e.detail.value].value }, () => {
      this.checkFormValid()
    })
  },

  onDayChange(e) {
    this.setData({ day: this.data.days[e.detail.value].value }, () => {
      this.checkFormValid()
    })
  },

  onHourChange(e) {
    const selectedHour = this.data.hourOptions[e.detail.value]
    this.setData({ 
      hour: selectedHour.value,
      selectedHourText: selectedHour.text 
    }, () => {
      this.checkFormValid()
    })
  },

  checkFormValid() {
    const { name, gender, year, month, day, hour } = this.data
    const isValid = name.length >= 2 && name.length <= 4 && gender && year && month && day && hour !== null
    this.setData({ isFormValid: isValid })
  },

  onProfileTap() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  async onSubmit() {
    if (!this.data.isFormValid || this.data.isLoading) return
    
    this.setData({ isLoading: true })
    
    const userInfo = {
      name: this.data.name,
      gender: this.data.gender,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day,
      hour: this.data.hour,
      birthLocation: '北京'
    }
    
    // 保存用户信息到全局
    app.globalData.userInfo = userInfo
    
    try {
      // 模拟API调用
      await this.generateReport(userInfo)
      wx.navigateTo({
        url: '/pages/report/report'
      })
    } catch (error) {
      wx.showToast({
        title: '生成报告失败',
        icon: 'none'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  generateReport(userInfo) {
    return new Promise((resolve) => {
      // 模拟报告生成
      setTimeout(() => {
        const mockReport = {
          // 免费基础报告
          freeContent: {
            dayMaster: {
              element: '戊土',
              description: '戊土之人性格沉稳踏实，如大地般包容，做事有条不紊，责任心强。'
            },
            elements: {
              distribution: [
                ['木', 25],
                ['火', 15], 
                ['土', 35],
                ['金', 10],
                ['水', 15]
              ],
              strength: {
                same: ['土', '火'], // 同类
                different: ['木', '金', '水'], // 异类
                sameTotal: 50,
                differentTotal: 50,
                judgment: '中和偏弱'
              }
            },
            balanceScale: {
              leftSide: { elements: ['土', '火'], weight: 50, label: '同类' },
              rightSide: { elements: ['木', '金', '水'], weight: 50, label: '异类' },
              isBalanced: true
            }
          },
          // 付费深度内容 (锁定)
          premiumContent: {
            favorableGods: {
              favorable: ['土', '火'],
              unfavorable: ['水'],
              analysis: '您的喜用神为土火，忌神为水。建议多接触土火属性的事物来增强运势。',
              isLocked: true
            },
            tenGods: {
              analysis: '十神分析显示您的财运、事业运势...',
              isLocked: true
            },
            seasonAdjustment: {
              analysis: '调候用神分析...',
              isLocked: true  
            }
          },
          // 水晶推荐 (基于喜用神)
          crystalRecommendations: [
            { 
              name: '黄水晶', 
              price: 299, 
              description: '增强土元素能量，招财旺运',
              element: '土',
              image: '/images/crystals/citrine.jpg'
            },
            { 
              name: '红玛瑙', 
              price: 199, 
              description: '补充火元素，增强活力',
              element: '火',
              image: '/images/crystals/agate.jpg'
            }
          ]
        }
        app.globalData.baziReport = mockReport
        resolve(mockReport)
      }, 2000)
    })
  }
})
