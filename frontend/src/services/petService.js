import api from './api'

// Lấy danh sách thú cưng của user
export const getPets = async () => {
  const response = await api.get('/pets')
  return response.data
}

// Thêm thú cưng mới
export const createPet = async (petData) => {
  const response = await api.post('/pets', petData)
  return response.data
}

// Cập nhật thông tin thú cưng
export const updatePet = async (id, petData) => {
  const response = await api.put(`/pets/${id}`, petData)
  return response.data
}

// Xóa thú cưng
export const deletePet = async (id) => {
  const response = await api.delete(`/pets/${id}`)
  return response.data
}

// Lấy chi tiết thú cưng
export const getPetById = async (id) => {
  const response = await api.get(`/pets/${id}`)
  return response.data
}
