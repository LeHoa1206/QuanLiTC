import api from './api'

// ============ USER MANAGEMENT ============

// Lấy danh sách users
export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params })
  return response.data
}

// Tạo user mới
export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData)
  return response.data
}

// Cập nhật user
export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData)
  return response.data
}

// Khóa/Mở khóa tài khoản
export const toggleUserStatus = async (id) => {
  const response = await api.post(`/admin/users/${id}/toggle-status`)
  return response.data
}

// Cập nhật quyền hạn
export const updateUserRole = async (id, role) => {
  const response = await api.put(`/admin/users/${id}/role`, { role })
  return response.data
}

// ============ STATISTICS ============

// Dashboard thống kê
export const getDashboardStats = async () => {
  const response = await api.get('/admin/statistics/dashboard')
  return response.data
}

// Thống kê doanh thu
export const getRevenueStats = async (params = {}) => {
  const response = await api.get('/admin/statistics/revenue', { params })
  return response.data
}

// Thống kê sản phẩm bán chạy
export const getTopProducts = async (limit = 10) => {
  const response = await api.get('/admin/statistics/top-products', { 
    params: { limit } 
  })
  return response.data
}

// Thống kê dịch vụ phổ biến
export const getTopServices = async (limit = 10) => {
  const response = await api.get('/admin/statistics/top-services', { 
    params: { limit } 
  })
  return response.data
}
