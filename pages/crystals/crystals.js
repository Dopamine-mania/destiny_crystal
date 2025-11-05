const app = getApp()

Page({
  data: {
    userInfo: null,
    favorableGods: [], // 喜用神
    unfavorableGods: [], // 忌神
    recommendedCrystals: [],
    allCrystals: [],
    selectedFilter: 'all', // all, favorable, unfavorable
    sortBy: 'default', // default, price, popularity
    showFilterModal: false,
    isLoading: true
  },

  onLoad(options) {
    // 获取用户信息和喜用神分析
    const userInfo = app.globalData.userInfo
    const baziReport = app.globalData.baziReport
    
    if (!userInfo || !baziReport) {
      wx.showToast({
        title: '请先完成命理分析',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }

    // 获取喜用神和忌神（假设已解锁premium）
    const favorableGods = baziReport.premiumContent?.favorableGods?.favorable || ['土', '火']
    const unfavorableGods = baziReport.premiumContent?.favorableGods?.unfavorable || ['水']

    this.setData({
      userInfo,
      favorableGods,
      unfavorableGods,
      isLoading: false
    })

    this.loadCrystalDatabase()
    this.generateRecommendations()
  },

  // 加载水晶数据库
  loadCrystalDatabase() {
    const crystalDatabase = [
      // 土元素水晶
      {
        id: 'citrine',
        name: '黄水晶',
        price: 299,
        element: '土',
        description: '增强土元素能量，招财旺运，稳定心神',
        detailedDesc: '黄水晶是土元素的代表水晶，能够增强佩戴者的稳定性和财运。特别适合命中缺土或土弱的人佩戴。',
        image: '/images/crystals/citrine.jpg',
        benefits: ['招财', '稳定', '增强自信', '改善财运'],
        size: '10-15mm',
        origin: '巴西',
        popularity: 95,
        stock: 50
      },
      {
        id: 'yellow_jade',
        name: '黄玉',
        price: 399,
        element: '土',
        description: '土元素精华，助力事业稳步发展',
        detailedDesc: '黄玉温润如土，能够增强个人的稳重气质，帮助在事业上稳步前进。',
        image: '/images/crystals/yellow_jade.jpg',
        benefits: ['事业运', '稳重', '贵人运', '健康'],
        size: '12-18mm',
        origin: '新疆',
        popularity: 88,
        stock: 30
      },
      // 火元素水晶
      {
        id: 'red_agate',
        name: '红玛瑙',
        price: 199,
        element: '火',
        description: '补充火元素，增强活力和热情',
        detailedDesc: '红玛瑙色如烈火，能够增强佩戴者的活力和行动力，适合火弱或缺火的人。',
        image: '/images/crystals/agate.jpg',
        benefits: ['活力', '热情', '勇气', '行动力'],
        size: '8-12mm',
        origin: '内蒙古',
        popularity: 92,
        stock: 80
      },
      {
        id: 'garnet',
        name: '石榴石',
        price: 499,
        element: '火',
        description: '火元素之王，激发内在潜能',
        detailedDesc: '石榴石如血如火，是火元素的强力代表，能够激发人的斗志和创造力。',
        image: '/images/crystals/garnet.jpg',
        benefits: ['激情', '创造力', '领导力', '突破'],
        size: '6-10mm',
        origin: '印度',
        popularity: 85,
        stock: 25
      },
      // 其他元素水晶
      {
        id: 'black_obsidian',
        name: '黑曜石',
        price: 159,
        element: '水',
        description: '水元素护身，避邪化煞',
        detailedDesc: '黑曜石深如水渊，具有强大的避邪化煞功效，但不适合忌水的人长期佩戴。',
        image: '/images/crystals/obsidian.jpg',
        benefits: ['避邪', '化煞', '冷静', '保护'],
        size: '10-16mm',
        origin: '墨西哥',
        popularity: 78,
        stock: 60
      },
      {
        id: 'green_aventurine',
        name: '绿东陵',
        price: 169,
        element: '木',
        description: '木元素生机，促进成长发展',
        detailedDesc: '绿东陵充满生机，代表木元素的成长力量，适合需要发展和创新的人。',
        image: '/images/crystals/aventurine.jpg',
        benefits: ['成长', '机遇', '创新', '健康'],
        size: '8-14mm',
        origin: '印度',
        popularity: 82,
        stock: 45
      }
    ]

    this.setData({ allCrystals: crystalDatabase })
  },

  // 生成个性化推荐
  generateRecommendations() {
    const { favorableGods, allCrystals } = this.data
    
    // 根据喜用神推荐水晶
    const recommended = allCrystals.filter(crystal => 
      favorableGods.includes(crystal.element)
    ).sort((a, b) => b.popularity - a.popularity)

    this.setData({ 
      recommendedCrystals: recommended
    })
  },

  // 筛选变更
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ selectedFilter: filter })
    this.applyFilters()
  },

  // 排序变更
  onSortChange(e) {
    const sortBy = e.detail.value
    this.setData({ sortBy })
    this.applyFilters()
  },

  // 应用筛选和排序
  applyFilters() {
    const { allCrystals, favorableGods, unfavorableGods, selectedFilter, sortBy } = this.data
    let filteredCrystals = [...allCrystals]

    // 应用筛选
    if (selectedFilter === 'favorable') {
      filteredCrystals = filteredCrystals.filter(crystal => 
        favorableGods.includes(crystal.element)
      )
    } else if (selectedFilter === 'unfavorable') {
      filteredCrystals = filteredCrystals.filter(crystal => 
        unfavorableGods.includes(crystal.element)
      )
    }

    // 应用排序
    if (sortBy === 'price') {
      filteredCrystals.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'popularity') {
      filteredCrystals.sort((a, b) => b.popularity - a.popularity)
    }

    this.setData({ recommendedCrystals: filteredCrystals })
  },

  // 查看水晶详情
  onCrystalDetail(e) {
    const crystalId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/crystal-detail/crystal-detail?id=${crystalId}`
    })
  },

  // 添加到购物车
  onAddToCart(e) {
    const crystal = e.currentTarget.dataset.crystal
    
    // 添加到购物车
    let cartItems = app.globalData.cartItems || []
    const existingItem = cartItems.find(item => item.id === crystal.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        id: crystal.id,
        name: crystal.name,
        price: crystal.price,
        element: crystal.element,
        image: crystal.image,
        quantity: 1
      })
    }
    
    app.globalData.cartItems = cartItems
    
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success'
    })
  },

  // 立即购买
  onBuyNow(e) {
    const crystal = e.currentTarget.dataset.crystal
    
    // 设置单品购买
    app.globalData.singlePurchase = {
      id: crystal.id,
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

  // 前往购物车
  onGoToCart() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  },

  // 显示筛选弹窗
  onShowFilter() {
    this.setData({ showFilterModal: true })
  },

  // 隐藏筛选弹窗
  onHideFilter() {
    this.setData({ showFilterModal: false })
  },

  // 返回
  onBack() {
    wx.navigateBack()
  }
})