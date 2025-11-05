const app = getApp()

Page({
  data: {
    addressId: null,
    formData: {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      tag: '家',
      isDefault: false
    },
    isEdit: false,
    regions: ['北京市', '北京市', '朝阳区'],
    tags: ['家', '公司', '学校', '其他']
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ 
        addressId: options.id,
        isEdit: true 
      })
      this.loadAddressData(options.id)
    }
  },

  loadAddressData(addressId) {
    // 从全局数据中查找地址
    const addresses = app.globalData.addresses || []
    const address = addresses.find(addr => addr.id === addressId)
    
    if (address) {
      this.setData({
        formData: {
          name: address.name,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          detail: address.detail,
          tag: address.tag,
          isDefault: address.isDefault
        },
        regions: [address.province, address.city, address.district]
      })
    }
  },

  // 姓名输入
  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    })
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      'formData.phone': e.detail.value
    })
  },

  // 详细地址输入
  onDetailInput(e) {
    this.setData({
      'formData.detail': e.detail.value
    })
  },

  // 地区选择
  onRegionChange(e) {
    const regions = e.detail.value
    this.setData({
      regions: regions,
      'formData.province': regions[0],
      'formData.city': regions[1],
      'formData.district': regions[2]
    })
  },

  // 标签选择
  onTagSelect(e) {
    const tag = e.currentTarget.dataset.tag
    this.setData({
      'formData.tag': tag
    })
  },

  // 设为默认
  onDefaultToggle() {
    this.setData({
      'formData.isDefault': !this.data.formData.isDefault
    })
  },

  // 表单验证
  validateForm() {
    const { name, phone, province, detail } = this.data.formData

    if (!name.trim()) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      })
      return false
    }

    if (!phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }

    // 简单手机号验证
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }

    if (!province) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
      return false
    }

    if (!detail.trim()) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return false
    }

    return true
  },

  // 保存地址
  onSave() {
    if (!this.validateForm()) return

    const formData = this.data.formData
    const fullAddress = `${formData.province}${formData.city}${formData.district}${formData.detail}`
    
    let addresses = app.globalData.addresses || []
    
    if (this.data.isEdit) {
      // 编辑现有地址
      addresses = addresses.map(addr => {
        if (addr.id === this.data.addressId) {
          return {
            ...addr,
            name: formData.name,
            phone: formData.phone,
            province: formData.province,
            city: formData.city,
            district: formData.district,
            detail: formData.detail,
            fullAddress: fullAddress,
            tag: formData.tag,
            isDefault: formData.isDefault
          }
        }
        // 如果设置为默认，取消其他地址的默认状态
        if (formData.isDefault) {
          return { ...addr, isDefault: false }
        }
        return addr
      })
    } else {
      // 新增地址
      const newAddress = {
        id: `addr_${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        province: formData.province,
        city: formData.city,
        district: formData.district,
        detail: formData.detail,
        fullAddress: fullAddress,
        tag: formData.tag,
        isDefault: formData.isDefault
      }

      // 如果设置为默认，取消其他地址的默认状态
      if (formData.isDefault) {
        addresses = addresses.map(addr => ({ ...addr, isDefault: false }))
      }

      addresses.push(newAddress)
    }

    // 保存到全局
    app.globalData.addresses = addresses

    wx.showToast({
      title: this.data.isEdit ? '编辑成功' : '添加成功',
      icon: 'success',
      duration: 1500
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  onBack() {
    wx.navigateBack()
  }
})