const app = getApp()

Page({
  data: {
    cartItems: [],
    totalAmount: 0,
    selectedItems: [], // 选中的商品
    selectAll: false, // 全选状态
    agreeAgreement: false, // 是否同意协议
    selectedCount: 0, // 选中商品数量
    canCheckout: false // 是否可以结算
  },

  onLoad() {
    this.loadCartItems()
  },

  onShow() {
    this.loadCartItems()
  },

  loadCartItems() {
    const cartItems = app.globalData.cartItems || []
    const selectedItems = cartItems.map(() => true) // 默认全选
    const totalAmount = this.calculateSelectedTotal(cartItems, selectedItems)
    const selectedCount = this.calculateSelectedCount(selectedItems)
    const canCheckout = this.calculateCanCheckout(selectedItems, false) // 初始时协议未同意
    
    this.setData({
      cartItems,
      selectedItems,
      selectAll: true,
      totalAmount,
      selectedCount,
      canCheckout
    })
  },

  // 计算选中商品数量
  calculateSelectedCount(selectedItems) {
    return selectedItems.filter(item => item).length
  },

  // 计算是否可以结算
  calculateCanCheckout(selectedItems, agreeAgreement = this.data.agreeAgreement) {
    const hasSelectedItems = selectedItems.some(item => item)
    return hasSelectedItems && agreeAgreement
  },

  // 计算选中商品总价
  calculateSelectedTotal(cartItems, selectedItems) {
    return cartItems.reduce((sum, item, index) => {
      return selectedItems[index] ? sum + (item.price * item.quantity) : sum
    }, 0)
  },

  // 选择/取消选择商品
  onItemSelect(e) {
    const index = e.currentTarget.dataset.index
    const selectedItems = [...this.data.selectedItems]
    selectedItems[index] = !selectedItems[index]
    
    const selectAll = selectedItems.every(item => item)
    const totalAmount = this.calculateSelectedTotal(this.data.cartItems, selectedItems)
    const selectedCount = this.calculateSelectedCount(selectedItems)
    const canCheckout = this.calculateCanCheckout(selectedItems)
    
    this.setData({
      selectedItems,
      selectAll,
      totalAmount,
      selectedCount,
      canCheckout
    })
  },

  // 全选/取消全选
  onSelectAll() {
    const selectAll = !this.data.selectAll
    const selectedItems = this.data.cartItems.map(() => selectAll)
    const totalAmount = this.calculateSelectedTotal(this.data.cartItems, selectedItems)
    const selectedCount = this.calculateSelectedCount(selectedItems)
    const canCheckout = this.calculateCanCheckout(selectedItems)
    
    this.setData({
      selectAll,
      selectedItems,
      totalAmount,
      selectedCount,
      canCheckout
    })
  },

  // 同意协议
  onAgreeAgreement() {
    const agreeAgreement = !this.data.agreeAgreement
    const canCheckout = this.calculateCanCheckout(this.data.selectedItems, agreeAgreement)
    
    this.setData({
      agreeAgreement,
      canCheckout
    })
  },

  onQuantityChange(e) {
    const { index, type } = e.currentTarget.dataset
    let cartItems = [...this.data.cartItems]
    
    if (type === 'increase') {
      cartItems[index].quantity += 1
    } else if (type === 'decrease') {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1
      } else {
        cartItems.splice(index, 1)
      }
    }
    
    app.globalData.cartItems = cartItems
    this.loadCartItems()
  },

  onRemoveItem(e) {
    const index = e.currentTarget.dataset.index
    let cartItems = [...this.data.cartItems]
    cartItems.splice(index, 1)
    
    app.globalData.cartItems = cartItems
    this.loadCartItems()
    
    wx.showToast({
      title: '已移除',
      icon: 'success'
    })
  },

  onCheckout() {
    // 检查是否有选中的商品
    const hasSelectedItems = this.data.selectedItems.some(item => item)
    if (!hasSelectedItems) {
      wx.showToast({
        title: '请选择要购买的商品',
        icon: 'none'
      })
      return
    }
    
    // 检查是否同意协议
    if (!this.data.agreeAgreement) {
      wx.showToast({
        title: '请先同意购买协议',
        icon: 'none'
      })
      return
    }
    
    // 筛选出选中的商品
    const selectedCartItems = this.data.cartItems.filter((item, index) => 
      this.data.selectedItems[index]
    )
    
    // 保存选中的商品到全局
    app.globalData.selectedCartItems = selectedCartItems
    
    wx.navigateTo({
      url: '/pages/payment/payment?type=cart'
    })
  },

  // 查看协议
  onViewAgreement() {
    wx.showModal({
      title: '购买协议',
      content: '1. 商品质量保证\n2. 7天无理由退换\n3. 运费标准\n4. 售后服务条款\n\n详细协议请访问官网查看',
      showCancel: false,
      confirmText: '我已阅读'
    })
  },

  onBack() {
    wx.navigateBack()
  }
})
