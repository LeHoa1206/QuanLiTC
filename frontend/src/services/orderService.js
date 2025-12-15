import api from './api'

export const orderService = {
  // Create new order (Checkout)
  createOrder: async (orderData) => {
    const response = await api.post('/orders', {
      shipping_address: orderData.shipping_address,
      phone: orderData.phone,
      payment_method: orderData.payment_method,
      notes: orderData.notes,
      coupon_code: orderData.coupon_code,
      discount: orderData.discount,
      items: orderData.items, // Thêm items từ giỏ hàng
    })
    return response.data
  },

  // Get user orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`)
    return response.data
  },

  // Track order by order number
  trackOrder: async (orderNumber) => {
    const response = await api.get(`/orders/track/${orderNumber}`)
    return response.data
  },
}

