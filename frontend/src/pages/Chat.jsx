import { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaImage, FaTimes, FaArrowLeft, FaHome, FaHeadset, FaComments } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { chatService } from '../services/chatService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Chat = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const pollingInterval = useRef(null)

  // Load conversations
  useEffect(() => {
    loadConversations()
  }, [])

  // Polling for new messages
  useEffect(() => {
    if (selectedConversation) {
      pollingInterval.current = setInterval(() => {
        pollNewMessages()
      }, 3000) // Poll every 3 seconds

      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current)
        }
      }
    }
  }, [selectedConversation, messages])

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      let data
      
      if (user.role === 'customer') {
        data = await chatService.getOrCreateConversation()
        setConversations([data])
        setSelectedConversation(data)
        setMessages(data.messages || [])
      } else {
        data = await chatService.getConversations()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Không thể tải tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = async (conversation) => {
    try {
      const data = await chatService.getConversation(conversation.id)
      setSelectedConversation(data)
      setMessages(data.messages || [])
      
      // Mark as read
      await chatService.markAsRead(conversation.id)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const pollNewMessages = async () => {
    if (!selectedConversation || messages.length === 0) return

    try {
      const lastMessageId = messages[messages.length - 1]?.id || 0
      const newMessages = await chatService.getNewMessages(selectedConversation.id, lastMessageId)
      
      if (newMessages.length > 0) {
        // Lọc bỏ tin nhắn đã tồn tại để tránh duplicate
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id))
          return uniqueNewMessages.length > 0 ? [...prev, ...uniqueNewMessages] : prev
        })
        await chatService.markAsRead(selectedConversation.id)
      }
    } catch (error) {
      console.error('Error polling messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!messageText.trim() && !imageFile) return
    
    setSending(true)
    try {
      let response
      
      if (imageFile) {
        response = await chatService.sendImageMessage(selectedConversation.id, imageFile, messageText)
      } else {
        response = await chatService.sendMessage(selectedConversation.id, messageText)
      }
      
      // Kiểm tra tin nhắn đã tồn tại chưa trước khi thêm
      setMessages(prev => {
        const exists = prev.some(m => m.id === response.data.id)
        return exists ? prev : [...prev, response.data]
      })
      
      setMessageText('')
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Không thể gửi tin nhắn')
    } finally {
      setSending(false)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ảnh không được vượt quá 5MB')
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatTime = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    
    if (diff < 60000) return 'Vừa xong'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`
    if (diff < 86400000) return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const isMyMessage = (message) => message.sender_id === user.id

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Sidebar - Conversations List */}
      <div className={`${selectedConversation && user.role === 'customer' ? 'hidden md:block' : ''} w-full md:w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl`}>
        {/* Header với nút Home */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="relative flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all transform hover:scale-105 active:scale-95"
            >
              <FaHome className="text-white" />
              <span className="text-white font-semibold text-sm">Trang chủ</span>
            </button>
            
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <FaHeadset className="text-white text-2xl animate-pulse" />
            </div>
          </div>
          
          <div className="relative">
            <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
              <FaComments className="animate-bounce" />
              Hỗ Trợ Trực Tuyến
            </h2>
            <p className="text-sm text-white/90 font-medium">
              {user.role === 'customer' 
                ? '💬 Chat với đội ngũ hỗ trợ' 
                : `📊 ${conversations.length} cuộc hội thoại đang hoạt động`}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <FaComments className="text-4xl text-blue-500" />
              </div>
              <p className="text-gray-500 font-medium">Chưa có cuộc hội thoại nào</p>
              <p className="text-sm text-gray-400 mt-2">Gửi tin nhắn để bắt đầu chat</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-300 ${
                  selectedConversation?.id === conv.id 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500' 
                    : 'bg-white hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white">
                      {user.role === 'customer' 
                        ? '👨‍💼' 
                        : conv.customer?.name?.charAt(0).toUpperCase()}
                    </div>
                    {conv.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                        {conv.unread_count}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 truncate text-base">
                        {user.role === 'customer' ? '🎧 Hỗ Trợ Viên' : conv.customer?.name}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                      <span className="text-gray-400">💬</span>
                      {conv.last_message?.content || conv.last_message?.message || 'Bắt đầu cuộc hội thoại...'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Header - Enhanced */}
          <div className="relative p-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            <div className="relative flex items-center gap-4">
              {user.role === 'customer' && (
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95"
                >
                  <FaArrowLeft />
                </button>
              )}
              
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-white/30">
                  {user.role === 'customer' 
                    ? '👨‍💼' 
                    : selectedConversation.customer?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-black text-white text-xl mb-1">
                  {user.role === 'customer' ? '🎧 Hỗ Trợ Viên' : selectedConversation.customer?.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white/90 font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Đang hoạt động • Phản hồi nhanh</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all transform hover:scale-105 active:scale-95"
              >
                <FaHome className="text-white" />
                <span className="text-white font-semibold text-sm">Home</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(59, 130, 246, 0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}>
            {messages.map((message, index) => {
              const isMine = isMyMessage(message)
              const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id
              
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {showAvatar ? (
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
                      isMine 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    } flex items-center justify-center text-white text-sm font-bold`}>
                      {message.sender?.name?.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-8"></div>
                  )}
                  
                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {message.image && (
                      <img
                        src={message.image_url}
                        alt="Sent image"
                        className="rounded-2xl max-w-full h-auto mb-2 shadow-lg cursor-pointer hover:opacity-90 transition-all transform hover:scale-105"
                        onClick={() => window.open(message.image_url, '_blank')}
                      />
                    )}
                    
                    {(message.content || message.message) && (
                      <div className={`px-5 py-3 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${
                        isMine 
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white' 
                          : 'bg-white text-gray-900 border-2 border-gray-100 hover:border-blue-200'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content || message.message}</p>
                      </div>
                    )}
                    
                    <div className={`flex items-center gap-2 mt-1 px-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-xs text-gray-500 font-medium">
                        {formatTime(message.created_at)}
                      </span>
                      {isMine && (
                        <span className="text-xs text-blue-500">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 rounded-lg border-2 border-blue-500"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              >
                <FaImage className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  rows="1"
                  className="w-full px-4 py-3 pr-12 bg-gray-100 border-0 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              
              <button
                type="submit"
                disabled={sending || (!messageText.trim() && !imageFile)}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="relative text-center p-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500">
                <FaHeadset className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-3">
              Hỗ Trợ Trực Tuyến
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md">
              {user.role === 'customer' 
                ? 'Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7' 
                : 'Chọn cuộc hội thoại từ danh sách để bắt đầu hỗ trợ khách hàng'}
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Đang hoạt động</span>
              </div>
              <span>•</span>
              <span>Phản hồi nhanh</span>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <FaHome className="inline mr-2" />
              Quay về Trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
