import api from './api'
import axios from 'axios'

// API địa chỉ Việt Nam
const VN_ADDRESS_API = 'https://provinces.open-api.vn/api'

export const addressService = {
  // Get all addresses of current user
  getAddresses: async () => {
    const response = await api.get('/addresses')
    return response.data
  },

  // Get default address
  getDefaultAddress: async () => {
    const response = await api.get('/addresses/default')
    return response.data
  },

  // Create new address
  createAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData)
    return response.data
  },

  // Update address
  updateAddress: async (id, addressData) => {
    const response = await api.put(`/addresses/${id}`, addressData)
    return response.data
  },

  // Delete address
  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`)
    return response.data
  },

  // Set address as default
  setDefaultAddress: async (id) => {
    const response = await api.post(`/addresses/${id}/set-default`)
    return response.data
  },

  // ===== API ĐỊA CHỈ VIỆT NAM =====
  
  // Lấy danh sách tỉnh/thành phố
  getProvinces: async () => {
    try {
      const response = await axios.get(`${VN_ADDRESS_API}/p/`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching provinces:', error)
      throw new Error('Không thể tải danh sách tỉnh/thành phố')
    }
  },

  // Lấy danh sách quận/huyện theo tỉnh
  getDistricts: async (provinceCode) => {
    try {
      const response = await axios.get(`${VN_ADDRESS_API}/p/${provinceCode}?depth=2`)
      return response.data?.districts || []
    } catch (error) {
      console.error('Error fetching districts:', error)
      throw new Error('Không thể tải danh sách quận/huyện')
    }
  },

  // Lấy danh sách phường/xã theo quận
  getWards: async (districtCode) => {
    try {
      const response = await axios.get(`${VN_ADDRESS_API}/d/${districtCode}?depth=2`)
      return response.data?.wards || []
    } catch (error) {
      console.error('Error fetching wards:', error)
      throw new Error('Không thể tải danh sách phường/xã')
    }
  },
}
