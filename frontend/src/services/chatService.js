import api from './api'

export const chatService = {
  // Lấy danh sách conversations
  getConversations: async () => {
    const response = await api.get('/conversations')
    return response.data
  },

  // Lấy hoặc tạo conversation (cho customer)
  getOrCreateConversation: async () => {
    const response = await api.get('/conversations/my')
    return response.data
  },

  // Lấy chi tiết conversation
  getConversation: async (id) => {
    const response = await api.get(`/conversations/${id}`)
    return response.data
  },

  // Gửi message text
  sendMessage: async (conversationId, message) => {
    const response = await api.post(`/conversations/${conversationId}/messages`, {
      message,
    })
    return response.data
  },

  // Gửi message với image
  sendImageMessage: async (conversationId, imageFile, message = '') => {
    const formData = new FormData()
    formData.append('image', imageFile)
    if (message) {
      formData.append('message', message)
    }

    const response = await api.post(`/conversations/${conversationId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Lấy messages mới (polling)
  getNewMessages: async (conversationId, lastMessageId) => {
    const response = await api.get(`/conversations/${conversationId}/new-messages`, {
      params: { last_message_id: lastMessageId },
    })
    return response.data
  },

  // Đánh dấu đã đọc
  markAsRead: async (conversationId) => {
    const response = await api.post(`/conversations/${conversationId}/mark-read`)
    return response.data
  },

  // Đóng conversation (admin)
  closeConversation: async (conversationId) => {
    const response = await api.post(`/conversations/${conversationId}/close`)
    return response.data
  },

  // Lấy số lượng unread
  getUnreadCount: async () => {
    const response = await api.get('/chat/unread-count')
    return response.data
  },
}
