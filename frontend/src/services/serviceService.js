import api from './api'

export const serviceService = {
  // Get all services
  getServices: async (params = {}) => {
    const response = await api.get('/services', { params })
    return response.data
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`)
    return response.data
  },

  // Create service (admin only)
  createService: async (serviceData) => {
    const response = await api.post('/admin/services', serviceData)
    return response.data
  },

  // Update service (admin only)
  updateService: async (id, serviceData) => {
    const response = await api.put(`/admin/services/${id}`, serviceData)
    return response.data
  },

  // Delete service (admin only)
  deleteService: async (id) => {
    const response = await api.delete(`/admin/services/${id}`)
    return response.data
  },

  // Get service categories
  getCategories: async () => {
    const response = await api.get('/service-categories')
    return response.data
  },
}

export default serviceService
