import api from './api'

// Lấy danh sách dịch vụ
export const getServices = async (params = {}) => {
  const response = await api.get('/services', { params })
  return response.data
}

// Lấy chi tiết dịch vụ
export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`)
  return response.data
}

// Lấy danh mục dịch vụ
export const getServiceCategories = async () => {
  const response = await api.get('/service-categories')
  return response.data
}

// Admin: Thêm dịch vụ
export const createService = async (serviceData) => {
  const response = await api.post('/admin/services', serviceData)
  return response.data
}

// Admin: Cập nhật dịch vụ
export const updateService = async (id, serviceData) => {
  const response = await api.put(`/admin/services/${id}`, serviceData)
  return response.data
}

// Admin: Xóa dịch vụ
export const deleteService = async (id) => {
  const response = await api.delete(`/admin/services/${id}`)
  return response.data
}
