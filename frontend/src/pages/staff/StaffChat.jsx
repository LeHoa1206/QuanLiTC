import { useState } from 'react'
import { FaSearch, FaPaperPlane, FaSmile, FaPaperclip, FaUser, FaCircle } from 'react-icons/fa'

const StaffChat = () => {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState('')

  const conversations = [
    { id: 1, customer: 'Nguyễn Văn A', avatar: '👨', lastMessage: 'Cảm ơn bạn nhé!', time: '10:30', unread: 2, online: true },
    { id: 2, customer: 'Trần Thị B', avatar: '👩', lastMessage: 'Lịch hẹn ngày mai có được không?', time: '09:15', unread: 0, online: true },
    { id: 3, customer: 'Lê Văn C', avatar: '👨', lastMessage: 'Giá dịch vụ bao nhiêu ạ?', time: 'Hôm qua', unread: 1, online: false },
    { id: 4, customer: 'Phạm Thị D', avatar: '👩', lastMessage: 'Ok, tôi sẽ đến đúng giờ', time: 'Hôm qua', unread: 0, online: false },
  ]

  const messages = [
    { id: 1, sender: 'customer', text: 'Xin chào, tôi muốn đặt lịch cắt tỉa cho chó của tôi', time: '10:00', avatar: '👨' },
    { id: 2, sender: 'staff', text: 'Chào bạn! Tôi có thể giúp gì cho bạn?', time: '10:01', avatar: '👤' },
    { id: 3, sender: 'customer', text: 'Ngày mai có lịch trống không ạ?', time: '10:02', avatar: '👨' },
    { id: 4, sender: 'staff', text: 'Để tôi kiểm tra lịch nhé. Bạn muốn đặt lúc mấy giờ?', time: '10:03', avatar: '👤' },
    { id: 5, sender: 'customer', text: 'Khoảng 2 giờ chiều được không?', time: '10:05', avatar: '👨' },
    { id: 6, sender: 'staff', text: 'Được ạ! Tôi đã đặt lịch cho bạn vào 14:00 ngày mai. Bạn nhớ đến đúng giờ nhé!', time: '10:06', avatar: '👤' },
    { id: 7, sender: 'customer', text: 'Cảm ơn bạn nhé!', time: '10:30', avatar: '👨' },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message
      setMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">💬 Chat với khách hàng</h1>
          <p className="text-purple-100">Trò chuyện và hỗ trợ khách hàng trực tiếp</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-12 md:col-span-4 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                      selectedChat === conv.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                          {conv.avatar}
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-800 truncate">{conv.customer}</h3>
                          <span className="text-xs text-gray-500">{conv.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-12 md:col-span-8 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                        👨
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Nguyễn Văn A</h3>
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <FaCircle className="text-xs" />
                        Đang hoạt động
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all">
                    Xem hồ sơ
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'staff' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                      {msg.avatar}
                    </div>
                    <div className={`flex flex-col ${msg.sender === 'staff' ? 'items-end' : ''}`}>
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl ${
                          msg.sender === 'staff'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <button className="p-3 text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
                    <FaPaperclip className="text-xl" />
                  </button>
                  <button className="p-3 text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
                    <FaSmile className="text-xl" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaPaperPlane />
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffChat
