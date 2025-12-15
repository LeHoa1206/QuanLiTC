import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaBell, 
  FaCheck, 
  FaTrash, 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaComments, 
  FaStar,
  FaCog,
  FaArrowLeft,
  FaCheckDouble
} from 'react-icons/fa'
import { useNotifications } from '../contexts/NotificationContext'
import { notificationService } from '../services/notificationService'

const Notifications = () => {
  const { 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications()
  
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, read
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load notifications
  const loadNotifications = async (page = 1) => {
    try {
      setLoading(true)
      const params = { 
        page,
        per_page: 20
      }
      
      if (filter === 'unread') {
        params.is_read = false
      } else if (filter === 'read') {
        params.is_read = true
      }

      const response = await notificationService.getNotifications(params)
      setNotifications(response.data || [])
      setCurrentPage(response.current_page || 1)
      setTotalPages(response.last_page || 1)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications(1)
  }, [filter])

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <FaShoppingBag className="w-5 h-5 text-blue-500" />
      case 'appointment':
        return <FaCalendarAlt className="w-5 h-5 text-green-500" />
      case 'message':
        return <FaComments className="w-5 h-5 text-purple-500" />
      case 'review':
        return <FaStar className="w-5 h-5 text-yellow-500" />
      case 'system':
        return <FaCog className="w-5 h-5 text-gray-500" />
      default:
        return <FaBell className="w-5 h-5 text-gray-500" />
    }
  }

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    
    return date.toLocaleDateString('vi-VN')
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id)
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      )
    }
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead()
    // Reload notifications
    loadNotifications(currentPage)
  }

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
      await deleteNotification(id)
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== id))
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/"
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-4xl font-black text-gray-800">
              Thông Báo
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> Của Bạn</span>
            </h1>
          </div>

          {/* Filter and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-100'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  filter === 'unread'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-100'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  filter === 'read'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-100'
                }`}
              >
                Đã đọc ({notifications.length - unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors"
              >
                <FaCheckDouble className="w-4 h-4" />
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông báo...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {filter === 'unread' ? 'Không có thông báo chưa đọc' : 
                 filter === 'read' ? 'Không có thông báo đã đọc' : 
                 'Không có thông báo'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' ? 'Bạn sẽ nhận được thông báo ở đây khi có hoạt động mới' : ''}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                  !notification.is_read 
                    ? 'border-l-blue-500 bg-blue-50/30' 
                    : 'border-l-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {notification.link ? (
                      <Link
                        to={notification.link}
                        onClick={() => handleNotificationClick(notification)}
                        className="block hover:text-purple-600 transition-colors"
                      >
                        <h3 className={`text-lg font-bold mb-2 ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {notification.content}
                        </p>
                      </Link>
                    ) : (
                      <div onClick={() => handleNotificationClick(notification)}>
                        <h3 className={`text-lg font-bold mb-2 ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {notification.content}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        {formatTimeAgo(notification.created_at)}
                      </p>

                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id)
                              setNotifications(prev => 
                                prev.map(n => 
                                  n.id === notification.id 
                                    ? { ...n, is_read: true, read_at: new Date().toISOString() }
                                    : n
                                )
                              )
                            }}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-semibold rounded-full transition-colors"
                          >
                            <FaCheck className="w-3 h-3" />
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-full transition-colors"
                        >
                          <FaTrash className="w-3 h-3" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page)
                    loadNotifications(page)
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-purple-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications