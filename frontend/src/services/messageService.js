import api from './api'

// Lấy danh sách tin nhắn
export const getMessages = async (userId) => {
  const response = await api.get(`/messages/${userId}`)
  return response.data
}

// Gửi tin nhắn
export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData)
  return response.data
}

// Đánh dấu đã đọc
export const markAsRead = async (messageId) => {
  const response = await api.put(`/messages/${messageId}/read`)
  return response.data
}

// Lấy danh sách cuộc trò chuyện
export const getConversations = async () => {
  const response = await api.get('/conversations')
  return response.data
}

// Lấy tin nhắn chưa đọc
export const getUnreadCount = async () => {
  const response = await api.get('/messages/unread/count')
  return response.data
}
