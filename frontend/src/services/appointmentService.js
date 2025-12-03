import api from './api'

export const appointmentService = {
  // Lấy danh sách lịch hẹn
  getAppointments: async (params = {}) => {
    const response = await api.get('/appointments', { params })
    return response.data
  },

  // Lấy chi tiết lịch hẹn
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  },

  // Đặt lịch mới
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData)
    return response.data
  },

  // Cập nhật lịch hẹn
  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData)
    return response.data
  },

  // Hủy lịch hẹn
  cancelAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`)
    return response.data
  },

  // Xác nhận lịch hẹn (Care Staff)
  confirmAppointment: async (id) => {
    const response = await api.post(`/appointments/${id}/confirm`)
    return response.data
  },

  // Từ chối lịch hẹn (Care Staff)
  rejectAppointment: async (id, reason) => {
    const response = await api.post(`/appointments/${id}/reject`, { reason })
    return response.data
  },

  // Lấy giờ đã đặt cho một ngày cụ thể
  getBookedTimes: async (serviceId, date) => {
    const response = await api.get(`/appointments/booked-times`, {
      params: { service_id: serviceId, date }
    })
    return response.data
  }
}

export default appointmentService
