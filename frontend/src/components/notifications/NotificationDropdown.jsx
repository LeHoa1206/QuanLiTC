import { useState, useRef, useEffect } from 'react'
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
  FaTimes
} from 'react-icons/fa'
import { useNotifications } from '../../contexts/NotificationContext'

const NotificationDropdown = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    refresh
  } = useNotifications()
  
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <FaShoppingBag className="w-4 h-4 text-blue-500" />
      case 'appointment':
        return <FaCalendarAlt className="w-4 h-4 text-green-500" />
      case 'message':
        return <FaComments className="w-4 h-4 text-purple-500" />
      case 'review':
        return <FaStar className="w-4 h-4 text-yellow-500" />
      case 'system':
        return <FaCog className="w-4 h-4 text-gray-500" />
      default:
        return <FaBell className="w-4 h-4 text-gray-500" />
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
    }
    setIsOpen(false)
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead()
  }

  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation()
    if (window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
      await deleteNotification(id)
    }
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      refresh() // Refresh when opening
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={toggleDropdown}
        className="relative w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 transition-colors group"
        title="Thông báo"
      >
        <FaBell className="text-xl group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Thông báo ({unreadCount})
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Đánh dấu tất cả
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaBell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-semibold">Không có thông báo</p>
                <p className="text-sm">Bạn sẽ nhận được thông báo ở đây</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
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
                          className="block"
                        >
                          <h4 className={`font-semibold text-sm ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </Link>
                      ) : (
                        <div onClick={() => handleNotificationClick(notification)}>
                          <h4 className={`font-semibold text-sm ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {!notification.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="Đánh dấu đã đọc"
                        >
                          <FaCheck className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteNotification(e, notification.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Xóa thông báo"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-purple-600 hover:text-purple-700 font-semibold"
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown