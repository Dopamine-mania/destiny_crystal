const app = getApp()

Page({
  data: {
    addresses: [],
    isLoading: true,
    isSelectMode: false, // 是否为选择地址模式
    selectedAddressId: null
  },

  onLoad(options) {
    // 如果是从订单确认页面进入，开启选择模式
    if (options.select === 'true') {
      this.setData({ 
        isSelectMode: true,
        selectedAddressId: options.addressId || null
      })
    }
    this.loadAddresses()
  },

  loadAddresses() {
    this.setData({ isLoading: true })

    // 模拟加载地址数据
    setTimeout(() => {
      const mockAddresses = [
        {
          id: 'addr_001',
          name: '张三',
          phone: '138****5678', 
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detail: 'xxx街道xxx号院xxx楼xxx单元xxx室',
          fullAddress: '北京市北京市朝阳区xxx街道xxx号院xxx楼xxx单元xxx室',
          isDefault: true,
          tag: '家'
        },
        {
          id: 'addr_002',
          name: '张三',
          phone: '138****5678',
          province: '上海市', 
          city: '上海市',
          district: '浦东新区',
          detail: 'xxx路xxx号xxx大厦xxx层',
          fullAddress: '上海市上海市浦东新区xxx路xxx号xxx大厦xxx层',
          isDefault: false,
          tag: '公司'
        }
      ]

      this.setData({
        addresses: mockAddresses,
        isLoading: false
      })

      // 保存到全局
      app.globalData.addresses = mockAddresses
    }, 1000)
  },

  // 选择地址（选择模式）
  onAddressSelect(e) {
    if (!this.data.isSelectMode) return

    const addressId = e.currentTarget.dataset.id
    const address = this.data.addresses.find(addr => addr.id === addressId)
    
    // 返回选中的地址
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    
    if (prevPage) {
      prevPage.setData({
        selectedAddress: address
      })
    }
    
    wx.navigateBack()
  },

  // 设置默认地址
  onSetDefault(e) {
    const addressId = e.currentTarget.dataset.id
    
    const addresses = this.data.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }))

    this.setData({ addresses })
    app.globalData.addresses = addresses

    wx.showToast({
      title: '设置成功',
      icon: 'success'
    })
  },

  // 编辑地址
  onEditAddress(e) {
    const addressId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/address-edit/address-edit?id=${addressId}`
    })
  },

  // 删除地址
  onDeleteAddress(e) {
    const addressId = e.currentTarget.dataset.id
    const address = this.data.addresses.find(addr => addr.id === addressId)
    
    wx.showModal({
      title: '删除地址',
      content: `确定要删除"${address.tag || '地址'}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const addresses = this.data.addresses.filter(addr => addr.id !== addressId)
          
          // 如果删除的是默认地址，设置第一个为默认
          if (address.isDefault && addresses.length > 0) {
            addresses[0].isDefault = true
          }
          
          this.setData({ addresses })
          app.globalData.addresses = addresses
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 添加新地址
  onAddAddress() {
    wx.navigateTo({
      url: '/pages/address-edit/address-edit'
    })
  },

  onBack() {
    wx.navigateBack()
  }
})