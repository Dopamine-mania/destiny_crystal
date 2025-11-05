const app = getApp()

Page({
  data: {
    currentTab: 'all', // all, pending, paid, shipped, received, cancelled
    orders: [],
    isLoading: true,
    isEmpty: false,
    tabList: [
      { key: 'all', name: '全部', count: 0 },
      { key: 'pending', name: '待付款', count: 0 },
      { key: 'paid', name: '待发货', count: 0 },
      { key: 'shipped', name: '待收货', count: 0 },
      { key: 'received', name: '已完成', count: 0 }
    ]
  },

  onLoad(options) {
    // 如果有传入状态参数，设置对应tab
    if (options.status) {
      this.setData({ currentTab: options.status })
    }
    this.loadOrders()
  },

  loadOrders() {
    this.setData({ isLoading: true })

    // 模拟订单数据
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'order_001',
          orderNo: '20240115001',
          status: 'pending',
          statusText: '待付款',
          createTime: '2024-01-15 14:30',
          payTime: null,
          shipTime: null,
          totalAmount: 498,
          items: [
            {
              name: '黄水晶手链',
              element: '土',
              price: 299,
              quantity: 1,
              image: '/images/crystals/citrine.jpg'
            },
            {
              name: '红玛瑙手链', 
              element: '火',
              price: 199,
              quantity: 1,
              image: '/images/crystals/agate.jpg'
            }
          ],
          address: {
            name: '张三',
            phone: '138****5678',
            detail: '北京市朝阳区xxx街道xxx号'
          }
        },
        {
          id: 'order_002',
          orderNo: '20240112001',
          status: 'shipped',
          statusText: '待收货',
          createTime: '2024-01-12 10:15',
          payTime: '2024-01-12 10:20',
          shipTime: '2024-01-13 16:30',
          totalAmount: 299,
          trackingNo: 'SF1234567890',
          items: [
            {
              name: '石榴石手链',
              element: '火',
              price: 299,
              quantity: 1,
              image: '/images/crystals/garnet.jpg'
            }
          ],
          address: {
            name: '李四',
            phone: '139****1234',
            detail: '上海市浦东新区xxx路xxx号'
          }
        },
        {
          id: 'order_003',
          orderNo: '20240110001',
          status: 'received',
          statusText: '已完成',
          createTime: '2024-01-10 16:45',
          payTime: '2024-01-10 16:50',
          shipTime: '2024-01-11 09:20',
          receiveTime: '2024-01-13 14:30',
          totalAmount: 169,
          items: [
            {
              name: '绿东陵手链',
              element: '木',
              price: 169,
              quantity: 1,
              image: '/images/crystals/aventurine.jpg'
            }
          ],
          address: {
            name: '王五',
            phone: '137****9999',
            detail: '广州市天河区xxx大道xxx号'
          }
        }
      ]

      // 计算各状态数量
      const tabList = this.data.tabList.map(tab => {
        if (tab.key === 'all') {
          return { ...tab, count: mockOrders.length }
        }
        return { ...tab, count: mockOrders.filter(order => order.status === tab.key).length }
      })

      this.setData({
        orders: mockOrders,
        tabList,
        isLoading: false,
        isEmpty: mockOrders.length === 0
      })
    }, 1500)
  },

  // 切换tab
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
  },

  // 获取当前tab的订单
  getCurrentOrders() {
    const { currentTab, orders } = this.data
    if (currentTab === 'all') {
      return orders
    }
    return orders.filter(order => order.status === currentTab)
  },

  // 订单操作
  onOrderAction(e) {
    const { action, orderId } = e.currentTarget.dataset
    const order = this.data.orders.find(o => o.id === orderId)

    switch (action) {
      case 'pay':
        this.payOrder(order)
        break
      case 'cancel':
        this.cancelOrder(order)
        break
      case 'confirm':
        this.confirmReceive(order)
        break
      case 'contact':
        this.contactSeller(order)
        break
      case 'logistics':
        this.viewLogistics(order)
        break
      case 'delete':
        this.deleteOrder(order)
        break
      case 'review':
        this.reviewOrder(order)
        break
    }
  },

  // 支付订单
  payOrder(order) {
    wx.showModal({
      title: '确认支付',
      content: `订单金额：¥${order.totalAmount}`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '支付中...' })
          
          // 模拟支付
          setTimeout(() => {
            wx.hideLoading()
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            })
            
            // 更新订单状态
            this.updateOrderStatus(order.id, 'paid', '待发货')
          }, 2000)
        }
      }
    })
  },

  // 取消订单
  cancelOrder(order) {
    wx.showModal({
      title: '取消订单',
      content: '确定要取消此订单吗？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus(order.id, 'cancelled', '已取消')
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          })
        }
      }
    })
  },

  // 确认收货
  confirmReceive(order) {
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus(order.id, 'received', '已完成')
          wx.showToast({
            title: '收货成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 联系客服
  contactSeller(order) {
    wx.showModal({
      title: '联系客服',
      content: `订单号：${order.orderNo}\n客服微信：destiny-customer\n工作时间：9:00-18:00`,
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 查看物流
  viewLogistics(order) {
    if (order.trackingNo) {
      wx.showModal({
        title: '物流信息',
        content: `快递单号：${order.trackingNo}\n\n2024-01-13 16:30 已发货\n2024-01-14 08:20 运输中\n2024-01-14 18:45 派送中`,
        showCancel: false,
        confirmText: '我知道了'
      })
    } else {
      wx.showToast({
        title: '暂无物流信息',
        icon: 'none'
      })
    }
  },

  // 删除订单
  deleteOrder(order) {
    wx.showModal({
      title: '删除订单',
      content: '确定要删除此订单记录吗？',
      success: (res) => {
        if (res.confirm) {
          const orders = this.data.orders.filter(o => o.id !== order.id)
          this.setData({ orders })
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 评价订单
  reviewOrder(order) {
    wx.showToast({
      title: '评价功能开发中',
      icon: 'none'
    })
  },

  // 更新订单状态
  updateOrderStatus(orderId, status, statusText) {
    const orders = this.data.orders.map(order => {
      if (order.id === orderId) {
        return { 
          ...order, 
          status, 
          statusText,
          receiveTime: status === 'received' ? new Date().toLocaleString() : order.receiveTime
        }
      }
      return order
    })

    // 重新计算tab数量
    const tabList = this.data.tabList.map(tab => {
      if (tab.key === 'all') {
        return { ...tab, count: orders.length }
      }
      return { ...tab, count: orders.filter(order => order.status === tab.key).length }
    })

    this.setData({ orders, tabList })
  },

  onBack() {
    wx.navigateBack()
  }
})