import api from './api'

export const voucherService = {
  // Admin APIs
  getVouchers: async (params = {}) => {
    const response = await api.get('/admin/vouchers', { params })
    return response.data
  },

  getVoucher: async (id) => {
    const response = await api.get(`/admin/vouchers/${id}`)
    return response.data
  },

  createVoucher: async (data) => {
    const response = await api.post('/admin/vouchers', data)
    return response.data
  },

  updateVoucher: async (id, data) => {
    const response = await api.put(`/admin/vouchers/${id}`, data)
    return response.data
  },

  deleteVoucher: async (id) => {
    const response = await api.delete(`/admin/vouchers/${id}`)
    return response.data
  },

  bulkDeleteVouchers: async (ids) => {
    const response = await api.post('/admin/vouchers/bulk-delete', { ids })
    return response.data
  },

  toggleVoucherStatus: async (id) => {
    const response = await api.post(`/admin/vouchers/${id}/toggle-status`)
    return response.data
  },

  generateCode: async () => {
    const response = await api.get('/admin/vouchers/generate-code')
    return response.data
  },

  getStatistics: async () => {
    const response = await api.get('/admin/vouchers/statistics')
    return response.data
  },

  // Public API
  validateVoucher: async (code, orderAmount) => {
    const response = await api.post('/vouchers/validate', {
      code,
      order_amount: orderAmount
    })
    return response.data
  },

  getAvailableVouchers: async (orderAmount = 0) => {
    const response = await api.get('/vouchers/available', {
      params: { order_amount: orderAmount }
    })
    return response.data
  },
}