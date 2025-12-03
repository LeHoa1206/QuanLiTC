import { useState } from 'react'
import { FaFacebookMessenger, FaEnvelope, FaSearch, FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'

const SalesChat = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState('')

  const conversations = [
    { id: 1, customer: 'Nguyễn Văn A', platform: 'facebook', lastMessage: 'Sản phẩm này còn hàng không?', time: '5 phút', unread: 2, online: true },
    { id: 2, customer: 'Trần Thị B', platform: 'zalo', lastMessage: 'Khi nào giao hàng?', time: '10 phút', unread: 1, online: true },
    { id: 3, customer: 'Lê Văn C', platform: 'gmail', lastMessage: 'Cảm ơn shop!', time: '1 giờ', unread: 0, online: false },
    { id: 4, customer: 'Phạm Thị D', platform: 'facebook', lastMessage: 'Cho mình xem thêm ảnh', time: '2 giờ', unread: 3, online: false },
  ]

  const messages = [
    { id: 1, sender: 'customer', text: 'Xin chào shop!', time: '10:00' },
    { id: 2, sender: 'sales', text: 'Chào bạn! Shop có thể giúp gì cho bạn?', time: '10:01' },
    { id: 3, sender: 'customer', text: 'Sản phẩm thức ăn Royal Canin còn hàng không ạ?', time: '10:02' },
    { id: 4, sender: 'sales', text: 'Dạ còn ạ! Hiện shop còn 50 gói. Bạn cần mấy gói?', time: '10:03' },
    { id: 5, sender: 'customer', text: 'Mình lấy 2 gói nhé', time: '10:05' },
  ]

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <FaFacebookMessenger className="text-blue-600" />
      case 'zalo': return <SiZalo className="text-blue-500" />
      case 'gmail': return <FaEnvelope className="text-red-600" />
      default: return null
    }
  }

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-100 border-blue-500'
      case 'zalo': return 'bg-blue-50 border-blue-400'
      case 'gmail': return 'bg-red-50 border-red-500'
      default: return 'bg-gray-100 border-gray-500'
    }
  }

  const filteredConversations = selectedPlatform === 'all'
    ? conversations
    : conversations.filter(c => c.platform === selectedPlatform)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">💬 Quản lý tin nhắn</h1>
          <p className="text-blue-100">Tích hợp Facebook Messenger, Zalo, Gmail</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Platform Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                selectedPlatform === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({conversations.length})
            </button>
            <button
              onClick={() => setSelectedPlatform('facebook')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                selectedPlatform === 'facebook'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFacebookMessenger />
              Facebook ({conversations.filter(c => c.platform === 'facebook').length})
            </button>
            <button
              onClick={() => setSelectedPlatform('zalo')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                selectedPlatform === 'zalo'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SiZalo />
              Zalo ({conversations.filter(c => c.platform === 'zalo').length})
            </button>
            <button
              onClick={() => setSelectedPlatform('gmail')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                selectedPlatform === 'gmail'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaEnvelope />
              Gmail ({conversations.filter(c => c.platform === 'gmail').length})
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 350px)' }}>
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-12 md:col-span-4 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                      selectedChat === conv.id
                        ? `${getPlatformColor(conv.platform)} border-l-4`
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-black">
                          {conv.customer.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 text-2xl">
                          {getPlatformIcon(conv.platform)}
                        </div>
                        {conv.online && (
                          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
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
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-black">
                        N
                      </div>
                      <div className="absolute -bottom-1 -right-1 text-2xl">
                        <FaFacebookMessenger className="text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Nguyễn Văn A</h3>
                      <p className="text-sm text-green-600">● Đang hoạt động</p>
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
                    className={`flex gap-3 ${msg.sender === 'sales' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {msg.sender === 'sales' ? 'S' : 'N'}
                    </div>
                    <div className={`flex flex-col ${msg.sender === 'sales' ? 'items-end' : ''}`}>
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl ${
                          msg.sender === 'sales'
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
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
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

export default SalesChat
